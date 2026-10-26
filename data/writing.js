/* Back on Your Feet — writing.js (W5)
   Five Writing Clinic missions (SPEC §6) plus the error-flag list (SPEC §4).
   The error flags below are teacher-experience predictions of Thai-learner errors (UNVERIFIED — not corpus
   findings; see research/lexical_patterns.md §9, which found no published item-by-item Thai study).
   T.Chris confirms or edits them before launch. Every flag is worded "Check:" because some patterns are
   correct in other sentences (e.g. "not comfortable with", "I'm cold" meaning low temperature).
   How the engine uses this file (app.js analyse): target items are detected with ROLEPLAY.MATCH; linkers are
   matched as whole words (case-insensitive); each grammarRx is a regex ticked when found; each errorFlag rx
   runs with the i flag. Strings are double-quoted; every backslash inside a regex is doubled.
   Collocation frames (take medicine, have an injection / X-ray / operation, a sore throat, come down with,
   pass on to, treat for) follow research/lexical_patterns.md §7 (Oxford and Cambridge entries). */
window.WRITING = {
  missions: [
    { id: "W1",
      title: "Message your teacher: you can't come to class",
      type: "Short message (Line)",
      brief: "You are Praew. It is Monday morning and you have woken up with flu. Write a short Line message to your form teacher, Khru Wan, to say you can't come to school today. Say what is wrong with you, how you feel, and what you will do about the work you miss.",
      model: "Good morning, Khru Wan. I can't come to school today because I've come down with flu. I've had a temperature since last night, with a headache, a sore throat and aches all over. I also feel sick and dizzy, so I must stay in bed. I'll get the homework from Nim and catch up as soon as I'm better. Praew",
      min: 40, max: 60,
      mustUse: ["fever", "temperature", "headache", "sore", "ache", "sick", "dizzy", "cough"],
      linkers: ["because", "so", "as soon as", "also", "unfortunately"],
      grammar: "present perfect for news that matters now: I've come down with …, I've had … since …",
      grammarRx: [
        { label: "present perfect: I've come down with / I've had … since", rx: "\\b(i['’]ve|i have|she['’]s|she has|he['’]s|he has)\\s+(come|been|had|caught|got)\\b" },
        { label: "a reason with because / so", rx: "\\b(because|so)\\b" },
        { label: "a promise with will / 'll", rx: "\\b(i['’]ll|i will|we['’]ll|we will)\\s+\\w+" }
      ] },

    { id: "W2",
      title: "What happened at sports day?",
      type: "Accident account (diary or blog post)",
      brief: "You are Praew, writing in your training diary a week after sports day. Tell the story of your accident in the relay race: what you were doing, how you fell, what A and E did, and how you went home. End with one sentence about what would have been different if you had done one thing differently.",
      model: "On sports day I was running the last leg of the relay. At the final bend I slipped on the wet track, fell on my shoulder and hit my head. I blacked out for a few seconds, and the shoulder was so painful that I couldn't move my arm. Coach Nok called 1669 and an ambulance took me to A and E. Dr Ploy sent me for an X-ray, which showed a dislocated shoulder but, luckily, nothing broken. I went home in a sling, the only girl injured all day. If I had worn my spikes, I wouldn't have slipped.",
      min: 80, max: 100,
      mustUse: ["injure", "dislocate", "painful", "ae", "xray", "broken", "blackout", "sling"],
      linkers: ["First", "Then", "After that", "Luckily", "In the end", "because", "when"],
      grammar: "past simple for the events, past continuous for the background, and one third conditional at the end",
      grammarRx: [
        { label: "past continuous for the background: I was running …", rx: "\\b(i|she|he|we|they)\\s+(was|were)\\s+\\w+ing\\b" },
        { label: "past simple events: slipped, fell, took, sent", rx: "\\b(slipped|fell|landed|hit|took|sent|went|called|showed|checked|put)\\b" },
        { label: "a third conditional: If I had …, I wouldn't have …", rx: "\\bif\\s+\\w+\\s+(had|hadn['’]t)\\s+\\w+.*\\b(would|wouldn['’]t|could|couldn['’]t|might)\\s+have\\b" }
      ] },

    { id: "W3",
      title: "Make a chemist's leaflet: Beat the flu",
      type: "Advice leaflet",
      brief: "Khun Dao's pharmacy wants a short English leaflet for the rainy season, and she has asked you, Praew, to write it. Tell customers how to treat flu at home, how to stop passing it on, and when they must see a doctor. Use imperatives, and at least one sentence with unless, in case or as long as.",
      model: "Beat the flu. Flu is highly infectious, so cover your cough and wash your hands in case you pass the germs on. Stay at home, rest, drink plenty of water and take paracetamol to lower your temperature. You don't need a prescription: our chemist has remedies that treat aches and sore throats. You should get better within a week, but see a GP unless the fever has gone by day two. Book your flu vaccine before the season starts.",
      min: 60, max: 80,
      mustUse: ["flu", "infectious", "passon", "germ", "vaccine", "remedy", "lower", "getbetter", "gp"],
      linkers: ["unless", "in case", "as long as", "If", "so", "Remember"],
      grammar: "imperatives (Stay at home, Wash your hands) plus unless / in case / as long as",
      grammarRx: [
        { label: "imperatives: Stay, Wash, Cover, Drink, Take, See, Book", rx: "(^|[.!?]\\s+)(stay|wash|cover|drink|take|see|rest|book|keep|don['’]t|do not|avoid|ask|call)\\b" },
        { label: "unless / in case / as long as / provided", rx: "\\b(unless|in case|as long as|provided)\\b" },
        { label: "a reason or result with so / because", rx: "\\b(so|because)\\b" }
      ] },

    { id: "W4",
      title: "Describe a time you were ill",
      type: "IELTS Speaking Part 2 answer, written out",
      brief: "IELTS Speaking Part 2: Describe a time when you were ill. Say what was wrong, what you did about it, how long it lasted and how you felt afterwards. You are Praew, telling the examiner about the September week when you caught Mali's flu while your shoulder was still healing. Write it as you would say it, in full sentences. Use at least two health idioms and one sentence with I wish I had …",
      model: "I'd like to talk about when I came down with flu last September, while my shoulder was still in a sling. It started on a Monday: I felt a bit under the weather at school, and by evening I had a temperature of 39 and a terrible headache. My mother took me to the chemist's, who said I didn't need a prescription and gave me a remedy for the aches. For three days I did nothing but sleep, and the tiredness turned into real exhaustion. I was ill for almost a week before I got better, and I missed two physio sessions. I wish I had had the flu vaccine in May, because the whole thing could have been avoided.",
      min: 100, max: 120,
      mustUse: ["flu", "temperature", "headache", "exhaustion", "chemist", "getbetter", "undertheweather", "comedownwith"],
      linkers: ["At first", "Then", "After that", "Finally", "Looking back", "because", "before"],
      grammar: "past tenses to tell the story (past simple, past continuous, past perfect) and I wish I had … for the regret",
      grammarRx: [
        { label: "I wish I had … / If only I had …", rx: "\\b(i|she|he|we)\\s+wish(ed)?\\s+(i|she|he|we|they)\\s+(had|hadn['’]t)\\b|\\bif only\\s+(i|she|he|we|they)\\s+(had|hadn['’]t)\\b" },
        { label: "past simple story verbs: came, felt, took, missed", rx: "\\b(came|felt|took|went|missed|stayed|gave|had|got|started)\\b" },
        { label: "a past perfect or a third conditional result (had been / could have)", rx: "\\b(had\\s+(been|had|gone|taken|seen|done)|could\\s+have|would\\s+have|might\\s+have)\\b" }
      ] },

    { id: "W5",
      title: "For and against: Schools should make every student do sport every day",
      type: "For-and-against essay, one body paragraph",
      brief: "Your English teacher has set the essay title 'Schools should make every student do sport every day'. Write ONE body paragraph that gives arguments for and against. Use the health words you know in neutral, formal register: essays avoid idioms, so write became ill, not came down with. Open and link your points with the Writing-bank linkers from page 79.",
      model: "On the one hand, there are arguments for daily sport. Firstly, regular exercise keeps the heart and lungs healthy and lowers the risk of illness, which means fewer visits to a GP and less money spent on treatment. In addition, active students sleep better and cope more easily with stress. On the other hand, daily sport is not without problems. Injuries such as a dislocated shoulder or a fractured ankle can take months of physiotherapy to heal. What is more, crowded changing rooms allow germs to spread, so an infectious illness such as flu is quickly passed on to the whole class. To sum up, daily sport is beneficial as long as schools also invest in safety and hygiene.",
      min: 100, max: 120,
      mustUse: ["lower", "gp", "treatment", "physio", "heal", "germ", "infectious", "passon"],
      linkers: ["Firstly", "Secondly", "On the one hand", "On the other hand", "In addition", "What is more", "Furthermore", "However", "In contrast", "As a result", "In my opinion", "To sum up", "In conclusion"],
      grammar: "neutral register, no idioms; p.79 Writing-bank linkers to open, add, contrast and conclude",
      grammarRx: [
        { label: "opens with a sequencing or contrast linker (On the one hand / Firstly)", rx: "^\\s*(on the one hand|firstly|first of all|to begin with|first)\\b" },
        { label: "adds an argument: in addition / what is more / furthermore / not only", rx: "\\b(in addition|what is more|furthermore|moreover|not only)\\b" },
        { label: "a contrast: on the other hand / however / in contrast", rx: "\\b(on the other hand|however|in contrast|nevertheless|despite|in spite of)\\b" },
        { label: "a conclusion: to sum up / in conclusion / all in all", rx: "\\b(to sum up|in conclusion|all in all|overall)\\b" }
      ] }
  ],

  /* UNVERIFIED teacher-experience predictions (SPEC §4 table + lexical_patterns.md §9). Regexes run with the i flag.
     Each one is written so that it does not fire on the five model answers above (tested in writers/w5/test.js). */
  errorFlags: [
    { rx: "\\b(eat|eats|ate|eating|eaten)\\s+(the\\s+|some\\s+|my\\s+|her\\s+|his\\s+|your\\s+|a\\s+|any\\s+|this\\s+)?(medicines?|medication|paracetamol|antibiotics?|tablets?|pills?)\\b",
      says: "Check: eat medicine", fix: "In English you take medicine (Thai กินยา is 'eat', English is 'take'): I took some medicine." },
    { rx: "\\b(eat|eats|ate|eating|eaten)\\s+(the\\s+|some\\s+|my\\s+|a\\s+|two\\s+|any\\s+)?pain-?\\s?killers?\\b",
      says: "Check: eat painkillers", fix: "take a painkiller / take painkillers: The doctor told me to take painkillers." },
    { rx: "\\b(i['’]?m|i am|she['’]?s|she is|he['’]?s|he is|feel|feels|felt|feeling|was|were)\\s+not\\s+(very\\s+|so\\s+|really\\s+)?comfortable\\b(?!\\s+(with|about|in|talking|doing))",
      says: "Check: I'm not comfortable", fix: "ไม่สบาย = I don't feel well / I'm not well / I'm ill. (Not comfortable is about chairs and situations.)" },
    { rx: "\\b(i['’]?m|i am|she['’]?s|she is|he['’]?s|he is|was|were|are|you['’]?re|they['’]?re|they are)\\s+(a\\s+)?(headache|stomach-?\\s?ache|toothache|backache|earache)\\b",
      says: "Check: I'm headache", fix: "I've got a headache / I have a headache. A headache is a thing you have, not a thing you are." },
    { rx: "\\b(my|her|his|your|the)\\s+head\\s+(is|was|feels|felt|gets|got)\\s+(very\\s+|so\\s+|really\\s+)?(painful|pain|hurt)\\b",
      says: "Check: my head is painful", fix: "I've got a headache / My head hurts / My head aches." },
    { rx: "\\b(i['’]?m|i am|she['’]?s|she is|he['’]?s|he is|was|were|are|you['’]?re)\\s+(a\\s+|high\\s+)?fever\\b",
      says: "Check: I am fever", fix: "I've got a fever / I've got a temperature (a thing you have, not a thing you are)." },
    { rx: "\\b(have|has|had|got|get|getting)\\s+(high\\s+|slight\\s+|bad\\s+|little\\s+|very\\s+high\\s+)?fever\\b",
      says: "Check: I have fever", fix: "I've got a fever / a high fever / a temperature. Fever needs an article here." },
    { rx: "\\b(have|has|had|got|get|getting)\\s+(bad\\s+|terrible\\s+|slight\\s+|high\\s+|dry\\s+|sore\\s+)?(headache|temperature|cough|sore throat|stomach-?\\s?ache)\\b",
      says: "Check: I have headache", fix: "I've got a headache / a temperature / a cough / a sore throat. Thai has no articles; English needs a here." },
    { rx: "\\b(is|are|was|were|feels?|felt)\\s+(very\\s+|so\\s+|really\\s+|still\\s+)?ache\\b",
      says: "Check: my leg is ache", fix: "my leg aches / my leg hurts / my leg is aching. Ache is a verb or a noun, never an adjective." },
    { rx: "\\b(sick|ill|hurt|injured)\\s+throat\\b",
      says: "Check: a sick throat", fix: "a sore throat: I've got a sore throat. (Sore goes with throat, eyes and muscles.)" },
    { rx: "\\b(i|she|he|we|they|you|i['’]?m|she['’]?s|he['’]?s|we['’]?re|they['’]?re|you['’]?re|am|is|are)\\s+(sick|ill)\\s+(since|for)\\b",
      says: "Check: I sick since Monday", fix: "I've been ill since Monday / I've been ill for three days (present perfect, and British English prefers ill for unwell)." },
    { rx: "\\binjury\\s+(my|her|his|your|our|their|the)\\s+\\w+",
      says: "Check: I injury my knee", fix: "I injured my knee (injure is the verb; injury is the noun: a knee injury)." },
    { rx: "\\b(am|is|are|was|were|got|get|gets)\\s+(an?\\s+)?injury\\b",
      says: "Check: I was injury", fix: "I was injured / I had an injury / I injured myself." },
    { rx: "\\b(come|comes|came|coming)\\s+up\\s+with\\s+(a\\s+|an\\s+|the\\s+|some\\s+)?(cold|flu|fever|virus|infection|cough|bug|temperature|illness|headache|sore throat)\\b",
      says: "Check: came up with a cold", fix: "came down with a cold (come down with = start to be ill; come up with = think of an idea)." },
    { rx: "\\b(keep|keeps|kept|keeping|stay|stays|stayed|staying|get|gets|got|getting)\\s+(on|at|in the|into the|with)\\s+shape\\b",
      says: "Check: keep on shape", fix: "keep in shape / stay in shape / get in shape." },
    { rx: "\\bfull\\s+(with|in|on|from)\\s+beans\\b",
      says: "Check: full with beans", fix: "full of beans (= lively, with lots of energy)." },
    { rx: "\\bblack(s|ed|ing)?\\s+(down|off|up|away|over)\\b",
      says: "Check: blacked down", fix: "blacked out (= lost consciousness for a short time): I blacked out for a few seconds." },
    { rx: "\\b(out of|below|down with|in|on)\\s+the\\s+weather\\b",
      says: "Check: out of the weather", fix: "under the weather (= slightly ill): I'm feeling a bit under the weather." },
    { rx: "\\b(my|her|his|your|our|their|left|right)\\s+(heal|waste)s?\\b",
      says: "Check: my heal / my waste", fix: "heel (the back of your foot) and waist (the middle of your body). Heal is a verb, waste is rubbish." },
    { rx: "\\b(cut|wound|bone|bones|bruise|scar|fracture|blister)s?\\s+(has\\s+|have\\s+|had\\s+|is\\s+|was\\s+|finally\\s+|slowly\\s+|completely\\s+)?recover(s|ed|ing)?\\b",
      says: "Check: the cut recovered", fix: "the cut healed / the bone healed. People recover; cuts, wounds and bones heal." },
    { rx: "\\bcur(e|es|ed|ing)\\s+(my|her|his|your|our|their|the)\\s+(cut|wound|shoulder|injury|knee|ankle|arm|leg|fracture|finger|back)\\b",
      says: "Check: the doctor cured my cut", fix: "the doctor treated my cut. Doctors treat patients and injuries; medicine cures a disease; a cut heals." },
    { rx: "\\b(finger|cut|wound|toe|knee|hand|arm|leg|foot|ankle|eye|ear|skin|scratch|blister|heel)s?\\s+(is|was|are|were|got|gets|get|became|become|looks|looked)\\s+(very\\s+|really\\s+|quite\\s+|a bit\\s+)?infectious\\b",
      says: "Check: my finger is infectious", fix: "my finger is infected (infected = has an infection; infectious = can be passed to other people: flu is infectious)." },
    { rx: "\\b(i['’]?m|i am|she['’]?s|she is|he['’]?s|he is)\\s+(a\\s+)?cold\\b",
      says: "Check: I am cold", fix: "I'm cold means you feel cold. For เป็นหวัด say I've got a cold / I've caught a cold." },
    { rx: "\\b(have|has|had|having)\\s+(very\\s+|so\\s+|really\\s+|a bit\\s+)?(dizzy|stiff|sore|tired|sick)\\b",
      says: "Check: I have dizzy", fix: "I feel dizzy / I feel sick / I'm stiff. These are adjectives: use feel or be, not have." },
    { rx: "\\b(do|did|does|doing|done|make|made|making)\\s+(an?\\s+|the\\s+|my\\s+)?(injection|x-?\\s?ray|operation)\\b",
      says: "Check: do an injection", fix: "have an injection / have an X-ray / have an operation. The nurse gives you an injection." },
    { rx: "\\b(go|goes|went|going|take|took|taken|taking)\\s+(\\w+\\s+)?to\\s+(chemist|doctor|clinic|pharmacy|dentist)\\b",
      says: "Check: went to doctor", fix: "went to the doctor / went to the chemist's / went to the clinic. (Go to hospital, with no the, is correct British English.)" }
  ]
};
