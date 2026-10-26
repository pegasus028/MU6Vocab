/* ============================================================
   BACK ON YOUR FEET: body map module (Gateway B2 Unit 6)
   An original, simple, non-graphic SVG of a teenage girl in sportswear
   (vest top, shorts, ponytail, trainers), drawn in code, front and back.
   The engine (app.js bodySVG / paintFigure) draws views[view].base, then
   appends every region of that view as <path class="region" d=...>, so
   the regions are the only tappable things and sit above the figure.
   Schema (SPEC section 7 + handover):
     views.front / views.back   { viewBox, base }  base = inner SVG markup
       using the engine classes skin, hair, kit, kit2, outline; no text.
     regions[]  { id, word, layer:"outside"|"inside", side:"left"|"right"|null,
                  view:"front"|"back", path:<svg d>, label:[x,y] }
       ids: plain word for singletons in the front view (forehead, chest,
       waist, nail, lungs, ribs, liver); <word>-l / <word>-r for paired
       parts (HER left / HER right); add -b for back-view regions.
       She faces the viewer in the front view, so HER right is on the
       screen's LEFT (x < 150). In the back view her right is on the right.
     findPrompts[] { text, region }     Find it, 60-second clock
     hurtCases[]   { text, region, options[4], answer, why, tests }
   Anatomy (SPEC section 6, skill safety rules): lungs inside the rib cage;
   ribs curve from the back round to the chest (both views); liver upper
   right of the abdomen = HER right = viewer's left in the front view,
   partly under the lowest ribs; kidneys at the back either side of the
   spine, partly behind the lowest ribs (back view only); muscle on the
   upper arms (front) and the backs of the thighs (back).
   Coordinates are viewBox units (300 x 620). Every hit zone is at least
   14 units tall; the eyelid / eyelash bands are 14 each.
   ============================================================ */
window.BODY = {

  views: {

    front: {
      viewBox: "0 0 300 620",
      base:
        /* ponytail (behind the head, swinging to the viewer's right) */
        "<path class=\"hair\" d=\"M178 50 C 204 58 212 110 200 168 C 196 146 186 122 178 100 Z\"/>" +
        /* neck */
        "<rect class=\"skin\" x=\"139\" y=\"112\" width=\"22\" height=\"34\"/>" +
        /* legs: her right leg is on the viewer's left */
        "<path class=\"skin\" d=\"M112 350 H148 L145 452 L142 566 H119 L116 452 Z\"/>" +
        "<path class=\"skin\" d=\"M152 350 H188 L184 452 L181 566 H158 L155 452 Z\"/>" +
        "<path class=\"outline\" d=\"M122 452 Q131 446 140 452\"/>" +
        "<path class=\"outline\" d=\"M160 452 Q169 446 178 452\"/>" +
        /* socks and trainers */
        "<rect class=\"kit\" x=\"118\" y=\"556\" width=\"26\" height=\"12\"/>" +
        "<rect class=\"kit\" x=\"156\" y=\"556\" width=\"26\" height=\"12\"/>" +
        "<path class=\"kit\" d=\"M114 566 H146 V598 Q146 612 130 612 Q114 612 114 598 Z\"/>" +
        "<path class=\"kit\" d=\"M154 566 H186 V598 Q186 612 170 612 Q154 612 154 598 Z\"/>" +
        "<path class=\"kit2\" d=\"M114 596 Q130 604 146 596 V600 Q146 612 130 612 Q114 612 114 600 Z\"/>" +
        "<path class=\"kit2\" d=\"M154 596 Q170 604 186 596 V600 Q186 612 170 612 Q154 612 154 600 Z\"/>" +
        "<path class=\"outline\" d=\"M120 574 Q130 580 140 574 M120 584 Q130 590 140 584\"/>" +
        "<path class=\"outline\" d=\"M160 574 Q170 580 180 574 M160 584 Q170 590 180 584\"/>" +
        /* arms: her right arm is on the viewer's left */
        "<path class=\"skin\" d=\"M98 144 L120 150 L112 236 L88 232 Z\"/>" +
        "<path class=\"skin\" d=\"M88 232 L112 236 L106 314 L80 310 Z\"/>" +
        "<ellipse class=\"skin\" cx=\"92\" cy=\"326\" rx=\"13\" ry=\"18\"/>" +
        "<path class=\"skin\" d=\"M202 144 L180 150 L188 236 L212 232 Z\"/>" +
        "<path class=\"skin\" d=\"M212 232 L188 236 L194 314 L220 310 Z\"/>" +
        "<ellipse class=\"skin\" cx=\"208\" cy=\"326\" rx=\"13\" ry=\"18\"/>" +
        "<path class=\"outline\" d=\"M202 334 V342 M208 335 V344 M214 334 V342\"/>" +
        "<path class=\"outline\" d=\"M86 334 V342 M92 335 V344 M98 334 V342\"/>" +
        /* upper chest skin under the vest neckline */
        "<path class=\"skin\" d=\"M126 136 H174 V176 H126 Z\"/>" +
        /* vest top */
        "<path class=\"kit\" d=\"M98 144 C 108 138 120 136 128 138 C 134 160 142 174 150 176 C 158 174 166 160 172 138 C 180 136 192 138 202 144 L 196 204 C 188 228 184 250 183 270 L 187 292 H 113 L 117 270 C 116 250 112 228 104 204 Z\"/>" +
        "<path class=\"kit2\" d=\"M118 282 H182 L183 292 H117 Z\"/>" +
        /* shorts */
        "<path class=\"kit2\" d=\"M113 290 H187 L191 364 H154 L150 346 L146 364 H109 Z\"/>" +
        "<path class=\"outline\" d=\"M118 292 Q150 300 182 292\"/>" +
        /* head, ears, hair cap, face */
        "<ellipse class=\"skin\" cx=\"110\" cy=\"86\" rx=\"6\" ry=\"9\"/>" +
        "<ellipse class=\"skin\" cx=\"190\" cy=\"86\" rx=\"6\" ry=\"9\"/>" +
        "<ellipse class=\"skin\" cx=\"150\" cy=\"80\" rx=\"38\" ry=\"48\"/>" +
        "<path class=\"hair\" d=\"M112 82 C 110 42 128 30 150 30 C 172 30 190 42 188 82 C 186 62 178 52 164 50 C 158 54 150 56 142 54 C 130 52 118 60 112 82 Z\"/>" +
        /* eyebrows (her right eyebrow is on the viewer's left) */
        "<path class=\"outline\" d=\"M125 67 Q137 59 149 66\"/>" +
        "<path class=\"outline\" d=\"M151 66 Q163 59 175 67\"/>" +
        /* eyelid creases */
        "<path class=\"outline\" d=\"M129 80 Q138 74 147 80\"/>" +
        "<path class=\"outline\" d=\"M153 80 Q162 74 171 80\"/>" +
        /* eyes */
        "<path class=\"kit\" d=\"M128 92 Q138 84 148 92 Q138 100 128 92 Z\"/>" +
        "<path class=\"kit\" d=\"M152 92 Q162 84 172 92 Q162 100 152 92 Z\"/>" +
        "<circle class=\"hair\" cx=\"138\" cy=\"92\" r=\"4\"/>" +
        "<circle class=\"hair\" cx=\"162\" cy=\"92\" r=\"4\"/>" +
        /* eyelashes on the edge of each upper lid */
        "<path class=\"outline\" d=\"M131 88 L127 83 M138 86 L138 80 M145 88 L149 83\"/>" +
        "<path class=\"outline\" d=\"M155 88 L151 83 M162 86 L162 80 M169 88 L173 83\"/>" +
        /* nose and mouth */
        "<path class=\"outline\" d=\"M150 96 Q146 106 152 110\"/>" +
        "<path class=\"outline\" d=\"M140 116 Q150 124 160 116\"/>"
    },

    back: {
      viewBox: "0 0 300 620",
      base:
        /* neck */
        "<rect class=\"skin\" x=\"139\" y=\"112\" width=\"22\" height=\"34\"/>" +
        /* legs: seen from behind, her left leg is on the viewer's left */
        "<path class=\"skin\" d=\"M112 350 H148 L145 452 L142 566 H119 L116 452 Z\"/>" +
        "<path class=\"skin\" d=\"M152 350 H188 L184 452 L181 566 H158 L155 452 Z\"/>" +
        "<path class=\"outline\" d=\"M122 456 Q131 462 140 456\"/>" +
        "<path class=\"outline\" d=\"M160 456 Q169 462 178 456\"/>" +
        "<path class=\"outline\" d=\"M124 500 Q131 520 138 500\"/>" +
        "<path class=\"outline\" d=\"M162 500 Q169 520 176 500\"/>" +
        /* socks and trainers from behind: the heel counter is the rounded top */
        "<rect class=\"kit\" x=\"118\" y=\"556\" width=\"26\" height=\"12\"/>" +
        "<rect class=\"kit\" x=\"156\" y=\"556\" width=\"26\" height=\"12\"/>" +
        "<path class=\"kit\" d=\"M116 572 Q130 562 144 572 V600 Q144 612 130 612 Q116 612 116 600 Z\"/>" +
        "<path class=\"kit\" d=\"M156 572 Q170 562 184 572 V600 Q184 612 170 612 Q156 612 156 600 Z\"/>" +
        "<path class=\"kit2\" d=\"M116 598 H144 V600 Q144 612 130 612 Q116 612 116 600 Z\"/>" +
        "<path class=\"kit2\" d=\"M156 598 H184 V600 Q184 612 170 612 Q156 612 156 600 Z\"/>" +
        "<path class=\"outline\" d=\"M130 574 V596 M170 574 V596\"/>" +
        /* arms */
        "<path class=\"skin\" d=\"M98 144 L120 150 L112 236 L88 232 Z\"/>" +
        "<path class=\"skin\" d=\"M88 232 L112 236 L106 314 L80 310 Z\"/>" +
        "<ellipse class=\"skin\" cx=\"92\" cy=\"326\" rx=\"13\" ry=\"18\"/>" +
        "<path class=\"skin\" d=\"M202 144 L180 150 L188 236 L212 232 Z\"/>" +
        "<path class=\"skin\" d=\"M212 232 L188 236 L194 314 L220 310 Z\"/>" +
        "<ellipse class=\"skin\" cx=\"208\" cy=\"326\" rx=\"13\" ry=\"18\"/>" +
        "<path class=\"outline\" d=\"M96 236 Q100 240 106 236 M194 236 Q200 240 204 236\"/>" +
        /* vest back (higher neckline) */
        "<path class=\"kit\" d=\"M98 144 C 116 136 184 136 202 144 L 196 204 C 188 228 184 250 183 270 L 187 292 H 113 L 117 270 C 116 250 112 228 104 204 Z\"/>" +
        "<path class=\"kit2\" d=\"M118 282 H182 L183 292 H117 Z\"/>" +
        "<path class=\"outline\" d=\"M150 150 V 282\"/>" +
        /* shorts */
        "<path class=\"kit2\" d=\"M113 290 H187 L191 364 H154 L150 346 L146 364 H109 Z\"/>" +
        /* head from behind: ears, skin, full hair cap, ponytail hanging down the back */
        "<ellipse class=\"skin\" cx=\"110\" cy=\"86\" rx=\"6\" ry=\"9\"/>" +
        "<ellipse class=\"skin\" cx=\"190\" cy=\"86\" rx=\"6\" ry=\"9\"/>" +
        "<ellipse class=\"skin\" cx=\"150\" cy=\"80\" rx=\"38\" ry=\"48\"/>" +
        "<path class=\"hair\" d=\"M112 86 C 110 42 128 30 150 30 C 172 30 190 42 188 86 C 186 108 170 120 150 120 C 130 120 114 108 112 86 Z\"/>" +
        "<path class=\"hair\" d=\"M140 96 C 134 130 136 160 150 192 C 164 160 166 130 160 96 Z\"/>" +
        "<path class=\"outline\" d=\"M142 100 Q150 106 158 100\"/>"
    }
  },

  /* ---------- regions: outside first, then inside (inside shapes sit on top) ---------- */
  regions: [

    /* FRONT, outside */
    { id: "forehead", word: "forehead", layer: "outside", side: null, view: "front",
      path: "M120 60 C 118 48 132 40 150 40 C 168 40 182 48 180 60 Z", label: [150, 24] },
    { id: "eyebrow-r", word: "eyebrow", layer: "outside", side: "right", view: "front",
      path: "M122 58 H150 V72 H122 Z", label: [92, 66] },
    { id: "eyebrow-l", word: "eyebrow", layer: "outside", side: "left", view: "front",
      path: "M150 58 H178 V72 H150 Z", label: [208, 66] },
    { id: "eyelid-r", word: "eyelid", layer: "outside", side: "right", view: "front",
      path: "M124 72 H150 V86 H124 Z", label: [92, 82] },
    { id: "eyelid-l", word: "eyelid", layer: "outside", side: "left", view: "front",
      path: "M150 72 H176 V86 H150 Z", label: [208, 82] },
    { id: "eyelash-r", word: "eyelash", layer: "outside", side: "right", view: "front",
      path: "M124 86 H150 V100 H124 Z", label: [92, 98] },
    { id: "eyelash-l", word: "eyelash", layer: "outside", side: "left", view: "front",
      path: "M150 86 H176 V100 H150 Z", label: [208, 98] },
    { id: "chest", word: "chest", layer: "outside", side: null, view: "front",
      path: "M114 134 C 128 128 172 128 186 134 L 186 236 C 170 242 130 242 114 236 Z", label: [150, 196] },
    { id: "waist", word: "waist", layer: "outside", side: null, view: "front",
      path: "M117 258 H183 L185 284 H115 Z", label: [150, 276] },
    { id: "hip-r", word: "hip", layer: "outside", side: "right", view: "front",
      path: "M104 284 C 108 302 108 322 112 340 L 140 340 L 138 284 Z", label: [96, 302] },
    { id: "hip-l", word: "hip", layer: "outside", side: "left", view: "front",
      path: "M196 284 C 192 302 192 322 188 340 L 160 340 L 162 284 Z", label: [204, 302] },
    { id: "nail", word: "nail", layer: "outside", side: null, view: "front",
      path: "M197 332 H221 V348 H197 Z", label: [238, 356] },
    { id: "thigh-r", word: "thigh", layer: "outside", side: "right", view: "front",
      path: "M114 366 H146 L144 448 H116 Z", label: [130, 412] },
    { id: "thigh-l", word: "thigh", layer: "outside", side: "left", view: "front",
      path: "M154 366 H186 L184 448 H156 Z", label: [170, 412] },
    { id: "ankle-r", word: "ankle", layer: "outside", side: "right", view: "front",
      path: "M116 556 H144 V584 H116 Z", label: [100, 574] },
    { id: "ankle-l", word: "ankle", layer: "outside", side: "left", view: "front",
      path: "M156 556 H184 V584 H156 Z", label: [200, 574] },

    /* FRONT, inside */
    /* ribs: a thick U (side rims and the lower arch, open at the top) so the lungs inside it and the upper chest stay separate tap zones */
    { id: "ribs", word: "ribs", layer: "inside", side: null, view: "front",
      path: "M124 160 L 124 214 C 124 244 134 256 150 256 C 166 256 176 244 176 214 L 176 160 L 168 160 L 168 212 C 168 232 160 241 150 241 C 140 241 132 232 132 212 L 132 160 Z", label: [150, 250] },
    { id: "lungs", word: "lungs", layer: "inside", side: null, view: "front",
      path: "M147 176 C 147 170 138 170 135 178 C 132 190 132 208 135 224 C 138 232 146 232 147 224 Z M153 176 C 153 170 162 170 165 178 C 168 190 168 208 165 224 C 162 232 154 232 153 224 Z", label: [150, 204] },
    /* liver: upper right of the abdomen = HER right = viewer's left, partly under the lowest ribs */
    { id: "liver", word: "liver", layer: "inside", side: null, view: "front",
      path: "M116 236 C 124 230 146 232 158 236 L 156 250 C 146 262 126 264 116 256 Z", label: [118, 280] },
    { id: "muscle-r", word: "muscle", layer: "inside", side: "right", view: "front",
      path: "M98 152 C 104 146 116 148 118 156 L 112 226 C 110 234 92 232 90 226 Z", label: [76, 194] },
    { id: "muscle-l", word: "muscle", layer: "inside", side: "left", view: "front",
      path: "M202 152 C 196 146 184 148 182 156 L 188 226 C 190 234 208 232 210 226 Z", label: [224, 194] },

    /* BACK, outside (her left is on the viewer's left) */
    { id: "waist-b", word: "waist", layer: "outside", side: null, view: "back",
      path: "M117 254 H183 L185 282 H115 Z", label: [150, 272] },
    { id: "hip-l-b", word: "hip", layer: "outside", side: "left", view: "back",
      path: "M104 284 C 108 302 108 322 112 340 L 140 340 L 138 284 Z", label: [96, 302] },
    { id: "hip-r-b", word: "hip", layer: "outside", side: "right", view: "back",
      path: "M196 284 C 192 302 192 322 188 340 L 160 340 L 162 284 Z", label: [204, 302] },
    { id: "thigh-l-b", word: "thigh", layer: "outside", side: "left", view: "back",
      path: "M114 366 H146 L144 448 H116 Z", label: [130, 412] },
    { id: "thigh-r-b", word: "thigh", layer: "outside", side: "right", view: "back",
      path: "M154 366 H186 L184 448 H156 Z", label: [170, 412] },
    { id: "ankle-l-b", word: "ankle", layer: "outside", side: "left", view: "back",
      path: "M116 552 H144 V578 H116 Z", label: [100, 568] },
    { id: "ankle-r-b", word: "ankle", layer: "outside", side: "right", view: "back",
      path: "M156 552 H184 V578 H156 Z", label: [200, 568] },
    { id: "heel-l-b", word: "heel", layer: "outside", side: "left", view: "back",
      path: "M116 580 H144 V606 H116 Z", label: [100, 598] },
    { id: "heel-r-b", word: "heel", layer: "outside", side: "right", view: "back",
      path: "M156 580 H184 V606 H156 Z", label: [200, 598] },

    /* BACK, inside */
    { id: "ribs-b", word: "ribs", layer: "inside", side: null, view: "back",
      path: "M118 156 C 118 146 182 146 182 156 L 184 214 C 182 244 168 256 150 256 C 132 256 118 244 116 214 Z", label: [150, 164] },
    { id: "kidney-l-b", word: "kidney", layer: "inside", side: "left", view: "back",
      path: "M128 236 C 122 244 122 268 130 276 C 138 282 148 276 146 266 C 144 258 148 248 142 240 C 138 234 132 232 128 236 Z", label: [104, 262] },
    { id: "kidney-r-b", word: "kidney", layer: "inside", side: "right", view: "back",
      path: "M172 236 C 178 244 178 268 170 276 C 162 282 152 276 154 266 C 156 258 152 248 158 240 C 162 234 168 232 172 236 Z", label: [196, 262] },
    { id: "muscle-l-b", word: "muscle", layer: "inside", side: "left", view: "back",
      path: "M120 372 C 120 364 140 364 140 372 L 138 440 C 136 448 122 448 120 440 Z", label: [130, 412] },
    { id: "muscle-r-b", word: "muscle", layer: "inside", side: "right", view: "back",
      path: "M180 372 C 180 364 160 364 160 372 L 162 440 C 164 448 178 448 180 440 Z", label: [170, 412] }
  ],

  /* ---------- Find it: left and right mean HER left and right ---------- */
  findPrompts: [
    { text: "Tap her forehead.", region: "forehead" },
    { text: "Tap the eyebrow above her right eye.", region: "eyebrow-r" },
    { text: "Tap her left eyebrow.", region: "eyebrow-l" },
    { text: "Tap the eyelid on her right eye.", region: "eyelid-r" },
    { text: "Tap her left eyelid.", region: "eyelid-l" },
    { text: "Tap the eyelashes on her right eye.", region: "eyelash-r" },
    { text: "Tap the eyelashes on her left eye.", region: "eyelash-l" },
    { text: "Tap her fingernails.", region: "nail" },
    { text: "Tap her chest.", region: "chest" },
    { text: "Tap her waist.", region: "waist" },
    { text: "Tap her left hip.", region: "hip-l" },
    { text: "Tap her right hip.", region: "hip-r" },
    { text: "Tap her right thigh.", region: "thigh-r" },
    { text: "Tap her left thigh (front or back).", region: "thigh-l" },
    { text: "Tap her left ankle.", region: "ankle-l" },
    { text: "Tap her right ankle.", region: "ankle-r" },
    { text: "Tap her right heel (turn her round).", region: "heel-r-b" },
    { text: "Tap her left heel (turn her round).", region: "heel-l-b" },
    { text: "Tap her lungs.", region: "lungs" },
    { text: "Tap her ribs.", region: "ribs" },
    { text: "Tap her liver.", region: "liver" },
    { text: "Tap the kidneys (turn her round).", region: "kidney-l-b" },
    { text: "Tap the muscle in her right upper arm.", region: "muscle-r" },
    { text: "Tap the muscle at the back of her left thigh (turn her round).", region: "muscle-l-b" }
  ],

  /* ---------- Where does it hurt?  Step 1 tap the place, step 2 pick the word that names the problem.
     Key positions planned as a balanced sequence: 1,2,0,3,1,0,2,3,0,1,3,2 (three each, never three running). ---------- */
  hurtCases: [
    { text: "I turned my foot over on the stairs at the BTS station. The joint swelled up at once, I can't put any weight on it, and the X-ray shows a thin crack in the bone.",
      region: "ankle-l", options: ["stiffness", "fracture", "infection", "exhaustion"], answer: 1,
      why: "A crack in a bone on an X-ray is a fracture. Stiffness and exhaustion are feelings, not a crack, and nothing here has been infected by germs.",
      tests: "fracture" },

    { text: "I fell sideways off my bike by Benjakitti Park and landed on my right side. The top of my leg looks the wrong shape and I can't move it, but the doctor says nothing is broken: the bone has come out of the joint.",
      region: "hip-r", options: ["fracture", "treat", "dislocate", "heal"], answer: 2,
      why: "A bone that comes out of its joint is dislocated. To fracture is to crack or break it, and treat and heal describe what happens afterwards.",
      tests: "dislocate" },

    { text: "I walked straight into the glass door at the mall and hit the front of my head. There's a bump above my eyebrows and my head has been throbbing ever since.",
      region: "forehead", options: ["headache", "fever", "cough", "dizziness"], answer: 0,
      why: "A throbbing head is a headache. Nobody mentions feeling hot, coughing, or the room spinning, so fever, cough and dizziness do not fit.",
      tests: "headache" },

    { text: "The PM2.5 is terrible this week. For three days my lungs have been fighting the dust: I keep barking like a seal, and it is worse at night when I lie down.",
      region: "lungs", options: ["sneeze", "headache", "dizziness", "cough"], answer: 3,
      why: "A barking noise from the lungs, worse at night, is a cough. A sneeze comes from the nose, and a headache or dizziness is felt in the head.",
      tests: "cough" },

    { text: "A teammate's elbow caught me in the side during a crowded warm-up. It hurts to laugh or take a deep breath, and the X-ray shows that one of the curved bones has snapped.",
      region: "ribs", options: ["sore", "broken", "stiff", "dizzy"], answer: 1,
      why: "A bone that has snapped is broken. Sore and stiff describe muscles that hurt or will not move freely, and dizzy is a feeling in the head.",
      tests: "broken" },

    { text: "I did two hundred squats at Coach's training on Saturday. Now the big muscles above my knees are tight and hard to bend, and it takes me a minute to straighten up when I stand.",
      region: "thigh-l", options: ["stiff", "broken", "infectious", "sick"], answer: 0,
      why: "Muscles that are tight and hard to move after exercise are stiff. Nothing is broken, nothing can be passed on, and sick means unwell or vomiting.",
      tests: "stiff" },

    { text: "I caught my finger in the taxi door. The nail has gone dark and it throbs underneath, but the doctor says the bone is fine and it will grow out.",
      region: "nail", options: ["infection", "fracture", "injury", "symptom"], answer: 2,
      why: "Harm to a part of the body in an accident is an injury. The bone is fine, so it is not a fracture; no germs are involved; a symptom is a sign of illness.",
      tests: "injury" },

    { text: "I ate some suspect grilled pork at the night market. Now my stomach is churning, I have no appetite, and I feel as if I am going to throw up.",
      region: "waist", options: ["sore", "dizzy", "stiff", "sick"], answer: 3,
      why: "In British English, feeling that you are going to vomit is feeling sick. Sore and stiff describe parts that hurt or will not move, and dizzy is spinning.",
      tests: "sick" },

    { text: "I had a temperature all weekend and now there's a pain in my back on the left side, just under my lowest ribs. The doctor says germs have got into the organ that cleans my blood.",
      region: "kidney-l-b", options: ["infection", "fracture", "injury", "stiffness"], answer: 0,
      why: "Germs getting into an organ cause an infection. A fracture or an injury comes from an accident, and stiffness is a muscle or joint feeling.",
      tests: "infection" },

    { text: "My new trainers rubbed the back of my foot raw at sports day. There's a blister there now and it stings every time I take a step.",
      region: "heel-r-b", options: ["stiff", "sore", "dizzy", "broken"], answer: 1,
      why: "Skin that hurts because it has been rubbed too much is sore. Nothing is broken or stiff, and dizzy is a feeling in the head, not the foot.",
      tests: "sore" },

    { text: "A mosquito bit the skin over my right eye at Yai's house. It has swollen up, it hurts, and I can hardly open the eye this morning.",
      region: "eyelid-r", options: ["stiff", "dizzy", "infectious", "painful"], answer: 3,
      why: "A swollen part that hurts is painful. Stiff is for joints and muscles, dizzy is the head spinning, and infectious means an illness that can spread.",
      tests: "painful" },

    { text: "I've been coughing for a week with this cold. Now there is a dull, tired pain right across the front of my body under my vest that never quite goes away.",
      region: "chest", options: ["fever", "sneeze", "ache", "headache"], answer: 2,
      why: "A dull pain that goes on and on is an ache. A headache is an ache in the head, not the chest; fever is heat and a sneeze comes from the nose.",
      tests: "ache" }
  ]
};
