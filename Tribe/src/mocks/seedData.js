// داده‌ی نمونه‌ی صفحه‌ی «درخواست‌های همکاری من»:
// فقط پروژه‌ها، صاحبان پروژه و درخواست‌های ارسالی کاربر فعلی.
import currentUser from "../services/currentUser";

export const SEED_VERSION = "10";

const HOUR = 3600 * 1000;
const ago = (hours) => new Date(Date.now() - hours * HOUR).toISOString();

const person = (id, name, headline, bio, skills) => ({
  id: `user-${id}`,
  username: id,
  name,
  headline,
  bio,
  skills,
});

const people = {
  arman: person("arman", "آرمان رضایی", "تحلیلگر داده", "", ["Data Analysis"]),
  nazanin: person("nazanin", "نازنین احمدی", "طراح تجربه کاربری", "", ["UI/UX"]),
  ali: person("ali", "علی نوری", "پژوهشگر", "", ["Research"]),
  maryam: person("maryam", "مریم کاظمی", "توسعه‌دهنده فرانت‌اند", "", ["React"]),
  reza: person("reza", "رضا امینی", "طراح رابط کاربری", "", ["Design"]),
  negar: person("negar", "نگار شریفی", "طراح محصول", "", ["Product Design"]),
};

// صاحب هر پروژه
export const seedOwners = {
  "other-4": people.arman,
  "other-5": people.nazanin,
  "project-3": people.ali,
  "other-6": people.maryam,
  "project-1": people.reza,
  "other-7": people.negar,
};

// extra: { category, commitment, lookingFor: [], milestones: [] }
const p = (id, title, goal, description, requiredSkills, capacity, status = "open", hoursAgo = 48, extra = {}) => ({
  id,
  title,
  goal,
  description,
  requiredSkills,
  capacity,
  status,
  createdAt: ago(hoursAgo),
  ...extra,
});

export const seedProjects = [
  p(
    "other-4",
    "داده‌های اقلیمی آزاد",
    "مجموعه داده‌های اقلیمی باز برای تحلیل و مصورسازی.",
    "داده‌های باز اقلیمی را جمع‌آوری و قابل استفاده می‌کنیم.",
    ["Data Analysis", "Python"],
    3,
    "open",
    80,
    { category: "داده و محیط زیست" }
  ),
  p(
    "other-5",
    "دفتر آزمایش باز",
    "فضای مشترک برای آزمایش و ثبت نتایج پژوهشی.",
    "یک دفتر آزمایش دیجیتال باز برای تیم‌های کوچک.",
    ["UI/UX", "React"],
    3,
    "open",
    70,
    { category: "پژوهش و توسعه" }
  ),
  p(
    "project-3",
    "حلقه مقاله",
    "حلقه‌ای برای خواندن و نقد مقالات علمی.",
    "هر هفته یک مقاله می‌خوانیم و با هم نقد می‌کنیم.",
    ["Research", "Writing"],
    4,
    "open",
    200,
    { category: "همکاری دانشگاهی" }
  ),
  p(
    "other-6",
    "کتابخانه محله",
    "کتابخانه محلی دیجیتال برای محله‌ها.",
    "کتاب و منابع محلی را در دسترس همه قرار می‌دهیم.",
    ["React", "Design"],
    3,
    "open",
    90,
    { category: "جامعه و فرهنگ" }
  ),
  p(
    "project-1",
    "دستیار مطالعه",
    "یک همراه مطالعه‌ی هوشمند بسازید.",
    "برنامه‌ریزی مطالعه و آزمون فاصله‌دار.",
    ["React", "Python"],
    5,
    "open",
    160,
    { category: "آموزش و فناوری" }
  ),
  p(
    "other-7",
    "نقشه باغ‌های شهری",
    "نقشه‌برداری از باغ‌ها و فضاهای سبز شهری.",
    "باغ‌های شهری را روی نقشه می‌آوریم تا مردم پیدا کنند.",
    ["Maps", "React"],
    3,
    "open",
    110,
    { category: "شهر و پایداری" }
  ),
];

const r = (id, projectId, status, role, message, hoursAgo) => ({
  id: `req-${id}`,
  projectId,
  userId: currentUser.id,
  applicantName: currentUser.name,
  role,
  message,
  status,
  createdAt: ago(hoursAgo),
});

// ۶ درخواست مطابق تصویر اول
export const seedRequests = [
  r(1, "other-4", "accepted", "تحلیلگر داده", "علاقه‌مند به تحلیل داده‌های اقلیمی هستم.", 80),
  r(2, "other-5", "pending", "طراح تجربه کاربری", "تجربه طراحی رابط برای ابزارهای پژوهشی دارم.", 70),
  r(3, "project-3", "rejected", "پژوهشگر", "", 200),
  r(4, "other-6", "pending", "توسعه‌دهنده فرانت‌اند", "روی پروژه‌های جامعه کار کرده‌ام.", 90),
  r(5, "project-1", "pending", "طراح رابط کاربری", "طراحی رابط مطالعه را دوست دارم.", 160),
  r(6, "other-7", "accepted", "طراح محصول", "روی نقشه‌های شهری تجربه دارم.", 110),
];

export function applySeed() {
  localStorage.setItem("tribe_projects", JSON.stringify(seedProjects));
  localStorage.setItem("tribe_project_requests", JSON.stringify(seedRequests));
  localStorage.removeItem("tribe_notifications");
  localStorage.removeItem("tribe_profile");
  localStorage.setItem("tribe_seed_version", SEED_VERSION);
}

export function ensureSeed() {
  try {
    if (localStorage.getItem("tribe_seed_version") !== SEED_VERSION) applySeed();
  } catch {
    /* storage unavailable */
  }
}
