
import initialProjects from "../mocks/projects";

const PROJECTS_KEY = "tribe_projects";
const REQUESTS_KEY = "tribe_project_requests";

// Read data from LocalStorage
function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

// Save data to LocalStorage
function writeStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Initialize projects
function initializeProjects() {
  const existing = localStorage.getItem(PROJECTS_KEY);

  if (!existing) {
    writeStorage(PROJECTS_KEY, initialProjects);
  }
}

function getProjects() {
  initializeProjects();
  return readStorage(PROJECTS_KEY, initialProjects);
}

function getRequests() {
  return readStorage(REQUESTS_KEY, []);
}

// GET all projects
export async function getMyProjects() {
  return getProjects();
}

// GET one project
export async function getProjectById(projectId) {
  const projects = getProjects();

  const project = projects.find(
    (item) => String(item.id) === String(projectId)
  );

  if (!project) {
    throw new Error("پروژه موردنظر پیدا نشد.");
  }

  return project;
}

// CREATE project
export async function createProject(projectData) {
  const projects = getProjects();

  const newProject = {
    ...projectData,
    id: crypto.randomUUID(),
    status: "open",
    createdAt: new Date().toISOString(),
  };

  writeStorage(PROJECTS_KEY, [...projects, newProject]);

  return newProject;
}

// UPDATE project
export async function updateProject(projectId, updates) {
  const projects = getProjects();

  const index = projects.findIndex(
    (item) => String(item.id) === String(projectId)
  );

  if (index === -1) {
    throw new Error("پروژه موردنظر پیدا نشد.");
  }

  const updatedProject = {
    ...projects[index],
    ...updates,
    id: projects[index].id,
    updatedAt: new Date().toISOString(),
  };

  const updatedProjects = [...projects];
  updatedProjects[index] = updatedProject;

  writeStorage(PROJECTS_KEY, updatedProjects);

  return updatedProject;
}

// CLOSE project
export async function closeProject(projectId) {
  return updateProject(projectId, {
    status: "closed",
  });
}

// GET project requests
export async function getProjectRequests(projectId) {
  return getRequests().filter(
    (request) => String(request.projectId) === String(projectId)
  );
}

// UPDATE request status
export async function updateRequestStatus(requestId, status) {
  const allowedStatuses = ["pending", "accepted", "rejected"];

  if (!allowedStatuses.includes(status)) {
    throw new Error("وضعیت درخواست معتبر نیست.");
  }

  const requests = getRequests();

  const index = requests.findIndex(
    (request) => String(request.id) === String(requestId)
  );

  if (index === -1) {
    throw new Error("درخواست موردنظر پیدا نشد.");
  }

  const updatedRequest = {
    ...requests[index],
    status,
  };

  const updatedRequests = [...requests];
  updatedRequests[index] = updatedRequest;

  writeStorage(REQUESTS_KEY, updatedRequests);

  return updatedRequest;
}

// Reset mock data for development
export async function resetMockData() {
  writeStorage(PROJECTS_KEY, initialProjects);
  writeStorage(REQUESTS_KEY, []);
}
