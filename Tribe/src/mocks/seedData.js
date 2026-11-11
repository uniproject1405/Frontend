// Large demo data set used to stress the UI: long lists, full/closed projects,
// pending / accepted / rejected requests and 40+ notifications.
import currentUser from "../services/currentUser";

export const SEED_VERSION = "5";

const HOUR = 3600 * 1000;
const ago = (hours) => new Date(Date.now() - hours * HOUR).toISOString();

const person = (id, name, headline, bio, skills) => ({ id: `user-${id}`, name, headline, bio, skills });

const people = {
  sara: person("sara", "Sara M.", "Machine learning engineer", "I turned a thesis on spaced repetition into a side project that now has real users. I like small weekly goals, honest code reviews and teammates who ask questions early.", ["Python", "PyTorch", "React"]),
  ali: person("ali", "Ali R.", "Full-stack developer and community organiser", "Ran a 400-person local dev meetup for three years. I build things that help people find each other and I keep meetings short.", ["Node.js", "React", "PostgreSQL"]),
  mina: person("mina", "Mina K.", "Sustainability data analyst", "Day job: carbon accounting for mid-size companies. Night job: making that data feel friendly to normal people.", ["Data Analysis", "JavaScript", "Design"]),
  omid: person("omid", "Omid T.", "Mobile developer", "Eight years of shipping React Native apps. Learned Spanish through exchange partners, so this one is personal.", ["React Native", "WebRTC", "UI/UX"]),
  leila: person("leila", "Leila H.", "Product designer", "I design for people who feel anxious about money. Warm tone, clear numbers, no guilt.", ["Design", "React", "Charts"]),
  reza: person("reza", "Reza P.", "GIS developer and daily cyclist", "I map bike infrastructure for the city council and want that data to live somewhere citizens can improve it.", ["Maps", "React", "Data Analysis"]),
  nazanin: person("nazanin", "Nazanin S.", "Audio producer", "Produced two small podcasts from zero. I know exactly which mistakes beginners make in their first ten episodes.", ["Audio", "Writing", "React"]),
  kian: person("kian", "Kian B.", "iOS developer", "Built a meditation app used by a few thousand people. Strong opinions about gentle notifications.", ["Swift", "UX Research", "Writing"]),
  dina: person("dina", "Dina F.", "Technical writer", "I write docs for developer tools and believe a good README is the best marketing a small project can have.", ["Docs", "Node.js", "Writing"]),
  arman: person("arman", "Arman Z.", "Backend engineer and weekend photographer", "Fifteen years of field photos on a hard drive and no good way to share them. That is the whole origin story.", ["Photography", "Python", "Maps"]),
  yasaman: person("yasaman", "Yasaman Q.", "Frontend developer", "Accessibility is my favourite part of the job. Happy to review any UI for keyboard and screen reader use.", ["React", "Accessibility", "CSS"]),
  pouya: person("pouya", "Pouya D.", "Computer science student", "Final-year student looking for a real team to learn from. Reliable, curious and always on time.", ["React", "Firebase", "Git"]),
};
const peopleList = Object.values(people);

// Everyone's public profile by id (used for member lists).
export const seedDirectory = Object.fromEntries(peopleList.map((x) => [x.id, x]));

// Projects without an owner entry belong to the current user.
export const seedOwners = {
  "project-1": people.sara,
  "project-2": people.ali,
  "project-3": people.mina,
  "other-4": people.omid,
  "other-5": people.leila,
  "other-6": people.reza,
  "other-7": people.nazanin,
  "other-8": people.kian,
  "other-9": people.dina,
  "other-10": people.arman,
};

const longText =
  "This project brings together people who care about making everyday tools easier to use. We meet twice a week, share progress openly and review each other's work. ".repeat(
    5
  );

// extra: { commitment, lookingFor: [], milestones: [] } — all optional.
const p = (id, title, goal, description, requiredSkills, capacity, status = "open", hoursAgo = 48, extra = {}) => ({
  id, title, goal, description, requiredSkills, capacity, status, createdAt: ago(hoursAgo), ...extra,
});

export const seedProjects = [
  p("project-1", "AI Study Assistant", "Build an intelligent study companion that plans your week and quizzes you at the right moment.",
    "Most students do not fail from lack of effort; they fail from poor timing. This assistant reads your syllabus and deadlines, builds a realistic weekly plan, and uses spaced repetition to quiz you on the right topic on the right day.\n\nThe first version is a web app with a calendar view, a flash-card generator that turns lecture notes into questions, and a gentle daily summary. We are using a small open model for question generation, so no paid API is needed to run it.\n\nWe already have a working prototype of the planner and about forty students testing it. What we need now is a polished interface and a better recommendation model.",
    ["React", "Python", "Machine Learning"], 5, "open", 300,
    { commitment: "About 6 hours a week. One 45-minute call on Wednesday evening, async the rest of the time.", lookingFor: ["A frontend developer who enjoys calendar and drag-and-drop interfaces", "An ML engineer to improve question quality and scheduling", "A designer who can make studying feel calm, not stressful"], milestones: ["Week 2: onboarding flow and syllabus import", "Week 5: flash-card generator beta with 40 testers", "Week 8: public launch for one university"] }),
  p("project-2", "Community Platform", "Connect people through shared interests, one small group at a time.",
    "Big social networks are built for scrolling. This platform is built for meeting: small, topic-based communities with a weekly prompt, a shared calendar and a simple way to organise real-life meetups.\n\nWe have spent two months on research with local clubs (chess, climbing, book clubs, hackathon crews) and learned that organisers need three things: a member list that stays tidy, a fast way to announce events, and no ads. The prototype covers the first two.\n\nWe are looking for people who have run or joined a community and know what annoys them about the tools they use today.",
    ["React", "Node.js", "UI/UX"], 4, "open", 280,
    { commitment: "5 to 8 hours a week. Stand-up in chat every Monday, demo every other Friday.", lookingFor: ["A UI/UX designer for the event and member pages", "A Node.js developer for notifications and calendar sync", "Someone who has organised a community and can test with us"], milestones: ["Month 1: groups, members and weekly prompts", "Month 2: events with reminders and calendar export", "Month 3: invite 5 real communities and collect feedback"] }),
  p("project-3", "Eco Tracker", "Help users see and shrink their environmental impact without guilt.",
    "Eco Tracker turns everyday choices (commute, food, heating, shopping) into a simple weekly footprint. Instead of a score to feel bad about, it suggests one small change per week and shows what it saves over a year.\n\nThe emission factors come from public datasets that we clean and document openly. The goal is to be the most transparent footprint calculator on the web: every number links to its source.\n\nThe team is complete and the project is closed to new members while we finish the first public release.",
    ["JavaScript", "Data Analysis", "Design"], 3, "closed", 260,
    { commitment: "4 hours a week, mostly evenings.", lookingFor: ["Team complete for now"], milestones: ["Done: footprint calculator", "In progress: weekly suggestions and sources page", "Next: public release and open data export"] }),
  p("mine-1", "Campus Event Finder", "One place for every talk, club night and workshop on campus.",
    "Event posters pile up on notice boards, group chats and four different student union pages, and everybody still misses the good stuff. Campus Event Finder gathers them into one mobile-friendly site with filters, reminders and one-tap calendar export.\n\nClubs post events through a simple form (under a minute). Students follow clubs and tags, and get one short weekly digest instead of constant pings. We are piloting with three clubs this term.\n\nI am handling the product and the backend; I would love teammates for the interface, the data model and a bit of outreach to clubs.",
    ["React", "UI/UX", "Firebase"], 5, "open", 120,
    { commitment: "About 5 hours a week. Weekly 30-minute call on Sunday evening.", lookingFor: ["A frontend developer comfortable with React and responsive layouts", "A designer for the event card and the weekly digest email", "A student ambassador who knows the clubs"], milestones: ["Week 3: club sign-up and event form", "Week 6: filters, reminders and calendar export", "Week 9: pilot with 3 clubs and 200 students"] }),
  p("mine-2", "Open Recipe Book", "Share family recipes with the world, in every language.",
    "A community cookbook where anyone can add a recipe, tweak it, and translate it. Every recipe keeps a history, so you can see how grandma's version became yours.\n\nThe core is already built: recipe pages, versions, translations and printable cards. The team is full and now polishing the contribution flow before opening to the public.",
    ["Node.js", "Design", "Writing"], 3, "open", 200,
    { commitment: "3 to 4 hours a week, async.", lookingFor: ["Team is full; join the waiting list by sending a request"], milestones: ["Done: recipe pages and versions", "In progress: translation workflow", "Next: public beta with 50 family recipes"] }),
  p("mine-3", "Neighborhood Tool Library", "Borrow tools instead of buying them.",
    "A lending system for ladders, drills and more, run by neighbours. Each item has a keeper, a pickup window and a simple condition log so tools come back in good shape.\n\nThe pilot ran on one street for a season with 31 items and 14 households. This project is closed while we write up what we learned.",
    ["React", "Maps", "Testing"], 4, "closed", 400,
    { commitment: "Paused.", lookingFor: ["Closed for now"], milestones: ["Done: pilot on Maple Street", "Next: write-up and decide on a second neighbourhood"] }),
  p("mine-4", "Pixel Garden Game", "A calm gardening game in pixel art, playable in the browser in five minutes a day.",
    "No timers that punish you, no shop. You plant, water, wait and watch a tiny garden grow while soft music plays. The idea came from wanting a game that fits into a coffee break and leaves you calmer than before.\n\nI have the planting and growth loop working with placeholder art. Looking for my first teammate: a pixel artist or a game developer who likes small, polished things.",
    ["Game Dev", "Pixel Art"], 3, "open", 10,
    { commitment: "A few hours a week, flexible. Weekend jam sessions when we feel like it.", lookingFor: ["A pixel artist for plants, tiles and a small character", "A game developer to help with save data and sound"], milestones: ["Week 2: five plants with growth stages", "Week 4: day and night cycle", "Week 6: itch.io release"] }),
  p("mine-5", "A Very Long Project Title That Keeps Going To Test How Wrapping Works In Cards Headers And Lists Everywhere", "An extremely detailed goal sentence that is much longer than anyone should write but must still fit on screen gracefully.", longText, ["React", "TypeScript", "Accessibility", "Design Systems", "Testing", "Node.js", "GraphQL", "CI/CD", "Docs", "Figma", "Motion", "i18n"], 12, "open", 30),
  p("other-4", "Language Exchange App", "Practise a language with a native speaker in short, friendly video chats.",
    "Textbooks teach words; conversation teaches speaking. This app pairs learners who want to swap languages for 20-minute video chats, with a shared practice sheet of topics and phrases so nobody freezes.\n\nMatching uses language level, time zone and interests. After each call you leave a one-tap note, which slowly builds a picture of who you click with.\n\nThe prototype supports Spanish, Persian, German and English. The team is nearly full and shipping the first mobile build next month.",
    ["React Native", "WebRTC", "UI/UX"], 4, "open", 150,
    { commitment: "6 hours a week. Tuesday and Saturday check-ins.", lookingFor: ["A WebRTC developer to harden call quality on poor networks", "A UX researcher to run five learner interviews"], milestones: ["Done: matching and scheduling", "In progress: call screen and practice sheets", "Next: TestFlight beta"] }),
  p("other-5", "Budget Buddy", "Make personal budgeting friendly instead of stressful.",
    "Budget apps are usually spreadsheets in disguise. Budget Buddy is built around a single weekly question: what did you spend, and how did it feel? It shows a short summary, one gentle nudge and a clear view of what is left, without red numbers or guilt.\n\nWe import bank files from CSV so no one has to hand over credentials. Everything stays on the device unless you choose to sync.\n\nI am designing and building the front end; I need a developer comfortable with charts and a teammate for testing with real households.",
    ["React", "Charts", "Design"], 3, "open", 170,
    { commitment: "5 hours a week, flexible hours.", lookingFor: ["A developer experienced with chart libraries", "A tester who can recruit 5 households"], milestones: ["Done: CSV import", "In progress: weekly summary", "Next: private beta with 20 users"] }),
  p("other-6", "City Bike Map", "Safe cycling routes for the city, drawn and checked by the people who ride them.",
    "Official bike maps are often out of date: lanes end without warning and repair stations are missing. City Bike Map is a crowd-sourced layer where riders mark safe lanes, broken glass, dangerous junctions and pumps, with photos and a confidence score based on how many people confirmed it.\n\nI work with city GIS data, so we start with real lane geometry and let riders correct it. The goal is a route planner that picks the safest path, not just the shortest.\n\nWe need people for the map interface, data cleaning and the routing logic.",
    ["Maps", "React", "Data Analysis"], 5, "open", 90,
    { commitment: "6 to 8 hours a week. We ride together on Saturdays to survey routes.", lookingFor: ["A frontend developer with map library experience", "A data person to clean lane geometry", "A rider who can help test routes in the neighbourhoods we do not cover"], milestones: ["Month 1: base map with official lanes", "Month 2: rider reports and photos", "Month 3: safest-route planner beta"] }),
  p("other-7", "Podcast Studio Toolkit", "Everything a first-time podcaster needs before episode one.",
    "Starting a podcast is mostly small decisions: format, length, gear, publishing. This toolkit offers checklists, script templates and an episode planner that turns an idea into an outline, a recording checklist and show notes.\n\nI have produced two shows and keep a list of beginner mistakes; this project turns that list into tools. All templates will be free and open.",
    ["Audio", "Writing", "React"], 4, "open", 75,
    { commitment: "3 to 5 hours a week, async with a monthly call.", lookingFor: ["A writer for the guides", "A React developer for the planner", "An audio engineer to review the gear advice"], milestones: ["Week 3: checklists and templates", "Week 6: episode planner", "Week 10: launch with 3 partner shows"] }),
  p("other-8", "Mental Health Check-in", "A kind daily check-in app that notices patterns before you do.",
    "A 30-second daily check-in: mood, energy, one sentence. Over time the app surfaces gentle patterns (poor sleep before low days, walks before good ones) and lets you share a summary with a trusted friend, never with advertisers.\n\nPrivacy is the product: data stays on your device and is encrypted if you choose to back up. We work with a counsellor who reviews every piece of copy for tone.\n\nThis is a sensitive area, so we value care and reliability over speed.",
    ["Swift", "UX Research", "Writing"], 3, "open", 60,
    { commitment: "5 hours a week. Weekly review of copy and flows with our counsellor.", lookingFor: ["A UX researcher with interview experience", "A writer who can do warm, plain language"], milestones: ["Done: check-in flow", "In progress: pattern insights", "Next: trusted-friend sharing"] }),
  p("other-9", "Open Source Docs Hub", "Better docs for small open source projects, with templates you can copy in a minute.",
    "Many great libraries fail to get users because the docs are thin. This hub offers a README template, a docs site generator preset and a checklist that takes a maintainer from nothing to a decent docs site in an afternoon.\n\nThe team is small on purpose and currently full.",
    ["Docs", "Node.js"], 2, "open", 500,
    { commitment: "3 hours a week.", lookingFor: ["Team is full"], milestones: ["Done: README template", "Done: docs site preset", "Next: maintainers' checklist"] }),
  p("other-10", "Wildlife Photo Atlas", "Map the wildlife people photograph, with species notes and seasons.",
    "A shared atlas where local photographers pin sightings with species info, season and a short story. Over time it becomes a living guide to what lives where and when.\n\nThe project is closed while we review the first batch of 600 photos and fix the species database.",
    ["Photography", "Maps", "Python"], 4, "closed", 600,
    { commitment: "Paused while reviewing the first batch.", lookingFor: ["Closed for now"], milestones: ["Done: photo upload and map", "In progress: species database review"] }),
];

let rid = 0;
const r = (projectId, who, status, message, hoursAgo) => ({
  id: `req-${++rid}`,
  projectId,
  userId: who.id,
  applicantName: who.name,
  message,
  status,
  createdAt: ago(hoursAgo),
});

const msgs = [
  "Hi! I'd love to help with the front end. I have built two React apps with responsive layouts and can start this week.",
  "",
  "I've built three similar apps and can start this week. I can also help with testing on real phones.",
  "Student here, learning React. Happy to take small tasks and ask lots of questions!",
  "I can handle design and prototypes in Figma, and I have run user interviews before.",
  "I have free evenings and care about this topic a lot. I attend most club events on campus.",
  "Looking for a team to grow with. Can commit 6 hours a week and I am good at writing documentation.",
  "Long message: " + "I really enjoy collaborating and I'm excited about this idea. ".repeat(5),
  "Can I join? I know the stack well and have shipped a similar feature at my internship.",
];

export const seedRequests = [
  // 9 pending for mine-1 (long list to review), plus 1 accepted and 1 rejected
  ...peopleList.slice(0, 9).map((who, i) => r("mine-1", who, "pending", msgs[i], 2 + i * 7)),
  r("mine-1", people.pouya, "accepted", "Ready to start.", 90),
  r("mine-1", people.yasaman, "rejected", "Hello!", 100),
  // mine-2 is full (3 accepted) with 2 still pending: accepting must be blocked
  r("mine-2", people.sara, "accepted", "", 180),
  r("mine-2", people.ali, "accepted", "", 170),
  r("mine-2", people.mina, "accepted", "", 160),
  r("mine-2", people.omid, "pending", "Any room left?", 5),
  r("mine-2", people.leila, "pending", "", 3),
  // mine-3 closed with two accepted members
  r("mine-3", people.reza, "accepted", "", 380),
  r("mine-3", people.nazanin, "accepted", "", 370),
  // mine-5: one long message at the 300-character limit
  r("mine-5", people.kian, "pending", ("Please let me join. " + "I am very motivated. ".repeat(20)).slice(0, 300), 12),
  // projects I applied to
  r("other-4", currentUser, "accepted", "Happy to help with design.", 100),
  r("other-4", people.dina, "accepted", "", 99),
  r("other-5", currentUser, "accepted", "", 140),
  r("project-1", currentUser, "accepted", "I know React well.", 280),
  r("other-6", currentUser, "pending", "I cycle daily and know the city.", 20),
  r("other-7", currentUser, "pending", "", 8),
  r("project-2", currentUser, "pending", "UI/UX is my thing.", 4),
  r("other-8", currentUser, "rejected", "", 50),
  r("project-3", currentUser, "rejected", "", 250),
  // other people's full project
  r("other-9", people.arman, "accepted", "", 450),
  r("other-9", people.yasaman, "accepted", "", 440),
];

const n = (type, title, body, link, hoursAgo, read) => ({
  id: `ntf-${++nid}`, type, title, body, link, createdAt: ago(hoursAgo), read,
});
let nid = 0;

export function buildSeedNotifications() {
  const list = [];
  peopleList.slice(0, 9).forEach((who, i) =>
    list.push(n("request_received", `${who.name} wants to join Campus Event Finder`, `${who.headline}. ${msgs[i] ? msgs[i].slice(0, 110) : "No message was included."}`, "/my-projects/mine-1/requests", 2 + i * 7, i > 4))
  );
  list.push(
    n("request_received", "Omid T. wants to join Open Recipe Book", "Mobile developer. \"Any room left?\" The project is full, so you will need to free a spot before accepting.", "/my-projects/mine-2/requests", 5, false),
    n("request_received", "Leila H. wants to join Open Recipe Book", "Product designer. No message was included. Open the request to see her profile.", "/my-projects/mine-2/requests", 3, false),
    n("request_accepted", "You're in! Language Exchange App accepted you", "Omid T. wrote: welcome aboard. The next check-in is Tuesday evening; open the project to see the team and the roadmap.", "/projects/other-4", 100, true),
    n("request_accepted", "You're in! Budget Buddy accepted you", "Leila H. accepted your request. The first task is reviewing the weekly summary screen.", "/projects/other-5", 140, true),
    n("request_accepted", "You're in! AI Study Assistant accepted you", "Sara M. welcomed you to the team of five. The Wednesday call is where new members get oriented.", "/projects/project-1", 280, true),
    n("request_rejected", "Mental Health Check-in can't take you right now", "Kian B. is keeping the team small while the privacy design settles. Your profile was kept on file; you can still apply to other projects.", "/projects/other-8", 50, false),
    n("request_rejected", "Eco Tracker can't take you right now", "Mina K. closed the project after the team filled up. Similar projects are open: try Budget Buddy or City Bike Map.", "/projects/project-3", 250, true),
    n("project_full", "Open Recipe Book is now full", "All 3 spots are taken: Sara M., Ali R. and Mina K. Two people are still waiting for a reply.", "/my-projects/mine-2/requests", 160, true),
    n("project_closed", "Neighborhood Tool Library was closed", "The pilot is over and the project no longer accepts requests. Members and history stay visible.", "/projects/mine-3", 300, true),
    n("member_joined", "Pouya D. joined Campus Event Finder", "Computer science student. Your team now has 1 member and 4 spots are left.", "/projects/mine-1", 90, true),
    n("request_sent", "Request sent to City Bike Map", "Waiting for a reply from Reza P., a GIS developer. Owners usually answer within two days.", "/my-projects?tab=requests", 20, true),
    n("request_sent", "Request sent to Podcast Studio Toolkit", "Waiting for a reply from Nazanin S., an audio producer. You can withdraw the request at any time.", "/my-projects?tab=requests", 8, true),
    n("request_sent", "Request sent to Community Platform", "Waiting for a reply from Ali R., who organises community meetups. Owners usually answer within two days.", "/my-projects?tab=requests", 4, false),
    n("system", "Welcome to Tribe", "Create a project or join one to get started. Complete your profile so owners know how you can help.", "/profile", 700, true)
  );
  // more realistic activity so the list needs paging
  const extra = [
    ["request_received", "Pouya D. asked a question about Pixel Garden Game", "Computer science student. \"Do you need help with sound effects too?\" Reply by reviewing his request.", "/projects/mine-4", 24],
    ["reminder", "3 requests have been waiting for more than a week", "Campus Event Finder has requests from Mina K., Omid T. and Leila H. Quick answers keep people engaged.", "/my-projects?tab=review", 36],
    ["member_joined", "Yasaman Q. started working on the event card", "Frontend developer. She opened the first design review for Campus Event Finder.", "/projects/mine-1", 47],
    ["reminder", "Your profile is almost complete", "Add a short bio and three skills so owners can see how you would help. It takes about a minute.", "/profile", 58],
    ["project_full", "Language Exchange App has only one spot left", "Omid T.'s team is nearly full. Consider following up on your join request if you are still interested.", "/projects/other-4", 70],
    ["request_sent", "Request received by Wildlife Photo Atlas", "Arman Z. closed the project while reviewing photos. You can try again when it reopens.", "/projects/other-10", 81],
    ["reminder", "Weekly summary: 4 new projects match your skills", "Based on React and UI/UX: City Bike Map, Community Platform, Budget Buddy and Podcast Studio Toolkit.", "/my-projects", 95],
    ["request_received", "Kian B. sent a long message to A Very Long Project Title", "iOS developer. He wrote a detailed note about why he wants to join and what he can contribute.", "/my-projects/mine-5/requests", 108],
    ["member_joined", "Dina F. joined Language Exchange App", "Technical writer. She will help with the practice sheets and onboarding guide.", "/projects/other-4", 120],
    ["reminder", "Reminder: Wednesday call for AI Study Assistant", "Sara M. shared the agenda: calendar import, flash-card generator demo and quiz quality review.", "/projects/project-1", 134],
    ["request_received", "Ali R. replied on Community Platform", "Thanks for applying. We are reviewing designers this week and will message you by Friday.", "/my-projects?tab=requests", 150],
    ["reminder", "Tip: add your portfolio link to your profile", "Owners are more likely to accept requests from people who share past work.", "/profile", 168],
    ["member_joined", "Mina K. joined Open Recipe Book", "Sustainability data analyst. She completed the team of three.", "/projects/mine-2", 190],
    ["reminder", "Pixel Garden Game has no members yet", "Share the project with a friend who draws pixel art, or refine the description to attract help.", "/my-projects/mine-4/edit", 215],
    ["request_accepted", "Your request to AI Study Assistant was confirmed again", "Sara M. updated the team after a role change. You are now listed as frontend contributor.", "/projects/project-1", 240],
    ["reminder", "Reminder: review your pending requests", "Open Recipe Book still has two people waiting. The project is full, so consider closing the request list.", "/my-projects/mine-2/requests", 270],
    ["system", "New: notifications are grouped by day", "Use the filters at the top to see only requests or only updates.", "/notifications", 300],
    ["request_received", "Nazanin S. is interested in Campus Event Finder", "Audio producer. She offered to help produce short promo clips for the pilot clubs.", "/my-projects/mine-1/requests", 330],
    ["reminder", "Take a moment to review your sent requests", "You have 3 requests waiting for a reply. You can withdraw any of them from the Sent requests tab.", "/my-projects?tab=requests", 360],
    ["system", "Your demo data was refreshed", "Sample projects, people and notifications are loaded so you can try every flow.", "/profile", 400],
  ];
  extra.forEach(([type, title, body, link, hours], i) => list.push(n(type, title, body, link, hours, i > 4)));
  return list;
}

export function applySeed() {
  localStorage.setItem("tribe_projects", JSON.stringify(seedProjects));
  localStorage.setItem("tribe_project_requests", JSON.stringify(seedRequests));
  localStorage.setItem("tribe_notifications", JSON.stringify(buildSeedNotifications()));
  localStorage.setItem("tribe_seed_version", SEED_VERSION);
}

export function ensureSeed() {
  try {
    if (localStorage.getItem("tribe_seed_version") !== SEED_VERSION) applySeed();
  } catch {
    /* storage unavailable: app falls back to defaults */
  }
}
