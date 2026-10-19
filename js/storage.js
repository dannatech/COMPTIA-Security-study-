// Progress persistence (localStorage) plus XP, streak and spaced-repetition logic.
window.SECPLUS = window.SECPLUS || {};

SECPLUS.store = (function () {
  var KEY = "secplus.v1";
  var DAILY_GOAL = 50;
  var XP_PER_LEVEL = 300;
  // Leitner box -> days until next review.
  var BOX_DAYS = [0, 0, 1, 3, 7, 14, 30];

  function defaults() {
    return {
      xp: 0,
      lessons: {},     // objId -> { done: true, score, total, date }
      labs: {},        // labId -> { best, total, passed, date }
      checkpoints: {}, // domainId -> { best, last, date }
      cards: {},       // cardId -> { box, due }
      questions: {},   // qid -> { seen, correct, last }
      history: [],     // { date, mode, label, score, total }
      activity: {},    // YYYY-MM-DD -> xp earned
      streak: { last: null, count: 0 }
    };
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) return Object.assign(defaults(), JSON.parse(raw));
    } catch (e) { /* storage unavailable or corrupt */ }
    return defaults();
  }

  var state = load();

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  function dayKey(d) {
    d = d || new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function yesterdayKey() {
    var d = new Date();
    d.setDate(d.getDate() - 1);
    return dayKey(d);
  }

  function touchStreak() {
    var t = dayKey();
    if (state.streak.last === t) return;
    state.streak.count = state.streak.last === yesterdayKey() ? state.streak.count + 1 : 1;
    state.streak.last = t;
  }

  return {
    DAILY_GOAL: DAILY_GOAL,
    XP_PER_LEVEL: XP_PER_LEVEL,
    get state() { return state; },
    dayKey: dayKey,

    addXP: function (n) {
      if (n <= 0) return;
      state.xp += n;
      var t = dayKey();
      state.activity[t] = (state.activity[t] || 0) + n;
      touchStreak();
      save();
    },

    todayXP: function () { return state.activity[dayKey()] || 0; },

    level: function () { return Math.floor(state.xp / XP_PER_LEVEL) + 1; },

    streak: function () {
      var s = state.streak;
      return (s.last === dayKey() || s.last === yesterdayKey()) ? s.count : 0;
    },

    recordAnswer: function (qid, correct) {
      var q = state.questions[qid] || { seen: 0, correct: 0 };
      q.seen++;
      if (correct) q.correct++;
      q.last = correct;
      state.questions[qid] = q;
      save();
    },

    completeLesson: function (objId, score, total) {
      var prev = state.lessons[objId];
      state.lessons[objId] = {
        done: true,
        score: prev ? Math.max(prev.score, score) : score,
        total: total,
        date: dayKey()
      };
      save();
    },

    completeLab: function (labId, score, total) {
      var prev = state.labs[labId];
      state.labs[labId] = {
        best: prev ? Math.max(prev.best, score) : score,
        total: total,
        passed: (prev && prev.passed) || score === total,
        date: dayKey()
      };
      save();
    },

    completeCheckpoint: function (domainId, pct) {
      var prev = state.checkpoints[domainId];
      state.checkpoints[domainId] = { best: prev ? Math.max(prev.best, pct) : pct, last: pct, date: dayKey() };
      save();
    },

    addHistory: function (entry) {
      entry.date = new Date().toISOString();
      state.history.push(entry);
      if (state.history.length > 200) state.history.shift();
      save();
    },

    cardDue: function (id) {
      var c = state.cards[id];
      return !c || c.due <= Date.now();
    },

    isNewCard: function (id) { return !state.cards[id]; },

    // rating: 0 = again, 1 = good, 2 = easy
    rateCard: function (id, rating) {
      var c = state.cards[id] || { box: 1 };
      if (rating === 0) c.box = 1;
      else c.box = Math.min(6, c.box + rating);
      c.due = Date.now() + BOX_DAYS[c.box] * 86400000;
      state.cards[id] = c;
      save();
      return c.box;
    },

    cardBox: function (id) { return state.cards[id] ? state.cards[id].box : 0; },

    exportJSON: function () { return JSON.stringify(state, null, 2); },

    importJSON: function (text) {
      var data = JSON.parse(text);
      if (typeof data !== "object" || data === null || typeof data.xp !== "number") {
        throw new Error("Not a valid progress file");
      }
      state = Object.assign(defaults(), data);
      save();
    },

    reset: function () {
      state = defaults();
      save();
    }
  };
})();
