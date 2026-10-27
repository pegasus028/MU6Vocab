// Lists every text the app reads aloud, exactly as app.js passes it to speak()/readAloud(), with the key app.js
// uses to find its MP3. Usage: node tools/tts-list.js  → JSON [{key, kind, ref, text}] on stdout.
// Text goes through speechText() from tts-clean.js (the same file the browser loads), then ttsNorm/ttsKey,
// which must stay identical to app.js.
// Spoken: words (headword, meaning, examples, textbook line, trap, tip); lexicon entries (headword, meaning,
// examples, note); story pages and their grammar lines; pattern cards (title, insight, examples, drill, reveal);
// body map Find-it prompts and Where-does-it-hurt cases (+ explanations); Clinic Shift patients (+ explanations);
// Writing Clinic briefs and model answers; the roleplay brief, coach turns and nudges; Exam Room listening sentences.
const path = require("path");
const load = require("./load.js");
const speechText = require("../tts-clean.js");
function ttsNorm(s) { return String(s || "").replace(/\s+/g, " ").trim(); }
function ttsKey(s) { s = ttsNorm(s); let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return ("0000000" + h.toString(16)).slice(-8); }
const c = load(path.join(__dirname, "..", "data"));
const out = [], seen = {};
function add(kind, ref, raw) {
  const text = ttsNorm(speechText(raw)); if (!text || !/[a-z0-9]/i.test(text)) return;
  const key = ttsKey(text);
  if (seen[key]) { if (seen[key] !== text) throw new Error("Key collision: " + key); return; }
  seen[key] = text; out.push({ key, kind, ref, text });
}
for (const w of (c.WORDS || [])) {
  add("word", w.id, w.word); add("def", w.id + ":def", w.def);
  (w.ex || []).forEach((e, i) => add("example", w.id + ":" + i, e));
  add("textbook", w.id + ":textbook", w.textbook); add("trap", w.id + ":trap", w.trap); add("tip", w.id + ":tip", w.tip);
}
Object.keys(c.LEXICON || {}).forEach(t => { const e = c.LEXICON[t] || {};
  add("lexicon", t, t); add("lexdef", t + ":def", e.def); (e.ex || []).forEach((x, i) => add("lexex", t + ":" + i, x)); add("lexnote", t + ":note", e.note); });
((c.STORY || {}).chapters || []).forEach((ch, ci) => (ch.pages || []).forEach((pg, pi) => {
  String(pg.text || "").split(/\n\s*\n/).forEach((t, k) => add("story", (ci + 1) + "." + (pi + 1) + ":p" + (k + 1), t)); add("grammar", (ci + 1) + "." + (pi + 1) + ":grammar", pg.grammar); }));
(c.PATTERNS || []).forEach(p => { add("pattern", p.id + ":title", p.title); add("pattern", p.id + ":insight", p.insight);
  (p.examples || []).forEach((x, i) => add("pattern", p.id + ":ex" + i, x)); add("pattern", p.id + ":drill", "Try it now. " + (p.drill || ""));
  if (p.game && p.game.reveal) add("pattern", p.id + ":reveal", p.game.reveal); });
const B = c.BODY || {};
(B.findPrompts || []).forEach((p, i) => add("find", "find:" + i, p.text));
(B.hurtCases || []).forEach((h, i) => { add("hurt", "hurt:" + i, h.text); add("hurtwhy", "hurt:" + i + ":why", h.why); });
((c.TESTS || {}).clinicShift || []).forEach(s => { add("clinic", s.id, s.patient); add("clinicwhy", s.id + ":why", s.why); });
((c.TESTS || {}).exam || []).forEach(s => (s.items || []).forEach((q, i) => { if (q.type === "listenspell" && q.say) add("listen", s.id + ":" + i, q.say); }));
((c.WRITING || {}).missions || []).forEach(m => { add("brief", m.id + ":brief", m.brief); add("model", m.id + ":model", m.model); });
const SC = (c.ROLEPLAY || {}).SCENE;
if (SC) { add("roleplay", "rp:brief", SC.brief); (SC.turns || []).forEach((t, i) => add("roleplay", "rp:turn" + i, t.text)); (SC.nudges || []).forEach((t, i) => add("roleplay", "rp:nudge" + i, t)); }
if (require.main === module) process.stdout.write(JSON.stringify(out, null, 1));
module.exports = { list: out, ttsKey, ttsNorm, speechText };
