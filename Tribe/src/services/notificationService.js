import { useMemo } from "react";
import { emitChange, useStoredJson } from "./store";
import { fa } from "../utils/fa";

const KEY = "tribe_notifications";
const NONE = [];

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

function write(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
  emitChange();
}

export function addNotification({ type, title, body = "", link = "/my-projects" }) {
  write([
    { id: crypto.randomUUID(), type, title, body, link, createdAt: new Date().toISOString(), read: false },
    ...read(),
  ]);
}

export function markRead(id) {
  write(read().map((x) => (x.id === id ? { ...x, read: true } : x)));
}

export function markAllRead() {
  write(read().map((x) => ({ ...x, read: true })));
}

export function clearRead() {
  write(read().filter((x) => !x.read));
}

// Newest first, plus the unread count.
export function useNotifications() {
  const raw = useStoredJson(KEY, NONE);
  return useMemo(() => {
    const items = [...raw].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    return { items, unread: items.filter((x) => !x.read).length };
  }, [raw]);
}

export function timeAgo(iso) {
  const mins = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return `${fa(mins)} دقیقه پیش`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${fa(hours)} ساعت پیش`;
  const days = Math.round(hours / 24);
  return days < 30 ? `${fa(days)} روز پیش` : new Date(iso).toLocaleDateString("fa-IR");
}

// Filter tab a notification belongs to.
export function groupOf(type) {
  return type === "request_received" ? "requests" : "updates";
}
