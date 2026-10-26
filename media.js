/* ============================================================
   BACK ON YOUR FEET — MEDIA FILE
   ------------------------------------------------------------
   THIS IS THE ONLY FILE YOU NEED TO EDIT TO ADD A PODCAST OR A
   VIDEO. The app already contains the nodes. While a list below
   is empty, the app shows a neat "coming soon" node in its place.
   As soon as you add an item, the node fills itself in and the
   matching chips appear in the Storybook, the Word List and the
   Patterns tab automatically. Nothing else has to change.

   ------------------------------------------------------------
   HOW TO ADD A PODCAST EPISODE
   ------------------------------------------------------------
   Paste an object into MEDIA.podcast.episodes:

     {
       id:       "ep1",                       // any unique short string
       title:    "Chapter 1: the warm-up",
       url:      "audio/ep1.mp3",             // file in the repo, OR a full https URL
       duration: "6:20",                      // optional, shown as a chip
       blurb:    "Praew explains the warm-up.",// optional, one line
       chapter:  1,                           // optional 1-5: adds a chip to that chapter
       words:    ["bankcharge", "atm"],       // optional word ids: adds a chip to those study cards
       pattern:  "liquid",                    // optional pattern id: adds a chip to that pattern card
       transcript: ""                          // optional plain text, shown in a drawer
     }

   Any audio format the browser can play works (.mp3, .m4a, .ogg).
   A Spotify, Apple Podcasts or YouTube link also works: put it in
   `url` and set `external: true`, and the node becomes a button
   that opens it in a new tab instead of an inline player.

   ------------------------------------------------------------
   HOW TO ADD A VIDEO
   ------------------------------------------------------------
   Paste an object into MEDIA.video.episodes:

     {
       id:      "v1",
       title:   "The liquid metaphor in 90 seconds",
       youtube: "dQw4w9WgXcQ",       // just the ID from the YouTube URL
       // OR
       url:     "video/v1.mp4",      // a file in the repo
       duration: "1:30",
       blurb:   "Why money splashes, drains and runs out.",
       chapter: 2,                   // optional
       words:   ["splashout","drain"],// optional
       pattern: "liquid"             // optional
     }

   For YouTube use `youtube` with the bare video ID. For a Vimeo or
   other embed, put the full embed URL in `iframe` instead.

   ------------------------------------------------------------
   ORDER: items appear in the order you list them. There is no
   limit. Leave the commented examples in place if you like; only
   real objects are read.
   ============================================================ */

window.MEDIA = {

  podcast: {
    title: "Money Matters: the podcast",
    blurb: "Short listening episodes to go with each chapter. Listen once with the transcript hidden, then again with it open.",
    comingSoon: "Podcast episodes are being recorded. This node will fill itself in as soon as the first episode is added to media.js.",
    episodes: [
      // { id: "ep1", title: "Chapter 1: the warm-up", url: "audio/ep1.mp3", duration: "6:20", chapter: 1, words: ["bankcharge","atm"], blurb: "" },
    ]
  },

  video: {
    title: "Money Matters: the videos",
    blurb: "Watch, then say the sentences out loud. Every video is under three minutes.",
    comingSoon: "Videos are in production. This node will fill itself in as soon as the first video is added to media.js.",
    episodes: [
      // { id: "v1", title: "Cheap is not the same as good value", youtube: "VIDEOID", duration: "2:10", pattern: "valuescale", blurb: "" },
    ]
  },

  /* Optional extra shelf: anything that is neither audio nor video
     (a Quizlet set, a Blooket game, a worksheet PDF, a NotebookLM deck).
     Same idea: add objects and the shelf appears. */
  extras: {
    title: "More practice",
    blurb: "Links out to games, decks and printable practice.",
    comingSoon: "Extra practice links can be added here at any time.",
    items: [
      // { id: "x1", title: "Blooket: money words 1-20", url: "https://...", kind: "game", blurb: "" },
    ]
  }
};
