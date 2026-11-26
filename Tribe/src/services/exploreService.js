import exploreProjects from '../mocks/exploreProjects';

// Set VITE_API_URL (e.g. in .env) to switch from mock data to the real API.
const API_URL = import.meta.env.VITE_API_URL || '';

const wait = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// GET list. Filters: { search, skill, status }
export async function getExploreProjects({ search = '', skill = '', status = '' } = {}) {
  if (API_URL) {
    const params = new URLSearchParams(
      Object.entries({ search, skill, status }).filter(([, value]) => value)
    );
    const res = await fetch(`${API_URL}/projects?${params}`);
    if (!res.ok) throw new Error('دریافت پروژه‌ها با خطا مواجه شد.');
    return res.json();
  }

  await wait();
  const q = search.trim().toLowerCase();
  return exploreProjects.filter(p =>
    (!q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
    && (!skill || p.requiredSkills.includes(skill))
    && (!status || p.status === status)
  );
}

// GET one project
export async function getExploreProjectById(projectId) {
  if (API_URL) {
    const res = await fetch(`${API_URL}/projects/${projectId}`);
    if (!res.ok) throw new Error('پروژه پیدا نشد.');
    return res.json();
  }

  await wait(150);
  const project = exploreProjects.find(p => String(p.id) === String(projectId));
  if (!project) throw new Error('پروژه پیدا نشد.');
  return project;
}
