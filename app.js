/* ==================================================================
   BACK ON YOUR FEET — application engine
   Sibling of Money Matters (pegasus028/MU5Vocab). The engine holds no
   content: everything a teacher edits lives in data/*.js and media.js.
   Storage key: mu6vocab.v1 (never moneymatters.v1 — same origin).
   ================================================================== */
"use strict";
const W = window.WORDS || [], LEX = window.LEXICON || {}, STORY = window.STORY || { title: "", blurb: "", chapters: [] },
      PATS = window.PATTERNS || [], BODY = window.BODY || { views: {}, regions: [], findPrompts: [], hurtCases: [] },
      TESTS = window.TESTS || {}, WRITING = window.WRITING || { missions: [], errorFlags: [] },
      ROLEPLAY = window.ROLEPLAY || { MATCH: {}, SCENE: null }, MEDIA = window.MEDIA || {}, IMG = window.IMAGES || {};
const BY = {}; W.forEach(w => BY[w.id] = w);
const TARGETS = W.filter(w => w.group !== "bonus");          // the 70
const TOTAL = TARGETS.length || 70;

const AREAS = {
  body:     { name: "The body map",            icon: "🧍", blurb: "Sixteen places on a body, outside and inside." },
  injury:   { name: "Accidents and injuries",  icon: "🩹", blurb: "What happens in a fall, and what A and E does about it." },
  symptoms: { name: "Feeling ill",             icon: "🤒", blurb: "The signs of flu, from a temperature to exhaustion." },
  germs:    { name: "Catching and spreading",  icon: "🦠", blurb: "How illness moves from person to person, and how to stop it." },
  care:     { name: "Treatment and recovery",  icon: "💊", blurb: "Chemist, GP, prescriptions, remedies and physio." },
  idioms:   { name: "Idioms of health",        icon: "🌡️", blurb: "Eleven expressions on one scale from black out to on top of the world." },
  bonus:    { name: "Bonus words",             icon: "⭐", blurb: "In the unit but not on p.80. Up and about can appear in a school test." }
};
const CORDER = ["body", "injury", "symptoms", "germs", "care", "idioms"];
const TYPENAME = { gap: "Complete the sentence", meaning: "Choose the meaning", idiom: "Choose the idiom", coll: "Word partners",
  odd: "Odd one out", sub: "Better word", error: "Find the mistake", context: "Situation", situation: "Situation", picture: "On the body",
  conv: "At the doctor's", mccloze: "Multiple-choice cloze", define: "Definition", typed: "Type the word", unscramble: "Unscramble",
  wordform: "Word formation", opencloze: "Open cloze", transform: "Key word transformation", listenspell: "Listen and spell", speak: "Say it, then write it" };
const RANKS = [["Shuttle Rookie", 0], ["Warm-up", 120], ["Rally", 300], ["Drop Shot", 600], ["Smash", 1000], ["Match Point", 1500], ["Champion", 2200]];
const GAPS = [0, 2, 4, 7, 14];                               // Recovery Ward: Leitner boxes in days
const WEEK_TARGET = 4;                                       // study days per week (no streak punishment)
const BADGES = {
  first_card: "First card opened", placement: "Placement Check done", ten_cards: "Ten cards collected", body_all: "All sixteen body parts found",
  story_done: "Read the whole story", mission: "First Writing Clinic mission", boss: "Boss cleared", discharge: "A patient discharged from the ward",
  b2pass: "Final Check B2 at 80% or more", findit: "Find it in under 60 seconds", nameit: "Name it with perfect spelling", patterns: "Opened every pattern card",
  clinic: "Clinic Shift complete", exam: "An Exam Room set finished", seventy: "All 70 items opened"
};

/* ---------- state ---------- */
const KEY = "mu6vocab.v1";
const FRESH = () => ({ learned: [], pts: 0, ch: 0, pg: 0, read: [], tests: {}, focus: [], rp: null, theme: null,
  ward: {}, writing: {}, badges: [], days: {}, body: {}, pats: [], exam: {}, clinic: null, wardLog: [] });
let S = FRESH();
let PATOPEN = null;                                          // a pattern card to open when the Patterns tab draws
function load() {
  try { const r = localStorage.getItem(KEY); if (r) S = Object.assign(FRESH(), JSON.parse(r)); } catch (e) {}
  ["learned", "read", "focus", "badges", "pats", "wardLog"].forEach(k => { if (!Array.isArray(S[k])) S[k] = []; });
  ["tests", "ward", "writing", "days", "body", "exam"].forEach(k => { if (!S[k] || typeof S[k] !== "object") S[k] = {}; });
}
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
const isGot = id => S.learned.indexOf(id) > -1;
function mark(id, silent) {
  if (!BY[id] || isGot(id)) return false;
  S.learned.push(id); S.pts += 10; wardAdd(id); touchDay();
  save(); hud();
  award("first_card");
  if (S.learned.length >= 10) award("ten_cards");
  if (TARGETS.every(w => isGot(w.id))) award("seventy");
  if (!silent) toast("+10 · " + BY[id].word + " collected");
  return true;
}
function openedTargets() { return S.learned.filter(id => BY[id] && BY[id].group !== "bonus").length; }
function rankOf(p) { let r = 0; RANKS.forEach((x, i) => { if (p >= x[1]) r = i; }); return { i: r, name: RANKS[r][0], next: RANKS[r + 1] || null }; }
function today() { const d = new Date(); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
function addDays(iso, n) { const d = new Date(iso + "T12:00:00"); d.setDate(d.getDate() + n); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
function touchDay() { S.days[today()] = (S.days[today()] || 0) + 1; }
function weekDays() { const d = new Date(), dow = (d.getDay() + 6) % 7, out = []; for (let i = 0; i < 7; i++) { const iso = addDays(today(), i - dow); out.push({ iso, on: !!S.days[iso], label: "MTWTFSS"[i] }); } return out; }
function award(k) { if (!BADGES[k] || S.badges.indexOf(k) > -1) return; S.badges.push(k); S.pts += 15; save(); hud(); toast("🏅 " + BADGES[k]); }
function hud() {
  const rk = rankOf(S.pts), wk = weekDays().filter(d => d.on).length;
  document.getElementById("hud").innerHTML =
    '<span class="pill" title="Target items opened">📖 <b>' + openedTargets() + "</b> / " + TOTAL + "</span>" +
    '<span class="pill" title="Points">★ <b>' + S.pts + "</b></span>" +
    '<span class="pill" title="Study days this week">📅 <b>' + wk + "</b> / " + WEEK_TARGET + "</span>" +
    '<span class="pill rank" title="Rank">' + esc(rk.name) + "</span>" +
    '<button class="iconbtn" id="themeBtn" title="Light or dark" aria-label="Switch light or dark">◐</button>' +
    '<button class="iconbtn" id="resetBtn" title="Reset all progress" aria-label="Reset progress">↺</button>';
  document.getElementById("themeBtn").onclick = () => { S.theme = S.theme === "light" ? "dark" : S.theme === "dark" ? null : "light"; applyTheme(); save(); };
  document.getElementById("resetBtn").onclick = () => {
    if (!confirm("Clear all Back on Your Feet progress on this device? (Money Matters is not affected.)")) return;
    const th = S.theme; S = FRESH(); S.theme = th; save(); hud(); route();
  };
}
function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
function bold(s) { return esc(s).replace(/\*([^*]+)\*/g, "<b>$1</b>"); }
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function words(s) { return String(s || "").trim().split(/\s+/).filter(Boolean).length; }
let toastT = null;
function toast(msg) { const t = document.getElementById("toast"); t.textContent = msg; t.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("on"), 2600); }
/* iPad-proof typed marking: trim, lower, collapse spaces, straighten curly quotes, drop a final full stop */
function norm(s) { return String(s || "").replace(/[‘’ʼ]/g, "'").replace(/[“”]/g, '"').replace(/–|—/g, "-").replace(/\s+/g, " ").trim().toLowerCase().replace(/[.!]+$/, "").trim(); }
function typedOk(input, q) { const n = norm(input); if (!n) return false; return [q.answerText].concat(q.accept || []).some(a => norm(a) === n); }

/* ---------- read-aloud: recorded Sonia MP3s, browser voice only as fallback ----------
   Every 🔊 goes through one player (RD): a queue of parts, one shared <audio> element (so iPad Safari keeps
   playing from part to part), pause / resume / stop, a mini-player bar for longer reads, and the part being read
   highlighted on the page. Text is cleaned by speechText() (tts-clean.js) before keying, exactly as
   tools/tts-list.js does when recording. */
const TTS_VOICE = /sonia/i;
function pickVoice() {
  let vs = []; try { vs = speechSynthesis.getVoices() || []; } catch (e) { return null; }
  const gb = vs.filter(v => /en[-_]GB/i.test(v.lang));
  return vs.filter(v => TTS_VOICE.test(v.name) && /en[-_]GB/i.test(v.lang))[0] || vs.filter(v => TTS_VOICE.test(v.name))[0]
    || gb.filter(v => /libby|maisie|hollie|serena|kate|female|google uk english female/i.test(v.name))[0] || gb[0] || null;
}
try { if (window.speechSynthesis) { speechSynthesis.getVoices(); speechSynthesis.addEventListener("voiceschanged", pickVoice); } } catch (e) {}
function ttsNorm(s) { return String(s || "").replace(/\s+/g, " ").trim(); }
function ttsKey(s) { s = ttsNorm(s); let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return ("0000000" + h.toString(16)).slice(-8); }
const sayText = raw => ttsNorm(window.speechText ? window.speechText(raw) : raw);
const TTS_SET = {}; ((window.TTS && window.TTS.keys) || []).forEach(k => TTS_SET[k] = 1);
const TTS_DIR = (window.TTS && window.TTS.dir) || "audio/tts/";
function hasClip(text) { return !!TTS_SET[ttsKey(sayText(text))]; }
const RD = { parts: [], i: 0, state: "idle", owner: "", label: "", onEnd: null, bar: false, gen: 0, synth: false, el: null };
function rdAudio() { if (!RD.el) { try { RD.el = new Audio(); RD.el.preload = "auto"; } catch (e) { RD.el = null; } } return RD.el; }
function rdMark(on) { const p = RD.parts[RD.i]; if (p && p.el) p.el.classList.toggle("reading", on); }
function rdSynth(text, gen) {
  try {
    const u = new SpeechSynthesisUtterance(text); u.lang = "en-GB"; u.rate = .9; const v = pickVoice(); if (v) { u.voice = v; u.lang = v.lang; }
    u.onend = () => { if (gen === RD.gen) rdNext(); };
    u.onerror = e => { if (gen === RD.gen && e.error !== "interrupted" && e.error !== "canceled") rdNext(); };
    RD.synth = true; speechSynthesis.cancel(); speechSynthesis.speak(u);
  } catch (e) { toast("Sound is not available in this browser."); stopSpeech(); }
}
function rdPlay() {
  const gen = RD.gen, part = RD.parts[RD.i]; if (!part) return rdFinish();
  rdMark(true); RD.state = "playing"; RD.synth = false; paintReader();
  if (part.el && RD.bar) { const r = part.el.getBoundingClientRect(); if (r.top < 70 || r.bottom > innerHeight - 90) part.el.scrollIntoView({ block: "center", behavior: "smooth" }); }
  const k = ttsKey(part.text), a = TTS_SET[k] ? rdAudio() : null;
  if (!a) return rdSynth(part.text, gen);
  let fell = false;
  const fallback = () => { if (fell || gen !== RD.gen) return; fell = true; rdSynth(part.text, gen); };
  a.onended = () => { if (gen === RD.gen && !RD.synth) rdNext(); };
  a.onerror = fallback;
  try { a.src = TTS_DIR + k + ".mp3"; const p = a.play(); if (p && p.catch) p.catch(e => { if (!e || e.name !== "AbortError") fallback(); }); } catch (e) { fallback(); }
}
function rdNext() { rdMark(false); RD.i++; if (RD.i < RD.parts.length) rdPlay(); else rdFinish(); }
function rdFinish() { const cb = RD.onEnd; rdMark(false); RD.gen++; RD.state = "idle"; RD.owner = ""; RD.onEnd = null; RD.parts = []; paintReader(); if (cb) cb(); }
function rdHalt() {
  try { if (RD.el) { RD.el.onended = RD.el.onerror = null; RD.el.pause(); } if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {}
}
/* readAloud(parts, {owner, label, onEnd, bar}): parts are strings or {text, el}; el is highlighted while read */
function readAloud(parts, opts) {
  opts = opts || {}; stopSpeech();
  RD.parts = (parts || []).map(p => typeof p === "string" ? { text: sayText(p) } : { text: sayText(p.text), el: p.el || null }).filter(p => p.text);
  if (!RD.parts.length) return;
  RD.i = 0; RD.gen++; RD.owner = opts.owner || "say:" + ttsKey(RD.parts[0].text); RD.label = opts.label || "";
  RD.onEnd = opts.onEnd || null; RD.bar = opts.bar != null ? !!opts.bar : (RD.parts.length > 1 || RD.parts[0].text.length > 90);
  rdPlay();
}
function pauseSpeech() {
  if (RD.state !== "playing") return; RD.state = "paused";
  try { if (RD.synth) speechSynthesis.pause(); else if (RD.el) RD.el.pause(); } catch (e) {}
  paintReader();
}
function resumeSpeech() {
  if (RD.state !== "paused") return; RD.state = "playing";
  try { if (RD.synth) speechSynthesis.resume(); else if (RD.el) { const p = RD.el.play(); if (p && p.catch) p.catch(() => {}); } } catch (e) {}
  paintReader();
}
function stopSpeech() { rdHalt(); rdMark(false); RD.gen++; RD.state = "idle"; RD.owner = ""; RD.onEnd = null; RD.parts = []; RD.synth = false; paintReader(); }
function skipPart(d) { if (RD.state === "idle") return; const j = RD.i + d; if (j < 0 || j >= RD.parts.length) return; rdHalt(); rdMark(false); RD.gen++; RD.i = j; rdPlay(); }
/* one button = play, then pause / resume while it owns the player */
function toggleRead(owner, start) {
  if (RD.owner === owner && RD.state === "playing") return pauseSpeech();
  if (RD.owner === owner && RD.state === "paused") return resumeSpeech();
  start();
}
function speak(text, onEnd) { readAloud([text], { onEnd }); }
function paintReader() {
  document.querySelectorAll("[data-rd]").forEach(b => {
    const mine = b.dataset.rd === RD.owner && RD.state !== "idle", st = mine ? RD.state : "idle";
    b.classList.toggle("on", st === "playing"); b.classList.toggle("paused", st === "paused");
    const lab = b.dataset.label, ic = st === "playing" ? "⏸" : st === "paused" ? "▶" : "🔊";
    b.textContent = lab ? ic + " " + (st === "playing" ? "Pause" : st === "paused" ? "Resume" : lab) : ic;
    b.setAttribute("aria-label", st === "playing" ? "Pause" : st === "paused" ? "Resume" : "Listen" + (lab ? ": " + lab : ""));
  });
  const bar = document.getElementById("reader"); if (!bar) return;
  const show = RD.bar && RD.state !== "idle";
  document.body.classList.toggle("reader-on", show);
  if (!show) { bar.hidden = true; return; }
  bar.hidden = false;
  const n = RD.parts.length, multi = n > 1;
  bar.innerHTML = '<div class="rdin"><span class="rdwave' + (RD.state === "playing" ? " on" : "") + '" aria-hidden="true"><i></i><i></i><i></i><i></i></span>' +
    '<div class="rdtxt"><b>' + esc(RD.label || "Reading aloud") + '</b><span>' + (RD.state === "paused" ? "Paused" : "Sonia is reading") + (multi ? " · part " + (RD.i + 1) + " of " + n : "") + "</span></div>" +
    (multi ? '<button class="rdbtn" id="rdPrev" aria-label="Previous part"' + (RD.i === 0 ? " disabled" : "") + ">⏮</button>" : "") +
    '<button class="rdbtn main" id="rdToggle" aria-label="' + (RD.state === "playing" ? "Pause" : "Resume") + '">' + (RD.state === "playing" ? "⏸" : "▶") + "</button>" +
    (multi ? '<button class="rdbtn" id="rdNext" aria-label="Next part"' + (RD.i >= n - 1 ? " disabled" : "") + ">⏭</button>" : "") +
    '<button class="rdbtn" id="rdStop" aria-label="Stop">■</button></div>';
  document.getElementById("rdToggle").onclick = () => RD.state === "playing" ? pauseSpeech() : resumeSpeech();
  document.getElementById("rdStop").onclick = stopSpeech;
  const pv = document.getElementById("rdPrev"), nx = document.getElementById("rdNext");
  if (pv) pv.onclick = () => skipPart(-1); if (nx) nx.onclick = () => skipPart(1);
}
window.addEventListener("hashchange", stopSpeech);
document.addEventListener("visibilitychange", () => { if (document.hidden && RD.synth) pauseSpeech(); });
function speakBtn(text, label) {
  const own = "say:" + ttsKey(sayText(text));
  return '<button class="speak' + (label ? " lg" : "") + '" data-say="' + esc(text) + '" data-rd="' + own + '"' + (label ? ' data-label="' + esc(label) + '"' : "") + ' aria-label="Listen">🔊' + (label ? " " + esc(label) : "") + "</button>";
}
/* a button that reads a group of parts (a story page, a pattern card); wire it with wireRead() */
function readBtn(owner, label) { return '<button class="speak lg" data-rd="' + esc(owner) + '" data-label="' + esc(label) + '" aria-label="Listen: ' + esc(label) + '">🔊 ' + esc(label) + "</button>"; }
function wireRead(btn, partsFn, opts) { if (!btn) return; btn.onclick = e => { e.stopPropagation(); toggleRead(btn.dataset.rd, () => readAloud(partsFn(), Object.assign({ owner: btn.dataset.rd }, opts || {}))); }; }
function wireSpeak(root) {
  (root || document).querySelectorAll("[data-say]").forEach(b => b.onclick = e => { e.stopPropagation();
    toggleRead(b.dataset.rd, () => readAloud([b.dataset.say], { owner: b.dataset.rd, label: b.dataset.label || "" })); });
  paintReader();
}

/* ---------- media lookup ---------- */
function allMedia() {
  const out = [];
  ((MEDIA.podcast || {}).episodes || []).forEach(e => out.push(Object.assign({ _kind: "podcast" }, e)));
  ((MEDIA.video || {}).episodes || []).forEach(e => out.push(Object.assign({ _kind: "video" }, e)));
  ((MEDIA.extras || {}).items || []).forEach(e => out.push(Object.assign({ _kind: "extra" }, e)));
  return out;
}
const mediaForWord = id => allMedia().filter(m => (m.words || []).indexOf(id) > -1);
const mediaForChapter = n => allMedia().filter(m => m.chapter === n);
const mediaForPattern = p => allMedia().filter(m => m.pattern === p);
const MICON = { podcast: "🎧", video: "▶️", extra: "🔗" };

/* ==================================================================
   STUDY CARD (target words and every clickable synonym / antonym)
   ================================================================== */
let stack = [];
const scrim = document.getElementById("scrim"), sheet = document.getElementById("sheet");
function closeSheet() { if (/^say:/.test(RD.owner)) stopSpeech(); scrim.classList.remove("on"); stack = []; document.body.style.overflow = ""; }
scrim.addEventListener("click", e => { if (e.target === scrim) closeSheet(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && scrim.classList.contains("on")) closeSheet(); });
function openWord(id, push) { if (!BY[id]) return; if (push !== false) stack.push({ t: "w", id }); mark(id, true); renderSheet(); }
/* the Story tab's picture card (same facts as Trail Mix's story card, plus a photo); "Full study card" opens openWord */
function openStory(id, push) { if (!BY[id]) return; if (push !== false) stack.push({ t: "s", id }); mark(id, true); renderSheet(); }
function openTerm(term, push) { if (!LEX[term]) return; if (push !== false) stack.push({ t: "l", id: term }); renderSheet(); }
function goBack() { stack.pop(); if (!stack.length) { closeSheet(); return; } renderSheet(); }
function renderSheet() {
  const top = stack[stack.length - 1]; if (!top) return closeSheet();
  sheet.innerHTML = top.t === "w" ? wordSheet(BY[top.id]) : top.t === "s" ? storySheet(BY[top.id]) : termSheet(top.id, LEX[top.id]);
  sheet.classList.toggle("pic", top.t === "s");
  scrim.classList.add("on"); document.body.style.overflow = "hidden"; sheet.scrollTop = 0; wire();
}
function backLabel() { const prev = stack[stack.length - 2]; return prev.t === "l" ? prev.id : BY[prev.id].word; }
function backBar() {
  if (stack.length < 2) return "";
  return '<button class="backbtn" data-act="back">← back to <b>' + esc(backLabel()) + "</b></button>";
}
function lvlBadge(c) { return c ? '<span class="badge b-' + c + '">' + c + "</span>" : '<span class="badge b-NG" title="Not graded in the English Vocabulary Profile">not graded</span>'; }
function lvlRows(obj) {
  return ["B1", "B2", "C1"].filter(l => obj && typeof obj[l] === "string" && obj[l].trim()).map(l => {
    const t = obj[l], known = !!LEX[t];
    return '<div class="lvlrow"><span class="lv ' + l + '">' + l + "</span>" +
      (known ? '<button class="synbtn" data-term="' + esc(t) + '">' + esc(t) + '<span class="go">study →</span></button>'
             : '<span class="synbtn" style="cursor:default">' + esc(t) + "</span>") + "</div>";
  }).join("") || '<p class="muted" style="margin:0">None listed.</p>';
}
function wordSheet(w) {
  const med = mediaForWord(w.id), area = AREAS[w.cluster] || AREAS.bonus;
  return '<div class="shead"><div class="sthumb' + (IMG[w.id] && IMG[w.id].src ? "" : " noimg") + '">' + picHTML(w) + '</div><div class="t">' + backBar() +
    '<h3 id="sheetTitle">' + esc(w.word) + " " + speakBtn(w.word) + "</h3>" +
    '<div class="meta">' + lvlBadge(w.cefr) +
      '<span class="badge b-' + w.group + '">' + groupName(w.group) + "</span>" +
      '<span class="pos">' + esc(w.pos) + "</span>" +
      (w.ipa ? '<span class="ipa">' + esc(w.ipa) + "</span>" : "") +
      "<span>·</span><span>" + area.icon + " " + esc(area.name) + "</span>" +
      med.map(m => '<span class="mediachip">' + MICON[m._kind] + " " + esc(m.title) + "</span>").join("") +
    "</div></div>" +
    '<button class="xbtn" data-act="close" aria-label="Close">✕</button></div>' +
    '<div class="sbody">' +
      '<div class="blk"><div class="lbl">Meaning</div><p class="def">' + esc(w.def) + " " + speakBtn(w.def) + "</p></div>" +
      '<div class="blk"><div class="lbl">In use</div>' + (w.ex || []).map(x => '<div class="ex"><span>' + esc(x) + "</span>" + speakBtn(x) + "</div>").join("") + "</div>" +
      (w.textbook ? '<div class="blk"><div class="lbl">In your textbook</div><p class="def" style="font-size:14px">' + bold(w.textbook) + " " + speakBtn(w.textbook) + "</p></div>" : "") +
      '<div class="blk"><div class="lbl">Synonyms <span class="muted" style="font-weight:500;letter-spacing:0;text-transform:none">tap one to study it fully</span></div>' + lvlRows(w.syn) + "</div>" +
      '<div class="blk"><div class="lbl">Antonyms and contrasts <span class="muted" style="font-weight:500;letter-spacing:0;text-transform:none">tap one to study it fully</span></div>' + lvlRows(w.ant) + "</div>" +
      '<div class="blk"><div class="lbl">Goes with</div><div class="colls">' + (w.colls || []).map(c => '<span class="coll">' + esc(c) + "</span>").join("") + "</div></div>" +
      (w.family && w.family.length ? '<div class="blk"><div class="lbl">Word family</div><div class="fam">' + w.family.map(esc).join("<i>·</i>") + "</div></div>" : "") +
      (w.thai ? '<div class="blk"><div class="lbl">Thai and English</div><div class="thaibox">' + bold(w.thai) + "</div></div>" : "") +
      (w.trap ? '<div class="blk"><div class="lbl">Trap</div><div class="tipbox">' + bold(w.trap) + " " + speakBtn(w.trap) + "</div></div>" : "") +
      (w.tip ? '<div class="blk"><div class="lbl">Watch out</div><div class="tipbox">' + bold(w.tip) + " " + speakBtn(w.tip) + "</div></div>" : "") +
    "</div>" +
    '<div class="sfoot">' +
      '<span class="pill" style="color:var(--green)">✓ collected</span>' +
      (w.cluster === "body" ? '<button class="btn ghost sm" data-act="bodymap" data-id="' + w.id + '">🧍 Show on body map</button>' : "") +
      '<div class="spacer" style="flex:1"></div>' +
      '<button class="btn ghost sm" data-act="next" data-id="' + w.id + '">Next word →</button>' +
    "</div>";
}
const COUNTNAME = { C: "countable", U: "uncountable", "C/U": "countable + uncountable" };
function groupName(g) { return g === "core" ? "word" : g === "phrasal" ? "phrasal verb" : g; }
function picHTML(w, cls) {
  const im = IMG[w.id];
  return im && im.src ? '<img class="' + (cls || "") + '" src="' + esc(im.src) + '" alt="' + esc(im.alt || w.word) + '" loading="lazy">'
                      : '<span class="em" aria-hidden="true">' + esc(w.emoji || (AREAS[w.cluster] || AREAS.bonus).icon) + "</span>";
}
function patternsFor(id) { return PATS.filter(p => (p.items || []).indexOf(id) > -1); }
function storySheet(w) {
  const im = IMG[w.id], area = AREAS[w.cluster] || AREAS.bonus, pats = patternsFor(w.id);
  const sec = (title, html) => html ? '<div class="fact"><h4>' + title + "</h4>" + html + "</div>" : "";
  const txt = s => s ? "<p>" + bold(s) + "</p>" : "";
  const rel = (w.related || []).filter(r => BY[r] && r !== w.id);
  return '<div class="sphoto' + (im && im.src ? "" : " noimg") + '">' + picHTML(w) +
      (im && im.credit ? '<a class="credit" href="' + esc(im.link || "#") + '" target="_blank" rel="noopener">📷 ' + esc(im.credit) + (im.licence ? " · " + esc(im.licence) : "") + "</a>" : "") +
      (stack.length > 1 ? '<button class="pback" data-act="back">← ' + esc(backLabel()) + "</button>" : "") +
      '<button class="px" data-act="close" aria-label="Close">✕</button></div>' +
    '<div class="sin">' +
      '<div class="stitle"><h3 id="sheetTitle">' + (w.emoji ? '<span class="semo" aria-hidden="true">' + esc(w.emoji) + "</span> " : "") + esc(w.word) + "</h3>" +
        (w.ipa ? '<span class="ipa">' + esc(w.ipa) + "</span>" : "") + speakBtn(w.word, "Say it") + "</div>" +
      '<div class="stags">' + '<span class="tag">' + esc(w.pos) + "</span>" + (w.count && COUNTNAME[w.count] ? '<span class="tag">' + COUNTNAME[w.count] + "</span>" : "") +
        lvlBadge(w.cefr) + '<span class="badge b-' + w.group + '">' + groupName(w.group) + "</span>" + '<span class="tag">' + area.icon + " " + esc(area.name) + "</span></div>" +
      '<p class="sdef">' + esc(w.def) + " " + speakBtn(w.def) + "</p>" +
      '<div class="facts">' +
        sec("Examples", "<ul>" + (w.ex || []).map(x => "<li>" + esc(x) + " " + speakBtn(x) + "</li>").join("") + "</ul>") +
        sec("Goes with", (w.colls || []).length ? '<div class="colls">' + w.colls.map(c => '<span class="coll">' + esc(c) + "</span>").join("") + "</div>" : "") +
        sec("Grammar", txt(w.grammar)) +
        sec("Word family", (w.family || []).length ? '<div class="fam">' + w.family.map(esc).join("<i>·</i>") + "</div>" : "") +
        sec("Say it right", txt(w.say)) +
        sec("British / American", txt(w.ukus)) +
        sec("Watch out", txt(w.trap)) +
        sec("Did you know?", txt(w.fact)) +
        sec("Thai and English", w.thai ? '<div class="thaibox">' + bold(w.thai) + "</div>" : "") +
        sec("In your textbook", txt(w.textbook)) +
        sec("Related words", rel.length ? '<div class="itemchips" style="margin:0">' + rel.map(r => '<button class="itemchip" data-sword="' + r + '">' + (BY[r].emoji ? esc(BY[r].emoji) + " " : "") + esc(BY[r].word) + "</button>").join("") + "</div>" : "") +
        sec("Patterns", pats.length ? '<div class="itemchips" style="margin:0">' + pats.map(p => '<button class="patchip" data-pat="' + p.id + '">' + p.icon + " " + esc(p.title) + "</button>").join("") + "</div>" : "") +
      "</div></div>" +
    '<div class="sfoot"><span class="pill" style="color:var(--green)">✓ collected</span><div class="spacer" style="flex:1"></div>' +
      (w.cluster === "body" ? '<button class="btn ghost sm" data-act="bodymap" data-id="' + w.id + '">🧍 Body map</button>' : "") +
      '<button class="btn sm" data-act="full" data-id="' + w.id + '">📇 Full study card</button></div>';
}
function termSheet(term, e) {
  return '<div class="shead"><div class="t">' + backBar() +
    '<h3 id="sheetTitle">' + esc(term) + " " + speakBtn(term) + "</h3>" +
    '<div class="meta">' + lvlBadge(e.cefr) + '<span class="pos">' + esc(e.pos) + "</span>" + (e.ipa ? '<span class="ipa">' + esc(e.ipa) + "</span>" : "") +
      '<span>·</span><span class="muted">linked entry</span></div></div>' +
    '<button class="xbtn" data-act="close" aria-label="Close">✕</button></div>' +
    '<div class="sbody">' +
      '<div class="blk"><div class="lbl">Meaning</div><p class="def">' + esc(e.def) + " " + speakBtn(e.def) + "</p></div>" +
      '<div class="blk"><div class="lbl">In use</div>' + (e.ex || []).map(x => '<div class="ex"><span>' + esc(x) + "</span>" + speakBtn(x) + "</div>").join("") + "</div>" +
      ((e.colls || []).length ? '<div class="blk"><div class="lbl">Goes with</div><div class="colls">' + e.colls.map(c => '<span class="coll">' + esc(c) + "</span>").join("") + "</div></div>" : "") +
      (e.note ? '<div class="blk"><div class="lbl">Note</div><div class="tipbox">' + bold(e.note) + " " + speakBtn(e.note) + "</div></div>" : "") +
      relatedBlock(term) +
    "</div>" +
    '<div class="sfoot">' + (stack.length > 1 ? '<button class="btn ghost" data-act="back">← Back</button>' : "") +
      '<div class="spacer" style="flex:1"></div><button class="btn ghost sm" data-act="close">Close</button></div>';
}
function relatedBlock(term) {
  const asSyn = [], asAnt = [];
  W.forEach(w => ["B1", "B2", "C1"].forEach(l => { if (w.syn && w.syn[l] === term) asSyn.push(w.id); if (w.ant && w.ant[l] === term) asAnt.push(w.id); }));
  if (!asSyn.length && !asAnt.length) return "";
  const chips = arr => arr.map(id => '<button class="itemchip" data-word="' + id + '">' + esc(BY[id].word) + "</button>").join("");
  return '<div class="blk"><div class="lbl">Where this appears</div>' +
    (asSyn.length ? '<div style="font-size:13px;color:var(--ink2);margin-bottom:5px">Close in meaning to:</div><div class="itemchips" style="margin:0 0 10px">' + chips(asSyn) + "</div>" : "") +
    (asAnt.length ? '<div style="font-size:13px;color:var(--ink2);margin-bottom:5px">Opposite of:</div><div class="itemchips" style="margin:0">' + chips(asAnt) + "</div>" : "") + "</div>";
}
function wire() {
  sheet.querySelectorAll("[data-act]").forEach(b => b.onclick = () => {
    const a = b.dataset.act;
    if (a === "close") closeSheet();
    else if (a === "back") goBack();
    else if (a === "bodymap") { closeSheet(); BM.mode = "explore"; BM.lit = regionsFor(b.dataset.id); location.hash = "#/body"; }
    else if (a === "next") { const i = W.findIndex(x => x.id === b.dataset.id); stack = []; openWord(W[(i + 1) % W.length].id); }
    else if (a === "full") openWord(b.dataset.id);
  });
  sheet.querySelectorAll("[data-sword]").forEach(b => b.onclick = () => openStory(b.dataset.sword));
  sheet.querySelectorAll("[data-pat]").forEach(b => b.onclick = () => { PATOPEN = b.dataset.pat; closeSheet(); if (cur === "patterns") drawPatterns(); else go("patterns"); });
  sheet.querySelectorAll("[data-term]").forEach(b => b.onclick = () => openTerm(b.dataset.term));
  sheet.querySelectorAll("[data-word]").forEach(b => b.onclick = () => openWord(b.dataset.word));
  wireSpeak(sheet); refreshMarks();
}
function refreshMarks() {
  document.querySelectorAll(".kw").forEach(k => k.classList.toggle("got", isGot(k.dataset.w)));
  document.querySelectorAll(".wcard").forEach(c => c.classList.toggle("got", isGot(c.dataset.id)));
}

/* ==================================================================
   ROUTER  (hash routes: #/home, #/story/3/2, #/body, #/word/liver, #/test/finalB2, #/writing/W1 …)
   ================================================================== */
const TABS = [
  { id: "home",     label: "🏠 Home",           draw: drawHome },
  { id: "story",    label: "📖 Story",          draw: drawStory },
  { id: "body",     label: "🧍 Body Map",       draw: drawBody },
  { id: "words",    label: "📇 Words",          draw: drawWords },
  { id: "patterns", label: "🧠 Patterns",       draw: drawPatterns },
  { id: "tests",    label: "🎯 Tests",          draw: drawTests },
  { id: "writing",  label: "✍️ Writing Clinic", draw: drawWriting },
  { id: "roleplay", label: "🎭 Roleplay",       draw: drawRoleplay },
  { id: "media",    label: "🎧 Media",          draw: drawMedia }
];
let cur = "home", P = [];
function go(id, p) { location.hash = "#/" + id + (p && p.length ? "/" + p.join("/") : ""); }
function route() {
  const h = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  let id = h[0] || "home"; P = h.slice(1);
  if (id === "word") { const w = P[0]; id = cur || "words"; if (BY[w]) { stack = []; openWord(w); } }
  if (id === "test") { id = "tests"; }
  if (!TABS.some(t => t.id === id)) id = "home";
  cur = id;
  TABS.forEach(t => {
    document.getElementById("v-" + t.id).classList.toggle("on", t.id === id);
    const b = document.getElementById("tab-" + t.id); if (b) b.setAttribute("aria-selected", t.id === id ? "true" : "false");
  });
  (TABS.find(t => t.id === id) || TABS[0]).draw();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
window.addEventListener("hashchange", route);
function buildTabs() {
  document.getElementById("tabsin").innerHTML = TABS.map(t => '<button class="tab" id="tab-' + t.id + '" role="tab" aria-selected="false">' + t.label + "</button>").join("");
  TABS.forEach(t => document.getElementById("tab-" + t.id).onclick = () => { if (t.id === "tests") { T = null; X = null; }
    if (location.hash === "#/" + t.id) route(); else go(t.id); });   // same hash fires no hashchange, so redraw by hand
}

/* ==================================================================
   HOME — one next step, computed from state
   ================================================================== */
function areaProgress(a) { const g = W.filter(w => w.cluster === a); return { got: g.filter(w => isGot(w.id)).length, total: g.length }; }
function storyPageCount() { return [].concat(...STORY.chapters.map(c => c.pages)).length; }
function nextStep() {
  if (!S.tests.triage) return { label: "Take the Placement Check", sub: "24 questions. It finds your weak areas and sets your route.", go: () => startTest("triage") };
  const due = wardDue().length;
  const weakRoute = (S.focus || []).filter(a => { const p = areaProgress(a); return p.got < p.total; });
  if (weakRoute.length) { const a = weakRoute[0]; return { label: "Study " + AREAS[a].name, sub: "On your route from the Placement Check. Open every card in this area.", go: () => { F.cluster = a; go("words"); } }; }
  if (due) return { label: "See " + due + " patient" + (due > 1 ? "s" : "") + " on the Recovery Ward", sub: "Spaced review. A word is only yours once you type it on a later day.", go: () => go("tests", ["ward"]) };
  const weakest = CORDER.map(a => ({ a, p: areaProgress(a) })).filter(x => x.p.got < x.p.total).sort((x, y) => x.p.got / x.p.total - y.p.got / y.p.total)[0];
  if (weakest) return { label: "Open the cards in " + AREAS[weakest.a].name, sub: weakest.p.got + " of " + weakest.p.total + " collected so far.", go: () => { F.cluster = weakest.a; go("words"); } };
  const exams = (TESTS.exam || []).filter(s => !S.exam[s.id]);
  if (exams.length) return { label: "Exam Room: " + exams[0].title, sub: exams[0].part, go: () => startExam(exams[0].id) };
  if (!(S.rp && S.rp.done)) return { label: "Face the boss: The Comeback Interview", sub: "Seven typed answers. Target: 15 of the 70 items.", go: () => go("roleplay") };
  if (!S.tests.finalB2) return { label: "Sit Final Check B2", sub: "Twenty questions at exam-level precision.", go: () => startTest("finalB2") };
  return { label: "Keep in shape: revisit the Recovery Ward", sub: "Everything is open. Spaced review keeps it yours.", go: () => go("tests", ["ward"]) };
}
function drawHome() {
  const ns = nextStep(), rk = rankOf(S.pts), wk = weekDays(), due = wardDue().length;
  const med = allMedia().slice(0, 3);
  document.getElementById("v-home").innerHTML =
    '<div class="hero"><div class="lbl">Your next step</div><h3>' + esc(ns.label) + "</h3>" +
      '<p class="lede" style="margin:0">' + esc(ns.sub) + "</p>" +
      '<div class="big"><button class="btn" id="nsGo">Go →</button>' +
        (due ? '<button class="btn ghost" id="nsWard">🛏️ Recovery Ward · ' + due + " due</button>" : "") +
        '<button class="btn ghost" id="copyReport">📋 Copy my report</button></div></div>' +
    '<div class="grid2">' +
      '<div class="card pad"><div class="lbl">Progress by area · ' + openedTargets() + " / " + TOTAL + "</div>" +
        CORDER.map(a => { const p = areaProgress(a); return '<div class="arearow"><span class="ic">' + AREAS[a].icon + '</span><span class="tt">' + esc(AREAS[a].name) +
          ((S.focus || []).indexOf(a) > -1 ? ' <span class="badge b-B2">route</span>' : "") + '</span><div class="bar"><i style="width:' + Math.round(p.got / p.total * 100 || 0) + '%"></i></div><span class="n">' + p.got + "/" + p.total + "</span></div>"; }).join("") +
        '<div class="row" style="margin-top:10px"><span class="muted">Story pages read: ' + S.read.length + " / " + storyPageCount() + "</span></div></div>" +
      '<div class="card pad"><div class="lbl">Rank · ' + esc(rk.name) + "</div>" +
        '<div class="ranks">' + RANKS.map((r, i) => '<span class="rk' + (i === rk.i ? " on" : i < rk.i ? " done" : "") + '">' + esc(r[0]) + "</span>").join("") + "</div>" +
        (rk.next ? '<p class="muted" style="margin:8px 0 0">' + (rk.next[1] - S.pts) + " points to " + esc(rk.next[0]) + ".</p>" : '<p class="muted" style="margin:8px 0 0">Top rank. Champion.</p>') +
        '<div class="lbl" style="margin-top:16px">This week · ' + wk.filter(d => d.on).length + " of " + WEEK_TARGET + " study days</div>" +
        '<div class="weekdots">' + wk.map(d => '<span class="weekdot' + (d.on ? " on" : "") + '" title="' + d.iso + '">' + d.label + "</span>").join("") + "</div>" +
        '<p class="muted" style="margin:8px 0 0">A missed day costs nothing. Four days a week is the target.</p>' +
        (S.badges.length ? '<div class="lbl" style="margin-top:16px">Badges</div><div class="badges">' + S.badges.map(b => '<span class="bdg">🏅 ' + esc(BADGES[b] || b) + "</span>").join("") + "</div>" : "") +
      "</div>" +
    "</div>" +
    '<div class="card pad" style="margin-top:12px"><div class="lbl">Media shelf</div>' +
      (med.length ? med.map(m => '<div class="row" style="padding:6px 0"><span class="mediachip">' + MICON[m._kind] + " " + esc(m.title) + '</span><button class="btn ghost sm" data-go="media">Open</button></div>').join("")
                  : '<p class="muted" style="margin:0">Podcasts and videos appear here when T.Chris adds them to media.js.</p>') + "</div>";
  document.getElementById("nsGo").onclick = ns.go;
  const nw = document.getElementById("nsWard"); if (nw) nw.onclick = () => go("tests", ["ward"]);
  document.getElementById("copyReport").onclick = copyReport;
  document.querySelectorAll("#v-home [data-go]").forEach(b => b.onclick = () => go(b.dataset.go));
}
function copyReport() {
  const r = [];
  r.push("Back on Your Feet — my report, " + today());
  r.push("Rank: " + rankOf(S.pts).name + " · Points: " + S.pts + " · Items opened: " + openedTargets() + "/" + TOTAL);
  CORDER.forEach(a => { const p = areaProgress(a); r.push("  " + AREAS[a].name + ": " + p.got + "/" + p.total); });
  r.push("Story pages read: " + S.read.length + "/" + storyPageCount());
  ["triage", "finalB1", "finalB2"].forEach(k => { if (S.tests[k]) r.push((TESTS[k] || {}).title + ": " + S.tests[k].score + "/" + S.tests[k].total); });
  if (S.tests.triage) r.push("Route: " + (S.tests.triage.focus.length ? S.tests.triage.focus.map(a => AREAS[a].name).join(", ") : "none"));
  Object.keys(S.exam).forEach(k => r.push("Exam Room " + k + ": " + S.exam[k].score + "/" + S.exam[k].total));
  if (S.clinic) r.push("Clinic Shift: " + S.clinic.score + "/" + S.clinic.total);
  const ward = Object.keys(S.ward); r.push("Recovery Ward: " + ward.length + " patients, " + ward.filter(id => S.ward[id].home).length + " discharged, " + wardDue().length + " due");
  Object.keys(S.writing).forEach(k => { const d = S.writing[k]; if (d && d.text) r.push("Writing " + k + ": " + words(d.text) + " words, targets used " + (d.used || 0)); });
  if (S.rp) r.push("Roleplay: " + (S.rp.used || []).length + " items used" + (S.rp.done ? " (finished)" : ""));
  r.push("Study days this week: " + weekDays().filter(d => d.on).length + "/" + WEEK_TARGET + " · Badges: " + S.badges.length);
  copyText(r.join("\n"), "Report copied. Paste it into Line for T.Chris.");
}
function copyText(text, msg) {
  const done = () => toast(msg || "Copied.");
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done));
  else fallbackCopy(text, done);
}
function fallbackCopy(text, done) { const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); done(); } catch (e) { prompt("Copy this:", text); } document.body.removeChild(ta); }

/* ==================================================================
   STORYBOOK
   ================================================================== */
function storyParas(text) { return String(text || "").split(/\n\s*\n/); }
function storyHTML(text) {
  return "<p>" + storyParas(text).map(esc).join("</p><p>")
    .replace(/\{\{([a-z]+)\|([^}]*)\}\}/g, (m, id, sur) => '<button class="kw' + (isGot(id) ? " got" : "") + '" data-w="' + id + '">' + sur + "</button>") + "</p>";
}
function pageParts(text) { const ps = document.querySelectorAll("#v-story .ptext p"); return storyParas(text).map((t, i) => ({ text: t, el: ps[i] || null })); }
function storyNext() { const chs = STORY.chapters, ch = chs[S.ch]; if (S.pg < ch.pages.length - 1) S.pg++; else if (S.ch < chs.length - 1) { S.ch++; S.pg = 0; } else return false; save(); return true; }
function readPage(auto) {
  const page = STORY.chapters[S.ch].pages[S.pg], own = "story:" + S.ch + "." + S.pg;
  readAloud(pageParts(page.text), { owner: own, bar: true, label: "Chapter " + STORY.chapters[S.ch].n + " · page " + globalPage(S.ch, S.pg),
    onEnd: () => { if (S.autoRead && cur === "story" && storyNext()) { drawStory(); readPage(true); window.scrollTo({ top: 0, behavior: "smooth" }); } } });
}
function globalPage(ci, pi) { let n = 0; for (let i = 0; i < ci; i++) n += STORY.chapters[i].pages.length; return n + pi + 1; }
function markRead(ci, pi) { const k = ci + "." + pi; if (S.read.indexOf(k) < 0) { S.read.push(k); S.pts += 3; touchDay(); save(); hud(); if (S.read.length >= storyPageCount()) award("story_done"); } }
function drawStory() {
  const chs = STORY.chapters;
  if (!chs.length) { document.getElementById("v-story").innerHTML = '<h2 class="sec">Story</h2><p class="lede">No story loaded yet.</p>'; return; }
  if (P.length >= 2 && !isNaN(P[0])) { S.ch = Math.max(0, Math.min(chs.length - 1, +P[0] - 1)); S.pg = Math.max(0, +P[1] - 1); P = []; }   // a deep link is read once, so Next still works
  const ch = chs[S.ch] || chs[0]; if (S.pg >= ch.pages.length) S.pg = 0;
  const page = ch.pages[S.pg];
  const chWords = new Set(); ch.pages.forEach(p => (p.text.match(/\{\{([a-z]+)\|/g) || []).forEach(m => chWords.add(m.slice(2, -1))));
  const gotIn = [...chWords].filter(isGot).length, med = mediaForChapter(ch.n), gp = globalPage(S.ch, S.pg);
  markRead(S.ch, S.pg);
  document.getElementById("v-story").innerHTML =
    '<h2 class="sec">' + esc(STORY.title) + "</h2><p class=\"lede\">" + esc(STORY.blurb) + "</p>" +
    '<div class="chapstrip">' + chs.map((c, i) => '<button class="chapbtn" data-ch="' + i + '" aria-pressed="' + (i === S.ch) + '">Chapter ' + c.n + "<small>" + esc(c.title) + "</small></button>").join("") + "</div>" +
    '<div class="chaphead"><div class="sub">Chapter ' + ch.n + " · " + esc(ch.subtitle) + "</div><h3>" + esc(ch.title) + "</h3>" +
      '<div class="row" style="margin-top:7px"><div class="bar" style="flex:1;max-width:220px"><i style="width:' + Math.round(gotIn / (chWords.size || 1) * 100) + '%"></i></div><span class="muted">' + gotIn + " / " + chWords.size + " words collected</span>" +
      med.map(m => '<span class="mediachip">' + MICON[m._kind] + " " + esc(m.title) + "</span>").join("") + "</div></div>" +
    '<div class="page"><div class="art ' + (page.tint || "warm") + (page.img ? " hasimg" : "") + '">' +
      (page.img ? '<img class="bg" src="' + esc(page.img) + '" alt="" aria-hidden="true"><img class="fg" src="' + esc(page.img) + '" alt="' + esc(page.alt || "") + '" loading="lazy">' : esc(page.art || "📖")) +
      '<span class="plate">Chapter ' + ch.n + " · page " + gp + " of " + storyPageCount() + "</span></div>" +
      '<div class="row" style="padding:12px 22px 0;flex-wrap:wrap">' + readBtn("story:" + S.ch + "." + S.pg, "Listen to this page").replace("<button", '<button id="listenPage"') +
        '<label class="autoread"><input type="checkbox" id="autoRead"' + (S.autoRead ? " checked" : "") + '> Turn the pages for me</label></div>' +
      '<div class="ptext">' + storyHTML(page.text) + "</div>" +
      (page.grammar ? '<div class="gramline"><b>Grammar in this page:</b> ' + bold(page.grammar) + " " + speakBtn(page.grammar) + "</div>" : "") +
      '<div class="pnav"><button class="btn ghost sm" id="prevP"' + (S.ch === 0 && S.pg === 0 ? " disabled" : "") + ">◀ Prev</button>" +
        '<div class="dots">' + ch.pages.map((_, i) => '<button class="dot' + (S.read.indexOf(S.ch + "." + i) > -1 ? " read" : "") + '" data-pg="' + i + '" aria-current="' + (i === S.pg) + '" aria-label="Page ' + (i + 1) + '"></button>').join("") + "</div>" +
        '<button class="btn sm" id="nextP"' + (S.ch === chs.length - 1 && S.pg === ch.pages.length - 1 ? " disabled" : "") + ">Next ▶</button></div></div>" +
    (gp === 11 && ROLEPLAY.SCENE ? '<div class="notice" style="margin-top:12px">🎭 <b>Boss unlocked.</b> The Comeback Interview is set between this page and the final. <button class="chip" data-go="roleplay">Play it</button></div>' : "") +
    '<p class="muted" style="text-align:center;margin-top:13px">Every gold word is tappable. A tick means it is in your collection.</p>';
  document.querySelectorAll("#v-story .kw").forEach(k => k.onclick = () => { stack = []; openStory(k.dataset.w); });
  document.querySelectorAll("#v-story .chapbtn").forEach(b => b.onclick = () => { stopSpeech(); S.ch = +b.dataset.ch; S.pg = 0; save(); drawStory(); });
  document.querySelectorAll("#v-story .dot").forEach(d => d.onclick = () => { S.pg = +d.dataset.pg; save(); stopSpeech(); drawStory(); });
  document.querySelectorAll("#v-story [data-go]").forEach(b => b.onclick = () => go(b.dataset.go));
  const lp = document.getElementById("listenPage"); lp.onclick = e => { e.stopPropagation(); toggleRead(lp.dataset.rd, () => readPage()); };
  document.getElementById("autoRead").onchange = e => { S.autoRead = e.target.checked; save(); };
  wireSpeak(document.getElementById("v-story"));
  document.getElementById("prevP").onclick = () => { stopSpeech(); window.scrollTo({ top: 0, behavior: "smooth" }); if (S.pg > 0) S.pg--; else if (S.ch > 0) { S.ch--; S.pg = chs[S.ch].pages.length - 1; } save(); drawStory(); };
  document.getElementById("nextP").onclick = () => { stopSpeech(); storyNext(); drawStory(); };
}
function readPage11() { return S.read.some(k => { const [c, p] = k.split(".").map(Number); return globalPage(c, p) >= 11; }); }

/* ==================================================================
   BODY MAP — Explore / Find it / Name it / Where does it hurt?
   ================================================================== */
const BM = { mode: "explore", view: "front", layer: "outside", lit: [], run: null };
const REG = {}; (BODY.regions || []).forEach(r => REG[r.id] = r);
function regionsFor(wordId) { return (BODY.regions || []).filter(r => r.word === wordId).map(r => r.id); }
function bodySVG(view, opts) {
  opts = opts || {}; const v = (BODY.views || {})[view]; if (!v) return '<p class="muted">Body map not loaded.</p>';
  const regs = (BODY.regions || []).filter(r => r.view === view && (!opts.layer || r.layer === opts.layer));
  return '<svg viewBox="' + esc(v.viewBox) + '" role="img" aria-label="Body map, ' + view + ' view">' + v.base +
    regs.map(r => '<path class="region' + ((opts.lit || []).indexOf(r.id) > -1 ? " lit" : "") + ((opts.ok || []).indexOf(r.id) > -1 ? " ok" : "") + (opts.interactive === false ? " muted" : "") + '" d="' + esc(r.path) + '" data-region="' + r.id + '"><title>' + (opts.labels ? esc(BY[r.word] ? BY[r.word].word : r.word) : "") + "</title></path>").join("") +
    (opts.labels ? regs.map(r => '<text class="lbl" x="' + r.label[0] + '" y="' + r.label[1] + '" text-anchor="middle">' + esc(BY[r.word] ? BY[r.word].word : r.word) + "</text>").join("") : "") + "</svg>";
}
function drawBody() {
  if (!(BODY.regions || []).length) { document.getElementById("v-body").innerHTML = '<h2 class="sec">Body Map</h2><p class="lede">No body map loaded yet.</p>'; return; }
  if (P[0] && ["explore", "find", "name", "hurt"].indexOf(P[0]) > -1 && P[0] !== BM.mode) { BM.mode = P[0]; BM.run = null; BM.lit = []; }  // a deep link to another mode starts a fresh round
  const modeBtn = (m, l) => '<button class="chip" data-mode="' + m + '" aria-pressed="' + (BM.mode === m) + '">' + l + "</button>";
  document.getElementById("v-body").innerHTML =
    '<h2 class="sec">Body Map</h2><p class="lede">Sixteen places on a body. Left and right always mean <i>her</i> left and right: she faces you, so her left is on your right.</p>' +
    '<div class="modes">' + modeBtn("explore", "👆 Explore") + modeBtn("find", "⏱️ Find it") + modeBtn("name", "⌨️ Name it") + modeBtn("hurt", "🩹 Where does it hurt?") + "</div>" +
    '<div class="bodywrap" style="margin-top:12px"><div class="figure" id="figure"></div><div class="bodypanel" id="bodypanel"></div></div>';
  document.querySelectorAll("#v-body [data-mode]").forEach(b => b.onclick = () => { BM.mode = b.dataset.mode; BM.run = null; BM.lit = []; drawBody(); });
  ({ explore: bmExplore, find: bmFind, name: bmName, hurt: bmHurt })[BM.mode]();
}
function paintFigure(opts, onTap) {
  const fig = document.getElementById("figure");
  fig.innerHTML = bodySVG(BM.view, opts) +
    '<div class="vtog"><button class="chip" data-v="front" aria-pressed="' + (BM.view === "front") + '">Front</button><button class="chip" data-v="back" aria-pressed="' + (BM.view === "back") + '">Back</button></div>';
  fig.querySelectorAll("[data-v]").forEach(b => b.onclick = () => { BM.view = b.dataset.v; paintFigure(opts, onTap); });
  if (onTap) fig.querySelectorAll(".region").forEach(p => p.onclick = () => onTap(p.dataset.region));
}
function bmExplore() {
  const panel = document.getElementById("bodypanel");
  const show = id => {
    const r = REG[id], w = BY[r.word];
    panel.innerHTML = '<div class="row"><button class="chip" data-l="outside" aria-pressed="' + (BM.layer === "outside") + '">Outside</button><button class="chip" data-l="inside" aria-pressed="' + (BM.layer === "inside") + '">Inside</button></div>' +
      '<div class="prompt-card"><div class="big-word">' + esc(w.word) + " " + speakBtn(w.word) + "</div>" +
      '<div class="meta" style="margin:4px 0 8px">' + lvlBadge(w.cefr) + ' <span class="ipa">' + esc(w.ipa || "") + "</span></div>" +
      '<p class="def" style="font-size:15px">' + esc(w.def) + " " + speakBtn(w.def) + "</p>" +
      '<div class="row" style="margin-top:10px"><button class="btn sm" data-word="' + w.id + '">Open the card</button></div></div>';
    wireLayer(); panel.querySelector("[data-word]").onclick = () => { stack = []; openWord(w.id); };
    wireSpeak(panel); speak(w.word); mark(w.id, true);
    BM.lit = [id]; paintFigure({ layer: BM.layer, lit: BM.lit, labels: true }, show);
  };
  const wireLayer = () => panel.querySelectorAll("[data-l]").forEach(b => b.onclick = () => { BM.layer = b.dataset.l; BM.lit = []; bmExplore(); });
  panel.innerHTML = '<div class="row"><button class="chip" data-l="outside" aria-pressed="' + (BM.layer === "outside") + '">Outside</button><button class="chip" data-l="inside" aria-pressed="' + (BM.layer === "inside") + '">Inside</button></div>' +
    '<div class="prompt-card"><p class="q" style="margin:0">Tap any part of the body to see its name, hear it and open its card. Switch to <b>Inside</b> for muscle, ribs, lungs, liver and kidneys, and turn her round for the back view.</p></div>';
  wireLayer();
  if (BM.lit.length && REG[BM.lit[0]]) { BM.layer = REG[BM.lit[0]].layer; BM.view = REG[BM.lit[0]].view; show(BM.lit[0]); }
  else paintFigure({ layer: BM.layer, lit: [], labels: true }, show);
}
function bmFind() {
  const panel = document.getElementById("bodypanel");
  if (!BM.run) BM.run = { qs: shuffle(BODY.findPrompts).slice(0, 16), i: 0, right: 0, wrong: 0, start: Date.now(), ok: [], done: false };
  const r = BM.run;
  const tick = () => { const el = document.getElementById("clock"); if (!el || r.done) return; const left = Math.max(0, 60 - Math.floor((Date.now() - r.start) / 1000)); el.textContent = left + "s"; if (left === 0) { r.done = true; finishFind(); } else setTimeout(tick, 250); };
  const draw = () => {
    if (r.i >= r.qs.length) { r.done = true; return finishFind(); }
    const q = r.qs[r.i];
    panel.innerHTML = '<div class="row" style="justify-content:space-between"><span class="muted">Find it · ' + (r.i + 1) + " / " + r.qs.length + '</span><span class="clock" id="clock">60s</span></div>' +
      '<div class="prompt-card"><p class="q">' + esc(q.text) + " " + speakBtn(q.text) + "</p>" +
      '<p class="muted" style="margin:0">Tap the right place on the figure. Use the Front / Back buttons if you need to turn her round.</p></div>';
    wireSpeak(panel);
    const need = REG[q.region]; BM.layer = need.layer;
    const tap = id => {
      if (r.done) return;
      const hit = REG[id], okHit = hit.word === need.word;
      if (okHit) { r.right++; r.ok.push(id); S.pts += 4; mark(hit.word, true); toast("✓ " + BY[hit.word].word); }
      else { r.wrong++; toast("That is the " + BY[hit.word].word + ". Try " + BY[need.word].word + "."); return paintFigure({ layer: BM.layer, lit: [id], ok: r.ok }, tap); }
      r.i++; save(); hud(); draw();
    };
    paintFigure({ layer: BM.layer, lit: [], ok: [] }, tap);
  };
  const finishFind = () => {
    const secs = Math.round((Date.now() - r.start) / 1000);
    S.body.find = Math.max(S.body.find || 0, r.right); touchDay(); save(); hud();
    if (r.right >= 16 && secs <= 60) award("findit");
    panel.innerHTML = '<div class="prompt-card"><div class="score" style="color:var(--green)">' + r.right + '<span style="font-size:20px;color:var(--ink3)"> / ' + r.qs.length + "</span></div>" +
      '<p class="muted">' + secs + " seconds · " + r.wrong + " wrong tap" + (r.wrong === 1 ? "" : "s") + ".</p>" +
      '<div class="row"><button class="btn" id="again">Play again</button><button class="btn ghost" data-mode2="name">Try Name it →</button></div></div>';
    document.getElementById("again").onclick = () => { BM.run = null; bmFind(); };
    panel.querySelector("[data-mode2]").onclick = () => { BM.mode = "name"; BM.run = null; drawBody(); };
  };
  draw(); tick();
}
function bmName() {
  const panel = document.getElementById("bodypanel");
  if (!BM.run) BM.run = { qs: shuffle(BODY.regions.filter((r, i, a) => a.findIndex(x => x.word === r.word) === i)), i: 0, right: 0, perfect: true };
  const r = BM.run;
  const draw = () => {
    if (r.i >= r.qs.length) {
      S.body.name = Math.max(S.body.name || 0, r.right); touchDay(); save(); hud();
      if (r.perfect && r.qs.length >= 16) award("nameit");
      panel.innerHTML = '<div class="prompt-card"><div class="score" style="color:var(--green)">' + r.right + '<span style="font-size:20px;color:var(--ink3)"> / ' + r.qs.length + "</span></div>" +
        '<p class="muted">Spelling counts: silent c in muscle, gh in thigh, waist not waste.</p><div class="row"><button class="btn" id="again">Again</button></div></div>';
      document.getElementById("again").onclick = () => { BM.run = null; bmName(); }; return;
    }
    const reg = r.qs[r.i], w = BY[reg.word]; BM.view = reg.view;
    paintFigure({ layer: null, lit: [reg.id] }, null);
    panel.innerHTML = '<div class="muted">Name it · ' + (r.i + 1) + " / " + r.qs.length + "</div>" +
      '<div class="prompt-card"><p class="q">This part is lit up. Type its name.</p>' +
      '<input class="typed" id="nameIn" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="type the word…">' +
      '<div class="row" style="margin-top:10px"><button class="btn" id="chk">Check</button><button class="btn ghost sm" id="hint">First letter</button></div><div id="fb"></div></div>';
    const inp = document.getElementById("nameIn"); inp.focus();
    const check = () => {
      const ok = norm(inp.value) === norm(w.word) || (w.id === "lungs" && norm(inp.value) === "lung") || (w.id === "ribs" && norm(inp.value) === "rib");
      inp.classList.add(ok ? "ok" : "bad");
      if (ok) { r.right++; S.pts += 5; mark(w.id, true); wardTyped(w.id, true); }
      else { r.perfect = false; wardTyped(w.id, false); }
      document.getElementById("fb").innerHTML = '<div class="why' + (ok ? "" : " bad") + '"><b>' + (ok ? "Correct." : "Not quite.") + "</b> " + esc(w.word) + " " + speakBtn(w.word) + " " + esc(w.ipa || "") + '</div><div class="row" style="margin-top:10px"><button class="btn" id="nx">Next →</button></div>';
      wireSpeak(panel); speak(w.word);
      document.getElementById("chk").disabled = true; inp.disabled = true;
      document.getElementById("nx").onclick = () => { r.i++; draw(); };
    };
    document.getElementById("chk").onclick = check; inp.onkeydown = e => { if (e.key === "Enter" && !inp.disabled) check(); };
    document.getElementById("hint").onclick = () => { inp.value = w.word[0]; inp.focus(); r.perfect = false; };
  };
  draw();
}
function bmHurt() {
  const panel = document.getElementById("bodypanel");
  if (!BM.run) BM.run = { qs: shuffle(BODY.hurtCases), i: 0, right: 0, stage: 0 };
  const r = BM.run;
  const draw = () => {
    if (r.i >= r.qs.length) {
      S.body.hurt = Math.max(S.body.hurt || 0, r.right); touchDay(); save(); hud();
      panel.innerHTML = '<div class="prompt-card"><div class="score" style="color:var(--green)">' + r.right + '<span style="font-size:20px;color:var(--ink3)"> / ' + r.qs.length + '</span></div><div class="row"><button class="btn" id="again">Again</button></div></div>';
      document.getElementById("again").onclick = () => { BM.run = null; bmHurt(); }; return;
    }
    const c = r.qs[r.i], need = REG[c.region]; BM.view = need.view; BM.layer = need.layer; r.stage = 0;
    panel.innerHTML = '<div class="muted">Where does it hurt? · ' + (r.i + 1) + " / " + r.qs.length + "</div>" +
      '<div class="prompt-card"><p class="q">“' + esc(c.text) + "” " + speakBtn(c.text) + "</p>" + '<p class="muted" id="step">Step 1: tap where it hurts.</p><div id="opts"></div><div id="fb"></div></div>';
    wireSpeak(panel);
    paintFigure({ layer: BM.layer, lit: [] }, id => {
      if (r.stage !== 0) return;
      const hit = REG[id]; r.stage = 1;
      const okHit = hit.word === need.word;
      paintFigure({ layer: BM.layer, lit: okHit ? [] : [id], ok: okHit ? [id] : regionsFor(need.word).filter(x => REG[x].view === BM.view) }, null);
      document.getElementById("step").textContent = (okHit ? "Yes, the " + BY[need.word].word + ". " : "It is the " + BY[need.word].word + ", not the " + BY[hit.word].word + ". ") + "Step 2: which word names the problem?";
      document.getElementById("opts").innerHTML = '<div class="opts" style="margin-top:8px">' + c.options.map((o, i) => '<button class="opt" data-i="' + i + '"><span class="ltr">' + "ABCD"[i] + "</span><span>" + esc(o) + "</span></button>").join("") + "</div>";
      document.querySelectorAll("#opts .opt").forEach(b => b.onclick = () => {
        const pick = +b.dataset.i, ok = pick === c.answer;
        document.querySelectorAll("#opts .opt").forEach((x, i) => { x.disabled = true; if (i === c.answer) x.classList.add("right"); else if (i === pick) x.classList.add("wrong"); });
        if (ok && okHit) { r.right++; S.pts += 6; } else if (c.answer != null && BY[c.tests || ""]) wardAdd(c.tests);
        document.getElementById("fb").innerHTML = '<div class="why' + (ok ? "" : " bad") + '"><b>' + (ok ? "Correct." : "Not quite.") + "</b> " + esc(c.why || "") + " " + speakBtn(c.why || "") + '</div><div class="row" style="margin-top:10px"><button class="btn" id="nx">Next →</button></div>';
        wireSpeak(panel); save(); hud(); document.getElementById("nx").onclick = () => { r.i++; draw(); };
      });
    });
  };
  draw();
}

/* ==================================================================
   WORD LIST
   ================================================================== */
let F = { q: "", group: "all", cefr: "all", cluster: "all" };
function drawWords() {
  const focus = S.focus || [];
  const chipset = (name, opts) => opts.map(o => '<button class="chip" data-f="' + name + '" data-v="' + o[0] + '" aria-pressed="' + (F[name] === o[0]) + '">' + o[1] + "</button>").join("");
  const list = W.filter(w => {
    if (F.group !== "all" && w.group !== F.group) return false;
    if (F.cefr === "NG" ? w.cefr : (F.cefr !== "all" && w.cefr !== F.cefr)) return false;
    if (F.cluster !== "all" && w.cluster !== F.cluster) return false;
    if (F.q) { const q = F.q.toLowerCase(); const hay = (w.word + " " + w.def + " " + (w.colls || []).join(" ") + " " + (w.family || []).join(" ") + " " + ["B1", "B2", "C1"].map(l => (w.syn[l] || "") + " " + (w.ant[l] || "")).join(" ")).toLowerCase(); if (hay.indexOf(q) < 0) return false; }
    return true;
  });
  let body = "";
  if (F.cluster === "all" && !F.q) {
    CORDER.concat(["bonus"]).forEach(c => {
      const g = list.filter(w => w.cluster === c); if (!g.length) return;
      const done = g.filter(w => isGot(w.id)).length;
      body += '<div class="clusterhead"><span class="ic">' + AREAS[c].icon + "</span><span>" + AREAS[c].name + "</span>" + (focus.indexOf(c) > -1 ? ' <span class="badge b-B2">route</span>' : "") +
        '<span class="n">' + done + " / " + g.length + '</span></div><p class="muted" style="margin:-4px 0 9px">' + AREAS[c].blurb + '</p><div class="wgrid">' + g.map(wcard).join("") + "</div>";
    });
  } else body = list.length ? '<div class="wgrid">' + list.map(wcard).join("") + "</div>" : '<p class="muted">Nothing matches. Try a different filter.</p>';
  document.getElementById("v-words").innerHTML =
    '<h2 class="sec">All 80 items</h2><p class="lede">70 targets in six areas, plus 10 bonus words the unit uses. Every card opens a full study entry: meaning, two examples with Sonia audio, synonyms and antonyms you can tap, collocations, the word family, the textbook line and a Thai note where it helps.</p>' +
    (focus.length ? '<div class="focusban">🎯 <b>Your placement check says start here:</b> ' + focus.map(c => AREAS[c].icon + " " + AREAS[c].name).join(", ") + '. <button class="chip" style="margin-left:6px" id="focusOnly">Show only these</button> <button class="chip" id="focusClear">Clear</button></div>' : "") +
    '<input class="search" id="wq" placeholder="Search words, meanings, synonyms…" value="' + esc(F.q) + '">' +
    '<div class="filters">' + chipset("group", [["all", "Everything"], ["core", "Words"], ["idiom", "Idioms"], ["phrasal", "Phrasal verbs"], ["bonus", "Bonus"]]) + "</div>" +
    '<div class="filters">' + chipset("cefr", [["all", "All levels"], ["A2", "A2"], ["B1", "B1"], ["B2", "B2"], ["C1", "C1"], ["C2", "C2"], ["NG", "not graded"]]) + "</div>" +
    '<div class="filters">' + chipset("cluster", [["all", "All areas"]].concat(CORDER.concat(["bonus"]).map(c => [c, AREAS[c].icon + " " + AREAS[c].name]))) + "</div>" +
    '<div class="row" style="margin-bottom:12px"><div class="bar" style="flex:1"><i style="width:' + Math.round(openedTargets() / TOTAL * 100) + '%"></i></div><span class="muted">' + openedTargets() + " / " + TOTAL + " collected</span></div>" + body;
  const q = document.getElementById("wq");
  q.oninput = () => { F.q = q.value; const p = q.selectionStart; drawWords(); const nq = document.getElementById("wq"); nq.focus(); nq.setSelectionRange(p, p); };
  document.querySelectorAll("#v-words [data-f]").forEach(b => b.onclick = () => { F[b.dataset.f] = b.dataset.v; drawWords(); });
  document.querySelectorAll("#v-words .wcard").forEach(c => c.onclick = () => { stack = []; openWord(c.dataset.id); });
  const fo = document.getElementById("focusOnly"), fc = document.getElementById("focusClear");
  if (fo) fo.onclick = () => { F.cluster = focus[0]; drawWords(); };
  if (fc) fc.onclick = () => { S.focus = []; save(); drawWords(); };
}
function wcard(w) {
  return '<button class="wcard' + (isGot(w.id) ? " got" : "") + '" data-id="' + w.id + '"><span class="tick">✓</span><span class="w">' + esc(w.word) + "</span>" +
    lvlBadge(w.cefr) + ' <span class="badge b-' + w.group + '">' + (w.group === "core" ? "word" : w.group === "phrasal" ? "phrasal verb" : w.group) + "</span>" +
    '<span class="d" style="margin-top:6px">' + esc(w.def) + "</span></button>";
}

/* ==================================================================
   PATTERNS  (+ three interactive drills: sort, scale, listen)
   ================================================================== */
function drawPatterns() {
  document.getElementById("v-patterns").innerHTML =
    '<h2 class="sec">Patterns worth knowing</h2><p class="lede">Seventy separate words are hard to hold. One patient journey, a body in layers, one up-and-down metaphor and a few word-building rules are easy. Open each card, then try its one-minute drill.</p>' +
    PATS.map((p, i) => {
      const med = mediaForPattern(p.id);
      return '<div class="card pat" data-i="' + i + '" data-id="' + p.id + '" data-open="0"><button class="pathead"><span class="ic">' + p.icon + '</span><span class="tt"><span class="k">' + esc(p.kind) + "</span><h3>" + esc(p.title) + '</h3></span><span class="car">▶</span></button>' +
        '<div class="patbody"><div class="row" style="margin-bottom:10px">' + readBtn("pat:" + p.id, "Listen to this card") + "</div>" +
        '<p class="insight">' + bold(p.insight) + "</p>" + (p.examples || []).map(x => '<div class="exline">' + bold(x) + "</div>").join("") +
        '<div class="itemchips">' + (p.items || []).filter(id => BY[id]).map(id => '<button class="itemchip" data-word="' + id + '">' + esc(BY[id].word) + "</button>").join("") + "</div>" +
        '<div class="drill"><b>Try it now:</b> ' + bold(p.drill) + "</div>" +
        (p.game ? '<div class="game" id="game-' + p.id + '"></div>' : "") +
        (med.length ? '<div class="row" style="margin-top:10px">' + med.map(m => '<span class="mediachip">' + MICON[m._kind] + " " + esc(m.title) + "</span>").join("") + "</div>" : "") + "</div></div>";
    }).join("");
  document.querySelectorAll("#v-patterns .pathead").forEach(h => h.onclick = () => {
    const p = h.parentElement; p.dataset.open = p.dataset.open === "1" ? "0" : "1";
    if (p.dataset.open === "0" && RD.owner === "pat:" + p.dataset.id) stopSpeech();
    if (p.dataset.open === "1") { if (S.pats.indexOf(p.dataset.id) < 0) { S.pats.push(p.dataset.id); S.pts += 2; touchDay(); save(); hud(); if (S.pats.length >= PATS.length) award("patterns"); }
      const pat = PATS.find(x => x.id === p.dataset.id); if (pat && pat.game) drawGame(pat); }
  });
  document.querySelectorAll("#v-patterns [data-word]").forEach(b => b.onclick = e => { e.stopPropagation(); stack = []; openWord(b.dataset.word); });
  document.querySelectorAll("#v-patterns .pat").forEach(card => {
    const p = PATS.find(x => x.id === card.dataset.id); if (!p) return;
    wireRead(card.querySelector("[data-rd]"), () => [{ text: p.title, el: card.querySelector(".pathead h3") }, { text: p.insight, el: card.querySelector(".insight") }]
      .concat([...card.querySelectorAll(".exline")].map((el, i) => ({ text: (p.examples || [])[i], el })))
      .concat([{ text: "Try it now. " + (p.drill || ""), el: card.querySelector(".drill") }]), { label: p.title, bar: true });
  });
  paintReader();
  if (PATOPEN) {                                   // opened from a word's "Patterns" chip
    const card = document.querySelector('#v-patterns .pat[data-id="' + PATOPEN + '"]'); PATOPEN = null;
    if (card) { if (card.dataset.open !== "1") card.querySelector(".pathead").click(); setTimeout(() => card.scrollIntoView({ behavior: "smooth", block: "start" }), 350); }
  }
}
function drawGame(p) {
  const el = document.getElementById("game-" + p.id); if (!el) return;
  const g = p.game;
  if (g.kind === "listen") {
    const items = shuffle(g.items.map(x => typeof x === "string" ? x : x.id)); let i = 0, right = 0;
    const draw = () => {
      if (i >= items.length) { el.innerHTML = "<b>" + right + " / " + items.length + " spelled right.</b> " + '<button class="chip" id="g-again">Again</button>'; document.getElementById("g-again").onclick = () => drawGame(p); return; }
      const w = BY[items[i]];
      el.innerHTML = '<div class="lbl">Listen and type · ' + (i + 1) + " / " + items.length + '</div><div class="row"><button class="speak lg" id="g-play">🔊 Play</button><input class="typed" id="g-in" style="flex:1" autocomplete="off" autocapitalize="off" spellcheck="false"><button class="btn sm" id="g-chk">Check</button></div><div id="g-fb"></div>';
      const inp = document.getElementById("g-in");
      document.getElementById("g-play").onclick = () => speak(w.word);
      const chk = () => { const ok = norm(inp.value) === norm(w.word); inp.classList.add(ok ? "ok" : "bad"); if (ok) { right++; S.pts += 3; } wardTyped(w.id, ok); save(); hud();
        document.getElementById("g-fb").innerHTML = '<div class="why' + (ok ? "" : " bad") + '"><b>' + (ok ? "Yes: " : "It was: ") + "</b>" + esc(w.word) + " " + esc(w.ipa || "") + ' <button class="chip" id="g-nx">Next</button></div>'; document.getElementById("g-nx").onclick = () => { i++; draw(); }; };
      document.getElementById("g-chk").onclick = chk; inp.onkeydown = e => { if (e.key === "Enter") chk(); };
      speak(w.word);
    };
    draw(); return;
  }
  /* sort and scale: tap a tile, then tap a slot; "Check" marks each tile */
  const items = shuffle(g.items.map(x => ({ id: x.id, slot: x.slot })));
  const placed = {}; let sel = null;
  const draw = () => {
    const pool = items.filter(it => placed[it.id] == null);
    el.innerHTML = '<div class="lbl">' + (g.kind === "scale" ? "Drag-free version: tap a word, then tap its place on the scale" : "Tap a word, then tap the stage it belongs to") + "</div>" +
      '<div class="pool">' + pool.map(it => '<button class="tile' + (sel === it.id ? " sel" : "") + '" data-tile="' + it.id + '">' + esc(BY[it.id].word) + "</button>").join("") + (pool.length ? "" : '<span class="muted">All placed. Press Check.</span>') + "</div>" +
      '<div class="' + (g.kind === "scale" ? "scale" : "slots") + '">' + g.slots.map((s, si) => '<div class="slot" data-slot="' + si + '"><h5>' + esc(s) + "</h5>" +
        items.filter(it => placed[it.id] === si).map(it => '<button class="tile' + (it.mark || "") + '" data-tile="' + it.id + '">' + esc(BY[it.id].word) + "</button>").join("") + "</div>").join("") + "</div>" +
      '<div class="row" style="margin-top:10px"><button class="btn sm" id="g-chk">Check</button><button class="btn ghost sm" id="g-reset">Reset</button><span class="muted" id="g-res"></span></div>' +
      (g.reveal ? '<div class="why" id="g-reveal" style="display:none">' + bold(g.reveal) + " " + speakBtn(g.reveal) + "</div>" : "");
    wireSpeak(el);
    el.querySelectorAll("[data-tile]").forEach(b => b.onclick = e => { e.stopPropagation(); sel = sel === b.dataset.tile ? null : b.dataset.tile; draw(); });
    el.querySelectorAll("[data-slot]").forEach(s => s.onclick = () => { if (sel == null) return; placed[sel] = +s.dataset.slot; const it = items.find(x => x.id === sel); it.mark = ""; sel = null; draw(); });
    document.getElementById("g-chk").onclick = () => { let ok = 0; items.forEach(it => { if (placed[it.id] == null) return; it.mark = placed[it.id] === it.slot ? " ok" : " bad"; if (it.mark === " ok") ok++; else wardAdd(it.id); });
      S.pts += ok; save(); hud(); draw(); document.getElementById("g-res").textContent = ok + " / " + items.length + " right"; const rv = document.getElementById("g-reveal"); if (rv) rv.style.display = "block"; };
    document.getElementById("g-reset").onclick = () => { Object.keys(placed).forEach(k => delete placed[k]); items.forEach(it => it.mark = ""); sel = null; draw(); };
  };
  draw();
}

/* ==================================================================
   RECOVERY WARD — Leitner boxes 0/2/4/7/14 days, typed recall alternating with MCQ
   ================================================================== */
function wardAdd(id) { if (!BY[id] || S.ward[id]) return; S.ward[id] = { box: 0, due: today(), typedOk: false, visits: 0 }; }
function wardDue() { const t = today(); return Object.keys(S.ward).filter(id => BY[id] && !S.ward[id].home && S.ward[id].due <= t); }
function wardTyped(id, ok) { const p = S.ward[id]; if (!p || p.home) return; if (ok && p.due <= today()) wardVisit(id, true, true); }
function wardVisit(id, ok, typed) {
  const p = S.ward[id]; if (!p) return; p.visits = (p.visits || 0) + 1;
  if (ok) { if (typed) p.typedOk = true;
    if (p.box >= 4 && typed) { p.home = true; p.due = ""; award("discharge"); S.wardLog.push({ id, at: today(), discharged: true }); }
    else { p.box = Math.min(4, p.box + 1); p.due = addDays(today(), GAPS[p.box]); } }
  else { p.box = Math.max(0, p.box - 1); p.due = addDays(today(), GAPS[p.box] || 1); }
  save();
}
function drawWard() {
  const v = document.getElementById("v-tests");
  const due = wardDue(), all = Object.keys(S.ward).filter(id => BY[id]);
  const beds = all.sort((a, b) => (S.ward[a].home ? 1 : 0) - (S.ward[b].home ? 1 : 0) || (S.ward[a].due || "9").localeCompare(S.ward[b].due || "9"));
  v.innerHTML = '<div class="row"><button class="btn ghost sm" id="backTests">← All tests</button></div>' +
    '<h2 class="sec" style="margin-top:10px">🛏️ Recovery Ward</h2><p class="lede">Every word you open or miss becomes a patient. Patients come back after 0, 2, 4, 7 and 14 days. A correct typed answer at the 14-day visit discharges them, the picture of health. A wrong answer sends a patient back one box, never to the start.</p>' +
    (due.length ? '<div class="row" style="margin-bottom:14px"><button class="btn coral" id="roundStart">See the ' + due.length + " patient" + (due.length > 1 ? "s" : "") + " due now →</button></div>" : '<div class="notice" style="margin-bottom:14px">Nobody is due today. Open more cards or come back tomorrow.</div>') +
    (beds.length ? '<div class="ward">' + beds.map(id => { const p = S.ward[id]; return '<div class="bed' + (p.home ? " home" : p.due <= today() ? " due-now" : "") + '"><b>' + esc(BY[id].word) + '</b><span class="due">' + (p.home ? "discharged ✓" : p.due <= today() ? "due now" : "due " + p.due) + '</span><div class="boxes">' + [0, 1, 2, 3, 4].map(i => "<i" + (i <= p.box ? ' class="on"' : "") + "></i>").join("") + "</div></div>"; }).join("") + "</div>" : '<p class="muted">The ward is empty. Open some study cards first.</p>');
  document.getElementById("backTests").onclick = drawTests;
  const rs = document.getElementById("roundStart"); if (rs) rs.onclick = () => wardRound(shuffle(due));
}
function wardRound(ids) {
  const v = document.getElementById("v-tests"); let i = 0, right = 0;
  const draw = () => {
    if (i >= ids.length) { touchDay(); save(); hud(); v.innerHTML = '<div class="qwrap"><div class="card" style="padding:22px;text-align:center"><div class="score" style="color:var(--green)">' + right + '<span style="font-size:22px;color:var(--ink3)"> / ' + ids.length + '</span></div><p class="muted">Ward round done.</p><button class="btn" id="bk">Back to the ward</button></div></div>'; document.getElementById("bk").onclick = drawWard; return; }
    const id = ids[i], w = BY[id], p = S.ward[id], typed = p.box >= 4 || (p.visits % 2 === 0);
    let html = '<div class="qwrap"><div class="qtop"><button class="btn ghost sm" id="quit">✕ Quit</button><div class="bar" style="flex:1"><i style="width:' + Math.round(i / ids.length * 100) + '%"></i></div><span class="n">' + (i + 1) + " / " + ids.length + '</span></div><div class="qcard"><div class="qtype">Recovery Ward · box ' + (p.box + 1) + " of 5 · " + (typed ? "type it" : "choose it") + "</div>";
    if (typed) {
      html += '<p class="qprompt">' + esc(w.def) + '</p><p class="muted">Starts with <b>' + esc(w.word[0]) + "</b> · " + esc(w.pos) + '</p><input class="typed" id="wIn" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="type the word…"><div class="row" style="margin-top:10px"><button class="btn" id="chk">Check</button></div><div id="fb"></div></div></div>';
      v.innerHTML = html;
      const inp = document.getElementById("wIn"); inp.focus();
      const chk = () => { const ok = norm(inp.value) === norm(w.word) || norm(inp.value) === norm(w.word.replace(/\s*\(.*?\)/g, "")); inp.classList.add(ok ? "ok" : "bad"); inp.disabled = true; document.getElementById("chk").disabled = true;
        wardVisit(id, ok, true); if (ok) { right++; S.pts += 6; }
        document.getElementById("fb").innerHTML = '<div class="why' + (ok ? "" : " bad") + '"><b>' + (ok ? "Correct." : "Not quite.") + "</b> " + esc(w.word) + " " + speakBtn(w.word) + " — " + esc(w.ex[0]) + '</div><div class="row" style="margin-top:12px"><button class="btn" id="nx">Next →</button></div>';
        wireSpeak(v); document.getElementById("nx").onclick = () => { i++; draw(); }; };
      document.getElementById("chk").onclick = chk; inp.onkeydown = e => { if (e.key === "Enter" && !inp.disabled) chk(); };
    } else {
      const ex = w.ex[Math.floor(Math.random() * w.ex.length)];
      const rx = new RegExp("\\b(" + (ROLEPLAY.MATCH[id] || w.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) + ")\\b", "i");
      const gapped = rx.test(ex) ? ex.replace(rx, "______") : ex.replace(new RegExp(w.word.split(" ")[0], "i"), "______");
      const pool = shuffle(W.filter(x => x.id !== id && x.cluster === w.cluster)).slice(0, 3).map(x => x.word);
      const opts = shuffle(pool.concat([w.word])), ans = opts.indexOf(w.word);
      html += '<p class="qprompt">' + esc(gapped).replace(/_{3,}/g, '<span class="gap">______</span>') + '</p><div class="opts" id="opts">' + opts.map((o, k) => '<button class="opt" data-i="' + k + '"><span class="ltr">' + "ABCD"[k] + "</span><span>" + esc(o) + "</span></button>").join("") + '</div><div id="fb"></div></div></div>';
      v.innerHTML = html;
      document.querySelectorAll("#opts .opt").forEach(b => b.onclick = () => { const pick = +b.dataset.i, ok = pick === ans;
        document.querySelectorAll("#opts .opt").forEach((x, k) => { x.disabled = true; if (k === ans) x.classList.add("right"); else if (k === pick) x.classList.add("wrong"); });
        wardVisit(id, ok, false); if (ok) { right++; S.pts += 3; }
        document.getElementById("fb").innerHTML = '<div class="why' + (ok ? "" : " bad") + '"><b>' + (ok ? "Correct." : "Not quite.") + "</b> " + esc(w.def) + '</div><div class="row" style="margin-top:12px"><button class="btn" id="nx">Next →</button></div>';
        document.getElementById("nx").onclick = () => { i++; draw(); }; });
    }
    document.getElementById("quit").onclick = drawWard;
  };
  draw();
}

/* ==================================================================
   TESTS — menu, MCQ runner (Placement / Final B1 / Final B2), Exam Room, Clinic Shift, Ward
   ================================================================== */
let T = null;
function bestOf(k) { return S.tests[k] || null; }
function drawTests() {
  T = null;
  if (P[0] === "ward") return drawWard();
  if (P[0] === "clinic") return startClinic();
  if (P[0] && TESTS[P[0]] && TESTS[P[0]].questions) { const k = P[0]; P = []; return startTest(k); }
  if (P[0] && (TESTS.exam || []).some(s => s.id === P[0])) { const k = P[0]; P = []; return startExam(k); }
  const tri = bestOf("triage"), b1 = bestOf("finalB1"), b2 = bestOf("finalB2");
  const stateLine = r => r ? '<span class="tstate">✓ Best: ' + r.score + " / " + r.total + " · " + Math.round(r.score / r.total * 100) + "%</span>" : '<span class="muted">Not attempted yet</span>';
  const due = wardDue().length;
  document.getElementById("v-tests").innerHTML =
    '<h2 class="sec">Tests</h2><p class="lede">Start with the Placement Check: it is a router, not a grade. Then the Exam Room trains the four kinds of test these words appear in, and the Recovery Ward keeps them yours.</p>' +
    '<div class="testgrid">' +
      (TESTS.triage ? '<div class="testcard hero"><div class="row"><span style="font-size:26px">🎯</span><h3>' + esc(TESTS.triage.title) + "</h3></div><p>" + esc(TESTS.triage.subtitle) + ' Four questions on each of the six areas. Your weakest areas become your route.</p><div class="row">' + stateLine(tri) +
        (tri ? '<span class="muted">· route: ' + (tri.focus.length ? tri.focus.map(c => AREAS[c].name).join(", ") : "none, you were strong everywhere") + "</span>" : "") + '</div><div class="row"><button class="btn amber" data-run="triage">' + (tri ? "Take it again" : "Start the Placement Check") + "</button>" + (tri ? '<button class="btn ghost" data-see="triage">See my route</button>' : "") + "</div></div>" : "") +
      (TESTS.finalB1 ? '<div class="testcard"><div class="row"><span class="badge b-B1">B1</span></div><h3>' + esc(TESTS.finalB1.title) + "</h3><p>" + esc(TESTS.finalB1.subtitle) + "</p><div>" + stateLine(b1) + '</div><button class="btn" data-run="finalB1">' + (b1 ? "Take it again" : "Start") + "</button></div>" : "") +
      (TESTS.finalB2 ? '<div class="testcard"><div class="row"><span class="badge b-B2">B2</span></div><h3>' + esc(TESTS.finalB2.title) + "</h3><p>" + esc(TESTS.finalB2.subtitle) + "</p><div>" + stateLine(b2) + '</div><button class="btn" data-run="finalB2">' + (b2 ? "Take it again" : "Start") + "</button></div>" : "") +
      '<div class="testcard"><div class="row"><span style="font-size:22px">🛏️</span></div><h3>Recovery Ward</h3><p>Spaced review at 0, 2, 4, 7 and 14 days. Typed recall alternates with multiple choice.</p><div>' + (due ? '<span class="tstate">' + due + " patient" + (due > 1 ? "s" : "") + " due now</span>" : '<span class="muted">' + Object.keys(S.ward).length + " patients on the ward</span>") + '</div><button class="btn' + (due ? " coral" : " ghost") + '" data-ward="1">Open the ward</button></div>' +
      ((TESTS.clinicShift || []).length ? '<div class="testcard"><div class="row"><span style="font-size:22px">🏥</span></div><h3>Clinic Shift</h3><p>Twelve patients. Send each one home, to the chemist, to a clinic or to A and E, then name the problem.</p><div>' + (S.clinic ? '<span class="tstate">✓ Best: ' + S.clinic.score + " / " + S.clinic.total + "</span>" : '<span class="muted">Not attempted yet</span>') + '</div><button class="btn" data-clinic="1">' + (S.clinic ? "Work another shift" : "Start the shift") + "</button></div>" : "") +
    "</div>" +
    ((TESTS.exam || []).length ? '<h2 class="sec" style="margin-top:26px">Exam Room</h2><p class="lede">Four exam styles. The textbook test, Cambridge B2 First-style Use of English, Thai school and Triam Udom style, and IELTS. Idioms suit Speaking; essays use neutral words (<i>became ill</i>, not <i>came down with</i>).</p><div class="testgrid">' +
      TESTS.exam.map(s => { const r = S.exam[s.id]; return '<div class="testcard"><div class="row"><span class="badge b-' + (/^A/.test(s.id) ? "B1" : /^B/.test(s.id) ? "B2" : /^C/.test(s.id) ? "C1" : "C2") + '">' + esc(s.part) + "</span></div><h3>" + esc(s.title) + "</h3><p>" + esc(s.instructions) + "</p><div>" + (r ? '<span class="tstate">✓ Best: ' + r.score + " / " + r.total + "</span>" : '<span class="muted">' + s.items.length + " items</span>") + '</div><button class="btn" data-exam="' + s.id + '">' + (r ? "Again" : "Start") + "</button></div>"; }).join("") + "</div>" : "");
  document.querySelectorAll("#v-tests [data-run]").forEach(b => b.onclick = () => startTest(b.dataset.run));
  document.querySelectorAll("#v-tests [data-see]").forEach(b => b.onclick = () => showResult(b.dataset.see, S.tests[b.dataset.see]));
  document.querySelectorAll("#v-tests [data-exam]").forEach(b => b.onclick = () => startExam(b.dataset.exam));
  document.querySelectorAll("#v-tests [data-ward]").forEach(b => b.onclick = drawWard);
  document.querySelectorAll("#v-tests [data-clinic]").forEach(b => b.onclick = startClinic);
}
function startTest(key) { const t = TESTS[key]; if (!t) return; if (cur !== "tests") { location.hash = "#/tests"; } T = { key, t, i: 0, answers: [], locked: false }; drawQ(); }
function promptHTML(p) { return esc(p).replace(/_{3,}/g, '<span class="gap">______</span>').replace(/\[\[([^\]]+)\]\]/g, '<span class="seg">$1</span>'); }
function drawQ() {
  const q = T.t.questions[T.i], n = T.t.questions.length;
  document.getElementById("v-tests").innerHTML =
    '<div class="qwrap"><div class="qtop"><button class="btn ghost sm" id="quit">✕ Quit</button><div class="bar" style="flex:1"><i style="width:' + Math.round(T.i / n * 100) + '%"></i></div><span class="n">' + (T.i + 1) + " / " + n + "</span></div>" +
    '<div class="qcard"><div class="qtype">' + (TYPENAME[q.type] || q.type) + (q.level ? ' · <span class="badge b-' + q.level + '">' + q.level + "</span>" : "") + "</div>" +
      (q.type === "picture" && q.region && REG[q.region] ? '<div class="figure" style="max-width:260px;margin:0 auto 12px">' + bodySVG(REG[q.region].view, { lit: [q.region], interactive: false }) + "</div>" : "") +
      '<p class="qprompt">' + promptHTML(q.prompt) + "</p>" +
      '<div class="opts" id="opts">' + q.options.map((o, i) => '<button class="opt" data-i="' + i + '"><span class="ltr">' + "ABCD"[i] + "</span><span>" + esc(o) + "</span></button>").join("") + "</div>" +
      '<div id="fb"></div></div></div>';
  document.getElementById("quit").onclick = () => { T = null; drawTests(); };
  document.querySelectorAll("#opts .opt").forEach(b => b.onclick = () => answer(+b.dataset.i));
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function answer(pick) {
  if (T.locked) return; T.locked = true;
  const q = T.t.questions[T.i], ok = pick === q.answer;
  T.answers.push({ q: T.i, pick, ok });
  if (!ok && BY[q.tests]) wardAdd(q.tests);
  document.querySelectorAll("#opts .opt").forEach((b, i) => { b.disabled = true; if (i === q.answer) b.classList.add("right"); else if (i === pick) b.classList.add("wrong"); });
  const last = T.i === T.t.questions.length - 1;
  document.getElementById("fb").innerHTML = '<div class="why' + (ok ? "" : " bad") + '"><b>' + (ok ? "Correct." : "Not quite.") + "</b> " + esc(q.why) +
    (BY[q.tests] ? ' <button class="chip" style="margin-left:4px" data-word="' + q.tests + '">study ' + esc(BY[q.tests].word) + "</button>" : "") + "</div>" +
    '<div class="row" style="margin-top:13px"><button class="btn" id="nx">' + (last ? "See my result →" : "Next question →") + "</button></div>";
  document.querySelectorAll("#fb [data-word]").forEach(b => b.onclick = () => { stack = []; openWord(b.dataset.word); });
  document.getElementById("nx").onclick = () => { if (last) finish(); else { T.i++; T.locked = false; drawQ(); } };
}
function finish() {
  const qs = T.t.questions, score = T.answers.filter(a => a.ok).length, total = qs.length;
  const byCluster = {}; CORDER.forEach(c => byCluster[c] = { right: 0, total: 0 });
  T.answers.forEach(a => { const c = qs[a.q].cluster; if (byCluster[c]) { byCluster[c].total++; if (a.ok) byCluster[c].right++; } });
  const focus = CORDER.filter(c => byCluster[c].total && byCluster[c].right / byCluster[c].total < 0.75);
  const rec = { score, total, at: Date.now(), byCluster, focus, missed: T.answers.filter(a => !a.ok).map(a => ({ tests: qs[a.q].tests, prompt: qs[a.q].prompt, right: qs[a.q].options[qs[a.q].answer], why: qs[a.q].why })) };
  const prev = S.tests[T.key]; if (!prev || score >= prev.score) S.tests[T.key] = rec;
  if (T.key === "triage") { S.focus = focus; award("placement"); }
  if (T.key === "finalB2" && score / total >= 0.8) award("b2pass");
  S.pts += score * 2; touchDay(); save(); hud(); showResult(T.key, rec); T = null;
}
function showResult(key, r) {
  const isTri = key === "triage", pct = Math.round(r.score / r.total * 100);
  const verdict = isTri ? (r.focus.length === 0 ? "Strong across all six areas. Go to the Exam Room, then polish the C1 synonyms in the Words tab." : r.focus.length >= 4 ? "Plenty to build. Read the story chapter by chapter first, then come back." : "Clear picture. Study the areas on your route and leave the rest alone.")
    : (pct >= 85 ? "Excellent. This level is secure." : pct >= 70 ? "A pass, with gaps. Look at the words you missed." : pct >= 50 ? "Halfway. Re-read the story and the patterns, then try again." : "Start again from the story. The words need more contact before a test will help.");
  document.getElementById("v-tests").innerHTML =
    '<div class="qwrap"><div class="card" style="padding:22px;text-align:center"><div class="muted" style="font-weight:800;letter-spacing:.6px;text-transform:uppercase;font-size:11px">' + esc(TESTS[key].title) + "</div>" +
      '<div class="score" style="color:' + (pct >= 70 ? "var(--green)" : pct >= 50 ? "var(--amber)" : "var(--coral)") + '">' + r.score + '<span style="font-size:22px;color:var(--ink3)"> / ' + r.total + "</span></div>" +
      '<div class="bar" style="margin:14px auto;max-width:280px"><i style="width:' + pct + '%"></i></div><p style="max-width:44ch;margin:0 auto;font-size:14.5px;color:var(--ink2)">' + esc(verdict) + "</p></div>" +
    (isTri ? '<div class="card" style="padding:18px;margin-top:14px"><div class="lbl">Your six areas</div>' + CORDER.map(c => { const b = r.byCluster[c], p = b.total ? b.right / b.total : 0, cls = p >= 0.75 ? "ok" : p >= 0.5 ? "mid" : "low";
        return '<div class="diagrow"><span class="ic">' + AREAS[c].icon + '</span><span class="tt"><b>' + AREAS[c].name + "</b><span>" + AREAS[c].blurb + '</span></span><span class="sc ' + cls + '">' + b.right + "/" + b.total + "</span>" + (p < 0.75 ? '<button class="btn ghost sm" data-focus="' + c + '">Study →</button>' : "") + "</div>"; }).join("") +
      (r.focus.length ? '<div class="row" style="margin-top:14px"><button class="btn amber" id="goFocus">Open my route (' + r.focus.length + " area" + (r.focus.length > 1 ? "s" : "") + ") →</button></div>" : "") + "</div>" : "") +
    (r.missed.length ? '<div class="card" style="padding:18px;margin-top:14px"><div class="lbl">Words to look at again (' + r.missed.length + ')</div><div class="itemchips" style="margin:0">' + [...new Set(r.missed.map(m => m.tests))].filter(id => BY[id]).map(id => '<button class="itemchip" data-word="' + id + '">' + esc(BY[id].word) + "</button>").join("") + '</div><p class="muted" style="margin:10px 0 0">They are now patients on the Recovery Ward.</p></div>'
      : '<div class="card" style="padding:18px;margin-top:14px;text-align:center"><b>Nothing missed.</b> A clean sheet.</div>') +
    '<div class="row" style="margin-top:16px;justify-content:center"><button class="btn ghost" id="backTests">← All tests</button><button class="btn" data-run2="' + key + '">Retake</button></div></div>';
  document.querySelectorAll("#v-tests [data-word]").forEach(b => b.onclick = () => { stack = []; openWord(b.dataset.word); });
  document.querySelectorAll("#v-tests [data-focus]").forEach(b => b.onclick = () => { F.cluster = b.dataset.focus; go("words"); });
  document.querySelectorAll("#v-tests [data-run2]").forEach(b => b.onclick = () => startTest(b.dataset.run2));
  const gf = document.getElementById("goFocus"); if (gf) gf.onclick = () => { F.cluster = r.focus[0]; go("words"); };
  document.getElementById("backTests").onclick = drawTests;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- Exam Room runner: MCQ, typed, define, listen-and-spell and speaking items in one set ---------- */
let X = null;
function startExam(id) {
  const s = (TESTS.exam || []).find(x => x.id === id); if (!s) return;
  if (cur !== "tests") location.hash = "#/tests";
  X = { s, i: 0, right: 0, scored: 0, skipped: 0, log: [] }; drawX();
}
function drawX() {
  const s = X.s, v = document.getElementById("v-tests");
  if (X.i >= s.items.length) return finishX();
  const q = s.items[X.i], n = s.items.length;
  if (q.type === "listenspell" && !hasClip(q.say)) { X.skipped++; X.i++; return drawX(); }   // never show the word if its clip is missing
  const top = '<div class="qwrap"><div class="qtop"><button class="btn ghost sm" id="quit">✕ Quit</button><div class="bar" style="flex:1"><i style="width:' + Math.round(X.i / n * 100) + '%"></i></div><span class="n">' + (X.i + 1) + " / " + n + "</span></div>" +
    (X.i === 0 ? '<div class="notice" style="margin-bottom:12px"><b>' + esc(s.title) + "</b> · " + esc(s.part) + "<br>" + esc(s.instructions) + "</div>" : "") +
    (s.passage ? '<div class="passage">' + passageHTML(s.passage, X.i) + "</div>" : "") +
    '<div class="qcard"><div class="qtype">' + (TYPENAME[q.type] || q.type) + "</div>";
  const nextBtn = (last) => '<div class="row" style="margin-top:12px"><button class="btn" id="nx">' + (X.i === n - 1 ? "See my result →" : "Next →") + "</button></div>";
  const done = () => { document.getElementById("nx").onclick = () => { X.i++; drawX(); }; };
  if (["typed", "unscramble", "wordform", "opencloze", "transform", "listenspell"].indexOf(q.type) > -1) {
    v.innerHTML = top +
      (q.type === "listenspell" ? '<p class="qprompt">Listen, then type the word you hear in the gap.</p><div class="row" style="margin-bottom:12px"><button class="speak lg" id="sayBtn">🔊 Play</button><button class="speak lg" id="sayBtn2">🔊 Play again</button></div>'
        : '<p class="qprompt">' + promptHTML(q.prompt) + "</p>") +
      (q.type === "wordform" ? '<p class="muted" style="margin:-10px 0 10px">Word in capitals: <b>' + esc(q.stem) + "</b></p>" : "") +
      (q.type === "transform" ? '<p class="muted" style="margin:-10px 0 10px">Use the word <b>' + esc(q.keyword) + "</b>. Between two and five words, including the word given. Do not change it.</p>" : "") +
      (q.type === "unscramble" ? '<p class="muted" style="margin:-10px 0 10px">Reorder the letters to make a part of the body.</p>' : "") +
      '<input class="typed" id="xIn" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="type your answer…"><div class="row" style="margin-top:10px"><button class="btn" id="chk">Check</button></div><div id="fb"></div></div></div>';
    const inp = document.getElementById("xIn"); inp.focus();
    if (q.type === "listenspell") { const play = () => speak(q.say); document.getElementById("sayBtn").onclick = play; document.getElementById("sayBtn2").onclick = play; play(); }
    const chk = () => {
      const ok = typedOk(inp.value, q); inp.classList.add(ok ? "ok" : "bad"); inp.disabled = true; document.getElementById("chk").disabled = true;
      X.scored++; if (ok) { X.right++; S.pts += 5; } else if (BY[q.tests]) wardAdd(q.tests);
      if (BY[q.tests]) wardTyped(q.tests, ok);
      X.log.push({ ok, prompt: q.prompt, right: q.answerText, pick: inp.value });
      document.getElementById("fb").innerHTML = '<div class="why' + (ok ? "" : " bad") + '"><b>' + (ok ? "Correct." : "Not quite.") + "</b> Answer: <b>" + esc(q.answerText) + "</b>" + ((q.accept || []).length ? " (also: " + q.accept.map(esc).join(", ") + ")" : "") + " " + esc(q.why || "") + "</div>" + nextBtn();
      done(); save(); hud();
    };
    document.getElementById("chk").onclick = chk; inp.onkeydown = e => { if (e.key === "Enter" && !inp.disabled) chk(); };
  } else if (q.type === "define") {
    const w = BY[q.tests];
    v.innerHTML = top + '<p class="qprompt">Write one simple sentence to define <b>' + esc(w ? w.word : q.tests) + "</b>.</p>" +
      '<p class="muted" style="margin:-10px 0 10px">Frame: <i>X is a [category] who / which / where …</i></p>' +
      '<textarea class="wtext" id="defIn" style="min-height:90px" placeholder="A GP is a doctor who…"></textarea><div class="row" style="margin-top:10px"><button class="btn" id="cmp">Compare with the model</button></div><div id="fb"></div></div></div>';
    document.getElementById("cmp").onclick = () => {
      const mine = document.getElementById("defIn").value.trim(); if (words(mine) < 3) return toast("Write a full sentence first.");
      document.getElementById("cmp").disabled = true;
      document.getElementById("fb").innerHTML = '<div class="lbl" style="margin-top:12px">Model answer</div><div class="model">' + esc(q.model) + '</div><p class="muted" style="margin:8px 0">Mark yourself: does your sentence name the category and say what it does?</p><div class="row" id="self"><button class="btn sm" data-self="1">✓ Mine says the same</button><button class="btn ghost sm" data-self="0">✗ Mine misses something</button></div><div id="chk2"></div>';
      document.querySelectorAll("#self [data-self]").forEach(b => b.onclick = () => {
        const selfOk = b.dataset.self === "1"; document.querySelectorAll("#self button").forEach(x => x.disabled = true);
        const c = q.check;
        document.getElementById("chk2").innerHTML = '<div class="lbl" style="margin-top:12px">Quick check</div><div class="opts" id="opts">' + c.options.map((o, i) => '<button class="opt" data-i="' + i + '"><span class="ltr">' + "ABCD"[i] + "</span><span>" + esc(o) + "</span></button>").join("") + '</div><div id="fb3"></div>';
        document.querySelectorAll("#opts .opt").forEach(ob => ob.onclick = () => {
          const pick = +ob.dataset.i, ok = pick === c.answer;
          document.querySelectorAll("#opts .opt").forEach((x, i) => { x.disabled = true; if (i === c.answer) x.classList.add("right"); else if (i === pick) x.classList.add("wrong"); });
          X.scored++; if (ok && selfOk) { X.right++; S.pts += 5; } else if (w) wardAdd(w.id);
          X.log.push({ ok: ok && selfOk, prompt: "define " + (w ? w.word : q.tests), right: q.model, pick: mine });
          document.getElementById("fb3").innerHTML = '<div class="why' + (ok ? "" : " bad") + '"><b>' + (ok ? "Correct." : "Not quite.") + "</b> " + esc(c.why) + "</div>" + nextBtn(); done(); save(); hud();
        });
      });
    };
  } else if (q.type === "speak") {
    v.innerHTML = top + '<p class="qprompt">' + esc(q.prompt) + '</p><p class="muted" style="margin:-10px 0 10px">' + esc(q.part) + ". Say it aloud for a minute, then write two sentences you said. " + (q.tip ? esc(q.tip) : "Idioms suit Speaking; keep essays neutral.") + "</p>" +
      '<textarea class="wtext" id="spIn" style="min-height:90px" placeholder="Two sentences you said…"></textarea><div class="row" style="margin-top:10px"><button class="btn" id="spk">Done</button></div><div id="fb"></div></div></div>';
    document.getElementById("spk").onclick = () => {
      const txt = document.getElementById("spIn").value, hits = detect(txt);
      document.getElementById("spk").disabled = true; X.scored++; if (hits.length) { X.right++; S.pts += 4; }
      X.log.push({ ok: hits.length > 0, prompt: q.prompt, right: "any target item", pick: txt });
      document.getElementById("fb").innerHTML = '<div class="why' + (hits.length ? "" : " bad") + '"><b>' + (hits.length ? "Target items used: " + hits.map(h => BY[h].word).join(", ") : "No target items yet.") + "</b> " + esc(q.why || "") + "</div>" + nextBtn(); done(); save(); hud();
    };
  } else {
    v.innerHTML = top + (q.type === "picture" && q.region && REG[q.region] ? '<div class="figure" style="max-width:260px;margin:0 auto 12px">' + bodySVG(REG[q.region].view, { lit: [q.region], interactive: false }) + "</div>" : "") +
      '<p class="qprompt">' + promptHTML(q.prompt) + '</p><div class="opts" id="opts">' + q.options.map((o, i) => '<button class="opt" data-i="' + i + '"><span class="ltr">' + "ABCD"[i] + "</span><span>" + esc(o) + "</span></button>").join("") + '</div><div id="fb"></div></div></div>';
    document.querySelectorAll("#opts .opt").forEach(b => b.onclick = () => {
      const pick = +b.dataset.i, ok = pick === q.answer;
      document.querySelectorAll("#opts .opt").forEach((x, i) => { x.disabled = true; if (i === q.answer) x.classList.add("right"); else if (i === pick) x.classList.add("wrong"); });
      X.scored++; if (ok) { X.right++; S.pts += 4; } else if (BY[q.tests]) wardAdd(q.tests);
      X.log.push({ ok, prompt: q.prompt, right: q.options[q.answer], pick: q.options[pick] });
      document.getElementById("fb").innerHTML = '<div class="why' + (ok ? "" : " bad") + '"><b>' + (ok ? "Correct." : "Not quite.") + "</b> " + esc(q.why) + "</div>" + nextBtn(); done(); save(); hud();
    });
  }
  document.getElementById("quit").onclick = () => { X = null; drawTests(); };
  wireSpeak(v); window.scrollTo({ top: 0, behavior: "smooth" });
}
function passageHTML(p, cur) { let k = 0; return esc(p).replace(/\(\d+\)\s*_{3,}|_{3,}/g, m => { const h = '<span class="gap' + (k === cur ? " cur" : "") + '">' + m + "</span>"; k++; return h; }); }
function finishX() {
  const s = X.s, total = X.scored, score = X.right;
  const prev = S.exam[s.id]; if (!prev || score >= prev.score) S.exam[s.id] = { score, total, at: Date.now() };
  S.pts += score; touchDay(); save(); hud(); award("exam");
  const pct = total ? Math.round(score / total * 100) : 0;
  document.getElementById("v-tests").innerHTML = '<div class="qwrap"><div class="card" style="padding:22px;text-align:center"><div class="muted" style="font-weight:800;letter-spacing:.6px;text-transform:uppercase;font-size:11px">' + esc(s.title) + "</div>" +
    '<div class="score" style="color:' + (pct >= 70 ? "var(--green)" : pct >= 50 ? "var(--amber)" : "var(--coral)") + '">' + score + '<span style="font-size:22px;color:var(--ink3)"> / ' + total + "</span></div>" + (X.skipped ? '<p class="muted">' + X.skipped + " listening item" + (X.skipped > 1 ? "s" : "") + " skipped because the recording is missing.</p>" : "") + "</div>" +
    (X.log.some(l => !l.ok) ? '<div class="card" style="padding:18px;margin-top:14px"><div class="lbl">Review</div>' + X.log.filter(l => !l.ok).map(l => '<div class="diagrow"><span class="tt"><b style="font-weight:500;font-family:var(--serif)">' + esc(l.prompt) + '</b><span>Answer: <b>' + esc(l.right) + "</b>" + (l.pick ? " · you wrote: " + esc(l.pick) : "") + "</span></span></div>").join("") + "</div>" : "") +
    '<div class="row" style="margin-top:16px;justify-content:center"><button class="btn ghost" id="backTests">← All tests</button><button class="btn" id="again">Again</button></div></div>';
  document.getElementById("backTests").onclick = drawTests; document.getElementById("again").onclick = () => startExam(s.id); X = null;
}

/* ---------- Clinic Shift ---------- */
function startClinic() {
  const cards = shuffle(TESTS.clinicShift || []), v = document.getElementById("v-tests"); let i = 0, score = 0;
  const ROUTES = [["home", "🏠 Stay home and rest", "fluids, sleep, paracetamol if needed"], ["chemist", "💊 The chemist", "advice and remedies without a prescription"], ["gp", "🩺 A GP or clinic", "not urgent, but a doctor should look"], ["ae", "🚑 A and E", "urgent: call 1669"]];
  const draw = () => {
    if (i >= cards.length) {
      const rec = { score, total: cards.length * 2, at: Date.now() }; if (!S.clinic || score >= S.clinic.score) S.clinic = rec; S.pts += score; touchDay(); save(); hud(); award("clinic");
      v.innerHTML = '<div class="qwrap"><div class="card" style="padding:22px;text-align:center"><div class="muted" style="font-weight:800;letter-spacing:.6px;text-transform:uppercase;font-size:11px">Clinic Shift</div><div class="score" style="color:var(--green)">' + score + '<span style="font-size:22px;color:var(--ink3)"> / ' + cards.length * 2 + '</span></div><p class="muted">One point for the right place, one for the right word.</p></div><div class="row" style="margin-top:16px;justify-content:center"><button class="btn ghost" id="backTests">← All tests</button><button class="btn" id="again">Another shift</button></div></div>';
      document.getElementById("backTests").onclick = drawTests; document.getElementById("again").onclick = startClinic; return;
    }
    const c = cards[i];
    v.innerHTML = '<div class="qwrap"><div class="qtop"><button class="btn ghost sm" id="quit">✕ Quit</button><div class="bar" style="flex:1"><i style="width:' + Math.round(i / cards.length * 100) + '%"></i></div><span class="n">' + (i + 1) + " / " + cards.length + '</span></div>' +
      '<div class="qcard"><div class="qtype">Clinic Shift · patient ' + (i + 1) + '</div><p class="qprompt">“' + esc(c.patient) + '” ' + speakBtn(c.patient) + '</p><p class="muted" style="margin:-8px 0 10px">Step 1: where should she go?</p><div class="routebtns" id="routes">' + ROUTES.map(r => '<button class="routebtn" data-r="' + r[0] + '">' + r[1] + "<small>" + r[2] + "</small></button>").join("") + '</div><div id="step2"></div><div id="fb"></div></div></div>';
    document.getElementById("quit").onclick = drawTests; wireSpeak(v);
    document.querySelectorAll("#routes .routebtn").forEach(b => b.onclick = () => {
      const okR = b.dataset.r === c.route; if (okR) score++;
      document.querySelectorAll("#routes .routebtn").forEach(x => { x.disabled = true; if (x.dataset.r === c.route) x.classList.add("right"); else if (x === b) x.classList.add("wrong"); });
      document.getElementById("step2").innerHTML = '<p class="muted" style="margin:12px 0 8px">' + (okR ? "Right place. " : "Better: " + ROUTES.find(r => r[0] === c.route)[1].replace(/^\S+\s/, "") + ". ") + 'Step 2: which word names the problem?</p><div class="opts" id="opts">' + c.options.map((o, k) => '<button class="opt" data-i="' + k + '"><span class="ltr">' + "ABCD"[k] + "</span><span>" + esc(o) + "</span></button>").join("") + "</div>";
      document.querySelectorAll("#opts .opt").forEach(ob => ob.onclick = () => {
        const pick = +ob.dataset.i, ok = pick === c.answer; if (ok) score++; else wardAdd(c.word);
        document.querySelectorAll("#opts .opt").forEach((x, k) => { x.disabled = true; if (k === c.answer) x.classList.add("right"); else if (k === pick) x.classList.add("wrong"); });
        document.getElementById("fb").innerHTML = '<div class="why' + (ok && okR ? "" : " bad") + '"><b>' + (ok ? "Correct." : "Not quite.") + "</b> " + esc(c.why) + " " + speakBtn(c.why) + '</div><div class="row" style="margin-top:12px"><button class="btn" id="nx">Next patient →</button></div>'; wireSpeak(v);
        document.getElementById("nx").onclick = () => { i++; draw(); }; save();
      });
    });
  };
  draw();
}

/* ==================================================================
   WRITING CLINIC — five typed missions, instant offline feedback
   ================================================================== */
const RX = {}; Object.keys(ROLEPLAY.MATCH || {}).forEach(k => { try { RX[k] = new RegExp("\\b(?:" + ROLEPLAY.MATCH[k] + ")\\b", "i"); } catch (e) {} });
function detect(text) { return Object.keys(RX).filter(k => BY[k] && RX[k].test(text)); }
const FLAGS = (WRITING.errorFlags || []).map(f => { try { return { rx: new RegExp(f.rx, "i"), says: f.says, fix: f.fix }; } catch (e) { return null; } }).filter(Boolean);
function analyse(m, text) {
  const used = detect(text), must = (m.mustUse || []).filter(id => used.indexOf(id) > -1), wc = words(text);
  const linkers = (m.linkers || []).filter(l => new RegExp("\\b" + l.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i").test(text));
  const flags = FLAGS.filter(f => f.rx.test(text));
  const grammar = (m.grammarRx ? m.grammarRx.map(g => { try { return { label: g.label, ok: new RegExp(g.rx, "i").test(text) }; } catch (e) { return null; } }).filter(Boolean) : []);
  return { used, must, wc, linkers, flags, grammar };
}
function drawWriting() {
  const v = document.getElementById("v-writing"), ms = WRITING.missions || [];
  if (!ms.length) { v.innerHTML = '<h2 class="sec">Writing Clinic</h2><p class="lede">No missions loaded yet.</p>'; return; }
  const id = P[0]; const m = ms.find(x => x.id === id);
  if (!m) {
    v.innerHTML = '<h2 class="sec">Writing Clinic</h2><p class="lede">Writing a short text with the words teaches them better than single sentences, and far better than gap fills. Five typed missions, 40 to 120 words each, marked instantly on your device: target words found, word count, linkers, and “Check:” flags for the slips Thai learners make. Then copy it for T.Chris.</p><div class="grid2">' +
      ms.map(x => { const d = S.writing[x.id]; return '<div class="mission"><h3>' + esc(x.id) + " · " + esc(x.title) + '</h3><div class="meta">' + esc(x.type) + " · " + x.min + "–" + x.max + " words</div><p class=\"muted\" style=\"margin:0;flex:1\">" + esc(x.brief.slice(0, 110)) + (x.brief.length > 110 ? "…" : "") + "</p>" +
        "<div>" + (d && d.text ? '<span class="tstate">Draft saved · ' + words(d.text) + " words · " + (d.used || 0) + " targets</span>" : '<span class="muted">Not started</span>') + '</div><button class="btn sm" data-m="' + x.id + '">' + (d && d.text ? "Continue" : "Start") + "</button></div>"; }).join("") + "</div>";
    v.querySelectorAll("[data-m]").forEach(b => b.onclick = () => go("writing", [b.dataset.m])); return;
  }
  const d = S.writing[m.id] || { text: "" };
  v.innerHTML = '<div class="row"><button class="btn ghost sm" id="backW">← All missions</button></div>' +
    '<h2 class="sec" style="margin-top:10px">' + esc(m.id) + " · " + esc(m.title) + '</h2><p class="lede">' + esc(m.brief) + " " + speakBtn(m.brief) + "</p>" +
    '<div class="notice" style="margin-bottom:12px"><b>' + esc(m.type) + "</b> · " + m.min + "–" + m.max + " words · grammar to show: " + bold(m.grammar) + "</div>" +
    '<div class="lbl">Words to use · tap to study</div><div class="itemchips" style="margin:0 0 12px" id="must">' + (m.mustUse || []).filter(x => BY[x]).map(x => '<button class="itemchip" data-word="' + x + '">' + esc(BY[x].word) + "</button>").join("") + "</div>" +
    '<textarea class="wtext" id="wIn" placeholder="Type here… (saved on this device as you go)">' + esc(d.text) + "</textarea>" +
    '<div class="fbgrid" id="fb"></div>' +
    '<div class="row" style="margin-top:14px"><button class="btn" id="copyW">📋 Copy for T.Chris</button><button class="btn ghost" id="showModel">Show a model answer</button><button class="btn ghost sm" id="clearW">Clear</button></div><div id="model" style="margin-top:12px"></div>';
  const ta = document.getElementById("wIn"), fb = document.getElementById("fb");
  const paint = () => {
    const a = analyse(m, ta.value);
    S.writing[m.id] = { text: ta.value, used: a.must.length, at: Date.now() }; save();
    document.querySelectorAll("#must .itemchip").forEach(c => { const on = a.used.indexOf(c.dataset.word) > -1; c.style.background = on ? "var(--green)" : ""; c.style.color = on ? "#fff" : ""; c.style.borderColor = on ? "var(--green)" : ""; });
    const bandOk = a.wc >= m.min && a.wc <= m.max;
    fb.innerHTML = '<div class="fb"><h5>Target words</h5><span class="' + (a.must.length >= Math.min(4, (m.mustUse || []).length) ? "ok" : "warn") + '">' + a.must.length + " / " + (m.mustUse || []).length + " from the list</span>" + (a.used.length > a.must.length ? '<div class="muted">+ ' + (a.used.length - a.must.length) + " other target items</div>" : "") + "</div>" +
      '<div class="fb"><h5>Length</h5><span class="wcount ' + (bandOk ? "ok" : "warn") + '">' + a.wc + "</span> words · band " + m.min + "–" + m.max + "</div>" +
      '<div class="fb"><h5>Linkers' + ((m.linkers || []).length ? "" : " (none required)") + "</h5>" + (a.linkers.length ? '<span class="ok">' + a.linkers.map(esc).join(", ") + "</span>" : '<span class="muted">Try: ' + (m.linkers || []).slice(0, 4).map(esc).join(", ") + "</span>") + "</div>" +
      (a.grammar.length ? '<div class="fb"><h5>Grammar</h5>' + a.grammar.map(g => '<div><span class="' + (g.ok ? "ok" : "warn") + '">' + (g.ok ? "✓" : "○") + "</span> " + esc(g.label) + "</div>").join("") + "</div>" : "") +
      '<div class="fb" style="grid-column:1/-1"><h5>Check these</h5>' + (a.flags.length ? a.flags.map(f => '<div class="flag"><b>' + esc(f.says) + "</b> → " + esc(f.fix) + "</div>").join("") : '<span class="muted">No flags. (Flags are suggestions, not verdicts: some patterns are fine in other sentences.)</span>') + "</div>";
    document.querySelectorAll("#must [data-word]").forEach(c => c.onclick = () => { stack = []; openWord(c.dataset.word); });
    if (ta.value.trim() && a.wc >= m.min) award("mission");
  };
  ta.oninput = paint; paint(); touchDay();
  document.getElementById("backW").onclick = () => go("writing"); wireSpeak(v);
  document.getElementById("clearW").onclick = () => { if (confirm("Clear this draft?")) { ta.value = ""; paint(); } };
  document.getElementById("showModel").onclick = () => { const md = document.getElementById("model"); md.innerHTML = '<div class="lbl">A model answer · read it after you have written yours</div><div class="model">' + esc(m.model) + '</div><div class="row" style="margin-top:8px">' + speakBtn(m.model, "Listen to the model") + "</div>"; wireSpeak(md); };
  document.getElementById("copyW").onclick = () => {
    const a = analyse(m, ta.value);
    const summary = ["Writing Clinic " + m.id + " · " + m.title + " · " + today(), "", ta.value.trim(), "", "— Summary —", "Words: " + a.wc + " (band " + m.min + "–" + m.max + ")",
      "Target items used: " + a.used.map(x => BY[x].word).join(", "), "Linkers: " + (a.linkers.join(", ") || "none"), "Flags: " + (a.flags.length ? a.flags.map(f => f.says + " → " + f.fix).join("; ") : "none")].join("\n");
    copyText(summary, "Copied. Paste it into Line for T.Chris.");
  };
}

/* ==================================================================
   ROLEPLAY — cumulative final boss (data/roleplay.js). Unlocks after story page 11.
   ================================================================== */
function drawRoleplay() {
  const v = document.getElementById("v-roleplay"), SC = ROLEPLAY.SCENE;
  if (!SC) { v.innerHTML = '<h2 class="sec">Roleplay</h2><p class="lede">No scene loaded yet.</p>'; return; }
  if (!readPage11() && !(S.rp && S.rp.turn > 0)) {
    v.innerHTML = '<h2 class="sec">🎭 ' + esc(SC.title) + '</h2><div class="lock"><p style="margin:0 0 10px"><b>Locked.</b> The boss sits between story page 11 and the final. Read up to page 11 first.</p><button class="btn" id="toStory">Open the story</button></div>';
    document.getElementById("toStory").onclick = () => go("story"); return;
  }
  const turns = SC.turns, them = (SC.speakers && SC.speakers.them) || "Coach";
  if (!S.rp) S.rp = { log: [{ who: "them", name: turns[0].who, text: turns[0].text }], turn: 0, used: [], done: false };
  const r = S.rp, used = r.used;
  v.innerHTML = '<div class="rp"><div class="rphead"><h3>🎭 ' + esc(SC.title) + '</h3><div class="muted" style="font-weight:700;margin-bottom:7px">' + esc(SC.sub) + "</div><p style='margin:0;font-size:14px'>" + esc(SC.brief) + " " + speakBtn(SC.brief) + "</p>" +
      '<div class="row" style="margin-top:11px"><div class="bar" style="flex:1"><i style="width:' + Math.min(100, Math.round(used.length / SC.target * 100)) + '%"></i></div><span class="muted">Items used: <b>' + used.length + "</b> / " + TOTAL + " · target " + SC.target + "</span></div></div>" +
    '<div class="chatlog" id="log">' + r.log.map(m => m.who === "sys" ? '<div class="msg sys">' + esc(m.text) + "</div>"
      : '<div class="msg ' + m.who + '"><span class="who">' + esc(m.who === "them" ? (m.name || them) : "You, as Praew") + "</span>" + esc(m.text) + (m.who === "them" ? " " + speakBtn(m.text) : "") + (m.hits && m.hits.length ? '<div class="hits">' + m.hits.map(h => '<span class="hit">' + esc(BY[h].word) + "</span>").join("") + "</div>" : "") + "</div>").join("") + "</div>" +
    (r.done ? '<div class="row" style="justify-content:center"><button class="btn ghost" id="rsRP">↺ Start again</button></div>'
      : '<div class="composer"><textarea id="rpIn" rows="2" maxlength="700" placeholder="Answer in two or three sentences…"></textarea><button class="btn" id="rpSend">Send ➤</button></div><div class="row" style="margin-top:9px;justify-content:space-between"><span class="muted" id="cc">0 / 700</span><button class="btn ghost sm" id="rsRP">↺ Restart</button></div>') +
    '<div style="margin-top:16px"><div class="lbl">The 70 items · green means you have used it</div><div class="wordwall">' + TARGETS.map(w => '<span class="ww' + (used.indexOf(w.id) > -1 ? " used" : "") + '">' + esc(w.word) + "</span>").join("") + "</div></div></div>";
  const rs = document.getElementById("rsRP"); if (rs) rs.onclick = () => { stopSpeech(); S.rp = null; save(); drawRoleplay(); };
  wireSpeak(v);
  const ta = document.getElementById("rpIn");
  if (ta) { ta.focus(); ta.oninput = () => { document.getElementById("cc").textContent = ta.value.length + " / 700"; ta.style.height = "auto"; ta.style.height = Math.min(150, ta.scrollHeight) + "px"; };
    ta.onkeydown = e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) sendRP(); }; document.getElementById("rpSend").onclick = sendRP; }
  const log = document.getElementById("log"); if (log && r.log.length > 1) log.lastElementChild.scrollIntoView({ block: "end", behavior: "smooth" });
}
function sendRP() {
  const SC = ROLEPLAY.SCENE, ta = document.getElementById("rpIn"), text = ta.value.trim(); if (text.length < 3) return;
  const r = S.rp, hits = detect(text).filter(h => BY[h].group !== "bonus"), fresh = hits.filter(h => r.used.indexOf(h) < 0);
  fresh.forEach(h => r.used.push(h)); r.log.push({ who: "me", text, hits }); S.pts += fresh.length * 5; touchDay();
  if (hits.length === 0 && r.turn < SC.turns.length - 2) { r.log.push({ who: "them", name: SC.turns[r.turn].who, text: SC.nudges[r.turn % SC.nudges.length] }); }
  else {
    r.turn++;
    if (r.turn < SC.turns.length) { r.log.push({ who: "them", name: SC.turns[r.turn].who, text: SC.turns[r.turn].text }); if (fresh.length >= 3) r.log.push({ who: "sys", text: "+" + fresh.length * 5 + " points · " + fresh.length + " new items: " + fresh.map(f => BY[f].word).join(", ") }); }
    if (r.turn >= SC.turns.length - 1) { r.done = true; const n = r.used.length;
      if (n >= SC.target) award("boss");
      r.log.push({ who: "sys", text: n >= SC.target ? "★ Boss cleared. You used " + n + " of the 70 items and hit the target of " + SC.target + ". Cleared to play." : "You used " + n + " of the 70 items. The target was " + SC.target + ". Not cleared yet. Restart and work more of the word wall in." }); }
  }
  save(); hud(); drawRoleplay();
}

/* ==================================================================
   MEDIA — nodes are always present; media.js fills them
   ================================================================== */
function mediaNode(m) {
  const tags = []; if (m.duration) tags.push(esc(m.duration)); if (m.chapter) tags.push("Chapter " + m.chapter); if (m.pattern) tags.push("pattern: " + esc(m.pattern));
  (m.words || []).forEach(id => { if (BY[id]) tags.push(esc(BY[id].word)); });
  let player = "";
  if (m._kind === "podcast") player = m.external ? '<div class="row" style="margin-top:11px"><a class="btn sm" href="' + esc(m.url) + '" target="_blank" rel="noopener">🎧 Listen</a></div>' : '<audio controls preload="none" src="' + esc(m.url) + '"></audio>';
  else if (m._kind === "video") { if (m.youtube) player = '<div class="frame"><iframe src="https://www.youtube-nocookie.com/embed/' + esc(m.youtube) + '" title="' + esc(m.title) + '" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen loading="lazy"></iframe></div>';
    else if (m.iframe) player = '<div class="frame"><iframe src="' + esc(m.iframe) + '" title="' + esc(m.title) + '" allowfullscreen loading="lazy"></iframe></div>'; else if (m.url) player = '<video controls preload="none" src="' + esc(m.url) + '"></video>'; }
  else player = '<div class="row" style="margin-top:11px"><a class="btn sm" href="' + esc(m.url) + '" target="_blank" rel="noopener">Open →</a></div>';
  return '<div class="mnode"><h4>' + MICON[m._kind] + " " + esc(m.title) + "</h4>" + (m.blurb ? '<p class="muted" style="margin:0">' + esc(m.blurb) + "</p>" : "") + (tags.length ? '<div class="colls" style="margin-top:7px">' + tags.map(t => '<span class="coll">' + t + "</span>").join("") + "</div>" : "") + player + (m.transcript ? '<details class="trans"><summary>Show transcript</summary><p>' + esc(m.transcript) + "</p></details>" : "") + "</div>";
}
function shelf(cfg, items, kind) {
  if (!cfg) return ""; const list = (items || []).map(x => Object.assign({ _kind: kind }, x));
  return '<div class="shelf"><div class="shelfhead"><h3>' + esc(cfg.title || "") + '</h3><span class="ct">' + list.length + " item" + (list.length === 1 ? "" : "s") + "</span></div>" + (cfg.blurb ? '<p class="lede" style="margin-bottom:11px">' + esc(cfg.blurb) + "</p>" : "") +
    (list.length ? list.map(mediaNode).join("") : '<div class="mnode empty"><h4>' + MICON[kind] + ' Node ready</h4><p class="muted" style="margin:0">' + esc(cfg.comingSoon || "Nothing added yet.") + "</p></div>") + "</div>";
}
function drawMedia() {
  document.getElementById("v-media").innerHTML = '<h2 class="sec">Listen and watch</h2><p class="lede">Podcast and video nodes are wired in. To fill them, open <b>media.js</b> and paste an episode object into the list; the chips appear in the story, the words and the patterns automatically.</p>' +
    shelf(MEDIA.podcast, (MEDIA.podcast || {}).episodes, "podcast") + shelf(MEDIA.video, (MEDIA.video || {}).episodes, "video") + shelf(MEDIA.extras, (MEDIA.extras || {}).items, "extra");
}

/* ==================================================================
   INIT
   ================================================================== */
function applyTheme() { if (S.theme) document.documentElement.setAttribute("data-theme", S.theme); else document.documentElement.removeAttribute("data-theme"); }
load(); applyTheme(); hud(); buildTabs();
document.getElementById("footcounts").textContent = W.length + " items · " + Object.keys(LEX).length + " linked synonyms and antonyms · " + storyPageCount() + " story pages · " + PATS.length + " pattern cards";
route();
