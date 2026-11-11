const mockProjects = [
  {
    "id": "project-1",
    "title": "AI Study Assistant",
    "goal": "Build an intelligent study companion that plans your week and quizzes you at the right moment.",
    "description": "Most students do not fail from lack of effort; they fail from poor timing. This assistant reads your syllabus and deadlines, builds a realistic weekly plan, and uses spaced repetition to quiz you on the right topic on the right day.\n\nThe first version is a web app with a calendar view, a flash-card generator that turns lecture notes into questions, and a gentle daily summary. We are using a small open model for question generation, so no paid API is needed to run it.\n\nWe already have a working prototype of the planner and about forty students testing it. What we need now is a polished interface and a better recommendation model.",
    "requiredSkills": [
      "React",
      "Python",
      "Machine Learning"
    ],
    "capacity": 5,
    "status": "open",
    "createdAt": new Date().toISOString(),
    "commitment": "About 6 hours a week. One 45-minute call on Wednesday evening, async the rest of the time.",
    "lookingFor": [
      "A frontend developer who enjoys calendar and drag-and-drop interfaces",
      "An ML engineer to improve question quality and scheduling",
      "A designer who can make studying feel calm, not stressful"
    ],
    "milestones": [
      "Week 2: onboarding flow and syllabus import",
      "Week 5: flash-card generator beta with 40 testers",
      "Week 8: public launch for one university"
    ]
  },
  {
    "id": "project-2",
    "title": "Community Platform",
    "goal": "Connect people through shared interests, one small group at a time.",
    "description": "Big social networks are built for scrolling. This platform is built for meeting: small, topic-based communities with a weekly prompt, a shared calendar and a simple way to organise real-life meetups.\n\nWe have spent two months on research with local clubs (chess, climbing, book clubs, hackathon crews) and learned that organisers need three things: a member list that stays tidy, a fast way to announce events, and no ads. The prototype covers the first two.\n\nWe are looking for people who have run or joined a community and know what annoys them about the tools they use today.",
    "requiredSkills": [
      "React",
      "Node.js",
      "UI/UX"
    ],
    "capacity": 4,
    "status": "open",
    "createdAt": new Date().toISOString(),
    "commitment": "5 to 8 hours a week. Stand-up in chat every Monday, demo every other Friday.",
    "lookingFor": [
      "A UI/UX designer for the event and member pages",
      "A Node.js developer for notifications and calendar sync",
      "Someone who has organised a community and can test with us"
    ],
    "milestones": [
      "Month 1: groups, members and weekly prompts",
      "Month 2: events with reminders and calendar export",
      "Month 3: invite 5 real communities and collect feedback"
    ]
  },
  {
    "id": "project-3",
    "title": "Eco Tracker",
    "goal": "Help users see and shrink their environmental impact without guilt.",
    "description": "Eco Tracker turns everyday choices (commute, food, heating, shopping) into a simple weekly footprint. Instead of a score to feel bad about, it suggests one small change per week and shows what it saves over a year.\n\nThe emission factors come from public datasets that we clean and document openly. The goal is to be the most transparent footprint calculator on the web: every number links to its source.\n\nThe team is complete and the project is closed to new members while we finish the first public release.",
    "requiredSkills": [
      "JavaScript",
      "Data Analysis",
      "Design"
    ],
    "capacity": 3,
    "status": "closed",
    "createdAt": new Date().toISOString(),
    "commitment": "4 hours a week, mostly evenings.",
    "lookingFor": [
      "Team complete for now"
    ],
    "milestones": [
      "Done: footprint calculator",
      "In progress: weekly suggestions and sources page",
      "Next: public release and open data export"
    ]
  }
];

export default mockProjects;
