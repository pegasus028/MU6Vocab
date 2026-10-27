# Back on Your Feet

A single-page self-study app for the 70 body, health and medical-care words, phrasal verbs and idioms of
*Gateway to the World B2* Unit 6 "Get fit, stay fit!" (Student's Book p.80), plus 10 bonus items the unit uses.
Sibling of **Money Matters** (`pegasus028/MU5Vocab`, Unit 5): same family, new identity. Built for T.Chris's
tutee Mikii (13, M2, B2, strong speaker, weak writer) and anyone else at B1–B2.

Live: `https://pegasus028.github.io/MU6Vocab/` · Content contract: `SPEC.md`

---

## Deploying to GitHub Pages

Push to `main`, then once only: **Settings → Pages → Deploy from a branch → `main` / (root)**. No build step,
no dependencies, no back end. `.nojekyll` is included.

```
MU6Vocab/
├── index.html        layout (shell); loads app.css, data/*.js, media.js, app.js
├── app.css           styles (light and dark)
├── app.js            the engine — holds NO content
├── media.js          ← THE ONLY FILE YOU EDIT TO ADD PODCASTS / VIDEOS / LINKS
├── SPEC.md           the content contract every writer followed
├── README.md
├── .nojekyll
├── art/              story illustrations (empty until the Gemini art run; see docs/)
├── tts-clean.js      turns on-screen text into spoken text (shared by the app and the recorder)
├── audio/tts/        one Sonia MP3 per spoken text (see Read-aloud recordings)
├── docs/             SOURCE-Praew-Art-Brief.md — the prompts for the 12 pages and the cover
├── tools/            validate.js, load.js, tts-list.js, make-audio.py, smoke.js, flow.js, audio-test.js
├── .github/workflows/record-audio.yml   records new or changed texts automatically on every push
└── data/
    ├── words.js      80 entries (70 targets + 10 bonus), fully defined
    ├── lexicon.js    every synonym and antonym as a full clickable entry
    ├── story.js      "Back on Her Feet": 5 chapters, 12 pages, all 80 items tagged
    ├── patterns.js   16 pattern cards (3 with interactive drills)
    ├── bodymap.js    the SVG figure, regions, Find-it prompts, Where-does-it-hurt cases
    ├── tests.js      Placement Check 24, Final B1 20, Final B2 20, Exam Room A–D, Clinic Shift 12
    ├── writing.js    5 Writing Clinic missions, error flags, linkers
    ├── roleplay.js   MATCH regexes, The Comeback Interview scene, nudges
    └── tts.js        generated manifest of recorded clips (do not edit)
```

## What is in it

- **🏠 Home** — one "next step" computed from progress (Placement Check → route → Recovery Ward → weakest area →
  Exam Room → boss), progress per area, rank (Shuttle Rookie → Champion), a weekly target of 4 study days
  (no streak punishment), surprise badges, media shelf, **Copy my report** for Line.
- **📖 Story** — *Back on Her Feet*: Praew dislocates her shoulder, Mali comes down with flu, Yai's cabinet meets a
  science project, physio, the final. Every gold word opens its card; 🔊 Listen plays the recorded page.
  The grammar modelled on each page is named under the text. The boss unlocks after page 11.
- **🧍 Body Map** — Explore (Outside / Inside, Front / Back), Find it (60-second clock), Name it (typed),
  Where does it hurt? (tap the place, then choose the word).
- **📇 Words** — 80 cards in six areas plus Bonus; filters by type, level (A2–C2 and "not graded") and area; search.
  Cards: meaning, two examples with Sonia audio, British IPA, synonyms and antonyms at B1/B2/C1 (every one opens its
  own full entry, never "synonym of …"), collocations, word family, the textbook line, a Thai note, a trap line.
- **🧠 Patterns** — 16 cards: the patient journey, the body in layers, healthy-is-up, the idiom thermometer,
  word building, British health English, word stories, particles, sounds, Thai contrasts. Three carry drills.
- **🎯 Tests** — Placement Check (router, 4 per area), Final B1, Final B2, Exam Room A (Test yourself), B (B2 First-style
  Use of English), C (Thai school / TU style), D (IELTS listen-and-spell and Speaking), Clinic Shift, and the
  **Recovery Ward** (Leitner boxes at 0/2/4/7/14 days; typed recall alternates with MCQ; a word is discharged only after
  a correct typed answer at the 14-day visit; a wrong answer goes back one box, never to the start).
- **✍️ Writing Clinic** — five typed missions (40–120 words) with instant offline feedback: target words found,
  word count against the band, linkers, grammar ticks, and "Check:" flags for predictable Thai-learner slips.
  **Copy for T.Chris** copies the text plus a summary. Drafts are saved on the device.
- **🎭 Roleplay** — *The Comeback Interview*: seven typed answers to Coach Nok and Khun Fern; target 15 of the 70 items.
- **🎧 Media** — podcast, video and extras shelves filled from `media.js`.

All progress lives in `localStorage` under the key **`mu6vocab.v1`**. Money Matters uses `moneymatters.v1` on the same
origin; ↺ clears only this app's key.

## Editing content

Everything a teacher might change is in `data/` or `media.js`; `app.js` holds no content.

- **Words and cards:** `data/words.js` (schema at the top of the file and in `SPEC.md` §7). A synonym or antonym you add
  must also get an entry in `data/lexicon.js`, or it will not be tappable. Use `null` for a level that is not graded.
- **Story:** `data/story.js`. Mark a target item as `{{id|surface form}}`. Every one of the 80 ids must be tagged at least once.
- **Tests:** `data/tests.js`. Four options, one answer, `why` ≤ 35 words, no option letters. Typed items carry
  `answerText` and `accept:[]` (every acceptable variant).
- **Writing missions and flags:** `data/writing.js`. The error flags are teacher predictions, not corpus findings —
  marked unverified in the file; edit the regexes freely.
- **Roleplay:** `data/roleplay.js` (`MATCH` regexes, the scene, the nudges).
- **Body map:** `data/bodymap.js` (SVG paths, regions, prompts, cases).

After any edit run the checks (needs Node):

```
node tools/validate.js --strict         # structure, ids, key balance, why length, lexicon coverage …
for f in app.js media.js data/*.js tools/*.js; do node --check "$f" || echo "FAIL $f"; done
```

Then bump the `?v=` query on the script tags in `index.html` so phones pick up the change.

## Adding a podcast or video

Open `media.js`; the instructions are at the top. Paste an episode object into `MEDIA.podcast.episodes` or
`MEDIA.video.episodes` (YouTube ID or a file in the repo). Chips appear on the matching chapter, words and pattern cards
automatically.

## Read-aloud recordings (Sonia)

Every 🔊 plays a pre-recorded clip in Microsoft Sonia (British English, `en-GB-SoniaNeural`, rate −10%), so it sounds
the same on every device, including iPad Safari. The browser's own voice is only a fallback for a missing clip.

**What is read aloud:** the story (paragraph by paragraph, with the paragraph being read highlighted) and each page's
grammar line; all 16 pattern cards (title, insight, examples, drill, and the reveal after a drill); every word card
(word, meaning, both examples, textbook line, trap, tip) and every linked synonym/antonym card (headword, meaning,
examples, note); the Body Map definitions, Find-it prompts and Where-does-it-hurt cases with their explanations; the
Clinic Shift patients and explanations; the Writing Clinic briefs and model answers; the roleplay brief and every line
Coach Nok and Khun Fern say; the Exam Room listening sentences. Test questions stay silent on purpose (except the
listening items), so audio never gives an answer away. The Thai-contrast card is recorded with the Thai phrases in a
Thai voice (Premwadee) joined to Sonia's English.

**Controls:** tap a 🔊 to play; tap it again to pause, again to resume. Longer reads (story pages, pattern cards,
model answers, briefs) open a player bar at the bottom: pause/resume, ⏮ ⏭ between parts, ■ stop. On the story,
"Turn the pages for me" keeps reading page after page. Changing tab or page stops the voice.

**Re-recording:** any change to a spoken text needs a new clip, or that item drops to the browser voice. This happens
by itself: `.github/workflows/record-audio.yml` runs `make-audio.py` on every push that touches `data/`, records only new
or changed texts, deletes orphans and commits `audio/` and `data/tts.js` back to `main` (check the Actions tab). To do it
by hand instead:

```
pip install edge-tts          # ffmpeg is also needed, only for the clips that mix Thai and English
python tools/make-audio.py --prune      # records new or changed texts, deletes orphans, rewrites data/tts.js
git add audio data/tts.js && git commit
```

`tools/tts-list.js` prints exactly what the app speaks (and the key of each clip); `make-audio.py` rejects clips that come
back cut off and retries. From a proxied network set `TTS_CA_BUNDLE=<ca file>`. If you change what a screen reads, change
`tools/tts-list.js` to match, and run `node tools/audio-test.js` (with `python3 -m http.server 8077` running) to check
that every 🔊 has a clip and that pause/resume/stop work.

## Story illustrations (the one Gemini step)

The pages fall back to coloured emoji panels until art exists. To make the 12 page pictures and the cover:

1. Open `docs/SOURCE-Praew-Art-Brief.md` — the character reference sheet and one prompt per picture.
2. Follow T.Chris's `gemini-storybook-art` workflow in the Gemini app (reference sheet first, then one picture per prompt).
3. Save each picture as 800 px webp into `art/` with the file names in the brief (`art/ch1p1.webp` … `art/cover.webp`)
   and set `img:"art/ch1p1.webp"` on the matching page in `data/story.js`.

Gemini is used for these 13 pictures only. The body map and all icons are drawn in code.

## Tests

```
python3 -m http.server 8077 &                                  # serve the folder (file:// blocks audio)
NODE_PATH=$(npm root -g) node tools/smoke.js                   # every tab, desktop and 390 px, light and dark, no page errors, no overflow
NODE_PATH=$(npm root -g) node tools/flow.js                    # cards, story with audio, body map, placement + route, Final B2, Exam Room, writing flags, roleplay, ward, reset isolation
```

## Credits

Content and design by T.Chris (Satriwithaya EP) with Claude. Vocabulary from *Gateway to the World B2* (Macmillan), used in
the book's senses with original sentences. Research sources are listed in `SPEC.md` §10. This is a language app, not
medical advice; in Thailand a medical emergency is **1669**.
