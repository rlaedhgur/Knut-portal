// src/lib/storage.ts
export function safeGetJSON<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }
  
  export function safeSetJSON(key: string, value: unknown) {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(value));
  }
  