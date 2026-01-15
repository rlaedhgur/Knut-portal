// src/app/auth/login/page.tsx
"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";

const REMEMBER_KEY = "knut_portal_remember_studentId_v1";

export default function LoginPage() {
  const router = useRouter();

  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberId, setRememberId] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ 저장된 학번 불러오기(선택 기능)
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(REMEMBER_KEY);
      if (saved) {
        setStudentId(saved);
        setRememberId(true);
      }
    } catch {}
  }, []);

  const canSubmit = useMemo(() => {
    return studentId.trim().length > 0 && password.length > 0 && !loading;
  }, [studentId, password, loading]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!studentId.trim() || !password) {
      setError("학번(아이디)과 비밀번호를 입력해 주세요.");
      return;
    }

    setLoading(true);
    try {
      const result = login(studentId, password);
      if (!result.ok) {
        setError(result.message);
        return;
      }

      // ✅ 학번 저장 옵션
      try {
        if (rememberId) window.localStorage.setItem(REMEMBER_KEY, studentId.trim());
        else window.localStorage.removeItem(REMEMBER_KEY);
      } catch {}

      router.replace("/profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1200px] items-stretch gap-8 px-4 py-8">
        {/* ✅ 좌측(스샷 느낌의 큰 이미지 영역) */}
        <div className="relative hidden w-[62%] overflow-hidden rounded-[28px] bg-slate-900 lg:block">
          <Image
            src="/images/right.jpg"
            alt="background"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/55" />

          <div className="relative z-10 flex h-full flex-col justify-end p-10 text-white">
            <div className="max-w-[520px]">
              <p className="text-sm font-semibold opacity-90">학생/교직원 로그인 안내</p>
              <div className="mt-2 h-px w-full bg-white/25" />
              <div className="mt-4 space-y-2 text-sm leading-6 text-white/90">
                <p>• 포털 사용자 아이디 : 학번 / 교직원번호</p>
                <p>• 비밀번호 : 초기 비밀번호는 안내 정책에 따릅니다.</p>
                <p>• 최초 로그인 시 비밀번호 변경이 필요할 수 있습니다.</p>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4 text-center text-xs text-white/90">
                <div className="rounded-2xl bg-white/10 px-4 py-4 ring-1 ring-white/15">
                  <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-white/15" />
                  로그인/로그아웃<br />유의사항
                </div>
                <div className="rounded-2xl bg-white/10 px-4 py-4 ring-1 ring-white/15">
                  <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-white/15" />
                  웹메일
                </div>
                <div className="rounded-2xl bg-white/10 px-4 py-4 ring-1 ring-white/15">
                  <div className="mx-auto mb-2 h-10 w-10 rounded-full bg-white/15" />
                  원격지원
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ 우측 로그인 카드 */}
        <div className="flex w-full flex-col justify-center lg:w-[38%]">
          <div className="mx-auto w-full max-w-[420px]">
            {/* 상단 링크 느낌(스샷 체크리스트 느낌) */}
            <div className="mb-6 space-y-2 text-[12px] text-slate-700">
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-sm border border-slate-400 bg-white" />
                포털시스템 사용 안내 동영상(교직원)
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-sm border border-slate-400 bg-white" />
                포털시스템 사용 안내 동영상(학생)
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500">※</span>
                통합정보시스템 이용가이드(학생)
              </div>
            </div>

            <div className="rounded-3xl bg-white px-8 py-8 shadow-sm ring-1 ring-slate-200">
              <div className="flex flex-col items-center">
                <Image
                  src="/images/logo.png"
                  alt="KNUT"
                  width={220}
                  height={48}
                  className="h-auto w-[220px]"
                  priority
                />
                <div className="mt-4 flex w-full items-center gap-3">
                  <span className="h-px flex-1 bg-slate-200" />
                  <span className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <span className="inline-block h-4 w-4 rounded bg-slate-100" />
                    LOGIN
                  </span>
                  <span className="h-px flex-1 bg-slate-200" />
                </div>
              </div>

              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    학번 / 교직원번호
                  </label>
                  <input
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-400"
                    placeholder="예) 2511111"
                    autoComplete="username"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    비밀번호
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-400"
                    placeholder="비밀번호 입력"
                    autoComplete="current-password"
                  />
                </div>

                <div className="flex items-center justify-between pt-1 text-xs text-slate-600">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-slate-600"
                      checked={rememberId}
                      onChange={(e) => setRememberId(e.target.checked)}
                    />
                    학번/교직원번호 저장
                  </label>

                  <button
                    type="button"
                    className="text-slate-600 underline-offset-2 hover:underline"
                    onClick={() => alert("데모 화면입니다. (학번/교직원번호 조회 기능은 연결되지 않았습니다.)")}
                  >
                    학번/교직원번호 조회
                  </button>
                </div>

                {error && (
                  <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full rounded-md bg-slate-600 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "로그인 중..." : "로그인"}
                </button>

                <button
                  type="button"
                  className="w-full rounded-md bg-slate-600/90 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
                  onClick={() => alert("데모 화면입니다. (부가 로그인 기능은 연결되지 않았습니다.)")}
                >
                  시간강사/비전임교원 강의경력증명원
                </button>

                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <button
                    type="button"
                    className="hover:underline"
                    onClick={() => alert("데모 화면입니다. (비밀번호 재설정 미구현)")}
                  >
                    비밀번호 재설정
                  </button>
                  <button
                    type="button"
                    className="hover:underline"
                    onClick={() => alert("데모 화면입니다. (개인정보처리방침 미연결)")}
                  >
                    개인정보처리방침
                  </button>
                </div>

                {/* ✅ 데모 안내(원하시면 제거 가능) */}
                <div className="pt-2 text-[11px] text-slate-500">
                  ※ 현재 데모 로그인 계정은 지정된 1개만 허용됩니다.
                </div>
              </form>
            </div>

            <div className="mt-6 text-center text-xs text-slate-500">
              COPYRIGHTⓒ KOREA NATIONAL UNIVERSITY OF TRANSPORTATION. ALL RIGHTS RESERVED
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
