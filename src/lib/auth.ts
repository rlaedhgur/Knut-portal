// src/lib/auth.ts

export type Session = {
  studentId: string;
  loggedInAt: number;
};

const SESSION_KEY = "knut_portal_session_v1";

// ✅ 허용 계정(요청하신 값)
export const ALLOWED_AUTH = {
  studentId: "2240030",
  password: "dja12345678!",
};

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function validateCredentials(studentId: string, password: string) {
  return (
    (studentId ?? "").trim() === ALLOWED_AUTH.studentId &&
    (password ?? "") === ALLOWED_AUTH.password
  );
}

export function setSession(session: Session) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(SESSION_KEY);
  const parsed = safeParse<Session>(raw);

  // ✅ 세션이 있더라도 허용 학번이 아니면 무효 처리
  if (!parsed?.studentId) return null;
  if (String(parsed.studentId).trim() !== ALLOWED_AUTH.studentId) return null;

  return parsed;
}

export function login(studentId: string, password: string) {
  if (!validateCredentials(studentId, password)) {
    return {
      ok: false as const,
      message: "아이디(학번) 또는 비밀번호가 올바르지 않습니다.",
    };
  }

  setSession({
    studentId: ALLOWED_AUTH.studentId,
    loggedInAt: Date.now(),
  });

  return { ok: true as const };
}

export function logout() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
}
