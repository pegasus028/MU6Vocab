/* ============================================================
   BACK ON YOUR FEET: body map module (Gateway B2 Unit 6)
   Praew, the story's heroine, drawn in code (no image generator, no stock art):
   a picture-book Thai girl of 13-14 with a long black plait and a red ribbon,
   a plain white sports T-shirt, knee-length navy sports shorts and white
   trainers. The engine (app.js bodySVG / paintFigure) draws views[view].base
   and then every region of that view and layer as <path class="region" d=...>,
   so the regions are the only tappable things and sit above the art.

   Each base holds BOTH layers: <g class="bm-out"> (Outside: the dressed figure,
   the zoom insets and their rings) and <g class="bm-in"> (Inside: a
   semi-transparent silhouette with the organs). The engine puts bm-outside or
   bm-inside on the <svg> and app.css hides the other group. <g class="bm-leads">
   holds the label leader lines; they only show while names are shown (Explore).
   Ids that start "bmf-" (filters, clip paths) are made unique per drawing by
   bodySVG, so two figures on one page never clash.

   Colours are classes styled in app.css (BODY MAP section), with light and
   dark values, so the figure works on both themes.

   Schema (SPEC section 7 + handover):
     views.front / views.back   { viewBox, base }  base = inner SVG markup, no text.
     regions[]  { id, word, layer:"outside"|"inside", side:"left"|"right"|null,
                  view:"front"|"back", path:<svg d>, label:[x,y] }
       ids: plain word for singletons in the front view (forehead, chest,
       waist, nail, lungs, ribs, liver); <word>-l / <word>-r for paired
       parts (HER left / HER right); add -b for back-view regions.
       She faces the viewer in the front view, so HER right is on the
       screen's LEFT (x < 240). In the back view her right is on the right.
     findPrompts[] { text, region }     Find it, 60-second clock
     hurtCases[]   { text, region, pic, options[4], answer, why, tests }
       pic = a small scene picture (art/bodymap/hurt-*.svg) shown above the
       patient's words; it shows the situation, never the answer.

   Small parts live in zoom insets, joined to the figure by a dashed ring:
     front Outside: eyes inset (top left; her right eye on the left, both
       eyebrow / eyelid / eyelash rows, names in the left column) and hand
       inset (her right hand, back of the hand towards you, nails at the tips);
     back Outside: feet inset (from behind; ankle and heel rows).
   Inside, front: lungs either side of the heart inside the rib cage; liver
   upper right of the abdomen (HER right = viewer's left) under the lowest
   ribs; biceps muscles on both upper arms. Inside, back: ribs and spine;
   kidneys either side of the spine, their upper parts behind the lowest ribs
   (her right kidney sits a little lower, as in life); hamstring muscles on
   the backs of both thighs.
   Region order matters where shapes overlap (later = on top): front inside is
   lungs, ribs, liver, muscles. The middle of every region's bounding box is on
   that region (the browser tests tap there).
   Coordinates are viewBox units (400 x 660); the figure's centre line is x = 240.
   ============================================================ */
window.BODY = {

  views: {

    front: {
      viewBox: "0 0 400 660",
      base:
        "<defs><linearGradient id=\"bmf-fade\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" style=\"stop-color:var(--card);stop-opacity:0\"/><stop offset=\"1\" style=\"stop-color:var(--card);stop-opacity:1\"/></linearGradient></defs>" +
        "<g class=\"bm-out\">" +
        "<circle class=\"bm-plate\" cx=\"240\" cy=\"300\" r=\"150\"/>" +
        "<ellipse class=\"bm-floor\" cx=\"240\" cy=\"646\" rx=\"70\" ry=\"8\"/>" +
        "<path class=\"bm-hair\" d=\"M 240 14 C 222 14 204 26 202 52 C 200 70 202 86 206 96 L 240 96 L 274 96 C 278 86 280 70 278 52 C 276 26 258 14 240 14 Z\"/>" +
        "<path class=\"bm-skin bm-ink\" d=\"M 206 330 C 205 380 209 420 213 452 C 210 488 211 530 216 566 L 217 596 L 230 596 L 231 566 C 235 530 237 492 235 456 C 236 420 239 386 239 352 Z\"/>" +
        "<path class=\"bm-skin bm-ink\" d=\"M 274 330 C 275 380 271 420 267 452 C 270 488 269 530 264 566 L 263 596 L 250 596 L 249 566 C 245 530 243 492 245 456 C 244 420 241 386 241 352 Z\"/>" +
        "<path class=\"bm-line\" d=\"M 216 459 Q 223 463 230 458\"/>" +
        "<path class=\"bm-line\" d=\"M 264 459 Q 257 463 250 458\"/>" +
        "<path class=\"bm-sock bm-ink\" d=\"M 215 584 L 232 584 L 233 599 L 214 599 Z\"/>" +
        "<path class=\"bm-sock bm-ink\" d=\"M 265 584 L 248 584 L 247 599 L 266 599 Z\"/>" +
        "<path class=\"bm-shoe bm-ink\" d=\"M 207 608 C 207 597 214 592 223 592 C 232 592 239 597 239 608 L 240 630 C 240 640 233 645 223 645 C 213 645 206 640 206 630 Z\"/>" +
        "<path class=\"bm-shoe bm-ink\" d=\"M 273 608 C 273 597 266 592 257 592 C 248 592 241 597 241 608 L 240 630 C 240 640 247 645 257 645 C 267 645 274 640 274 630 Z\"/>" +
        "<path class=\"bm-sole bm-ink\" d=\"M 206 631 L 240 631 C 240 641 233 646 223 646 C 213 646 206 641 206 631 Z\"/>" +
        "<path class=\"bm-sole bm-ink\" d=\"M 274 631 L 240 631 C 240 641 247 646 257 646 C 267 646 274 641 274 631 Z\"/>" +
        "<path class=\"bm-line\" d=\"M 211 625 Q 223 619 235 625\"/>" +
        "<path class=\"bm-line\" d=\"M 269 625 Q 257 619 245 625\"/>" +
        "<path class=\"bm-line\" d=\"M 217 601 L 229 601 M 216 607 L 230 607 M 216 613 L 230 613\"/>" +
        "<path class=\"bm-line\" d=\"M 263 601 L 251 601 M 264 607 L 250 607 M 264 613 L 250 613\"/>" +
        "<path class=\"bm-line\" d=\"M 218 594 Q 223 590 228 594\"/>" +
        "<path class=\"bm-line\" d=\"M 262 594 Q 257 590 252 594\"/>" +
        "<path class=\"bm-line\" d=\"M 217 587 Q 214 590 216 594\"/>" +
        "<path class=\"bm-line\" d=\"M 263 587 Q 266 590 264 594\"/>" +
        "<path class=\"bm-skin bm-ink\" d=\"M 199 152 C 189 168 185 190 184 214 C 183 238 182 254 182 268 C 181 292 180 312 180 332 L 198 333 C 199 312 200 292 201 270 C 202 252 204 236 206 220 C 207 206 208 194 208 186 Z\"/>" +
        "<path class=\"bm-skin bm-ink\" d=\"M 281 152 C 291 168 295 190 296 214 C 297 238 298 254 298 268 C 299 292 300 312 300 332 L 282 333 C 281 312 280 292 279 270 C 278 252 276 236 274 220 C 273 206 272 194 272 186 Z\"/>" +
        "<path class=\"bm-skin bm-ink\" d=\"M 178 330 C 174 344 174 360 178 371 C 181 380 193 381 196 372 C 199 362 200 346 199 331 Z\"/>" +
        "<path class=\"bm-skin bm-ink\" d=\"M 302 330 C 306 344 306 360 302 371 C 299 380 287 381 284 372 C 281 362 280 346 281 331 Z\"/>" +
        "<path class=\"bm-skin bm-ink\" d=\"M 197 338 C 203 341 205 350 200 357 C 198 352 197 345 197 338 Z\"/>" +
        "<path class=\"bm-skin bm-ink\" d=\"M 283 338 C 277 341 275 350 280 357 C 282 352 283 345 283 338 Z\"/>" +
        "<path class=\"bm-line\" d=\"M 183 362 L 183 373 M 188 364 L 188 377 M 193 363 L 193 374\"/>" +
        "<path class=\"bm-line\" d=\"M 297 362 L 297 373 M 292 364 L 292 377 M 287 363 L 287 374\"/>" +
        "<path class=\"bm-skin bm-ink\" d=\"M 230 100 L 230 140 Q 240 147 250 140 L 250 100 Z\"/>" +
        "<path class=\"bm-skin2\" d=\"M 230 108 Q 240 121 250 108 L 250 116 Q 240 128 230 116 Z\"/>" +
        "<path class=\"bm-navy bm-ink\" d=\"M 240 296 L 213 296 C 209 306 205 318 204 334 L 202 440 Q 220 444 238 441 L 240 362 L 242 441 Q 260 444 278 440 L 276 334 C 275 318 271 306 267 296 L 240 296 Z\"/>" +
        "<path class=\"bm-navyline\" d=\"M 240 362 L 240 330\"/>" +
        "<path class=\"bm-navyline\" d=\"M 205 430 Q 220 433 236 431\"/>" +
        "<path class=\"bm-navyline\" d=\"M 275 430 Q 260 433 244 431\"/>" +
        "<path class=\"bm-shirt bm-ink\" d=\"M 240 147 Q 233 146 229 137 L 216 141 C 206 144 200 147 197 152 L 181 198 L 203 205 L 206 192 C 208 214 213 240 214 262 C 213 280 209 294 207 306 Q 224 310 240 310 Q 256 310 273 306 C 271 294 267 280 266 262 C 267 240 272 214 274 192 L 277 205 L 299 198 L 283 152 C 280 147 274 144 264 141 L 251 137 Q 247 146 240 147 Z\"/>" +
        "<path class=\"bm-shirt2\" d=\"M 229 137 Q 240 150 251 137 Q 240 145 229 137 Z\"/>" +
        "<path class=\"bm-line\" d=\"M 231 141 Q 240 151 249 141\"/>" +
        "<path class=\"bm-line\" d=\"M 186 192 L 203 199\"/>" +
        "<path class=\"bm-line\" d=\"M 294 192 L 277 199\"/>" +
        "<path class=\"bm-fold\" d=\"M 214 250 Q 222 256 226 268\"/>" +
        "<path class=\"bm-fold\" d=\"M 266 250 Q 258 256 254 268\"/>" +
        "<path class=\"bm-fold\" d=\"M 209 180 Q 214 192 214 206\"/>" +
        "<path class=\"bm-fold\" d=\"M 271 180 Q 266 192 266 206\"/>" +
        "<ellipse class=\"bm-skin bm-ink\" cx=\"204.5\" cy=\"77\" rx=\"6\" ry=\"9.5\"/>" +
        "<ellipse class=\"bm-skin bm-ink\" cx=\"275.5\" cy=\"77\" rx=\"6\" ry=\"9.5\"/>" +
        "<path class=\"bm-line\" d=\"M 205 72 Q 202 77 205 82\"/>" +
        "<path class=\"bm-line\" d=\"M 275 72 Q 278 77 275 82\"/>" +
        "<path class=\"bm-skin bm-ink\" d=\"M 240 24 C 222 24 206 36 205 62 C 205 84 214 104 229 111 Q 235 115 240 115 Q 245 115 251 111 C 266 104 275 84 275 62 C 274 36 258 24 240 24 Z\"/>" +
        "<ellipse class=\"bm-blush\" cx=\"214\" cy=\"89\" rx=\"7\" ry=\"4.6\"/>" +
        "<ellipse class=\"bm-blush\" cx=\"266\" cy=\"89\" rx=\"7\" ry=\"4.6\"/>" +
        "<path class=\"bm-brow\" d=\"M 214 61 Q 222 55.5 233 58.5\"/>" +
        "<path class=\"bm-brow\" d=\"M 266 61 Q 258 55.5 247 58.5\"/>" +
        "<path class=\"bm-crease\" d=\"M 217.5 68.6 Q 224 63.8 230.5 68.6\"/>" +
        "<path class=\"bm-crease\" d=\"M 262.5 68.6 Q 256 63.8 249.5 68.6\"/>" +
        "<path class=\"bm-eyew\" d=\"M 216 73 Q 224 66 232 73 Q 224 79 216 73 Z\"/>" +
        "<path class=\"bm-eyew\" d=\"M 264 73 Q 256 66 248 73 Q 256 79 264 73 Z\"/>" +
        "<ellipse class=\"bm-iris\" cx=\"224\" cy=\"73.3\" rx=\"4.1\" ry=\"4.1\"/>" +
        "<ellipse class=\"bm-iris\" cx=\"256\" cy=\"73.3\" rx=\"4.1\" ry=\"4.1\"/>" +
        "<ellipse class=\"bm-pupil\" cx=\"224\" cy=\"73.6\" rx=\"2\" ry=\"2\"/>" +
        "<ellipse class=\"bm-pupil\" cx=\"256\" cy=\"73.6\" rx=\"2\" ry=\"2\"/>" +
        "<circle class=\"bm-glint\" cx=\"225.6\" cy=\"71.7\" r=\"1.2\"/>" +
        "<circle class=\"bm-glint\" cx=\"257.6\" cy=\"71.7\" r=\"1.2\"/>" +
        "<path class=\"bm-lashline\" d=\"M 215.4 72.8 Q 224 65.2 232.6 72.8\"/>" +
        "<path class=\"bm-lashline\" d=\"M 264.6 72.8 Q 256 65.2 247.4 72.8\"/>" +
        "<path class=\"bm-lashline\" d=\"M 216.2 71.6 L 212.6 69.2\"/>" +
        "<path class=\"bm-lashline\" d=\"M 263.8 71.6 L 267.4 69.2\"/>" +
        "<path class=\"bm-noseline\" d=\"M 241 81 Q 237.6 87.6 242 89.6\"/>" +
        "<path class=\"bm-mouth\" d=\"M 231 97 Q 240 108.5 249 97 Q 240 100.2 231 97 Z\"/>" +
        "<path class=\"bm-teeth\" d=\"M 233.2 98.3 Q 240 100.6 246.8 98.3 L 245.9 101 Q 240 102.6 234.1 101 Z\"/>" +
        "<path class=\"bm-mouthline\" d=\"M 240 99.9 V 102.2\"/>" +
        "<path class=\"bm-hair\" d=\"M 205 72 C 201 36 220 18 242 18 C 264 18 280 34 276.5 66 C 273 50 266 41 256 37.5 C 246 34.5 233 37 224 43.5 C 216 50 210 60 207.5 75 Z\"/>" +
        "<path class=\"bm-hairhi\" d=\"M 229 24 Q 217 34 211 56 M 251 22 Q 263 28 269 41 M 240 21 Q 232 28 226 40\"/>" +
        "<path class=\"bm-hair bm-braid\" d=\"M 279 204 C 278 212 280 221 284 228 C 288 221 290 212 288 204 Z\"/>" +
        "<ellipse class=\"bm-hair bm-braid\" cx=\"270.2\" cy=\"93.4\" rx=\"6.8\" ry=\"4.6\" transform=\"rotate(-44 270.2 93.4)\"/>" +
        "<ellipse class=\"bm-hair bm-braid\" cx=\"267.5\" cy=\"101.5\" rx=\"6.8\" ry=\"4.6\" transform=\"rotate(16 267.5 101.5)\"/>" +
        "<ellipse class=\"bm-hair bm-braid\" cx=\"273.7\" cy=\"107.4\" rx=\"6.8\" ry=\"4.6\" transform=\"rotate(-44 273.7 107.4)\"/>" +
        "<ellipse class=\"bm-hair bm-braid\" cx=\"271\" cy=\"115.5\" rx=\"6.8\" ry=\"4.6\" transform=\"rotate(16 271 115.5)\"/>" +
        "<ellipse class=\"bm-hair bm-braid\" cx=\"277\" cy=\"121.6\" rx=\"6.8\" ry=\"4.6\" transform=\"rotate(-40.9 277 121.6)\"/>" +
        "<ellipse class=\"bm-hair bm-braid\" cx=\"273.9\" cy=\"129.5\" rx=\"6.8\" ry=\"4.6\" transform=\"rotate(19.1 273.9 129.5)\"/>" +
        "<ellipse class=\"bm-hair bm-braid\" cx=\"279.7\" cy=\"135.7\" rx=\"6.8\" ry=\"4.6\" transform=\"rotate(-40.9 279.7 135.7)\"/>" +
        "<ellipse class=\"bm-hair bm-braid\" cx=\"276.6\" cy=\"143.6\" rx=\"6.8\" ry=\"4.6\" transform=\"rotate(19.1 276.6 143.6)\"/>" +
        "<ellipse class=\"bm-hair bm-braid\" cx=\"282\" cy=\"150.1\" rx=\"6.8\" ry=\"4.6\" transform=\"rotate(-36.6 282 150.1)\"/>" +
        "<ellipse class=\"bm-hair bm-braid\" cx=\"278.3\" cy=\"157.8\" rx=\"6.8\" ry=\"4.6\" transform=\"rotate(23.4 278.3 157.8)\"/>" +
        "<ellipse class=\"bm-hair bm-braid\" cx=\"283.7\" cy=\"164.4\" rx=\"6.8\" ry=\"4.6\" transform=\"rotate(-36.6 283.7 164.4)\"/>" +
        "<ellipse class=\"bm-hair bm-braid\" cx=\"279.8\" cy=\"171.9\" rx=\"6.8\" ry=\"4.6\" transform=\"rotate(26.7 279.8 171.9)\"/>" +
        "<ellipse class=\"bm-hair bm-braid\" cx=\"284.8\" cy=\"178.9\" rx=\"6.8\" ry=\"4.6\" transform=\"rotate(-33.3 284.8 178.9)\"/>" +
        "<ellipse class=\"bm-hair bm-braid\" cx=\"280.6\" cy=\"186.3\" rx=\"6.8\" ry=\"4.6\" transform=\"rotate(26.7 280.6 186.3)\"/>" +
        "<ellipse class=\"bm-hair bm-braid\" cx=\"285.6\" cy=\"193.2\" rx=\"6.8\" ry=\"4.6\" transform=\"rotate(-33.3 285.6 193.2)\"/>" +
        "<path class=\"bm-red bm-redline\" d=\"M 283.5 199 C 274 191 269 197 270.5 203 C 272 208.5 278 206 283.5 199 Z\"/>" +
        "<path class=\"bm-red bm-redline\" d=\"M 283.5 199 C 293 191 298 197 296.5 203 C 295 208.5 289 206 283.5 199 Z\"/>" +
        "<path class=\"bm-red bm-redline\" d=\"M 281.6 201 L 277.4 214 L 281 213 L 283 202 Z\"/>" +
        "<path class=\"bm-red bm-redline\" d=\"M 285.4 201 L 289.6 214 L 286 213 L 284 202 Z\"/>" +
        "<circle class=\"bm-red2\" cx=\"283.5\" cy=\"200\" r=\"2.8\"/>" +
        "<path class=\"bm-ring\" d=\"M 221 52 H 259 Q 271 52 271 64 V 71 Q 271 83 259 83 H 221 Q 209 83 209 71 V 64 Q 209 52 221 52 Z\"/>" +
        "<path class=\"bm-ring\" d=\"M 209 67 L 196 67\"/>" +
        "<circle class=\"bm-ring\" cx=\"188\" cy=\"355\" r=\"28\"/>" +
        "<path class=\"bm-ring\" d=\"M 160 355 L 118 355\"/>" +
        "<clipPath id=\"bmf-eyes\">" +
        "<rect x=\"4\" y=\"6\" width=\"192\" height=\"132\" rx=\"16\"/></clipPath>" +
        "<rect class=\"bm-inset\" x=\"4\" y=\"6\" width=\"192\" height=\"132\" rx=\"16\"/>" +
        "<g clip-path=\"url(#bmf-eyes)\">" +
        "<rect class=\"bm-skin\" x=\"4\" y=\"6\" width=\"192\" height=\"132\"/>" +
        "<path class=\"bm-noseline\" d=\"M 141 98 Q 137 116 142 132\"/>" +
        "<ellipse class=\"bm-blush\" cx=\"104\" cy=\"124\" rx=\"15\" ry=\"6\"/>" +
        "<ellipse class=\"bm-blush\" cx=\"176\" cy=\"124\" rx=\"15\" ry=\"6\"/>" +
        "<path class=\"bm-brow\" d=\"M 89 40 Q 107 23 132 30\"/>" +
        "<path class=\"bm-brow\" d=\"M 191 40 Q 173 23 148 30\"/>" +
        "<path class=\"bm-lid\" d=\"M 90 86 Q 112 42 134 86 Q 112 66 90 86 Z\"/>" +
        "<path class=\"bm-lid\" d=\"M 190 86 Q 168 42 146 86 Q 168 66 190 86 Z\"/>" +
        "<path class=\"bm-crease\" d=\"M 91 80 Q 112 46 133 80\"/>" +
        "<path class=\"bm-crease\" d=\"M 189 80 Q 168 46 147 80\"/>" +
        "<path class=\"bm-eyew\" d=\"M 91 86 Q 112 66 133 86 Q 112 112 91 86 Z\"/>" +
        "<path class=\"bm-eyew\" d=\"M 189 86 Q 168 66 147 86 Q 168 112 189 86 Z\"/>" +
        "<path class=\"bm-lowerlid\" d=\"M 94 90 Q 112 111 130 90\"/>" +
        "<path class=\"bm-lowerlid\" d=\"M 186 90 Q 168 111 150 90\"/>" +
        "<circle class=\"bm-iris\" cx=\"112\" cy=\"88\" r=\"10.5\"/>" +
        "<circle class=\"bm-pupil\" cx=\"112\" cy=\"88.5\" r=\"5\"/>" +
        "<circle class=\"bm-glint\" cx=\"115.6\" cy=\"84\" r=\"2.8\"/>" +
        "<circle class=\"bm-glint\" cx=\"108.6\" cy=\"92.6\" r=\"1.2\"/>" +
        "<circle class=\"bm-iris\" cx=\"168\" cy=\"88\" r=\"10.5\"/>" +
        "<circle class=\"bm-pupil\" cx=\"168\" cy=\"88.5\" r=\"5\"/>" +
        "<circle class=\"bm-glint\" cx=\"171.6\" cy=\"84\" r=\"2.8\"/>" +
        "<circle class=\"bm-glint\" cx=\"164.6\" cy=\"92.6\" r=\"1.2\"/>" +
        "<path class=\"bm-lashline\" d=\"M 89.5 86.6 Q 112 65 134.5 86.6\"/>" +
        "<path class=\"bm-lashline\" d=\"M 190.5 86.6 Q 168 65 145.5 86.6\"/>" +
        "<path class=\"bm-lash\" d=\"M 92.7 84.5 Q 90.6 81.1 85.8 80.3 M 97.3 80.9 Q 95.5 77.2 91.8 76.3 M 102.3 78.1 Q 100.7 74.3 98.2 73.3 M 107.4 76.5 Q 106 72.7 104.5 71.7 M 112.4 76 Q 112.6 72.4 110.7 71.5 M 117.5 76.7 Q 117.7 73.3 116.6 72.5 M 122.5 78.5 Q 122.9 75.5 122.4 74.7 M 127.5 81.5 Q 128 78.8 128 78.1\"/>" +
        "<path class=\"bm-lash\" d=\"M 187.3 84.5 Q 189.4 81.1 194.2 80.3 M 182.7 80.9 Q 184.5 77.2 188.2 76.3 M 177.7 78.1 Q 179.3 74.3 181.8 73.3 M 172.6 76.5 Q 174 72.7 175.5 71.7 M 167.6 76 Q 167.4 72.4 169.3 71.5 M 162.5 76.7 Q 162.3 73.3 163.4 72.5 M 157.5 78.5 Q 157.1 75.5 157.6 74.7 M 152.5 81.5 Q 152 78.8 152 78.1\"/>" +
        "<path class=\"bm-lashlow\" d=\"M 97 96 L 94.6 99.4 M 103 99.4 L 101.8 103 M 109 100.8 L 108.6 104.4 M 115 100.8 L 115.2 104.2\"/>" +
        "<path class=\"bm-lashlow\" d=\"M 183 96 L 185.4 99.4 M 177 99.4 L 178.2 103 M 171 100.8 L 171.4 104.4 M 165 100.8 L 164.8 104.2\"/>" +
        "<path class=\"bm-hair\" d=\"M 4 6 H 200 V 12 C 160 10 120 11 84 14 C 52 17 26 20 4 25 Z\"/>" +
        "<path class=\"bm-hairhi\" d=\"M 30 19 Q 70 12 120 10 M 64 16 Q 104 11 156 9.5\"/>" +
        "</g>" +
        "<rect class=\"bm-frame\" x=\"4\" y=\"6\" width=\"192\" height=\"132\" rx=\"16\"/>" +
        "<circle class=\"bm-badge\" cx=\"192\" cy=\"134\" r=\"10\"/>" +
        "<circle class=\"bm-glass\" cx=\"190.4\" cy=\"132.4\" r=\"4.4\"/>" +
        "<path class=\"bm-glassh\" d=\"M 193.6 135.6 L 197.4 139.4\"/>" +
        "<clipPath id=\"bmf-hand\">" +
        "<rect x=\"6\" y=\"286\" width=\"112\" height=\"148\" rx=\"16\"/></clipPath>" +
        "<rect class=\"bm-inset\" x=\"6\" y=\"286\" width=\"112\" height=\"148\" rx=\"16\"/>" +
        "<g clip-path=\"url(#bmf-hand)\">" +
        "<path class=\"bm-skin bm-ink\" d=\"M 48 278 L 84 278 L 87 318 L 45 318 Z\"/>" +
        "<path class=\"bm-skin bm-ink\" d=\"M 89 324 C 99 328 106 342 104 358 C 103 367 95 369 93 362 C 91 352 89 344 86 338 Z\"/>" +
        "<path class=\"bm-nail bm-nailline\" d=\"M 97.2 360.6 C 99.6 361.2 101.8 359.6 102.2 356.6 C 101 355 98.4 355.4 97 357.4 Z\"/>" +
        "<path class=\"bm-skin bm-ink\" d=\"M 44.6 350 L 44.6 386.4 Q 44.6 392 50 392 Q 55.4 392 55.4 386.4 L 55.4 350 Z\"/>" +
        "<path class=\"bm-skin bm-ink\" d=\"M 55.6 350 L 55.6 397.4 Q 55.6 403 61 403 Q 66.4 403 66.4 397.4 L 66.4 350 Z\"/>" +
        "<path class=\"bm-skin bm-ink\" d=\"M 66.6 350 L 66.6 401.4 Q 66.6 407 72 407 Q 77.4 407 77.4 401.4 L 77.4 350 Z\"/>" +
        "<path class=\"bm-skin bm-ink\" d=\"M 77.6 350 L 77.6 394.4 Q 77.6 400 83 400 Q 88.4 400 88.4 394.4 L 88.4 350 Z\"/>" +
        "<path class=\"bm-skin bm-ink\" d=\"M 44 312 C 40 328 40 344 43 360 L 89 360 C 92 344 91 328 88 312 Z\"/>" +
        "<path class=\"bm-line\" d=\"M 46 358 Q 50 361 54 358 M 57 359 Q 61 362 65 359 M 68 359 Q 72 362 76 359 M 79 358 Q 83 361 87 358\"/>" +
        "<path class=\"bm-line\" d=\"M 47 370 Q 50 372 53 370\"/>" +
        "<path class=\"bm-nail bm-nailline\" d=\"M 46.3 378.5 Q 50 376.6 53.7 378.5 L 53.7 386.8 Q 50 389.8 46.3 386.8 Z\"/>" +
        "<path class=\"bm-nailtip\" d=\"M 46.8 386.4 Q 50 389.2 53.2 386.4\"/>" +
        "<path class=\"bm-line\" d=\"M 58 381 Q 61 383 64 381\"/>" +
        "<path class=\"bm-nail bm-nailline\" d=\"M 57.3 389.5 Q 61 387.6 64.7 389.5 L 64.7 397.8 Q 61 400.8 57.3 397.8 Z\"/>" +
        "<path class=\"bm-nailtip\" d=\"M 57.8 397.4 Q 61 400.2 64.2 397.4\"/>" +
        "<path class=\"bm-line\" d=\"M 69 385 Q 72 387 75 385\"/>" +
        "<path class=\"bm-nail bm-nailline\" d=\"M 68.3 393.5 Q 72 391.6 75.7 393.5 L 75.7 401.8 Q 72 404.8 68.3 401.8 Z\"/>" +
        "<path class=\"bm-nailtip\" d=\"M 68.8 401.4 Q 72 404.2 75.2 401.4\"/>" +
        "<path class=\"bm-line\" d=\"M 80 378 Q 83 380 86 378\"/>" +
        "<path class=\"bm-nail bm-nailline\" d=\"M 79.3 386.5 Q 83 384.6 86.7 386.5 L 86.7 394.8 Q 83 397.8 79.3 394.8 Z\"/>" +
        "<path class=\"bm-nailtip\" d=\"M 79.8 394.4 Q 83 397.2 86.2 394.4\"/>" +
        "</g>" +
        "<rect class=\"bm-frame\" x=\"6\" y=\"286\" width=\"112\" height=\"148\" rx=\"16\"/>" +
        "<circle class=\"bm-badge\" cx=\"114\" cy=\"290\" r=\"10\"/>" +
        "<circle class=\"bm-glass\" cx=\"112.4\" cy=\"288.4\" r=\"4.4\"/>" +
        "<path class=\"bm-glassh\" d=\"M 115.6 291.6 L 119.4 295.4\"/>" +
        "<g class=\"bm-leads\">" +
        "<path class=\"bm-lead\" d=\"M 271 43 L 304 43\"/>" +
        "<circle class=\"bm-leaddot\" cx=\"271\" cy=\"43\" r=\"2\"/>" +
        "<path class=\"bm-lead\" d=\"M 266 196 L 309 196\"/>" +
        "<circle class=\"bm-leaddot\" cx=\"266\" cy=\"196\" r=\"2\"/>" +
        "<path class=\"bm-lead\" d=\"M 265 272 L 311 272\"/>" +
        "<circle class=\"bm-leaddot\" cx=\"265\" cy=\"272\" r=\"2\"/>" +
        "<path class=\"bm-lead\" d=\"M 274 322 L 317 322\"/>" +
        "<circle class=\"bm-leaddot\" cx=\"274\" cy=\"322\" r=\"2\"/>" +
        "<path class=\"bm-lead\" d=\"M 272 398 L 313 398\"/>" +
        "<circle class=\"bm-leaddot\" cx=\"272\" cy=\"398\" r=\"2\"/>" +
        "<path class=\"bm-lead\" d=\"M 277 596 L 298 596\"/>" +
        "<circle class=\"bm-leaddot\" cx=\"277\" cy=\"596\" r=\"2\"/>" +
        "<path class=\"bm-lead\" d=\"M 206 322 L 166 322\"/>" +
        "<circle class=\"bm-leaddot\" cx=\"206\" cy=\"322\" r=\"2\"/>" +
        "<path class=\"bm-lead\" d=\"M 208 398 L 170 398\"/>" +
        "<circle class=\"bm-leaddot\" cx=\"208\" cy=\"398\" r=\"2\"/>" +
        "<path class=\"bm-lead\" d=\"M 203 596 L 184 596\"/>" +
        "<circle class=\"bm-leaddot\" cx=\"203\" cy=\"596\" r=\"2\"/>" +
        "</g>" +
        "</g>" +
        "<g class=\"bm-in\">" +
        "<g transform=\"translate(-132 -16.5) scale(1.55)\">" +
        "<g class=\"bm-silg\">" +
        "<ellipse class=\"bm-silo\" cx=\"240\" cy=\"66\" rx=\"37.5\" ry=\"50\"/>" +
        "<ellipse class=\"bm-silo\" cx=\"204.5\" cy=\"77\" rx=\"6\" ry=\"9.5\"/>" +
        "<ellipse class=\"bm-silo\" cx=\"275.5\" cy=\"77\" rx=\"6\" ry=\"9.5\"/>" +
        "<path class=\"bm-silo\" d=\"M 230 100 L 230 140 Q 240 147 250 140 L 250 100 Z\"/>" +
        "<path class=\"bm-silo\" d=\"M 240 136 L 230 136 L 216 142 C 206 145 200 148 198 154 C 205 166 207 178 207 192 C 208 214 213 240 214 262 C 213 282 206 302 205 324 C 205 340 207 352 210 358 L 240 364 L 270 358 C 273 352 275 340 275 324 C 274 302 267 282 266 262 C 267 240 272 214 273 192 C 273 178 275 166 282 154 C 280 148 274 145 264 142 L 250 136 L 240 136 Z\"/>" +
        "<path class=\"bm-silo\" d=\"M 199 152 C 189 168 185 190 184 214 C 183 238 182 254 182 268 C 181 292 180 312 180 332 L 198 333 C 199 312 200 292 201 270 C 202 252 204 236 206 220 C 207 206 208 194 208 186 Z\"/>" +
        "<path class=\"bm-silo\" d=\"M 281 152 C 291 168 295 190 296 214 C 297 238 298 254 298 268 C 299 292 300 312 300 332 L 282 333 C 281 312 280 292 279 270 C 278 252 276 236 274 220 C 273 206 272 194 272 186 Z\"/>" +
        "<path class=\"bm-silo\" d=\"M 178 330 C 174 344 174 360 178 371 C 181 380 193 381 196 372 C 199 362 200 346 199 331 Z\"/>" +
        "<path class=\"bm-silo\" d=\"M 302 330 C 306 344 306 360 302 371 C 299 380 287 381 284 372 C 281 362 280 346 281 331 Z\"/>" +
        "<path class=\"bm-silo\" d=\"M 206 330 C 205 380 209 420 213 452 C 210 488 211 530 216 566 L 217 596 L 230 596 L 231 566 C 235 530 237 492 235 456 C 236 420 239 386 239 352 Z\"/>" +
        "<path class=\"bm-silo\" d=\"M 274 330 C 275 380 271 420 267 452 C 270 488 269 530 264 566 L 263 596 L 250 596 L 249 566 C 245 530 243 492 245 456 C 244 420 241 386 241 352 Z\"/>" +
        "<path class=\"bm-silo\" d=\"M 209 604 C 209 596 215 592 223 592 C 231 592 237 596 237 604 L 239 632 C 239 640 232 645 223 645 C 214 645 207 640 207 632 Z\"/>" +
        "<path class=\"bm-silo\" d=\"M 271 604 C 271 596 265 592 257 592 C 249 592 243 596 243 604 L 241 632 C 241 640 248 645 257 645 C 266 645 273 640 273 632 Z\"/>" +
        "<ellipse class=\"bm-sil\" cx=\"240\" cy=\"66\" rx=\"37.5\" ry=\"50\"/>" +
        "<ellipse class=\"bm-sil\" cx=\"204.5\" cy=\"77\" rx=\"6\" ry=\"9.5\"/>" +
        "<ellipse class=\"bm-sil\" cx=\"275.5\" cy=\"77\" rx=\"6\" ry=\"9.5\"/>" +
        "<path class=\"bm-sil\" d=\"M 230 100 L 230 140 Q 240 147 250 140 L 250 100 Z\"/>" +
        "<path class=\"bm-sil\" d=\"M 240 136 L 230 136 L 216 142 C 206 145 200 148 198 154 C 205 166 207 178 207 192 C 208 214 213 240 214 262 C 213 282 206 302 205 324 C 205 340 207 352 210 358 L 240 364 L 270 358 C 273 352 275 340 275 324 C 274 302 267 282 266 262 C 267 240 272 214 273 192 C 273 178 275 166 282 154 C 280 148 274 145 264 142 L 250 136 L 240 136 Z\"/>" +
        "<path class=\"bm-sil\" d=\"M 199 152 C 189 168 185 190 184 214 C 183 238 182 254 182 268 C 181 292 180 312 180 332 L 198 333 C 199 312 200 292 201 270 C 202 252 204 236 206 220 C 207 206 208 194 208 186 Z\"/>" +
        "<path class=\"bm-sil\" d=\"M 281 152 C 291 168 295 190 296 214 C 297 238 298 254 298 268 C 299 292 300 312 300 332 L 282 333 C 281 312 280 292 279 270 C 278 252 276 236 274 220 C 273 206 272 194 272 186 Z\"/>" +
        "<path class=\"bm-sil\" d=\"M 178 330 C 174 344 174 360 178 371 C 181 380 193 381 196 372 C 199 362 200 346 199 331 Z\"/>" +
        "<path class=\"bm-sil\" d=\"M 302 330 C 306 344 306 360 302 371 C 299 380 287 381 284 372 C 281 362 280 346 281 331 Z\"/>" +
        "<path class=\"bm-sil\" d=\"M 206 330 C 205 380 209 420 213 452 C 210 488 211 530 216 566 L 217 596 L 230 596 L 231 566 C 235 530 237 492 235 456 C 236 420 239 386 239 352 Z\"/>" +
        "<path class=\"bm-sil\" d=\"M 274 330 C 275 380 271 420 267 452 C 270 488 269 530 264 566 L 263 596 L 250 596 L 249 566 C 245 530 243 492 245 456 C 244 420 241 386 241 352 Z\"/>" +
        "<path class=\"bm-sil\" d=\"M 209 604 C 209 596 215 592 223 592 C 231 592 237 596 237 604 L 239 632 C 239 640 232 645 223 645 C 214 645 207 640 207 632 Z\"/>" +
        "<path class=\"bm-sil\" d=\"M 271 604 C 271 596 265 592 257 592 C 249 592 243 596 243 604 L 241 632 C 241 640 248 645 257 645 C 266 645 273 640 273 632 Z\"/>" +
        "</g>" +
        "<path class=\"bm-airway bm-airline\" d=\"M 236 108 L 244 108 L 244 190 L 236 190 Z\"/>" +
        "<path class=\"bm-airline\" d=\"M 236 116 H 244 M 236 124 H 244 M 236 132 H 244 M 236 140 H 244 M 236 148 H 244 M 236 156 H 244 M 236 164 H 244 M 236 172 H 244 M 236 180 H 244\"/>" +
        "<path class=\"bm-bronchus\" d=\"M 240 188 Q 231 194 225 204\"/>" +
        "<path class=\"bm-bronchus\" d=\"M 240 188 Q 249 194 255 204\"/>" +
        "<path class=\"bm-lung\" d=\"M 234.5 160 C 231 149 222 147 215.5 155 C 208.5 167 206.5 190 206.5 214 C 206.5 231 210.5 241 219 242 C 227 243 234 239 235.5 231 L 235.5 176 Z\"/>" +
        "<path class=\"bm-lung\" d=\"M 245.5 160 C 249 149 258 147 264.5 155 C 271.5 167 273.5 190 273.5 214 C 273.5 231 269.5 241 261 242 C 255 242.6 250 240.6 249 236 C 251 229 258 222 256 214 C 253 208 246.5 205 245.5 197 Z\"/>" +
        "<path class=\"bm-lungline\" d=\"M 209 201 Q 222 196 234 185 M 207.6 222 Q 221 214 235 210 M 272 194 Q 260 201 249 199\"/>" +
        "<path class=\"bm-heart\" d=\"M 234 205 C 232 196 240 192 247 195 C 256 192 265 199 264 211 C 263 223 257 232 260 241 C 249 238 238 228 235 216 Z\"/>" +
        "<path class=\"bm-heartline\" d=\"M 246 196 Q 248 210 256 224\"/>" +
        "<path class=\"bm-liver\" d=\"M 207 247 C 214 238 232 238 248 242 C 258 244 266 246 268.5 250 C 262 258 250 264 238 270 C 228 276 218 280 211.5 278.5 C 206 271 205 257 207 247 Z\"/>" +
        "<path class=\"bm-liverline\" d=\"M 241 243 Q 238.5 256 235 267\"/>" +
        "<g class=\"bm-ribs\">" +
        "<path class=\"bm-ribback\" d=\"M 236.5 156 C 222 152 211 158 207.5 171 M 236.5 167 C 222 163 211 169 207.5 183.6 M 236.5 178 C 222 174 211 180 207.5 196.2 M 236.5 189 C 222 185 211 191 207.5 208.8 M 236.5 200 C 222 196 211 202 207.5 221.4 M 236.5 211 C 222 207 211 213 207.5 234 M 236.5 222 C 222 218 211 224 207.5 246.6 M 236.5 233 C 228 238 219 247 212.5 259 M 207.5 248 Q 209 259 214.5 265\"/>" +
        "<path class=\"bm-ribback\" d=\"M 243.5 156 C 258 152 269 158 272.5 171 M 243.5 167 C 258 163 269 169 272.5 183.6 M 243.5 178 C 258 174 269 180 272.5 196.2 M 243.5 189 C 258 185 269 191 272.5 208.8 M 243.5 200 C 258 196 269 202 272.5 221.4 M 243.5 211 C 258 207 269 213 272.5 234 M 243.5 222 C 258 218 269 224 272.5 246.6 M 243.5 233 C 252 238 261 247 267.5 259 M 272.5 248 Q 271 259 265.5 265\"/>" +
        "<path class=\"bm-rib\" d=\"M 236.5 156 C 222 152 211 158 207.5 171 M 236.5 167 C 222 163 211 169 207.5 183.6 M 236.5 178 C 222 174 211 180 207.5 196.2 M 236.5 189 C 222 185 211 191 207.5 208.8 M 236.5 200 C 222 196 211 202 207.5 221.4 M 236.5 211 C 222 207 211 213 207.5 234 M 236.5 222 C 222 218 211 224 207.5 246.6 M 236.5 233 C 228 238 219 247 212.5 259 M 207.5 248 Q 209 259 214.5 265\"/>" +
        "<path class=\"bm-rib\" d=\"M 243.5 156 C 258 152 269 158 272.5 171 M 243.5 167 C 258 163 269 169 272.5 183.6 M 243.5 178 C 258 174 269 180 272.5 196.2 M 243.5 189 C 258 185 269 191 272.5 208.8 M 243.5 200 C 258 196 269 202 272.5 221.4 M 243.5 211 C 258 207 269 213 272.5 234 M 243.5 222 C 258 218 269 224 272.5 246.6 M 243.5 233 C 252 238 261 247 267.5 259 M 272.5 248 Q 271 259 265.5 265\"/>" +
        "</g>" +
        "<path class=\"bm-bone\" d=\"M 236.6 147 L 243.4 147 L 244 229 Q 240 237 236 229 Z\"/>" +
        "<path class=\"bm-clavback\" d=\"M 236 147 C 226 143.5 212 145 199 151\"/>" +
        "<path class=\"bm-clavback\" d=\"M 244 147 C 254 143.5 268 145 281 151\"/>" +
        "<path class=\"bm-clav\" d=\"M 236 147 C 226 143.5 212 145 199 151\"/>" +
        "<path class=\"bm-clav\" d=\"M 244 147 C 254 143.5 268 145 281 151\"/>" +
        "<path class=\"bm-muscle\" d=\"M 192.6 176 C 186.6 190 185.6 212 188.2 236 C 190 246 196 248 199 240 C 203 220 204 196 201.2 180 C 199.4 172 194.6 170 192.6 176 Z\"/>" +
        "<path class=\"bm-muscle\" d=\"M 287.4 176 C 293.4 190 294.4 212 291.8 236 C 290 246 284 248 281 240 C 277 220 276 196 278.8 180 C 280.6 172 285.4 170 287.4 176 Z\"/>" +
        "<path class=\"bm-fibre\" d=\"M 191.4 188 Q 190 212 192.2 236 M 196.4 182 Q 198 210 196.2 240\"/>" +
        "<path class=\"bm-fibre\" d=\"M 288.6 188 Q 290 212 287.8 236 M 283.6 182 Q 282 210 283.8 240\"/>" +
        "</g>" +
        "<rect class=\"bm-fade\" x=\"0\" y=\"580\" width=\"400\" height=\"80\" fill=\"url(#bmf-fade)\"/>" +
        "<g class=\"bm-leads\">" +
        "<path class=\"bm-lead\" d=\"M 274.1 231.5 L 330 236\"/>" +
        "<circle class=\"bm-leaddot\" cx=\"274.1\" cy=\"231.5\" r=\"2\"/>" +
        "<path class=\"bm-lead\" d=\"M 289.6 352.4 L 330 400\"/>" +
        "<circle class=\"bm-leaddot\" cx=\"289.6\" cy=\"352.4\" r=\"2\"/>" +
        "<path class=\"bm-lead\" d=\"M 191.9 398.9 L 160 420\"/>" +
        "<circle class=\"bm-leaddot\" cx=\"191.9\" cy=\"398.9\" r=\"2\"/>" +
        "<path class=\"bm-lead\" d=\"M 168.7 312.1 L 150 300\"/>" +
        "<circle class=\"bm-leaddot\" cx=\"168.7\" cy=\"312.1\" r=\"2\"/>" +
        "<path class=\"bm-lead\" d=\"M 311.3 312.1 L 330 300\"/>" +
        "<circle class=\"bm-leaddot\" cx=\"311.3\" cy=\"312.1\" r=\"2\"/>" +
        "</g>" +
        "</g>"
    },

    back: {
      viewBox: "0 0 400 660",
      base:
        "<defs><linearGradient id=\"bmf-fade\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" style=\"stop-color:var(--card);stop-opacity:0\"/><stop offset=\"1\" style=\"stop-color:var(--card);stop-opacity:1\"/></linearGradient></defs>" +
        "<g class=\"bm-out\">" +
        "<circle class=\"bm-plate\" cx=\"240\" cy=\"300\" r=\"150\"/>" +
        "<ellipse class=\"bm-floor\" cx=\"240\" cy=\"646\" rx=\"70\" ry=\"8\"/>" +
        "<path class=\"bm-skin bm-ink\" d=\"M 206 330 C 205 380 209 420 213 452 C 210 488 211 530 216 566 L 217 596 L 230 596 L 231 566 C 235 530 237 492 235 456 C 236 420 239 386 239 352 Z\"/>" +
        "<path class=\"bm-skin bm-ink\" d=\"M 274 330 C 275 380 271 420 267 452 C 270 488 269 530 264 566 L 263 596 L 250 596 L 249 566 C 245 530 243 492 245 456 C 244 420 241 386 241 352 Z\"/>" +
        "<path class=\"bm-line\" d=\"M 217 452 Q 223.5 448 230 452\"/>" +
        "<path class=\"bm-line\" d=\"M 263 452 Q 256.5 448 250 452\"/>" +
        "<path class=\"bm-fold\" d=\"M 228 470 Q 232 500 229 528\"/>" +
        "<path class=\"bm-fold\" d=\"M 252 470 Q 248 500 251 528\"/>" +
        "<path class=\"bm-sock bm-ink\" d=\"M 215 584 L 232 584 L 233 599 L 214 599 Z\"/>" +
        "<path class=\"bm-sock bm-ink\" d=\"M 265 584 L 248 584 L 247 599 L 266 599 Z\"/>" +
        "<path class=\"bm-line\" d=\"M 223.5 584 L 223.5 592\"/>" +
        "<path class=\"bm-line\" d=\"M 256.5 584 L 256.5 592\"/>" +
        "<path class=\"bm-shoe bm-ink\" d=\"M 207 606 C 207 596 214 591 223 591 C 232 591 239 596 239 606 L 240 630 C 240 640 233 645 223 645 C 213 645 206 640 206 630 Z\"/>" +
        "<path class=\"bm-shoe bm-ink\" d=\"M 273 606 C 273 596 266 591 257 591 C 248 591 241 596 241 606 L 240 630 C 240 640 247 645 257 645 C 267 645 274 640 274 630 Z\"/>" +
        "<path class=\"bm-sole bm-ink\" d=\"M 206 631 L 240 631 C 240 641 233 646 223 646 C 213 646 206 641 206 631 Z\"/>" +
        "<path class=\"bm-sole bm-ink\" d=\"M 274 631 L 240 631 C 240 641 247 646 257 646 C 267 646 274 641 274 631 Z\"/>" +
        "<path class=\"bm-navy bm-ink\" d=\"M 219 588 L 228 588 L 228 603 Q 223.5 606 219 603 Z\"/>" +
        "<path class=\"bm-navy bm-ink\" d=\"M 261 588 L 252 588 L 252 603 Q 256.5 606 261 603 Z\"/>" +
        "<path class=\"bm-line\" d=\"M 210 622 Q 223 614 236 622\"/>" +
        "<path class=\"bm-line\" d=\"M 270 622 Q 257 614 244 622\"/>" +
        "<path class=\"bm-skin bm-ink\" d=\"M 199 152 C 189 168 185 190 184 214 C 183 238 182 254 182 268 C 181 292 180 312 180 332 L 198 333 C 199 312 200 292 201 270 C 202 252 204 236 206 220 C 207 206 208 194 208 186 Z\"/>" +
        "<path class=\"bm-skin bm-ink\" d=\"M 281 152 C 291 168 295 190 296 214 C 297 238 298 254 298 268 C 299 292 300 312 300 332 L 282 333 C 281 312 280 292 279 270 C 278 252 276 236 274 220 C 273 206 272 194 272 186 Z\"/>" +
        "<path class=\"bm-skin bm-ink\" d=\"M 178 330 C 174 344 174 360 178 371 C 181 380 193 381 196 372 C 199 362 200 346 199 331 Z\"/>" +
        "<path class=\"bm-skin bm-ink\" d=\"M 302 330 C 306 344 306 360 302 371 C 299 380 287 381 284 372 C 281 362 280 346 281 331 Z\"/>" +
        "<path class=\"bm-line\" d=\"M 184 268 Q 188.5 264.5 193 268\"/>" +
        "<path class=\"bm-line\" d=\"M 296 268 Q 291.5 264.5 287 268\"/>" +
        "<path class=\"bm-skin bm-ink\" d=\"M 230 100 L 230 140 Q 240 147 250 140 L 250 100 Z\"/>" +
        "<path class=\"bm-navy bm-ink\" d=\"M 240 296 L 213 296 C 209 306 205 318 204 334 L 202 440 Q 220 444 238 441 L 240 362 L 242 441 Q 260 444 278 440 L 276 334 C 275 318 271 306 267 296 L 240 296 Z\"/>" +
        "<path class=\"bm-navyline\" d=\"M 240 300 L 240 362\"/>" +
        "<path class=\"bm-navyline\" d=\"M 205 430 Q 220 433 236 431\"/>" +
        "<path class=\"bm-navyline\" d=\"M 275 430 Q 260 433 244 431\"/>" +
        "<path class=\"bm-navyline\" d=\"M 216 312 Q 226 318 236 314\"/>" +
        "<path class=\"bm-navyline\" d=\"M 264 312 Q 254 318 244 314\"/>" +
        "<path class=\"bm-shirt bm-ink\" d=\"M 240 141 Q 233 141 229 137 L 216 141 C 206 144 200 147 197 152 L 181 198 L 203 205 L 206 192 C 208 214 213 240 214 262 C 213 280 209 294 207 306 Q 224 310 240 310 Q 256 310 273 306 C 271 294 267 280 266 262 C 267 240 272 214 274 192 L 277 205 L 299 198 L 283 152 C 280 147 274 144 264 141 L 251 137 Q 247 141 240 141 Z\"/>" +
        "<path class=\"bm-line\" d=\"M 230 139 Q 240 143.5 250 139\"/>" +
        "<path class=\"bm-line\" d=\"M 186 192 L 203 199\"/>" +
        "<path class=\"bm-line\" d=\"M 294 192 L 277 199\"/>" +
        "<path class=\"bm-fold\" d=\"M 214 172 Q 222 186 225 204\"/>" +
        "<path class=\"bm-fold\" d=\"M 266 172 Q 258 186 255 204\"/>" +
        "<path class=\"bm-fold\" d=\"M 216 262 Q 226 270 232 268\"/>" +
        "<path class=\"bm-fold\" d=\"M 264 262 Q 254 270 248 268\"/>" +
        "<ellipse class=\"bm-skin bm-ink\" cx=\"204.5\" cy=\"77\" rx=\"6\" ry=\"9.5\"/>" +
        "<ellipse class=\"bm-skin bm-ink\" cx=\"275.5\" cy=\"77\" rx=\"6\" ry=\"9.5\"/>" +
        "<path class=\"bm-hair\" d=\"M 240 14 C 222 14 204 26 203 52 C 202 76 210 94 225 103 Q 233 107 240 107 Q 247 107 255 103 C 270 94 278 76 277 52 C 276 26 258 14 240 14 Z\"/>" +
        "<path class=\"bm-hairhi\" d=\"M 240 20 Q 236 60 239 100 M 220 26 Q 221 68 234 101 M 260 26 Q 259 68 246 101 M 208 52 Q 214 84 229 103 M 272 52 Q 266 84 251 103\"/>" +
        "<ellipse class=\"bm-hair bm-braid\" cx=\"242.2\" cy=\"104.8\" rx=\"6.8\" ry=\"4.6\" transform=\"rotate(-10.3 242.2 104.8)\"/>" +
        "<ellipse class=\"bm-hair bm-braid\" cx=\"235.4\" cy=\"110\" rx=\"6.8\" ry=\"4.6\" transform=\"rotate(49.7 235.4 110)\"/>" +
        "<ellipse class=\"bm-hair bm-braid\" cx=\"237.3\" cy=\"118.3\" rx=\"6.8\" ry=\"4.6\" transform=\"rotate(-10.3 237.3 118.3)\"/>" +
        "<ellipse class=\"bm-hair bm-braid\" cx=\"229.6\" cy=\"122.6\" rx=\"6.8\" ry=\"4.6\" transform=\"rotate(61 229.6 122.6)\"/>" +
        "<ellipse class=\"bm-hair bm-braid\" cx=\"229.8\" cy=\"131.1\" rx=\"6.8\" ry=\"4.6\" transform=\"rotate(1 229.8 131.1)\"/>" +
        "<ellipse class=\"bm-hair bm-braid\" cx=\"221.8\" cy=\"133.9\" rx=\"6.8\" ry=\"4.6\" transform=\"rotate(75 221.8 133.9)\"/>" +
        "<ellipse class=\"bm-hair bm-braid\" cx=\"220\" cy=\"142.3\" rx=\"6.8\" ry=\"4.6\" transform=\"rotate(15 220 142.3)\"/>" +
        "<ellipse class=\"bm-hair bm-braid\" cx=\"211.7\" cy=\"143.8\" rx=\"6.8\" ry=\"4.6\" transform=\"rotate(82.1 211.7 143.8)\"/>" +
        "<ellipse class=\"bm-hair bm-braid\" cx=\"208.9\" cy=\"151.9\" rx=\"6.8\" ry=\"4.6\" transform=\"rotate(22.1 208.9 151.9)\"/>" +
        "<path class=\"bm-ring\" d=\"M 222 578 H 258 Q 280 578 280 600 V 628 Q 280 650 258 650 H 222 Q 200 650 200 628 V 600 Q 200 578 222 578 Z\"/>" +
        "<path class=\"bm-ring\" d=\"M 200 614 L 188 614\"/>" +
        "<clipPath id=\"bmf-feet\">" +
        "<rect x=\"6\" y=\"446\" width=\"182\" height=\"198\" rx=\"16\"/></clipPath>" +
        "<rect class=\"bm-inset\" x=\"6\" y=\"446\" width=\"182\" height=\"198\" rx=\"16\"/>" +
        "<g clip-path=\"url(#bmf-feet)\">" +
        "<ellipse class=\"bm-floor\" cx=\"129\" cy=\"634\" rx=\"72\" ry=\"6\"/>" +
        "<path class=\"bm-skin bm-ink\" d=\"M 82 440 L 120 440 C 122 468 117 498 113 522 L 113 556 L 89 556 L 89 522 C 85 498 80 468 82 440 Z\"/>" +
        "<path class=\"bm-fold\" d=\"M 101 505 L 101 548\"/>" +
        "<path class=\"bm-line\" d=\"M 89.5 536 Q 85 543 89.5 550 M 112.5 536 Q 117 543 112.5 550\"/>" +
        "<path class=\"bm-sock bm-ink\" d=\"M 87 546 L 115 546 L 116 568 L 86 568 Z\"/>" +
        "<path class=\"bm-shoe bm-ink\" d=\"M 77 590 C 77 570 87 561 101 561 C 115 561 125 570 125 590 L 127 618 C 127 628 116 633 101 633 C 86 633 75 628 75 618 Z\"/>" +
        "<path class=\"bm-sole bm-ink\" d=\"M 75 619 L 127 619 C 127 629 116 634 101 634 C 86 634 75 629 75 619 Z\"/>" +
        "<path class=\"bm-navy bm-ink\" d=\"M 94 556 L 108 556 L 108 580 Q 101 584 94 580 Z\"/>" +
        "<path class=\"bm-line\" d=\"M 82 606 Q 101 596 120 606\"/>" +
        "<path class=\"bm-skin bm-ink\" d=\"M 138 440 L 176 440 C 178 468 173 498 169 522 L 169 556 L 145 556 L 145 522 C 141 498 136 468 138 440 Z\"/>" +
        "<path class=\"bm-fold\" d=\"M 157 505 L 157 548\"/>" +
        "<path class=\"bm-line\" d=\"M 145.5 536 Q 141 543 145.5 550 M 168.5 536 Q 173 543 168.5 550\"/>" +
        "<path class=\"bm-sock bm-ink\" d=\"M 143 546 L 171 546 L 172 568 L 142 568 Z\"/>" +
        "<path class=\"bm-shoe bm-ink\" d=\"M 133 590 C 133 570 143 561 157 561 C 171 561 181 570 181 590 L 183 618 C 183 628 172 633 157 633 C 142 633 131 628 131 618 Z\"/>" +
        "<path class=\"bm-sole bm-ink\" d=\"M 131 619 L 183 619 C 183 629 172 634 157 634 C 142 634 131 629 131 619 Z\"/>" +
        "<path class=\"bm-navy bm-ink\" d=\"M 150 556 L 164 556 L 164 580 Q 157 584 150 580 Z\"/>" +
        "<path class=\"bm-line\" d=\"M 138 606 Q 157 596 176 606\"/>" +
        "</g>" +
        "<rect class=\"bm-frame\" x=\"6\" y=\"446\" width=\"182\" height=\"198\" rx=\"16\"/>" +
        "<circle class=\"bm-badge\" cx=\"184\" cy=\"450\" r=\"10\"/>" +
        "<circle class=\"bm-glass\" cx=\"182.4\" cy=\"448.4\" r=\"4.4\"/>" +
        "<path class=\"bm-glassh\" d=\"M 185.6 451.6 L 189.4 455.4\"/>" +
        "<g class=\"bm-leads\">" +
        "<path class=\"bm-lead\" d=\"M 265 272 L 311 272\"/>" +
        "<circle class=\"bm-leaddot\" cx=\"265\" cy=\"272\" r=\"2\"/>" +
        "<path class=\"bm-lead\" d=\"M 206 322 L 166 322\"/>" +
        "<circle class=\"bm-leaddot\" cx=\"206\" cy=\"322\" r=\"2\"/>" +
        "<path class=\"bm-lead\" d=\"M 274 322 L 317 322\"/>" +
        "<circle class=\"bm-leaddot\" cx=\"274\" cy=\"322\" r=\"2\"/>" +
        "<path class=\"bm-lead\" d=\"M 208 398 L 170 398\"/>" +
        "<circle class=\"bm-leaddot\" cx=\"208\" cy=\"398\" r=\"2\"/>" +
        "<path class=\"bm-lead\" d=\"M 272 398 L 313 398\"/>" +
        "<circle class=\"bm-leaddot\" cx=\"272\" cy=\"398\" r=\"2\"/>" +
        "</g>" +
        "</g>" +
        "<g class=\"bm-in\">" +
        "<g transform=\"translate(-72 -6) scale(1.3)\">" +
        "<g class=\"bm-silg\">" +
        "<ellipse class=\"bm-silo\" cx=\"240\" cy=\"66\" rx=\"37.5\" ry=\"50\"/>" +
        "<ellipse class=\"bm-silo\" cx=\"204.5\" cy=\"77\" rx=\"6\" ry=\"9.5\"/>" +
        "<ellipse class=\"bm-silo\" cx=\"275.5\" cy=\"77\" rx=\"6\" ry=\"9.5\"/>" +
        "<path class=\"bm-silo\" d=\"M 230 100 L 230 140 Q 240 147 250 140 L 250 100 Z\"/>" +
        "<path class=\"bm-silo\" d=\"M 240 136 L 230 136 L 216 142 C 206 145 200 148 198 154 C 205 166 207 178 207 192 C 208 214 213 240 214 262 C 213 282 206 302 205 324 C 205 340 207 352 210 358 L 240 364 L 270 358 C 273 352 275 340 275 324 C 274 302 267 282 266 262 C 267 240 272 214 273 192 C 273 178 275 166 282 154 C 280 148 274 145 264 142 L 250 136 L 240 136 Z\"/>" +
        "<path class=\"bm-silo\" d=\"M 199 152 C 189 168 185 190 184 214 C 183 238 182 254 182 268 C 181 292 180 312 180 332 L 198 333 C 199 312 200 292 201 270 C 202 252 204 236 206 220 C 207 206 208 194 208 186 Z\"/>" +
        "<path class=\"bm-silo\" d=\"M 281 152 C 291 168 295 190 296 214 C 297 238 298 254 298 268 C 299 292 300 312 300 332 L 282 333 C 281 312 280 292 279 270 C 278 252 276 236 274 220 C 273 206 272 194 272 186 Z\"/>" +
        "<path class=\"bm-silo\" d=\"M 178 330 C 174 344 174 360 178 371 C 181 380 193 381 196 372 C 199 362 200 346 199 331 Z\"/>" +
        "<path class=\"bm-silo\" d=\"M 302 330 C 306 344 306 360 302 371 C 299 380 287 381 284 372 C 281 362 280 346 281 331 Z\"/>" +
        "<path class=\"bm-silo\" d=\"M 206 330 C 205 380 209 420 213 452 C 210 488 211 530 216 566 L 217 596 L 230 596 L 231 566 C 235 530 237 492 235 456 C 236 420 239 386 239 352 Z\"/>" +
        "<path class=\"bm-silo\" d=\"M 274 330 C 275 380 271 420 267 452 C 270 488 269 530 264 566 L 263 596 L 250 596 L 249 566 C 245 530 243 492 245 456 C 244 420 241 386 241 352 Z\"/>" +
        "<path class=\"bm-silo\" d=\"M 209 604 C 209 596 215 592 223 592 C 231 592 237 596 237 604 L 239 632 C 239 640 232 645 223 645 C 214 645 207 640 207 632 Z\"/>" +
        "<path class=\"bm-silo\" d=\"M 271 604 C 271 596 265 592 257 592 C 249 592 243 596 243 604 L 241 632 C 241 640 248 645 257 645 C 266 645 273 640 273 632 Z\"/>" +
        "<ellipse class=\"bm-sil\" cx=\"240\" cy=\"66\" rx=\"37.5\" ry=\"50\"/>" +
        "<ellipse class=\"bm-sil\" cx=\"204.5\" cy=\"77\" rx=\"6\" ry=\"9.5\"/>" +
        "<ellipse class=\"bm-sil\" cx=\"275.5\" cy=\"77\" rx=\"6\" ry=\"9.5\"/>" +
        "<path class=\"bm-sil\" d=\"M 230 100 L 230 140 Q 240 147 250 140 L 250 100 Z\"/>" +
        "<path class=\"bm-sil\" d=\"M 240 136 L 230 136 L 216 142 C 206 145 200 148 198 154 C 205 166 207 178 207 192 C 208 214 213 240 214 262 C 213 282 206 302 205 324 C 205 340 207 352 210 358 L 240 364 L 270 358 C 273 352 275 340 275 324 C 274 302 267 282 266 262 C 267 240 272 214 273 192 C 273 178 275 166 282 154 C 280 148 274 145 264 142 L 250 136 L 240 136 Z\"/>" +
        "<path class=\"bm-sil\" d=\"M 199 152 C 189 168 185 190 184 214 C 183 238 182 254 182 268 C 181 292 180 312 180 332 L 198 333 C 199 312 200 292 201 270 C 202 252 204 236 206 220 C 207 206 208 194 208 186 Z\"/>" +
        "<path class=\"bm-sil\" d=\"M 281 152 C 291 168 295 190 296 214 C 297 238 298 254 298 268 C 299 292 300 312 300 332 L 282 333 C 281 312 280 292 279 270 C 278 252 276 236 274 220 C 273 206 272 194 272 186 Z\"/>" +
        "<path class=\"bm-sil\" d=\"M 178 330 C 174 344 174 360 178 371 C 181 380 193 381 196 372 C 199 362 200 346 199 331 Z\"/>" +
        "<path class=\"bm-sil\" d=\"M 302 330 C 306 344 306 360 302 371 C 299 380 287 381 284 372 C 281 362 280 346 281 331 Z\"/>" +
        "<path class=\"bm-sil\" d=\"M 206 330 C 205 380 209 420 213 452 C 210 488 211 530 216 566 L 217 596 L 230 596 L 231 566 C 235 530 237 492 235 456 C 236 420 239 386 239 352 Z\"/>" +
        "<path class=\"bm-sil\" d=\"M 274 330 C 275 380 271 420 267 452 C 270 488 269 530 264 566 L 263 596 L 250 596 L 249 566 C 245 530 243 492 245 456 C 244 420 241 386 241 352 Z\"/>" +
        "<path class=\"bm-sil\" d=\"M 209 604 C 209 596 215 592 223 592 C 231 592 237 596 237 604 L 239 632 C 239 640 232 645 223 645 C 214 645 207 640 207 632 Z\"/>" +
        "<path class=\"bm-sil\" d=\"M 271 604 C 271 596 265 592 257 592 C 249 592 243 596 243 604 L 241 632 C 241 640 248 645 257 645 C 266 645 273 640 273 632 Z\"/>" +
        "</g>" +
        "<path class=\"bm-kidney\" d=\"M 219 242 C 208 242 204 256 205 266 C 206 278 212 286 221 286 C 228 286 231 280 229 274 C 227 269 226 264 229 259 C 232 253 230 242 219 242 Z\"/>" +
        "<path class=\"bm-kidney\" d=\"M 261 249 C 272 249 276 263 275 273 C 274 285 268 293 259 293 C 252 293 249 287 251 281 C 253 276 254 271 251 266 C 248 260 250 249 261 249 Z\"/>" +
        "<path class=\"bm-kidneyline\" d=\"M 228.6 264 Q 233 266 236 264 M 214 252 Q 210 264 214 278\"/>" +
        "<path class=\"bm-kidneyline\" d=\"M 251.4 271 Q 247 273 244 271 M 266 259 Q 270 271 266 285\"/>" +
        "<g class=\"bm-ribs\">" +
        "<path class=\"bm-ribback\" d=\"M 243.5 150 C 257 147 268 152 272.5 164 M 243.5 161.5 C 257 158.5 268 163.5 272.5 176.9 M 243.5 173 C 257 170 268 175 272.5 189.8 M 243.5 184.5 C 257 181.5 268 186.5 272.5 202.7 M 243.5 196 C 257 193 268 198 272.5 215.6 M 243.5 207.5 C 257 204.5 268 209.5 272.5 228.5 M 243.5 219 C 257 216 268 221 272.5 241.4 M 243.5 230.5 C 257 227.5 268 232.5 272.5 254.3 M 243.5 242 C 257 239 268 244 272.5 267.2 M 243.5 253.5 C 252 252 260 256 265 264 M 243.5 264 C 249 263 254 266 257 271\"/>" +
        "<path class=\"bm-ribback\" d=\"M 236.5 150 C 223 147 212 152 207.5 164 M 236.5 161.5 C 223 158.5 212 163.5 207.5 176.9 M 236.5 173 C 223 170 212 175 207.5 189.8 M 236.5 184.5 C 223 181.5 212 186.5 207.5 202.7 M 236.5 196 C 223 193 212 198 207.5 215.6 M 236.5 207.5 C 223 204.5 212 209.5 207.5 228.5 M 236.5 219 C 223 216 212 221 207.5 241.4 M 236.5 230.5 C 223 227.5 212 232.5 207.5 254.3 M 236.5 242 C 223 239 212 244 207.5 267.2 M 236.5 253.5 C 228 252 220 256 215 264 M 236.5 264 C 231 263 226 266 223 271\"/>" +
        "<path class=\"bm-rib\" d=\"M 243.5 150 C 257 147 268 152 272.5 164 M 243.5 161.5 C 257 158.5 268 163.5 272.5 176.9 M 243.5 173 C 257 170 268 175 272.5 189.8 M 243.5 184.5 C 257 181.5 268 186.5 272.5 202.7 M 243.5 196 C 257 193 268 198 272.5 215.6 M 243.5 207.5 C 257 204.5 268 209.5 272.5 228.5 M 243.5 219 C 257 216 268 221 272.5 241.4 M 243.5 230.5 C 257 227.5 268 232.5 272.5 254.3 M 243.5 242 C 257 239 268 244 272.5 267.2 M 243.5 253.5 C 252 252 260 256 265 264 M 243.5 264 C 249 263 254 266 257 271\"/>" +
        "<path class=\"bm-rib\" d=\"M 236.5 150 C 223 147 212 152 207.5 164 M 236.5 161.5 C 223 158.5 212 163.5 207.5 176.9 M 236.5 173 C 223 170 212 175 207.5 189.8 M 236.5 184.5 C 223 181.5 212 186.5 207.5 202.7 M 236.5 196 C 223 193 212 198 207.5 215.6 M 236.5 207.5 C 223 204.5 212 209.5 207.5 228.5 M 236.5 219 C 223 216 212 221 207.5 241.4 M 236.5 230.5 C 223 227.5 212 232.5 207.5 254.3 M 236.5 242 C 223 239 212 244 207.5 267.2 M 236.5 253.5 C 228 252 220 256 215 264 M 236.5 264 C 231 263 226 266 223 271\"/>" +
        "</g>" +
        "<path class=\"bm-bone\" d=\"M 238 104 H 242 Q 244.6 104 244.6 106.6 V 109.60000000000001 Q 244.6 112.2 242 112.2 H 238 Q 235.4 112.2 235.4 109.60000000000001 V 106.6 Q 235.4 104 238 104 Z\"/>" +
        "<path class=\"bm-bone\" d=\"M 238 114.6 H 242 Q 244.6 114.6 244.6 117.19999999999999 V 120.2 Q 244.6 122.8 242 122.8 H 238 Q 235.4 122.8 235.4 120.2 V 117.19999999999999 Q 235.4 114.6 238 114.6 Z\"/>" +
        "<path class=\"bm-bone\" d=\"M 238 125.2 H 242 Q 244.6 125.2 244.6 127.8 V 130.8 Q 244.6 133.4 242 133.4 H 238 Q 235.4 133.4 235.4 130.8 V 127.8 Q 235.4 125.2 238 125.2 Z\"/>" +
        "<path class=\"bm-bone\" d=\"M 238 135.8 H 242 Q 244.6 135.8 244.6 138.4 V 141.4 Q 244.6 144 242 144 H 238 Q 235.4 144 235.4 141.4 V 138.4 Q 235.4 135.8 238 135.8 Z\"/>" +
        "<path class=\"bm-bone\" d=\"M 238 146.4 H 242 Q 244.6 146.4 244.6 149 V 152 Q 244.6 154.6 242 154.6 H 238 Q 235.4 154.6 235.4 152 V 149 Q 235.4 146.4 238 146.4 Z\"/>" +
        "<path class=\"bm-bone\" d=\"M 238 157 H 242 Q 244.6 157 244.6 159.6 V 162.6 Q 244.6 165.2 242 165.2 H 238 Q 235.4 165.2 235.4 162.6 V 159.6 Q 235.4 157 238 157 Z\"/>" +
        "<path class=\"bm-bone\" d=\"M 238 167.6 H 242 Q 244.6 167.6 244.6 170.2 V 173.2 Q 244.6 175.79999999999998 242 175.79999999999998 H 238 Q 235.4 175.79999999999998 235.4 173.2 V 170.2 Q 235.4 167.6 238 167.6 Z\"/>" +
        "<path class=\"bm-bone\" d=\"M 238 178.2 H 242 Q 244.6 178.2 244.6 180.79999999999998 V 183.79999999999998 Q 244.6 186.39999999999998 242 186.39999999999998 H 238 Q 235.4 186.39999999999998 235.4 183.79999999999998 V 180.79999999999998 Q 235.4 178.2 238 178.2 Z\"/>" +
        "<path class=\"bm-bone\" d=\"M 238 188.8 H 242 Q 244.6 188.8 244.6 191.4 V 194.4 Q 244.6 197 242 197 H 238 Q 235.4 197 235.4 194.4 V 191.4 Q 235.4 188.8 238 188.8 Z\"/>" +
        "<path class=\"bm-bone\" d=\"M 238 199.4 H 242 Q 244.6 199.4 244.6 202 V 205 Q 244.6 207.6 242 207.6 H 238 Q 235.4 207.6 235.4 205 V 202 Q 235.4 199.4 238 199.4 Z\"/>" +
        "<path class=\"bm-bone\" d=\"M 238 210 H 242 Q 244.6 210 244.6 212.6 V 215.6 Q 244.6 218.2 242 218.2 H 238 Q 235.4 218.2 235.4 215.6 V 212.6 Q 235.4 210 238 210 Z\"/>" +
        "<path class=\"bm-bone\" d=\"M 238 220.6 H 242 Q 244.6 220.6 244.6 223.2 V 226.2 Q 244.6 228.79999999999998 242 228.79999999999998 H 238 Q 235.4 228.79999999999998 235.4 226.2 V 223.2 Q 235.4 220.6 238 220.6 Z\"/>" +
        "<path class=\"bm-bone\" d=\"M 238 231.2 H 242 Q 244.6 231.2 244.6 233.79999999999998 V 236.79999999999998 Q 244.6 239.39999999999998 242 239.39999999999998 H 238 Q 235.4 239.39999999999998 235.4 236.79999999999998 V 233.79999999999998 Q 235.4 231.2 238 231.2 Z\"/>" +
        "<path class=\"bm-bone\" d=\"M 238 241.8 H 242 Q 244.6 241.8 244.6 244.4 V 247.4 Q 244.6 250 242 250 H 238 Q 235.4 250 235.4 247.4 V 244.4 Q 235.4 241.8 238 241.8 Z\"/>" +
        "<path class=\"bm-bone\" d=\"M 238 252.4 H 242 Q 244.6 252.4 244.6 255 V 258 Q 244.6 260.6 242 260.6 H 238 Q 235.4 260.6 235.4 258 V 255 Q 235.4 252.4 238 252.4 Z\"/>" +
        "<path class=\"bm-bone\" d=\"M 238 263 H 242 Q 244.6 263 244.6 265.6 V 268.59999999999997 Q 244.6 271.2 242 271.2 H 238 Q 235.4 271.2 235.4 268.59999999999997 V 265.6 Q 235.4 263 238 263 Z\"/>" +
        "<path class=\"bm-bone\" d=\"M 238 273.6 H 242 Q 244.6 273.6 244.6 276.20000000000005 V 279.2 Q 244.6 281.8 242 281.8 H 238 Q 235.4 281.8 235.4 279.2 V 276.20000000000005 Q 235.4 273.6 238 273.6 Z\"/>" +
        "<path class=\"bm-bone\" d=\"M 238 284.2 H 242 Q 244.6 284.2 244.6 286.8 V 289.79999999999995 Q 244.6 292.4 242 292.4 H 238 Q 235.4 292.4 235.4 289.79999999999995 V 286.8 Q 235.4 284.2 238 284.2 Z\"/>" +
        "<path class=\"bm-bone\" d=\"M 238 294.8 H 242 Q 244.6 294.8 244.6 297.40000000000003 V 300.4 Q 244.6 303 242 303 H 238 Q 235.4 303 235.4 300.4 V 297.40000000000003 Q 235.4 294.8 238 294.8 Z\"/>" +
        "<path class=\"bm-bone\" d=\"M 238 305.4 H 242 Q 244.6 305.4 244.6 308 V 310.99999999999994 Q 244.6 313.59999999999997 242 313.59999999999997 H 238 Q 235.4 313.59999999999997 235.4 310.99999999999994 V 308 Q 235.4 305.4 238 305.4 Z\"/>" +
        "<path class=\"bm-bone\" d=\"M 238 316 H 242 Q 244.6 316 244.6 318.6 V 321.59999999999997 Q 244.6 324.2 242 324.2 H 238 Q 235.4 324.2 235.4 321.59999999999997 V 318.6 Q 235.4 316 238 316 Z\"/>" +
        "<path class=\"bm-bone\" d=\"M 238 326.6 H 242 Q 244.6 326.6 244.6 329.20000000000005 V 332.2 Q 244.6 334.8 242 334.8 H 238 Q 235.4 334.8 235.4 332.2 V 329.20000000000005 Q 235.4 326.6 238 326.6 Z\"/>" +
        "<path class=\"bm-bone\" d=\"M 233 332 L 247 332 L 244 356 Q 240 362 236 356 Z\"/>" +
        "<path class=\"bm-muscle\" d=\"M 213.6 370 C 208.6 392 210.6 420 216 444 C 219 452 230 452 232.4 444 C 236.4 420 236.6 392 232.6 370 C 229 361 217.6 361 213.6 370 Z\"/>" +
        "<path class=\"bm-muscle\" d=\"M 266.4 370 C 271.4 392 269.4 420 264 444 C 261 452 250 452 247.6 444 C 243.6 420 243.4 392 247.4 370 C 251 361 262.4 361 266.4 370 Z\"/>" +
        "<path class=\"bm-fibre\" d=\"M 223 366 L 223.6 450 M 217 380 Q 216 410 220 440 M 229 380 Q 231 410 228 440\"/>" +
        "<path class=\"bm-fibre\" d=\"M 257 366 L 256.4 450 M 263 380 Q 264 410 260 440 M 251 380 Q 249 410 252 440\"/>" +
        "</g>" +
        "<rect class=\"bm-fade\" x=\"0\" y=\"580\" width=\"400\" height=\"80\" fill=\"url(#bmf-fade)\"/>" +
        "<g class=\"bm-leads\">" +
        "<path class=\"bm-lead\" d=\"M 281.6 254 L 318 236\"/>" +
        "<circle class=\"bm-leaddot\" cx=\"281.6\" cy=\"254\" r=\"2\"/>" +
        "<path class=\"bm-lead\" d=\"M 197.1 339.8 L 170 326\"/>" +
        "<circle class=\"bm-leaddot\" cx=\"197.1\" cy=\"339.8\" r=\"2\"/>" +
        "<path class=\"bm-lead\" d=\"M 282.9 350.2 L 314 334\"/>" +
        "<circle class=\"bm-leaddot\" cx=\"282.9\" cy=\"350.2\" r=\"2\"/>" +
        "<path class=\"bm-lead\" d=\"M 204.9 524.4 L 166 520\"/>" +
        "<circle class=\"bm-leaddot\" cx=\"204.9\" cy=\"524.4\" r=\"2\"/>" +
        "<path class=\"bm-lead\" d=\"M 275.1 524.4 L 314 520\"/>" +
        "<circle class=\"bm-leaddot\" cx=\"275.1\" cy=\"524.4\" r=\"2\"/>" +
        "</g>" +
        "</g>"
    }
  },

  /* ---------- regions: outside first, then inside (inside shapes sit on top) ---------- */
  regions: [
    /* FRONT, outside */
    { id: "forehead", word: "forehead", layer: "outside", side: null, view: "front",
      path: "M 208 60 C 208 38 222 26 240 26 C 258 26 272 38 272 56 L 272 60 Z", label: [338, 47] },
    { id: "eyebrow-r", word: "eyebrow", layer: "outside", side: "right", view: "front",
      path: "M 6 10 H 140 V 46 H 6 Z", label: [44, 33] },
    { id: "eyebrow-l", word: "eyebrow", layer: "outside", side: "left", view: "front",
      path: "M 140 10 H 194 V 46 H 140 Z", label: [44, 33] },
    { id: "eyelid-r", word: "eyelid", layer: "outside", side: "right", view: "front",
      path: "M 6 46 H 140 V 73 H 6 Z", label: [44, 63] },
    { id: "eyelid-l", word: "eyelid", layer: "outside", side: "left", view: "front",
      path: "M 140 46 H 194 V 73 H 140 Z", label: [44, 63] },
    { id: "eyelash-r", word: "eyelash", layer: "outside", side: "right", view: "front",
      path: "M 6 73 H 140 V 136 H 6 Z", label: [44, 100] },
    { id: "eyelash-l", word: "eyelash", layer: "outside", side: "left", view: "front",
      path: "M 140 73 H 194 V 136 H 140 Z", label: [44, 100] },
    { id: "chest", word: "chest", layer: "outside", side: null, view: "front",
      path: "M 207 172 C 220 160 260 160 273 172 L 271 240 C 256 247 224 247 209 240 Z", label: [338, 200] },
    { id: "waist", word: "waist", layer: "outside", side: null, view: "front",
      path: "M 211 250 C 226 255 254 255 269 250 L 270 292 C 254 297 226 297 210 292 Z", label: [338, 276] },
    { id: "hip-r", word: "hip", layer: "outside", side: "right", view: "front",
      path: "M 200 298 L 233 298 L 233 349 L 198 349 C 197 330 198 312 200 298 Z", label: [142, 326] },
    { id: "hip-l", word: "hip", layer: "outside", side: "left", view: "front",
      path: "M 280 298 L 247 298 L 247 349 L 282 349 C 283 330 282 312 280 298 Z", label: [338, 326] },
    { id: "nail", word: "nail", layer: "outside", side: null, view: "front",
      path: "M 48 352 H 98 Q 108 352 108 362 V 404 Q 108 414 98 414 H 48 Q 38 414 38 404 V 362 Q 38 352 48 352 Z", label: [64, 428] },
    { id: "thigh-r", word: "thigh", layer: "outside", side: "right", view: "front",
      path: "M 199 352 L 240 358 L 240 450 L 205 450 Z", label: [146, 402] },
    { id: "thigh-l", word: "thigh", layer: "outside", side: "left", view: "front",
      path: "M 281 352 L 240 358 L 240 450 L 275 450 Z", label: [338, 402] },
    { id: "ankle-r", word: "ankle", layer: "outside", side: "right", view: "front",
      path: "M 209 566 H 231 Q 240 566 240 575 V 599 Q 240 608 231 608 H 209 Q 200 608 200 599 V 575 Q 200 566 209 566 Z", label: [160, 600] },
    { id: "ankle-l", word: "ankle", layer: "outside", side: "left", view: "front",
      path: "M 271 566 H 249 Q 240 566 240 575 V 599 Q 240 608 249 608 H 271 Q 280 608 280 599 V 575 Q 280 566 271 566 Z", label: [322, 600] },

    /* FRONT, inside */
    { id: "lungs", word: "lungs", layer: "inside", side: null, view: "front",
      path: "M 231.5 231.5 C 226.1 214.5 212.1 211.3 202 223.8 C 191.2 242.3 188.1 278 188.1 315.2 C 188.1 341.6 194.3 357.1 207.4 358.6 C 219.8 360.2 230.7 353.9 233 341.6 Z M 248.5 231.5 C 253.9 214.5 267.9 211.3 278 223.8 C 288.8 242.3 291.9 278 291.9 315.2 C 291.9 341.6 285.7 357.1 272.6 358.6 C 263.3 359.5 255.5 356.4 253.9 349.3 C 257.1 338.4 267.9 327.6 264.8 315.2 C 260.1 305.9 250.1 301.3 248.5 288.9 Z M 233 150.9 H 247 V 299.7 H 233 Z", label: [344, 240] },
    { id: "ribs", word: "ribs", layer: "inside", side: null, view: "front",
      path: "M 182.7 216 L 202.8 216 L 202.8 343.1 C 209 361.7 224.5 349.3 230.7 333.8 L 230.7 293.5 L 249.3 293.5 L 249.3 333.8 C 255.5 349.3 271 361.7 277.2 343.1 L 277.2 216 L 297.4 216 L 297.4 315.2 C 297.4 358.6 286.5 389.6 269.4 402 C 258.6 389.6 249.3 374.1 240 364.8 C 230.7 374.1 221.4 389.6 210.6 402 C 193.5 389.6 182.7 358.6 182.7 315.2 Z", label: [346, 404] },
    { id: "liver", word: "liver", layer: "inside", side: null, view: "front",
      path: "M 184.2 363.3 C 196.6 347.8 227.6 347.8 253.9 353.9 C 271 357.1 284.9 360.2 289.6 369.4 C 278.8 384.9 257.1 395.8 238.4 406.7 C 221.4 415.9 205.9 422.2 193.5 420.6 C 182.7 406.7 181.1 381.9 184.2 363.3 Z", label: [132, 424] },
    { id: "muscle-r", word: "muscle", layer: "inside", side: "right", view: "front",
      path: "M 164.1 243.9 C 150.1 271.8 148.6 315.2 154.8 355.5 C 159.4 374.1 176.4 377.2 182.7 360.2 C 190.4 324.5 190.4 281.1 184.2 254.8 C 179.6 239.3 168.7 236.2 164.1 243.9 Z", label: [116, 304] },
    { id: "muscle-l", word: "muscle", layer: "inside", side: "left", view: "front",
      path: "M 315.9 243.9 C 329.9 271.8 331.4 315.2 325.3 355.5 C 320.6 374.1 303.6 377.2 297.4 360.2 C 289.6 324.5 289.6 281.1 295.8 254.8 C 300.4 239.3 311.3 236.2 315.9 243.9 Z", label: [362, 304] },

    /* BACK, outside */
    { id: "waist-b", word: "waist", layer: "outside", side: null, view: "back",
      path: "M 211 250 C 226 255 254 255 269 250 L 270 292 C 254 297 226 297 210 292 Z", label: [338, 276] },
    { id: "hip-l-b", word: "hip", layer: "outside", side: "left", view: "back",
      path: "M 200 298 L 233 298 L 233 349 L 198 349 C 197 330 198 312 200 298 Z", label: [142, 326] },
    { id: "hip-r-b", word: "hip", layer: "outside", side: "right", view: "back",
      path: "M 280 298 L 247 298 L 247 349 L 282 349 C 283 330 282 312 280 298 Z", label: [338, 326] },
    { id: "thigh-l-b", word: "thigh", layer: "outside", side: "left", view: "back",
      path: "M 199 352 L 240 358 L 240 450 L 205 450 Z", label: [146, 402] },
    { id: "thigh-r-b", word: "thigh", layer: "outside", side: "right", view: "back",
      path: "M 281 352 L 240 358 L 240 450 L 275 450 Z", label: [338, 402] },
    { id: "ankle-l-b", word: "ankle", layer: "outside", side: "left", view: "back",
      path: "M 8 514 H 129 V 560 H 8 Z", label: [39, 542] },
    { id: "ankle-r-b", word: "ankle", layer: "outside", side: "right", view: "back",
      path: "M 129 514 H 186 V 560 H 129 Z", label: [39, 542] },
    { id: "heel-l-b", word: "heel", layer: "outside", side: "left", view: "back",
      path: "M 8 562 H 129 V 636 H 8 Z", label: [39, 602] },
    { id: "heel-r-b", word: "heel", layer: "outside", side: "right", view: "back",
      path: "M 129 562 H 186 V 636 H 129 Z", label: [39, 602] },

    /* BACK, inside */
    { id: "ribs-b", word: "ribs", layer: "inside", side: null, view: "back",
      path: "M 240 178.6 C 216.6 178.6 195.8 189 193.2 215 C 190.6 254 193.2 300.8 198.4 326.8 C 206.2 339.8 221.8 345 240 345 C 258.2 345 273.8 339.8 281.6 326.8 C 286.8 300.8 289.4 254 286.8 215 C 284.2 189 263.4 178.6 240 178.6 Z", label: [346, 240] },
    { id: "kidney-l-b", word: "kidney", layer: "inside", side: "left", view: "back",
      path: "M 212.7 303.4 C 194.5 303.4 188 324.2 189.3 339.8 C 190.6 358 201 371 215.3 371 C 227 371 233.5 361.9 230.9 351.5 C 228.3 343.7 227 337.2 230.9 330.7 C 234.8 320.3 230.9 303.4 212.7 303.4 Z", label: [144, 330] },
    { id: "kidney-r-b", word: "kidney", layer: "inside", side: "right", view: "back",
      path: "M 267.3 312.5 C 285.5 312.5 292 333.3 290.7 348.9 C 289.4 367.1 279 380.1 264.7 380.1 C 253 380.1 246.5 371 249.1 360.6 C 251.7 352.8 253 346.3 249.1 339.8 C 245.2 329.4 249.1 312.5 267.3 312.5 Z", label: [340, 338] },
    { id: "muscle-l-b", word: "muscle", layer: "inside", side: "left", view: "back",
      path: "M 202.3 469.8 C 194.5 503.6 197.1 542.6 204.9 576.4 C 210.1 588.1 229.6 588.1 233.5 576.4 C 240 542.6 240 503.6 234.8 469.8 C 229.6 455.5 207.5 455.5 202.3 469.8 Z", label: [138, 524] },
    { id: "muscle-r-b", word: "muscle", layer: "inside", side: "right", view: "back",
      path: "M 277.7 469.8 C 285.5 503.6 282.9 542.6 275.1 576.4 C 269.9 588.1 250.4 588.1 246.5 576.4 C 240 542.6 240 503.6 245.2 469.8 C 250.4 455.5 272.5 455.5 277.7 469.8 Z", label: [342, 524] }
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
      region: "ankle-l", pic: "art/bodymap/hurt-stairs.svg", options: ["stiffness", "fracture", "infection", "exhaustion"], answer: 1,
      why: "A crack in a bone on an X-ray is a fracture. Stiffness and exhaustion are feelings, not a crack, and nothing here has been infected by germs.",
      tests: "fracture" },

    { text: "I fell sideways off my bike by Benjakitti Park and landed on my right side. The top of my leg looks the wrong shape and I can't move it, but the doctor says nothing is broken: the bone has come out of the joint.",
      region: "hip-r", pic: "art/bodymap/hurt-bike.svg", options: ["fracture", "treat", "dislocate", "heal"], answer: 2,
      why: "A bone that comes out of its joint is dislocated. To fracture is to crack or break it, and treat and heal describe what happens afterwards.",
      tests: "dislocate" },

    { text: "I walked straight into the glass door at the mall and hit the front of my head. There's a bump above my eyebrows and my head throbbed for the rest of the afternoon.",
      region: "forehead", pic: "art/bodymap/hurt-door.svg", options: ["headache", "fever", "cough", "dizziness"], answer: 0,
      why: "A throbbing head is a headache. Nobody mentions feeling hot, coughing, or the room spinning, so fever, cough and dizziness do not fit.",
      tests: "headache" },

    { text: "The PM2.5 is terrible this week. For three days my lungs have been fighting the dust: I keep making a dry, hacking noise from my chest, and it is worse at night when I lie down.",
      region: "lungs", pic: "art/bodymap/hurt-smog.svg", options: ["sneeze", "headache", "dizziness", "cough"], answer: 3,
      why: "A dry, hacking noise from the chest, worse at night, is a cough. A sneeze comes from the nose, and a headache or dizziness is felt in the head.",
      tests: "cough" },

    { text: "A teammate's elbow caught me in the side during a crowded warm-up. It hurts to laugh or take a deep breath, and the X-ray shows that one of the curved bones has snapped.",
      region: "ribs", pic: "art/bodymap/hurt-warmup.svg", options: ["sore", "broken", "stiff", "dizzy"], answer: 1,
      why: "A bone that has snapped is broken. Sore and stiff describe muscles that hurt or will not move freely, and dizzy is a feeling in the head.",
      tests: "broken" },

    { text: "I did two hundred squats at Coach's training on Saturday. Now the big muscles above my knees are tight and hard to bend, and it takes me a minute to straighten up when I stand.",
      region: "thigh-l", pic: "art/bodymap/hurt-squats.svg", options: ["stiff", "broken", "infectious", "sick"], answer: 0,
      why: "Muscles that are tight and hard to move after exercise are stiff. Nothing is broken, nothing can be passed on, and sick means unwell or vomiting.",
      tests: "stiff" },

    { text: "I caught my finger in the taxi door. The nail has gone dark and it throbs underneath, but the doctor says the bone is fine and it will grow out.",
      region: "nail", pic: "art/bodymap/hurt-taxi.svg", options: ["infection", "fracture", "injury", "symptom"], answer: 2,
      why: "Harm to a part of the body in an accident is an injury. The bone is fine, so it is not a fracture; no germs are involved; a symptom is a sign of illness.",
      tests: "injury" },

    { text: "I ate some suspect grilled pork at the night market. Now my stomach is churning, I have no appetite, and I feel as if I am going to throw up.",
      region: "waist", pic: "art/bodymap/hurt-nightmarket.svg", options: ["sore", "dizzy", "stiff", "sick"], answer: 3,
      why: "In British English, feeling that you are going to vomit is feeling sick. Sore and stiff describe parts that hurt or will not move, and dizzy is spinning.",
      tests: "sick" },

    { text: "I had a temperature all weekend and now there's a pain in my back on the left side, just under my lowest ribs. The doctor says germs have got into the organ that cleans my blood.",
      region: "kidney-l-b", pic: "art/bodymap/hurt-fever.svg", options: ["infection", "fracture", "injury", "stiffness"], answer: 0,
      why: "Germs getting into an organ cause an infection. A fracture or an injury comes from an accident, and stiffness is a muscle or joint feeling.",
      tests: "infection" },

    { text: "My new trainers rubbed the back of my foot raw at sports day. There's a blister there now and it stings every time I take a step.",
      region: "heel-r-b", pic: "art/bodymap/hurt-trainers.svg", options: ["stiff", "sore", "dizzy", "broken"], answer: 1,
      why: "Skin that hurts because it has been rubbed too much is sore. Nothing is broken or stiff, and dizzy is a feeling in the head, not the foot.",
      tests: "sore" },

    { text: "A mosquito bit the skin over my right eye at Yai's house. It has swollen up, it hurts, and I can hardly open the eye this morning.",
      region: "eyelid-r", pic: "art/bodymap/hurt-mosquito.svg", options: ["stiff", "dizzy", "infectious", "painful"], answer: 3,
      why: "A swollen part that hurts is painful. Stiff is for joints and muscles, dizzy is the head spinning, and infectious means an illness that can spread.",
      tests: "painful" },

    { text: "I've been coughing for a week with this cold. Now there is a dull, tired pain right across the front of my body under my vest that never quite goes away.",
      region: "chest", pic: "art/bodymap/hurt-cold.svg", options: ["fever", "sneeze", "ache", "headache"], answer: 2,
      why: "A dull pain that goes on and on is an ache. A headache is an ache in the head, not the chest; fever is heat and a sneeze comes from the nose.",
      tests: "ache" }
  ]
};
