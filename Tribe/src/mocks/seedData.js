// Large demo data set used to stress the UI: long lists, full/closed projects,
// pending / accepted / rejected requests and 40+ notifications.
import currentUser from "../services/currentUser";

export const SEED_VERSION = "3";

const HOUR = 3600 * 1000;
const ago = (hours) => new Date(Date.now() - hours * HOUR).toISOString();

const people = {
  sara: { id: "user-sara", name: "Sara M." },
  ali: { id: "user-ali", name: "Ali R." },
  mina: { id: "user-mina", name: "Mina K." },
  omid: { id: "user-omid", name: "Omid T." },
  leila: { id: "user-leila", name: "Leila H." },
  reza: { id: "user-reza", name: "Reza P." },
  nazanin: { id: "user-nazanin", name: "Nazanin S." },
  kian: { id: "user-kian", name: "Kian B." },
  dina: { id: "user-dina", name: "Dina F." },
  arman: { id: "user-arman", name: "Arman Z." },
  yasaman: { id: "user-yasaman", name: "Yasaman Q." },
  pouya: { id: "user-pouya", name: "Pouya D." },
};
const peopleList = Object.values(people);

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

const p = (id, title, goal, description, requiredSkills, capacity, status = "open", hoursAgo = 48) => ({
  id, title, goal, description, requiredSkills, capacity, status, createdAt: ago(hoursAgo),
});

export const seedProjects = [
  p("project-1", "AI Study Assistant", "Build an intelligent study companion.", "An AI-powered platform that helps students organize their learning and improve productivity.", ["React", "Python", "Machine Learning"], 5, "open", 300),
  p("project-2", "Community Platform", "Connect people through shared interests.", "A platform where people can create communities, share ideas and collaborate on projects.", ["React", "Node.js", "UI/UX"], 4, "open", 280),
  p("project-3", "Eco Tracker", "Help users monitor their environmental impact.", "An application that tracks daily habits and provides insights into reducing carbon footprints.", ["JavaScript", "Data Analysis", "Design"], 3, "closed", 260),
  p("mine-1", "Campus Event Finder", "One place for every event on campus.", "A mobile-friendly site that lists talks, clubs and workshops with reminders and calendar export.", ["React", "UI/UX", "Firebase"], 5, "open", 120),
  p("mine-2", "Open Recipe Book", "Share family recipes with the world.", "A community cookbook where anyone can add, tweak and translate recipes.", ["Node.js", "Design", "Writing"], 3, "open", 200),
  p("mine-3", "Neighborhood Tool Library", "Borrow tools instead of buying them.", "A lending system for ladders, drills and more, run by neighbors.", ["React", "Maps", "Testing"], 4, "closed", 400),
  p("mine-4", "Pixel Garden Game", "A calm gardening game in pixel art.", "A small browser game about growing plants. Looking for a first teammate.", ["Game Dev", "Pixel Art"], 3, "open", 10),
  p("mine-5", "A Very Long Project Title That Keeps Going To Test How Wrapping Works In Cards Headers And Lists Everywhere", "An extremely detailed goal sentence that is much longer than anyone should write but must still fit on screen gracefully.", longText, ["React", "TypeScript", "Accessibility", "Design Systems", "Testing", "Node.js", "GraphQL", "CI/CD", "Docs", "Figma", "Motion", "i18n"], 12, "open", 30),
  p("other-4", "Language Exchange App", "Practice a language with a native speaker.", "Match learners for short video chats and shared practice sheets.", ["React Native", "WebRTC", "UI/UX"], 4, "open", 150),
  p("other-5", "Budget Buddy", "Make personal budgeting friendly.", "A simple budgeting tool with weekly summaries and gentle nudges.", ["React", "Charts", "Design"], 3, "open", 170),
  p("other-6", "City Bike Map", "Safe cycling routes for the city.", "Crowd-sourced map of safe bike lanes, repair stations and hazards.", ["Maps", "React", "Data Analysis"], 5, "open", 90),
  p("other-7", "Podcast Studio Toolkit", "Tools for first-time podcasters.", "Checklists, templates and an episode planner for new creators.", ["Audio", "Writing", "React"], 4, "open", 75),
  p("other-8", "Mental Health Check-in", "A kind daily check-in app.", "Private mood tracking with optional sharing with a trusted friend.", ["Swift", "UX Research", "Writing"], 3, "open", 60),
  p("other-9", "Open Source Docs Hub", "Better docs for small open source projects.", "Templates and tooling that make documentation easy to start.", ["Docs", "Node.js"], 2, "open", 500),
  p("other-10", "Wildlife Photo Atlas", "Map the wildlife people photograph.", "A shared atlas of local wildlife photos with species info.", ["Photography", "Maps", "Python"], 4, "closed", 600),
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
  "Hi! I'd love to help with the front end.",
  "",
  "I've built three similar apps and can start this week.",
  "Student here, learning React. Happy to take small tasks!",
  "I can handle design and prototypes in Figma.",
  "I have free evenings and care about this topic a lot.",
  "Looking for a team to grow with. Can commit 6 hours a week.",
  "Long message: " + "I really enjoy collaborating and I'm excited about this idea. ".repeat(5),
  "Can I join? I know the stack well.",
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
    list.push(n("request_received", `${who.name} wants to join Campus Event Finder`, msgs[i] ? msgs[i].slice(0, 90) : "No message", "/my-projects/mine-1/requests", 2 + i * 7, i > 4))
  );
  list.push(
    n("request_received", "Omid T. wants to join Open Recipe Book", "Any room left?", "/my-projects/mine-2/requests", 5, false),
    n("request_received", "Leila H. wants to join Open Recipe Book", "No message", "/my-projects/mine-2/requests", 3, false),
    n("request_accepted", "You're in! Language Exchange App accepted you", "Say hi to Omid T. and the team.", "/projects/other-4", 100, true),
    n("request_accepted", "You're in! Budget Buddy accepted you", "Welcome to the team.", "/projects/other-5", 140, true),
    n("request_accepted", "You're in! AI Study Assistant accepted you", "Welcome to the team.", "/projects/project-1", 280, true),
    n("request_rejected", "Mental Health Check-in can't take you right now", "You can still apply to other projects.", "/projects/other-8", 50, false),
    n("request_rejected", "Eco Tracker can't take you right now", "The project is also closed.", "/projects/project-3", 250, true),
    n("project_full", "Open Recipe Book is now full", "3 of 3 spots are taken.", "/my-projects/mine-2/requests", 160, true),
    n("project_closed", "Neighborhood Tool Library was closed", "No new requests will arrive.", "/projects/mine-3", 300, true),
    n("member_joined", "Pouya D. joined Campus Event Finder", "Your team now has 1 member.", "/projects/mine-1", 90, true),
    n("request_sent", "Request sent to City Bike Map", "Waiting for a reply from Reza P.", "/my-projects?tab=requests", 20, true),
    n("request_sent", "Request sent to Podcast Studio Toolkit", "Waiting for a reply from Nazanin S.", "/my-projects?tab=requests", 8, true),
    n("request_sent", "Request sent to Community Platform", "Waiting for a reply from Ali R.", "/my-projects?tab=requests", 4, false),
    n("system", "Welcome to Tribe", "Create a project or join one to get started.", "/my-projects", 700, true)
  );
  // many more reminders so the list needs paging
  for (let i = 0; i < 24; i += 1) {
    list.push(
      n(i % 3 === 0 ? "request_received" : "reminder", i % 3 === 0 ? `New interest in Pixel Garden Game (#${i + 1})` : `Reminder: review your pending requests (#${i + 1})`, "Tap to take a look.", i % 3 === 0 ? "/projects/mine-4" : "/my-projects/mine-1/requests", 24 + i * 11, i > 6)
    );
  }
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
