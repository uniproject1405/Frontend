import exploreProjects from '../mocks/exploreProjects';
import { ApiError, request } from './apiClient.js';
import { getErrorMessage } from '../utils/errorMessages.js';

// VITE_USE_MOCK=true -> mock data; otherwise use the Django API.
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const wait = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Keep the existing mock UI shape.
const mockProjects = exploreProjects.map(project => ({
  ...project,
  requiredSkills: (project.requiredSkills || []).map(skill =>
    typeof skill === 'string' ? { id: skill, name: skill } : skill
  ),
}));

const asList = data => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
};

function toError(error, fallback) {
  if (error instanceof ApiError) {
    if (error.status === 0 || error.status >= 502) {
      return new Error(getErrorMessage(error));
    }
    if (error.status === 404) return new Error('اطلاعات موردنظر پیدا نشد.');
  }
  return new Error(fallback);
}

// Backend contract:
// ProjectSerializer: public_id, title, goal, description, creator,
// capacity, accepted_count, status, project_type, custom_project_type,
// skills (skill names), created_at, updated_at.
function toSkill(name) {
  if (name && typeof name === 'object') {
    const label = name.name || String(name.id ?? '');
    return { id: label, name: label };
  }
  return { id: String(name), name: String(name) };
}

function toProject(project) {
  const rawCreator = project.creator && typeof project.creator === 'object'
    ? project.creator
    : {};

  const creatorName = rawCreator.name
    || rawCreator.full_name
    || [rawCreator.first_name, rawCreator.last_name].filter(Boolean).join(' ')
    || project.creator_name
    || rawCreator.username
    || project.creator_username
    || 'عضو Tribe';

  const creator = {
    name: creatorName,
    username: rawCreator.username || project.creator_username || '',
    avatar: rawCreator.avatar || rawCreator.avatar_url
      || rawCreator.profile_image || rawCreator.profile_picture
      || project.creator_avatar || '',
  };

  const capacity = Number(project.capacity) || 0;
  const accepted = Number(
    project.accepted_count ?? project.accepted ?? project.members_count
  ) || 0;
  const remaining = project.remaining_capacity == null
    ? Math.max(capacity - accepted, 0)
    : Math.max(Number(project.remaining_capacity) || 0, 0);

  const rawSkills = project.skills || project.required_skills || [];
  const skills = Array.isArray(rawSkills) ? rawSkills : [];

  return {
    id: project.public_id || project.id,
    title: project.title || '',
    goal: project.goal || '',
    description: project.description || project.goal || '',
    type: project.project_type || project.type || '',
    customType: project.custom_project_type || project.customType || '',
    requiredSkills: skills.map(toSkill),
    capacity,
    accepted,
    remaining,
    openRoles: Array.isArray(project.open_roles) ? project.open_roles : [],
    status: project.status || 'open',
    createdAt: project.created_at || null,
    creator,
  };
}

function buildParams({ search = '', skill = '', status = '' } = {}) {
  const params = new URLSearchParams();
  if (search.trim()) params.set('search', search.trim());
  // The backend expects the skill NAME, not a database ID.
  if (skill) params.set('skill', skill);
  // The backend defaults to open-only when `status` is missing, so the
  // "all statuses" option must send status=all explicitly.
  params.set('status', status || 'all');
  return params;
}

async function fetchExplore(filters = {}) {
  const params = buildParams(filters);
  const query = params.toString();
  try {
    const data = await request(`/api/projects/explore/${query ? `?${query}` : ''}`, { auth: false });
    return asList(data);
  } catch (error) {
    throw toError(error, 'دریافت پروژه‌ها با خطا مواجه شد.');
  }
}

export async function getExploreProjects(filters = {}) {
  if (USE_MOCK) {
    await wait();
    const { search = '', skill = '', status = '' } = filters;
    const query = search.trim().toLowerCase();
    return mockProjects.filter(project =>
      (!query || project.title.toLowerCase().includes(query)
        || (project.description || '').toLowerCase().includes(query))
      && (!skill || project.requiredSkills.some(item =>
        String(item.name || item.id).toLowerCase() === String(skill).toLowerCase()
      ))
      && (!status || project.status === status)
    );
  }

  const projects = await fetchExplore(filters);
  return projects.map(toProject);
}

// GET /api/skills/ returns [{ name: "..." }]. The backend's explore filter
// also expects the skill name, so use that name as the option value.
export async function getExploreSkills() {
  if (USE_MOCK) {
    const all = mockProjects.flatMap(project => project.requiredSkills || []);
    return [...new Map(all.map(skill => [String(skill.name || skill.id).toLowerCase(), skill])).values()];
  }

  try {
    const data = await request('/api/skills/', { auth: false });
    const skills = asList(data).map(item => toSkill(item.name));
    return [...new Map(skills.map(skill => [skill.name.toLowerCase(), skill])).values()];
  } catch (error) {
    throw toError(error, 'دریافت فهرست مهارت‌ها با خطا مواجه شد.');
  }
}

// GET /api/projects/<public_id>/
export async function getExploreProjectById(projectId) {
  if (USE_MOCK) {
    await wait(150);
    const project = mockProjects.find(item => String(item.id) === String(projectId));
    if (!project) throw new Error('پروژه پیدا نشد.');
    return project;
  }

  try {
    const project = await request(`/api/projects/${projectId}/`, { auth: false });
    return toProject(project);
  } catch (error) {
    throw toError(error, 'دریافت پروژه با خطا مواجه شد.');
  }
}
