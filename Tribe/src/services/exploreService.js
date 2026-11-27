import { getMyProjects } from './mockProjectService';
import { getOwner, readRequests } from './membershipService';

// Set VITE_API_URL (e.g. in .env) to switch from mock data to the real API.
const API_URL = import.meta.env.VITE_API_URL || '';

// Mock mode reads the same stored projects as the dashboard and details page,
// so a card on Explore always opens the matching project.
async function loadProjects() {
  const requests = readRequests();
  return (await getMyProjects()).map(p => ({
    type: 'development',
    openRoles: [],
    ...p,
    accepted: requests.filter(r => String(r.projectId) === String(p.id) && r.status === 'accepted').length,
    creator: { name: getOwner(p.id).name, username: getOwner(p.id).username, role: 'ایجادکننده‌ی پروژه' },
  }));
}

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
  return (await loadProjects()).filter(p =>
    (!q || (p.title || '').toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q))
    && (!skill || (p.requiredSkills || []).includes(skill))
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
  const project = (await loadProjects()).find(p => String(p.id) === String(projectId));
  if (!project) throw new Error('پروژه پیدا نشد.');
  return project;
}
