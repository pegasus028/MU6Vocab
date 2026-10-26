// Smoke test: opens every tab at desktop and phone width, light and dark, screenshots, and collects page errors.
// Usage: node tools/smoke.js [base=http://127.0.0.1:8077]   (start `python3 -m http.server 8077` in the app folder first)
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
(async () => {
  const base = process.argv[2] || "http://127.0.0.1:8077";
  const out = path.join(__dirname, "..", "..", "shots"); fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--autoplay-policy=no-user-gesture-required"] }).catch(() => chromium.launch());
  const errs = [];
  const tabs = ["home", "story", "body", "words", "patterns", "tests", "writing", "roleplay", "media"];
  for (const [vp, tag] of [[{ width: 1280, height: 900 }, "d"], [{ width: 390, height: 844 }, "m"]]) {
    for (const theme of ["light", "dark"]) {
      const ctx = await b.newContext({ viewport: vp, isMobile: tag === "m", colorScheme: theme });
      const p = await ctx.newPage();
      p.on("pageerror", e => errs.push("PAGEERR " + tag + "/" + theme + " " + e.message));
      p.on("console", m => { if (m.type() === "error" && !/favicon|net::ERR|404/.test(m.text())) errs.push("CONSOLE " + tag + "/" + theme + " " + m.text()); });
      for (const h of tabs) {
        await p.goto(base + "/#/" + h); await p.waitForTimeout(350);
        await p.screenshot({ path: path.join(out, tag + "_" + theme + "_" + h + ".png"), fullPage: false });
        const ov = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
        if (ov) errs.push("H-OVERFLOW " + tag + "/" + theme + " on " + h);
      }
      await ctx.close();
    }
  }
  console.log(errs.join("\n") || "smoke: no errors"); await b.close(); process.exit(errs.length ? 1 : 0);
})();
