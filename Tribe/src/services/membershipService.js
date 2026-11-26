import currentUser from "./currentUser";
import { seedOwners } from "../mocks/seedData";
import { getMyProjects } from "./mockProjectService";

const REQUESTS_KEY = "tribe_project_requests";

function readRequests() {
  try {
    return JSON.parse(localStorage.getItem(REQUESTS_KEY)) || [];
  } catch {
    return [];
  }
}

function writeRequests(requests) {
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
}

function getOwner(projectId) {
  return seedOwners[projectId] || currentUser;
}

// درخواست‌های ارسالی کاربر فعلی؛ شکل هر آیتم: { request, project, owner }
export async function getMyRequests() {
  const projects = await getMyProjects();
  return readRequests()
    .filter((r) => r.userId === currentUser.id)
    .map((request) => {
      const project = projects.find((p) => String(p.id) === String(request.projectId));
      if (!project) return null;
      return {
        request,
        project,
        owner: getOwner(project.id),
      };
    })
    .filter(Boolean)
    .sort((a, b) => String(b.request.createdAt).localeCompare(String(a.request.createdAt)));
}

export async function withdrawRequest(requestId) {
  const all = readRequests();
  const target = all.find((r) => String(r.id) === String(requestId) && r.userId === currentUser.id);
  if (!target) throw new Error("درخواست پیدا نشد.");
  if (target.status !== "pending") throw new Error("فقط درخواست‌های در انتظار را می‌توان پس گرفت.");
  writeRequests(all.filter((r) => r !== target));
}
