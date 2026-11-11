import currentUser from "./currentUser";
import owners from "../mocks/owners";
import { getProjectById, getMyProjects } from "./mockProjectService";

const REQUESTS_KEY = "tribe_project_requests";

export function readRequests() {
  try {
    return JSON.parse(localStorage.getItem(REQUESTS_KEY)) || [];
  } catch {
    return [];
  }
}

export function writeRequests(requests) {
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
}

export function getOwner(projectId) {
  return owners[projectId] || currentUser;
}

function nameOf(request) {
  return request.applicantName || request.userName || request.applicant?.name || "Unknown";
}

// relation: owner | member | pending | none
export async function getProjectDetails(projectId) {
  const project = await getProjectById(projectId);
  const owner = getOwner(project.id);
  const forProject = readRequests().filter((r) => String(r.projectId) === String(project.id));
  const members = forProject
    .filter((r) => r.status === "accepted")
    .map((r) => ({ id: r.userId || r.id, name: nameOf(r) }));
  const mine = forProject.filter((r) => r.userId === currentUser.id);

  let relation = "none";
  if (owner.id === currentUser.id) relation = "owner";
  else if (mine.some((r) => r.status === "accepted")) relation = "member";
  else if (mine.some((r) => r.status === "pending")) relation = "pending";

  return {
    project,
    owner,
    members,
    spotsLeft: Math.max(project.capacity - members.length, 0),
    relation,
  };
}

export async function getJoinedProjects() {
  const accepted = readRequests().filter(
    (r) => r.userId === currentUser.id && r.status === "accepted"
  );
  const projects = await getMyProjects();
  return accepted
    .map((r) => projects.find((p) => String(p.id) === String(r.projectId)))
    .filter(Boolean)
    .map((project) => ({ project, owner: getOwner(project.id) }));
}
