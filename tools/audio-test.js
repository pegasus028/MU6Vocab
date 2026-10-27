// Read-aloud test (Playwright). Checks that every spoken text has a recorded clip on disk and in data/tts.js,
// that the buttons play MP3s (not the browser voice), and that pause / resume / stop / skip / "Turn the pages
// for me" work. Usage: node tools/audio-test.js [base=http://127.0.0.1:8077]  (serve the app folder first:
// python3 -m http.server 8077). Screenshots go to ../shots/.
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "..");
const { list } = require("./tts-list.js");
(async () => {
  const base = process.argv[2] || "http://127.0.0.1:8077";
  const out = path.join(ROOT, "..", "shots"); fs.mkdirSync(out, { recursive: true });
  const errs = [], ok = m => console.log("  ok  " + m);
  const fail = m => { errs.push(m); console.log("  FAIL " + m); };

  // 1. files and manifest (Node side)
  const man = {}; fs.readFileSync(path.join(ROOT, "data", "tts.js"), "utf8").match(/keys: (\[.*\])/)[1] && JSON.parse(fs.readFileSync(path.join(ROOT, "data", "tts.js"), "utf8").match(/keys: (\[.*\])/)[1]).forEach(k => man[k] = 1);
  const noFile = list.filter(x => !fs.existsSync(path.join(ROOT, "audio", "tts", x.key + ".mp3"))), noMan = list.filter(x => !man[x.key]);
  noFile.length ? fail(noFile.length + " spoken texts have no MP3: " + noFile.slice(0, 5).map(x => x.ref).join(", ")) : ok(list.length + " spoken texts all have an MP3");
  noMan.length ? fail(noMan.length + " clips missing from data/tts.js") : ok("manifest lists every clip");

  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] }).catch(() => chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] }));
  for (const theme of ["light", "dark"]) {
    console.log("— " + theme);
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, colorScheme: theme });
    const p = await ctx.newPage();
    p.on("pageerror", e => fail("PAGEERR " + e.message));
    p.on("console", m => { if (m.type() === "error" && !/favicon|404|fonts/.test(m.text())) fail("CONSOLE " + m.text()); });
    p.on("dialog", d => d.accept());
    await p.addInitScript(() => {
      window.__plays = []; window.__synth = [];
      const op = HTMLMediaElement.prototype.play;
      HTMLMediaElement.prototype.play = function () { window.__plays.push(this.src); return op.call(this); };
      if (window.speechSynthesis) { const os = speechSynthesis.speak.bind(speechSynthesis); speechSynthesis.speak = u => { window.__synth.push(u.text); return os(u); }; }
    });
    const ev = (f, a) => p.evaluate(f, a);
    const st = () => ev(() => ({ state: RD.state, owner: RD.owner, i: RD.i, n: RD.parts.length, paused: RD.el ? RD.el.paused : null, bar: !document.getElementById("reader").hidden, reading: document.querySelectorAll(".reading").length, src: RD.el ? RD.el.src.split("/").pop() : "" }));
    const end = () => ev(() => RD.el && RD.el.dispatchEvent(new Event("ended")));
    const overflow = async n => { if (await ev(() => document.documentElement.scrollWidth > innerWidth + 1)) fail("horizontal overflow on " + n); };
    const keysOnScreen = sel => ev(s => [...document.querySelectorAll(s + " [data-say]")].map(b => ({ t: b.dataset.say.slice(0, 50), k: ttsKey(sayText(b.dataset.say)), have: hasClip(b.dataset.say) })), sel);
    const checkKeys = async (sel, name) => { const ks = await keysOnScreen(sel); const miss = ks.filter(x => !x.have); if (!ks.length) fail(name + ": no 🔊 buttons"); else if (miss.length) fail(name + ": " + miss.length + " 🔊 without a clip, e.g. " + miss[0].t); else ok(name + ": " + ks.length + " 🔊 buttons, all recorded"); };

    await p.goto(base + "/#/home"); await p.evaluate(() => localStorage.removeItem("mu6vocab.v1")); await p.goto(base + "/#/story/1/1"); await p.reload(); await p.waitForTimeout(400);

    // 2. Story: play, pause, resume, skip, stop, auto-turn
    await p.click("#listenPage"); await p.waitForTimeout(250);
    let s = await st();
    (s.state === "playing" && s.n >= 2 && s.bar && s.reading === 1 && /\.mp3$/.test(s.src)) ? ok("story page plays as " + s.n + " paragraphs, first one highlighted, bar shown") : fail("story start " + JSON.stringify(s));
    await p.screenshot({ path: path.join(out, "a_" + theme + "_story_playing.png") });
    await p.click("#listenPage"); await p.waitForTimeout(150); s = await st();
    (s.state === "paused" && s.paused === true) ? ok("page button pauses") : fail("pause " + JSON.stringify(s));
    const lbl = await p.textContent("#listenPage"); /Resume/.test(lbl) ? ok("button now reads '" + lbl.trim() + "'") : fail("button label while paused: " + lbl);
    await p.screenshot({ path: path.join(out, "a_" + theme + "_story_paused.png") });
    await p.click("#rdToggle"); await p.waitForTimeout(150); s = await st();
    (s.state === "playing" && s.paused === false && s.i === 0) ? ok("bar resumes from the same paragraph") : fail("resume " + JSON.stringify(s));
    await p.click("#rdNext"); await p.waitForTimeout(150); s = await st();
    (s.i === 1 && s.state === "playing") ? ok("⏭ moves to paragraph 2") : fail("skip " + JSON.stringify(s));
    await p.click("#rdStop"); await p.waitForTimeout(100); s = await st();
    (s.state === "idle" && !s.bar && s.reading === 0) ? ok("■ stops and hides the bar") : fail("stop " + JSON.stringify(s));
    await p.check("#autoRead"); await p.click("#listenPage"); await p.waitForTimeout(150);
    const n1 = (await st()).n; for (let i = 0; i < n1; i++) { await end(); await p.waitForTimeout(120); }
    await p.waitForTimeout(250); s = await st();
    const pg = await ev(() => S.pg);
    (pg === 1 && s.state === "playing" && /^story:0\.1$/.test(s.owner)) ? ok("'Turn the pages for me' turns to page 2 and keeps reading") : fail("auto-turn pg=" + pg + " " + JSON.stringify(s));
    await p.uncheck("#autoRead"); await checkKeys("#v-story", "story");
    // every story paragraph recorded
    const storyMiss = await ev(() => { const m = []; STORY.chapters.forEach((c, ci) => c.pages.forEach((pg, pi) => storyParas(pg.text).forEach((t, k) => { if (!hasClip(t)) m.push(ci + 1 + "." + (pi + 1) + "p" + (k + 1)); }))); return m; });
    storyMiss.length ? fail("story paragraphs without clips: " + storyMiss.join(", ")) : ok("every story paragraph has a clip");
    await overflow("story");

    // 3. Patterns: card read as parts, highlight follows, route change stops
    await p.goto(base + "/#/patterns"); await p.waitForTimeout(300);
    await p.click(".pat[data-id='updown'] .pathead"); await p.waitForTimeout(200);
    await p.click(".pat[data-id='updown'] .patbody [data-rd]"); await p.waitForTimeout(200); s = await st();
    const hl = await ev(() => { const r = document.querySelector(".reading"); return r ? r.tagName + "." + r.className : ""; });
    (s.state === "playing" && s.n >= 4 && /H3/.test(hl)) ? ok("pattern card plays " + s.n + " parts, title highlighted first") : fail("pattern " + JSON.stringify(s) + " " + hl);
    await end(); await p.waitForTimeout(150);
    const hl2 = await ev(() => (document.querySelector(".reading") || {}).className || ""); /insight/.test(hl2) ? ok("highlight moves to the insight") : fail("highlight after part 1: " + hl2);
    await p.screenshot({ path: path.join(out, "a_" + theme + "_pattern.png") });
    const allPatMiss = await ev(() => { const m = []; PATS.forEach(p => [p.title, p.insight, "Try it now. " + p.drill].concat(p.examples || []).concat(p.game && p.game.reveal ? [p.game.reveal] : []).forEach(t => { if (!hasClip(t)) m.push(p.id + ": " + t.slice(0, 30)); })); return m; });
    allPatMiss.length ? fail("pattern parts without clips: " + allPatMiss.slice(0, 4).join(" | ")) : ok("all 16 pattern cards fully recorded");
    await p.click(".pat[data-id='thai'] .pathead"); await p.waitForTimeout(150);
    await p.click(".pat[data-id='thai'] .patbody [data-rd]"); await p.waitForTimeout(200); s = await st();
    s.owner === "pat:thai" ? ok("starting another card takes over the player") : fail("takeover " + JSON.stringify(s));
    await overflow("patterns");
    await p.goto(base + "/#/home"); await p.waitForTimeout(200); s = await st();
    s.state === "idle" ? ok("changing tab stops reading") : fail("tab change " + JSON.stringify(s));

    // 4. Other reading areas: their 🔊 keys are recorded and a tap plays an MP3
    await p.goto(base + "/#/writing/W1"); await p.waitForTimeout(250); await p.click("#showModel"); await p.waitForTimeout(100); await checkKeys("#v-writing", "Writing Clinic brief + model");
    await p.evaluate(() => { S.read = ["0.0", "4.0", "4.1"]; save(); }); await p.goto(base + "/#/roleplay"); await p.waitForTimeout(250); await checkKeys("#v-roleplay", "Roleplay");
    await p.goto(base + "/#/body/hurt"); await p.waitForTimeout(250); await checkKeys("#bodypanel", "Where does it hurt?");
    await p.goto(base + "/#/body/find"); await p.waitForTimeout(250); await checkKeys("#bodypanel", "Find it");
    await p.goto(base + "/#/tests/clinic"); await p.waitForTimeout(250); await checkKeys("#v-tests", "Clinic Shift");
    const before = (await ev(() => window.__plays.length));
    await p.click("#v-tests .qprompt [data-say]"); await p.waitForTimeout(250); s = await st();
    ((await ev(() => window.__plays.length)) > before && s.state === "playing") ? ok("Clinic Shift 🔊 plays an MP3") : fail("clinic play " + JSON.stringify(s));
    await p.click("#v-tests .qprompt [data-say]"); await p.waitForTimeout(100); s = await st();
    s.state === "paused" ? ok("tapping the same 🔊 again pauses") : fail("small-button pause " + JSON.stringify(s));
    await p.screenshot({ path: path.join(out, "a_" + theme + "_clinic.png") });
    await p.goto(base + "/#/home"); await p.waitForTimeout(150);
    const synthN = (await ev(() => window.__synth.length)); synthN ? fail("browser voice used " + synthN + " times for recorded text: " + (await ev(() => window.__synth[0]))) : ok("no browser-voice fallback for any recorded text");
    await ev(() => readAloud(["This sentence was never recorded, zebra."])); await p.waitForTimeout(150);
    (await ev(() => window.__synth.length)) === 1 ? ok("an unrecorded sentence falls back to the browser voice") : fail("fallback did not reach speechSynthesis");
    await ev(() => stopSpeech());
    await ctx.close();
  }
  await b.close();
  console.log(errs.length ? "\n" + errs.length + " problem(s)" : "\nAll read-aloud checks passed.");
  process.exit(errs.length ? 1 : 0);
})();
