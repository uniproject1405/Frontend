import { useMemo, useSyncExternalStore } from "react";

// Tiny change-notifier so components re-render when localStorage data changes.
const listeners = new Set();

export function emitChange() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

// fallback must be a stable value (module constant).
export function useStoredJson(key, fallback) {
  const raw = useSyncExternalStore(subscribe, () => localStorage.getItem(key));
  return useMemo(() => {
    try {
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }, [raw, fallback]);
}
