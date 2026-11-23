import { emitChange, useStoredJson } from "./store";
import { request } from "../api/client.js";
import { fa } from "../utils/fa";

const CHAT_CONVERSATIONS_KEY = "tribe_chat_conversations";
const CHAT_MESSAGES_KEY = "tribe_chat_messages";

// Initial seed conversations matching Tribe projects
const SEED_CONVERSATIONS = [
  {
    id: 1,
    other_participant: {
      id: 101,
      username: "arash_dev",
      display_name: "آرش حسینی",
      avatar_display: null,
    },
    project: {
      id: 1,
      title: "پلتفرم یادگیری ماشین پزشکی",
      status: "open",
    },
    last_message: {
      id: 1,
      content: "سلام، رزومه شما رو دیدم. مایلید درباره نقش توسعه‌دهنده پایتون در پروژه مذاکره کنیم؟",
      created_at: new Date(Date.now() - 35 * 60000).toISOString(),
      is_read: false,
    },
    unread_count: 1,
    updated_at: new Date(Date.now() - 35 * 60000).toISOString(),
  },
  {
    id: 2,
    other_participant: {
      id: 102,
      username: "sara_design",
      display_name: "سارا راد",
      avatar_display: null,
    },
    project: {
      id: 2,
      title: "سامانه رزرو بلیت همایش",
      status: "open",
    },
    last_message: {
      id: 2,
      content: "طرح‌های اولیه فیگما آماده شده، خوشحال میشم نظرت رو بگی.",
      created_at: new Date(Date.now() - 3 * 3600000).toISOString(),
      is_read: true,
    },
    unread_count: 0,
    updated_at: new Date(Date.now() - 3 * 3600000).toISOString(),
  },
];

const SEED_MESSAGES = {
  1: [
    {
      id: 101,
      sender: { id: 101, username: "arash_dev", display_name: "آرش حسینی" },
      content: "سلام وقت بخیر! درخواست عضویت شما در تیم پلتفرم پزشکی رو بررسی کردیم.",
      is_mine: false,
      created_at: new Date(Date.now() - 60 * 60000).toISOString(),
    },
    {
      id: 102,
      sender: { id: 999, username: "me", display_name: "من" },
      content: "سلام آرش عزیز، ممنون از توجهتون. برای بخش معماری داده‌ها و مدل‌های PyTorch کاملاً آماده‌ام.",
      is_mine: true,
      created_at: new Date(Date.now() - 45 * 60000).toISOString(),
    },
    {
      id: 103,
      sender: { id: 101, username: "arash_dev", display_name: "آرش حسینی" },
      content: "سلام، رزومه شما رو دیدم. مایلید درباره نقش توسعه‌دهنده پایتون در پروژه مذاکره کنیم؟",
      is_mine: false,
      created_at: new Date(Date.now() - 35 * 60000).toISOString(),
    },
  ],
  2: [
    {
      id: 201,
      sender: { id: 102, username: "sara_design", display_name: "سارا راد" },
      content: "طرح‌های اولیه فیگما آماده شده، خوشحال میشم نظرت رو بگی.",
      is_mine: false,
      created_at: new Date(Date.now() - 3 * 3600000).toISOString(),
    },
  ],
};

function getLocalConversations() {
  try {
    const stored = localStorage.getItem(CHAT_CONVERSATIONS_KEY);
    if (!stored) {
      localStorage.setItem(CHAT_CONVERSATIONS_KEY, JSON.stringify(SEED_CONVERSATIONS));
      return SEED_CONVERSATIONS;
    }
    return JSON.parse(stored) || [];
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
    return all[convId] || [];
  } catch {
    return SEED_MESSAGES[convId] || [];
  }
}

function setLocalMessages(convId, msgs) {
  try {
    const stored = localStorage.getItem(CHAT_MESSAGES_KEY);
    const all = stored ? JSON.parse(stored) : { ...SEED_MESSAGES };
    all[convId] = msgs;
    localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(all));
    emitChange();
  } catch {
    /* ignore */
  }
}

export async function fetchConversations() {
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
  try {
    const data = await request(`/api/chat/conversations/${conversationId}/messages/`);
    if (Array.isArray(data)) {
      setLocalMessages(conversationId, data);
      // Mark as read in local conversation list
      const list = getLocalConversations().map((c) =>
        c.id === Number(conversationId) ? { ...c, unread_count: 0 } : c
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
    c.id === Number(conversationId) ? { ...c, unread_count: 0 } : c
  );
  setLocalConversations(list);
  return msgs;
}

export async function sendMessage(conversationId, content) {
  const clean = content.trim();
  if (!clean) return null;

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
    c.id === Number(conversationId)
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
      const existing = current.find((c) => c.id === res.id);
      if (!existing) {
        setLocalConversations([res, ...current]);
      }
      return res;
    }
  } catch {
    /* Fallback */
  }

  const current = getLocalConversations();
  const existing = current.find(
    (c) =>
      c.other_participant?.id === Number(recipientId) &&
      (!projectId || c.project?.id === Number(projectId))
  );

  if (existing) return existing;

  const newConv = {
    id: Date.now(),
    other_participant: recipientInfo || {
      id: Number(recipientId),
      username: `user_${recipientId}`,
      display_name: `کاربر شماره ${fa(recipientId)}`,
    },
    project: projectInfo
      ? { id: projectInfo.id, title: projectInfo.title, status: "open" }
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

  const hours = fa(String(d.getHours()).padStart(2, "0"));
  const minutes = fa(String(d.getMinutes()).padStart(2, "0"));
  const timeStr = `${hours}:${minutes}`;

  if (diffHours < 24 && d.getDate() === now.getDate()) {
    return timeStr;
  }
  if (diffHours < 48) {
    return `دیروز ${timeStr}`;
  }
  const month = fa(d.getMonth() + 1);
  const day = fa(d.getDate());
  return `${month}/${day}`;
}
