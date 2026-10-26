# Back on Your Feet — Unit 6 vocabulary app spec

Oct 26, 2026 · T.Chris (Markdown copy of the content contract; the canonical artifact is https://claude.ai/artifact/LqxJADhfz79VsjBVtrZW6Z)

## 1. Brief for Fable 5.1

Build **Back on Your Feet**, a self-study vocabulary app for *Gateway to the World B2* Unit 6 "Get fit, stay fit!" (Student's Book pp.70–81). It is the sibling of **Money Matters**, the Unit 5 app at [pegasus028.github.io/MU5Vocab](https://pegasus028.github.io/MU5Vocab/) (repo `pegasus028/MU5Vocab`), and should feel like the same family with a new identity. Ship it to a new repo, `pegasus028/MU6Vocab`.

**Learner.** Mikii, a 13-year-old Thai girl in M2, T.Chris's private online tutee (1.5 hours a week). She is CEFR B2, strong at speaking and listening, and weak at writing. Her longer-term goal is IELTS. She uses the app between lessons on an iPad or phone, so it must work in the browser with no log-in and keep all progress on her device (no service worker or offline cache is required).

**Read before you write a line.**

1. Clone `pegasus028/MU5Vocab` and read `README.md`, `index.html` and every file in `data/`. Copy its engine, file layout and data schemas rather than reinventing them.
2. If T.Chris's `app-builder` skill is available, read it: it holds his question standard, gamification kit, Sonia audio pipeline and test scripts.
3. Read the textbook pages (PDF supplied by T.Chris) so every item is used the way the book uses it.
4. Read this whole spec. Sections 2–4 are the content contract; sections 5–8 say what to build; section 9 says how it is checked.

**Keep from Money Matters**

| Feature | Keep as is | Change for Unit 6 |
| --- | --- | --- |
| Storybook | Page-turn pages, one illustration each, tappable gold keywords that turn green once opened | New story (section 5), 5 chapters |
| Word List | Grouped by triage area, filters by type, level and area, search | 6 areas instead of 5 |
| Study cards | Level, part of speech, definition, 2 examples, B1/B2/C1 synonyms and antonyms, collocations, tip | Add IPA with a Sonia clip, word family, Thai note, "textbook use" line |
| Clickable synonyms and antonyms | Every one opens its own full lexicon entry, never "synonym of …" (hard requirement) | Same rule |
| Patterns | Cards with icon, insight, items, examples, one-minute drill | 16 new cards (section 3) |
| Tests | Placement Check 20 + Final B1 20 + Final B2 20, all 4-option | Placement Check grows to 24 (4 per area); add an Exam Room (section 8) |
| Media | `media.js` shelves for podcast, video, extras with chips | Same file, same fields |
| Roleplay boss | Typed turns, regex detection of target items, word wall, target count | New scene (section 6) |
| State | `localStorage`, theme toggle, reset button | Same |

**New in Unit 6.** A tappable **Body Map** for the 16 body parts; a **Writing Clinic**, because writing is Mikii's weak skill; **recorded Sonia read-aloud** for every word, example and story page (T.Chris's audio standard since 17 Oct 2026); a **Recovery Ward spaced-review queue (section 4)**; an **Exam Room** with the formats she will actually meet (section 8). The unit's grammar (conditionals, *unless / as long as / provided / in case*, *I wish / If only*) is modelled naturally in the story and the roleplay, never drilled as grammar.

## 2. The 70 target items and every textbook use

The app teaches the 70 items on p.80 (16 body parts, 43 health and medical-care words, 11 idioms) plus 10 bonus items the unit uses but does not list. The ids below are fixed: story markup, tests, patterns and the roleplay all link by id, so writers can work in parallel.

**Six triage areas plus a bonus set** (replace Money Matters' five `cluster` values)

| Area (`cluster`) | Items and fixed ids | Count |
| --- | --- | --- |
| `body` — The body map | ankle, chest, eyebrow, eyelash, eyelid, forehead, heel, hip, kidney, liver, lungs, muscle, nail, ribs, thigh, waist (id = the word) | 16 |
| `injury` — Accidents and injuries | injure, injury, broken, fracture, dislocate, painful, A and E `ae`, X-ray `xray`, operation | 9 |
| `symptoms` — Feeling ill | symptom, fever, temperature, ache, headache, cough, sneeze, sore, sick, dizzy, dizziness, tiredness, exhaustion, stiff, stiffness | 15 |
| `germs` — Catching and spreading | flu, germ, infection, infectious, pass on `passon`, injection, vaccine | 7 |
| `care` — Treatment and recovery | GP `gp`, chemist, prescription, painkiller, relief, remedy, treat, treatment, lower, heal, get better `getbetter`, physiotherapy `physio` | 12 |
| `idioms` — Idioms of health | back on your feet `backonfeet`, black out `blackout`, come down with `comedownwith`, full of beans `fullofbeans`, keep in shape `keepinshape`, on top of the world `ontopofworld`, on your last legs `lastlegs`, out of shape `outofshape`, pull through `pullthrough`, the picture of health `pictureofhealth`, under the weather `undertheweather` | 11 |
| `bonus` — In the unit, not on p.80 | up and about `upandabout` (p.73 Ex 1 key), sling, cope, from scratch `fromscratch`, lethal, pick up (an illness) `pickup`, suspect (adj) `suspect`, relieve (pain), side effect `sideeffect`, property (= quality) `property` | 10 |

Bonus items get full study cards and appear in the story, but they never count towards the 70 and never appear in the Placement Check. *Up and about* is the exception worth flagging to Mikii: it is a key in the book's own exercise, so it may appear in a school test.

**Textbook use cases the app must reproduce** (each needs at least one example sentence, story line or test item that uses the word in exactly this sense)

| Page, exercise | Use case to cover | Items |
| --- | --- | --- |
| p.70 Ex 1 | Draw-and-guess body parts | all 16 body parts |
| p.70 Ex 2, *A dislocated shoulder* | an injury connected with sport; dislocate your shoulder in a contact sport; very painful; go to A and E; give you an X-ray to see if you have broken bones or a fracture; an operation might be necessary; painkillers, perhaps with other medicine to help you relax; keep your arm in a sling; physiotherapy to rehabilitate | injury, dislocate, painful, ae, xray, broken, fracture, operation, painkiller, sling, physio |
| p.70 Ex 3, *Flu* | symptoms appear suddenly; a fever = a temperature of 38°C or above; aches and pains; dizziness, tiredness, exhaustion; a dry cough; a sore throat; a headache; **feel and be sick** (BrE = vomit); get better without a GP; a chemist advises how to treat flu; flu remedies without a prescription; lower your temperature; highly infectious; pass it on; germs spread when you cough or sneeze; a flu vaccine / an injection before flu season | symptom, fever, temperature, ache, dizziness, tiredness, exhaustion, cough, sore, headache, sick, getbetter, gp, chemist, treat, remedy, prescription, lower, infectious, passon, germ, sneeze, vaccine, injection |
| p.70 Ex 4 | Personal questions: injured playing sport, A and E, last fever, afraid of injections, physiotherapy | injure, ae, fever, injection, physio |
| p.71 Reading | an open fracture; a small cut leading to an infection; infectious diseases; relieve pain and control fever; side effects; painkilling properties; lethal; cope; from scratch; pick up food poisoning; suspect water | fracture, infection, infectious, relieve, sideeffect, property, lethal, cope, fromscratch, pickup, suspect |
| p.73 Ex 1, *Accidents will happen* | the picture of health; up and about; pull through; blacked out; back on his feet; keep in shape; on top of the world | 7 idioms |
| p.73 Ex 2 | good or bad health? come down with, full of beans, on your last legs, out of shape, under the weather | 5 idioms |
| p.73 Ex 3 | correct the particle: keep **in** shape, blacked **out**, coming **down** with, full **of** beans, **under** the weather | 5 idioms |
| p.76–77 | come down with the flu; on her last legs; under the weather (in third conditional items) | idioms + grammar |
| p.79 Writing | for-and-against essay on doctors' pay and on stress | topic only: the model essay uses none of the 70 items; Writing Clinic W5 takes the task |
| p.81 Test yourself | unscramble body parts (hip, lungs, thigh, kidney, waist, forehead, nail, muscle); one-sentence definitions (stiffness, A and E, GP, chemist, prescription, operation, fever, ache, pain relief); idiom rewrites with a key word (top, down, last, shape, out, pull, picture) | as listed |

Also cover: p.77 Ex 7 (j) *keep \_\_\_ shape* in the blog cloze; p.76 Ex 2.7 *need painkillers* in a third conditional; *flu* in the p.70 Ex 3 items; *willow bark* (p.71, underlined) as a lexicon entry. Pages 74–75 (healthy eating, detox diets, emotional eating) use none of the 70 items; the story's bubble-tea and breakfast details nod to them. Writers must not copy the book's sentences. Write new sentences that use each word in the same sense and the same grammar frame.

## 3. Patterns: how the 70 words connect

The list is not 70 separate words. It is one patient journey, one body seen in layers, one up–down metaphor that runs through the idioms, and a handful of word-building rules that generate most of the nouns. These become 16 pattern cards in `patterns.js` (same schema as Money Matters), each linked to the study cards of its items.

**The patient journey** (the spine of the story and of the triage areas)

1. **Cause:** germ, infection; injure, dislocate, fracture, broken
2. **Symptoms:** fever / a temperature, cough, sneeze, sore throat, ache, headache, dizziness, tiredness, exhaustion, stiffness, feel sick
3. **Where you go:** chemist (advice, remedies) → GP (not urgent) → A and E (urgent: broken bones, dislocations)
4. **Finding out:** X-ray
5. **Treatment:** prescription, painkiller, injection, sling, operation, remedy
6. **Effect:** lower a temperature, pain relief
7. **Rehab:** physiotherapy
8. **Outcome:** a bone or wound heals; a person gets better; a serious case pulls through; then up and about, back on your feet
9. **Prevention:** vaccine, keep in shape, wash your hands so you don't pass it on

**Pattern cards**

| # | Card (`id`) | Items | The insight | One-minute drill |
| --- | --- | --- | --- | --- |
| 1 | One patient, nine stages (`journey`) | all care, injury, symptoms, germs items | Every word has a place on the journey above; knowing the place tells you the word's job | Drag 12 words into the 9 stages |
| 2 | The body in layers (`layers`) | body parts, fracture, dislocate, stiff | Surface (forehead, eyebrow, eyelid, eyelash, nail, chest, waist, hip, thigh, ankle, heel) → bones and joints (ribs, hip, ankle) → organs (lungs, liver, kidneys) → tissue (muscle). You **fracture** a bone, **dislocate** a joint, **pull** a muscle | Say one thing that can go wrong at each layer |
| 3 | Healthy is up, ill is down (`updown`) | comedownwith, undertheweather, backonfeet, upandabout, ontopofworld, blackout | Lakoff and Johnson's metaphor: illness makes us lie down, so we come **down** with flu and get back **on** our feet; happy is up too (on **top** of the world); conscious is up, so the lights go out when you **black out**. Their own example is *He came down with the flu* | Point up or down for each idiom before you say it |
| 4 | The idiom thermometer (`thermometer`) | all 11 idioms + up and about | Top to bottom: on top of the world, full of beans, the picture of health, in shape, out of shape, under the weather, come down with, on your last legs, black out; recovery runs pull through → up and about → back on your feet. Two traps: *on top of the world* is mood, not health; *out of shape* is fitness, not illness | The drag game in section 4 |
| 5 | Fuel, shape and journeys (`fuel`) | fullofbeans, keepinshape, outofshape, pullthrough, lastlegs | Energy is fuel (full **of** beans: one possible story is horses fed beans, from a single 1955 source); the body has a proper shape, so you can be **out of** it (like *out of order*); life is a journey, so you pull **through** a crisis, and your legs wear out on your last legs | Make a picture in your head for each one, then say it |
| 6 | -ness turns a feeling into a thing (`ness`) | dizzy, dizziness, tiredness, stiff, stiffness | ADJ + -ness = noun: dizzy → dizz**i**ness (y → i), tired → tiredness, stiff → stiffness; also ill → illness, fit → fitness | Turn 6 adjectives into nouns in 30 seconds |
| 7 | -tion turns an action into a thing (`tion`) | infection, injection, operation, exhaustion, prescription | VERB + -tion = noun: infect, inject, operate, exhaust, vaccinate, dislocate, prescribe | Verb in, noun out, against the clock |
| 8 | The spelling changes exams love (`spellchange`) | prescription, relief, heal, injury | prescri**b**e → prescri**p**tion (like describe → description); relie**v**e → relie**f** (like believe → belief); h**ea**l /iː/ **and health /e/ share a root but are a sound note only, never a word-formation pair (don't key HEAL → health)**; exhaus**t**ion keeps its t; **un**injured, **un**healthy | Spell each pair aloud, then type it |
| 9 | Hurt, injure, damage, wound (`hurtinjure`) | injure, injury, broken | *Hurt* is about the pain; *injure* is harm in an accident; *damage* is most natural for things and organs (liver damage); *wound* is for weapons and is often passive (Oxford usage note) | Fix three wrong sentences |
| 10 | Ache, pain, sore, painful (`ache`) | ache, headache, sore, painful, painkiller | *-ache* makes compounds (headache, stomach ache, toothache, backache, earache); otherwise *a pain in my chest*; *sore* goes before throat, eyes, muscles; *painful* describes the injury | Finish *I've got a \_\_\_* five ways |
| 11 | Who fixes what (`whofixes`) | treat, treatment, heal, getbetter, relief, lower, remedy | Doctors **treat** patients; doctors and drugs cure diseases (the disease goes away); wounds and bones **heal**; people **recover** or **get better**; medicine **lowers** a temperature and brings **relief** | Match five subjects to five verbs |
| 12 | British health English (`british`) | ae, gp, chemist, sick, temperature, flu | A and E (US: ER); GP (US: family doctor); the chemist's (also pharmacy); *have a temperature* = have a fever; *be sick* = vomit, *feel sick* = about to vomit, *off sick* = away ill; *flu* and *the flu* are both fine in British English | Translate an American text message into British English |
| 13 | Words with stories inside (`stories`) | muscle, vaccine, flu, xray, fracture, lungs, relief, injury, prescription, symptom | muscle = "little mouse" (flex your biceps); vaccine from Latin *vacca*, cow (Jenner, cowpox); influenza = "influence" of the stars; X-ray: Röntgen's X for an unknown; fracture shares a root with fragile and fragment; lungs and relief both come from "light"; injury once meant "not right"; prescription = "written before"; symptom = things that "fall together" | Tell one story to someone at home |
| 14 | Frozen idioms, moving particles (`particles`) | all idioms | Idioms do not change, except the grammar around them; exams test the particle. The five errors on p.73: keep **in** shape, black **out**, come **down with**, full **of** beans, **under** the weather. Frames: *be / feel / look* + idiom; *come down with* + an illness; *black out* and *pull through* take no object | Spot the wrong particle in five sentences |
| 15 | Silent letters and sound-alikes (`sounds`) | ache, muscle, thigh, chemist, cough, forehead, heel, waist | ache /eɪk/, muscle /ˈmʌs.əl/ (silent c), thigh /θaɪ/, chemist /ˈkem.ɪst/, cough /kɒf/, forehead /ˈfɒr.ɪd/ or /ˈfɔː.hed/; heel = heal = he'll; waist = waste; say the final sounds in che**st**, ri**bs**, lu**ngs** | Listen to Sonia, then type what you heard |
| 16 | Where Thai and English cut differently (`thai`) | sick, fever, headache, injection, blackout, gp, chemist | กินยา → *take* medicine; ไม่สบาย → *I don't feel well*; ปวดหัว → *I've got a headache*; เป็นไข้ → *I've got a fever / a temperature*; เป็นหวัด → *I've got a cold* (not *I'm cold*); เป็นลม → *black out / faint*; ฉีดยา → *have an injection*; Thailand has no GP system, so "GP" is the clinic doctor | Say each Thai phrase in natural English |

**Levels to show on cards.** Use the Cambridge (English Vocabulary Profile) label where one exists. Most items are A2–B2; the stretch items are germ, kidney, injection, infectious, vaccine, under the weather and on top of the world (C1–C2). A and E, GP, fracture, dislocate, painkiller, physiotherapy and most idioms have no EVP label: show "not graded" rather than invent one.

**Honesty about origins.** *Under the weather* has a popular sailors story with no early evidence; *full of beans* rests on one 1955 book; the *sneeze* misreading story is unproven; the origins of *kidney* and *thigh* are uncertain. Cards present these as "one possible story", never as fact.

## 4. How to teach them: research-backed moves and Thai examples

Seven findings decide the app's design. Each one changes a feature, so Fable should not drop any of them for convenience.

| Finding | Evidence | What it means for the app |
| --- | --- | --- |
| Words in one connected scene are learned better than near-synonyms taught side by side | Tinkham 1994; Nakata & Suzuki 2019 (the cost is slower first learning and more mix-ups; spacing reduces it) | Teach through the patient-journey story; keep confusables (*eyebrow / eyelid / eyelash*, *ache / pain / sore*) apart until each is known, then contrast them on purpose |
| Retrieval beats re-reading, and spaced retrieval beats massed | Karpicke & Roediger 2008: about 80% recall after a week when items kept being tested vs 35% when they were dropped; Nakata 2017: 5–7 retrievals beat 1–3; Rogers et al. 2025: 4–14-day gaps beat 1 day | Add a **Recovery Ward** queue (below); a word counts as *known* only after she types it correctly on a later day |
| Typing the word builds spelling knowledge that multiple choice does not | Section 4 of the teaching notes | Every area has a typed-recall step; body map *Name it* mode; Exam Room typed items |
| Writing a short text with target words teaches them better than single sentences, which beat gap fills | Yanagisawa & Webb 2022: 53.6 vs 45.6 vs 38.6 on their model | The Writing Clinic and the typed roleplay are the core of the app, not extras |
| Idioms grouped by a shared metaphor stick better | Boers 2000; Lakoff & Johnson 1980: HEALTH IS UP, SICKNESS IS DOWN | The Health Thermometer pattern card and game (section 3); say honestly when an origin is folk etymology (*full of beans*) |
| Thai glosses and Thai–English contrasts help | Yanagisawa et al. 2020: L1 glosses beat L2 glosses | A short `thai` contrast line on the cards where Thai cuts meaning differently (ไม่สบาย, กินยา, เป็นลม); suffix work for Thai Grade 8 learners gave large gains (Sumalee & Sukying 2024) |
| Points and story help a little; compulsory badges, leaderboards and promised rewards backfire | Sailer & Homner 2020; Hanus & Fox 2015 | No leaderboard; badges appear as surprises, never as promised rewards; a weekly target instead of a streak that punishes a missed day |

**Recovery Ward (spaced review).** Each word she misses or opens becomes a patient on the ward. Patients are due again after 0, 2, 4, 7 and 14 days (Leitner boxes); each visit is a typed recall or a short MCQ, alternating. A correct typed answer at the 14-day visit discharges the patient "the picture of health". A wrong answer sends it back one box, never to the start.

**Activity bank** ("app" = build it; "live" = for T.Chris's online lessons, listed so the app's content supports them)

| Activity | Where | Items | How it works |
| --- | --- | --- | --- |
| Body Map: Explore / Find it / Name it / Where does it hurt? | app | body + injury | Section 6 |
| Health Thermometer | app (Patterns) | 11 idioms + exhaustion, tiredness, dizzy, get better, heal | Drag each onto a scale from *black out* to *on top of the world*; the UP/DOWN metaphor is revealed after she commits |
| Word-family Pharmacy | app (Exam Room B practice) | dizzy, stiff, tired, exhaust, infect, inject, injure, operate, treat, prescribe, relieve, pain | Shelves of stems; she "fills prescriptions" (gaps needing the right form); spelling check catches y→i, -ful, -ious, v→f |
| Clinic Shift | app (Tests) | care + injury | Route 12 patients to home, chemist, GP or A and E, then name the problem |
| What would the doctor say? | app + live | any | A patient card plus a required structure (zero, first, second, third conditional, *unless*, *provided*, *in case*, *I wish*); regex checks the structure and a target word |
| Medical Mystery | later version (out of scope for v1) | symptoms + care | Clue by clue; each clue costs a "test"; she types diagnosis and treatment, then compares with a model |
| Germ Chain | later version (out of scope for v1) | germs area | A small classroom where sneezes pass germs on; she types the right word to protect each student; score is "students protected" |
| Gesture charades → typed answer | live | sneeze, cough, stiff, dizzy, idioms | T.Chris mimes on webcam; she types the word in chat within 5 seconds; then she mimes |
| Dictogloss *A and E Night Shift* | live | 10 items | T.Chris reads a 70-word story twice; she rebuilds it in writing; uses her listening strength to lift her writing |
| Symptom checker builder | live, then app | symptoms + care | She writes a yes/no decision tree ("Have you blacked out?" → "Go to A and E"); next lesson T.Chris tests it as a patient |

**Thai real-world examples by area** (verified; use them in examples, story and test stems)

| British term | The Bangkok version Mikii knows | Source |
| --- | --- | --- |
| A and E; dial 999 | the hospital ER (ห้องฉุกเฉิน); dial **1669** for a medical emergency | Thailand.go.th |
| GP | Thailand has no GP system: families go to a private clinic (คลินิก) or a hospital outpatient department | thai_contexts notes §1 |
| chemist; prescription | ร้านขายยา: Boots, Watsons, Fascino, or a "My Quality Pharmacy" where Gold Card holders have had free medicine for minor illnesses since Nov 2022; Thai pharmacists can sell many medicines that need a prescription in the UK | thai_contexts notes §1 |
| remedy; relieve; menthol (p.71) | ยาดม inhalers (menthol, camphor, borneol), Tiger Balm, ฟ้าทะลายโจร (added to Thailand's essential medicines list for mild COVID-19 in 2021; official cautions about the liver and kidneys; not for children) | thai_contexts notes §2 |
| salt and sugar water (p.71) | เกลือแร่ ORS sachets — and sports drinks are *not* ORS | thai_contexts notes §2 |
| flu; infectious; vaccine | flu peaks in the rainy season; 171,731 cases from January to May 2026, highest among children aged 5–9; free flu jabs run May–August for high-risk groups | Thairath English, May 2026 |
| lungs; cough | PM2.5 haze, worst Jan–Mar; masks | thai_contexts notes §3 |
| dizzy; black out | heatstroke in the hot season (late Feb–mid May); เป็นลม = *faint / black out*; first aid then 1669 | The Nation, Mar 2026 |
| keep in shape; out of shape | Lumphini Park's 2.5 km loop; Benjakitti Forest Park and its Green Bridge; café drinks with half the default sugar since Feb 2026 | thai_contexts notes §4–5 |
| back on your feet; on top of the world | Ratchanok Intanon's 2026 recovery from a knee injury ("95 per cent" recovered in May); Panipak Wongpattanakit's taekwondo gold at Tokyo 2020 and Paris 2024 | thai_contexts notes §4 |
| physiotherapy | not the same as Thai massage (นวดไทย, on UNESCO's list since 2019) — a useful contrast card | thai_contexts notes §2 |

**Writing Clinic error flags** (predictable Thai-learner errors; each flag shows a one-line fix)

| She writes | Flag says | Why it happens |
| --- | --- | --- |
| *eat medicine* | take medicine | Thai กินยา = "eat medicine" |
| *I'm not comfortable* | I don't feel well / I'm ill | ไม่สบาย translated word for word |
| *I'm headache* / *my head is painful* | I've got a headache | Thai uses ปวดหัว as a state |
| *I have fever* | I've got a fever / a temperature | no articles in Thai |
| *my leg is ache* | my leg aches / hurts | *ache* is a verb or noun, not an adjective |
| *a sick throat* | a sore throat | collocation |
| *I sick since Monday* | I've been ill since Monday | tense + BrE *ill* |
| *I injury my knee* | I injured my knee | noun used as verb |
| *came up with a cold*, *keep on shape*, *full with beans*, *blacked down*, *out of the weather* | down with, in, of, out, under | the five particle errors from p.73 |
| *my heal*, *my waste* | heel, waist | homophones |
| *The cut recovered* / *the doctor cured my cut* | The cut healed / the doctor treated my cut | treat, cure, heal, recover |
| *My finger is infectious* | My finger is infected | infected vs infectious |

The Thai explanations in the last column are teacher-experience predictions, not corpus findings; T.Chris should confirm or edit them before launch.

## 5. Storyline: *Back on Her Feet*

One patient journey carries all 80 items: a 13-year-old badminton player dislocates her shoulder, her little sister comes down with flu, her grandmother's remedy cabinet meets her science homework, and she fights her way back to the final. A single journey matters because research on vocabulary sets shows that near-synonyms taught side by side interfere, while words met in one connected scene are remembered better (section 4).

**Cast** (all female)

| Character | Who she is | Carries |
| --- | --- | --- |
| Praew (แพรว), 13 | M2 student in Bangkok, school badminton team, trains at Benjakitti Park; admires Ratchanok Intanon (named in the text only, never drawn) | injury, care, idioms; narrates her own regrets (third conditional, *I wish*) |
| Mali, 8 | Praew's little sister | symptoms and germs |
| Yai | Their grandmother: ya dom, ginger tea, Fah Talai Jone | remedies, *relieve*, side effects, the herbal-medicine link to p.71 |
| Coach Nok | PE teacher and badminton coach | warm-up body parts, zero conditional, the boss scene |
| Dr Ploy | A and E doctor | X-ray, fracture, operation, painkiller, sling |
| Khun Dao | Pharmacist at a "My Quality Pharmacy" | chemist, prescription, treat, lower, infectious |
| Khun Fern | Physiotherapist | physiotherapy, stiffness, heal, treatment |

**Setting and time.** Bangkok in the rainy season, when Thai flu cases peak. Chapter 1 is an inter-school tournament in August; the final is in October.

**Page plan** (12 pages, 110–160 words each, every target tagged at least once, primary tags shown; repeats encouraged)

| Ch | Page | Scene | Items tagged | Grammar modelled |
| --- | --- | --- | --- | --- |
| 1 *The Picture of Health* | 1 Warm-up | Benjakitti Park at 7 a.m.; Coach Nok runs the warm-up; Praew stretches her legs but skips her shoulders because she is chatting | pictureofhealth, fullofbeans, keepinshape, thigh, muscle, hip, ankle, heel, waist | zero conditional: *If you don't warm up, your muscles get stiff.* |
|  | 2 Match point | Semi-final; deep breaths; she wins game one and is on top of the world; at match point she dives, lands on her shoulder, hits her forehead, breaks a nail and blacks out for a few seconds | lungs, chest, ontopofworld, injure, dislocate, forehead, nail, blackout | first conditional: *If I win this point, we'll be in the final.* |
| 2 *A and E* | 3 Call 1669 | Coach checks her eyes (eyelid, a cut above her eyebrow, tears on her eyelashes); the shoulder is very painful; ambulance to A and E | injury, painful, ae, eyebrow, eyelid, eyelash | *in case*: *We'll call 1669 in case something is broken.* |
|  | 4 The X-ray | Dr Ploy checks her head because she blacked out, then reads the X-ray: no broken bones, no fracture, ribs fine; she puts the shoulder back; no operation unless it happens again; a painkiller | xray, ribs, broken, fracture, operation, painkiller | *unless*, *provided that* |
|  | 5 In a sling | Relief; arm in a sling; the shoulder feels stiff; Dr Ploy lets her go home that evening; Praew wonders how she'll cope | sling, relief, stiff, cope | third conditional + *I wish I had stretched my shoulders.* |
| 3 *Under the Weather* | 6 Mali's bad day | Two weeks later Mali feels under the weather, then comes down with flu: a temperature of 38.9°C, a headache, aches all over | undertheweather, comedownwith, flu, symptom, fever, temperature, headache, ache | *Unless her temperature comes down by tonight, we'll take her to the clinic.* |
|  | 7 Achoo! | Mali coughs and sneezes over Praew's homework, has a sore throat, feels sick and is sick, feels dizzy; tiredness turns into exhaustion | cough, sneeze, sore, sick, dizzy, dizziness, tiredness, exhaustion | *I wish Mali wouldn't sneeze on my books!* |
|  | 8 At the chemist's | Khun Dao explains: no prescription needed, how to treat flu at home and lower a temperature, which remedies help, why flu is infectious and how germs pass it on; see a doctor at the clinic (the Thai GP) if Mali's fever lasts more than two days (in the rainy season it could be dengue, so paracetamol only: no aspirin, no ibuprofen) | chemist, gp, prescription, treat, lower, remedy, germ, infectious, passon | *as long as*, *provided that* |
| 4 *Yai's Cabinet* | 9 Ya dom and ginger | Yai offers ya dom (menthol), ginger tea and Fah Talai Jone, but Khun Dao's rule wins: that herb is not for children like Mali; Praew reads the label: herbs have properties that relieve symptoms, but also side effects and should not be taken for long, because they can affect the liver and kidneys; Praew is on her last legs after nights helping Mali | relieve, property, sideeffect, liver, kidney, lastlegs | second conditional: *If herbs had no side effects, doctors would prescribe them for everything.* |
|  | 10 From scratch | Praew's science project: how would people cope after a disaster, starting from scratch, with suspect water, food poisoning they might pick up, and cuts that turn into lethal infections; she finds that willow bark became aspirin (Edward Stone, 1763; Bayer, 1897); Mali spends a night in hospital, pulls through, and two days later is up and about | fromscratch, suspect, pickup, infection, lethal, pullthrough, upandabout | second conditional: *If there were no clean water, we would have to boil it.* |
| 5 *Back on Her Feet* | 11 Physio | Khun Fern's physiotherapy: the stiffness eases, the shoulder heals, the treatment works; after weeks off she is out of shape | physio, stiffness, treatment, heal, getbetter, outofshape | *as long as you do your exercises every day* |
|  | 12 The final | Coach Nok books the team's flu vaccine for next May, before the flu season; Praew, scared of injections, signs up anyway; she is back on her feet, plays the final and, win or lose, feels on top of the world; she starts a blog post on warm-ups (leads into Writing Clinic W5) | injection, vaccine, backonfeet | *If only I had known this last August…* |

The roleplay boss, *The Comeback Interview*, is set between pages 11 and 12; unlock it once Mikii has read page 11.

**Story rules for the writer**

- B2 prose, natural and funny where it can be; Praew's voice is a real 13-year-old's, not a textbook's.
- Each tag's surface form must carry the textbook sense (`{{sick|was sick}}` = vomited, flagged in the study card as British usage).
- Health facts must be true and age-appropriate: no doses, no needles in close-up, no blood. Paracetamol, not aspirin, for children (aspirin is not given to under-16s). A sports drink is not oral rehydration salts (เกลือแร่ ORS) — a good moment for Yai to be corrected gently.
- Real people only in verified, flattering facts: Ratchanok Intanon became world champion at 18 in 2013 and was recovering from a knee injury in 2026; she is named, never drawn. Do not invent quotes.

**Illustrations.** 12 page pictures plus a cover, made in the Gemini app with a Praew reference sheet (T.Chris's `gemini-storybook-art` workflow; storybook art is the one use of Gemini he allows). Each page in `story.js` carries a `prompt` field; generate `docs/SOURCE-Praew-Art-Brief.md` from them. Style: warm, clean, modern picture-book; Thai setting details (Benjakitti's skywalk, a Bangkok pharmacy shopfront without real brand logos, a hospital A and E bay); Praew in a plain white blouse and navy skirt or a generic team kit with no school crest. Until art exists, the page falls back to the coloured emoji panel, as in Money Matters.

## 6. App structure

The app has nine tabs: six Money Matters tabs re-filled (Story, Words, Patterns, Tests, Roleplay, Media) and three new ones that exist because of who Mikii is — Home, so she always knows her next step; a Body Map, because 16 items are places on a body; and a Writing Clinic, because writing is her weak skill. The Exam Room sits inside Tests, because the textbook test, school tests and IELTS each ask for these words differently.

| Tab | What it does | New or kept |
| --- | --- | --- |
| 🏠 Home | One "next step" button computed from state (Placement Check → her route → Recovery Ward patients due → weakest area → Exam Room → boss), progress bar per area, rank, weekly target, media shelf | New (from T.Chris's app-builder kit) |
| 📖 Story | 5 chapters, 12 page-turn pages, 80 tagged items, 🔊 Listen per page (section 5) | Kept, new content |
| 🧍 Body Map | Tappable figure with an Outside and an Inside layer; four modes below | New |
| 📇 Words | 80 cards grouped by the six areas plus Bonus; filters and search as in MU5Vocab | Kept |
| 🧠 Patterns | 16 pattern cards (section 3), each with a one-minute drill | Kept, new content |
| 🎯 Tests | Placement Check, Final B1, Final B2, Exam Room, Clinic Shift, Recovery Ward (section 8) | Kept and extended |
| ✍️ Writing Clinic | Five short typed missions with instant offline feedback | New |
| 🎭 Roleplay | Cumulative final boss, *The Comeback Interview* | Kept, new scene |
| 🎧 Media | `media.js` shelves, unchanged fields | Kept |

**Header HUD.** `📖 n / 70` items opened (bonus items do not count), ★ points, a weekly target (no streak that punishes a missed day), ◐ theme, ↺ reset. Ranks follow the story's badminton thread: Shuttle Rookie, Warm-up, Rally, Drop Shot, Smash, Match Point, Champion.

**Study card additions** (on top of the MU5Vocab card): British IPA with a 🔊 Sonia clip; word family (e.g. *injure · injury · injured · uninjured*); a short Thai note where Thai and English cut meaning differently (e.g. ไม่สบาย is *not well / ill*, never *not comfortable*); an "In your textbook" line naming the page and the sense; a trap line for confusables. Synonyms and antonyms at B1/B2/C1 stay clickable full entries. For body parts, the card has a "Show on body map" button.

**Body Map modes**

1. *Explore* — tap a region, see its name, hear it, open its card. A toggle switches Outside (forehead, eyebrow, eyelid, eyelash, nail, chest, waist, hip, thigh, ankle, heel) and Inside (muscle, shown on the thigh and upper arm; ribs, lungs, liver, kidney).
2. *Find it* — "Tap the kidneys" against a 60-second clock; 16 prompts, shuffled. Left and right always mean her left and right (the figure faces the viewer, so her left is on the screen's right).
3. *Name it* — a region lights up; she types the word. Spelling counts, which is writing practice (silent *c* in *muscle*, *gh* in *thigh*, *waist* not *waste*).
4. *Where does it hurt?* — a short patient line ("I fell on the stairs and now I can't put weight on my foot") → she taps the region and picks the injury word.

The figure is an original, simple, non-graphic SVG of a teenage girl in sportswear. Organs sit in medically correct places: liver upper right of the abdomen (her right), kidneys at the back, either side of the spine, partly behind the lowest ribs (a back view shows them), lungs inside the rib cage. Draw it in code; do not use Gemini for it (T.Chris reserves Gemini for storybook art).

**Writing Clinic missions** (each 40–120 words, typed, no AI marking, all checks run in the browser)

| # | Mission | Text type | Words it pushes | Grammar it pushes |
| --- | --- | --- | --- | --- |
| W1 | Message your teacher: you can't come to class | Short message, 40–60 words | symptoms area | *I've come down with …*, present perfect |
| W2 | What happened at sports day? | Accident account, 80–100 words | injury area, *black out*, *sling* | past simple + one third conditional |
| W3 | Make a chemist's leaflet: *Beat the flu* | Advice leaflet, 60–80 words | care and germs areas | imperatives, *unless*, *in case*, *as long as* |
| W4 | Describe a time you were ill | IELTS Speaking Part 2 written out, 100–120 words | any 6 items + 2 idioms | past tenses, *I wish I had …* |
| W5 | For and against: *Schools should make every student do sport every day* | One body paragraph, 100–120 words | care and germs areas in neutral register (no idioms: essays avoid them) | p.79 Writing-bank linkers |

Feedback is instant and offline: target items found (same regex method as the MU5Vocab roleplay, inflections included), word count against the band, linkers found, and an **error flag list** of predictable Thai-learner errors (section 4), each with a one-line fix and worded as "Check:", because some patterns are right elsewhere (not comfortable with). A "Copy for T.Chris" button copies her text plus the feedback summary so she can paste it into Line before the next lesson. Store every draft in `localStorage`.

**Roleplay boss: *The Comeback Interview*.** The inter-school badminton final is on Saturday. Coach Nok and Khun Fern, the physiotherapist, must clear Praew (the story's heroine) to play. Mikii, playing Praew, answers seven turns in writing (the eighth line is the coach's verdict): what happened, what A and E did, how the treatment went, how she feels now, what she'll do if the shoulder hurts, what she wishes she had done, how she'll keep in shape, and why she is ready. Target: 15 distinct items of the 70. The word wall shows the 70 targets (no bonus items); nudges fire when a turn has no target item. Move `MATCH`, `SCENE` and the nudges out of `index.html` into `data/roleplay.js` so T.Chris can edit them.

**Clinic Shift** (mini-game inside Tests). Twelve patient cards in Thai teen situations; she sends each one to *stay home and rest*, *the chemist*, *a GP or clinic*, or *A and E*, then picks the word that names the problem. It turns the care vocabulary into a real decision.

## 7. Files, schemas and fixed ids

Keep MU5Vocab's rule: the engine never holds content. Everything T.Chris might edit lives in `data/` or `media.js`.

```
MU6Vocab/
├── index.html        layout, styles, engine (hash routes: #/story/3/2, #/body, #/word/liver, #/test/finalB2)
├── media.js          podcast / video / extras shelves — same fields as MU5Vocab
├── README.md
├── SPEC.md           this spec, as the content contract
├── .nojekyll
├── art/              12 story illustrations (800 px webp), cover
├── audio/tts/        one Sonia MP3 per spoken text
├── docs/             art brief generated from story prompts
├── tools/            validate.js, load.js, tts-list.js, make-audio.py, smoke + flow tests
└── data/
    ├── words.js      80 entries (70 targets + 10 bonus)
    ├── lexicon.js    every synonym and antonym as a full entry (expect ~350)
    ├── story.js      5 chapters, 12 pages
    ├── patterns.js   16 cards
    ├── bodymap.js    SVG regions, layer, word id, prompts for the 4 modes
    ├── tests.js      triage, finalB1, finalB2, exam sets, clinicShift
    ├── writing.js    5 missions, detectors, error flags, linkers
    ├── roleplay.js   MATCH regexes, SCENE, nudges
    └── tts.js        generated audio manifest
```

(Build note: the engine is split into `app.css` and `app.js` beside `index.html` so that `node --check` covers it; the content rule is unchanged.)

**`words.js` entry** — MU5Vocab's schema plus six fields (marked new):

```js
{ id:"dislocate", word:"dislocate", pos:"verb", cefr:null, group:"core",   // cefr null = not graded in EVP; group: core | idiom | phrasal | bonus
  cluster:"injury", ch:1,
  ipa:"/ˈdɪsləkeɪt/",                                   // new, British
  def:"To push a bone out of its normal place at a joint, for example in your shoulder.",
  ex:["Praew dislocated her shoulder diving for the shuttlecock.",
      "If you dislocate a finger, don't try to push it back yourself."],
  syn:{ B1:"put out", B2:"displace", C1:null },   // no natural C1 synonym: leave it out,
  ant:{ B1:"put back", B2:"reset", C1:null },
  colls:["dislocate your shoulder","a dislocated knee","badly dislocated"],
  family:["dislocate (v)","dislocated (adj)","dislocation (n)"],      // new
  textbook:"p.70 Ex 2: a sports injury — dislocate your shoulder in rugby or judo", // new
  thai:"ข้อเคลื่อน — the bone comes out of the joint; not the same as กระดูกหัก (fracture)", // new, optional
  trap:"dislocate ≠ fracture: nothing breaks, the joint comes apart.", // new, optional
  layer:null,                                                  // new: "outside" | "inside" for body parts
  tip:"" }
```

The example entry shows the shape only; its level, synonyms and antonyms must be checked like every other entry. Levels come from the English Vocabulary Profile where it lists the word; otherwise mark the level as the writer's estimate in a code comment. A synonym or antonym that does not exist naturally is left out of that level rather than invented: the card shows two, not a forced third.

**Other schemas** — copy MU5Vocab exactly for `lexicon.js`, `patterns.js` (`id, icon, title, kind, insight, items, examples, drill`), `story.js` (`art, tint, img, alt, text` with `{{id|surface}}` markup; add `prompt` for the art brief and `grammar` naming the structure modelled) and `tests.js` questions (`type, level, tests, cluster, prompt, options[4], answer, why`). New files:

| File | Object | Fields |
| --- | --- | --- |
| `bodymap.js` | `window.BODY` | `regions:[{id, word, layer, side, path}]`, `findPrompts:[{text, region}]`, `hurtCases:[{text, region, answer, options[4]}]` |
| `writing.js` | `window.WRITING` | `missions:[{id, title, brief, model, min, max, mustUse:[ids], linkers:[], grammar}]`, `errorFlags:[{rx, says, fix}]` |
| `roleplay.js` | `window.ROLEPLAY` | `MATCH:{id:regex}`, `SCENE:{title, sub, brief, target, speakers:{them:'Coach Nok'}, turns:[{who, text}] (8 lines: 7 to answer plus the verdict), nudges[4]}` |
| `tests.js` additions | `TESTS.exam`, `TESTS.clinicShift` | exam: `{id, part, title, instructions, passage?, items[]}`; items add `answerText` for typed answers and `accept:[]` for variants |

Typed answers (word formation, open cloze, key word transformations, Name it, listen-and-spell) are compared after trimming, lowering case, collapsing spaces, turning curly quotes into straight ones (iPads type ’) and removing a final full stop. Each item lists every acceptable form in accept:[] — X-ray / xray, A and E / A&E, will pull through / is going to pull through, contracted and full forms.

**Saved progress.** Money Matters and this app both live on `pegasus028.github.io`, so they share one browser storage. Use a new key, `mu6vocab.v1` (never `moneymatters.v1`), and make ↺ clear only that key.

**Fields the reference app does not have** — define each in the engine and in the validator:

- **Recovery Ward state:** `ward:{<wordId>:{box:0–4, due:"YYYY-MM-DD", typedOk:false}}` in the saved state. Prompts are generated, not written: typed recall shows the `def` and the first letter; the MCQ gaps one `ex` sentence and draws three distractors from the same area.
- **`TESTS.clinicShift`:** `[{id, patient, route:"home"|"chemist"|"gp"|"ae", word, options[4], answer, why}]`.
- **Interactive drills:** pattern cards 1, 4 and 15 carry `game:{kind:"sort"|"scale"|"listen", slots:[…], items:[ids]}` beside the plain `drill` string; all other cards keep the string only.
- **Picture items:** `type:"picture"` with `region:<bodymap region id>`; the engine shows the body map with that region lit.
- **Levels:** badges and filter chips for A2, B1, B2, C1, C2 and "not graded" (`cefr:null`).
- **Missing synonyms:** a `null` synonym or antonym is skipped by the renderer (no empty row) and allowed by the validator.
- **Phrasal verbs:** `group:"phrasal"` for black out, come down with, pull through, pass on, get better, pick up; `group:"idiom"` for the other idioms and up and about.

## 8. Tests and anticipated exam questions

Mikii will meet these words in four kinds of test, and each asks for them differently, so the app trains all four. The textbook's own Test yourself (p.81, 40 points) asks her to **spell** body parts, **write definitions** and **rewrite sentences with an idiom**; Cambridge B2 First, which Gateway B2 is built around, adds word formation, collocation and particles; Thai school papers mix multiple choice, matching and gap fill, Triam Udom is all multiple choice, and both favour collocation, conversation and error identification; IELTS rewards the idioms in Speaking and punishes misspelling in Listening.

**Test set**

| Test | Items | Format | Purpose |
| --- | --- | --- | --- |
| Placement Check | 24 (4 per area) | 4-option MCQ, varied types | Router, not a grade: scores per area, names weak areas, filters the Word List and lights her route on Home |
| Final Check B1 | 20 | MCQ: gap, meaning, situation, collocation, picture (body map) | Everyday contexts, transparent distractors |
| Final Check B2 | 20 | MCQ incl. all 11 idioms, confusable pairs, 6 items where only grammar or collocation decides | Exam-level precision |
| Exam Room A: *Test yourself* | 8 + 9 + 7 | Unscramble body parts (typed); definitions (she writes one, then compares with a model and self-marks, then a 4-option check); idiom rewrite with a key word (typed) | Mirrors p.81 exactly, original sentences |
| Exam Room B: *B2 First Use of English* | 8 + 8 + 8 + 6 | Part 1 MC cloze, Part 2 open cloze, Part 3 word formation, Part 4 key word transformation (2–5 words), on four short health texts | Cambridge-style practice (format unofficial) |
| Exam Room C: *Thai school and TU style* | 20 | Error identification, conversation completion at the doctor's or chemist's, vocabulary in context | Multiple-choice habits of Thai papers |
| Exam Room D: *IELTS* | 10 + 6 | Listen and spell (Sonia reads a word in a clinic or gym-registration line; she types it); Speaking Part 1–3 prompts with a "say it aloud, then write two sentences" step | Spelling under pressure; idioms in speech, neutral words in writing |
| Clinic Shift | 12 cards | Route the patient + name the problem | Decision-making with the care vocabulary |
| Recovery Ward | every miss and every opened card | Leitner boxes at 0/2/4/7/14 days; typed recall alternates with MCQ; discharged after a correct typed answer at the 14-day visit | Spaced retrieval |

All MCQs follow T.Chris's standard: 4 options, one defensible answer, key position balanced, distractors from real learner errors, `why` ≤ 35 words, no option letters in feedback. Typed items accept every listed variant. Exam Room B and D carry the label "…-style practice (format unofficial)".

**What the tests must probe** — the traps an examiner will use

| Trap | Rule | Distractor to use |
| --- | --- | --- |
| hurt / injure / damage | *injure* = harm in an accident; *hurt* = pain or harm; *damage* = things and organs | *She wounded her ankle in PE* |
| ache / pain / sore / painful | *-ache* compounds (headache, stomach ache); *a pain in my chest*; *a sore throat*; *a painful knee* | *a sick throat*, *my leg is ache* |
| sick / ill | BrE *be sick* = vomit; *feel sick* = nausea; *off sick* | *I feel ill, I think I'm going to vomit (BrE: I feel sick)* |
| treat / cure / heal / recover | doctors treat; drugs cure; wounds and bones heal; people recover from | *The cut recovered* |
| relieve / relief, infect / infectious / infected | verb vs noun; *flu is infectious*, *a cut gets infected* | *some welcome relieve*, *my finger is infectious* |
| prescription / subscription | doctor's note vs regular payment | *a subscription for antibiotics* |
| come down with / come up with | start an illness vs think of an idea | *came up with a cold* |
| pass on / pass out / pass away | spread vs faint vs die (pass on can also mean die, but not in this unit) | *pass out the flu to classmates* |
| idiom particles | keep **in** shape, black **out**, full **of** beans, **under** the weather, **on** top of the world, pull **through** | the five errors on p.73 Ex 3 |
| homophones | heel / heal / he'll, waist / waste | *my heal hurts* |

Never set two acceptable answers against each other: *have a fever / have a temperature*, *chemist / pharmacy*, *pass out / black out / faint*, *come down with / go down with*, *keep / stay / get in shape*.

**Sample anticipated items** (from the research bank; the full 40-item bank with keys is in `research/exam_anticipation.md` and seeds Exam Room B and C)

| Format | Item | Key |
| --- | --- | --- |
| Word formation | After running the Bangkok half marathon in 34°C heat, Kaew collapsed from \_\_\_\_\_\_. (EXHAUST) | exhaustion |
| Word formation | Luckily, all the students were \_\_\_\_\_\_ when the minibus skidded on the wet road. (INJURE) | uninjured |
| Word formation | A cold towel on her forehead brought Bee some welcome \_\_\_\_\_\_ from the fever. (RELIEVE) | relief |
| MC cloze | I've got a \_\_\_\_\_\_ throat from cheering so loudly at sports day. A sick B hurt C sore D ill | C |
| MC cloze | The cut on Fah's knee took two weeks to \_\_\_\_\_\_ completely. A cure B treat C recover D heal | D |
| Open cloze | Fon came down \_\_\_\_\_\_ a horrible cold the day before her trip to Chiang Mai. | with |
| Key word transformation | Ning has caught a bad cold. DOWN → Ning \_\_\_\_\_\_ a bad cold. | has come down with |
| Key word transformation | Grandma is very ill, but the doctors think she will survive. PULL → … the doctors think she \_\_\_\_\_\_. | will pull through |
| Definition | **prescription** — A a regular payment for an app; B a written note from a doctor that lets you get a particular medicine; C medicine you buy without seeing a doctor; D a description of your symptoms | B |
| Error identification | (A) Last Tuesday Ning (B) came up with a (C) nasty cough, so she (D) stayed at home. | B |
| Idiom in context | Grandpa is 80, but he swims every morning and looks \_\_\_\_\_\_. A under the weather B out of shape C the picture of health D on his last legs | C |
| Grammar crossover | If you don't take this medicine, you won't feel better. UNLESS → You won't feel better \_\_\_\_\_\_ this medicine. | unless you take |

**Definition frame to teach** (p.81 Ex 2 marks a one-sentence definition): *X is a [category] who / which / where …* — "A GP is a doctor who treats common illnesses in the local area." Exam Room A shows this frame before the definition task and highlights it in the model answers.

**IELTS list for Exam Room D.** Spelling: physiotherapy, prescription, injection, dizziness, temperature, exhaustion, ankle, muscle, symptoms, X-ray. Speaking prompts: Part 1 *Is your lifestyle healthy? How do you keep in shape?*; Part 2 *Describe a time you were ill* and *Describe a sport you would like to learn*; Part 3 *Should doctors earn more than sports stars? Does traditional medicine still matter?* Tell her once, on the screen: idioms suit Speaking; essays use neutral words (*became ill*, not *came down with*).

## 9. Build order, quality gates and delivery

The app is done when every gate below passes. Build in this order so content is written against fixed ids and checked before anything is recorded or published.

1. **Contract first.** Commit `SPEC.md` (this document) and `tools/validate.js` before any content. The validator checks: every file parses; ids are unique; all 80 word ids have an entry; every story page's tags resolve; every one of the 80 ids is tagged at least once in the story; every synonym and antonym has a `lexicon.js` entry; every test item has 4 distinct options, an `answer` in range and a `tests` id whose `cluster` matches; key position is about 25% each per test and never the same 3 times running; the key is the longest option no more than 30% of the time; `why` never mentions an option letter; typed items have `answerText`; every `MATCH` regex compiles and matches its word's base form.
2. **Write in parallel** (one writer per file group): words + lexicon; story; patterns + body map; tests; writing + roleplay. Each writer reads this spec and the textbook pages, writes one file group, runs the validator and re-reads every item as a strict examiner.
3. **Independent adversarial review** by fresh reviewers, never the writers: (a) words and lexicon — definitions literally true, levels, real synonyms, British usage; (b) tests — put every option into every stem, exactly one defensible answer under Cambridge and Oxford usage, hints and `why` that do not give the answer away; (c) story, writing and roleplay — each tag's surface word has the tagged sense, grammar natural, facts true, Thai details accurate. Reviewers fix in place and list changes.
4. **Medical-accuracy pass.** One reviewer checks every health claim: no dosing amounts, no advice to skip a doctor when symptoms are serious, A and E only for emergencies, organs in the right places. When in doubt, cut the claim.
5. **Record audio last.** Every word, example sentence and story page gets a Sonia MP3 (`en-GB-SoniaNeural`, rate −10%) through `tools/tts-list.js` + `tools/make-audio.py` copied from T.Chris's Trail Mix repo (`pegasus028/GatewayA2`); reject clips under the size floor; fall back to the browser voice only when a clip is missing. Record the 80 words, their examples and the 12 pages; lexicon entries get a word clip only. Strip {{id|surface}} markup to the surface text before keying. A listen-and-spell item never shows the word if its clip fails; it skips to the next item.
6. **Browser tests** (Playwright, served over `http://127.0.0.1`): open a card and three levels of synonyms; page the whole story with audio; play Find it and Name it on the body map; finish the Placement Check and follow the route; sit Final B2 and one Exam Room set; submit one Writing Clinic mission and check the flags; finish the roleplay; no page errors; no horizontal scroll at 390 px; light and dark both readable. Run `node --check` on every JS file after any hand edit (an apostrophe in a single-quoted British string has broken an app before).
7. **Ship.** Push to `pegasus028/MU6Vocab` `main` with `.nojekyll`; tell T.Chris the one Pages step (Settings → Pages → Deploy from a branch → `main` / root); publish an artifact preview for testing on any device. The README covers editing content, `media.js`, re-recording audio and the Gemini art step.

**Content rules every writer follows**

- British spelling and usage (*A and E, GP, chemist, have a temperature, feel sick*); American terms appear only as labelled contrasts.
- No copied textbook sentences; same sense, new sentence.
- Thai contexts a 13-year-old Bangkok girl recognises; verified facts only, or facts given to fictional people.
- 4 options, exactly one defensible answer, distractors drawn from real learner errors, nothing silly; `why` ≤ 35 words and literally true.
- Age-appropriate and non-graphic: no blood, no needles close-up, no medicine doses, no self-harm themes.
- Imagery: the cast is Thai girls and women except family members; no copyrighted characters or brands as art subjects; Gemini only for the 13 storybook illustrations (12 pages and the cover); the body map and icons are drawn in code.

## 10. Sources

The full research report and the four sets of research notes (word patterns, Thai contexts, teaching methods, exam anticipation with the 40-item bank) are saved in the Mikii Project under `research/`, alongside this spec. Key references: *Gateway to the World B2* Student's Book Unit 6 pp.70–81 (Macmillan); Money Matters (`pegasus028/MU5Vocab`); Cambridge Dictionary (EVP levels, British IPA); Oxford 3000/5000; Etymonline; Lakoff and Johnson 1980; Cambridge B2 First for Schools handbook; Tinkham 1994; Karpicke and Roediger 2008; Rogers, Nakata and Chiu 2025; Yanagisawa and Webb 2022; Boers 2000; Yanagisawa et al. 2020; Sumalee and Sukying 2024; Sailer and Homner 2020; Hanus and Fox 2015; Thailand.go.th; Thairath English 2026; The Nation 2026; IDP; ielts.org.
