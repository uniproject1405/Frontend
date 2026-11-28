
import { getMyProjects } from './mockProjectService';
import { getOwner, readRequests } from './membershipService';
import { ApiError, request } from './apiClient.js';

// VITE_USE_MOCK=true enables mock mode.
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const asList = data =>
  Array.isArray(data)
    ? data
    : Array.isArray(data?.results)
      ? data.results
      : [];

function toError(error, fallback) {
  if (error instanceof ApiError && error.status === 404) {
    return new Error('اطلاعات موردنظر پیدا نشد.');
  }

  return new Error(fallback);
}

// Convert skill objects or strings into skill names.
function toSkill(skill) {
  if (typeof skill === 'string') return skill;

  if (typeof skill === 'number') return String(skill);

  if (skill && typeof skill === 'object') {
    return (
      skill.name ||
      skill.label ||
      String(skill.id ?? '')
    );
  }

  return '';
}

// Backend project -> frontend project card shape.
function toProject(project) {
  const rawCreator =
    project.creator && typeof project.creator === 'object'
      ? project.creator
      : {};

  const creatorName =
    rawCreator.name ||
    rawCreator.full_name ||
    [
      rawCreator.first_name,
      rawCreator.last_name,
    ].filter(Boolean).join(' ') ||
    project.creator_name ||
    rawCreator.username ||
    project.creator_username ||
    'عضو Tribe';

  const creator = {
    name: creatorName,
    username:
      rawCreator.username ||
      project.creator_username ||
      '',
    avatar:
      rawCreator.avatar ||
      rawCreator.avatar_url ||
      rawCreator.profile_image ||
      rawCreator.profile_picture ||
      project.creator_avatar ||
      '',
  };

  const capacity = Number(project.capacity) || 0;

  const accepted = Number(
    project.accepted_count ??
    project.accepted ??
    project.members_count
  ) || 0;

  const remaining =
    project.remaining_capacity == null
      ? Math.max(capacity - accepted, 0)
      : Math.max(
          Number(project.remaining_capacity) || 0,
          0
        );

  const rawSkills =
    project.skills ||
    project.required_skills ||
    project.requiredSkills ||
    [];

  const skills = Array.isArray(rawSkills)
    ? rawSkills.map(toSkill).filter(Boolean)
    : [];

  return {
    id: project.public_id || project.id,
    title: project.title || '',
    goal: project.goal || '',
    description:
      project.description ||
      project.goal ||
      '',
    type:
      project.project_type ||
      project.type ||
      '',
    customType:
      project.custom_project_type ||
      project.customType ||
      '',
    requiredSkills: skills,
    capacity,
    accepted,
    remaining,
    openRoles: Array.isArray(project.open_roles)
      ? project.open_roles
      : Array.isArray(project.openRoles)
        ? project.openRoles
        : [],
    status: project.status || 'open',
    createdAt: project.created_at || project.createdAt || null,
    creator,
  };
}

// Build backend query parameters.
function buildParams({
  search = '',
  skill = '',
  status = '',
} = {}) {
  const params = new URLSearchParams();

  if (search.trim()) {
    params.set('search', search.trim());
  }

  // Backend expects skill name, not database ID.
  if (skill) {
    params.set('skill', skill);
  }

  // Explicitly request all statuses when no status is selected.
  params.set('status', status || 'all');

  return params;
}

// Mock mode reads projects from dashboard and membership services.
async function loadProjects() {
  const requests = readRequests();
  const projects = await getMyProjects();

  return projects.map(project => {
    const owner = getOwner(project.id);

    const requiredSkills = (
      project.requiredSkills ||
      project.skills ||
      project.required_skills ||
      []
    ).map(toSkill).filter(Boolean);

    return {
      type: 'development',
      openRoles: [],
      ...project,
      requiredSkills,
      accepted: requests.filter(
        request =>
          String(request.projectId) === String(project.id) &&
          request.status === 'accepted'
      ).length,
      creator: {
        name: owner?.name || 'عضو Tribe',
        username: owner?.username || '',
        role: 'ایجادکننده‌ی پروژه',
      },
    };
  });
}

const wait = (ms = 300) =>
  new Promise(resolve => setTimeout(resolve, ms));

// GET Explore projects with filters.
export async function getExploreProjects(filters = {}) {
  const {
    search = '',
    skill = '',
    status = '',
  } = filters;

  if (!USE_MOCK) {
    const params = buildParams(filters);
    const query = params.toString();

    try {
      const data = await request(
        `/api/projects/explore/${query ? `?${query}` : ''}`,
        { auth: false }
      );

      return asList(data).map(toProject);
    } catch (error) {
      throw toError(
        error,
        'دریافت پروژه‌ها با خطا مواجه شد.'
      );
    }
  }

  await wait();

  const query = search.trim().toLowerCase();

  return (await loadProjects()).filter(project => {
    const matchesSearch =
      !query ||
      (project.title || '').toLowerCase().includes(query) ||
      (project.description || '').toLowerCase().includes(query);

    const matchesSkill =
      !skill ||
      (project.requiredSkills || []).some(
        item => String(item).toLowerCase() === skill.toLowerCase()
      );

    const matchesStatus =
      !status ||
      project.status === status;

    return matchesSearch && matchesSkill && matchesStatus;
  });
}

// GET one project.
export async function getExploreProjectById(projectId) {
  if (!USE_MOCK) {
    try {
      const data = await request(
        `/api/projects/${projectId}/`,
        { auth: false }
      );

      return toProject(data);
    } catch (error) {
      throw toError(error, 'پروژه پیدا نشد.');
    }
  }

  await wait(150);

  const project = (await loadProjects()).find(
    project => String(project.id) === String(projectId)
  );

  if (!project) {
    throw new Error('پروژه پیدا نشد.');
  }

  return project;
}
