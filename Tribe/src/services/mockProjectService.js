// Mock adapter. Keep the same contract as the future API adapter.
const PROJECTS_KEY = "tribe_projects";
const REQUESTS_KEY = "tribe_project_requests";
const MOCK_USER_KEY = "tribe_mock_user_id";

function createId() {
  return globalThis.crypto?.randomUUID?.() || `mock-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// Temporary identity for local development only. Replace this adapter with the
// authenticated user's stable ID when the real auth/API is integrated.
function getMockUserId() {
  let userId = localStorage.getItem(MOCK_USER_KEY);
  if (!userId) {
    userId = createId();
    localStorage.setItem(MOCK_USER_KEY, userId);
  }
  return userId;
}

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getProjects() {
  // Intentionally start empty: new users must not inherit demo projects.
  return readStorage(PROJECTS_KEY, []);
}

function getRequests() {
  return readStorage(REQUESTS_KEY, []);
}

export async function getMyProjects({ signal } = {}) {
  if (signal?.aborted) throw new DOMException("Request aborted", "AbortError");
  const ownerId = getMockUserId();
  return getProjects().filter((project) => String(project.ownerId) === String(ownerId));
}

export async function getProjectById(projectId) {
  const project = getProjects().find((item) => String(item.id) === String(projectId));
  if (!project) throw new Error("پروژه موردنظر پیدا نشد.");
  return project;
}

export async function createProject(projectData) {
  const projects = getProjects();
  const now = new Date().toISOString();
  const newProject = {
    ...projectData,
    id: createId(),
    ownerId: getMockUserId(),
    status: projectData.status || "open",
    createdAt: now,
    updatedAt: now,
  };
  writeStorage(PROJECTS_KEY, [...projects, newProject]);
  return newProject;
}

export async function updateProject(projectId, updates) {
  const projects = getProjects();
  const ownerId = getMockUserId();
  const index = projects.findIndex((item) =>
    String(item.id) === String(projectId) && String(item.ownerId) === String(ownerId)
  );
  if (index === -1) throw new Error("پروژه موردنظر پیدا نشد یا متعلق به شما نیست.");
  const updatedProject = {
    ...projects[index], ...updates, id: projects[index].id, ownerId,
    updatedAt: new Date().toISOString(),
  };
  const updatedProjects = [...projects];
  updatedProjects[index] = updatedProject;
  writeStorage(PROJECTS_KEY, updatedProjects);
  return updatedProject;
}

export async function closeProject(projectId) {
  return updateProject(projectId, { status: "closed" });
}

export async function getProjectRequests(projectId) {
  return getRequests().filter((request) => String(request.projectId) === String(projectId));
}

export async function updateRequestStatus(requestId, status) {
  const allowedStatuses = ["pending", "accepted", "rejected"];
  if (!allowedStatuses.includes(status)) throw new Error("وضعیت درخواست معتبر نیست.");
  const requests = getRequests();
  const index = requests.findIndex((request) => String(request.id) === String(requestId));
  if (index === -1) throw new Error("درخواست موردنظر پیدا نشد.");
  const updatedRequest = { ...requests[index], status };
  const updatedRequests = [...requests];
  updatedRequests[index] = updatedRequest;
  writeStorage(REQUESTS_KEY, updatedRequests);
  return updatedRequest;
}

// Development helper. Resets data to an empty state, not demo seed records.
export async function resetMockData() {
  writeStorage(PROJECTS_KEY, []);
  writeStorage(REQUESTS_KEY, []);
}
