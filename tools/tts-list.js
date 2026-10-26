// Lists every text the app reads aloud, exactly as app.js passes it to speak(), with the key app.js uses to find its MP3.
// Usage: node tools/tts-list.js  → JSON [{key, kind, ref, text}] on stdout.   Keep ttsNorm/ttsKey identical to app.js.
// Spoken: every word and its two examples; every story page (markup stripped, paragraphs joined); every lexicon headword;
// the Exam Room listen-and-spell sentences (item.say); the body-map Find-it prompts.
const path = require("path");
const load = require("./load.js");
function ttsNorm(s) { return String(s || "").replace(/\s+/g, " ").trim(); }
function ttsKey(s) { s = ttsNorm(s); let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return ("0000000" + h.toString(16)).slice(-8); }
const c = load(path.join(__dirname, "..", "data"));
const out = [], seen = {};
function add(kind, ref, text) {
  text = ttsNorm(text); if (!text) return;
  const key = ttsKey(text);
  if (seen[key]) { if (seen[key] !== text) throw new Error("Key collision: " + key); return; }
  seen[key] = text; out.push({ key, kind, ref, text });
}
for (const w of (c.WORDS || [])) { add("word", w.id, w.word); (w.ex || []).forEach((e, i) => add("example", w.id + ":" + i, e)); }
((c.STORY || {}).chapters || []).forEach((ch, ci) => (ch.pages || []).forEach((pg, pi) =>
  add("story", (ci + 1) + "." + (pi + 1), pg.text.split(/\n\s*\n/).map(p => p.replace(/\{\{([a-z]+)\|([^}]*)\}\}/g, "$2")).join(" "))));
Object.keys(c.LEXICON || {}).forEach(t => add("lexicon", t, t));
((c.TESTS || {}).exam || []).forEach(s => (s.items || []).forEach((q, i) => { if (q.type === "listenspell" && q.say) add("listen", s.id + ":" + i, q.say); }));
((c.BODY || {}).findPrompts || []).forEach((p, i) => add("find", "find:" + i, p.text));
if (require.main === module) process.stdout.write(JSON.stringify(out, null, 1));
module.exports = { list: out, ttsKey, ttsNorm };
