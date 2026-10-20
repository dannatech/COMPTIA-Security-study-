#!/usr/bin/env node
// Validates the study content in js/data/. No dependencies: run with `node scripts/validate-data.js`.
// Loads the data files in the same order as index.html, then checks objectives, answer indexes,
// required fields and duplicates. Exits with code 1 if any error is found.
"use strict";

var fs = require("fs");
var path = require("path");
var vm = require("vm");

var root = path.join(__dirname, "..");
var errors = [];
var warnings = [];

function err(where, msg) { errors.push(where + ": " + msg); }
function warn(where, msg) { warnings.push(where + ": " + msg); }

// ---------- Load data files in index.html order ----------
var html = fs.readFileSync(path.join(root, "index.html"), "utf8");
var dataFiles = [];
html.replace(/<script\s+src="(js\/data\/[^"]+\.js)"/g, function (_, src) { dataFiles.push(src); });

var onDisk = fs.readdirSync(path.join(root, "js/data")).filter(function (f) { return f.endsWith(".js"); });
onDisk.forEach(function (f) {
  if (dataFiles.indexOf("js/data/" + f) === -1) err("index.html", "js/data/" + f + " exists but is not loaded by a <script> tag");
});

var sandbox = {};
sandbox.window = sandbox;
vm.createContext(sandbox);
dataFiles.forEach(function (file) {
  var full = path.join(root, file);
  if (!fs.existsSync(full)) return err("index.html", "loads " + file + " but the file does not exist");
  try {
    vm.runInContext(fs.readFileSync(full, "utf8"), sandbox, { filename: file });
  } catch (e) {
    err(file, "failed to load: " + e.message);
  }
});

var S = sandbox.SECPLUS;
if (!S) {
  console.error("SECPLUS was not defined by the data files.");
  process.exit(1);
}

// ---------- Helpers ----------
function isText(v) { return typeof v === "string" && v.trim().length > 0; }
function isIndex(v, len) { return Number.isInteger(v) && v >= 0 && v < len; }
function norm(s) { return String(s).replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim().toLowerCase(); }

function checkChoices(where, c, a) {
  if (!Array.isArray(c) || c.length < 2) return err(where, "needs at least 2 choices");
  c.forEach(function (x, i) { if (!isText(x)) err(where, "choice " + i + " is empty"); });
  var seen = {};
  c.forEach(function (x) {
    var k = norm(x);
    if (seen[k]) err(where, "duplicate choice \"" + x + "\"");
    seen[k] = true;
  });
  if (Array.isArray(a)) {
    if (a.length < 2) err(where, "multi-answer array needs at least 2 indexes");
    if (a.length >= c.length) err(where, "multi-answer array marks every choice correct");
    a.forEach(function (i) { if (!isIndex(i, c.length)) err(where, "answer index " + JSON.stringify(i) + " is out of range (0-" + (c.length - 1) + ")"); });
    if (new Set(a).size !== a.length) err(where, "answer array has repeated indexes");
  } else if (!isIndex(a, c.length)) {
    err(where, "answer index " + JSON.stringify(a) + " is out of range (0-" + (c.length - 1) + ")");
  }
}

// ---------- Domains and objectives ----------
var objectives = {};
var domainIds = {};
if (!Array.isArray(S.domains)) err("domains.js", "SECPLUS.domains is missing");
else {
  var weight = 0;
  S.domains.forEach(function (d) {
    var where = "domains.js domain " + d.id;
    if (domainIds[d.id]) err(where, "duplicate domain id");
    domainIds[d.id] = true;
    if (!isText(d.name)) err(where, "missing name");
    weight += d.weight || 0;
    (d.objectives || []).forEach(function (o) {
      var ow = "domains.js objective " + o.id;
      if (!/^\d\.\d+$/.test(o.id)) err(ow, "objective id should look like \"1.1\"");
      else if (Number(o.id.split(".")[0]) !== d.id) err(ow, "listed under domain " + d.id);
      if (objectives[o.id]) err(ow, "duplicate objective id");
      objectives[o.id] = true;
      if (!isText(o.title)) err(ow, "missing title");
      if (!Array.isArray(o.points) || !o.points.length) err(ow, "has no points");
    });
  });
  if (weight !== 100) err("domains.js", "domain weights add up to " + weight + ", expected 100");
}

function checkObjective(where, o) {
  if (!objectives[o]) err(where, "unknown objective " + JSON.stringify(o));
}

// ---------- Questions ----------
var qIds = {};
var qText = {};
(S.questions || []).forEach(function (q, n) {
  var where = "question " + (q.id || "#" + n);
  if (!isText(q.id)) err(where, "missing id");
  else if (qIds[q.id]) err(where, "duplicate id");
  qIds[q.id] = true;
  checkObjective(where, q.o);
  if (q.d !== Number(String(q.o).charAt(0))) err(where, "domain " + q.d + " does not match objective " + q.o);
  if (!isText(q.q)) err(where, "missing question text");
  else {
    var k = norm(q.q);
    if (qText[k]) err(where, "duplicate question text (also " + qText[k] + ")");
    qText[k] = q.id;
  }
  checkChoices(where, q.c, q.a);
  if (!isText(q.e)) err(where, "missing explanation");
});

// ---------- Flashcards ----------
var cardIds = {};
(S.flashcards || []).forEach(function (f, n) {
  var where = "flashcard #" + n + (isText(f.front) ? " \"" + f.front + "\"" : "");
  if (f.domain !== 0 && !domainIds[f.domain]) err(where, "unknown domain " + JSON.stringify(f.domain));
  if (!isText(f.front)) err(where, "empty front");
  if (!isText(f.back)) err(where, "empty back");
  if (cardIds[f.id] !== undefined) err(where, "duplicate front (also flashcard #" + cardIds[f.id] + ")");
  cardIds[f.id] = n;
});

// ---------- Chapters ----------
var chapters = S.chapters || {};
Object.keys(chapters).forEach(function (o) {
  var ch = chapters[o], where = "chapter " + o;
  checkObjective(where, o);
  if (!isText(ch.overview)) err(where, "missing overview");
  if (!Array.isArray(ch.sections) || !ch.sections.length) err(where, "has no sections");
  else ch.sections.forEach(function (s, i) {
    if (!isText(s.h)) err(where, "section " + i + " has no heading");
    if (!isText(s.html)) err(where, "section " + i + " has no body");
  });
  ["tips", "traps"].forEach(function (key) {
    if (ch[key] !== undefined && !Array.isArray(ch[key])) err(where, key + " should be an array");
  });
});

// ---------- Scenarios ----------
var scenarios = S.scenarios || {};
Object.keys(scenarios).forEach(function (o) {
  var sc = scenarios[o], where = "scenario " + o;
  checkObjective(where, o);
  if (!isText(sc.q)) err(where, "missing question text");
  checkChoices(where, sc.c, sc.a);
  if (!isText(sc.walk)) err(where, "missing walkthrough");
});

// ---------- Labs ----------
var labIds = {};
(S.labs || []).forEach(function (lab, n) {
  var where = "lab " + (lab.id || "#" + n);
  if (!isText(lab.id)) err(where, "missing id");
  else if (labIds[lab.id]) err(where, "duplicate id");
  labIds[lab.id] = true;
  checkObjective(where, lab.o);
  if (!isText(lab.title)) err(where, "missing title");
  if (!isText(lab.scenario)) err(where, "missing scenario");
  if (!isText(lab.explain) && !(lab.question && isText(lab.question.e))) err(where, "missing explanation");

  if (lab.type === "order") {
    if (!Array.isArray(lab.items) || lab.items.length < 2) err(where, "needs at least 2 items");
    else if (new Set(lab.items.map(norm)).size !== lab.items.length) err(where, "has duplicate items");
  } else if (lab.type === "match") {
    var cats = lab.categories || [];
    if (cats.length < 2) err(where, "needs at least 2 categories");
    if (new Set(cats).size !== cats.length) err(where, "has duplicate categories");
    (lab.items || []).forEach(function (it, i) {
      if (!Array.isArray(it) || !isText(it[0])) err(where, "item " + i + " should be [text, category]");
      else if (cats.indexOf(it[1]) === -1) err(where, "item \"" + it[0] + "\" uses unknown category " + JSON.stringify(it[1]));
    });
    if (new Set((lab.items || []).map(function (it) { return norm(it[0]); })).size !== (lab.items || []).length) err(where, "has duplicate items");
  } else if (lab.type === "firewall") {
    var hosts = lab.hosts || [], ports = lab.ports || [], groups = lab.groups || {};
    var names = hosts.concat(Object.keys(groups));
    Object.keys(groups).forEach(function (g) {
      groups[g].forEach(function (h) { if (hosts.indexOf(h) === -1) err(where, "group " + g + " lists unknown host " + JSON.stringify(h)); });
    });
    function checkRule(label, r, isTest) {
      if (!Array.isArray(r) || r.length !== 5) return err(where, label + " should have 5 fields");
      var action = isTest ? r[4] : r[0];
      var src = isTest ? r[0] : r[1], dst = isTest ? r[1] : r[2], proto = isTest ? r[2] : r[3], port = isTest ? r[3] : r[4];
      if (action !== "ALLOW" && action !== "DENY") err(where, label + " has action " + JSON.stringify(action));
      [src, dst].forEach(function (h) {
        if (isTest ? hosts.indexOf(h) === -1 : (h !== "ANY" && names.indexOf(h) === -1)) err(where, label + " uses unknown host " + JSON.stringify(h));
      });
      if (["TCP", "UDP"].indexOf(proto) === -1 && !(proto === "ANY" && !isTest)) err(where, label + " uses unknown protocol " + JSON.stringify(proto));
      if (!isTest && port !== "ANY" && ports.indexOf(port) === -1) err(where, label + " uses port " + JSON.stringify(port) + " that is not in the port list");
    }
    (lab.start || []).forEach(function (r, i) { checkRule("starting rule " + i, r, false); });
    if (!Array.isArray(lab.tests) || !lab.tests.length) err(where, "has no tests");
    else lab.tests.forEach(function (t, i) { checkRule("test " + i, t, true); });
  } else if (lab.type === "logs") {
    var lines = lab.lines || [];
    if (!lines.length) err(where, "has no log lines");
    if (!Array.isArray(lab.bad) || !lab.bad.length) err(where, "has no malicious lines marked");
    else {
      lab.bad.forEach(function (i) { if (!isIndex(i, lines.length)) err(where, "bad line index " + JSON.stringify(i) + " is out of range"); });
      if (new Set(lab.bad).size !== lab.bad.length) err(where, "bad line indexes repeat");
    }
    if (lab.question) {
      checkChoices(where + " question", lab.question.c, lab.question.a);
      if (!isText(lab.question.q)) err(where, "question has no text");
      if (!isText(lab.question.e)) err(where, "question has no explanation");
    }
  } else if (lab.type === "numeric") {
    if (!Array.isArray(lab.fields) || !lab.fields.length) err(where, "has no fields");
    else lab.fields.forEach(function (f, i) {
      if (!isText(f.label)) err(where, "field " + i + " has no label");
      if (typeof f.answer !== "number" || !isFinite(f.answer)) err(where, "field " + i + " answer is not a number");
    });
  } else {
    err(where, "unknown lab type " + JSON.stringify(lab.type));
  }
});

// ---------- Ports ----------
var portKeys = {};
(S.ports || []).forEach(function (p, n) {
  var where = "port #" + n + (isText(p.name) ? " " + p.name : "");
  if (!isText(p.port) || !/^\d+([\/-]\d+)?$/.test(p.port)) err(where, "port " + JSON.stringify(p.port) + " should look like \"22\", \"20/21\" or \"137-139\"");
  if (["TCP", "UDP", "TCP/UDP"].indexOf(p.proto) === -1) err(where, "unknown protocol " + JSON.stringify(p.proto));
  if (!isText(p.name)) err(where, "missing name");
  if (!isText(p.note)) err(where, "missing note");
  var k = p.port + " " + p.proto;
  if (portKeys[k]) err(where, "duplicate port entry " + k);
  portKeys[k] = true;
});

// ---------- Coverage (warnings only) ----------
Object.keys(objectives).forEach(function (o) {
  if (!chapters[o]) warn("objective " + o, "has no chapter");
  if (!scenarios[o]) warn("objective " + o, "has no scenario");
  if (!(S.questions || []).some(function (q) { return q.o === o; })) warn("objective " + o, "has no practice questions");
});

// ---------- Report ----------
warnings.forEach(function (w) { console.log("warning: " + w); });
errors.forEach(function (e) { console.log("error: " + e); });
console.log(
  "\nChecked " + Object.keys(objectives).length + " objectives, " + (S.questions || []).length + " questions, " +
  (S.flashcards || []).length + " flashcards, " + Object.keys(chapters).length + " chapters, " +
  Object.keys(scenarios).length + " scenarios, " + (S.labs || []).length + " labs and " + (S.ports || []).length + " ports."
);
if (errors.length) {
  console.log(errors.length + " error(s), " + warnings.length + " warning(s).");
  process.exit(1);
}
console.log("No errors, " + warnings.length + " warning(s).");
