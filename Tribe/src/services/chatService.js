import { emitChange, useStoredJson } from "./store";
import { request } from "./apiClient.js";
import { fa } from "../utils/fa";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

const CHAT_CONVERSATIONS_KEY = "tribe_chat_conversations";
const CHAT_MESSAGES_KEY = "tribe_chat_messages";

// Seed threads: [isMine, text] pairs, oldest first. Long enough to show scrolling and dates.
// Bump SEED_VERSION when this changes so browsers that already stored the old seed reload it.
const SEED_VERSION = "3";
const SEED_VERSION_KEY = "tribe_chat_seed_version";
const ME = { id: 999, username: "me", display_name: "من" };

const THREADS = [
  {
    id: 1,
    other: { id: "user-sara", username: "sara", display_name: "سارا م." },
    project: { id: "project-1", title: "دستیار هوشمند مطالعه", status: "open" },
    endMinutesAgo: 35, stepMinutes: 95, unread: 2,
    lines: [
      [false, "سلام وقت بخیر! درخواست عضویت شما در تیم دستیار مطالعه رو دیدم."],
      [true, "سلام سارا، ممنون که پیام دادید. خوشحال می‌شم بیشتر درباره پروژه بدونم."],
      [false, "دستیار سرفصل‌ها رو می‌خونه و یه برنامه‌ی هفتگی می‌سازه. الان حدود چهل دانشجو تستش می‌کنن."],
      [true, "عالیه. سؤال‌های آزمون رو چطوری می‌سازید؟"],
      [false, "از روی یادداشت‌های درس، با یه مدل متن‌باز کوچک. ولی کیفیت سؤال‌ها هنوز یکدست نیست."],
      [true, "پس بخش ارزیابی کیفیت سؤال‌ها کار زیادی داره."],
      [false, "دقیقاً. برای همین دنبال کسی هستیم که با PyTorch و ارزیابی مدل تجربه داشته باشه."],
      [true, "من دو سال روی مدل‌های متنی کار کردم. نمونه‌کارهام توی پروفایلم هست."],
      [false, "دیدمشون، پروژه‌ی خلاصه‌ساز مقاله‌ها خیلی تمیز بود."],
      [true, "ممنون! هفته‌ای چند ساعت وقت لازمه؟"],
      [false, "حدود ۶ ساعت. یه تماس ۴۵ دقیقه‌ای هم چهارشنبه عصرها داریم."],
      [true, "چهارشنبه‌ها برام خوبه. ۶ ساعت هم شدنیه."],
      [false, "نقش‌ها رو اینطوری دیدیم: من زمان‌بندی، علی رابط کاربری، و شما کیفیت سؤال‌ها."],
      [true, "منطقیه. کیفیت سؤال رو با چه معیاری می‌سنجیم؟"],
      [false, "فعلاً دانشجوها به هر سؤال از ۱ تا ۵ امتیاز می‌دن."],
      [true, "یه پیشنهاد: یه مجموعه‌ی ثابت از ۲۰۰ سؤال نگه داریم که هر نسخه‌ی مدل روش سنجیده بشه."],
      [false, "ایده‌ی خوبیه، توی سند پروژه اضافه‌اش می‌کنم."],
      [true, "کد متن‌باز منتشر می‌شه؟"],
      [false, "بله، با مجوز MIT. یادداشت‌های دانشجوها نه."],
      [true, "روشنه. من آماده‌ام شروع کنم."],
      [false, "عالی! درخواستت رو تأیید می‌کنم. لینک مخزن رو همین‌جا می‌فرستم."],
      [false, "لینک مخزن و سند پروژه رو فرستادم. اگه سؤالی بود همین‌جا بپرس."],
    ],
  },
  {
    id: 2,
    other: { id: "user-ali", username: "ali", display_name: "علی ر." },
    project: { id: "project-2", title: "پلتفرم جامعه", status: "open" },
    endMinutesAgo: 180, stepMinutes: 140, unread: 0,
    lines: [
      [true, "سلام علی، من برای نقش طراح UI/UX درخواست دادم."],
      [false, "سلام! آره دیدم. قبلاً برای جامعه‌ها طراحی کردی؟"],
      [true, "بله، برای اپ باشگاه کتاب‌خوانی دانشگاهمون."],
      [false, "عالیه. صفحه‌ی رویداد سخت‌ترین بخش ماست."],
      [true, "مشکل اصلی‌اش چیه؟"],
      [false, "برگزارکننده‌ها می‌گن ساختن رویداد خیلی طول می‌کشه."],
      [true, "شاید بشه با یه الگوی آماده شروع کرد: عنوان، زمان، مکان و تمام."],
      [false, "قانع‌کننده‌ست. بقیه‌ی جزئیات اختیاری بشه."],
      [true, "طرح فعلی آماده‌ست که ببینم؟"],
      [false, "نسخه‌ی اول رو تا آخر هفته تموم می‌کنم."],
      [true, "باشه، منتظرم."],
      [false, "راستی فونت رو وزیرمتن گذاشتیم، اعداد هم فارسی."],
      [true, "عالیه. تاریخ‌ها هم شمسی باشه دیگه؟"],
      [false, "حتماً. بیشتر کاربرها دانشجو هستن."],
      [true, "برای فهرست اعضا جست‌وجو هم لازمه؟"],
      [false, "برای گروه‌های بالای ۵۰ نفر آره."],
      [true, "پس من از صفحه‌ی رویداد و فهرست اعضا شروع می‌کنم."],
      [false, "طرح‌های اولیه فیگما آماده شده، خوشحال میشم نظرت رو بگی."],
    ],
  },
  {
    id: 3,
    other: { id: "user-mina", username: "mina", display_name: "مینا ک." },
    project: { id: "project-3", title: "ردیاب اکو", status: "closed" },
    endMinutesAgo: 60 * 26, stepMinutes: 50, unread: 0,
    lines: [
      [false, "سلام! ممنون که به ردیاب اکو علاقه نشون دادی."],
      [true, "سلام مینا، ایده‌ی جالبیه. چطوری ردپای کربن رو حساب می‌کنید؟"],
      [false, "از ضریب‌های استاندارد برای غذا، حمل‌ونقل و خرید استفاده می‌کنیم."],
      [true, "کاربر باید همه‌چیز رو دستی وارد کنه؟"],
      [false, "فعلاً آره، ولی می‌خوایم وارد کردن سریع با چند دکمه باشه."],
      [true, "برای نگه داشتن کاربر، یه چالش هفتگی خیلی کمک می‌کنه."],
      [false, "دقیقاً همینو می‌خواستیم! تو روی این بخش کار می‌کنی؟"],
      [true, "حتماً. فقط من هفته‌ای ۶ ساعت بیشتر وقت ندارم."],
      [false, "مشکلی نیست، کار رو کوچیک تقسیم می‌کنیم."],
      [true, "پس یه لیست کار برای هفته‌ی اول بفرست."],
      [false, "فرستادم توی Trello. سه کارت به اسم تو هست."],
      [true, "دیدم، از کارت «صفحه‌ی چالش» شروع می‌کنم."],
      [false, "عالیه، پنجشنبه با هم مرورش کنیم؟"],
      [true, "پنجشنبه ساعت ۶ عصر خوبه."],
    ],
  },
  {
    id: 4,
    other: { id: "user-kian", username: "kian", display_name: "کیان ب." },
    project: { id: "other-8", title: "مرور حال روزانه", status: "open" },
    endMinutesAgo: 8, stepMinutes: 4, unread: 3,
    lines: [
      [true, "سلام کیان، درخواستم برای نقش طراح محصول رو دیدی؟"],
      [false, "سلام! آره، همین الان تأییدش کردم."],
      [true, "خیلی ممنون! از کجا شروع کنم؟"],
      [false, "اول یه نگاه به جریان ثبت حال روزانه بنداز. الان چهار مرحله‌ست."],
      [true, "به نظرم چهار مرحله برای کاری که هر روز انجام می‌شه زیاده."],
      [false, "موافقم. هدف اینه که زیر ۱۰ ثانیه تموم بشه."],
      [true, "یه پیشنهاد: انتخاب حال و یادداشت توی یه صفحه باشه."],
      [false, "جلسه‌ی شروع فردا ساعت ۱۰ صبحه."],
      [false, "لینک جلسه رو توی گروه گذاشتم."],
      [false, "اگه وقت داشتی قبلش اسکیس‌هات رو بفرست."],
    ],
  },
];

const minutesAgo = (m) => new Date(Date.now() - m * 60000).toISOString();

const SEED_MESSAGES = {};
const SEED_CONVERSATIONS = THREADS.map((t) => {
  const n = t.lines.length;
  SEED_MESSAGES[t.id] = t.lines.map(([mine, content], i) => ({
    id: t.id * 1000 + i,
    sender: mine ? ME : t.other,
    content,
    is_mine: mine,
    // Last message ends at endMinutesAgo; earlier ones step back in time.
    created_at: minutesAgo(t.endMinutesAgo + (n - 1 - i) * t.stepMinutes),
    is_read: i < n - t.unread,
  }));
  const last = SEED_MESSAGES[t.id][n - 1];
  return {
    id: t.id,
    other_participant: { ...t.other, avatar_display: null },
    project: t.project,
    last_message: { id: last.id, content: last.content, created_at: last.created_at, is_read: t.unread === 0 },
    unread_count: t.unread,
    updated_at: last.created_at,
  };
});

// Replace an older stored seed once, so everyone sees the longer threads.
try {
  if (localStorage.getItem(SEED_VERSION_KEY) !== SEED_VERSION) {
    localStorage.setItem(CHAT_CONVERSATIONS_KEY, JSON.stringify(SEED_CONVERSATIONS));
    localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(SEED_MESSAGES));
    localStorage.setItem(SEED_VERSION_KEY, SEED_VERSION);
  }
} catch {
  /* storage blocked: the in-memory seed is used */
}

function getLocalConversations() {
  try {
    const stored = localStorage.getItem(CHAT_CONVERSATIONS_KEY);
    if (!stored) {
      localStorage.setItem(CHAT_CONVERSATIONS_KEY, JSON.stringify(SEED_CONVERSATIONS));
      return SEED_CONVERSATIONS;
    }
    const list = JSON.parse(stored) || [];
    // Clean up phantom duplicates created by previous bug
    const seen = new Set();
    const cleaned = [];
    for (const c of list) {
      if (
        (String(c.other_participant?.id) === "101" || c.other_participant?.username === "user_101") &&
        (!c.last_message || !c.last_message.content)
      ) {
        continue;
      }
      const key = `${c.other_participant?.id || ""}_${c.project?.id || ""}`;
      if (!seen.has(key)) {
        seen.add(key);
        cleaned.push(c);
      }
    }
    const result = cleaned.length > 0 ? cleaned : SEED_CONVERSATIONS;
    if (result.length !== list.length) {
      localStorage.setItem(CHAT_CONVERSATIONS_KEY, JSON.stringify(result));
    }
    return result;
  } catch {
    return SEED_CONVERSATIONS;
  }
}

function setLocalConversations(list) {
  try {
    localStorage.setItem(CHAT_CONVERSATIONS_KEY, JSON.stringify(list));
    emitChange();
  } catch {
    /* ignore */
  }
}

function getLocalMessages(convId) {
  try {
    const stored = localStorage.getItem(CHAT_MESSAGES_KEY);
    const all = stored ? JSON.parse(stored) : SEED_MESSAGES;
    return all[convId] || all[String(convId)] || [];
  } catch {
    return SEED_MESSAGES[convId] || [];
  }
}

function setLocalMessages(convId, msgs) {
  try {
    const stored = localStorage.getItem(CHAT_MESSAGES_KEY);
    const all = stored ? JSON.parse(stored) : { ...SEED_MESSAGES };
    all[String(convId)] = msgs;
    all[convId] = msgs;
    localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(all));
    emitChange();
  } catch {
    /* ignore */
  }
}

export async function fetchConversations() {
  if (USE_MOCK) {
    return getLocalConversations();
  }
  try {
    const data = await request("/api/chat/conversations/");
    if (Array.isArray(data)) {
      setLocalConversations(data);
      return data;
    }
  } catch {
    /* Fallback to local store */
  }
  return getLocalConversations();
}

export async function fetchMessages(conversationId) {
  if (USE_MOCK) {
    const msgs = getLocalMessages(conversationId).map((m) => ({ ...m, is_read: true }));
    setLocalMessages(conversationId, msgs);
    const list = getLocalConversations().map((c) =>
      String(c.id) === String(conversationId) ? { ...c, unread_count: 0 } : c
    );
    setLocalConversations(list);
    return msgs;
  }
  try {
    const data = await request(`/api/chat/conversations/${conversationId}/messages/`);
    if (Array.isArray(data)) {
      setLocalMessages(conversationId, data);
      const list = getLocalConversations().map((c) =>
        String(c.id) === String(conversationId) ? { ...c, unread_count: 0 } : c
      );
      setLocalConversations(list);
      return data;
    }
  } catch {
    /* Fallback to local store */
  }
  // Mark local messages read
  const msgs = getLocalMessages(conversationId).map((m) => ({ ...m, is_read: true }));
  setLocalMessages(conversationId, msgs);
  const list = getLocalConversations().map((c) =>
    String(c.id) === String(conversationId) ? { ...c, unread_count: 0 } : c
  );
  setLocalConversations(list);
  return msgs;
}

export async function sendMessage(conversationId, content) {
  const clean = content.trim();
  if (!clean) return null;

  if (!USE_MOCK) {
    try {
      const res = await request(`/api/chat/conversations/${conversationId}/messages/`, {
        method: "POST",
        body: { content: clean },
      });
      if (res && res.id) {
        const msgs = [...getLocalMessages(conversationId), res];
        setLocalMessages(conversationId, msgs);
        return res;
      }
    } catch {
      /* Local optimistic send */
    }
  }

  const newMsg = {
    id: Date.now(),
    sender: { id: 999, username: "me", display_name: "من" },
    content: clean,
    is_mine: true,
    is_read: true,
    created_at: new Date().toISOString(),
  };

  const msgs = [...getLocalMessages(conversationId), newMsg];
  setLocalMessages(conversationId, msgs);

  // Update conversation last message
  const list = getLocalConversations().map((c) =>
    String(c.id) === String(conversationId)
      ? {
          ...c,
          last_message: {
            id: newMsg.id,
            content: clean,
            created_at: newMsg.created_at,
            is_read: true,
          },
          updated_at: newMsg.created_at,
        }
      : c
  );
  setLocalConversations(list);
  return newMsg;
}

export async function startOrGetConversation(recipientId, projectId = null, recipientInfo = null, projectInfo = null) {
  if (!recipientId) return null;

  if (!USE_MOCK) {
    try {
      const res = await request("/api/chat/conversations/", {
        method: "POST",
        body: {
          recipient_id: recipientId,
          project_id: projectId,
        },
      });
      if (res && res.id) {
        const current = getLocalConversations();
        const existing = current.find((c) => String(c.id) === String(res.id));
        if (!existing) {
          setLocalConversations([res, ...current]);
        }
        return res;
      }
    } catch {
      /* Fallback */
    }
  }

  const current = getLocalConversations();
  const existing = current.find(
    (c) =>
      String(c.other_participant?.id) === String(recipientId) &&
      (!projectId || String(c.project?.id) === String(projectId))
  );

  if (existing) return existing;

  const newConv = {
    id: Date.now(),
    other_participant: recipientInfo || {
      id: recipientId,
      username: `user_${recipientId}`,
      display_name: `کاربر ${fa(recipientId)}`,
    },
    project: projectInfo
      ? { id: projectInfo.id, title: projectInfo.title, status: "open" }
      : projectId
      ? { id: projectId, title: "پروژه", status: "open" }
      : null,
    last_message: null,
    unread_count: 0,
    updated_at: new Date().toISOString(),
  };

  setLocalConversations([newConv, ...current]);
  return newConv;
}

export function useChatList() {
  const conversations = useStoredJson(CHAT_CONVERSATIONS_KEY, SEED_CONVERSATIONS);
  const totalUnread = conversations.reduce((sum, c) => sum + (c.unread_count || 0), 0);
  return { conversations, totalUnread };
}

export function formatChatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const diffHours = (now - d) / (1000 * 60 * 60);

  // Pad after converting: fa() goes through Number(), which would drop a "0" pad.
  const hours = fa(d.getHours()).padStart(2, "۰");
  const minutes = fa(d.getMinutes()).padStart(2, "۰");
  const timeStr = `${hours}:${minutes}`;

  if (diffHours < 24 && d.getDate() === now.getDate()) {
    return timeStr;
  }
  if (diffHours < 48) {
    return `دیروز ${timeStr}`;
  }
  return new Intl.DateTimeFormat("fa-IR", { day: "numeric", month: "long" }).format(d);
}
