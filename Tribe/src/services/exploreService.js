import { getMyProjects } from './mockProjectService';
import { getOwner, readRequests } from './membershipService';

import { ApiError, request } from './apiClient.js';

// VITE_USE_MOCK=false switches Explore to the real backend (Negar's mapping below).
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const asList = (data) => (Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : []);

function toError(error, fallback) {
  if (error instanceof ApiError && error.status === 404) return new Error('اطلاعات موردنظر پیدا نشد.');
  return new Error(fallback);
}

// Backend project -> the shape our cards use. Skills come back as names or { name } objects.
function toProject(project) {
  const creator = project.creator && typeof project.creator === 'object' ? project.creator : {};
  return {
    id: project.public_id,
    title: project.title || '',
    goal: project.goal || '',
    description: project.description || project.goal || '',
    type: project.project_type || 'development',
    requiredSkills: (project.skills || []).map((skill) => (typeof skill === 'object' ? skill?.name || String(skill?.id ?? '') : String(skill))),
    capacity: Number(project.capacity) || 0,
    accepted: Number(project.accepted_count) || 0,
    openRoles: [],
    status: project.status || 'open',
    createdAt: project.created_at || null,
    creator: { name: creator.name || creator.username || 'عضو Tribe', username: creator.username || '' },
  };
}

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
  if (!USE_MOCK) {
    const params = new URLSearchParams(
      Object.entries({ search: search.trim(), skill, status }).filter(([, value]) => value)
    );
    try {
      const data = await request(`/api/projects/explore/${params.size ? `?${params}` : ''}`, { auth: false });
      return asList(data).map(toProject);
    } catch (error) {
      throw toError(error, 'دریافت پروژه‌ها با خطا مواجه شد.');
    }
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
  if (!USE_MOCK) {
    try {
      return toProject(await request(`/api/projects/${projectId}/`, { auth: false }));
    } catch (error) {
      throw toError(error, 'پروژه پیدا نشد.');
    }
  }

  await wait(150);
  const project = (await loadProjects()).find(p => String(p.id) === String(projectId));
  if (!project) throw new Error('پروژه پیدا نشد.');
  return project;
}
