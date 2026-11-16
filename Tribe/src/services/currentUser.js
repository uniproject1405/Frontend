// The demo user whose data (projects, requests) the mock store belongs to.
// Whether someone is signed in comes from the auth feature (`useAuth()`), not from here.
// The editable profile lives in localStorage so owners can "see" who is applying.
import { emitChange } from "./store";

export const LOGIN_PATH = "/login";

export const PROFILE_KEY = "tribe_profile";
export const defaultProfile = {
  name: "نیوشا گیلانی",
  headline: "توسعه‌دهنده فرانت‌اند",
  bio: "عاشق ساخت رابط‌های ساده و آرام و یادگرفتن از هم‌تیمی‌هایم هستم.",
  skills: ["React", "طراحی رابط کاربری", "Figma"],
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
