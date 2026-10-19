// Security+ Study Lab — single-page app with hash routing.
(function () {
  "use strict";

  var S = window.SECPLUS;
  var store = S.store;
  var app = document.getElementById("app");
  var cleanups = [];

  var XP = { lessonExercise: 10, lessonComplete: 50, quizCorrect: 5, cardReview: 2, portCorrect: 3 };

  // ---------- Helpers ----------
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // Returns a copy of the question with its choices in random order (answer indexes remapped).
  function withShuffledChoices(q) {
    var order = shuffle(q.c.map(function (_, i) { return i; }));
    var copy = Object.assign({}, q);
    copy.c = order.map(function (i) { return q.c[i]; });
    copy.a = Array.isArray(q.a)
      ? q.a.map(function (i) { return order.indexOf(i); })
      : order.indexOf(q.a);
    return copy;
  }

  function stripTags(html) { return html.replace(/<[^>]+>/g, ""); }

  function domainById(id) {
    return S.domains.filter(function (d) { return d.id === id; })[0];
  }

  function allObjectives() {
    var out = [];
    S.domains.forEach(function (d) {
      d.objectives.forEach(function (o) { out.push({ domain: d, obj: o }); });
    });
    return out;
  }

  function findObjective(id) {
    return allObjectives().filter(function (x) { return x.obj.id === id; })[0];
  }

  function nextLesson() {
    var list = allObjectives();
    for (var i = 0; i < list.length; i++) {
      if (!store.state.lessons[list[i].obj.id]) return list[i];
    }
    return null;
  }

  function domainLessonProgress(d) {
    var done = d.objectives.filter(function (o) { return store.state.lessons[o.id]; }).length;
    return { done: done, total: d.objectives.length, pct: Math.round(done / d.objectives.length * 100) };
  }

  function domainAccuracy(domainId) {
    var seen = 0, correct = 0;
    S.questions.forEach(function (q) {
      if (domainId && q.d !== domainId) return;
      var s = store.state.questions[q.id];
      if (s) { seen += s.seen; correct += s.correct; }
    });
    return seen ? Math.round(correct / seen * 100) : null;
  }

  function isCorrect(q, selected) {
    var ans = Array.isArray(q.a) ? q.a.slice().sort() : [q.a];
    var sel = selected.slice().sort();
    return ans.length === sel.length && ans.every(function (v, i) { return v === sel[i]; });
  }

  function answerIndexes(q) { return Array.isArray(q.a) ? q.a : [q.a]; }

  function progressBar(pct, color) {
    return '<div class="progress"><span style="width:' + pct + '%;' + (color ? "background:" + color : "") + '"></span></div>';
  }

  var toastTimer;
  function toast(msg) {
    var el = document.getElementById("toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast";
      el.className = "toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove("show"); }, 1800);
  }

  function gainXP(n) {
    if (!n) return;
    var before = store.level();
    store.addXP(n);
    updateXPBadge();
    if (store.level() > before) toast("Level up! You reached level " + store.level() + " 🎉");
    else toast("+" + n + " XP");
  }

  function updateXPBadge() {
    var el = document.getElementById("xpBadge");
    if (el) el.innerHTML = "⚡ " + store.state.xp + " XP · 🔥 " + store.streak();
  }

  function onKey(handler) {
    document.addEventListener("keydown", handler);
    cleanups.push(function () { document.removeEventListener("keydown", handler); });
  }

  function typingInField(e) {
    var t = e.target.tagName;
    return t === "INPUT" || t === "SELECT" || t === "TEXTAREA";
  }

  // Builds term-matching exercises from flashcards related to a lesson.
  function generatedExercises(domain, obj, count) {
    var text = stripTags(obj.points.join(" ")).toLowerCase();
    var pool = S.flashcards.filter(function (c) {
      return c.domain === domain.id && c.back.toLowerCase().indexOf(c.front.toLowerCase()) === -1;
    });
    var related = pool.filter(function (c) {
      var key = c.front.split(/ \(| \/ | vs\. /)[0].toLowerCase();
      return key.length > 2 && text.indexOf(key) !== -1;
    });
    var chosen = shuffle(related).slice(0, count);
    if (chosen.length < count) {
      chosen = chosen.concat(shuffle(pool.filter(function (c) { return chosen.indexOf(c) === -1; })).slice(0, count - chosen.length));
    }
    return chosen.map(function (card) {
      var distractors = shuffle(pool.filter(function (c) { return c !== card; })).slice(0, 3);
      var choices = shuffle([card].concat(distractors));
      return {
        id: "gen:" + card.id,
        generated: true,
        q: "Which term matches this description?\n\n“" + card.back + "”",
        c: choices.map(function (c) { return c.front; }),
        a: choices.indexOf(card),
        e: "“" + card.front + "” — " + card.back
      };
    });
  }

  // ---------- Reusable question renderer ----------
  // opts: { question, onAnswer(correct, selected), showFeedback: bool, preselected: [] , locked: bool }
  function renderQuestion(container, opts) {
    var q = opts.question;
    var multi = Array.isArray(q.a);
    var selected = (opts.preselected || []).slice();
    var locked = !!opts.locked;

    function draw(reveal) {
      var html = '<div class="question-text">' + esc(q.q) + "</div>";
      if (multi) html += '<p class="small muted">Select ' + q.a.length + " answers.</p>";
      html += '<div class="choices">';
      q.c.forEach(function (choice, i) {
        var cls = "choice";
        if (selected.indexOf(i) !== -1) cls += " selected";
        if (reveal) {
          if (answerIndexes(q).indexOf(i) !== -1) cls += " correct";
          else if (selected.indexOf(i) !== -1) cls += " wrong";
        }
        html += '<button class="' + cls + '" data-i="' + i + '"' + (locked || reveal ? " disabled" : "") + '>' +
          '<span class="key">' + String.fromCharCode(65 + i) + "</span><span>" + esc(choice) + "</span></button>";
      });
      html += "</div>";
      if (!reveal && !locked && opts.showFeedback !== false) {
        html += '<div class="row" style="margin-top:16px"><button class="btn primary" data-act="submit"' +
          (selected.length ? "" : " disabled") + ">Submit answer</button>" +
          '<span class="small muted">Tip: press <span class="kbd">A</span>–<span class="kbd">' +
          String.fromCharCode(64 + q.c.length) + '</span> then <span class="kbd">Enter</span></span></div>';
      }
      if (reveal) {
        var ok = isCorrect(q, selected);
        html += '<div class="explanation ' + (ok ? "good" : "bad") + '"><strong>' +
          (ok ? "✅ Correct!" : "❌ Not quite.") + "</strong> " + esc(q.e) + "</div>";
      }
      container.innerHTML = html;
    }

    function toggle(i) {
      if (locked) return;
      if (multi) {
        var idx = selected.indexOf(i);
        if (idx === -1) {
          if (selected.length >= q.a.length) selected.shift();
          selected.push(i);
        } else selected.splice(idx, 1);
      } else {
        selected = [i];
      }
      draw(false);
      if (opts.showFeedback === false && opts.onSelect) opts.onSelect(selected.slice());
    }

    function submit() {
      if (!selected.length || locked) return;
      locked = true;
      draw(true);
      opts.onAnswer(isCorrect(q, selected), selected.slice());
    }

    container.onclick = function (e) {
      var b = e.target.closest("button");
      if (!b || b.disabled) return;
      if (b.dataset.i !== undefined) toggle(Number(b.dataset.i));
      else if (b.dataset.act === "submit") submit();
    };

    draw(opts.reveal || false);

    return {
      key: function (e) {
        if (locked) return false;
        var k = e.key.toUpperCase();
        var idx = k.charCodeAt(0) - 65;
        if (k.length === 1 && idx >= 0 && idx < q.c.length) { toggle(idx); return true; }
        if (e.key === "Enter" && opts.showFeedback !== false && selected.length) { submit(); return true; }
        return false;
      }
    };
  }

  S.ui = {
    esc: esc, shuffle: shuffle, gainXP: gainXP, domainById: domainById,
    renderQuestion: renderQuestion, isCorrect: isCorrect
  };

  // ---------- Views ----------
  var views = {};

  views.dashboard = function () {
    var st = store.state;
    var next = nextLesson();
    var lessonsDone = Object.keys(st.lessons).length;
    var totalLessons = allObjectives().length;
    var due = S.flashcards.filter(function (c) { return !store.isNewCard(c.id) && store.cardDue(c.id); }).length;
    var acc = domainAccuracy(null);
    var todayXP = store.todayXP();
    var goalPct = Math.min(100, Math.round(todayXP / store.DAILY_GOAL * 100));
    var lvl = store.level();
    var lvlPct = Math.round((st.xp % store.XP_PER_LEVEL) / store.XP_PER_LEVEL * 100);

    var html = '<section class="hero card">' +
      '<div><h1>' + (lessonsDone ? "Welcome back! 👋" : "Start your Security+ journey 🚀") + "</h1>" +
      '<p class="muted">' + (next
        ? "Up next: <strong>" + next.obj.id + " " + esc(next.obj.title) + "</strong> in " + esc(next.domain.name) + "."
        : "You've completed every lesson. Keep sharp with practice and exam simulations!") + "</p>" +
      '<div class="row" style="margin-top:14px">' +
      (next ? '<a class="btn primary" href="#/lesson/' + next.obj.id + '">' + (lessonsDone ? "Continue learning" : "Start first lesson") + " →</a>" : '<a class="btn primary" href="#/exam">Take an exam simulation</a>') +
      '<a class="btn" href="#/practice/daily">Daily practice (5 questions)</a></div></div>' +
      '<div class="goal"><div class="ring" style="--p:' + goalPct + '"><span>' + todayXP + "<small>/" + store.DAILY_GOAL + " XP</small></span></div>" +
      '<div class="small muted center">Daily goal' + (goalPct >= 100 ? " ✅" : "") + "</div></div>" +
      "</section>";

    html += '<div class="grid grid-4" style="margin-top:16px">' +
      statTile("Level " + lvl, st.xp + " XP total", progressBar(lvlPct)) +
      statTile(store.streak() + " 🔥", "day streak") +
      statTile(lessonsDone + "/" + totalLessons, "chapters completed", progressBar(Math.round(lessonsDone / totalLessons * 100))) +
      statTile(acc === null ? "—" : acc + "%", "question accuracy") +
      "</div>";

    html += '<div class="grid grid-2" style="margin-top:16px">';
    html += '<div class="card"><h2>Course progress</h2>';
    S.domains.forEach(function (d) {
      var p = domainLessonProgress(d);
      var a = domainAccuracy(d.id);
      html += '<div class="domain-row"><a href="#/course/' + d.id + '" class="plain"><span class="dot" style="background:' + d.color + '"></span>' +
        d.id + ". " + esc(d.name) + '</a><span class="small muted">' + p.done + "/" + p.total +
        (a === null ? "" : " · " + a + "% acc") + "</span>" + progressBar(p.pct, d.color) + "</div>";
    });
    html += "</div>";

    html += '<div class="card"><h2>Last 14 days</h2>' + activityChart() +
      '<div class="row" style="margin-top:14px"><a class="btn" href="#/practice/flashcards">Review flashcards' +
      (due ? ' <span class="pill">' + due + " due</span>" : "") + "</a>" +
      '<a class="btn" href="#/review">Review mistakes</a></div></div>';
    html += "</div>";

    var info = S.examInfo;
    html += '<div class="grid grid-2" style="margin-top:16px">' +
      '<div class="card"><h2>About the exam</h2><table class="data"><tbody>' +
      "<tr><th>Exam code</th><td>" + info.code + "</td></tr>" +
      "<tr><th>Questions</th><td>Up to " + info.maxQuestions + "</td></tr>" +
      "<tr><th>Time</th><td>" + info.minutes + " minutes</td></tr>" +
      "<tr><th>Passing score</th><td>" + info.passingScore + "</td></tr>" +
      "<tr><th>Format</th><td>" + info.questionTypes + "</td></tr>" +
      "</tbody></table></div>" +
      '<div class="card"><h2>Your data</h2><p class="small muted">Progress is stored in this browser. Export it to back it up or move it to another device.</p>' +
      '<div class="row"><button class="btn" id="exportBtn">Export progress</button>' +
      '<label class="btn">Import<input type="file" id="importFile" accept="application/json" hidden></label>' +
      '<button class="btn bad" id="resetBtn">Reset</button></div></div></div>';

    app.innerHTML = html;

    document.getElementById("exportBtn").onclick = function () {
      var blob = new Blob([store.exportJSON()], { type: "application/json" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "secplus-progress-" + store.dayKey() + ".json";
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    };
    document.getElementById("importFile").onchange = function (e) {
      var file = e.target.files[0];
      if (!file) return;
      file.text().then(function (text) {
        try { store.importJSON(text); toast("Progress imported"); route(); updateXPBadge(); }
        catch (err) { alert("Could not import: " + err.message); }
      });
    };
    document.getElementById("resetBtn").onclick = function () {
      if (confirm("Reset ALL progress, XP and flashcard history? This cannot be undone.")) {
        store.reset(); updateXPBadge(); route();
      }
    };
  };

  function statTile(value, label, extra) {
    return '<div class="card stat"><div class="value">' + value + '</div><div class="label">' + label + "</div>" +
      (extra ? '<div style="margin-top:8px">' + extra + "</div>" : "") + "</div>";
  }

  function activityChart() {
    var days = [];
    for (var i = 13; i >= 0; i--) {
      var d = new Date();
      d.setDate(d.getDate() - i);
      days.push({ key: store.dayKey(d), label: d.toLocaleDateString(undefined, { weekday: "narrow" }), xp: store.state.activity[store.dayKey(d)] || 0 });
    }
    var max = Math.max(store.DAILY_GOAL, Math.max.apply(null, days.map(function (x) { return x.xp; })));
    return '<div class="bars">' + days.map(function (x) {
      return '<div class="bar" title="' + x.key + ": " + x.xp + ' XP"><span style="height:' + Math.round(x.xp / max * 100) + '%"' +
        (x.xp >= store.DAILY_GOAL ? ' class="met"' : "") + '></span><em>' + x.label + "</em></div>";
    }).join("") + "</div>";
  }

  // ----- Courses -----
  views.courses = function () {
    var html = '<div class="page-head"><h1>Courses</h1><p>Five courses — one per SY0-701 domain. Each lesson mixes short concept slides with hands-on exercises.</p></div>';
    html += '<div class="grid grid-2">';
    S.domains.forEach(function (d) {
      var p = domainLessonProgress(d);
      var next = d.objectives.filter(function (o) { return !store.state.lessons[o.id]; })[0];
      html += '<div class="card course-card" style="border-top:4px solid ' + d.color + '">' +
        '<div class="row"><span class="pill">Domain ' + d.id + '</span><span class="pill">' + d.weight + "% of exam</span></div>" +
        "<h2 style=\"margin-top:10px\">" + esc(d.name) + "</h2>" +
        '<p class="small muted">' + d.objectives.length + " lessons · " + S.questions.filter(function (q) { return q.d === d.id; }).length + " practice questions</p>" +
        progressBar(p.pct, d.color) +
        '<div class="row" style="margin-top:14px"><a class="btn" href="#/course/' + d.id + '">View lessons</a>' +
        (next ? '<a class="btn primary" href="#/lesson/' + next.id + '">' + (p.done ? "Continue" : "Start") + "</a>" : '<span class="pill" style="color:var(--good)">✓ Complete</span>') +
        "</div></div>";
    });
    html += "</div>";
    app.innerHTML = html;
  };

  views.course = function (id) {
    var d = domainById(Number(id));
    if (!d) return notFound();
    var p = domainLessonProgress(d);
    var cp = store.state.checkpoints[d.id];
    var html = '<div class="page-head"><a href="#/courses" class="small">← All courses</a>' +
      '<h1 style="margin-top:8px"><span class="dot" style="background:' + d.color + '"></span>' + d.id + ". " + esc(d.name) + "</h1>" +
      "<p>" + d.weight + "% of the exam · " + p.done + " of " + p.total + " chapters complete</p></div>";
    html += '<div class="lesson-list">';
    d.objectives.forEach(function (o, i) {
      var l = store.state.lessons[o.id];
      var ch = S.chapters[o.id];
      html += '<div class="card lesson-item">' +
        '<div class="lesson-num' + (l ? " done" : "") + '">' + (l ? "✓" : i + 1) + "</div>" +
        '<div class="lesson-body"><div class="small muted">Chapter ' + o.id +
        (ch ? " · " + ch.sections.length + " sections · " + (ch.sections.length + 5) + " questions" : "") + "</div><strong>" + esc(o.title) + "</strong>" +
        (l ? '<div class="small muted">Best score: ' + l.score + "/" + l.total + "</div>" : "") +
        (ch ? '<p class="small muted chapter-blurb">' + ch.overview + "</p>" : "") + "</div>" +
        '<div class="lesson-actions"><a class="btn ' + (l ? "" : "primary") + '" href="#/lesson/' + o.id + '">' + (l ? "Replay" : "Start lesson") + "</a>" +
        '<a class="btn ghost" href="#/read/' + o.id + '">📖 Read</a></div></div>';
    });
    html += '<div class="card lesson-item checkpoint-card">' +
      '<div class="lesson-num' + (cp && cp.best >= 80 ? " done" : "") + '">🏁</div>' +
      '<div class="lesson-body"><div class="small muted">Domain checkpoint · 15 questions</div><strong>Domain ' + d.id + " review</strong>" +
      '<p class="small muted">A mixed review of every chapter in this domain. Score 80%+ to earn the domain badge.' +
      (cp ? " Best: " + cp.best + "%" : "") + "</p></div>" +
      '<div class="lesson-actions"><a class="btn primary" href="#/checkpoint/' + d.id + '">' + (cp ? "Retake" : "Take checkpoint") + "</a></div></div>";
    html += "</div>";
    var labs = S.labsUI.labsForDomain(d.id);
    if (labs.length) {
      html += '<h2 style="margin-top:28px">🧪 Hands-on labs</h2><div class="lesson-list">' + labs.map(function (lab) {
        var r = store.state.labs[lab.id];
        return '<div class="card lesson-item"><div class="lesson-num' + (r && r.passed ? " done" : "") + '">' + (r && r.passed ? "✓" : "🧪") + "</div>" +
          '<div class="lesson-body"><div class="small muted">Objective ' + lab.o + "</div><strong>" + esc(lab.title) + "</strong></div>" +
          '<a class="btn" href="#/lab/' + lab.id + '">' + (r ? "Retry" : "Start") + "</a></div>";
      }).join("") + "</div>";
    }
    app.innerHTML = html;
  };

  // ----- Chapter plan: sections paired with the most relevant knowledge-check questions -----
  function words(text) {
    var out = {};
    stripTags(text).toLowerCase().replace(/[^a-z0-9/.-]+/g, " ").split(" ").forEach(function (w) {
      if (w.length > 3) out[w] = true;
    });
    return out;
  }

  function chapterPlan(o) {
    var ch = S.chapters[o.id];
    var pool = shuffle(S.questions.filter(function (q) { return q.o === o.id; }));
    // Unseen questions first so replays show new material.
    pool.sort(function (a, b) { return (store.state.questions[a.id] ? 1 : 0) - (store.state.questions[b.id] ? 1 : 0); });
    var checks = [];
    if (ch) {
      ch.sections.forEach(function (sec) {
        var sw = words(sec.h + " " + sec.html);
        var best = -1, bestScore = -1;
        pool.forEach(function (q, i) {
          var qw = words(q.q + " " + q.c.join(" ") + " " + q.e);
          var s = 0;
          for (var w in qw) if (sw[w]) s++;
          if (s > bestScore) { bestScore = s; best = i; }
        });
        checks.push(best === -1 ? null : pool.splice(best, 1)[0]);
      });
    }
    return { chapter: ch, checks: checks, rest: pool, scenario: S.scenarios[o.id] };
  }

  function scenarioQuestion(o, sc) {
    return { id: "scn:" + o.id, generated: true, q: sc.q, c: sc.c, a: sc.a, e: "Read the step-by-step walkthrough below." };
  }

  // ----- Lesson player: read a section, answer a check, repeat; then scenario, tips, chapter quiz -----
  views.lesson = function (objId) {
    var found = findObjective(objId);
    if (!found) return notFound();
    var d = found.domain, o = found.obj;
    var plan = chapterPlan(o);
    var ch = plan.chapter;
    var steps = [];

    if (ch) {
      steps.push({ type: "intro" });
      ch.sections.forEach(function (sec, i) {
        steps.push({ type: "read", i: i });
        if (plan.checks[i]) steps.push({ type: "exercise", label: "Check your understanding", q: withShuffledChoices(plan.checks[i]) });
      });
      if (plan.scenario) steps.push({ type: "exercise", label: "Worked scenario", q: withShuffledChoices(scenarioQuestion(o, plan.scenario)), walk: plan.scenario.walk });
      steps.push({ type: "tips" });
      var quiz = plan.rest.slice(0, 3);
      if (quiz.length < 3) quiz = quiz.concat(generatedExercises(d, o, 3 - quiz.length));
      quiz.forEach(function (q, i) { steps.push({ type: "exercise", label: "Chapter quiz " + (i + 1) + "/" + quiz.length, q: q.generated ? q : withShuffledChoices(q) }); });
    } else {
      for (var i = 0; i < o.points.length; i += 3) steps.push({ type: "concept", points: o.points.slice(i, i + 3) });
      plan.rest.slice(0, 4).forEach(function (q) { steps.push({ type: "exercise", label: "Exercise", q: withShuffledChoices(q) }); });
    }

    var totalEx = steps.filter(function (s) { return s.type === "exercise"; }).length;
    var pos = 0, score = 0, xpEarned = 0;
    var answered = false, qHandle = null;

    function render() {
      answered = false;
      qHandle = null;
      var step = steps[pos];
      var pct = Math.round(pos / steps.length * 100);
      var html = '<div class="lesson-top"><a href="#/course/' + d.id + '" class="small">✕ Exit</a>' +
        '<div class="lesson-progress">' + progressBar(pct, d.color) + "</div>" +
        '<span class="small muted">' + (pos + 1) + "/" + steps.length + "</span></div>";
      html += '<div class="card lesson-card">';
      var next = '<div class="row" style="margin-top:22px"><span class="spacer"></span><button class="btn primary" id="nextBtn">Continue →</button></div>';
      if (step.type === "intro") {
        html += '<div class="eyebrow">Chapter ' + o.id + " · " + esc(d.name) + "</div><h1>" + esc(o.title) + "</h1>" +
          '<p class="lead">' + ch.overview + "</p>" +
          '<div class="toc"><div class="small muted">In this chapter</div><ol>' +
          ch.sections.map(function (s) { return "<li>" + s.h + "</li>"; }).join("") +
          (plan.scenario ? "<li>Worked scenario</li>" : "") + "<li>Exam tips &amp; traps</li><li>Chapter quiz</li></ol></div>" +
          '<p class="small muted">After each section you\'ll answer a question about it before moving on.</p>' + next;
      } else if (step.type === "read") {
        var sec = ch.sections[step.i];
        html += '<div class="eyebrow">' + o.id + " · Section " + (step.i + 1) + " of " + ch.sections.length + "</div><h2>" + sec.h + "</h2>" +
          '<div class="prose">' + sec.html + "</div>" + next;
      } else if (step.type === "tips") {
        html += '<div class="eyebrow">' + o.id + " · Before the quiz</div><h2>Exam tips &amp; common traps</h2>" +
          '<div class="tips-grid"><div class="tip-box good"><h3>✅ Exam tips</h3><ul>' + ch.tips.map(function (t) { return "<li>" + t + "</li>"; }).join("") + "</ul></div>" +
          '<div class="tip-box bad"><h3>⚠️ Common traps</h3><ul>' + ch.traps.map(function (t) { return "<li>" + t + "</li>"; }).join("") + "</ul></div></div>" + next;
      } else if (step.type === "concept") {
        html += '<div class="eyebrow">' + o.id + '</div><h2>' + esc(o.title) + '</h2><ul class="concepts">' +
          step.points.map(function (pt) { return "<li>" + pt + "</li>"; }).join("") + "</ul>" + next;
      } else {
        html += '<div class="eyebrow">' + o.id + " · " + step.label + ' <span class="pill">+' + XP.lessonExercise + ' XP</span></div><div id="qbox" style="margin-top:10px"></div>' +
          '<div id="walk"></div><div class="row" style="margin-top:16px"><span class="spacer"></span><button class="btn primary" id="nextBtn" hidden>Continue →</button></div>';
      }
      html += "</div>";
      app.innerHTML = html;

      var nextBtn = document.getElementById("nextBtn");
      nextBtn.onclick = advance;
      if (step.type === "exercise") {
        qHandle = renderQuestion(document.getElementById("qbox"), {
          question: step.q,
          onAnswer: function (correct) {
            answered = true;
            if (!step.q.generated) store.recordAnswer(step.q.id, correct);
            if (correct) { score++; xpEarned += XP.lessonExercise; gainXP(XP.lessonExercise); }
            if (step.walk) document.getElementById("walk").innerHTML = '<div class="walkthrough"><h3>Walkthrough</h3>' + step.walk + "</div>";
            nextBtn.hidden = false;
            nextBtn.focus();
          }
        });
      } else {
        nextBtn.focus();
      }
    }

    function advance() {
      pos++;
      if (pos >= steps.length) return finish();
      render();
      window.scrollTo(0, 0);
    }

    function finish() {
      var firstTime = !store.state.lessons[o.id];
      store.completeLesson(o.id, score, totalEx);
      if (firstTime) { xpEarned += XP.lessonComplete; gainXP(XP.lessonComplete); }
      var nxt = nextLesson();
      var pct = Math.round(score / totalEx * 100);
      var domainDone = domainLessonProgress(d).done === d.objectives.length;
      app.innerHTML = '<div class="card lesson-card center">' +
        '<div class="celebrate">' + (pct >= 70 ? "🏆" : "📘") + "</div>" +
        "<h1>Chapter complete!</h1><p class=\"muted\">" + o.id + " " + esc(o.title) + "</p>" +
        '<div class="grid grid-3" style="margin:20px 0">' +
        statTile(score + "/" + totalEx, "questions correct") +
        statTile("+" + xpEarned, "XP earned") +
        statTile(store.streak() + " 🔥", "day streak") + "</div>" +
        (pct < 70 ? '<p class="small muted">Tip: re-read the chapter in reading mode, then replay the lesson. New questions are served first.</p>' : "") +
        '<div class="row" style="justify-content:center">' +
        '<a class="btn" href="#/read/' + o.id + '">📖 Re-read</a>' +
        '<a class="btn" href="#/lesson/' + o.id + '">Replay</a>' +
        (domainDone ? '<a class="btn primary" href="#/checkpoint/' + d.id + '">🏁 Domain ' + d.id + " checkpoint →</a>" : "") +
        (nxt && !domainDone ? '<a class="btn primary" href="#/lesson/' + nxt.obj.id + '">Next: ' + nxt.obj.id + " →</a>" : "") +
        (!nxt && !domainDone ? '<a class="btn primary" href="#/exam">Take the exam sim →</a>' : "") +
        "</div></div>";
    }

    onKey(function (e) {
      if (typingInField(e)) return;
      if (qHandle && !answered && qHandle.key(e)) { e.preventDefault(); return; }
      if (e.key === "Enter" || e.key === "ArrowRight") {
        var b = document.getElementById("nextBtn");
        if (b && !b.hidden && document.activeElement !== b) { e.preventDefault(); b.click(); }
      }
    });

    render();
  };

  // ----- Reading mode: the full chapter with inline knowledge checks -----
  views.read = function (objId) {
    var found = findObjective(objId);
    if (!found) return notFound();
    var d = found.domain, o = found.obj;
    var plan = chapterPlan(o);
    var ch = plan.chapter;
    if (!ch) return notFound();
    var all = allObjectives();
    var idx = all.map(function (x) { return x.obj.id; }).indexOf(o.id);
    var prev = all[idx - 1], nxt = all[idx + 1];

    var html = '<article class="reader"><a href="#/course/' + d.id + '" class="small">← ' + esc(d.name) + "</a>" +
      '<div class="eyebrow" style="margin-top:14px">Chapter ' + o.id + "</div><h1>" + esc(o.title) + "</h1>" +
      '<p class="lead">' + ch.overview + "</p>" +
      '<nav class="toc"><div class="small muted">Contents</div><ol>' +
      ch.sections.map(function (s, i) { return '<li><a href="javascript:void 0" data-jump="sec' + i + '">' + s.h + "</a></li>"; }).join("") +
      "</ol></nav>";
    ch.sections.forEach(function (sec, i) {
      html += '<section class="card reader-section" id="sec' + i + '"><div class="eyebrow">Section ' + (i + 1) + "</div><h2>" + sec.h + "</h2>" +
        '<div class="prose">' + sec.html + "</div>" +
        (plan.checks[i] ? '<div class="inline-check"><div class="eyebrow">🧠 Check your understanding</div><div data-check="' + i + '"></div></div>' : "") +
        "</section>";
    });
    if (plan.scenario) {
      html += '<section class="card reader-section"><div class="eyebrow">Worked scenario</div><h2>Apply it</h2><div data-check="scenario"></div><div id="walk"></div></section>';
    }
    html += '<section class="card reader-section"><h2>Exam tips &amp; common traps</h2><div class="tips-grid">' +
      '<div class="tip-box good"><h3>✅ Exam tips</h3><ul>' + ch.tips.map(function (t) { return "<li>" + t + "</li>"; }).join("") + "</ul></div>" +
      '<div class="tip-box bad"><h3>⚠️ Common traps</h3><ul>' + ch.traps.map(function (t) { return "<li>" + t + "</li>"; }).join("") + "</ul></div></div></section>";
    html += '<div class="row reader-nav">' +
      (prev ? '<a class="btn" href="#/read/' + prev.obj.id + '">← ' + prev.obj.id + "</a>" : "") + '<span class="spacer"></span>' +
      '<a class="btn primary" href="#/lesson/' + o.id + '">Take the interactive lesson</a>' +
      (nxt ? '<a class="btn" href="#/read/' + nxt.obj.id + '">' + nxt.obj.id + " →</a>" : "") + "</div></article>";
    app.innerHTML = html;

    app.querySelectorAll("[data-jump]").forEach(function (a) {
      a.onclick = function () { document.getElementById(a.dataset.jump).scrollIntoView({ behavior: "smooth" }); };
    });
    app.querySelectorAll("[data-check]").forEach(function (el) {
      var key = el.dataset.check;
      var isScenario = key === "scenario";
      var q = isScenario ? scenarioQuestion(o, plan.scenario) : plan.checks[Number(key)];
      renderQuestion(el, {
        question: withShuffledChoices(q),
        onAnswer: function (correct) {
          if (!isScenario) store.recordAnswer(q.id, correct);
          if (correct) gainXP(XP.quizCorrect);
          if (isScenario) document.getElementById("walk").innerHTML = '<div class="walkthrough"><h3>Walkthrough</h3>' + plan.scenario.walk + "</div>";
        }
      });
    });
  };

  // ----- Domain checkpoint -----
  views.checkpoint = function (id) {
    var d = domainById(Number(id));
    if (!d) return notFound();
    // Spread questions across the domain's chapters, then fill up to 15.
    var picked = [];
    d.objectives.forEach(function (o) {
      picked = picked.concat(shuffle(S.questions.filter(function (q) { return q.o === o.id; })).slice(0, 2));
    });
    picked = shuffle(picked).slice(0, 15);
    var rest = shuffle(S.questions.filter(function (q) { return q.d === d.id && picked.indexOf(q) === -1; }));
    while (picked.length < 15 && rest.length) picked.push(rest.pop());
    runQuiz(shuffle(picked), "Domain " + d.id + " checkpoint", "#/course/" + d.id, function (score, total) {
      store.completeCheckpoint(d.id, Math.round(score / total * 100));
    });
  };

  // ----- Practice hub -----
  views.practice = function () {
    var due = S.flashcards.filter(function (c) { return !store.isNewCard(c.id) && store.cardDue(c.id); }).length;
    var newCards = S.flashcards.filter(function (c) { return store.isNewCard(c.id); }).length;
    var wrong = mistakes().length;
    app.innerHTML = '<div class="page-head"><h1>Practice</h1><p>Short, focused sessions to reinforce what you learned.</p></div>' +
      '<div class="grid grid-2">' +
      practiceCard("🎯", "Daily practice", "5 questions weighted toward your weakest domains.", "#/practice/daily", "Start") +
      practiceCard("🃏", "Flashcards", S.flashcards.length + " cards with spaced repetition · " + due + " due · " + newCards + " new.", "#/practice/flashcards", "Review") +
      practiceCard("📝", "Custom quiz", "Pick a domain and number of questions. Instant feedback with explanations.", "#/practice/quiz", "Build quiz") +
      practiceCard("🔌", "Ports & protocols", "Drill the " + S.ports.length + " ports you need to know.", "#/practice/ports", "Drill") +
      practiceCard("🧪", "Hands-on labs", S.labs.length + " PBQ-style labs: firewall rules, log analysis, ordering, matching and risk calculations.", "#/labs", "Open labs") +
      practiceCard("⏱️", "Exam simulation", "Timed, mixed-domain test weighted like the real exam.", "#/exam", "Start exam") +
      practiceCard("🔁", "Review mistakes", wrong + " question" + (wrong === 1 ? "" : "s") + " you last answered incorrectly.", "#/review", "Review") +
      "</div>";
  };

  function practiceCard(icon, title, desc, href, cta) {
    return '<div class="card practice-card"><div class="icon">' + icon + "</div><div><h2>" + title + "</h2>" +
      '<p class="small muted">' + desc + '</p><a class="btn primary" href="' + href + '">' + cta + "</a></div></div>";
  }

  // ----- Quiz engine (custom quiz, daily practice, review) -----
  function runQuiz(questions, label, backHref, onFinish) {
    questions = questions.map(withShuffledChoices);
    var pos = 0, score = 0, qHandle = null, answered = false;
    var results = [];

    function render() {
      answered = false;
      var q = questions[pos];
      var d = domainById(q.d);
      app.innerHTML = '<div class="lesson-top"><a href="' + backHref + '" class="small">✕ Exit</a>' +
        '<div class="lesson-progress">' + progressBar(Math.round(pos / questions.length * 100)) + "</div>" +
        '<span class="small muted">' + (pos + 1) + "/" + questions.length + "</span></div>" +
        '<div class="card lesson-card"><div class="quiz-meta"><span class="pill"><span class="dot" style="background:' + d.color + '"></span>' +
        "Domain " + d.id + " · " + q.o + '</span><span class="small muted">Score: ' + score + "</span></div>" +
        '<div id="qbox"></div><div class="row" style="margin-top:16px"><span class="spacer"></span>' +
        '<button class="btn primary" id="nextBtn" hidden>' + (pos + 1 === questions.length ? "See results" : "Next question →") + "</button></div></div>";
      var nextBtn = document.getElementById("nextBtn");
      nextBtn.onclick = advance;
      qHandle = renderQuestion(document.getElementById("qbox"), {
        question: q,
        onAnswer: function (correct) {
          answered = true;
          store.recordAnswer(q.id, correct);
          results.push({ q: q, correct: correct });
          if (correct) { score++; gainXP(XP.quizCorrect); }
          nextBtn.hidden = false;
          nextBtn.focus();
        }
      });
    }

    function advance() {
      pos++;
      if (pos >= questions.length) return finish();
      render();
      window.scrollTo(0, 0);
    }

    function finish() {
      store.addHistory({ mode: "quiz", label: label, score: score, total: questions.length });
      if (onFinish) onFinish(score, questions.length);
      var pct = Math.round(score / questions.length * 100);
      var missed = results.filter(function (r) { return !r.correct; });
      app.innerHTML = '<div class="card lesson-card center"><div class="celebrate">' + (pct >= 80 ? "🎉" : "💪") + "</div>" +
        "<h1>" + esc(label) + " complete</h1>" +
        '<div class="score-big ' + (pct >= 80 ? "pass" : "fail") + '">' + pct + "%</div>" +
        '<p class="muted">' + score + " of " + questions.length + " correct · +" + score * XP.quizCorrect + " XP</p>" +
        '<div class="row" style="justify-content:center"><a class="btn" href="' + backHref + '">Done</a>' +
        (missed.length ? '<a class="btn primary" href="#/review">Review mistakes</a>' : "") + "</div></div>" +
        (missed.length ? '<h2 style="margin-top:24px">Missed questions</h2>' + missed.map(function (r) {
          return '<div class="card" style="margin-bottom:10px"><strong>' + esc(r.q.q) + '</strong><p class="small">✅ ' +
            answerIndexes(r.q).map(function (i) { return esc(r.q.c[i]); }).join(" + ") + '</p><p class="small muted">' + esc(r.q.e) + "</p></div>";
        }).join("") : "");
    }

    onKey(function (e) {
      if (typingInField(e)) return;
      if (qHandle && !answered && qHandle.key(e)) { e.preventDefault(); return; }
      if (e.key === "Enter" || e.key === "ArrowRight") {
        var b = document.getElementById("nextBtn");
        if (b && !b.hidden && document.activeElement !== b) { e.preventDefault(); b.click(); }
      }
    });

    render();
  }

  views.quizSetup = function () {
    var html = '<div class="page-head"><a href="#/practice" class="small">← Practice</a><h1 style="margin-top:8px">Custom quiz</h1>' +
      "<p>" + S.questions.length + " scenario-style questions with explanations.</p></div>" +
      '<div class="card"><div class="row" style="align-items:flex-end">' +
      '<label class="field">Domain<select id="qDomain"><option value="0">All domains</option>' +
      S.domains.map(function (d) {
        return '<option value="' + d.id + '">' + d.id + ". " + esc(d.name) + " (" + S.questions.filter(function (q) { return q.d === d.id; }).length + ")</option>";
      }).join("") + "</select></label>" +
      '<label class="field">Questions<select id="qCount"><option>5</option><option selected>10</option><option>20</option><option value="999">All</option></select></label>' +
      '<label class="field">Order<select id="qOrder"><option value="unseen">Unseen first</option><option value="random">Random</option></select></label>' +
      '<button class="btn primary" id="startQuiz">Start quiz</button></div></div>';
    app.innerHTML = html;
    document.getElementById("startQuiz").onclick = function () {
      var dom = Number(document.getElementById("qDomain").value);
      var count = Number(document.getElementById("qCount").value);
      var order = document.getElementById("qOrder").value;
      var pool = shuffle(S.questions.filter(function (q) { return !dom || q.d === dom; }));
      if (order === "unseen") {
        pool.sort(function (a, b) {
          return (store.state.questions[a.id] ? 1 : 0) - (store.state.questions[b.id] ? 1 : 0);
        });
      }
      runQuiz(pool.slice(0, count), dom ? "Domain " + dom + " quiz" : "Mixed quiz", "#/practice/quiz");
    };
  };

  views.daily = function () {
    // Weight each domain by (100 - accuracy) so weak areas show up more often.
    var weights = {};
    S.domains.forEach(function (d) {
      var a = domainAccuracy(d.id);
      weights[d.id] = a === null ? 60 : Math.max(10, 100 - a);
    });
    var pool = shuffle(S.questions);
    var picked = [];
    while (picked.length < 5 && pool.length) {
      var total = pool.reduce(function (s, q) { return s + weights[q.d]; }, 0);
      var r = Math.random() * total;
      for (var i = 0; i < pool.length; i++) {
        r -= weights[pool[i].d];
        if (r <= 0) { picked.push(pool.splice(i, 1)[0]); break; }
      }
    }
    runQuiz(picked, "Daily practice", "#/practice");
  };

  function mistakes() {
    return S.questions.filter(function (q) {
      var s = store.state.questions[q.id];
      return s && s.last === false;
    });
  }

  views.review = function () {
    var list = mistakes();
    if (!list.length) {
      app.innerHTML = '<div class="page-head"><h1>Review mistakes</h1></div><div class="card empty">' +
        "<div class=\"celebrate\">✨</div><p>No mistakes to review. Questions you answer incorrectly will appear here until you get them right.</p>" +
        '<a class="btn primary" href="#/practice/daily">Do daily practice</a></div>';
      return;
    }
    app.innerHTML = '<div class="page-head"><h1>Review mistakes</h1><p>' + list.length + " question" + (list.length === 1 ? "" : "s") +
      " you last answered incorrectly. Get them right to clear them.</p></div>" +
      '<div class="row" style="margin-bottom:16px"><button class="btn primary" id="retry">Retry all ' + list.length + "</button></div>" +
      list.map(function (q) {
        var d = domainById(q.d);
        return '<div class="card" style="margin-bottom:10px"><span class="pill"><span class="dot" style="background:' + d.color + '"></span>' + q.o + "</span>" +
          '<p><strong>' + esc(q.q) + '</strong></p><p class="small">✅ ' + answerIndexes(q).map(function (i) { return esc(q.c[i]); }).join(" + ") +
          '</p><p class="small muted">' + esc(q.e) + "</p></div>";
      }).join("");
    document.getElementById("retry").onclick = function () { runQuiz(shuffle(list), "Mistake review", "#/review"); };
  };

  // ----- Flashcards -----
  views.flashcards = function () {
    var html = '<div class="page-head"><a href="#/practice" class="small">← Practice</a><h1 style="margin-top:8px">Flashcards</h1>' +
      "<p>Spaced repetition: cards you know come back less often; cards you miss come back soon.</p></div>" +
      '<div class="card"><div class="row" style="align-items:flex-end">' +
      '<label class="field">Deck<select id="deck"><option value="due">Due + new (recommended)</option><option value="all">All cards</option>' +
      S.domains.map(function (d) { return '<option value="' + d.id + '">Domain ' + d.id + ": " + esc(d.name) + "</option>"; }).join("") +
      '<option value="0">Acronyms & frameworks</option></select></label>' +
      '<button class="btn primary" id="startDeck">Start</button></div></div><div id="deckArea" style="margin-top:16px"></div>';
    app.innerHTML = html;
    document.getElementById("startDeck").onclick = function () { startDeck(document.getElementById("deck").value); };
  };

  function startDeck(which) {
    var cards;
    if (which === "due") {
      var dueCards = S.flashcards.filter(function (c) { return !store.isNewCard(c.id) && store.cardDue(c.id); });
      var fresh = S.flashcards.filter(function (c) { return store.isNewCard(c.id); }).slice(0, 15);
      cards = shuffle(dueCards).concat(fresh);
    } else if (which === "all") {
      cards = shuffle(S.flashcards);
    } else {
      cards = shuffle(S.flashcards.filter(function (c) { return c.domain === Number(which); }));
    }
    var area = document.getElementById("deckArea");
    if (!cards.length) {
      area.innerHTML = '<div class="card empty">🎉 Nothing due right now. Come back later or pick another deck.</div>';
      return;
    }
    var pos = 0, flipped = false, reviewed = 0, knew = 0;

    function draw() {
      var c = cards[pos];
      var dname = c.domain ? "Domain " + c.domain : "Acronym";
      area.innerHTML = '<div class="quiz-meta"><span class="pill">' + dname + (store.isNewCard(c.id) ? " · new" : " · box " + store.cardBox(c.id)) + "</span>" +
        '<span class="small muted">' + (pos + 1) + " / " + cards.length + "</span></div>" +
        progressBar(Math.round(pos / cards.length * 100)) +
        '<div class="flashcard' + (flipped ? " flipped" : "") + '" id="fc" style="margin-top:16px"><div class="flashcard-inner">' +
        '<div class="face front"><div class="term">' + esc(c.front) + '</div><div class="hint">Click or press Space to flip</div></div>' +
        '<div class="face back"><div>' + esc(c.back) + "</div></div></div></div>" +
        '<div class="row rate-row">' + (flipped
          ? '<button class="btn bad" data-r="0">Again <span class="kbd">1</span></button>' +
            '<button class="btn good" data-r="1">Good <span class="kbd">2</span></button>' +
            '<button class="btn primary" data-r="2">Easy <span class="kbd">3</span></button>'
          : '<button class="btn primary" id="flipBtn">Show answer</button>') + "</div>";
      document.getElementById("fc").onclick = flip;
      var fb = document.getElementById("flipBtn");
      if (fb) fb.onclick = flip;
      area.querySelectorAll("[data-r]").forEach(function (b) {
        b.onclick = function () { rate(Number(b.dataset.r)); };
      });
    }

    function flip() { flipped = !flipped; draw(); }

    function rate(r) {
      if (!flipped) return;
      store.rateCard(cards[pos].id, r);
      reviewed++;
      if (r > 0) knew++;
      gainXP(XP.cardReview);
      pos++;
      flipped = false;
      if (pos >= cards.length) {
        area.innerHTML = '<div class="card empty"><div class="celebrate">🃏</div><h2>Deck complete</h2><p>' + reviewed + " cards reviewed · " +
          knew + " known · +" + reviewed * XP.cardReview + ' XP</p><a class="btn primary" href="#/practice">Back to practice</a></div>';
        return;
      }
      draw();
    }

    onKey(function (e) {
      if (typingInField(e) || !document.getElementById("fc")) return;
      if (e.key === " ") { e.preventDefault(); flip(); }
      else if (flipped && (e.key === "1" || e.key === "2" || e.key === "3")) rate(Number(e.key) - 1);
    });

    draw();
  }

  // ----- Ports drill -----
  views.ports = function () {
    var tab = "drill";
    function draw() {
      var html = '<div class="page-head"><a href="#/practice" class="small">← Practice</a><h1 style="margin-top:8px">Ports & protocols</h1>' +
        "<p>Know these cold — they show up in scenario and performance-based questions.</p></div>" +
        '<div class="tabs"><button data-tab="drill" class="' + (tab === "drill" ? "active" : "") + '">Drill</button>' +
        '<button data-tab="table" class="' + (tab === "table" ? "active" : "") + '">Reference table</button></div><div id="portArea"></div>';
      app.innerHTML = html;
      app.querySelectorAll("[data-tab]").forEach(function (b) {
        b.onclick = function () { tab = b.dataset.tab; draw(); };
      });
      if (tab === "table") drawTable(); else drawDrill();
    }

    function drawTable() {
      document.getElementById("portArea").innerHTML = '<div class="card table-wrap"><table class="data"><thead><tr><th>Port</th><th>Transport</th><th>Protocol</th><th>Notes</th></tr></thead><tbody>' +
        S.ports.slice().sort(function (a, b) { return parseInt(a.port, 10) - parseInt(b.port, 10); }).map(function (p) {
          return "<tr><td><strong>" + p.port + "</strong></td><td>" + p.proto + "</td><td>" + esc(p.name) + '</td><td class="small muted">' + esc(p.note) + "</td></tr>";
        }).join("") + "</tbody></table></div>";
    }

    function validPorts(p) {
      var out = [];
      p.port.split("/").forEach(function (part) {
        var range = part.split("-").map(Number);
        if (range.length === 2) for (var n = range[0]; n <= range[1]; n++) out.push(n);
        else out.push(range[0]);
      });
      return out;
    }

    function drawDrill() {
      var deck = shuffle(S.ports), pos = 0, score = 0;
      var area = document.getElementById("portArea");
      function next() {
        if (pos >= deck.length) {
          area.innerHTML = '<div class="card empty"><div class="celebrate">🔌</div><h2>' + score + " / " + deck.length + '</h2><button class="btn primary" id="again">Go again</button></div>';
          document.getElementById("again").onclick = drawDrill;
          return;
        }
        var p = deck[pos];
        area.innerHTML = '<div class="card lesson-card center"><div class="small muted">' + (pos + 1) + " / " + deck.length + " · Score " + score + "</div>" +
          "<h2 style=\"margin:14px 0\">What port does <strong>" + esc(p.name) + "</strong> use?</h2>" +
          '<form id="pf" class="row" style="justify-content:center"><input type="number" class="port-input" id="pin" autocomplete="off" required min="1" max="65535">' +
          '<button class="btn primary">Check</button><button type="button" class="btn" id="skip">Show me</button></form><div id="pres"></div></div>';
        var input = document.getElementById("pin");
        input.focus();
        function reveal(ok) {
          document.getElementById("pres").innerHTML = '<div class="explanation ' + (ok ? "good" : "bad") + '" style="text-align:left"><strong>' +
            (ok ? "✅ Correct!" : "❌ It's " + p.port + " (" + p.proto + ").") + "</strong> " + esc(p.note) + "</div>" +
            '<button class="btn primary" id="pnext" style="margin-top:12px">Next →</button>';
          input.disabled = true;
          document.querySelectorAll("#pf button").forEach(function (b) { b.disabled = true; });
          var nb = document.getElementById("pnext");
          nb.onclick = function () { pos++; next(); };
          nb.focus();
        }
        document.getElementById("pf").onsubmit = function (e) {
          e.preventDefault();
          var ok = validPorts(p).indexOf(Number(input.value)) !== -1;
          if (ok) { score++; gainXP(XP.portCorrect); }
          reveal(ok);
        };
        document.getElementById("skip").onclick = function () { reveal(false); };
      }
      next();
    }

    draw();
  };

  // ----- Exam simulation -----
  views.exam = function () {
    var maxQ = Math.min(S.examInfo.maxQuestions, S.questions.length);
    app.innerHTML = '<div class="page-head"><h1>Exam simulation</h1><p>A timed, mixed-domain test weighted by the official domain percentages. No feedback until you submit — just like the real thing.</p></div>' +
      '<div class="card"><div class="row" style="align-items:flex-end">' +
      '<label class="field">Length<select id="eLen"><option value="25">Quick — 25 questions / 25 min</option><option value="50">Half — 50 questions / 50 min</option>' +
      '<option value="' + maxQ + '">Full — ' + maxQ + " questions / " + maxQ + " min</option></select></label>" +
      '<button class="btn primary" id="startExam">Start exam</button></div>' +
      '<p class="small muted" style="margin-top:12px">Practice target: aim for 85%+ consistently before booking the real exam. The real exam is scored 100–900 (pass: 750) and includes performance-based questions.</p></div>' +
      examHistory();
    document.getElementById("startExam").onclick = function () {
      startExam(Number(document.getElementById("eLen").value));
    };
  };

  function examHistory() {
    var h = store.state.history.filter(function (x) { return x.mode === "exam"; }).slice(-8).reverse();
    if (!h.length) return "";
    return '<div class="card" style="margin-top:16px"><h2>Recent attempts</h2><table class="data"><thead><tr><th>Date</th><th>Questions</th><th>Score</th></tr></thead><tbody>' +
      h.map(function (x) {
        var pct = Math.round(x.score / x.total * 100);
        return "<tr><td>" + new Date(x.date).toLocaleString() + "</td><td>" + x.total + '</td><td style="color:' + (pct >= 85 ? "var(--good)" : "var(--bad)") + '"><strong>' + pct + "%</strong></td></tr>";
      }).join("") + "</tbody></table></div>";
  }

  function pickExamQuestions(n) {
    var picked = [];
    var byDomain = {};
    S.domains.forEach(function (d) { byDomain[d.id] = shuffle(S.questions.filter(function (q) { return q.d === d.id; })); });
    S.domains.forEach(function (d) {
      var want = Math.round(n * d.weight / 100);
      picked = picked.concat(byDomain[d.id].splice(0, want));
    });
    var rest = shuffle([].concat.apply([], S.domains.map(function (d) { return byDomain[d.id]; })));
    while (picked.length < n && rest.length) picked.push(rest.pop());
    return shuffle(picked.slice(0, n)).map(withShuffledChoices);
  }

  function startExam(n) {
    var qs = pickExamQuestions(n);
    var answers = qs.map(function () { return []; });
    var flags = qs.map(function () { return false; });
    var pos = 0;
    var endAt = Date.now() + qs.length * 60000;
    var timerId = setInterval(tick, 1000);
    var qHandle = null;
    var finished = false;
    cleanups.push(function () { clearInterval(timerId); });

    function fmt(ms) {
      var s = Math.max(0, Math.round(ms / 1000));
      return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
    }

    function tick() {
      var left = endAt - Date.now();
      var el = document.getElementById("timer");
      if (el) {
        el.textContent = "⏱ " + fmt(left);
        el.classList.toggle("low", left < 5 * 60000);
      }
      if (left <= 0) submit(true);
    }

    function render() {
      var q = qs[pos];
      app.innerHTML = '<div class="card"><div class="quiz-meta"><strong>Question ' + (pos + 1) + " of " + qs.length + "</strong>" +
        '<span class="timer" id="timer"></span></div><div id="qbox"></div>' +
        '<div class="row" style="margin-top:18px"><button class="btn" id="prev"' + (pos === 0 ? " disabled" : "") + ">← Previous</button>" +
        '<button class="btn warn" id="flag">' + (flags[pos] ? "Unflag" : "🚩 Flag for review") + '</button><span class="spacer"></span>' +
        (pos < qs.length - 1 ? '<button class="btn primary" id="next">Next →</button>' : "") +
        '<button class="btn ' + (pos === qs.length - 1 ? "primary" : "") + '" id="submit">Submit exam</button></div>' +
        '<div class="qnav">' + qs.map(function (_, i) {
          return '<button data-go="' + i + '" class="' + (answers[i].length ? "answered " : "") + (flags[i] ? "flagged " : "") + (i === pos ? "current" : "") + '">' + (i + 1) + "</button>";
        }).join("") + "</div></div>";
      tick();
      qHandle = renderQuestion(document.getElementById("qbox"), {
        question: q,
        showFeedback: false,
        preselected: answers[pos],
        onSelect: function (sel) {
          answers[pos] = sel;
          var nb = app.querySelector('[data-go="' + pos + '"]');
          if (nb) nb.classList.toggle("answered", sel.length > 0);
        }
      });
      document.getElementById("prev").onclick = function () { go(pos - 1); };
      var nx = document.getElementById("next");
      if (nx) nx.onclick = function () { go(pos + 1); };
      document.getElementById("flag").onclick = function () { flags[pos] = !flags[pos]; render(); };
      document.getElementById("submit").onclick = function () { submit(false); };
      app.querySelectorAll("[data-go]").forEach(function (b) {
        b.onclick = function () { go(Number(b.dataset.go)); };
      });
    }

    function go(i) {
      if (i < 0 || i >= qs.length) return;
      pos = i;
      render();
    }

    function submit(timeUp) {
      if (finished) return;
      if (!timeUp) {
        var unanswered = answers.filter(function (a) { return !a.length; }).length;
        var flagged = flags.filter(Boolean).length;
        var msg = "Submit your exam?";
        if (unanswered) msg += "\n" + unanswered + " question(s) unanswered.";
        if (flagged) msg += "\n" + flagged + " question(s) flagged.";
        if (!confirm(msg)) return;
      }
      finished = true;
      clearInterval(timerId);
      var score = 0;
      var perDomain = {};
      qs.forEach(function (q, i) {
        var ok = answers[i].length > 0 && isCorrect(q, answers[i]);
        if (answers[i].length) store.recordAnswer(q.id, ok);
        if (ok) score++;
        perDomain[q.d] = perDomain[q.d] || { c: 0, t: 0 };
        perDomain[q.d].t++;
        if (ok) perDomain[q.d].c++;
      });
      store.addHistory({ mode: "exam", label: qs.length + "-question exam", score: score, total: qs.length });
      gainXP(score * XP.quizCorrect);
      showResults(score, perDomain, timeUp);
    }

    function showResults(score, perDomain, timeUp) {
      var pct = Math.round(score / qs.length * 100);
      var html = '<div class="card center">' + (timeUp ? '<p class="pill">⏱ Time expired</p>' : "") +
        "<h1>Exam results</h1>" +
        '<div class="score-big ' + (pct >= 85 ? "pass" : "fail") + '">' + pct + "%</div>" +
        '<p class="muted">' + score + " / " + qs.length + " correct · " + (pct >= 85 ? "Exam-ready range — nice work!" : "Keep going: target 85%+ before booking.") + "</p></div>" +
        '<div class="card" style="margin-top:16px"><h2>By domain</h2>';
      S.domains.forEach(function (d) {
        var r = perDomain[d.id];
        if (!r) return;
        var p = Math.round(r.c / r.t * 100);
        html += '<div class="domain-row"><span><span class="dot" style="background:' + d.color + '"></span>' + d.id + ". " + esc(d.name) +
          '</span><span class="small muted">' + r.c + "/" + r.t + " (" + p + "%)</span>" + progressBar(p, d.color) + "</div>";
      });
      html += '</div><div class="row" style="margin:16px 0"><button class="btn primary" id="reviewExam">Review answers</button><a class="btn" href="#/review">Practice mistakes</a><a class="btn" href="#/">Dashboard</a></div><div id="examReview"></div>';
      app.innerHTML = html;
      document.getElementById("reviewExam").onclick = function () {
        var box = document.getElementById("examReview");
        box.innerHTML = "";
        qs.forEach(function (q, i) {
          var wrap = document.createElement("div");
          wrap.className = "card";
          wrap.style.marginBottom = "12px";
          wrap.innerHTML = '<div class="small muted">Question ' + (i + 1) + " · " + q.o + (answers[i].length ? "" : " · not answered") + '</div><div class="qb"></div>';
          box.appendChild(wrap);
          renderQuestion(wrap.querySelector(".qb"), { question: q, preselected: answers[i], locked: true, reveal: true, onAnswer: function () {} });
        });
        this.remove();
      };
    }

    onKey(function (e) {
      if (finished || typingInField(e)) return;
      if (qHandle && qHandle.key(e)) { e.preventDefault(); return; }
      if (e.key === "ArrowRight") go(pos + 1);
      else if (e.key === "ArrowLeft") go(pos - 1);
    });

    render();
  }

  function notFound() {
    app.innerHTML = '<div class="card empty"><h1>Page not found</h1><a class="btn primary" href="#/">Go to dashboard</a></div>';
  }

  // ---------- Router ----------
  var routes = [
    [/^$/, views.dashboard, ""],
    [/^courses$/, views.courses, "courses"],
    [/^course\/(\d+)$/, views.course, "courses"],
    [/^lesson\/([\d.]+)$/, views.lesson, "courses"],
    [/^read\/([\d.]+)$/, views.read, "courses"],
    [/^checkpoint\/(\d+)$/, views.checkpoint, "courses"],
    [/^practice$/, views.practice, "practice"],
    [/^practice\/daily$/, views.daily, "practice"],
    [/^practice\/quiz$/, views.quizSetup, "practice"],
    [/^practice\/flashcards$/, views.flashcards, "practice"],
    [/^practice\/ports$/, views.ports, "practice"],
    [/^exam$/, views.exam, "exam"],
    [/^review$/, views.review, "review"],
    [/^labs$/, function () { S.labsUI.list(app); }, "labs"],
    [/^lab\/([\w-]+)$/, function (id) { S.labsUI.run(app, id); }, "labs"]
  ];

  function route() {
    while (cleanups.length) cleanups.pop()();
    var path = location.hash.replace(/^#\/?/, "");
    var matched = false;
    for (var i = 0; i < routes.length; i++) {
      var m = path.match(routes[i][0]);
      if (m) {
        setActiveNav(routes[i][2]);
        routes[i][1].apply(null, m.slice(1));
        matched = true;
        break;
      }
    }
    if (!matched) notFound();
    document.getElementById("nav").classList.remove("open");
    window.scrollTo(0, 0);
    app.focus({ preventScroll: true });
  }

  function setActiveNav(name) {
    document.querySelectorAll("#nav a").forEach(function (a) {
      a.classList.toggle("active", a.dataset.route === name);
    });
  }

  // ---------- Theme & menu ----------
  function initChrome() {
    var root = document.documentElement;
    try {
      var saved = localStorage.getItem("secplus.theme");
      if (saved) root.setAttribute("data-theme", saved);
    } catch (e) { /* ignore */ }
    document.getElementById("themeToggle").onclick = function () {
      var dark = root.getAttribute("data-theme")
        ? root.getAttribute("data-theme") === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches;
      var next = dark ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("secplus.theme", next); } catch (e) { /* ignore */ }
    };
    var toggle = document.getElementById("menuToggle");
    toggle.onclick = function () {
      var open = document.getElementById("nav").classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    };
    updateXPBadge();
  }

  window.addEventListener("hashchange", route);
  // Links to the current hash don't fire hashchange (Replay, Done, nav), so re-render explicitly.
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a[href^='#']");
    if (a && a.getAttribute("href") === (location.hash || "#/")) {
      e.preventDefault();
      route();
    }
  });
  initChrome();
  route();
})();
