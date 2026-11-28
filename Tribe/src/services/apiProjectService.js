// API adapter. The backend must scope GET /projects to the authenticated user
// and assign ownerId from the authenticated session on POST /projects.
const PROJECTS_API_URL = import.meta.env.VITE_PROJECTS_API_URL;

function getProjectsApiUrl() {
  if (!PROJECTS_API_URL) throw new Error("Projects API is not configured.");
  return PROJECTS_API_URL.replace(/\/$/, "");
}

async function readResponse(response) {
  if (!response.ok) {
    let message = `Project request failed (${response.status}).`;
    try { const body = await response.json(); if (body?.message) message = body.message; } catch { /* response has no JSON body */ }
    throw new Error(message);
  }
  if (response.status === 204) return null;
  return response.json();
}

export async function getMyProjects({ signal } = {}) {
  const response = await fetch(getProjectsApiUrl(), {
    method: "GET", credentials: "include", signal,
  });
  return readResponse(response);
}

export async function createProject(projectData) {
  const response = await fetch(getProjectsApiUrl(), {
    method: "POST", credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(projectData),
  });
  return readResponse(response);
}

export async function getProjectById(projectId) {
  const response = await fetch(`${getProjectsApiUrl()}/${encodeURIComponent(projectId)}`, { credentials: "include" });
  return readResponse(response);
}

export async function updateProject(projectId, updates) {
  const response = await fetch(`${getProjectsApiUrl()}/${encodeURIComponent(projectId)}`, {
    method: "PATCH", credentials: "include",
    headers: { "Content-Type": "application/json" }, body: JSON.stringify(updates),
  });
  return readResponse(response);
}

export async function closeProject(projectId) {
  return updateProject(projectId, { status: "closed" });
}

export async function getProjectRequests(projectId) {
  const response = await fetch(`${getProjectsApiUrl()}/${encodeURIComponent(projectId)}/requests`, { credentials: "include" });
  return readResponse(response);
}

export async function updateRequestStatus(requestId, status) {
  const response = await fetch(`${getProjectsApiUrl()}/requests/${encodeURIComponent(requestId)}`, {
    method: "PATCH", credentials: "include",
    headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }),
  });
  return readResponse(response);
}
