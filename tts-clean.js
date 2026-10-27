/* Back on Your Feet — speech text cleaner, shared by the app (browser) and tools/tts-list.js (Node).
   speechText(raw) turns on-screen text into what is read aloud: story markup and *bold* stripped, symbols
   spoken as words, emoji and IPA removed. Thai script stays: tools/make-audio.py records Thai runs in a Thai
   voice (Premwadee) and joins them to Sonia's English in one clip. The recording key is ttsKey(speechText(raw)),
   so the app and the recorder must use this one function. Change it, then re-run tools/make-audio.py --prune. */
(function (root) {
  function speechText(raw) {
    let s = String(raw == null ? "" : raw);
    s = s.replace(/\{\{[a-z]+\|([^}]*)\}\}/g, "$1")                         // story keyword markup
      .replace(/\*([^*]+)\*/g, "$1").replace(/\*/g, "")                       // *bold*
      .replace(/\/[^\/\s][^\/]{0,24}\//g, "")                                  // IPA like /eɪk/
      .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu, "") // emoji, ✓ ✗ ★
      .replace(/\bpp\.\s?(\d+)\s?[–-]\s?(\d+)/g, "pages $1 to $2").replace(/\bp\.\s?(\d+)/g, "page $1")
      .replace(/\b1669\b/g, "1 6 6 9")
      .replace(/°C/g, " degrees")
      .replace(/([฀-๿])\s*→\s*/g, "$1: ")                       // Thai → English reads "Thai: English"
      .replace(/\s*→\s*/g, ", then ").replace(/\s*[·•]\s*/g, ", ")
      .replace(/\s+\/\s+/g, " or ").replace(/\s*&\s*/g, " and ")
      .replace(/_{2,}/g, " blank ").replace(/\s*=\s*/g, " means ").replace(/\s*\+\s*/g, " plus ")
      .replace(/\s*[—–]\s*/g, ", ").replace(/…|\.\.\./g, "")
      .replace(/\(\s*\)/g, "").replace(/\s+/g, " ")
      .replace(/\s+([,.;:!?])/g, "$1").replace(/([,;:])(?:\s*[,;:])+/g, "$1").replace(/^[\s,;:]+/, "").trim();
    return s;
  }
  root.speechText = speechText;
  if (typeof module !== "undefined" && module.exports) module.exports = speechText;
})(typeof window !== "undefined" ? window : globalThis);
