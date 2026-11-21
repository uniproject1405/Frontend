
import { emitChange } from "./store";

export const LOGIN_PATH = "/login";
export const PROFILE_KEY = "tribe_profile";

export const defaultProfile = {
  name: "نیوشا گیلانی",
  headline: "توسعه‌دهنده فرانت‌اند",
  bio: "عاشق ساخت رابط‌های ساده و آرام و یادگرفتن از هم‌تیمی‌هایم هستم.",
  skills: [],

  // Additional profile information
  summary: "",
  about: "",
  avatarUrl: "",

  links: {
    github: "",
    linkedin: "",
    telegram: "",
  },

  openToCollab: {
    enabled: false,
    note: "",
  },

  availableToHelp: {
    enabled: false,
    note: "",
  },

  helpTopics: [],
};

export function getProfile() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROFILE_KEY)) || {};

    return {
      ...defaultProfile,
      ...saved,

      // Merge nested objects to support older saved profiles
      links: {
        ...defaultProfile.links,
        ...(saved.links || {}),
      },

      openToCollab: {
        ...defaultProfile.openToCollab,
        ...(saved.openToCollab || {}),
      },

      availableToHelp: {
        ...defaultProfile.availableToHelp,
        ...(saved.availableToHelp || {}),
      },

      skills: Array.isArray(saved.skills)
        ? saved.skills
        : defaultProfile.skills,

      helpTopics: Array.isArray(saved.helpTopics)
        ? saved.helpTopics
        : defaultProfile.helpTopics,
    };
  } catch {
    return { ...defaultProfile };
  }
}

export function saveProfile(profile) {
  const clean = {
    name: (profile.name || "").trim().slice(0, 40) || defaultProfile.name,
    headline: (profile.headline || "").trim().slice(0, 60),
    bio: (profile.bio || "").trim().slice(0, 300),

    skills: (Array.isArray(profile.skills) ? profile.skills : [])
      .map((s) => String(s).trim())
      .filter(Boolean)
      .slice(0, 12),

    summary: (profile.summary || "").trim().slice(0, 200),
    about: (profile.about || "").trim().slice(0, 1000),
    avatarUrl: profile.avatarUrl || "",

    links: {
      github: (profile.links?.github || "").trim(),
      linkedin: (profile.links?.linkedin || "").trim(),
      telegram: (profile.links?.telegram || "").trim(),
    },

    openToCollab: {
      enabled: Boolean(profile.openToCollab?.enabled),
      note: (profile.openToCollab?.note || "").trim(),
    },

    availableToHelp: {
      enabled: Boolean(profile.availableToHelp?.enabled),
      note: (profile.availableToHelp?.note || "").trim(),
    },

    helpTopics: (Array.isArray(profile.helpTopics) ? profile.helpTopics : [])
      .map((topic) => String(topic).trim())
      .filter(Boolean),
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
