// Flow test (Playwright): walks the app the way Mikii would, on a 390 px phone in light and dark, and fails on any page error,
// horizontal overflow, missing recording, or a flow that cannot be completed.
// Usage: node tools/flow.js [base=http://127.0.0.1:8077]   (start `python3 -m http.server 8077` in the app folder first)
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
(async () => {
  const base = process.argv[2] || "http://127.0.0.1:8077";
  const out = path.join(__dirname, "..", "..", "shots"); fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] }).catch(() => chromium.launch());
  const errs = [], notes = [];
  const shot = (p, n) => p.screenshot({ path: path.join(out, "f_" + n + ".png"), fullPage: false });
  for (const theme of ["light", "dark"]) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, colorScheme: theme });
    const p = await ctx.newPage();
    p.on("pageerror", e => errs.push("PAGEERR " + theme + " " + e.message));
    p.on("console", m => { if (m.type() === "error" && !/favicon|404/.test(m.text())) errs.push("CONSOLE " + theme + " " + m.text()); });
    p.on("dialog", d => d.accept());
    const overflow = async (n) => { if (await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)) errs.push("H-OVERFLOW " + theme + " " + n); };
    // instrument audio
    await p.addInitScript(() => {
      window.__plays = []; window.__synth = 0;
      const op = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function () { window.__plays.push(this.src); return op.call(this); };
      if (window.speechSynthesis) { const os = speechSynthesis.speak.bind(speechSynthesis); speechSynthesis.speak = u => { window.__synth++; return os(u); }; }
    });
    await p.goto(base + "/#/home"); await p.waitForTimeout(400); await p.evaluate(() => localStorage.removeItem("mu6vocab.v1")); await p.reload(); await p.waitForTimeout(400);
    // seed Money Matters storage to prove it survives
    await p.evaluate(() => localStorage.setItem("moneymatters.v1", JSON.stringify({ learned: ["account"], pts: 99 })));

    // 1. Words: open a card and three levels of synonyms
    await p.goto(base + "/#/words"); await p.waitForTimeout(300); await overflow("words");
    await p.click(".wcard >> nth=0"); await p.waitForTimeout(250); await shot(p, theme + "_card");
    let depth = 0;
    for (let i = 0; i < 3; i++) { const s = await p.$(".sheet [data-term]"); if (!s) break; await s.click(); await p.waitForTimeout(150); depth++; }
    if (depth < 3) errs.push("synonym stack only " + depth + " deep");
    const back = await p.$(".sheet [data-act='back']"); if (!back) errs.push("no back bar in stacked card"); else await back.click();
    await p.click(".sheet [data-act='close']");
    const hasIpa = await p.evaluate(() => (window.WORDS || []).every(w => w.ipa)); if (!hasIpa) errs.push("a word has no ipa");

    // 2. Story: page everything with audio
    await p.goto(base + "/#/story/1/1"); await p.waitForTimeout(300);
    const pages = await p.evaluate(() => [].concat(...STORY.chapters.map(c => c.pages)).length);
    for (let i = 0; i < pages; i++) {
      await p.click("#listenPage"); await p.waitForTimeout(120);
      const ok = await p.evaluate(() => { const t = [].concat(...STORY.chapters.map(c => c.pages))[0]; return true; });
      if (i === 2) { await p.click(".kw >> nth=0"); await p.waitForTimeout(150); await p.click(".sheet [data-act='close']"); }
      const nx = await p.$("#nextP:not([disabled])"); if (nx) await nx.click(); await p.waitForTimeout(80);
    }
    const plays = await p.evaluate(() => window.__plays.length), synth = await p.evaluate(() => window.__synth);
    if (plays < pages) errs.push("story audio: only " + plays + " mp3 plays for " + pages + " pages");
    if (synth) errs.push("story audio fell back to browser voice " + synth + " times");
    const paused = await p.evaluate(() => true);
    await shot(p, theme + "_story"); await overflow("story");
    const missing = await p.evaluate(() => { const need = []; const K = s => { s = String(s || "").replace(/\s+/g, " ").trim(); let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return ("0000000" + h.toString(16)).slice(-8); };
      const set = {}; (TTS.keys || []).forEach(k => set[k] = 1); WORDS.forEach(w => { if (!set[K(w.word)]) need.push(w.id); w.ex.forEach(e => { if (!set[K(e)]) need.push(w.id + ":ex"); }); });
      STORY.chapters.forEach((c, ci) => c.pages.forEach((pg, pi) => { const t = pg.text.split(/\n\s*\n/).map(x => x.replace(/\{\{([a-z]+)\|([^}]*)\}\}/g, "$2")).join(" "); if (!set[K(t)]) need.push("page " + (ci + 1) + "." + (pi + 1)); })); return need; });
    if (missing.length) errs.push("clips missing in manifest: " + missing.slice(0, 8).join(", ") + (missing.length > 8 ? " +" + (missing.length - 8) : ""));

    // 3. Body map: Find it and Name it
    await p.goto(base + "/#/body/find"); await p.waitForTimeout(300); await overflow("body");
    for (let i = 0; i < 16; i++) {
      const reg = await p.evaluate(() => { const q = BM.run && BM.run.qs[BM.run.i]; return q ? BODY.regions.find(r => r.id === q.region) : null; });
      if (!reg) break;
      if (reg.view !== BM_view(await p.evaluate(() => BM.view))) await p.click(".figure [data-v='" + reg.view + "']");
      await p.click(".figure [data-region='" + reg.id + "']", { force: true }); await p.waitForTimeout(60);
    }
    await p.waitForTimeout(200); await shot(p, theme + "_find");
    const findScore = await p.evaluate(() => (S.body && S.body.find) || 0); if (findScore < 16) errs.push("Find it: " + findScore + "/16 by tapping the right regions");
    await p.goto(base + "/#/body/name"); await p.waitForTimeout(300);
    for (let i = 0; i < 16; i++) {
      const w = await p.evaluate(() => { const q = BM.run && BM.run.qs[BM.run.i]; return q ? WORDS.find(x => x.id === q.word).word : null; }); if (!w) break;
      await p.fill("#nameIn", i === 0 ? w.toUpperCase() + "." : w); await p.click("#chk"); await p.waitForTimeout(60); await p.click("#nx"); await p.waitForTimeout(40);
    }
    const nameScore = await p.evaluate(() => (S.body && S.body.name) || 0); if (nameScore < 16) errs.push("Name it: " + nameScore + "/16 (typed marking)");
    await shot(p, theme + "_name");

    // 4. Placement Check and route
    await p.goto(base + "/#/tests"); await p.waitForTimeout(300); await overflow("tests");
    await p.click("[data-run='triage']"); await p.waitForTimeout(200);
    for (let k = 0; k < 24; k++) { const ans = await p.evaluate(() => T.t.questions[T.i].answer); await p.click(".opt >> nth=" + (k % 3 === 0 ? (ans + 1) % 4 : ans)); await p.waitForTimeout(40); await p.click("#nx"); await p.waitForTimeout(40); }
    await shot(p, theme + "_route");
    const focus = await p.evaluate(() => S.focus); notes.push("route after placement: " + JSON.stringify(focus));
    await p.goto(base + "/#/home"); await p.waitForTimeout(300); await shot(p, theme + "_home");
    const ns = await p.textContent(".hero h3"); if (!/Study|patient/.test(ns)) errs.push("Home next step after placement did not route: " + ns);

    // 5. Final B2 and one Exam Room set (typed)
    await p.goto(base + "/#/tests"); await p.waitForTimeout(300); await p.click("[data-run='finalB2']"); await p.waitForTimeout(200);
    for (let k = 0; k < 20; k++) { const ans = await p.evaluate(() => T.t.questions[T.i].answer); await p.click(".opt >> nth=" + ans); await p.waitForTimeout(30); await p.click("#nx"); await p.waitForTimeout(30); }
    const b2 = await p.evaluate(() => S.tests.finalB2 && S.tests.finalB2.score); if (b2 !== 20) errs.push("Final B2 keyed answers scored " + b2);
    await p.goto(base + "/#/tests"); await p.waitForTimeout(300); await p.click("[data-exam='B3']"); await p.waitForTimeout(200);
    for (let k = 0; k < 8; k++) { const a = await p.evaluate(() => X.s.items[X.i].answerText); await p.fill("#xIn", k % 2 ? "’" + a.toUpperCase() + "." : a); await p.click("#chk"); await p.waitForTimeout(40); await p.click("#nx"); await p.waitForTimeout(40); }
    const b3 = await p.evaluate(() => S.exam.B3 && S.exam.B3.score); if (b3 !== 8) errs.push("Exam B3 typed answers scored " + b3 + " (curly quote / caps / full stop tolerance)");
    await p.goto(base + "/#/tests"); await p.waitForTimeout(200); await p.click("[data-exam='D1']"); await p.waitForTimeout(300);
    const shown = await p.evaluate(() => { const q = X && X.s.items[X.i]; return q ? document.querySelector(".qcard").textContent.toLowerCase().includes(q.answerText.toLowerCase()) : false; });
    if (shown) errs.push("listen-and-spell shows the word before typing");
    await shot(p, theme + "_listen");

    // 6. Writing Clinic with flags
    await p.goto(base + "/#/writing/W1"); await p.waitForTimeout(300); await overflow("writing");
    await p.fill("#wIn", "Dear teacher, I am sorry but I cannot come to class today. I eat medicine for my headache but I have fever and a sick throat, so I think I have come down with flu. My symptoms started yesterday with a cough and a temperature of 38 degrees. I feel dizzy and I am very tired. I will stay at home until I get better.");
    await p.waitForTimeout(200);
    const flags = await p.evaluate(() => document.querySelectorAll(".flag").length), used = await p.evaluate(() => S.writing.W1.used);
    if (flags < 3) errs.push("Writing flags: only " + flags + " for three planted errors"); if (!used) errs.push("Writing: no target items detected");
    await p.click("#copyW"); await p.waitForTimeout(100); await shot(p, theme + "_writing");

    // 7. Roleplay unlock + finish
    await p.goto(base + "/#/roleplay"); await p.waitForTimeout(300);
    if (!(await p.$("#rpIn"))) errs.push("roleplay locked after reading the story");
    else {
      const lines = ["I dislocated my shoulder at the semi-final and blacked out for a second, then I went to A and E.", "They gave me an X-ray and there was no fracture, so the doctor put it back and gave me a painkiller and a sling.",
        "The physiotherapy was hard at first because my shoulder was stiff, but the treatment worked and it has healed.", "I feel the picture of health now, full of beans, though I was a bit out of shape after the weeks off.",
        "If it hurts in the final, I will stop and tell you, and I will not play unless the physio agrees.", "I wish I had stretched my shoulders at the warm-up; if I had warmed up properly, I would not have injured myself.",
        "I will keep in shape with daily exercises, get the flu vaccine, and wash my hands so I do not pass germs on."];
      for (const l of lines) { await p.fill("#rpIn", l); await p.click("#rpSend"); await p.waitForTimeout(80); }
      const rp = await p.evaluate(() => ({ done: S.rp.done, used: S.rp.used.length })); notes.push("roleplay: " + JSON.stringify(rp));
      if (!rp.done) errs.push("roleplay did not finish after 7 answers"); if (rp.used < 15) errs.push("roleplay detected only " + rp.used + " items");
      const inflect = await p.evaluate(() => ["came down with flu", "she blacked out", "he pulled through"].map(t => detect(t)));
      if (!(inflect[0].includes("comedownwith") && inflect[1].includes("blackout") && inflect[2].includes("pullthrough"))) errs.push("MATCH misses an inflection: " + JSON.stringify(inflect));
    }
    await shot(p, theme + "_roleplay"); await overflow("roleplay");

    // 8. Ward + reset isolation
    await p.goto(base + "/#/tests/ward"); await p.waitForTimeout(300); await shot(p, theme + "_ward"); await overflow("ward");
    const wardN = await p.evaluate(() => Object.keys(S.ward).length); if (!wardN) errs.push("ward empty after misses and opened cards");
    await p.click("#resetBtn"); await p.waitForTimeout(200);
    const mm = await p.evaluate(() => localStorage.getItem("moneymatters.v1")); if (!mm || !/account/.test(mm)) errs.push("reset wiped moneymatters.v1");
    const own = await p.evaluate(() => JSON.parse(localStorage.getItem("mu6vocab.v1") || "{}").learned.length); if (own) errs.push("reset did not clear mu6vocab.v1");
    await p.goto(base + "/#/patterns"); await p.waitForTimeout(300); await p.click(".pathead >> nth=0"); await p.waitForTimeout(150); await shot(p, theme + "_patterns"); await overflow("patterns");
    await p.goto(base + "/#/media"); await p.waitForTimeout(200); await overflow("media");
    await ctx.close();
  }
  function BM_view(v) { return v; }
  console.log(notes.join("\n")); console.log(errs.join("\n") || "flow: no errors"); await b.close(); process.exit(errs.length ? 1 : 0);
})();
