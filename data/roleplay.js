/* Back on Your Feet — roleplay.js (W5)
   MATCH: one regex string per id for all 80 items. The engine wraps each one as \b(?:…)\b with the i flag
   (same method as the MU5Vocab roleplay), so write only the alternatives, inflections included.
   SCENE: the cumulative final boss, "The Comeback Interview" (SPEC §6). Mikii plays Praew; Coach Nok and
   Khun Fern (the physiotherapist) take turns. Turns 1–7 are questions, turn 8 is the coach's verdict.
   nudges[4] fire when an answer uses no target item; the engine names the nudge after the current speaker,
   so nudges 0 and 2 are in Coach Nok's voice and nudges 1 and 3 in Khun Fern's.
   T.Chris can edit any text here. Keep double quotes and double every backslash inside a regex string. */
window.ROLEPLAY = {
  MATCH: {
    /* body */
    ankle: "ankles?",
    chest: "chests?",
    eyebrow: "eye-?brows?",
    eyelash: "eye-?lash(es)?",
    eyelid: "eye-?lids?",
    forehead: "foreheads?",
    heel: "heels?",
    hip: "hips?",
    kidney: "kidneys?",
    liver: "livers?",
    lungs: "lungs?",
    muscle: "muscles?|muscular",
    nail: "nails?|finger-?nails?|toe-?nails?",
    ribs: "ribs?|rib-?cage",
    thigh: "thighs?",
    waist: "waists?",
    /* injury */
    injure: "injur(e|es|ed|ing)|uninjured",
    injury: "injur(y|ies)",
    broken: "broken|broke|break(s|ing)? (a |an |my |her |his |your |their |the |some |any )?(bones?|arms?|legs?|wrists?|ankles?|fingers?|toes?|ribs?|collarbone|nose|hip|elbow)",
    fracture: "fractur(e|es|ed|ing)",
    dislocate: "dislocat(e|es|ed|ing|ion|ions)",
    painful: "painful(ly)?",
    ae: "a ?and ?e|a ?& ?e|accident and emergency|emergency (department|room|unit)",
    xray: "x[- ]?ray(s|ed|ing)?",
    operation: "operations?|operat(e|es|ed|ing)",
    /* symptoms */
    symptom: "symptoms?",
    fever: "fevers?|feverish",
    temperature: "temperatures?",
    ache: "ache(s|d)?|aching",
    headache: "head ?aches?",
    cough: "cough(s|ed|ing)?",
    sneeze: "sneez(e|es|ed|ing)",
    sore: "sore(ness)?",
    sick: "sick(ness)?",
    dizzy: "dizz(y|ier|iest|ily)",
    dizziness: "dizziness",
    tiredness: "tiredness",
    exhaustion: "exhaustion",
    stiff: "stiff(er|est|ly)?",
    stiffness: "stiffness",
    /* germs */
    flu: "flu|influenza",
    germ: "germs?",
    infection: "infections?",
    infectious: "infectious",
    passon: "pass(es|ed|ing)? (\\w+ )?(\\w+ )?on",
    injection: "injections?|inject(s|ed|ing)?|jabs?",
    vaccine: "vaccines?|vaccinat(e|es|ed|ing|ion|ions)",
    /* care */
    gp: "gps?|general practitioners?",
    chemist: "chemists?",
    prescription: "prescriptions?|prescrib(e|es|ed|ing)",
    painkiller: "pain-? ?kill(er|ers|ing)",
    relief: "relief",
    remedy: "remed(y|ies)",
    treat: "treat(s|ed|ing)?",
    treatment: "treatments?",
    lower: "lower(s|ed|ing)?",
    heal: "heal(s|ed|ing)?",
    getbetter: "(get|gets|got|getting|gotten) (\\w+ )?better",
    physio: "physios?|physiotherap(y|ist|ists)",
    /* idioms and phrasal verbs */
    backonfeet: "back on (my|your|his|her|their|our|its) feet",
    blackout: "black(s|ed|ing)? out|blackouts?",
    comedownwith: "com(e|es|ing) down with|came down with",
    fullofbeans: "full of beans",
    keepinshape: "in (good |great |top |decent )?shape",
    ontopofworld: "on top of the world",
    lastlegs: "on (my|your|his|her|their|our|its) last legs",
    outofshape: "out of shape",
    pullthrough: "pull(s|ed|ing)? (\\w+ )?through",
    pictureofhealth: "(the )?picture of health",
    undertheweather: "under the weather",
    /* bonus */
    upandabout: "up and about",
    sling: "slings?",
    cope: "cop(e|es|ed|ing)",
    fromscratch: "from scratch",
    lethal: "lethal(ly)?",
    pickup: "pick(s|ed|ing)? up(?! (the |my |her |his |your |our |their |a )?(phone|bag|ball|pen|shuttlecock|racket|racquet|kids|children|speed|pace|pieces|me|her|him|us|them|you)\\b)",
    suspect: "suspect",
    relieve: "reliev(e|es|ed|ing)",
    sideeffect: "side[- ]?effects?",
    property: "propert(y|ies)"
  },

  SCENE: {
    title: "The Comeback Interview",
    sub: "Cumulative final boss · use as many of the 70 items as you can",
    brief: "The inter-school badminton final is on Saturday. Coach Nok and Khun Fern, the physiotherapist, have to decide whether Praew is fit to play. You are Praew. Answer each question in two or three sentences, using the health vocabulary you have studied: the injury, the hospital, the treatment, how you feel and how you will stay healthy. Target: 15 different items.",
    target: 15,
    speakers: { them: "Coach Nok" },
    turns: [
      { who: "Coach Nok",
        text: "Praew, sit down. The final is on Saturday, and Khun Fern and I have to decide whether you play. Start at the beginning: tell us exactly what happened at match point in August, and what you felt in that first minute." },
      { who: "Khun Fern",
        text: "Thank you. Now the hospital. When the ambulance got you to A and E, what did Dr Ploy check, what did the pictures show, and what did she do about the shoulder?" },
      { who: "Coach Nok",
        text: "And after that? Tell us how the treatment and the physio sessions went: what was hard at the start, and what changed from week to week." },
      { who: "Khun Fern",
        text: "Be honest with me, because I will know. How does the shoulder feel today, and how does the rest of you feel after all those weeks away from training?" },
      { who: "Coach Nok",
        text: "Here is the question that matters most. If the shoulder starts to hurt in the middle of the final, what will you do? I want a plan, not a promise." },
      { who: "Khun Fern",
        text: "Looking back at that August morning, what do you wish you had done differently? And if you had done it, how would things have been different?" },
      { who: "Coach Nok",
        text: "Last one. Between now and Saturday, and for the rest of the season, how are you going to keep in shape and stay healthy, with half the school sneezing? Then tell me, in one sentence, why you are ready." },
      { who: "Coach Nok",
        text: "Khun Fern is nodding, and so am I. You have thought about this like an athlete, not a patient. Warm up properly on Saturday, every part of you, and I will see you on court." }
    ],
    nudges: [
      "That tells me very little, Praew. Use the words Dr Ploy and Khun Fern used with you: the injury, the symptoms, the treatment. Give us two or three full sentences.",
      "I need the proper words for your physio notes: name the part of the body, the problem and what was done about it. Try that answer again.",
      "Hmm. A champion can explain her own body. Say it again with the health vocabulary you have been learning, and give me some detail.",
      "Take a breath and try once more. Tell me how it feels, what you did about it and what you will do next, using the words from your recovery."
    ]
  }
};
