
const mockProjects = [
  {
    id: "project-1",
    title: "AI Study Assistant",
    goal: "Build an intelligent study companion.",
    description:
      "An AI-powered platform that helps students organize their learning and improve productivity.",
    requiredSkills: ["React", "Python", "Machine Learning"],
    capacity: 5,
    status: "open",
    createdAt: new Date().toISOString(),
  },
  {
    id: "project-2",
    title: "Community Platform",
    goal: "Connect people through shared interests.",
    description:
      "A platform where people can create communities, share ideas and collaborate on projects.",
    requiredSkills: ["React", "Node.js", "UI/UX"],
    capacity: 4,
    status: "open",
    createdAt: new Date().toISOString(),
  },
  {
    id: "project-3",
    title: "Eco Tracker",
    goal: "Help users monitor their environmental impact.",
    description:
      "An application that tracks daily habits and provides insights into reducing carbon footprints.",
    requiredSkills: ["JavaScript", "Data Analysis", "Design"],
    capacity: 3,
    status: "closed",
    createdAt: new Date().toISOString(),
  },
];

export default mockProjects;
