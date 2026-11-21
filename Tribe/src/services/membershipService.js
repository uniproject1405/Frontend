import currentUser, { getProfile } from "./currentUser";
import owners, { directory } from "../mocks/owners";
import { getProjectById, getMyProjects } from "./mockProjectService";
import { emitChange, useStoredJson } from "./store";
import { addNotification } from "./notificationService";

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
  emitChange();
}

export function getOwner(projectId) {
  return owners[projectId] || currentUser;
}

function nameOf(request) {
  return request.applicantName || request.userName || request.applicant?.name || "نامشخص";
}

// relation: owner | member | pending | none
export async function getProjectDetails(projectId) {
  const project = await getProjectById(projectId);
  const owner = getOwner(project.id);
  const forProject = readRequests().filter((r) => String(r.projectId) === String(project.id));
  const members = forProject
    .filter((r) => r.status === "accepted")
    .map((r) => ({
      id: r.userId || r.id,
      name: nameOf(r),
      headline: directory[r.userId]?.headline || (r.userId === currentUser.id ? getProfile().headline : ""),
      joinedAt: r.createdAt,
    }));
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
  const all = readRequests();
  const accepted = all.filter((r) => r.userId === currentUser.id && r.status === "accepted");
  const projects = await getMyProjects();
  return accepted
    .map((r) => {
      const project = projects.find((p) => String(p.id) === String(r.projectId));
      if (!project) return null;
      const memberCount = all.filter((x) => String(x.projectId) === String(project.id) && x.status === "accepted").length;
      return { project, owner: getOwner(project.id), memberCount, joinedAt: r.createdAt };
    })
    .filter(Boolean);
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
  if (relation === "owner") throw new Error("شما مالک این پروژه هستید.");
  if (relation === "member") throw new Error("شما همین حالا عضو این تیم هستید.");
  if (relation === "pending") throw new Error("قبلاً درخواست فرستاده‌اید.");
  if (project.status !== "open") throw new Error("این پروژه بسته شده است.");
  if (spotsLeft === 0) throw new Error("ظرفیت این پروژه تکمیل است.");

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
  addNotification({
    type: "request_sent",
    title: `درخواست عضویت به «${project.title}» ارسال شد`,
    body: `در انتظار پاسخ از ${getOwner(project.id).name}`,
    link: "/my-projects?tab=requests",
  });
  return request;
}

export async function withdrawRequest(requestId) {
  const all = readRequests();
  const target = all.find((r) => String(r.id) === String(requestId) && r.userId === currentUser.id);
  if (!target) throw new Error("درخواست پیدا نشد.");
  if (target.status !== "pending") throw new Error("فقط درخواست‌های در انتظار را می‌توان پس گرفت.");
  writeRequests(all.filter((r) => r !== target));
}

const NONE = [];

// Counts shown on the profile page and the account menu.
export function useMyStats() {
  const projects = useStoredJson("tribe_projects", NONE);
  const requests = useStoredJson(REQUESTS_KEY, NONE);
  const mineIds = projects.filter((p) => getOwner(p.id).id === currentUser.id).map((p) => String(p.id));
  const toReview = requests.filter((q) => q.status === "pending" && mineIds.includes(String(q.projectId)));
  const byProject = mineIds
    .map((id) => ({
      project: projects.find((p) => String(p.id) === id),
      count: toReview.filter((q) => String(q.projectId) === id).length,
    }))
    .filter((x) => x.count > 0);
  const mine = requests.filter((q) => q.userId === currentUser.id);
  return {
    created: mineIds.length,
    joined: mine.filter((q) => q.status === "accepted").length,
    waiting: mine.filter((q) => q.status === "pending").length,
    notAccepted: mine.filter((q) => q.status === "rejected").length,
    toReview: toReview.length,
    byProject,
  };
}
