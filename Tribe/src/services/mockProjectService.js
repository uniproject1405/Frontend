import { seedProjects } from "../mocks/seedData";

const PROJECTS_KEY = "tribe_projects";

// خواندن پروژه‌ها از LocalStorage (در نبود داده، داده‌ی نمونه)
export async function getMyProjects() {
  try {
    const saved = localStorage.getItem(PROJECTS_KEY);
    return saved ? JSON.parse(saved) : seedProjects;
  } catch {
    return seedProjects;
  }
}
