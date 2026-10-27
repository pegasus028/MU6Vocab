/* ============================================================
   BACK ON YOUR FEET — the story (W2)
   5 chapters, 12 illustrated page-turn pages, all 80 items tagged.
   Markup: {{id|surface form}}  ->  tappable study word
   img    : illustration for the page (art/ folder). Empty until the
            Gemini art run; the coloured emoji panel is used instead.
   alt    : description of the intended picture for screen readers.
   tint   : warm | cool | bright — emoji-panel colour and image fallback.
   prompt : the Gemini illustration prompt (see docs/SOURCE-Praew-Art-Brief.md).
   grammar: the Unit 6 structure the page models, with the modelling sentence.
   Facts: SPEC.md §5 and research/thai_contexts.md (1669, "My Quality Pharmacy",
   ya dom = menthol/camphor/borneol, Fah Talai Jone cautions, ORS vs sports
   drinks, willow bark -> aspirin: Edward Stone 1763, Bayer 1897, flu jab
   May–Aug before the rainy-season peak, Ratchanok Intanon: world champion at
   18 in 2013, recovering from a knee injury in 2026 — named only).
   No doses anywhere. British English throughout.
   ============================================================ */
window.STORY = {
  title: "Back on Her Feet",
  blurb: "One dislocated shoulder, one little sister with flu, one grandmother with a cabinet full of remedies, and one badminton final. Tap any gold word to study it.",
  chapters: [
    {
      n: 1,
      title: "The Picture of Health",
      subtitle: "August, Benjakitti Park",
      pages: [
        {
          art: "🏸", tint: "bright",
          img: "art/ch1p1.webp",
          alt: "Praew and three teammates in plain team kit stretching in a line on the Benjakitti Park skywalk at dawn, Coach Nok with a whistle demonstrating a hip stretch, grey rainy-season sky, Praew turned to chat to a friend instead of stretching.",
          prompt: "Dawn on the elevated skywalk in Benjakitti Forest Park, Bangkok, under a grey rainy-season sky with wet green wetlands below. Coach Nok, a fit Thai woman in her thirties with short black hair, a plain navy tracksuit and a whistle, stands at the front demonstrating a stretch with her hands on her hips. Four schoolgirls in plain white sports shirts and navy shorts (no crest, no logos) stretch in a line. Praew, thirteen, with a long black plait tied with a red ribbon, is at the end of the line, half-turned to chat to the girl beside her instead of stretching. Warm, clean, modern picture-book style. No readable text or logos anywhere.",
          grammar: "Zero conditional: *If you don't warm up, your muscles get stiff.*",
          text: "Benjakitti Park, seven in the morning, rainy season. The sky was the colour of a wet sock, but Coach Nok was {{fullofbeans|full of beans}}, as usual. \"Warm-up, ladies! You want to be {{pictureofhealth|the picture of health}} at the tournament, not the picture of a sad noodle!\"\n\nWe stretched in a line on the skywalk. Hands on your {{hip|hips}}, bend from the {{waist|waist}}, feel it in the back of each {{thigh|thigh}}. Then circle every {{ankle|ankle}} and press each {{heel|heel}} into the ground. Coach says this is how you {{keepinshape|keep in shape}} all season, and she says it every single morning: if you don't warm up, your {{muscle|muscles}} get stiff, and stiff muscles tear more easily.\n\nI did my legs properly. I did not do my shoulders. I was too busy telling Bua about the drama I watched last night, and the shoulder part is boring. This is called foreshadowing. My English teacher would be proud. My shoulder would not."
        },
        {
          art: "💥", tint: "cool",
          img: "art/ch1p2.webp",
          alt: "A badminton court in a school gym: Praew mid-dive towards a shuttle near the net, her doubles partner Bua behind her with her hand to her mouth, the opposing pair in a different plain kit on the far side, a scoreboard with blank squares.",
          prompt: "Indoor badminton court in a Bangkok school gym, bright overhead lights, green court. Praew, thirteen, long black plait with a red ribbon, plain white sports shirt and navy shorts, is frozen mid-dive, stretched out horizontally towards a shuttlecock just over the net, racket extended, one shoulder about to touch the floor. Behind her, her doubles partner Bua (same kit, short bobbed hair, slightly taller) has a hand over her mouth. On the far side of the net two opposing girls in plain pale-blue kit watch. A simple scoreboard on the wall shows blank squares. Dynamic but not violent; no injury shown; no blood. Warm, clean, modern picture-book style. No readable text, numbers or logos.",
          grammar: "First conditional: *If I win this point, we'll be in the final.*",
          text: "The semi-final was against a school from Nonthaburi. We play doubles, Bua and I, and this was the year we were finally going to win something. In game one I filled my {{lungs|lungs}} with air before every serve, and my {{chest|chest}} went up and down like a cartoon. We won it. I was {{ontopofworld|on top of the world}}.\n\nMatch point. I remember thinking: if I win this point, we'll be in the final. The shuttle dropped near the net, I dived like a superhero, and my shoulder hit the floor first. My {{forehead|forehead}} hit the floor second. Then I heard a sound I will never forget, and I broke a {{nail|nail}} as a bonus.\n\nEverything went grey and I {{blackout|blacked out}} for a few seconds. When the lights came back, Coach was saying, \"Don't move, Praew. You might have {{injure|injured}} your neck.\" I had not. I had managed to {{dislocate|dislocate}} my shoulder instead."
        }
      ]
    },
    {
      n: 2,
      title: "A and E",
      subtitle: "The same afternoon",
      pages: [
        {
          art: "🚑", tint: "cool",
          img: "art/ch2p1.webp",
          alt: "Praew sitting on the gym floor holding her arm awkwardly, Coach Nok kneeling in front of her checking her eyes with a small torch, Bua behind them on a phone; through the open gym doors a white ambulance with a blank side panel.",
          prompt: "Inside the same school gym, by the open double doors. Praew, thirteen, long black plait with a red ribbon, plain white sports shirt and navy shorts, sits on the floor looking pale and tearful, cradling her right arm against her body in an awkward position. Coach Nok (Thai woman in her thirties, short black hair, plain navy tracksuit, whistle) kneels in front of her, gently lifting Praew's chin and looking into her eyes with a small pen torch. Bua (short bobbed hair, same kit) stands behind holding a phone to her ear. Through the doors, a white ambulance with a plain unmarked side waits in the rain. No blood, no visible wound, no close-up of injury. Warm, clean, modern picture-book style. No readable text or logos.",
          grammar: "*in case*: *We'll call 1669 in case something is broken.*",
          text: "Coach Nok knelt beside me. \"Look at me, Praew. Keep your eyes open.\" Every time my {{eyelid|eyelids}} drooped, the gym started to spin. She checked my eyes because I had blacked out, then she wiped a small cut above my {{eyebrow|eyebrow}} (tiny, honestly) and the tears off my {{eyelash|eyelashes}} (many, honestly). \"This is an {{injury|injury}} for the professionals. We'll call 1669 in case something is broken.\"\n\nI tried to say I was fine, but my shoulder was so {{painful|painful}} that the word came out as a squeak. My arm hung in a strange position, as if it belonged to someone else and wanted to go home.\n\nThe ambulance took me to {{ae|A and E}} at the hospital near the park. In Thailand we usually say the ER, but the sign above the door said Accident and Emergency in English, so I'm counting it. Bua texted my mum fourteen times. My mum texted Bua back once: \"Coming.\""
        },
        {
          art: "🩻", tint: "cool",
          img: "art/ch2p2.webp",
          alt: "A hospital A and E bay: Dr Ploy in a white coat holding up a grey X-ray film of a shoulder against a lightbox, Praew in her sports kit sitting on the bed looking relieved, her mother on a chair beside the bed.",
          prompt: "A calm hospital A and E bay in Bangkok, pale green curtains, soft light. Dr Ploy, a Thai woman doctor in her forties with black hair in a neat low ponytail, a white coat over a plain blue blouse and a stethoscope, holds a grey shoulder X-ray film up against a glowing lightbox and points at it with a reassuring smile. Praew, thirteen, long black plait with a red ribbon, sits up on the bed in a plain pale hospital gown, looking relieved and slightly sheepish. Her mother, a Thai woman in her forties in a plain cream blouse, sits beside the bed holding Praew's left hand. The X-ray shows a simple schematic shoulder, nothing graphic. No needles, no blood. Warm, clean, modern picture-book style. No readable text or logos.",
          grammar: "*unless* and *provided that*: *You won't need an operation unless it keeps happening. And it probably won't, provided that you do your exercises.*",
          text: "Dr Ploy had a calm voice and a ponytail. First she checked my head, because I had blacked out: she shone a little torch in my eyes and asked me what day it was. (Tuesday. Nearly a trick question.) Then she sent me for an {{xray|X-ray}}.\n\n\"Good news,\" she said, holding the grey picture up to the light. \"No {{broken|broken}} bones, no {{fracture|fracture}}, and your {{ribs|ribs}} are fine. Your shoulder has simply popped out of its socket. I'm going to put it back.\"\n\nShe did, in about two seconds, and I made a noise like a kettle. After that she gave me a {{painkiller|painkiller}} and explained the rules. \"You won't need an {{operation|operation}} unless it keeps happening. And it probably won't, provided that you do your exercises.\" Ratchanok Intanon is recovering from a knee injury this year, I told her, and she's still playing. \"Then be like Ratchanok,\" said Dr Ploy."
        },
        {
          art: "🦜", tint: "warm",
          img: "art/ch2p3.webp",
          alt: "Evening in the back of a Bangkok taxi: Praew with her right arm in a blue cloth sling, a gold star sticker on her T-shirt, staring out at neon-lit rain, her mother beside her holding a plastic bag of papers.",
          prompt: "Night-time back seat of a pink Bangkok taxi in the rain, city lights blurred through the wet window. Praew, thirteen, long black plait with a red ribbon, now in a plain white blouse, sits with her right arm in a plain blue triangular cloth sling, a small round star sticker on her collar, looking out of the window with a thoughtful, slightly regretful face. Her mother (Thai woman in her forties, plain cream blouse) sits beside her holding a plastic bag of folded leaflets and gently patting Praew's knee. Cosy, warm interior light. Warm, clean, modern picture-book style. No readable text or logos; the taxi has no markings.",
          grammar: "Third conditional and *I wish*: *If I had done the shoulder stretches, I might not have dislocated it. I wish I had stretched my shoulders.*",
          text: "The {{relief|relief}} when the pain stopped was enormous. I almost cried again, which was embarrassing, because the nurse had just given me a sticker.\n\nDr Ploy put my arm in a {{sling|sling}}, a blue triangle of cloth that made me look like a pirate who had lost a fight. \"Keep it in the sling for a few weeks,\" she said. \"The shoulder will feel {{stiff|stiff}}, and that's normal. Then physiotherapy.\" She let me go home that evening with Mum and a plastic bag of instructions.\n\nIn the taxi I did the maths. No badminton for six weeks. One arm. Bua would need a new partner. How was I going to {{cope|cope}} with homework, hair-washing and buttons? If I had done the shoulder stretches, I might not have dislocated it. If I had listened to Coach instead of talking about that drama, I would be practising tomorrow. I wish I had stretched my shoulders. The drama wasn't even good."
        }
      ]
    },
    {
      n: 3,
      title: "Under the Weather",
      subtitle: "Two weeks later",
      pages: [
        {
          art: "🌡️", tint: "warm",
          img: "art/ch3p1.webp",
          alt: "A family living room in Bangkok: eight-year-old Mali curled up on the sofa in a blanket with a mug, their mother reading a digital thermometer beside her, Praew in home clothes with her sling watching from an armchair.",
          prompt: "A cosy Bangkok family living room, evening, rain on the window. Mali, an eight-year-old Thai girl with two short black bunches tied with yellow bands, in plain pink pyjamas, lies limply along the sofa under a light blanket with a flushed pink face and half-closed eyes. Her mother (Thai woman in her forties, plain cream blouse) sits on the edge of the sofa frowning gently at a plain digital thermometer in her hand. Praew, thirteen, long black plait with a red ribbon, plain white blouse, right arm in a blue sling, watches worriedly from an armchair. A box of tissues on the table. Warm, clean, modern picture-book style. No readable text, numbers or logos; the thermometer display is a blank glow.",
          grammar: "*unless* in a first conditional: *Unless her temperature comes down within two days, we'll take her to the clinic.*",
          text: "Two weeks later, I was an expert at one-handed everything, and then my little sister Mali, who is eight and never quiet, went quiet. \"I feel a bit {{undertheweather|under the weather}},\" she said, which she had learned from me, and lay on the sofa like a dropped scarf.\n\nBy the evening she had properly {{comedownwith|come down with}} {{flu|flu}}. Every {{symptom|symptom}} arrived at once, which is how flu works: a {{headache|headache}}, an {{ache|ache}} in her legs and her back, and a {{fever|fever}} that made her face hot and pink. Mum put the thermometer under her arm: 38.9°C. Mali definitely had {{temperature|a temperature}}. Anything from 38 up counts as a fever, Mum said.\n\nIt was the rainy season, when half of Bangkok seems to catch flu, and Mum knows the rule. \"Unless her temperature comes down within two days, we'll take her to the clinic,\" she said, and went to find the children's paracetamol."
        },
        {
          art: "🤧", tint: "bright",
          img: "art/ch3p2.webp",
          alt: "A study corner at home: Mali at the desk mid-sneeze with a tissue, homework sheets flying off the desk, Praew with her sling pulling a horrified face and holding a mask out towards her sister.",
          prompt: "A teenage girl's bedroom in Bangkok, daytime, posters as plain coloured rectangles. Mali, eight, two short black bunches with yellow bands, plain pink pyjamas, sits cross-legged on the bed mid-sneeze with her eyes squeezed shut and a tissue in her hand, cheeks flushed. Sheets of homework paper fly off the bed. Praew, thirteen, long black plait with a red ribbon, plain white blouse, right arm in a blue sling, stands by the desk with a horrified, comic expression, holding out a plain white face mask towards her sister with her good hand. A glass of water and a box of tissues on the bedside table. Warm, clean, modern picture-book style. No readable text or logos; the homework pages carry only faint lines.",
          grammar: "*I wish* + *would* for an annoying habit: *I wish Mali wouldn't sneeze on my books!*",
          text: "Mali's flu moved in with me. She did her homework on my bed, which meant she did her {{cough|coughing}} on my bed, and she managed to {{sneeze|sneeze}} directly onto my English essay. Twice. I wish Mali wouldn't sneeze on my books!\n\nHer throat was so {{sore|sore}} that she could only whisper, and whispering made her even more annoying, somehow. On the second night she said she felt {{sick|sick}}, and a minute later she {{sick|was sick}} in the bathroom. (In British English that means she vomited, which Mali thinks is a hilarious thing for a language to do.) After that she felt {{dizzy|dizzy}} whenever she stood up, and the {{dizziness|dizziness}} scared her more than the fever did.\n\nHer {{tiredness|tiredness}} on day one had become real {{exhaustion|exhaustion}} by day two. She slept for fourteen hours. I checked on her six times. With one arm."
        },
        {
          art: "💊", tint: "cool",
          img: "art/ch3p3.webp",
          alt: "Inside a small Bangkok pharmacy: Khun Dao in a white pharmacist's coat behind the counter explaining with a box in her hand, Praew in a T-shirt and denim skirt, her arm in a sling, listening and nodding, shelves of plain boxes behind, a green round sticker on the glass door.",
          prompt: "Inside a small, bright neighbourhood pharmacy in a Bangkok soi, white shelves of plain unlabelled boxes and bottles, a glass door with a small round green sticker on it. Khun Dao, a Thai woman pharmacist in her thirties with black hair in a bun, round glasses and a white coat over a plain lilac blouse, leans over the counter explaining kindly, holding a plain small white box in one hand and a face mask in the other. Praew, thirteen, long black plait with a red ribbon, plain white blouse, right arm in a blue sling, listens and nods, a small shopping basket on the counter beside her. Warm, clean, modern picture-book style. No readable text, brand names or logos anywhere; all packaging is plain colour.",
          grammar: "*as long as* and *provided that*: *As long as everyone wears a mask, she probably won't pass it on to the whole family. She'll be fine, provided that she rests.*",
          text: "On day two, Mum sent me to the {{chemist|chemist's}} on our soi, the one with the green \"My Quality Pharmacy\" sticker on the door. Khun Dao, the pharmacist, listened to the whole story.\n\n\"You don't need a {{prescription|prescription}} for flu,\" she said. \"To {{treat|treat}} it, Mali needs rest, lots of water, and paracetamol to {{lower|lower}} her temperature. Not aspirin for a child, and no ibuprofen either, because in the rainy season a fever can also be dengue. She'll be fine, provided that she rests.\" She gave me a cough {{remedy|remedy}} and some ORS sachets.\n\n\"Same rule as your mum's: if the fever lasts more than two days, or she keeps being sick, she sees the doctor at the clinic.\" In Thailand that's the nearest thing to a {{gp|GP}}. Flu is very {{infectious|infectious}}: every cough fires {{germ|germs}} into the air. \"As long as everyone wears a mask, she probably won't {{passon|pass it on}} to the whole family. Including you, Praew.\""
        }
      ]
    },
    {
      n: 4,
      title: "Yai's Cabinet",
      subtitle: "Day three",
      pages: [
        {
          art: "🫚", tint: "warm",
          img: "art/ch4p1.webp",
          alt: "A Thai kitchen: Yai, the grandmother, at an open wooden cabinet full of jars and small bottles holding up a ya dom inhaler and a steaming mug of ginger tea, Praew at the table with her sling reading the back of a small box, a sports-drink bottle and ORS sachets on the table.",
          prompt: "A warm Thai family kitchen with an old wooden cabinet open to show rows of jars, small bottles, dried herbs and tins. Yai, a Thai grandmother in her seventies with grey hair in a neat bun, a plain patterned sarong and a pale green blouse, stands at the cabinet holding up a tiny plain inhaler tube in one hand and a steaming mug of ginger tea in the other, with a proud, stubborn smile. Praew, thirteen, long black plait with a red ribbon, plain white blouse, right arm in a blue sling, sits at the table reading the back of a small plain box with a thoughtful frown; a plain sports-drink bottle and a few small plain sachets sit in front of her. Fresh ginger and lime on the counter. Warm, clean, modern picture-book style. No readable text, brand names or logos; every label is a plain colour block.",
          grammar: "Second conditional: *If herbs had no side effects, doctors would prescribe them for everything.*",
          text: "Yai, my grandmother, does not believe in pharmacies. She believes in her cabinet. Out came the ya dom inhaler (menthol, camphor and borneol, for Mali's dizziness), ginger tea for her throat, and a box of Fah Talai Jone. But Khun Dao had said no to that one without a doctor's advice, so Yai, grumbling, put it back.\n\nThen Yai opened a sports drink for Mali, \"for the salts\". I showed her the ORS sachets. \"Sports drinks are for sweating, Yai. After being sick, it's ORS.\" Yai said I was getting clever.\n\nI read the box anyway. Herbs like this have {{property|properties}} that {{relieve|relieve}} symptoms, but they also have {{sideeffect|side effects}}: you shouldn't take it for more than a few days, because it can affect your {{liver|liver}} and your {{kidney|kidneys}}. If herbs had no side effects, doctors would prescribe them for everything. By night three I was {{lastlegs|on my last legs}}, and Mali had learned a new word: borneol."
        },
        {
          art: "🔬", tint: "cool",
          img: "art/ch4p2.webp",
          alt: "Praew in pyjamas, her arm in a sling, at her desk late at night with a laptop and a science project poster showing a flooded town drawn in simple shapes, a sketch of a willow tree and a tablet, Mali's empty, neatly made bed through the open door with a small yellow toy on the pillow.",
          prompt: "Praew's bedroom at night, desk lamp glowing. Praew, thirteen, long black plait with a red ribbon, plain white blouse, right arm in a blue sling, sits at her desk typing one-handed on a laptop with a blank glowing screen. Propped beside her is a hand-drawn science poster showing, in simple pictures only, a flooded town, a pot of water boiling over a fire, a willow tree with drooping branches, and a single plain white round tablet. Through the open door, Mali's small bed is empty and neatly made; a small packed overnight bag with a plain yellow toy sits by the door. Quiet, warm night palette. Warm, clean, modern picture-book style. No readable text, letters or numbers anywhere; the poster has only pictures and squiggle lines.",
          grammar: "Second conditional: *If there were no clean water, we would have to boil it.*",
          text: "My science project was due the same week, because the universe has a sense of humour. The question: after a flood, how would a town cope, starting {{fromscratch|from scratch}}? If there were no clean water, we would have to boil it, because {{suspect|suspect}} water spreads disease. People {{pickup|pick up}} food poisoning from food that has sat in the heat. A scratch from dirty floodwater can turn into an {{infection|infection}}, and without medicine an infection can become {{lethal|lethal}}. Cheerful stuff.\n\nMy favourite fact: in 1763 an English clergyman called Edward Stone reported that willow bark brought down fevers, and in 1897 the Bayer company turned the same idea into aspirin. A tree became a tablet.\n\nMeanwhile Mali's fever reached day three, so the clinic sent her to hospital for one night, just to watch her. She {{pullthrough|pulled through}} like a champion, and two days later she was {{upandabout|up and about}}, singing. I almost missed the quiet."
        }
      ]
    },
    {
      n: 5,
      title: "Back on Her Feet",
      subtitle: "September to October",
      pages: [
        {
          art: "💪", tint: "bright",
          img: "art/ch5p1.webp",
          alt: "A bright physiotherapy room: Khun Fern guiding Praew's arm as Praew pulls a yellow rubber resistance band, no sling now, a wall poster of simple shoulder-exercise pictures, Praew's face a mix of effort and pride.",
          prompt: "A bright, clean physiotherapy room with a window onto green trees, a padded bench and a wall poster of simple stick-figure exercise pictures. Khun Fern, a Thai physiotherapist in her late twenties with black hair in a high ponytail and a plain teal polo shirt and trousers, stands beside Praew gently guiding her elbow. Praew, thirteen, long black plait with a red ribbon, plain white sports shirt and navy shorts, no sling, pulls a plain yellow rubber resistance band outwards with her right arm, face scrunched with effort and pride. A folded blue sling lies discarded on the bench. Warm, clean, modern picture-book style. No readable text or logos; the poster has pictures only.",
          grammar: "*as long as* with a promise: *You'll get completely better as long as you do your exercises every day.*",
          text: "Khun Fern, my physiotherapist, has the kindest face and the strongest hands in Bangkok. \"{{physio|Physiotherapy}} is boring and it works,\" she said at our first session. \"Those are the two facts.\"\n\nThe {{treatment|treatment}} was a list of tiny exercises with a rubber band, three times a day, every day. In the first week my {{stiffness|stiffness}} was so bad that my arm moved like a rusty gate. By week three the gate was oiled. By week five the shoulder had started to {{heal|heal}} properly, and the sling went into a drawer, where it belongs. \"You'll {{getbetter|get completely better}} as long as you do your exercises every day,\" Khun Fern promised. \"Miss three days and we start again.\"\n\nThe embarrassing part was the running. Six weeks on a sofa, and I was completely {{outofshape|out of shape}}. On my first lap of Benjakitti, Coach Nok's grandmother overtook me. Twice. I checked: she's seventy-four."
        },
        {
          art: "🏆", tint: "warm",
          img: "art/ch5p2.webp",
          alt: "The badminton final: Praew and Bua on court with rackets raised and arms around each other's shoulders, both grinning, Coach Nok clapping at the side, Mali and Yai in the front row waving a plain banner, afternoon light.",
          prompt: "A school badminton final in a Bangkok gym, warm afternoon light through high windows, a small crowd of schoolgirls in plain white blouses and navy skirts in the stands. On court, Praew, thirteen, long black plait with a red ribbon, plain white sports shirt and navy shorts, both arms raised with her racket, and Bua (short bobbed hair, same kit) hug with arms around each other's shoulders, both laughing. Coach Nok (short black hair, plain navy tracksuit, whistle) claps at the side of the court. In the front row, Mali, eight, two short black bunches with yellow bands, plain yellow T-shirt, jumps up waving a plain red banner with no writing, and Yai (grey bun, pale green blouse, patterned sarong) beams beside her. Warm, clean, modern picture-book style. No readable text, numbers or logos; the scoreboard is blank.",
          grammar: "*If only* + past perfect for regret: *If only I had known last August what I know now.*",
          text: "October. The final. Before it, Coach Nok made an announcement: she had booked the whole team a flu {{vaccine|vaccine}} for next May, before the flu season begins, \"because I am not losing another player to a sneeze\". I am scared of {{injection|injections}}. I've never told anyone except Mali, who told everyone. I signed up anyway. Mali's fourteen-hour sleep was a better argument than my fear.\n\nThen I walked onto the court with Bua, both arms working, {{backonfeet|back on my feet}} at last. Did we win? I'm not telling you yet. What I can tell you is that at match point I did not dive. And that when the last shuttle landed, win or lose, I felt {{ontopofworld|on top of the world}}.\n\nIf only I had known last August what I know now. So I'm writing it down: a blog post called \"Warm Up Your Shoulders (Yes, Those Too)\". Coach says the title needs work. I'm thinking about it."
        }
      ]
    }
  ]
};
