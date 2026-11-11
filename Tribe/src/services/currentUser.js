// Mock signed-in user. Replace with real auth when the backend is ready.
// The editable profile lives in localStorage so owners can "see" who is applying.
import { emitChange } from "./store";

export const PROFILE_KEY = "tribe_profile";
export const defaultProfile = {
  name: "Niusha G.",
  headline: "Frontend developer",
  bio: "I like building calm, simple interfaces and learning from teammates.",
  skills: ["React", "UI/UX", "Figma"],
};

export function getProfile() {
  try {
    return { ...defaultProfile, ...(JSON.parse(localStorage.getItem(PROFILE_KEY)) || {}) };
  } catch {
    return defaultProfile;
  }
}

export function saveProfile(profile) {
  const clean = {
    name: profile.name.trim().slice(0, 40) || defaultProfile.name,
    headline: (profile.headline || "").trim().slice(0, 60),
    bio: (profile.bio || "").trim().slice(0, 300),
    skills: (profile.skills || []).map((s) => s.trim()).filter(Boolean).slice(0, 12),
  };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(clean));
  emitChange();
  return clean;
}

const currentUser = {
  id: "user-niusha",
  get name() {
    return getProfile().name;
  },
};

export default currentUser;
