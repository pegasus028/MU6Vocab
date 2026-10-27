/* ============================================================
   BACK ON YOUR FEET: patterns module (Gateway B2 Unit 6)
   The systems behind the 70 items: one patient journey, a body in
   layers, the UP/DOWN metaphor, word-building rules, confusables,
   British usage, word stories, sounds and one Thai contrast.
   Schema per card (same as Money Matters, SPEC section 7):
     id        one of the 16 fixed ids (SPEC section 3)
     icon      one mnemonic emoji
     title     the claim, in plain words
     kind      journey | layers | metaphor | scale | family | contrast | culture | sound
     insight   the explanation (the payload); *asterisks* = bold
     items     ids from words.js
     examples  worked lines to read aloud
     drill     one thing to do in under a minute
     game      only on journey (sort), thermometer (scale), sounds (listen)
   Sources: research/lexical_patterns.md sections 1, 3, 4, 5, 6, 8 and 9;
   research/teaching_methods.md section 3; SPEC.md section 3.
   Origins marked "one possible story" are unverified (lexical_patterns.md
   section 4 Gaps and section 5): under the weather, full of beans, kidney,
   thigh, sneeze. Never present them as fact.
   ============================================================ */
window.PATTERNS = [

{
  id: "journey",
  icon: "🗺️",
  title: "One patient, nine stages",
  kind: "journey",
  insight: "These are not 43 separate medical words. They are one story that every patient goes through, in order: *cause* (a germ, an infection, an accident), *symptoms* (a temperature, a cough, aches), *where you go* (the chemist for advice, the GP for things that are not urgent, A and E for emergencies), *finding out* (an X-ray), *treatment* (a prescription, a painkiller, an injection, an operation), *effect* (a lower temperature, relief), *rehab* (physiotherapy), *outcome* (a bone heals, a person gets better, a serious case pulls through) and *prevention* (a vaccine, keeping in shape, not passing germs on). If you know which stage a word belongs to, you already know its job, and you know which words cannot swap with it. An X-ray never treats anything; a painkiller never finds anything out.",
  items: ["germ", "infection", "injure", "fracture", "fever", "cough", "chemist", "gp", "ae", "xray", "prescription", "painkiller", "injection", "operation", "lower", "relief", "physio", "heal", "getbetter", "pullthrough", "vaccine", "passon"],
  examples: [
    "Praew: cause (she *dislocated* her shoulder) → symptoms (*painful*, she *blacked out*) → A and E → an *X-ray* → a *painkiller* and a *sling* → *relief* → *physiotherapy* → the shoulder *heals* and she is *back on her feet*.",
    "Mali: cause (a *germ*, highly *infectious*) → symptoms (a *fever*, a *cough*, *exhaustion*) → the *chemist* → a *remedy* to *lower* her temperature → she *gets better* → next year, a flu *vaccine*.",
    "Two roads at stage 3: a sore throat goes to the chemist, a fever that lasts more than two days goes to the GP or clinic, a bone that might be broken goes to A and E."
  ],
  drill: "Say the nine stages aloud from memory (cause, symptoms, where you go, finding out, treatment, effect, rehab, outcome, prevention), then sort the twelve words below into them.",
  game: {
    kind: "sort",
    slots: ["1 Cause", "2 Symptoms", "3 Where you go", "4 Finding out", "5 Treatment", "6 Effect", "7 Rehab", "8 Outcome", "9 Prevention"],
    items: [
      { id: "germ", slot: 0 }, { id: "fracture", slot: 0 },
      { id: "cough", slot: 1 }, { id: "dizziness", slot: 1 },
      { id: "ae", slot: 2 },
      { id: "xray", slot: 3 },
      { id: "prescription", slot: 4 }, { id: "painkiller", slot: 4 },
      { id: "relief", slot: 5 },
      { id: "physio", slot: 6 },
      { id: "heal", slot: 7 },
      { id: "vaccine", slot: 8 }
    ],
    reveal: "The order is the order of the p.70 texts too: a germ or an accident, then symptoms, then the chemist, GP or A and E, then the X-ray, then treatment, then relief, then physiotherapy, then healing, and finally the vaccine that stops it happening again."
  }
},

{
  id: "layers",
  icon: "🧅",
  title: "The body in layers",
  kind: "layers",
  insight: "The sixteen body parts sit in four layers, and the layer tells you which injury verb goes with the word. On the *surface* are forehead, eyebrow, eyelid, eyelash, nail, chest, waist, hip, thigh, ankle and heel: things you can see and touch. Under them are *bones and joints*: the ribs, and the hip and ankle, which are joints as well as places. Deeper still are the *organs*: the lungs inside the rib cage, the liver on your right under the lowest ribs, and the kidneys at the back either side of the spine. Everywhere there is *tissue*: muscle. Now the verbs sort themselves. You *fracture* or *break* a bone, you *dislocate* a joint (the bone comes out of its socket, nothing breaks), and you *pull* or *strain* a muscle, which then feels *stiff*.",
  items: ["forehead", "eyebrow", "eyelid", "eyelash", "nail", "chest", "waist", "hip", "thigh", "ankle", "heel", "ribs", "lungs", "liver", "kidney", "muscle", "fracture", "dislocate", "stiff", "broken"],
  examples: [
    "Surface: a cut above the *eyebrow*, a broken *nail*, a sore *heel*. Bones and joints: a *fractured* rib, a *dislocated* hip, a twisted *ankle*. Organs: *lungs* that cough, a *liver* that cleans the blood, *kidneys* that make urine. Tissue: a pulled *muscle* in the *thigh*.",
    "The hip is in two layers at once: the area below your waist (surface) and the joint that connects your leg to your body (bone). Older people often fracture a hip in a fall; a dislocated hip is rare and needs a huge force.",
    "Wrong: *she fractured her muscle*, *she dislocated her thigh*. A muscle has no bone to break, and the thigh is not a joint: you dislocate a hip or a knee."
  ],
  drill: "Point to your own body and say one thing that can go wrong at each layer: skin (a cut), bone (a fracture), joint (a dislocation), organ (an infection), muscle (a pull). Four layers, five sentences, under a minute."
},

{
  id: "updown",
  icon: "↕️",
  title: "Healthy is up, ill is down",
  kind: "metaphor",
  insight: "Six of the idioms are one picture, not six. Lakoff and Johnson, who wrote the famous book on metaphor in 1980, showed that English treats *health as up* and *illness as down*, because a serious illness makes you lie down and a healthy person stands up. Their own example is *He came down with the flu*. So you come *down* with flu, you feel *under* the weather, and when you are well again you are *up* and about and back *on* your feet. Happy is up as well, which is why a thrilled person is on *top* of the world. Consciousness is up too: you wake *up*, and when you *black out* the lights go out and you fall down. Once you see the direction, the particle is no longer something to memorise: it is something you can predict.",
  items: ["comedownwith", "undertheweather", "backonfeet", "upandabout", "ontopofworld", "blackout"],
  examples: [
    "DOWN: Mali *came down with* flu; Praew felt *under the weather*; at match point she *blacked out* and hit the floor.",
    "UP: two days later Mali was *up and about*; after physio Praew was *back on her feet*; when she won game one she was *on top of the world*.",
    "The same metaphor outside this unit: my spirits *rose*, I am feeling *low*, he *fell* ill, she is *in top shape*."
  ],
  drill: "Read each of the six idioms aloud and point up or down with your hand before you say it. If you cannot decide the direction, you do not yet own the idiom."
},

{
  id: "thermometer",
  icon: "🌡️",
  title: "The idiom thermometer",
  kind: "scale",
  insight: "Put all twelve expressions on one thermometer and they stop being a list. At the top: *on top of the world*, *full of beans*, *the picture of health*, *in shape*. Then the slide down: *out of shape*, *under the weather*, *come down with* something, *on your last legs*, and at the bottom *black out*. Recovery climbs back up a second ladder: *pull through* (you survived something serious), *up and about* (out of bed), *back on your feet* (fully active again). Two traps catch most students. *On top of the world* is about *mood*: Cambridge defines it as *extremely happy*, so you can be on top of the world with a broken arm. And *out of shape* is about *fitness*, not illness: an unfit person is perfectly well, they just cannot run for the bus.",
  items: ["ontopofworld", "fullofbeans", "pictureofhealth", "keepinshape", "outofshape", "undertheweather", "comedownwith", "lastlegs", "blackout", "pullthrough", "upandabout", "backonfeet"],
  examples: [
    "Top of the scale: after the final Praew was *on top of the world* (happy), Mali was *full of beans* again (energy), and Yai at seventy is *the picture of health* (looks healthy).",
    "Bottom of the scale: Praew was *on her last legs* after three nights of helping Mali, and at the tournament she *blacked out* for a few seconds.",
    "Recovery ladder: Mali *pulled through* a night in hospital, was *up and about* two days later, and Praew was *back on her feet* in time for October.",
    "Trap check: *I am out of shape* means I need to exercise, not I need a doctor. *She is on top of the world* means she is delighted, not that she is fit."
  ],
  drill: "Tap each expression and put it where it belongs on the scale, top to bottom, then press Check. The two trap items are the ones most people get wrong.",
  game: {
    kind: "scale",
    slots: ["Extremely happy (mood)", "Full of energy", "Looks very healthy", "Fit", "Unfit (fitness, not illness)", "Slightly ill", "Starting an illness", "Exhausted / near collapse", "Unconscious", "Recovering: survived", "Recovering: out of bed", "Recovered: active again"],
    items: [
      { id: "ontopofworld", slot: 0 },
      { id: "fullofbeans", slot: 1 },
      { id: "pictureofhealth", slot: 2 },
      { id: "keepinshape", slot: 3 },
      { id: "outofshape", slot: 4 },
      { id: "undertheweather", slot: 5 },
      { id: "comedownwith", slot: 6 },
      { id: "lastlegs", slot: 7 },
      { id: "blackout", slot: 8 },
      { id: "pullthrough", slot: 9 },
      { id: "upandabout", slot: 10 },
      { id: "backonfeet", slot: 11 }
    ],
    reveal: "*Why the scale works:* English treats health as UP and illness as DOWN (Lakoff and Johnson, 1980), because illness makes us lie down and health lets us stand. That is why you come *down* with flu, feel *under* the weather, *black out* and fall, then get *up* and about and back *on* your feet. The two traps: *on top of the world* is a mood (extremely happy), not a health report, and *out of shape* is fitness (unfit), not illness."
  }
},

{
  id: "fuel",
  icon: "⛽",
  title: "Fuel, shape and journeys",
  kind: "metaphor",
  insight: "Five idioms that do not fit the up-and-down picture fit three other pictures. *Energy is fuel in a container*: a person *full of beans* has a tank full of energy. One possible story, from a single book published in 1955, is that horses fed on beans were lively, but nobody has proved it, so treat it as a memory hook, not a fact. *The body is an object with a proper shape*: you *keep in shape* by exercising, and if you stop you go *out of* shape, the way a machine goes *out of order*. *Life is a journey*: you *pull through* a crisis, getting through to the other side, and your legs, which carry you along the road, wear out until you are *on your last legs*. That last one is old: the phrase is recorded in the 1590s, when it meant near the end of life.",
  items: ["fullofbeans", "keepinshape", "outofshape", "pullthrough", "lastlegs"],
  examples: [
    "Fuel: Mali was *full of beans* at 6 a.m., bouncing on the bed, and empty by 9 p.m.",
    "Shape: Coach Nok runs at Benjakitti Park to *keep in shape*; after six weeks in a sling, Praew was badly *out of shape*.",
    "Journey: Mali *pulled through* her night in hospital; by Friday Praew was *on her last legs* and fell asleep over her homework.",
    "Grammar note: *pull through* takes no object (she pulled through), *keep in shape* can be keep, stay or get in shape, and *on your last legs* changes only the possessive (on my, her, their last legs)."
  ],
  drill: "Close your eyes and make one picture for each idiom: a horse full of beans, a sofa that has lost its shape, a rope pulled through a storm, an old table on its last legs. Then say each idiom in a sentence about someone you know."
},

{
  id: "ness",
  icon: "🧱",
  title: "-ness turns a feeling into a thing",
  kind: "family",
  insight: "Three nouns in this unit are built by one rule: adjective + *-ness* = noun. *Dizzy* becomes *dizziness* (the y turns into i, as in happy → happiness), *tired* becomes *tiredness*, *stiff* becomes *stiffness*. The rule works on most short adjectives: *ill* → *illness*, *fit* → *fitness*, *sick* → *sickness*, *weak* → *weakness*. The noun is useful when a symptom becomes a thing you list: a doctor writes *dizziness and tiredness* on a form, not *feeling dizzy and tired*. One warning: the adjective and the noun are not interchangeable in a sentence. *I feel dizzy* (adjective after feel) but *the dizziness lasted an hour* (noun as subject).",
  items: ["dizzy", "dizziness", "tiredness", "stiff", "stiffness", "exhaustion"],
  examples: [
    "Adjective → noun: dizzy → dizz*i*ness, tired → tiredness, stiff → stiffness, ill → illness, fit → fitness, sick → sickness.",
    "In a sentence: Mali felt *dizzy* (adjective); her *dizziness* worried Yai (noun). Praew's shoulder was *stiff*; the *stiffness* eased after physio.",
    "Spelling trap: y → i before -ness (dizziness, happiness), but tired keeps its d and stiff keeps both f's.",
    "Not -ness: *exhausted* goes to *exhaustion*, because it started life as a verb (exhaust), and verbs take -tion. See the next card."
  ],
  drill: "Thirty seconds: turn dizzy, tired, stiff, ill, fit and weak into nouns, out loud, spelling the y → i change when it happens."
},

{
  id: "tion",
  icon: "⚙️",
  title: "-tion turns an action into a thing",
  kind: "family",
  insight: "Five of the unit's nouns come from verbs with the suffix *-tion* (or *-sion*): *infect* → *infection*, *inject* → *injection*, *operate* → *operation*, *exhaust* → *exhaustion*, *prescribe* → *prescription*. The same rule gives you *vaccinate* → *vaccination* and *dislocate* → *dislocation*. Two things change on the way. A final *-e* drops (operate → operation), and the stress moves onto the syllable before -tion: OPerate but opeRAtion, VACcine but vacciNAtion. Thai speakers often stress the last syllable, so practise saying the stress jump out loud. Exam papers love this family: the B2 First word-formation part gives you the verb in capitals and expects the noun, spelled perfectly.",
  items: ["infection", "injection", "operation", "exhaustion", "prescription", "vaccine", "dislocate"],
  examples: [
    "Verb → noun: infect → infection, inject → injection, operate → operation, exhaust → exhaustion, prescribe → prescription, vaccinate → vaccination, dislocate → dislocation.",
    "In a sentence: the doctor *operated* on her knee → she had an *operation*; the nurse *injected* the vaccine → she had an *injection*.",
    "Stress jump: *OP-er-ate* → *op-er-A-tion*; *IN-ject* → *in-JEC-tion*; *VAC-cine* → *vac-cin-A-tion*. The stress always sits just before -tion.",
    "Exam frame: After the half marathon she collapsed from ______ (EXHAUST). Answer: exhaustion, with the t kept and the h silent."
  ],
  drill: "Verb in, noun out, against the clock: infect, inject, operate, exhaust, prescribe, vaccinate, dislocate. Seven nouns in twenty seconds, stress on the syllable before -tion."
},

{
  id: "spellchange",
  icon: "✏️",
  title: "The spelling changes exams love",
  kind: "family",
  insight: "Some word families change a letter in the middle, and those are exactly the ones examiners pick. *Prescribe* becomes *prescription*: the *b* turns into *p*, just as describe → description and subscribe → subscription. *Relieve* becomes *relief*: the *v* turns into *f*, just as believe → belief and prove → proof. *Exhaustion* keeps its *t* (not exhausion), and the *h* is silent. *Injure* gives *injury* and *injured*, and the negative is *uninjured*, which exams use because everybody expects the sentence to be bad news. One pair that looks like a family but is not: *heal* /hiːl/ and *health* /helθ/ share an ancient root meaning whole, but the dictionary treats *health* as the noun of *whole*, not of *heal*, so hear the vowel change as a sound note and never expect HEAL → health as a word-formation answer.",
  items: ["prescription", "relief", "relieve", "heal", "injury", "injure", "exhaustion"],
  examples: [
    "b → p: prescri*b*e → prescri*p*tion (describe → description, subscribe → subscription).",
    "v → f: relie*v*e → relie*f* (believe → belief, prove → proof). The verb is relieve, the noun is relief, the adjective is relieved.",
    "Keep the t: exhaus*t* → exhaus*t*ion. Keep the e: injur*e* → injur*y*, injur*e*d, *un*injured.",
    "Sound only: heal /hiːl/ and health /helθ/ have different vowels. Say both; do not write HEAL → health in a word-formation gap.",
    "Exam frames: A cold towel brought her some welcome ______ (RELIEVE) → relief. All the students were ______ (INJURE) when the bus skidded → uninjured."
  ],
  drill: "Spell each pair aloud, letter by letter, then type it: prescribe / prescription, relieve / relief, exhaust / exhaustion, injure / uninjured. Four pairs, one minute."
},

{
  id: "hurtinjure",
  icon: "🩹",
  title: "Hurt, injure, damage, wound",
  kind: "contrast",
  insight: "Thai เจ็บ covers both pain and harm, so these four English verbs feel like one word, but each has its own job. *Hurt* is about the pain: *my ankle hurts*, *did you hurt yourself?* *Injure* is harm to a part of the body in an accident: *she injured her knee playing badminton*, and the noun is *an injury*. *Damage* is most natural for things and for organs inside you: *damage to the lungs*, *liver damage*, a damaged phone. *Wound* is for weapons and attacks, is rather formal, and is usually passive: *soldiers were wounded*. Oxford puts it simply: injure emphasises the damage, hurt emphasises the pain. The exam trap is *wound* in a sports sentence, and the learner trap is using *injury* as a verb.",
  items: ["injure", "injury", "broken", "painful"],
  examples: [
    "Pain: *My shoulder hurts.* Harm in an accident: *She injured her shoulder diving for the shuttlecock.* Both are true at the same time.",
    "Organs and things: PM2.5 can *damage* your lungs; she *damaged* her phone when she fell. Not *injured her phone*.",
    "Weapons: *Two officers were wounded.* Wrong: *She wounded her ankle in PE.* Right: *She hurt / injured her ankle in PE.*",
    "Noun and verb: *I injured my knee* (verb), *a knee injury* (noun), *a painful injury* (adjective + noun). Never *I injury my knee*.",
    "Broken goes with the bone, not the person: *a broken wrist*, *a broken rib*; the person is *injured*."
  ],
  drill: "Fix three wrong sentences aloud: 1) She wounded her ankle at sports day. 2) I injury my finger on the door. 3) The smoke injured his lungs. (Answers: injured / hurt; injured; damaged.)"
},

{
  id: "ache",
  icon: "🤕",
  title: "Ache, pain, sore, painful",
  kind: "contrast",
  insight: "Four words for one feeling, each with its own grammar. *Ache* makes compounds with a body part: *headache*, *stomach ache*, *toothache*, *backache*, *earache*. Headache takes *a* (*I have got a headache*), and *ache* is also a verb: *my legs ache*, never *my legs are ache*. For other places you use the noun *pain* with *in*: *a pain in my chest*, *a sharp pain in my knee*. *Sore* goes before a part that hurts because of infection or overuse: *a sore throat*, *sore eyes*, *sore muscles*, never *a sick throat*. *Painful* describes the injury or the treatment, not the person: *a painful knee*, *a painful injection*. *My head is painful* is grammatical but sounds like a textbook; a real speaker says *I have got a headache* or *my head hurts*.",
  items: ["ache", "headache", "sore", "painful", "painkiller"],
  examples: [
    "Compounds: a headache, (a) stomach ache, toothache, backache, earache. Mali had *a headache* and *aches* all over.",
    "Verb: *My thighs ache after the warm-up.* Noun with in: *I have got a pain in my chest when I breathe.*",
    "Sore: *a sore throat*, *sore feet* after walking round Chatuchak all day, *sore muscles* the day after training.",
    "Painful: *a painful shoulder*, *a painful injection*; the person is *in pain* and takes *a painkiller*.",
    "Wrong, right: *a sick throat* → a sore throat; *my leg is ache* → my leg aches; *I am headache* → I have got a headache."
  ],
  drill: "Finish *I have got a ...* five ways in under a minute: a headache, a sore throat, a pain in my chest, a stiff neck, a painful knee. Then say one with a verb: my legs ache."
},

{
  id: "whofixes",
  icon: "🧑‍⚕️",
  title: "Who fixes what",
  kind: "contrast",
  insight: "Each recovery verb has its own subject, and once you match them the sentences write themselves. *Doctors treat patients* (and treat an injury or an illness): treating means giving care, whether or not it works. *Doctors and drugs cure a disease*: cure means the disease goes away. *Wounds and bones heal*: the body does it by itself, so *the cut healed*, never *the cut recovered*. *People recover* or *get better*: *she is getting better*, *he recovered from flu*. *Medicine lowers a temperature* and *brings relief*: the medicine is the subject, the symptom is the object. A *remedy* is something used to treat a minor illness, often a simple one: ginger tea, a ya dom inhaler, rest. Mix the subjects and English speakers notice at once: a cut cannot recover, and a patient cannot heal a doctor.",
  items: ["treat", "treatment", "heal", "getbetter", "relief", "lower", "remedy"],
  examples: [
    "Doctors: Dr Ploy *treated* Praew's shoulder; the *treatment* took six weeks. Khun Dao explained how to *treat* flu at home.",
    "Wounds and bones: the cut above her eyebrow *healed* in a week; a fractured rib *heals* in about six weeks.",
    "People: Mali *got better* without a prescription; Praew *recovered* in time for the final.",
    "Medicine: paracetamol *lowers* a temperature; a cold towel brought *relief*; ginger tea is Yai's favourite *remedy* for a sore throat.",
    "Wrong, right: *the cut recovered* → the cut healed; *the doctor cured my cut* → the doctor treated my cut; *I healed from flu* → I got better / I recovered from flu."
  ],
  drill: "Match five subjects to five verbs in under a minute: doctors / wounds / people / medicine / drugs → treat / heal / get better / lower / cure. Then say each pair in a sentence about Praew or Mali."
},

{
  id: "british",
  icon: "🇬🇧",
  title: "British health English",
  kind: "culture",
  insight: "Your textbook speaks British English, and so do IELTS and Cambridge examiners, so learn the British forms first and keep the American ones as labelled contrasts. *A and E* (Accident and Emergency) is the hospital emergency department; Americans say *the ER*. A *GP* (general practitioner) is the local family doctor you see first; Thailand has no GP system, so for you it is the clinic or outpatient doctor. *The chemist* or *the chemist's* is the shop and the person; *pharmacy* is also fine. To *have a temperature* means to have a fever: both are correct, so no exam will ever make you choose between them. The big one is *sick*: in British English *to be sick* means to vomit and *to feel sick* means to feel you are about to, while *to be ill* means unwell; *off sick* means away from school because you are ill. And *flu* and *the flu* are both fine in British English.",
  items: ["ae", "gp", "chemist", "sick", "temperature", "flu", "physio"],
  examples: [
    "British / American: A and E / the ER; a GP / a family doctor; the chemist's / the drugstore; physiotherapy / physical therapy; a flu jab / a flu shot; in hospital / in the hospital.",
    "Sick in Britain: *Mali was sick twice in the night* (she vomited). *I feel sick* (I think I am going to vomit). *Praew is off sick today* (away because she is ill). *I am ill* (unwell).",
    "Fever and temperature are twins: *She has got a temperature of 38.9* = *She has got a fever*. Doctors in Britain usually ask *Have you got a temperature?*",
    "Flu: *She has got flu* and *She has got the flu* are both British. But a cold is countable: *a cold*, never *cold* on its own, and *I am cold* means you need a jumper."
  ],
  drill: "Translate this American text message into British English in under a minute: *Mom took me to the ER, then our family doctor gave me a flu shot and I picked up some acetaminophen at the drugstore. I was sick all week.* (Watch that last sentence: in British English it means something different.)"
},

{
  id: "stories",
  icon: "📜",
  title: "Words with stories inside",
  kind: "culture",
  insight: "A word with a story is a word you cannot forget. *Muscle* comes from Latin *musculus*, little mouse: flex your biceps and watch the mouse run under the skin. *Vaccine* comes from Latin *vacca*, cow, because Edward Jenner protected people from smallpox with cowpox in the 1790s. *Influenza*, which gives us *flu*, is Italian for influence: people blamed the stars. *X-ray* was named by Röntgen in 1895 with the X that maths uses for an unknown, because he did not know what the rays were. *Fracture* shares a root with *fragile* and *fragment*: all of them break. *Lungs* and *relief* both go back to a word meaning light: lungs are the light organ (they float), and relief lifts a weight off you. *Injury* once meant not right, like *injustice*; *prescription* is written before; and a *symptom* is Greek for things that fall together. Two words whose origins nobody is sure of are *kidney* and *thigh*, so if you hear a story about those, call it one possible story.",
  items: ["muscle", "vaccine", "flu", "xray", "fracture", "lungs", "relief", "injury", "prescription", "symptom"],
  examples: [
    "muscle = little mouse (Latin musculus). vaccine = from the cow (Latin vacca, Jenner and cowpox). influenza = influence of the stars.",
    "X-ray = the unknown ray (Röntgen, 1895; X as in algebra). fracture = the breaking word, family of fragile, fragment and fraction.",
    "lungs = the light organ; relief = a lightening of the load. Both from one ancient root meaning light in weight.",
    "injury = not right (Latin in + ius, law, as in justice). prescription = written before (prae + scribere). symptom = things that fall together (Greek syn + piptein)."
  ],
  drill: "Pick one story and tell it to someone at home tonight in English, in three sentences. Teaching it once beats reading it five times."
},

{
  id: "particles",
  icon: "🧲",
  title: "Frozen idioms, moving particles",
  kind: "family",
  insight: "An idiom is stored in your brain as one long word, so nothing inside it can change: not the noun, not the particle, not the order. Only the grammar *around* it moves: *she is / was / has been feeling under the weather*. That is why exams test the particle: it is the one piece a learner is most likely to swap. The five errors on p.73 are the classic ones: keep *in* shape (not on), black *out* (not down), come *down with* (not up with, which means invent an idea), full *of* beans (not with), *under* the weather (not out of). Add *on* top of the world, *on* your last legs, pull *through* and back *on* your feet. Three frames cover the grammar: *be / feel / look* + idiom for the adjective ones; *come down with* + an illness; and *black out* and *pull through* take no object at all.",
  items: ["keepinshape", "blackout", "comedownwith", "fullofbeans", "undertheweather", "ontopofworld", "lastlegs", "pullthrough", "backonfeet", "outofshape", "pictureofhealth", "upandabout"],
  examples: [
    "The particles: keep *in* shape, black *out*, come *down with*, full *of* beans, *under* the weather, *on* top of the world, *on* your last legs, pull *through*, back *on* your feet, *out of* shape, *up and about*.",
    "Frames: *She looks the picture of health.* *I am feeling under the weather.* *He came down with flu.* *She blacked out.* *Yai pulled through.*",
    "Wrong, right: *came up with a cold* → came down with; *keep on shape* → keep in shape; *full with beans* → full of beans; *blacked down* → blacked out; *out of the weather* → under the weather.",
    "Only the grammar moves: *is coming down with*, *came down with*, *has come down with*; *keeps / kept / is keeping in shape*."
  ],
  drill: "Spot the wrong particle in five sentences, aloud, in under a minute: 1) She blacked down in the heat. 2) I am coming up with a cold. 3) He is full with beans today. 4) We keep on shape by swimming. 5) Yai feels out of the weather. (out, down with, of, in, under)"
},

{
  id: "sounds",
  icon: "🔊",
  title: "Silent letters and sound-alikes",
  kind: "sound",
  insight: "Eight of these words are spelled one way and said another, which is where IELTS Listening takes marks away. *Ache* is /eɪk/, with ch as k, and so is *chemist* /ˈkem.ɪst/. *Muscle* /ˈmʌs.əl/ has a silent c: never mus-kle. *Thigh* /θaɪ/ has a silent gh and the th that Thai speakers turn into t or s. *Cough* /kɒf/ turns gh into f. *Forehead* can be /ˈfɒr.ɪd/, which hides the head, or /ˈfɔː.hed/. Then the twins: *heel*, *heal* and *he'll* all sound /hiːl/, and *waist* sounds exactly like *waste*, so only spelling tells them apart. Last, say the final sounds that Thai drops: che*st*, ri*bs* /rɪbz/, lu*ngs* /lʌŋz/, and the final l in ank*le* and musc*le*.",
  items: ["ache", "muscle", "thigh", "chemist", "cough", "forehead", "heel", "waist", "chest", "ribs", "lungs", "ankle"],
  examples: [
    "ch = k: *ache* /eɪk/, *chemist* /ˈkem.ɪst/, *headache* /ˈhed.eɪk/. Not *atch* and not *shemist*.",
    "Silent letters: mus(c)le, thi(gh), exhaustion (h), forehead /ˈfɒr.ɪd/ (the h can vanish).",
    "gh = f: *cough* /kɒf/. Compare *tough* and *enough*; but *thigh* and *high* have no f at all.",
    "Twins: my *heel* hurts, the cut will *heal*, *he'll* be fine: all /hiːl/. The *waist* of a skirt, a *waste* of time: both /weɪst/.",
    "Finals: che*st* /tʃest/, ri*bs* /rɪbz/, lu*ngs* /lʌŋz/, ank*le* /ˈæŋ.kəl/. Say the last sound; Thai lets you drop it, English does not."
  ],
  drill: "Listen to Sonia say each word, then type what you heard. Spelling counts: a misspelled word in IELTS Listening scores zero.",
  game: {
    kind: "listen",
    items: ["ache", "muscle", "thigh", "chemist", "cough", "forehead", "heel", "waist"]
  }
},

{
  id: "thai",
  icon: "🐘",
  title: "Where Thai and English cut differently",
  kind: "culture",
  insight: "Most health mistakes Thai learners make are not vocabulary gaps; they are Thai sentences wearing English words. กินยา is literally eat medicine, but English *takes* medicine. ไม่สบาย comes out as *I am not comfortable*, but a British speaker says *I do not feel well* or *I am ill*. ปวดหัว is a state in Thai, so *I am headache* feels natural; English needs *I have got a headache* with the article. เป็นไข้ gives *I have fever*, but English says *I have got a fever* or *a temperature*. เป็นหวัด is the dangerous one: *I am cold* means you need a jumper; a cold is *I have got a cold*. เป็นลม is *black out* or *faint*, ฉีดยา is *have an injection* (the nurse gives it, you have it), and because Thailand has no GP system, when the book says *GP* think of the clinic doctor you see first, not the hospital.",
  items: ["sick", "fever", "temperature", "headache", "injection", "blackout", "gp", "chemist", "flu"],
  examples: [
    "กินยา → *take* medicine, *take* a painkiller. ไม่สบาย → *I do not feel well* / *I am ill* / *I am under the weather*.",
    "ปวดหัว → *I have got a headache*, *my head hurts*. เป็นไข้ → *I have got a fever* / *a temperature*. ไข้หวัดใหญ่ → *flu*, which is the illness; the fever is one of its symptoms.",
    "เป็นหวัด → *I have got a cold* (not *I am cold*). เจ็บคอ → *I have got a sore throat* (not *I hurt my throat*). เวียนหัว → *I feel dizzy*.",
    "เป็นลม → *she blacked out* / *she fainted*. ฉีดยา → *I had an injection*, *the nurse gave me an injection*.",
    "Places: ร้านขายยา → *the chemist's*; คลินิก → the clinic doctor is your *GP*; ห้องฉุกเฉิน → *A and E*, and the emergency number is 1669, not 999."
  ],
  drill: "Say each Thai phrase in natural English in under a minute: กินยา, ไม่สบาย, ปวดหัว, เป็นไข้, เป็นหวัด, เป็นลม, ฉีดยา. Then check two things only: did you use take, and is every noun wearing its article?"
}

];
