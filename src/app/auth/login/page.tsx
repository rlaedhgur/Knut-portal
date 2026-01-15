// src/app/auth/login/page.tsx
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { login } from "@/lib/auth";

const DEMO_ID = "2240030";
const DEMO_PW = "dja12345678!";

// ✅ public/images/icons/ 여기에 파일 넣고 이름만 맞추면 됩니다.
const QUICK_ICONS = [
  { label: "로그인/로그아웃\n유의사항", img: "/images/icons/notice.png" },
  { label: "웹메일", img: "/images/icons/webmail.png" },
  { label: "원격 PC지원", img: "/images/icons/remote-pc.png" },
  { label: "원격접속", img: "/images/icons/remote-access.png" },
];

export default function LoginPage() {
  const router = useRouter();

  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberId, setRememberId] = useState(false);
  const [error, setError] = useState("");

  // ✅ 아이디 저장값 불러오기 (렌더 중 setState 금지 → useEffect로)
  useEffect(() => {
    try {
      const remembered = localStorage.getItem("remember_student_id");
      if (remembered) setStudentId(remembered);
    } catch {}
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (studentId.trim() !== DEMO_ID || password !== DEMO_PW) {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
      return;
    }

    // ✅ 기존 auth 로직 유지(세션 저장) - auth.ts 기본은 id 1개만 받습니다
    login(studentId.trim(), password);

    // ✅ 아이디 저장(선택)
    try {
      if (rememberId) localStorage.setItem("remember_student_id", studentId.trim());
      else localStorage.removeItem("remember_student_id");
    } catch {}

    router.replace("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ✅ 메인 영역: 위쪽 잘림 방지 + 푸터와 간격 */}
      <main className="flex-1 pt-8 pb-10">
        <div className="w-full">
          <div
            className="grid items-start gap-x-8"
            style={{ gridTemplateColumns: "5.5fr 2.5fr 2fr" }}
          >
            {/* =========================
                LEFT (left.jpg)
               ========================= */}
            <section className="relative overflow-hidden rounded-r-[28px] rounded-l-none min-h-[640px]">
              <Image src="/images/left.jpg" alt="left" fill priority className="object-cover" />

              {/* 전체 톤 살짝만(너무 찐하지 않게) */}
              <div className="absolute inset-0 bg-[#0b2a4a]/15" />

              {/* ✅ 워터마크 로고(왼쪽 중앙 크게, 더 옅게) */}
              <div className="absolute -left-44 top-1/2 -translate-y-1/2 w-[420px] opacity-[0.1] pointer-events-none select-none">
                <Image
                  src="/images/logo.png"
                  alt="watermark"
                  width={1240}
                  height={1240}
                  className="object-contain"
                />
              </div>

              {/* ✅ 하단 안내 패널: "오른쪽 아래 완전 부착" + blur 제거 + 원하는 밑줄 구조 */}
              <div className="absolute right-0 bottom-0">
                <div className="rounded-tl-[18px] rounded-tr-[18px] rounded-bl-[18px] rounded-br-[28px] bg-[#1f5c86]/20 border border-white/20 px-10 py-8 text-white">
                  {/* ✅ 상단: 제목 2개 + 각각 아래 밑줄(가운데 세로선 없음) */}
                  <div className="grid grid-cols-2 gap-8 mb-6">
                    <div>
                      <div className="font-semibold text-[15px]">학생/교직원 로그인 안내</div>
                      <div className="mt-2 h-px bg-white/40 w-[260px]" />
                    </div>

                    <div>
                      <div className="font-semibold text-[15px] text-left">바로가기 아이콘</div>
                      {/* ✅ 밑줄은 "오른쪽 칼럼이지만 왼쪽에서 시작" */}
                      <div className="mt-2 h-px bg-white/40 w-[220px] mr-auto" />
                    </div>
                  </div>

                  {/* ✅ 아래 내용: 2칼럼 유지 */}
                  <div className="grid grid-cols-2 gap-8 items-start">
                    {/* 왼쪽 안내 */}
                    <div className="space-y-2 text-[13px] leading-relaxed text-white/90">
                      <div className="font-semibold text-white">포털 사용자 아이디</div>
                      <div>학번 / 교직원번호</div>

                      <div className="pt-3 font-semibold text-white">비밀번호</div>
                      <div>
                        - 초기 비밀번호 : 주민등록번호 뒷 7자리
                        <br />- (9자리) 대문자, 소문자, 숫자, 특수문자 중 3종류 이상
                      </div>

                      <div className="pt-2 text-white/90">
                        ※ 최초 로그인 시 비밀번호를 변경해야 합니다.
                      </div>
                    </div>

                    {/* 오른쪽 아이콘(이미지로 교체) */}
                    <div className="grid grid-cols-2 gap-4">
                      {QUICK_ICONS.map((x) => (
                        <button
                          key={x.label}
                          type="button"
                          className="rounded-[16px] bg-white/10 hover:bg-white/15 border border-white/20 px-4 py-4 text-center"
                        >
                          <div className="mx-auto mb-2 h-10 w-10 relative">
                            <Image src={x.img} alt={x.label} fill className="object-contain" />
                          </div>
                          <div className="whitespace-pre-line text-[13px] text-white/90">
                            {x.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* =========================
                CENTER (Login box)
               ========================= */}
            <section className="flex justify-center">
              {/* ✅ 살짝 내려와 보이게(상단 텀) */}
              <div className="w-full max-w-[420px] pt-4">
                {/* 상단 링크 */}
                <div className="text-sm text-neutral-700 space-y-2 mb-5">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4" />
                    <span>포털시스템 사용 안내 동영상(교직원)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4" />
                    <span>포털시스템 사용 안내 동영상(학생)</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-500">※</span>
                    <span>통합정보시스템 이용가이드(학생)</span>
                  </div>
                </div>

                {/* 로고/타이틀 */}
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Image src="/images/login_logo.jpg" alt="logo" width={400} height={400} />
                </div>

                {/* 로그인 카드 */}
                <div className="border border-neutral-200 rounded-[14px] p-6 shadow-sm bg-white">
                  <div className="flex items-center gap-2 mb-3">
                    {/* ✅ 로그인 아이콘(이미지로 교체) */}
                    <div className="relative h-5 w-5">
                      <Image
                        src="/images/icons/login_lock.png"
                        alt="login"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="font-bold text-neutral-800">LOGIN</div>
                  </div>

                  <form onSubmit={onSubmit} className="space-y-3">
                    <input
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="아이디(학번/교직원번호)"
                      className="w-full border border-neutral-300 bg-[#eef5ff] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-300"
                    />
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="비밀번호"
                      type="password"
                      className="w-full border border-neutral-300 bg-[#eef5ff] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-300"
                    />

                    {error ? <div className="text-sm text-red-600 font-medium">{error}</div> : null}

                    <button
                      type="submit"
                      className="w-full bg-[#607792] text-white py-2.5 text-sm font-semibold hover:opacity-90"
                    >
                      로그인
                    </button>

                    <button
                      type="button"
                      className="w-full bg-[#607792] text-white py-2.5 text-sm font-semibold hover:opacity-90"
                    >
                      시간강사/비전임교원 강의경력증명원
                    </button>

                    <div className="flex items-center justify-between text-xs text-neutral-700 pt-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={rememberId}
                          onChange={(e) => setRememberId(e.target.checked)}
                          className="h-4 w-4"
                        />
                        <span>학번/교직원번호 저장</span>
                      </label>

                      <button
                        type="button"
                        className="underline underline-offset-2"
                      >
                        학번/교직원번호 조회
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-neutral-700 pt-2">
                      <button
                        type="button"
                        className="flex items-center justify-center gap-2 py-2 border border-neutral-200 hover:bg-neutral-50"
                      >
                        <span>ⓘ</span> 비밀번호 재설정
                      </button>
                      <button
                        type="button"
                        className="flex items-center justify-center gap-2 py-2 border border-neutral-200 hover:bg-neutral-50"
                      >
                        <span>ⓘ</span> 개인정보처리방침
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </section>

            {/* =========================
                RIGHT (right.jpg)
               ========================= */}
            <section className="relative overflow-hidden rounded-l-[28px] rounded-r-none min-h-[640px]">
              <Image src="/images/right.jpg" alt="right" fill className="object-cover" priority />
              <div className="absolute inset-0 bg-white/5" />
            </section>
          </div>
        </div>
      </main>

      {/* ✅ 푸터 위 흰 여백(검정 바가 바로 붙어 보이지 않게) */}
      <div className="h-10 bg-white" />

      {/* ✅ 하단 푸터 바 */}
      <footer className="bg-[#333] text-white">
        <div className="mx-auto max-w-[1500px] px-6 py-6">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3 min-w-[260px]">
              <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                <span className="text-lg">🏛️</span>
              </div>
              <div className="font-semibold opacity-90">국립한국교통대학교</div>
            </div>

            <div className="flex-1 grid grid-cols-3 gap-6 text-xs opacity-90">
              <div>
                <div className="font-semibold mb-1">충주캠퍼스</div>
                <div>27469 충청북도 충주시 대학로 50</div>
                <div>TEL.043-841-5114</div>
              </div>
              <div>
                <div className="font-semibold mb-1">증평캠퍼스</div>
                <div>27909 충청북도 증평군 대학로 61</div>
                <div>TEL.043-820-5114</div>
              </div>
              <div>
                <div className="font-semibold mb-1">의왕캠퍼스</div>
                <div>16106 경기도 의왕시 철도박물관로 157</div>
                <div>TEL.031-460-0500</div>
              </div>
            </div>
          </div>

          <div className="text-center text-[11px] opacity-70 mt-4">
            COPYRIGHT(c)2020 KOREA NATIONAL UNIVERSITY OF TRANSPORTATION ALL RIGHTS RESERVED
          </div>
        </div>
      </footer>

      {/* ✅ 푸터 아래 흰 여백(밑에도 흰 공간 보이게) */}
      <div className="h-16 bg-white" />
    </div>
  );
}
