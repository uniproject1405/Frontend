// Validation + href helpers for the optional profile links
export const isUrl = v => !v || /^https?:\/\/\S+\.\S+$/.test(v);
export const isTelegram = v => !v || /^@[A-Za-z0-9_]{4,32}$/.test(v) || /^https?:\/\/(t|telegram)\.me\/\S+$/.test(v);

// "@name" -> https://t.me/name
export const telegramHref = v => (v.startsWith('@') ? `https://t.me/${v.slice(1)}` : v);
