// Hands-on labs (PBQ-style): ordering, matching, firewall rules, log analysis, calculations.
window.SECPLUS = window.SECPLUS || {};

SECPLUS.labsUI = (function () {
  "use strict";

  var S = window.SECPLUS;
  var LAB_XP = 30;
  var TYPE_LABELS = {
    order: "Ordering", match: "Matching", firewall: "Firewall rules", logs: "Log analysis", numeric: "Calculation"
  };

  function ui() { return S.ui; }

  function labDomain(lab) { return ui().domainById(Number(lab.o.charAt(0))); }

  function labsForDomain(domainId) {
    return S.labs.filter(function (l) { return Number(l.o.charAt(0)) === domainId; });
  }

  function statusPill(lab) {
    var r = S.store.state.labs[lab.id];
    if (!r) return "";
    return r.passed
      ? '<span class="pill" style="color:var(--good)">✓ Passed</span>'
      : '<span class="pill">Best ' + r.best + "/" + r.total + "</span>";
  }

  function labCard(lab) {
    var d = labDomain(lab), esc = ui().esc;
    return '<div class="card lab-card" style="border-left:4px solid ' + d.color + '">' +
      '<div class="row"><span class="pill">' + TYPE_LABELS[lab.type] + '</span><span class="pill">' + lab.o + "</span>" + statusPill(lab) + "</div>" +
      '<h3 style="margin:10px 0 6px">' + esc(lab.title) + "</h3>" +
      '<p class="small muted">' + esc(lab.scenario.split("\n")[0]) + "</p>" +
      '<a class="btn primary" href="#/lab/' + lab.id + '">' + (S.store.state.labs[lab.id] ? "Retry lab" : "Start lab") + "</a></div>";
  }

  function list(app) {
    var passed = S.labs.filter(function (l) { var r = S.store.state.labs[l.id]; return r && r.passed; }).length;
    var html = '<div class="page-head"><h1>Hands-on labs</h1><p>Interactive exercises modeled on the exam\'s performance-based questions (PBQs). ' +
      passed + " of " + S.labs.length + " passed · +" + LAB_XP + " XP for each lab you pass.</p></div>";
    S.domains.forEach(function (d) {
      var labs = labsForDomain(d.id);
      if (!labs.length) return;
      html += '<h2 style="margin-top:24px"><span class="dot" style="background:' + d.color + '"></span>' + d.id + ". " + ui().esc(d.name) + "</h2>" +
        '<div class="grid grid-2">' + labs.map(labCard).join("") + "</div>";
    });
    app.innerHTML = html;
  }

  // ---------- Lab runner ----------
  function run(app, id) {
    var lab = S.labs.filter(function (l) { return l.id === id; })[0];
    if (!lab) {
      app.innerHTML = '<div class="card empty"><h1>Lab not found</h1><a class="btn primary" href="#/labs">All labs</a></div>';
      return;
    }
    var esc = ui().esc, d = labDomain(lab);
    var idx = S.labs.indexOf(lab);
    var next = S.labs[idx + 1];

    app.innerHTML = '<div class="lab-wrap"><a href="#/labs" class="small">← All labs</a>' +
      '<div class="card" style="margin-top:10px"><div class="row"><span class="pill"><span class="dot" style="background:' + d.color + '"></span>Domain ' + d.id +
      " · " + lab.o + '</span><span class="pill">' + TYPE_LABELS[lab.type] + "</span>" + statusPill(lab) + "</div>" +
      '<h1 style="margin-top:10px">🧪 ' + esc(lab.title) + '</h1><p class="scenario">' + esc(lab.scenario) + "</p></div>" +
      '<div class="card" style="margin-top:16px"><div id="labBody"></div>' +
      '<div class="row" style="margin-top:18px"><button class="btn primary" id="checkBtn">Check answers</button>' +
      '<button class="btn" id="resetBtn">Reset</button><span class="spacer"></span>' +
      (next ? '<a class="btn" href="#/lab/' + next.id + '">Next lab →</a>' : "") + "</div>" +
      '<div id="labResult"></div></div></div>';

    var body = document.getElementById("labBody");
    var engine = ENGINES[lab.type](lab, body);

    document.getElementById("checkBtn").onclick = function () {
      var r = engine.check();
      var prev = S.store.state.labs[lab.id];
      var firstPass = r.score === r.total && !(prev && prev.passed);
      S.store.completeLab(lab.id, r.score, r.total);
      if (firstPass) ui().gainXP(LAB_XP);
      var ok = r.score === r.total;
      document.getElementById("labResult").innerHTML = '<div class="explanation ' + (ok ? "good" : "bad") + '"><strong>' +
        (ok ? "✅ Lab passed! " + (firstPass ? "+" + LAB_XP + " XP" : "") : "Score: " + r.score + " / " + r.total + " — review the highlighted items and try again.") +
        "</strong>" + (lab.explain ? '<p class="pre">' + esc(lab.explain) + "</p>" : "") + "</div>";
    };
    document.getElementById("resetBtn").onclick = function () {
      document.getElementById("labResult").innerHTML = "";
      engine = ENGINES[lab.type](lab, body);
    };
  }

  // ---------- Engines: each returns { check() -> {score, total} } ----------
  var ENGINES = {};

  ENGINES.order = function (lab, el) {
    var esc = ui().esc;
    var items = ui().shuffle(lab.items);
    // Avoid starting already in the right order.
    if (items.join() === lab.items.join()) items.reverse();
    var checked = false, dragFrom = null;

    function draw() {
      el.innerHTML = '<p class="small muted">Drag items, or use the arrows, to put them in order (first at the top).</p><ol class="order-list">' +
        items.map(function (it, i) {
          var cls = "order-item";
          if (checked) cls += it === lab.items[i] ? " correct" : " wrong";
          return '<li class="' + cls + '" draggable="true" data-i="' + i + '"><span class="grip" aria-hidden="true">⋮⋮</span>' +
            '<span class="order-text">' + esc(it) + "</span>" +
            '<button class="icon-btn" data-up="' + i + '" aria-label="Move up"' + (i === 0 ? " disabled" : "") + ">▲</button>" +
            '<button class="icon-btn" data-down="' + i + '" aria-label="Move down"' + (i === items.length - 1 ? " disabled" : "") + ">▼</button></li>";
        }).join("") + "</ol>";
    }

    function move(from, to) {
      if (to < 0 || to >= items.length) return;
      var it = items.splice(from, 1)[0];
      items.splice(to, 0, it);
      checked = false;
      draw();
    }

    el.onclick = function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.up !== undefined) move(Number(b.dataset.up), Number(b.dataset.up) - 1);
      if (b.dataset.down !== undefined) move(Number(b.dataset.down), Number(b.dataset.down) + 1);
    };
    el.ondragstart = function (e) {
      var li = e.target.closest("li");
      if (!li) return;
      dragFrom = Number(li.dataset.i);
      e.dataTransfer.effectAllowed = "move";
      li.classList.add("dragging");
    };
    el.ondragover = function (e) { if (dragFrom !== null) e.preventDefault(); };
    el.ondrop = function (e) {
      e.preventDefault();
      var li = e.target.closest("li");
      if (li && dragFrom !== null) move(dragFrom, Number(li.dataset.i));
      dragFrom = null;
    };
    el.ondragend = function () { dragFrom = null; draw(); };

    draw();
    return {
      check: function () {
        checked = true;
        draw();
        var score = items.filter(function (it, i) { return it === lab.items[i]; }).length;
        return { score: score, total: items.length };
      }
    };
  };

  ENGINES.match = function (lab, el) {
    var esc = ui().esc;
    var items = ui().shuffle(lab.items);
    var picks = items.map(function () { return ""; });
    var checked = false;

    function draw() {
      el.innerHTML = '<div class="match-list">' + items.map(function (it, i) {
        var cls = "match-row";
        if (checked) cls += picks[i] === it[1] ? " correct" : " wrong";
        return '<div class="' + cls + '"><span class="match-text">' + esc(it[0]) + "</span>" +
          '<select data-i="' + i + '" aria-label="Answer for: ' + esc(it[0]) + '"><option value="">— choose —</option>' +
          lab.categories.map(function (c) {
            return '<option' + (picks[i] === c ? " selected" : "") + ">" + esc(c) + "</option>";
          }).join("") + "</select>" +
          (checked && picks[i] !== it[1] ? '<span class="small correction">✓ ' + esc(it[1]) + "</span>" : "") + "</div>";
      }).join("") + "</div>";
    }

    el.onchange = function (e) {
      if (e.target.dataset.i === undefined) return;
      picks[Number(e.target.dataset.i)] = e.target.value;
      if (checked) { checked = false; draw(); }
    };

    draw();
    return {
      check: function () {
        checked = true;
        draw();
        var score = items.filter(function (it, i) { return picks[i] === it[1]; }).length;
        return { score: score, total: items.length };
      }
    };
  };

  ENGINES.firewall = function (lab, el) {
    var esc = ui().esc;
    var rules = lab.start.map(function (r) { return r.slice(); });
    var results = null;
    var FIELDS = [
      { key: 0, label: "Action", options: ["ALLOW", "DENY"] },
      { key: 1, label: "Source", options: ["ANY"].concat(lab.hosts) },
      { key: 2, label: "Destination", options: ["ANY"].concat(lab.hosts) },
      { key: 3, label: "Protocol", options: ["ANY", "TCP", "UDP"] },
      { key: 4, label: "Port", options: ["ANY"].concat(lab.ports) }
    ];

    function matches(ruleVal, val) {
      return ruleVal === "ANY" || ruleVal === val || (lab.groups[ruleVal] || []).indexOf(val) !== -1;
    }

    function evaluate(t) {
      for (var i = 0; i < rules.length; i++) {
        var r = rules[i];
        if (matches(r[1], t[0]) && matches(r[2], t[1]) && matches(r[3], t[2]) && matches(r[4], t[3])) {
          return { action: r[0], rule: i + 1 };
        }
      }
      return { action: "DENY", rule: "implicit" };
    }

    function draw() {
      var html = '<p class="small muted">Rules are evaluated top to bottom; the first match wins.</p>' +
        '<div class="table-wrap"><table class="data fw-table"><thead><tr><th>#</th>' +
        FIELDS.map(function (f) { return "<th>" + f.label + "</th>"; }).join("") + "<th></th></tr></thead><tbody>";
      rules.forEach(function (r, i) {
        html += "<tr><td>" + (i + 1) + "</td>" + FIELDS.map(function (f) {
          return '<td><select data-r="' + i + '" data-f="' + f.key + '" aria-label="Rule ' + (i + 1) + " " + f.label + '">' +
            f.options.map(function (o) { return "<option" + (r[f.key] === o ? " selected" : "") + ">" + esc(o) + "</option>"; }).join("") +
            "</select></td>";
        }).join("") +
          '<td class="nowrap"><button class="icon-btn" data-up="' + i + '"' + (i === 0 ? " disabled" : "") + ' aria-label="Move rule up">▲</button>' +
          '<button class="icon-btn" data-down="' + i + '"' + (i === rules.length - 1 ? " disabled" : "") + ' aria-label="Move rule down">▼</button>' +
          '<button class="icon-btn danger" data-del="' + i + '" aria-label="Delete rule">✕</button></td></tr>';
      });
      html += '<tr class="implicit"><td>—</td><td>DENY</td><td>ANY</td><td>ANY</td><td>ANY</td><td>ANY</td><td class="small muted">implicit</td></tr>' +
        '</tbody></table></div><button class="btn" id="addRule" style="margin-top:10px">+ Add rule</button>';

      html += '<h3 style="margin-top:20px">Test traffic</h3><div class="table-wrap"><table class="data"><thead><tr><th>Source</th><th>Destination</th><th>Proto/Port</th><th>Expected</th>' +
        (results ? "<th>Result</th>" : "") + "</tr></thead><tbody>" +
        lab.tests.map(function (t, i) {
          var res = results && results[i];
          return "<tr" + (res ? ' class="' + (res.action === t[4] ? "row-good" : "row-bad") + '"' : "") + "><td>" + esc(t[0]) + "</td><td>" + esc(t[1]) +
            "</td><td>" + t[2] + "/" + t[3] + "</td><td>" + t[4] + "</td>" +
            (res ? "<td>" + (res.action === t[4] ? "✅ " : "❌ ") + res.action + ' <span class="small muted">(rule ' + res.rule + ")</span></td>" : "") + "</tr>";
        }).join("") + "</tbody></table></div>";
      el.innerHTML = html;
    }

    el.onchange = function (e) {
      var s = e.target;
      if (s.dataset.r === undefined) return;
      rules[Number(s.dataset.r)][Number(s.dataset.f)] = s.value;
      results = null;
      draw();
    };
    el.onclick = function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      if (b.id === "addRule") rules.push(["ALLOW", "ANY", "ANY", "TCP", "ANY"]);
      else if (b.dataset.del !== undefined) rules.splice(Number(b.dataset.del), 1);
      else if (b.dataset.up !== undefined) swap(Number(b.dataset.up), Number(b.dataset.up) - 1);
      else if (b.dataset.down !== undefined) swap(Number(b.dataset.down), Number(b.dataset.down) + 1);
      else return;
      results = null;
      draw();
    };

    function swap(a, b) {
      if (b < 0 || b >= rules.length) return;
      var t = rules[a]; rules[a] = rules[b]; rules[b] = t;
    }

    draw();
    return {
      check: function () {
        results = lab.tests.map(evaluate);
        draw();
        var score = lab.tests.filter(function (t, i) { return results[i].action === t[4]; }).length;
        return { score: score, total: lab.tests.length };
      }
    };
  };

  ENGINES.logs = function (lab, el) {
    var esc = ui().esc;
    var selected = [];
    var answer = [];
    var checked = false;

    function draw() {
      el.innerHTML = '<p class="small muted">Click lines to select them.</p><div class="log-view" role="listbox" aria-multiselectable="true">' +
        lab.lines.map(function (line, i) {
          var cls = "log-line";
          var isSel = selected.indexOf(i) !== -1, isBad = lab.bad.indexOf(i) !== -1;
          if (isSel) cls += " selected";
          if (checked) {
            if (isBad && isSel) cls += " hit";
            else if (isBad) cls += " missed";
            else if (isSel) cls += " false-pos";
          }
          return '<div class="' + cls + '" data-i="' + i + '" role="option" aria-selected="' + isSel + '" tabindex="0"><span class="ln">' + (i + 1) + "</span>" + esc(line) + "</div>";
        }).join("") + "</div>" +
        (checked ? '<p class="small muted">Legend: <span class="lg hit">caught</span> <span class="lg missed">missed</span> <span class="lg false-pos">not malicious</span></p>' : "") +
        '<div id="logQ" style="margin-top:18px"></div>';
      ui().renderQuestion(document.getElementById("logQ"), {
        question: lab.question,
        showFeedback: false,
        preselected: answer,
        locked: checked,
        reveal: checked,
        onSelect: function (sel) { answer = sel; },
        onAnswer: function () {}
      });
    }

    function toggle(i) {
      if (checked) { checked = false; }
      var k = selected.indexOf(i);
      if (k === -1) selected.push(i); else selected.splice(k, 1);
      draw();
    }

    el.onclick = function (e) {
      var line = e.target.closest(".log-line");
      if (line) toggle(Number(line.dataset.i));
    };
    el.onkeydown = function (e) {
      var line = e.target.closest(".log-line");
      if (line && (e.key === " " || e.key === "Enter")) { e.preventDefault(); toggle(Number(line.dataset.i)); }
    };

    draw();
    return {
      check: function () {
        checked = true;
        draw();
        var hits = selected.filter(function (i) { return lab.bad.indexOf(i) !== -1; }).length;
        var falsePos = selected.length - hits;
        var lineScore = Math.max(0, hits - falsePos);
        var qOk = answer.length > 0 && S.ui.isCorrect(lab.question, answer);
        return { score: lineScore + (qOk ? 1 : 0), total: lab.bad.length + 1 };
      }
    };
  };

  ENGINES.numeric = function (lab, el) {
    var esc = ui().esc;
    el.innerHTML = '<div class="numeric-list">' + lab.fields.map(function (f, i) {
      return '<label class="numeric-row"><span>' + esc(f.label) + '</span><input type="text" inputmode="decimal" data-i="' + i + '" autocomplete="off"><span class="numeric-fb" data-fb="' + i + '"></span></label>';
    }).join("") + "</div>";

    function parse(v) { return parseFloat(String(v).replace(/[$,%\s]/g, "")); }

    return {
      check: function () {
        var score = 0;
        lab.fields.forEach(function (f, i) {
          var input = el.querySelector('[data-i="' + i + '"]');
          var v = parse(input.value);
          var ok = !isNaN(v) && Math.abs(v - f.answer) <= Math.max(0.01, Math.abs(f.answer) * 0.005);
          if (ok) score++;
          input.classList.toggle("good", ok);
          input.classList.toggle("bad", !ok);
          el.querySelector('[data-fb="' + i + '"]').textContent = ok ? "✅" : "❌ " + f.answer.toLocaleString();
        });
        return { score: score, total: lab.fields.length };
      }
    };
  };

  return { list: list, run: run, labsForDomain: labsForDomain, LAB_XP: LAB_XP };
})();
