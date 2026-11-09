
const PROJECTS_API_URL = import.meta.env.VITE_PROJECTS_API_URL;

function getProjectsApiUrl() {
  if (!PROJECTS_API_URL) {
    throw new Error(
      "Projects API is not configured yet."
    );
  }

  return PROJECTS_API_URL;
}

async function readResponse(response) {
  if (!response.ok) {
    throw new Error(
      `Project request failed with status ${response.status}.`
    );
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function getMyProjects({ signal } = {}) {
  const url = getProjectsApiUrl();

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    signal,
  });

  return readResponse(response);
}

export async function createProject(projectData) {
  const url = getProjectsApiUrl();

  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(projectData),
  });

  return readResponse(response);
}
