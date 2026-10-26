#!/usr/bin/env node
/* Back on Your Feet — structural validator for every file in data/.
   Usage:  node tools/validate.js            (checks whatever data files exist; missing files are warnings)
           node tools/validate.js --strict   (every file must exist; used before review, audio and ship)
   Exit code 1 on any error. Writers run this on their own files before reporting back. */
"use strict";
const fs = require("fs"), path = require("path");
const load = require("./load.js");
const DATA = path.join(__dirname, "..", "data");
const strict = process.argv.includes("--strict");

/* ---------- the fixed contract (SPEC.md section 2) ---------- */
const AREAS = {
  body: ["ankle","chest","eyebrow","eyelash","eyelid","forehead","heel","hip","kidney","liver","lungs","muscle","nail","ribs","thigh","waist"],
  injury: ["injure","injury","broken","fracture","dislocate","painful","ae","xray","operation"],
  symptoms: ["symptom","fever","temperature","ache","headache","cough","sneeze","sore","sick","dizzy","dizziness","tiredness","exhaustion","stiff","stiffness"],
  germs: ["flu","germ","infection","infectious","passon","injection","vaccine"],
  care: ["gp","chemist","prescription","painkiller","relief","remedy","treat","treatment","lower","heal","getbetter","physio"],
  idioms: ["backonfeet","blackout","comedownwith","fullofbeans","keepinshape","ontopofworld","lastlegs","outofshape","pullthrough","pictureofhealth","undertheweather"],
  bonus: ["upandabout","sling","cope","fromscratch","lethal","pickup","suspect","relieve","sideeffect","property"]
};
const AREA_ORDER = ["body","injury","symptoms","germs","care","idioms","bonus"];
const ALL_IDS = [].concat(...AREA_ORDER.map(a => AREAS[a]));
const TARGET_IDS = ALL_IDS.filter(id => !AREAS.bonus.includes(id));   // the 70
const CLUSTER_OF = {}; AREA_ORDER.forEach(a => AREAS[a].forEach(id => CLUSTER_OF[id] = a));
const PHRASAL = ["blackout","comedownwith","pullthrough","passon","getbetter","pickup"];
const IDIOM = ["backonfeet","fullofbeans","keepinshape","ontopofworld","lastlegs","outofshape","pictureofhealth","undertheweather","upandabout","fromscratch"];
const PATTERN_IDS = ["journey","layers","updown","thermometer","fuel","ness","tion","spellchange","hurtinjure","ache","whofixes","british","stories","particles","sounds","thai"];
const GAME_CARDS = { journey:"sort", thermometer:"scale", sounds:"listen" };
const LEVELS = [null,"A2","B1","B2","C1","C2"];
const MCQ_TYPES = ["gap","meaning","idiom","coll","odd","sub","error","context","situation","picture","define","conv","mccloze"];
const TYPED_TYPES = ["typed","unscramble","wordform","opencloze","transform","listenspell"];
const STORY_PAGES = 12, STORY_CHAPTERS = 5;

const errs = [], warns = [];
const E = (f, m) => errs.push(f + ": " + m);
const Wn = (f, m) => warns.push(f + ": " + m);
const isStr = s => typeof s === "string" && s.trim().length > 0;
const words = s => String(s || "").trim().split(/\s+/).filter(Boolean).length;

/* ---------- parse every file in its own sandbox ---------- */
const have = {};
fs.readdirSync(DATA).filter(f => f.endsWith(".js")).forEach(f => {
  try { load.one(path.join(DATA, f)); have[f] = true; }
  catch (e) { E(f, "does not parse: " + e.message); }
});
let ctx = {};
try { ctx = load(DATA); } catch (e) { E("data/", "load failed: " + e.message); }
const need = (file, key) => {
  if (!have[file]) { (strict ? E : Wn)(file, "missing"); return null; }
  if (ctx[key] === undefined) { E(file, "does not define window." + key); return null; }
  return ctx[key];
};

/* ================= words.js ================= */
const W = need("words.js", "WORDS");
const BY = {};
if (W) {
  const f = "words.js";
  if (!Array.isArray(W)) E(f, "WORDS must be an array");
  else {
    W.forEach((w, i) => {
      const tag = "entry " + (w && w.id ? w.id : "#" + i);
      if (!w || !isStr(w.id)) return E(f, tag + ": missing id");
      if (BY[w.id]) E(f, tag + ": duplicate id"); BY[w.id] = w;
      if (!ALL_IDS.includes(w.id)) E(f, tag + ": id is not one of the 80 fixed ids");
      if (!isStr(w.word)) E(f, tag + ": word");
      if (!isStr(w.pos)) E(f, tag + ": pos");
      if (!LEVELS.includes(w.cefr)) E(f, tag + ": cefr must be A2|B1|B2|C1|C2 or null, got " + JSON.stringify(w.cefr));
      if (!["core","idiom","phrasal","bonus"].includes(w.group)) E(f, tag + ": group");
      if (w.cluster !== CLUSTER_OF[w.id]) E(f, tag + ": cluster should be " + CLUSTER_OF[w.id] + ", got " + w.cluster);
      if (AREAS.bonus.includes(w.id) && w.group !== "bonus") E(f, tag + ": bonus items use group 'bonus'");
      if (!AREAS.bonus.includes(w.id) && PHRASAL.includes(w.id) && w.group !== "phrasal") E(f, tag + ": should be group 'phrasal'");
      if (!AREAS.bonus.includes(w.id) && IDIOM.includes(w.id) && w.group !== "idiom") E(f, tag + ": should be group 'idiom'");
      if (!AREAS.bonus.includes(w.id) && !PHRASAL.includes(w.id) && !IDIOM.includes(w.id) && w.group !== "core") E(f, tag + ": should be group 'core'");
      if (!(w.ch >= 1 && w.ch <= STORY_CHAPTERS)) E(f, tag + ": ch 1–5");
      if (!isStr(w.ipa) || !/^\/.+\/$/.test(w.ipa.trim())) E(f, tag + ": ipa must be /…/");
      if (!isStr(w.def) || /synonym of|antonym of/i.test(w.def)) E(f, tag + ": def missing or lazy");
      if (!Array.isArray(w.ex) || w.ex.length !== 2 || !w.ex.every(isStr)) E(f, tag + ": ex needs exactly 2 sentences");
      ["syn","ant"].forEach(k => {
        if (!w[k] || typeof w[k] !== "object") return E(f, tag + ": " + k + " object");
        ["B1","B2","C1"].forEach(l => { const v = w[k][l]; if (v !== null && v !== undefined && !isStr(v)) E(f, tag + ": " + k + "." + l); });
        const n = ["B1","B2","C1"].filter(l => isStr(w[k][l])).length;
        if (n < 2) E(f, tag + ": " + k + " needs at least 2 of B1/B2/C1");
      });
      if (!Array.isArray(w.colls) || w.colls.length < 3) E(f, tag + ": colls needs 3+");
      if (!Array.isArray(w.family) || w.family.length < 1) E(f, tag + ": family");
      if (!isStr(w.textbook) || !/p\.\d\d/.test(w.textbook)) E(f, tag + ": textbook line must name a page (p.70)");
      if (w.thai !== undefined && w.thai !== null && !isStr(w.thai)) E(f, tag + ": thai");
      if (w.trap !== undefined && w.trap !== null && !isStr(w.trap)) E(f, tag + ": trap");
      if (AREAS.body.includes(w.id)) { if (!["outside","inside"].includes(w.layer)) E(f, tag + ": body parts need layer outside|inside"); }
      else if (w.layer) E(f, tag + ": only body parts carry layer");
      if (w.tip !== undefined && typeof w.tip !== "string") E(f, tag + ": tip must be a string");
    });
    ALL_IDS.forEach(id => { if (!BY[id]) E(f, "missing entry for fixed id " + id); });
    if (W.length !== 80) E(f, "expected 80 entries, found " + W.length);
  }
}

/* ================= lexicon.js ================= */
const LEX = need("lexicon.js", "LEXICON");
if (LEX) {
  const f = "lexicon.js";
  Object.keys(LEX).forEach(t => {
    const e = LEX[t], tag = '"' + t + '"';
    if (!e || typeof e !== "object") return E(f, tag + ": not an object");
    if (!isStr(e.pos)) E(f, tag + ": pos");
    if (!LEVELS.includes(e.cefr)) E(f, tag + ": cefr");
    if (!isStr(e.def) || /synonym of|antonym of|opposite of|same as/i.test(e.def)) E(f, tag + ": def missing or lazy");
    if (!Array.isArray(e.ex) || e.ex.length < 2 || !e.ex.every(isStr)) E(f, tag + ": ex needs 2");
    if (e.colls && !Array.isArray(e.colls)) E(f, tag + ": colls");
    if (e.ipa && !/^\/.+\/$/.test(e.ipa.trim())) E(f, tag + ": ipa must be /…/");
  });
  if (W && Array.isArray(W)) W.forEach(w => ["syn","ant"].forEach(k => ["B1","B2","C1"].forEach(l => {
    const t = w[k] && w[k][l]; if (isStr(t) && !LEX[t]) E(f, "no entry for " + k + " " + l + ' "' + t + '" of ' + w.id);
  })));
  if (!LEX["willow bark"]) Wn(f, 'spec asks for a "willow bark" entry (p.71)');
}

/* ================= story.js ================= */
const STORY = need("story.js", "STORY");
const tagged = {};
if (STORY) {
  const f = "story.js";
  if (!isStr(STORY.title) || !isStr(STORY.blurb)) E(f, "title/blurb");
  const chs = STORY.chapters || [];
  if (chs.length !== STORY_CHAPTERS) E(f, "expected 5 chapters, found " + chs.length);
  let pages = 0;
  chs.forEach((c, ci) => {
    if (c.n !== ci + 1) E(f, "chapter " + ci + " n should be " + (ci + 1));
    if (!isStr(c.title) || !isStr(c.subtitle)) E(f, "chapter " + (ci + 1) + ": title/subtitle");
    (c.pages || []).forEach((p, pi) => {
      pages++;
      const tag = "ch" + (ci + 1) + " p" + (pi + 1);
      if (!isStr(p.art)) E(f, tag + ": art emoji");
      if (!["warm","cool","bright"].includes(p.tint)) E(f, tag + ": tint warm|cool|bright");
      if (typeof p.img !== "string") E(f, tag + ": img must be a string (empty until art exists)");
      if (!isStr(p.alt)) E(f, tag + ": alt");
      if (!isStr(p.prompt)) E(f, tag + ": prompt (for the art brief)");
      if (!isStr(p.grammar)) E(f, tag + ": grammar line");
      if (!isStr(p.text)) return E(f, tag + ": text");
      const plain = p.text.replace(/\{\{([a-z]+)\|([^}]*)\}\}/g, "$2");
      const n = words(plain);
      if (n < 100 || n > 175) Wn(f, tag + ": " + n + " words (target 110–160)");
      let m; const rx = /\{\{([a-z]+)\|([^}]*)\}\}/g;
      while ((m = rx.exec(p.text))) {
        if (!ALL_IDS.includes(m[1])) E(f, tag + ": tag {{" + m[1] + "}} is not a fixed id");
        if (!isStr(m[2])) E(f, tag + ": empty surface for " + m[1]);
        tagged[m[1]] = (tagged[m[1]] || 0) + 1;
      }
      if (/\{\{[^}]*$/.test(p.text) || /\{[^{]|[^}]\}/.test(p.text.replace(/\{\{[a-z]+\|[^}]*\}\}/g, ""))) E(f, tag + ": broken {{ }} markup");
      if (p.img && !fs.existsSync(path.join(__dirname, "..", p.img))) Wn(f, tag + ": img " + p.img + " not found");
    });
  });
  if (pages !== STORY_PAGES) E(f, "expected 12 pages, found " + pages);
  ALL_IDS.forEach(id => { if (!tagged[id]) E(f, "id never tagged in the story: " + id); });
}

/* ================= patterns.js ================= */
const PATS = need("patterns.js", "PATTERNS");
if (PATS) {
  const f = "patterns.js";
  if (!Array.isArray(PATS)) E(f, "PATTERNS must be an array");
  else {
    const seen = {};
    PATS.forEach((p, i) => {
      const tag = "card " + (p.id || "#" + i);
      if (!isStr(p.id)) return E(f, tag + ": id");
      if (seen[p.id]) E(f, tag + ": duplicate"); seen[p.id] = 1;
      if (!PATTERN_IDS.includes(p.id)) E(f, tag + ": id not in the 16 fixed card ids");
      ["icon","title","kind","insight","drill"].forEach(k => { if (!isStr(p[k])) E(f, tag + ": " + k); });
      if (!Array.isArray(p.items) || !p.items.length) E(f, tag + ": items");
      else p.items.forEach(id => { if (!ALL_IDS.includes(id)) E(f, tag + ": item " + id + " unknown"); });
      if (!Array.isArray(p.examples) || p.examples.length < 2) E(f, tag + ": examples needs 2+");
      if (GAME_CARDS[p.id]) {
        if (!p.game || p.game.kind !== GAME_CARDS[p.id]) E(f, tag + ": needs game.kind " + GAME_CARDS[p.id]);
        else {
          if (p.game.kind !== "listen" && (!Array.isArray(p.game.slots) || p.game.slots.length < 2)) E(f, tag + ": game.slots");
          if (!Array.isArray(p.game.items) || !p.game.items.length) E(f, tag + ": game.items");
          else p.game.items.forEach(it => {
            const id = typeof it === "string" ? it : it && it.id;
            if (!ALL_IDS.includes(id)) E(f, tag + ": game item " + id + " unknown");
            if (p.game.kind !== "listen" && (typeof it !== "object" || typeof it.slot !== "number")) E(f, tag + ": game items need {id, slot}");
          });
        }
      } else if (p.game) E(f, tag + ": only cards journey/thermometer/sounds carry game");
    });
    PATTERN_IDS.forEach(id => { if (!seen[id]) E(f, "missing card " + id); });
  }
}

/* ================= bodymap.js ================= */
const BODY = need("bodymap.js", "BODY");
const REGION = {};
if (BODY) {
  const f = "bodymap.js";
  ["front","back"].forEach(v => {
    const view = BODY.views && BODY.views[v];
    if (!view) return E(f, "views." + v);
    if (!isStr(view.viewBox)) E(f, "views." + v + ".viewBox");
    if (!isStr(view.base)) E(f, "views." + v + ".base (svg markup)");
  });
  (BODY.regions || []).forEach((r, i) => {
    const tag = "region " + (r.id || "#" + i);
    if (!isStr(r.id)) return E(f, tag + ": id");
    if (REGION[r.id]) E(f, tag + ": duplicate"); REGION[r.id] = r;
    if (!AREAS.body.includes(r.word)) E(f, tag + ": word must be a body-part id");
    if (!["outside","inside"].includes(r.layer)) E(f, tag + ": layer");
    if (!["front","back"].includes(r.view)) E(f, tag + ": view front|back");
    if (r.side !== null && r.side !== undefined && !["left","right"].includes(r.side)) E(f, tag + ": side left|right|null");
    if (!isStr(r.path)) E(f, tag + ": path (svg d)");
    if (!Array.isArray(r.label) || r.label.length !== 2) E(f, tag + ": label [x,y]");
  });
  AREAS.body.forEach(id => { if (!Object.values(REGION).some(r => r.word === id)) E(f, "no region for body part " + id); });
  const fp = BODY.findPrompts || [];
  if (fp.length < 16) E(f, "findPrompts needs 16+, found " + fp.length);
  fp.forEach((p, i) => { if (!isStr(p.text) || !REGION[p.region]) E(f, "findPrompt #" + i + " text/region"); });
  const hc = BODY.hurtCases || [];
  if (hc.length < 12) E(f, "hurtCases needs 12, found " + hc.length);
  hc.forEach((c, i) => {
    const tag = "hurtCase #" + i;
    if (!isStr(c.text) || !REGION[c.region]) E(f, tag + ": text/region");
    checkOptions(f, tag, c);
  });
}

/* ================= tests.js ================= */
function checkOptions(f, tag, q) {
  if (!Array.isArray(q.options) || q.options.length !== 4) return E(f, tag + ": 4 options");
  if (new Set(q.options.map(o => String(o).trim().toLowerCase())).size !== 4) E(f, tag + ": options not distinct");
  if (!(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < 4)) E(f, tag + ": answer 0–3");
  if (!isStr(q.why)) E(f, tag + ": why");
  else {
    if (words(q.why) > 35) E(f, tag + ": why is " + words(q.why) + " words (max 35)");
    if (/\b(option|answer|choice)\s*[A-D]\b|\b[A-D]\)|\(\s*[A-D]\s*\)|^\s*[A-D]\b\s*(is|was)/i.test(q.why)) E(f, tag + ": why mentions an option letter");
  }
}
function keyStats(f, name, qs) {
  const pos = [0,0,0,0]; let longest = 0, run = 0, prev = -1, n = 0;
  qs.forEach(q => {
    if (!Array.isArray(q.options) || q.options.length !== 4) return;
    n++; pos[q.answer]++;
    const lens = q.options.map(o => String(o).length), mx = Math.max(...lens);
    if (lens[q.answer] === mx && lens.filter(l => l === mx).length === 1) longest++;
    if (q.answer === prev) { run++; if (run >= 3) E(f, name + ": key in the same position 3 times running at item " + n); } else run = 1;
    prev = q.answer;
  });
  if (!n) return;
  pos.forEach((c, i) => { const p = c / n; if (p < 0.15 || p > 0.35) E(f, name + ": key position " + "ABCD"[i] + " is " + Math.round(p * 100) + "% (want ~25%)"); });
  if (longest / n > 0.30) E(f, name + ": key is the longest option " + Math.round(longest / n * 100) + "% (max 30%)");
}
function checkMcq(f, tag, q, needTests) {
  if (!isStr(q.type)) E(f, tag + ": type");
  if (!isStr(q.prompt)) E(f, tag + ": prompt");
  if (needTests) {
    if (!BY[q.tests] && !ALL_IDS.includes(q.tests)) E(f, tag + ": tests must be a word id");
    else if (q.cluster !== CLUSTER_OF[q.tests]) E(f, tag + ": cluster should be " + CLUSTER_OF[q.tests]);
  }
  if (q.type === "gap" && !/_{3,}/.test(q.prompt)) E(f, tag + ": gap item needs ___ in the prompt");
  if (q.type === "picture" && !isStr(q.region)) E(f, tag + ": picture item needs region");
  if (q.type === "picture" && Object.keys(REGION).length && !REGION[q.region]) E(f, tag + ": region " + q.region + " not in bodymap");
  if (q.level && !LEVELS.includes(q.level)) E(f, tag + ": level");
  checkOptions(f, tag, q);
}
function checkTyped(f, tag, q) {
  if (!isStr(q.prompt)) E(f, tag + ": prompt");
  if (!isStr(q.answerText)) E(f, tag + ": typed item needs answerText");
  if (!Array.isArray(q.accept)) E(f, tag + ": accept[] (may be empty)");
  if (!isStr(q.why)) E(f, tag + ": why");
  else if (words(q.why) > 35) E(f, tag + ": why too long");
  if (q.tests && !ALL_IDS.includes(q.tests)) E(f, tag + ": tests id unknown");
  if (q.type === "listenspell" && !isStr(q.say)) E(f, tag + ": listenspell needs say (the sentence Sonia reads)");
  if (q.type === "wordform" && !isStr(q.stem)) E(f, tag + ": wordform needs stem");
  if (q.type === "transform" && !isStr(q.keyword)) E(f, tag + ": transform needs keyword");
  if (q.type === "transform") {
    const n = words(q.answerText); if (n < 2 || n > 5) E(f, tag + ": transformation answer must be 2–5 words");
  }
}
const TESTS = need("tests.js", "TESTS");
if (TESTS) {
  const f = "tests.js";
  const set = (key, n, perArea) => {
    const t = TESTS[key]; if (!t) return E(f, "missing " + key);
    ["id","title","subtitle"].forEach(k => { if (!isStr(t[k])) E(f, key + ": " + k); });
    const qs = t.questions || [];
    if (qs.length !== n) E(f, key + ": expected " + n + " questions, found " + qs.length);
    qs.forEach((q, i) => {
      checkMcq(f, key + " #" + (i + 1), q, true);
      if (!MCQ_TYPES.includes(q.type)) E(f, key + " #" + (i + 1) + ": type " + q.type + " unknown");
      if (key === "triage" && AREAS.bonus.includes(q.tests)) E(f, key + " #" + (i + 1) + ": bonus items never appear in the Placement Check");
    });
    if (perArea) AREA_ORDER.filter(a => a !== "bonus").forEach(a => {
      const c = qs.filter(q => q.cluster === a).length; if (c !== 4) E(f, key + ": area " + a + " has " + c + " items (need 4)");
    });
    keyStats(f, key, qs);
    const types = new Set(qs.map(q => q.type)); if (types.size < 4) E(f, key + ": fewer than 4 question types");
  };
  set("triage", 24, true); set("finalB1", 20, false); set("finalB2", 20, false);
  if (TESTS.finalB2) {
    const ids = new Set((TESTS.finalB2.questions || []).map(q => q.tests));
    AREAS.idioms.forEach(id => { if (!ids.has(id)) E(f, "finalB2 must include idiom " + id); });
  }
  /* exam room */
  const ex = TESTS.exam || [];
  const expect = { A1:8, A2:9, A3:7, B1:8, B2:8, B3:8, B4:6, C1:20, D1:10, D2:6 };
  const found = {};
  if (!Array.isArray(ex)) E(f, "exam must be an array");
  else ex.forEach((s, i) => {
    const tag = "exam " + (s.id || "#" + i);
    if (!isStr(s.id)) return E(f, tag + ": id");
    found[s.id] = 1;
    ["part","title","instructions"].forEach(k => { if (!isStr(s[k])) E(f, tag + ": " + k); });
    if (/^[BD]/.test(s.id) && !/format unofficial/i.test(s.title + " " + s.instructions + " " + (s.label || ""))) E(f, tag + ": B2 First and IELTS sets carry the label '…-style practice (format unofficial)'");
    const items = s.items || [];
    if (expect[s.id] && items.length !== expect[s.id]) E(f, tag + ": expected " + expect[s.id] + " items, found " + items.length);
    const mcqs = [];
    items.forEach((q, j) => {
      const t = tag + " item " + (j + 1);
      if (TYPED_TYPES.includes(q.type)) checkTyped(f, t, q);
      else if (q.type === "define") {
        if (!ALL_IDS.includes(q.tests)) E(f, t + ": define needs tests id");
        if (!isStr(q.model)) E(f, t + ": define needs model sentence");
        if (!q.check) E(f, t + ": define needs check {options, answer, why}"); else { checkOptions(f, t + " check", q.check); mcqs.push(q.check); }
      }
      else if (q.type === "speak") { if (!isStr(q.prompt) || !isStr(q.part)) E(f, t + ": speak needs prompt and part"); }
      else { checkMcq(f, t, q, !!q.tests); mcqs.push(q); }
    });
    if (mcqs.length >= 8) keyStats(f, tag, mcqs);
  });
  Object.keys(expect).forEach(id => { if (!found[id]) E(f, "exam set " + id + " missing"); });
  /* clinic shift */
  const cs = TESTS.clinicShift || [];
  if (cs.length !== 12) E(f, "clinicShift: expected 12 cards, found " + cs.length);
  cs.forEach((c, i) => {
    const tag = "clinicShift #" + (i + 1);
    if (!isStr(c.id) || !isStr(c.patient)) E(f, tag + ": id/patient");
    if (!["home","chemist","gp","ae"].includes(c.route)) E(f, tag + ": route");
    if (!ALL_IDS.includes(c.word)) E(f, tag + ": word id");
    checkOptions(f, tag, c);
    if (c.options && c.options[c.answer] && BY[c.word] && String(c.options[c.answer]).toLowerCase() !== BY[c.word].word.toLowerCase())
      Wn(f, tag + ": keyed option '" + c.options[c.answer] + "' differs from word '" + BY[c.word].word + "'");
  });
  if (cs.length) keyStats(f, "clinicShift", cs);
  const routes = {}; cs.forEach(c => routes[c.route] = (routes[c.route] || 0) + 1);
  ["home","chemist","gp","ae"].forEach(r => { if (!routes[r]) E(f, "clinicShift: no card routes to " + r); });
}

/* ================= writing.js ================= */
const WR = need("writing.js", "WRITING");
if (WR) {
  const f = "writing.js";
  const ms = WR.missions || [];
  if (ms.length !== 5) E(f, "expected 5 missions, found " + ms.length);
  ms.forEach((m, i) => {
    const tag = "mission " + (m.id || "#" + i);
    if (!/^W[1-5]$/.test(m.id || "")) E(f, tag + ": id W1–W5");
    ["title","brief","model","grammar","type"].forEach(k => { if (!isStr(m[k])) E(f, tag + ": " + k); });
    if (!(m.min > 0 && m.max > m.min)) E(f, tag + ": min/max");
    if (!Array.isArray(m.mustUse) || m.mustUse.length < 4) E(f, tag + ": mustUse 4+ ids");
    else m.mustUse.forEach(id => { if (!ALL_IDS.includes(id)) E(f, tag + ": mustUse " + id + " unknown"); });
    if (!Array.isArray(m.linkers)) E(f, tag + ": linkers[]");
    if (m.id === "W5" && m.mustUse && m.mustUse.some(id => AREAS.idioms.includes(id))) E(f, tag + ": W5 is neutral register, no idioms in mustUse");
    if (isStr(m.model)) { const n = words(m.model); if (n < m.min || n > m.max + 10) Wn(f, tag + ": model is " + n + " words, band " + m.min + "–" + m.max); }
  });
  const fl = WR.errorFlags || [];
  if (fl.length < 12) E(f, "errorFlags needs 12+, found " + fl.length);
  fl.forEach((x, i) => {
    const tag = "flag #" + i;
    if (!isStr(x.rx)) return E(f, tag + ": rx");
    try { new RegExp(x.rx, "i"); } catch (e) { E(f, tag + ": rx does not compile: " + e.message); }
    if (!isStr(x.says) || !isStr(x.fix)) E(f, tag + ": says/fix");
    if (isStr(x.says) && !/^Check:/.test(x.says)) E(f, tag + ": says must start with 'Check:'");
  });
  const src = fs.readFileSync(path.join(DATA, "writing.js"), "utf8");
  if (!/unverified/i.test(src)) E(f, "the error flags must be marked unverified in a code comment");
}

/* ================= roleplay.js ================= */
const RP = need("roleplay.js", "ROLEPLAY");
if (RP) {
  const f = "roleplay.js";
  const M = RP.MATCH || {};
  ALL_IDS.forEach(id => {
    if (!isStr(M[id])) return E(f, "MATCH missing regex for " + id);
    let rx; try { rx = new RegExp("\\b(?:" + M[id] + ")\\b", "i"); } catch (e) { return E(f, "MATCH " + id + " does not compile: " + e.message); }
    if (BY[id]) { const base = BY[id].word.replace(/\s*\(.*?\)\s*/g, "").replace(/\s*\/.*$/, "").trim();
      if (!rx.test(base) && !rx.test("I " + base) && !rx.test(base + " it")) E(f, "MATCH " + id + " does not match its base form '" + base + "'"); }
  });
  const S = RP.SCENE || {};
  ["title","sub","brief"].forEach(k => { if (!isStr(S[k])) E(f, "SCENE." + k); });
  if (S.target !== 15) E(f, "SCENE.target must be 15");
  if (!S.speakers || !isStr(S.speakers.them)) E(f, "SCENE.speakers.them");
  if (!Array.isArray(S.turns) || S.turns.length !== 8) E(f, "SCENE.turns must have 8 lines (7 answers + verdict)");
  else S.turns.forEach((t, i) => { if (!isStr(t.who) || !isStr(t.text)) E(f, "turn " + (i + 1) + ": who/text"); });
  if (!Array.isArray(S.nudges) || S.nudges.length !== 4) E(f, "SCENE.nudges needs 4");
}

/* ================= tts.js (generated) ================= */
if (have["tts.js"]) { const T = ctx.TTS; if (!T || !Array.isArray(T.keys)) E("tts.js", "window.TTS.keys[]"); }

/* ---------- report ---------- */
warns.forEach(w => console.log("warn  " + w));
errs.forEach(e => console.log("ERROR " + e));
const counts = {
  words: W && W.length, lexicon: LEX && Object.keys(LEX).length,
  storyPages: STORY && [].concat(...(STORY.chapters || []).map(c => c.pages || [])).length,
  patterns: PATS && PATS.length, regions: BODY && (BODY.regions || []).length,
  testItems: TESTS && ((TESTS.triage||{questions:[]}).questions.length + (TESTS.finalB1||{questions:[]}).questions.length + (TESTS.finalB2||{questions:[]}).questions.length + [].concat(...(TESTS.exam||[]).map(s => s.items||[])).length + (TESTS.clinicShift||[]).length),
  missions: WR && (WR.missions || []).length, flags: WR && (WR.errorFlags || []).length
};
console.log(JSON.stringify(counts), "|", errs.length + " error(s), " + warns.length + " warning(s)" + (strict ? " [strict]" : ""));
process.exit(errs.length ? 1 : 0);
