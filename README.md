# Security+ Study Lab (SY0-701)

An interactive, DataCamp-style learning platform for the **CompTIA Security+ SY0-701** exam. It has bite-sized lessons with exercises, XP and streaks, hands-on PBQ-style labs, a 330-question bank, spaced-repetition flashcards, quizzes and a timed exam simulator.

> Unofficial study aid. Not affiliated with or endorsed by CompTIA.

## Features

| Area | What it does |
| --- | --- |
| **Dashboard** | "Continue learning" to your next lesson, a daily XP goal ring, level, streak, course progress, 14-day activity chart, and progress export/import |
| **Courses** | 5 courses (one per exam domain) with 28 in-depth chapters (one per exam objective), each ending in a 15-question **domain checkpoint** |
| **Interactive chapters** | Read a section, then answer a knowledge check about it before moving on. Each chapter ends with a worked exam scenario (with a step-by-step walkthrough), exam tips and common traps, and a 3-question chapter quiz |
| **Reading mode** | The full chapter as one page, with its table of contents and the same knowledge checks inline |
| **Hands-on labs** | 26 performance-based-style labs: firewall rule builders tested against simulated traffic, log analysis (select the malicious lines), drag-to-order steps, matching/categorizing, and risk/backup calculations |
| **Question bank** | 330 scenario questions covering all 28 objectives (at least 5 per objective), split by domain roughly in line with the exam weights |
| **Daily practice** | 5 questions, weighted toward your weakest domains |
| **Flashcards** | 220 cards (concepts + acronyms) with Leitner spaced repetition (Again / Good / Easy) |
| **Custom quiz** | Choose a domain and length; unseen questions come first |
| **Ports drill** | Type the port for each protocol, plus a reference table |
| **Exam simulation** | 25, 50 or 90 questions, timed (1 min/question), weighted by the official domain percentages, with flag-for-review, a question navigator, per-domain results and answer review |
| **Review mistakes** | Every question you last got wrong, until you get it right |

Keyboard shortcuts: `A`–`E` to select an answer, `Enter` to submit or continue, `Space` to flip a flashcard, `1`/`2`/`3` to rate it, `←`/`→` to move between exam questions.

## Running it

No build step and no dependencies. It's plain HTML, CSS and JavaScript.

- **Locally:** open `index.html` in a browser.
- **GitHub Pages:** in the repo, go to *Settings → Pages*, choose *Deploy from a branch*, pick the branch and `/ (root)`.

Progress is saved in your browser's `localStorage`. Use **Export progress** on the dashboard to back it up or move it to another device.

## Adding content

All study content lives in `js/data/`:

- `domains.js` holds the domains, weights and short per-objective notes.
- `chapters-d1.js` … `chapters-d5.js` hold the in-depth chapters: `{ overview, sections: [{ h, html }], tips, traps }`. Each section is followed by the most relevant question for that objective.
- `scenarios.js` holds one worked scenario per objective (question, choices, answer and an HTML walkthrough).
- `questions-d1.js` … `questions-d5.js` hold most of the question bank in a compact format: `[objective, question, choices, answer, explanation]`.
- `labs.js` holds the hands-on labs (types: `order`, `match`, `firewall`, `logs`, `numeric`). See the existing labs for each type's fields.
- `questions.js` holds the original practice questions. `a` is the index of the correct choice, or an array of indexes for "choose two". Choices are shuffled when shown, so they can be written in any order.
- `flashcards.js` holds the cards as `[domain, front, back]` (domain `0` = acronyms). Card progress is keyed by the front text.
- `ports.js` holds the ports and protocols.

Add a question with the right `o` (objective) and it automatically appears in that lesson, the quizzes and the exam simulator.

## Project structure

```
index.html          App shell and navigation
css/styles.css      Styles (light/dark themes, responsive)
js/storage.js       Progress, XP, streaks, spaced repetition (localStorage)
js/app.js           Router and all views
js/labs.js          Hands-on lab engines (ordering, matching, firewall, logs, numeric)
js/data/*.js        Study content
```
