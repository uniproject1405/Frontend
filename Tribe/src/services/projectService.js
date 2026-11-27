// Single service boundary used by pages/components.
// Default: local mock. Set VITE_USE_PROJECTS_API=true only when backend is ready.
import * as mock from "./mockProjectService";
import * as api from "./apiProjectService";

const useApi = import.meta.env.VITE_USE_PROJECTS_API === "true";
const adapter = useApi ? api : mock;

export const getMyProjects = (...args) => adapter.getMyProjects(...args);
export const createProject = (...args) => adapter.createProject(...args);
export const getProjectById = (...args) => adapter.getProjectById(...args);
export const updateProject = (...args) => adapter.updateProject(...args);
export const closeProject = (...args) => adapter.closeProject(...args);
export const getProjectRequests = (...args) => adapter.getProjectRequests(...args);
export const updateRequestStatus = (...args) => adapter.updateRequestStatus(...args);
export const resetMockData = (...args) => mock.resetMockData(...args);
