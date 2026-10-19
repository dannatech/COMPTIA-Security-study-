# Security+ Study Lab (SY0-701)

An interactive, DataCamp-style learning platform for the **CompTIA Security+ SY0-701** exam. It has bite-sized lessons with exercises, XP and streaks, spaced-repetition flashcards, quizzes and a timed exam simulator.

> Unofficial study aid. Not affiliated with or endorsed by CompTIA.

## Features

| Area | What it does |
| --- | --- |
| **Dashboard** | "Continue learning" to your next lesson, a daily XP goal ring, level, streak, course progress, 14-day activity chart, and progress export/import |
| **Courses** | 5 courses (one per exam domain) with 28 lessons (one per exam objective) |
| **Lesson player** | Short concept slides alternate with exercises that give instant feedback and explanations. Every lesson has at least 3 exercises; extra term-match exercises are generated from the flashcards |
| **Daily practice** | 5 questions, weighted toward your weakest domains |
| **Flashcards** | 220 cards (concepts + acronyms) with Leitner spaced repetition (Again / Good / Easy) |
| **Custom quiz** | Choose a domain and length; unseen questions come first |
| **Ports drill** | Type the port for each protocol, plus a reference table |
| **Exam simulation** | Timed (1 min/question), weighted by the official domain percentages, with flag-for-review, a question navigator, per-domain results and answer review |
| **Review mistakes** | Every question you last got wrong, until you get it right |

Keyboard shortcuts: `A`–`E` to select an answer, `Enter` to submit or continue, `Space` to flip a flashcard, `1`/`2`/`3` to rate it, `←`/`→` to move between exam questions.

## Running it

No build step and no dependencies. It's plain HTML, CSS and JavaScript.

- **Locally:** open `index.html` in a browser.
- **GitHub Pages:** in the repo, go to *Settings → Pages*, choose *Deploy from a branch*, pick the branch and `/ (root)`.

Progress is saved in your browser's `localStorage`. Use **Export progress** on the dashboard to back it up or move it to another device.

## Adding content

All study content lives in `js/data/`:

- `domains.js` holds the domains, weights and per-objective lesson notes (each `points` entry is one bullet; lessons show 3 per slide).
- `questions.js` holds the practice questions. `a` is the index of the correct choice, or an array of indexes for "choose two". Choices are shuffled when shown, so they can be written in any order.
- `flashcards.js` holds the cards as `[domain, front, back]` (domain `0` = acronyms). Card progress is keyed by the front text.
- `ports.js` holds the ports and protocols.

Add a question with the right `o` (objective) and it automatically appears in that lesson, the quizzes and the exam simulator.

## Project structure

```
index.html          App shell and navigation
css/styles.css      Styles (light/dark themes, responsive)
js/storage.js       Progress, XP, streaks, spaced repetition (localStorage)
js/app.js           Router and all views
js/data/*.js        Study content
```
