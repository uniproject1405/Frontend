/**
 * نام نمایشی کاربر:
 * اگر name/نام خانوادگی معتبر بود همان؛ وگرنه نام کاربری یکتا.
 */
export function displayName(person, fallback = "کاربر") {
  if (!person) return fallback;

  const name = String(person.name || person.applicantName || "").trim();
  if (name) return name;

  const username =
    person.username ||
    person.userName ||
    (typeof person.id === "string" && person.id.startsWith("user-")
      ? person.id.slice(5)
      : person.id) ||
    "";

  const u = String(username).trim();
  if (u) return u.startsWith("@") ? u : `@${u}`;

  return fallback;
}
