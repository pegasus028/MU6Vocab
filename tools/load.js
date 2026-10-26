/* Loads every data/*.js file into one sandboxed "window" so Node tools can read the content.
   load(dir) → context object with WORDS, LEXICON, STORY, … ; load.one(file) → parses one file alone (throws on a syntax error). */
const vm = require("vm"), fs = require("fs"), path = require("path");
function fresh() { const ctx = {}; ctx.window = ctx; vm.createContext(ctx); return ctx; }
function load(dir) {
  const ctx = fresh();
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith(".js")).sort())
    vm.runInContext(fs.readFileSync(path.join(dir, f), "utf8"), ctx, { filename: f });
  return ctx;
}
load.one = function (file) {
  const ctx = fresh();
  vm.runInContext(fs.readFileSync(file, "utf8"), ctx, { filename: path.basename(file) });
  return ctx;
};
module.exports = load;
