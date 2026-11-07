/* Hobby Café — content data.
   Hobby tuple: [name, emoji, category, energy(1 cozy · 2 steady · 3 hyper), level(1 beginner · 2 explorer · 3 master), minutes, "step 1|step 2|step 3", youtube search query]
   Videos are YouTube *searches*, so links never go stale. */

window.CATEGORIES = {
  dojo:      { name: 'Shaolin Dojo',      emoji: '🥋', mood: 'adventure', color: '#E8833A', blurb: 'Kung fu, qigong & movement — at home, no equipment.' },
  spy:       { name: 'Spy Academy',       emoji: '🕵️', mood: 'adventure', color: '#3D4A6B', blurb: 'Codes, observation, gadgets & secret missions.' },
  create:    { name: 'Art Studio',        emoji: '🎨', mood: 'drama',     color: '#D9667A', blurb: 'Make something with your hands.' },
  words:     { name: 'Reading Nook',      emoji: '📚', mood: 'drama',     color: '#8A5A3C', blurb: 'Stories, poems, letters & languages.' },
  mind:      { name: 'Puzzle Parlour',    emoji: '🧩', mood: 'adventure', color: '#5B7F6E', blurb: 'Brain games from the old magazine days.' },
  kitchen:   { name: 'Café Kitchen',      emoji: '🍙', mood: 'calm',      color: '#C98B2B', blurb: 'Bake, brew & snack experiments.' },
  nature:    { name: 'Garden Terrace',    emoji: '🌿', mood: 'calm',      color: '#4F8A4B', blurb: 'Plants, sky, birds & fresh air.' },
  music:     { name: 'Music Corner',      emoji: '🎵', mood: 'drama',     color: '#7A5BA8', blurb: 'Rhythm, voice & tiny instruments.' },
  explore:   { name: 'Adventure Board',   emoji: '🗺️', mood: 'adventure', color: '#2F7F8F', blurb: 'Solo dates & small brave outings.' },
  tinker:    { name: 'Gadget Lab',        emoji: '🔧', mood: 'adventure', color: '#5A6470', blurb: 'Build, fix & experiment.' },
  rest:      { name: 'Rest Nook',         emoji: '🛋️', mood: 'calm',      color: '#9C7FA0', blurb: 'Rest is a hobby too. Seriously.' },
};

window.HOBBIES_RAW = [
  // ── Shaolin Dojo ─────────────────────────────────────────
  ['Horse Stance Challenge','🐎','dojo',2,1,10,'Feet twice shoulder-width, toes forward|Sink hips like sitting on a stool, back straight|Hold 30s, rest 30s, repeat 5 times — add 10s each week','shaolin horse stance beginner tutorial'],
  ['Baduanjin (8 Brocades Qigong)','🌬️','dojo',1,1,15,'Find a 2 m² space and a follow-along video|Learn moves 1–3 slowly today|Breathe through the nose, move with the breath','baduanjin qigong follow along beginner'],
  ['Shaolin Basic Punches','👊','dojo',3,1,15,'Learn the straight punch from horse stance|Twist the fist at the end, pull the other hand to the hip|3 sets of 20 punches, kiai on the last one!','shaolin kung fu basic punches at home'],
  ['Kung Fu Front Kicks','🦵','dojo',3,1,15,'Warm up hips and hamstrings for 5 min|Practice the straight-leg front kick (tan tui) slowly|10 per leg, focus on balance not height','shaolin straight leg kick tutorial beginner'],
  ['Shaolin Flexibility Routine','🧘','dojo',2,1,20,'Follow a gentle kung fu stretching routine|Never bounce — breathe into each stretch|Track how far your fingers reach toward your toes','shaolin flexibility stretching routine beginner'],
  ['Five Animals Introduction','🐯','dojo',3,2,20,'Learn the five animals: tiger, crane, leopard, snake, dragon|Practice one hand-shape and stance per animal|Make up a 5-move combo flowing through all five','shaolin five animals kung fu basics'],
  ['Tai Chi 24 Form (Part 1)','☯️','dojo',1,2,20,'Learn the first 4 movements of the Yang 24 form|Move as slow as honey|Do it outside if you can','tai chi 24 form beginner lesson part 1'],
  ['Wing Chun Siu Nim Tao','🤲','dojo',2,2,20,'Learn the opening and first section of the form|Keep elbows on the centre line|Practise in front of a mirror','wing chun siu nim tao tutorial beginner'],
  ['Shadow Boxing Rounds','🥊','dojo',3,1,12,'Put on an upbeat song|3 rounds of 2 minutes: jab, cross, hook, duck|Rest 1 min between rounds','shadow boxing beginner workout 3 rounds'],
  ['Jump Rope Basics','➰','dojo',3,1,10,'Find a rope (or mime one!)|Learn the basic bounce, then alternate feet|Try 10 × 30s with 30s rest','jump rope beginner tutorial'],
  ['Broom Staff Spinning','🧹','dojo',3,2,15,'Clear space — away from lamps!|Learn the basic figure-8 staff spin with a broom handle|Swap hands and directions','bo staff spinning beginner tutorial'],
  ['Handstand Progression','🤸','dojo',3,2,15,'Wall plank: walk feet up the wall a little|Hold 20s, three times|Next week: try a kick-up against the wall','handstand progression beginner at home'],
  ['Iron Shirt Breathing','🫁','dojo',1,1,10,'Sit tall, hand on the belly|Inhale 4 counts into the belly, exhale 6 counts|Ten rounds, then notice how you feel','qigong breathing for beginners'],
  ['Kung Fu Footwork Drills','👣','dojo',2,2,15,'Learn bow stance, cat stance and empty stance|Transition between them slowly 10 times|Speed up only when it feels smooth','kung fu stances transitions tutorial'],
  ['Shaolin Morning Routine','🌅','dojo',2,3,30,'Stretch 10 min, stances 10 min, qigong 10 min|Do it right after waking, before your phone|Do it 7 days in a row = a real disciple','shaolin morning routine at home'],
  ['Learn a Tiny Kata','🥷','dojo',2,2,20,'Pick a short beginner form (karate Taikyoku Shodan works)|Learn it in 4 chunks|Perform it start-to-finish for an imaginary audience','taikyoku shodan kata tutorial'],

  // ── Spy Academy ─────────────────────────────────────────
  ['Invisible Lemon Ink','🍋','spy',1,1,15,'Squeeze lemon juice into a cup|Write a secret message with a cotton bud|Reveal it by warming the paper near a lamp (carefully!)','invisible ink lemon juice how to'],
  ['Learn Morse Code','📡','spy',1,1,15,'Learn SOS and the letters of your name|Tap them out on the table|Use the Spy HQ Morse translator to check yourself',''],
  ['Kim\'s Game (Spy Memory)','👁️','spy',1,1,10,'Put 15 random objects on a tray|Look for 60 seconds, then cover it|Write down everything you remember — try again with 20','kims game memory training'],
  ['Build a Cipher Wheel','🎡','spy',1,1,25,'Print or draw two circles with the alphabet|Pin them together in the middle|Encode a note for a friend (Caesar cipher!)','how to make a cipher wheel'],
  ['Fingerprint Detective','🔍','spy',2,2,20,'Press a finger on a glass|Dust it with cocoa powder and a soft brush|Lift it with clear tape onto white paper','dust fingerprints with cocoa powder'],
  ['Observation Walk','🚶','spy',2,1,25,'Walk your street as if you are on a mission|Note 5 things you never noticed before|Count: red doors, cats, windows with plants','situational awareness observation exercise'],
  ['Disguise Challenge','🥸','spy',2,1,20,'Change 3 things: hair, glasses/hat, posture|Take a before/after photo|Walk like your new character for 10 minutes',''],
  ['Secret Dead Drop','📦','spy',2,2,20,'Choose a safe hiding spot with a friend|Leave a coded note (use Spy HQ to encode)|Text them only a clue to find it',''],
  ['Lock Sport Basics','🔐','spy',1,3,30,'Get a clear practice lock and a beginner pick set|Learn tension wrench + single pin picking|Only ever pick locks you own!','lock picking beginner clear practice lock'],
  ['Spy Journal Log','📓','spy',1,1,10,'Write today\'s "mission report" in code name style|Agent: you. Target: one thing you learned.|Encode one sentence','',],
  ['Book Cipher','📖','spy',1,2,20,'Choose a book you and a friend both own|Encode words as page.line.word|Send a 5-word message',''],
  ['Escape Room at Home','🗝️','spy',3,3,60,'Design 3 puzzles that lead to a hidden "key"|Use ciphers, a word search, a math lock|Invite a friend to solve it','diy escape room at home ideas'],

  // ── Art Studio ─────────────────────────────────────────
  ['Daily Doodle','✏️','create',1,1,10,'Pick one object near you|Draw it in 3 minutes, 3 times|Don\'t erase anything','beginner drawing daily exercise'],
  ['Watercolor Wash Sky','🖌️','create',1,1,25,'Wet the paper with clean water|Drop blue and pink at the top, let it bleed|Add a black silhouette of trees when dry','easy watercolor sky for beginners'],
  ['Draw Your Favorite Anime Face','🌸','create',2,1,30,'Start with a circle and a cross guide|Big eyes sit on the horizontal line|Copy one reference, then draw it again from memory','how to draw anime face beginner'],
  ['Origami Crane','🕊️','create',1,1,15,'Get any square paper|Follow the crane steps slowly|Fold 3 — the third one will be beautiful','origami crane easy step by step'],
  ['Collage Mood Board','✂️','create',1,1,30,'Collect old magazines/flyers|Cut out colors and words that feel like "you"|Glue a one-page collage — no phone Pinterest allowed!','analog collage art beginner'],
  ['Hand Lettering','🖋️','create',1,1,20,'Write the alphabet with thick downstrokes, thin upstrokes|Use a normal pen and fake it by thickening downstrokes|Letter a favourite quote','faux calligraphy beginner'],
  ['Embroidery Starter','🧵','create',1,1,30,'Learn backstitch and French knot|Stitch your initial on a scrap of fabric|Add three tiny flowers','beginner embroidery stitches'],
  ['Air-Dry Clay Mini Friend','🧸','create',2,1,40,'Roll a ball body and a smaller ball head|Shape tiny ears or horns|Paint once dry','air dry clay cute figure beginner'],
  ['Eraser Stamps','🔖','create',1,2,30,'Draw a simple shape on an eraser|Carve away the background with a craft knife (carefully)|Stamp it on your letters','carving eraser stamps'],
  ['Make a Zine','📰','create',2,1,40,'Fold one A4 into an 8-page mini book|Pick a theme: "my secret life as a spy"|Fill every page with drawing + words','how to make a zine one sheet'],
  ['Blackout Poetry','⬛','create',1,1,15,'Take a printed page (old book/newspaper)|Circle words that make a poem|Black out everything else','blackout poetry tutorial'],
  ['Comic Strip','💬','create',2,2,30,'Draw 4 boxes|Setup → twist → reaction → punchline|Star yourself as a chibi','how to draw a 4 panel comic'],
  ['Crochet a Granny Square','🧶','create',1,2,45,'Learn chain, slip stitch and double crochet|Make one granny square|Keep going: 9 squares = a tiny blanket','granny square for absolute beginners'],
  ['Photography Walk','📷','create',2,1,30,'Choose one theme: "pink", "circles" or "shadows"|Take only 12 photos — make each count|Pick your best one','photography walk tips beginner'],
  ['Paper Quilling','🌀','create',1,2,30,'Cut thin paper strips|Roll coils around a toothpick|Shape them into a flower','paper quilling for beginners'],
  ['Bookbinding (Pamphlet)','📒','create',1,2,30,'Fold 5 sheets in half, nest them|Poke 3 holes along the fold|Sew with a pamphlet stitch — your own notebook!','pamphlet stitch bookbinding'],
  ['Sketch the Café','☕','create',1,2,40,'Go to a real café (or your kitchen)|Sketch the scene in 3 values: light, mid, dark|Add one person in tiny gesture lines','urban sketching cafe beginner'],
  ['Paint a Tiny Book Café','🏠','create',2,3,60,'Sketch a shopfront with big windows and bookshelves|Paint warm yellow light from the inside|Name your café on the sign',''],

  // ── Reading Nook ─────────────────────────────────────────
  ['Book Café Reading Hour','📚','words',1,1,45,'Make a drink, phone in another room|Read one chapter of any book|Write one sentence you loved',''],
  ['Morning Pages','📝','words',1,1,15,'Write 3 pages by hand right after waking|Anything goes, no rereading|Do it 5 days and notice the change','morning pages julia cameron explained'],
  ['Haiku a Day','🍂','words',1,1,10,'5-7-5 syllables|Capture one tiny moment from today|Write it on a sticky note and hide it somewhere',''],
  ['Write a Letter','💌','words',1,1,25,'Choose someone who would smile|Write by hand: a memory, a thank you, a question|Actually post it',''],
  ['Learn 10 Japanese Words','🗾','words',1,1,15,'Learn: arigatou, sugoi, oishii, kawaii, ganbatte…|Write them on cards|Use 3 of them today','basic japanese words for beginners'],
  ['Learn Hiragana Row 1','あ','words',1,2,20,'Learn あ い う え お|Write each 10 times|Find them in an anime title','learn hiragana a i u e o'],
  ['Flash Fiction (100 words)','⚡','words',2,2,25,'Prompt: "The secret was hidden in the peanut jar"|Write exactly 100 words|Read it aloud dramatically',''],
  ['Poetry Out Loud','🎭','words',2,1,15,'Pick a famous poem|Read it aloud 3 times, each with a different emotion|Record yourself once',''],
  ['Gratitude Treasure Map','🗺️','words',1,1,15,'Draw a map of your day|Mark 3 "treasures" (good moments) with an X|Write one line for each',''],
  ['Start a Commonplace Book','📔','words',1,2,20,'Get a notebook|Copy quotes, ideas, facts you find|Index them on the last page','commonplace book how to start'],
  ['Read a Manga Volume','📗','words',1,1,60,'Pick a slice-of-life or mystery manga|Read volume 1 in one sitting|Rate it in your passport',''],
  ['Write Your Own Myth','🐉','words',2,3,45,'Invent a creature that explains something (why it rains, why cats sit in boxes)|Write a one-page legend|Illustrate it',''],

  // ── Puzzle Parlour ─────────────────────────────────────────
  ['Solve a Sudoku','🔢','mind',1,1,20,'Start with an easy printed sudoku|Scan rows for missing numbers|Graduate to medium when you finish 3','how to solve sudoku beginner'],
  ['Crossword Morning','✏️','mind',1,1,25,'Do a Monday-level crossword (easiest)|Fill the ones you know first, in pen if brave|Look up only 3 answers max','crossword solving tips for beginners'],
  ['Chess Tactics','♟️','mind',1,1,20,'Learn the fork, the pin, the skewer|Solve 5 tactic puzzles on a board|Set up a position from a book','chess tactics for beginners fork pin skewer'],
  ['Rubik\'s Cube','🟥','mind',2,2,30,'Learn the white cross|Then the first layer corners|Celebrate each layer','how to solve rubiks cube beginner method'],
  ['Memory Palace','🏛️','mind',1,2,20,'Picture your home, room by room|Place 10 items from a list in 10 locations|Walk through and recall them','memory palace technique beginner'],
  ['Logic Grid Puzzle','🧠','mind',1,2,20,'Get a printable logic grid puzzle|Mark X for impossible, ✓ for sure|Never guess — deduce!','logic grid puzzle how to solve'],
  ['Card Magic Trick','🃏','mind',2,1,25,'Learn one self-working card trick|Practise the patter (the story you tell)|Perform it for someone','easy self working card trick'],
  ['Make a Word Search','🔤','mind',1,1,15,'Open the Puzzle Corner maker|Use your friend\'s favourite things as words|Print it and give it to them',''],
  ['Tangram Shapes','🔷','mind',1,1,15,'Cut a square into the 7 tangram pieces|Make a cat, a boat, a running person|Invent your own shape','tangram puzzle diy'],
  ['Riddle Hour','❓','mind',1,1,10,'Do 5 riddles in the Puzzle Corner|Write down one riddle of your own|Test it on someone',''],
  ['Speed Mental Math','⚡','mind',2,1,10,'Open the Math Dojo|Do one round|Beat your score tomorrow',''],
  ['Juggling 3 Balls','🤹','mind',2,2,15,'Start with one ball, arc to eye level|Two balls: throw, throw, catch, catch|Three: be patient, it clicks suddenly','learn to juggle 3 balls'],
  ['Solve a Jigsaw','🧩','mind',1,1,60,'Find a 300–500 piece puzzle|Edges first, then sort by colour|Put on lo-fi music',''],

  // ── Café Kitchen ─────────────────────────────────────────
  ['Peanut Butter Cookies','🥜','kitchen',2,1,30,'1 cup peanut butter, 1 cup sugar, 1 egg|Roll balls, fork cross-hatch on top|Bake 10 min at 180°C — spy fuel','3 ingredient peanut butter cookies'],
  ['Onigiri Rice Balls','🍙','kitchen',2,1,30,'Cook short-grain rice|Wet + salt your hands, shape triangles|Wrap with nori, fill with anything','how to make onigiri'],
  ['Tea Tasting Ceremony','🍵','kitchen',1,1,20,'Brew 3 different teas|Smell, sip, describe each in 3 words|Pick a winner',''],
  ['Pancake Art','🥞','kitchen',2,2,30,'Put batter in a squeeze bottle|Draw an outline first, let it brown|Fill it in and flip','pancake art for beginners'],
  ['Simple Bread Loaf','🍞','kitchen',2,2,180,'Mix flour, water, yeast, salt|Knead 10 min (great arm workout)|Rise, shape, bake — the house will smell amazing','easy beginner bread recipe'],
  ['Dalgona Coffee / Latte Art','☕','kitchen',1,1,15,'Whip instant coffee, sugar, hot water 1:1:1|Spoon onto milk|Try drawing a heart on top','dalgona coffee recipe'],
  ['Homemade Dumplings','🥟','kitchen',2,2,60,'Buy wrappers, make a simple filling|Learn one pleat fold|Pan-fry: crispy bottoms!','how to fold dumplings easy'],
  ['Fruit Mochi','🍡','kitchen',2,2,40,'Microwave glutinous rice flour + sugar + water|Wrap around a strawberry|Dust with starch','strawberry mochi easy microwave'],
  ['Invent a Smoothie','🥤','kitchen',1,1,10,'Pick: 1 fruit, 1 green, 1 creamy, 1 surprise|Blend and name it|Rate it out of 10',''],
  ['Quick Kimchi','🌶️','kitchen',2,3,60,'Salt napa cabbage 1 hour|Mix gochugaru paste|Jar it and wait for the fermentation magic','easy quick kimchi recipe'],

  // ── Garden Terrace ─────────────────────────────────────────
  ['Cloud Watching','☁️','nature',1,1,15,'Lie down outside or by a window|Find 3 animals in the clouds|Learn one cloud name (cumulus!)',''],
  ['Propagate a Plant','🪴','nature',1,1,15,'Snip a pothos or mint cutting below a node|Put it in water by a window|Watch roots appear in ~2 weeks','propagate pothos in water'],
  ['Birdwatching','🐦','nature',1,1,30,'Sit still near trees for 20 min|Count every bird you see|Identify one by colour and call','birdwatching for beginners'],
  ['Stargazing','🌌','nature',1,1,30,'Go somewhere dark, let eyes adjust 15 min|Find the Big Dipper or Orion|Spot a planet (it doesn\'t twinkle)','stargazing for beginners'],
  ['Jar Terrarium','🫙','nature',2,2,40,'Layer pebbles, charcoal, soil|Add moss and a small plant|Add a tiny figurine — a spy, obviously','closed terrarium for beginners'],
  ['Pressed Flowers','🌼','nature',1,1,20,'Collect small flat flowers|Press inside a heavy book with paper for 2 weeks|Make a bookmark with them','how to press flowers in a book'],
  ['Sunrise Mission','🌄','nature',2,1,40,'Set an alarm 20 min before sunrise|Go outside with a warm drink|No photos for the first 5 minutes',''],
  ['Grow Herbs on a Windowsill','🌱','nature',1,1,20,'Get basil or mint seeds/pot|Sunny window, water when dry|Cook with your first leaves',''],
  ['Nature Sound Map','🗺️','nature',1,1,15,'Sit outside, close your eyes|Draw yourself in the middle of a page|Mark every sound where you hear it',''],
  ['Leaf Rubbing Art','🍁','nature',1,1,15,'Collect 5 different leaves|Place under paper, rub with crayon side|Label each tree',''],

  // ── Music Corner ─────────────────────────────────────────
  ['Kalimba First Song','🎶','music',1,1,20,'Get a cheap kalimba|Learn the tines numbered 1–7|Play "Twinkle Twinkle"','kalimba beginner first song'],
  ['Ukulele 4 Chords','🎸','music',2,1,25,'Learn C, Am, F, G|Strum down-down-up-up-down-up|Play a song that uses all four','ukulele 4 chords beginner'],
  ['Body Percussion','👏','music',2,1,10,'Clap, snap, chest-tap, stomp|Make a 4-beat loop|Speed it up','body percussion beginner'],
  ['Beatbox Basics','🎤','music',3,1,15,'Learn "b" kick, "t" hi-hat, "k" snare|Make: b t k t b b k t|Record 15 seconds','beatbox tutorial for beginners'],
  ['Sing in the Shower Pro','🚿','music',2,1,15,'Pick a song you love|Learn the lyrics fully (no reading!)|Perform it with full drama',''],
  ['Learn a Piano Melody','🎹','music',1,2,30,'Use any keyboard (or a free app on a tablet)|Learn the right hand of one melody|Play it 5 times without stopping','easy piano melody beginner right hand'],
  ['Learn a Dance','💃','music',3,1,20,'Pick a short choreography video|Learn it in 8-count chunks at 0.5× speed|Perform it full speed for your mirror','easy dance tutorial beginner mirrored'],
  ['Humming Meditation','🐝','music',1,1,10,'Sit comfortably|Hum on each exhale for 5 minutes|Notice the buzz in your face',''],
  ['Rhythm Game with Pots','🥁','music',3,1,15,'Gather pots, pans, wooden spoons|Play along to one song|Find the deepest "bass" pot',''],

  // ── Adventure Board ─────────────────────────────────────────
  ['Solo Café Date','☕','explore',2,1,60,'Go to a café you\'ve never tried|Bring a book or sketchbook, not your feed|Order something new',''],
  ['Museum Mission','🏛️','explore',2,1,90,'Visit a museum or gallery|Find the strangest object there|Sketch or describe it',''],
  ['Take a Different Route','🧭','explore',2,1,30,'Go somewhere familiar a new way|Get gently lost for 10 minutes|Find one new shop or tree',''],
  ['Library Expedition','🏫','explore',2,1,60,'Go to a library|Pick a book from a random shelf number|Read its first page',''],
  ['Picnic for One','🧺','explore',2,1,60,'Pack 3 snacks and a drink|Find a park bench or grass|Stay until you feel unhurried',''],
  ['Volunteer Hour','💛','explore',2,2,90,'Find a local shelter, library or garden that needs help|Sign up for one shift|Notice how your heart feels after',''],
  ['Random Bus/Train Ride','🚌','explore',2,2,90,'Hop on a route you\'ve never taken|Get off at stop number 5|Explore for 30 minutes',''],
  ['Board Game Night','🎲','explore',2,1,90,'Invite 1–3 friends|Pick a light game (Codenames is very spy)|Snacks mandatory','codenames how to play'],
  ['Try a Class','🎟️','explore',3,2,90,'Book one beginner class: pottery, climbing, dance, martial arts|Go alone — beginners are all nervous|Talk to one person',''],
  ['Bouldering','🧗','explore',3,2,90,'Visit a climbing gym, rent shoes|Start with the easiest colour|Climb down, don\'t jump','bouldering for beginners'],

  // ── Gadget Lab ─────────────────────────────────────────
  ['Paper Airplane Contest','✈️','tinker',2,1,20,'Fold 3 different designs|Fly each 3 times|Measure the best distance','best paper airplane that flies far'],
  ['Grow Salt Crystals','💎','tinker',1,1,20,'Dissolve salt in hot water until no more dissolves|Hang a string into the jar|Check it every day for a week','grow salt crystals at home'],
  ['Make a Tiny Web Game','🕹️','tinker',2,3,60,'Learn HTML + a little JavaScript|Make a "guess the number" game|Share it with a friend','javascript guess the number game beginner'],
  ['Fix Something Broken','🪛','tinker',2,2,40,'Find one broken thing at home|Watch a repair video|Fix it (or learn why it\'s broken)',''],
  ['Simple Circuit','💡','tinker',2,2,30,'Get a coin battery, LED and tape|Make the LED light up|Build a light-up card','led throwie paper circuit card'],
  ['Marble Run','🧪','tinker',2,1,40,'Collect toilet rolls, tape, cardboard|Build a run down a wall|Time the marble',''],
  ['Pinhole Camera','📦','tinker',1,2,40,'Use a shoebox and foil|Poke a tiny pinhole|See the world upside down inside','pinhole camera shoebox diy'],

  // ── Rest Nook ─────────────────────────────────────────
  ['Tea & Window','🫖','rest',1,1,15,'Make a warm drink|Sit by a window, no screens|Just watch for 10 minutes. That\'s it.',''],
  ['Box Breathing','🟦','rest',1,1,5,'Use the breathing guide in the Rest Nook|In 4, hold 4, out 4, hold 4|5 rounds',''],
  ['Yoga Nidra','🌙','rest',1,1,25,'Lie down with a blanket|Follow a guided yoga nidra audio|It\'s fine to fall asleep','yoga nidra 20 minutes'],
  ['Cozy Bath Ritual','🛁','rest',1,1,30,'Warm bath, candle, calm music|No phone in the bathroom|Read one chapter of a book',''],
  ['Gentle Stretch','🧘','rest',1,1,10,'Neck rolls, shoulder rolls, forward fold|Hold each 30 seconds|Breathe slowly','gentle stretch 10 minutes'],
  ['Power Nap','😴','rest',1,1,20,'Set a 20-minute alarm|Lie down, eye mask if you have one|Wake up and drink water',''],
  ['Digital Sunset','🌇','rest',1,2,60,'At 9pm, phone goes to another room|Read, journal, or stretch instead|Notice your sleep',''],
  ['Do Absolutely Nothing','🍃','rest',1,1,10,'Use the "do nothing" timer in the Rest Nook|No phone, no book, no plan|Let your mind wander',''],
  ['Self-Massage','💆','rest',1,1,15,'Massage hands, then feet, then shoulders|Use a tennis ball for your back on a wall|Slow and kind','self massage for relaxation'],
];

window.HOBBIES = window.HOBBIES_RAW.map((h, i) => ({
  id: 'h' + i + '-' + h[0].toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 24),
  name: h[0], emoji: h[1], cat: h[2], energy: h[3], level: h[4], mins: h[5],
  steps: h[6].split('|'), yt: h[7] || '',
}));

/* ── Companion lines ─────────────────────────────────────── */
window.LINES = {
  greet: [
    'Welcome back to Hobby Café! I already read your mind… you want an adventure. Heh.',
    'Waku waku! The café is open and I have a mission for you!',
    'Agent, report! What\'s your energy today?',
    'I saved you the window seat. And a peanut. Okay I ate the peanut.',
    'No doom-scrolling allowed here. Only fun-scrolling. Through hobbies. With me.',
  ],
  low:   ['Low battery? Then a cozy mission. Even spies need tea breaks.', 'Soft day. Let\'s do something gentle and nice.'],
  mid:   ['Steady energy! Perfect for learning something new.', 'Medium power. Medium mission. Maximum fun.'],
  high:  ['HYPER MODE! Let\'s move! Kung fu time?!', 'So much energy! The café can\'t hold you! Go go go!'],
  pick:  ['Ooh, my telepath-sense says THIS one:', 'Top secret recommendation:', 'I think you\'d be SO good at this:', 'Mission briefing incoming:'],
  done:  ['MISSION COMPLETE! You\'re so cool. Elegant, even.', 'You did it! Stamp earned! I\'m telling everyone.', 'Wow, a real hobby hero. Heh.'],
  rescue:['Caught you scrolling! Phone down, let\'s do this instead:', 'Scroll detected. Counter-mission activated:'],
  math:  ['Math makes my head spin… but YOU can do it!', 'Numbers are just secret codes in disguise.'],
  spy:   ['Shh. This message self-destructs… in like, never.', 'Decode it and you get promoted to secret agent first class.'],
};

/* ── Five-minute doom-scroll rescue missions (all off-screen) ── */
window.RESCUES = [
  'Do 10 kung fu punches by the window. Kiai on the last one!',
  'Drink a full glass of water, slowly, looking outside.',
  'Hold horse stance for 45 seconds.',
  'Draw the nearest object in 2 minutes.',
  'Write a haiku about the last thing you saw on your screen.',
  'Stretch: reach for the ceiling, then touch your toes. 5 times.',
  'Tidy one tiny surface — just one!',
  'Step outside (or open a window) and name 5 sounds.',
  'Hum your favourite song all the way through.',
  'Solve one riddle in the Puzzle Corner, then put the device down.',
  'Text a friend a secret code from Spy HQ instead of scrolling.',
  'Make tea. Watch the steam. That\'s the whole mission.',
  'Box-breathe 4 rounds: in 4, hold 4, out 4, hold 4.',
  'Fold one origami thing from any paper.',
  'Write 3 things you are looking forward to.',
];

/* ── Puzzle content ─────────────────────────────────────── */
window.WORD_THEMES = {
  'Spy Kit':     ['CIPHER','AGENT','DISGUISE','MISSION','SECRET','GADGET','DECODE','CLUE','SHADOW','CODE','TARGET','RADIO'],
  'Book Café':   ['LATTE','NOVEL','CHAPTER','SCONE','PAGES','MOCHA','SHELF','STORY','COZY','BOOKMARK','POETRY','TEA'],
  'Dojo':        ['KUNGFU','STANCE','QIGONG','CRANE','TIGER','DRAGON','BALANCE','KICK','PUNCH','BREATH','FORM','MASTER'],
  'Garden':      ['MOSS','FERN','BLOSSOM','SEED','ROOTS','BASIL','PETAL','SUNLIGHT','CLOVER','IVY','TULIP','BEE'],
  'Snacks':      ['PEANUT','MOCHI','COOKIE','DUMPLING','ONIGIRI','PANCAKE','HONEY','WAFFLE','NOODLE','BUN','MANGO','TOAST'],
};

window.SCRAMBLE_WORDS = [
  ['PEANUT','Anya-approved snack'],['CIPHER','A secret writing system'],['ORIGAMI','Folding paper art'],['LIBRARY','Home of many books'],
  ['KUNGFU','Shaolin skill'],['TELESCOPE','For looking at stars'],['MYSTERY','A puzzling story'],['ADVENTURE','A bold experience'],
  ['CAPPUCCINO','Foamy coffee'],['WATERCOLOR','A painting medium'],['DETECTIVE','Solves cases'],['MEDITATION','Calm mind practice'],
  ['UKULELE','Small 4-string instrument'],['TERRARIUM','Garden in a jar'],['SUDOKU','Number grid puzzle'],['ALGEBRA','Math with letters'],
  ['DISGUISE','Spy costume'],['BLOSSOM','A flower opening'],['ELEGANT','Stylish and graceful'],['TELEPATHY','Reading minds'],
  ['JOURNAL','Daily diary'],['CRYSTAL','Grows from salt'],['STARGAZE','Look at the night sky'],['PASSPORT','Collects stamps'],
];

window.RIDDLES = [
  ['What has keys but can\'t open locks?', 'A piano'],
  ['What has to be broken before you can use it?', 'An egg'],
  ['I\'m tall when I\'m young and short when I\'m old. What am I?', 'A candle'],
  ['What has many pages but is not a book? (Hint: a café has one)', 'A menu'],
  ['What gets wetter the more it dries?', 'A towel'],
  ['What can you catch but not throw?', 'A cold'],
  ['What has a neck but no head?', 'A bottle'],
  ['The more of this there is, the less you see. What is it?', 'Darkness'],
  ['What goes up but never comes down?', 'Your age'],
  ['What has one eye but can\'t see?', 'A needle'],
  ['What belongs to you, but others use it more than you do?', 'Your name'],
  ['What can travel around the world while staying in a corner?', 'A stamp'],
  ['What has hands but can\'t clap?', 'A clock'],
  ['I speak without a mouth and hear without ears. I have no body, but I come alive with wind.', 'An echo'],
  ['What is full of holes but still holds water?', 'A sponge'],
  ['If you have me, you want to share me. If you share me, you haven\'t got me.', 'A secret'],
  ['What has a head and a tail but no body?', 'A coin'],
  ['What runs but never walks, has a mouth but never talks?', 'A river'],
  ['What comes once in a minute, twice in a moment, but never in a thousand years?', 'The letter M'],
  ['What word is spelled wrong in every dictionary?', 'Wrong'],
  ['Forward I am heavy, backward I am not. What am I?', 'Ton'],
  ['What building has the most stories?', 'A library'],
  ['What can fill a room but takes up no space?', 'Light'],
  ['What has cities but no houses, forests but no trees, water but no fish?', 'A map'],
  ['A spy enters a room with 3 switches outside. Only one controls the lamp inside, and the spy may enter once. How do they find it?', 'Turn switch 1 on for a while, then off. Turn 2 on and enter. Lit = 2, warm bulb = 1, cold & off = 3.'],
];

window.SECRET_MESSAGES = [
  'THE PEANUTS ARE HIDDEN IN THE LIBRARY',
  'MEET ME AT THE BOOK CAFE AT NOON',
  'TODAY YOU TRY SOMETHING NEW',
  'THE OWL FLIES AT MIDNIGHT',
  'YOUR MISSION IS TO HAVE FUN',
  'BRING TEA AND A GOOD BOOK',
  'THE CODE WORD IS ELEGANT',
  'HORSE STANCE FOR ONE MINUTE',
  'LOOK UNDER THE THIRD SHELF',
  'A BRAVE HEART LEARNS EVERY DAY',
  'DRAW SOMETHING YOU CAN SEE',
  'THE GARDEN HOLDS THE ANSWER',
  'CALL A FRIEND AND SAY HELLO',
  'YOU ARE DOING GREAT AGENT',
];
