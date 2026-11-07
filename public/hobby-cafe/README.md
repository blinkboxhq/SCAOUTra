# ☕ Hobby Café

A personal anti-doom-scroll app: a cozy book café where your companion hands you hobby missions.

- **Café**: pick your energy (cozy / steady / hyper) and craving (adventure / drama / calm), and get an idea. Also includes a doom-scroll rescue, today's special and a daily secret mission.
- **Menu**: 126 beginner-to-master hobbies in 11 rooms (Shaolin Dojo, Spy Academy, Art Studio, Reading Nook, Puzzle Parlour, Kitchen, Garden, Music, Adventure, Gadget Lab, Rest Nook). Each one has steps and a YouTube tutorial search.
- **Missions**: a parchment "Secret Mission" scroll with a timer, step checklist, screen-off mode and a journal note. Each mission stamps your passport.
- **Puzzle Corner**: word search, word scramble, riddles, and a printable word-search maker for friends.
- **Spy HQ**: a daily coded message plus a Code Machine (Caesar, Atbash, A1Z26, Morse, mirror, keyword) and shareable friend-challenge links.
- **Math Dojo**: 9 belts, from white (addition) to black (word problems & probability). Score 8/10 to earn the next belt.
- **Rest Nook**: box and 4-7-8 breathing, plus a do-nothing timer.
- **Passport**: XP, levels, streaks, stamps, wishlist, journal, and a **mood album**: add your own pictures of your companion for 6 moods (stored on this device only).

Everything is saved on your device only (localStorage). It works offline and can be installed as an app
(Safari on iPhone: Share, then Add to Home Screen. Chrome/Edge on a Mac: the install icon in the address bar).

Run it locally: `python3 -m http.server` in this folder, then open http://localhost:8000.
When deployed with the site, it lives at `/hobby-cafe/`. Pure HTML/CSS/JS, no build step.

Add hobbies in `data.js` (one line each). Edit companion lines in `LINES`.
