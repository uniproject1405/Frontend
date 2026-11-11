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

export async function getMyRequests() {
  const projects = await getMyProjects();
  return readRequests()
    .filter((r) => r.userId === currentUser.id)
    .map((request) => ({
      request,
      project: projects.find((p) => String(p.id) === String(request.projectId)),
    }))
    .filter((x) => x.project)
    .sort((a, b) => String(b.request.createdAt).localeCompare(String(a.request.createdAt)));
}

export async function createJoinRequest(projectId, message = "") {
  const { project, relation, spotsLeft } = await getProjectDetails(projectId);
  if (relation === "owner") throw new Error("You own this project.");
  if (relation === "member") throw new Error("You're already on this team.");
  if (relation === "pending") throw new Error("You already sent a request.");
  if (project.status !== "open") throw new Error("This project is closed.");
  if (spotsLeft === 0) throw new Error("This project is full.");

  const request = {
    id: crypto.randomUUID(),
    projectId: project.id,
    userId: currentUser.id,
    applicantName: currentUser.name,
    message: message.trim().slice(0, 300),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  writeRequests([...readRequests(), request]);
  return request;
}

export async function withdrawRequest(requestId) {
  const all = readRequests();
  const target = all.find((r) => String(r.id) === String(requestId) && r.userId === currentUser.id);
  if (!target) throw new Error("Request not found.");
  if (target.status !== "pending") throw new Error("Only waiting requests can be withdrawn.");
  writeRequests(all.filter((r) => r !== target));
}
