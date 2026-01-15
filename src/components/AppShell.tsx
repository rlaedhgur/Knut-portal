"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { getSession, logout } from "@/lib/auth";


type MenuItem = {
  label: string;
  href?: string; // 있으면 이동, 없으면 데코(알림)
};

type MenuGroup = {
  title: string;
  items: MenuItem[];
  defaultOpen?: boolean;
};

const GROUPS: MenuGroup[] = [
  {
    title: "학적",
    defaultOpen: false,
    items: [
      { label: "개인정보관리", href: "/profile" },
      { label: "휴학신청" },
      { label: "휴학연기신청" },
      { label: "복학신청" },
      { label: "학적변동조회" },
      { label: "다전공신청" },
      { label: "다전공취소신청" },
      { label: "사진변경신청" },
      { label: "트랙신청" },
    ],
  },
  {
    title: "수강",
    defaultOpen: false,
    items: [
      { label: "수강상담내역조회" },
      { label: "강좌개설현황" },
      { label: "동일교과목조회" },
      { label: "수강가능학점조회" },
      { label: "수강내역조회" },
      { label: "시간표조회", href: "/timetable" },
      { label: "휴보강조회" },
      { label: "K융합전공 이수구분 신청" },
      { label: "수강철회신청" },
      { label: "중간강의평가" },
      { label: "강의평가(기말고사)" },
      { label: "계절학기수요조사" },
    ],
  },
  {
    title: "성적",
    defaultOpen: false,
    items: [
      { label: "당해학기 성적조회" },
      { label: "성적이의신청" },
      { label: "성적조회", href: "/grades" },
      { label: "K-MOOC강좌학점신청" },
      { label: "학점인정신청" },
    ],
  },
  {
    title: "장학",
    defaultOpen: false,
    items: [
      { label: "장학신청" },
      { label: "교내근로장학신청" },
      { label: "교내근로일지작성" },
    ],
  },
  {
    title: "등록",
    defaultOpen: false,
    items: [
      { label: "등록내역조회" },
      { label: "등록금고지서출력" },
      { label: "분납신청" },
    ],
  },
  {
    title: "교직",
    defaultOpen: false,
    items: [
      { label: "교원자격신청" },
      { label: "교육봉사활동내역입력" },
      { label: "응급처치및심폐소생술신청" },
    ],
  },
  {
    title: "졸업",
    defaultOpen: false,
    items: [
      { label: "졸업자가진단" },
      { label: "조기졸업신청" },
      { label: "학위취득유예신청" },
      { label: "글로컬인증신청" },
      { label: "창의인증신청" },
    ],
  },
  {
    title: "인증",
    defaultOpen: false,
    items: [
      { label: "설문응답" },
    ],
  },
  {
    title: "학생지원",
    defaultOpen: false,
    items: [
      { label: "상담신청" },
      { label: "동아리신설신청" },
      { label: "동아리가입신청" },
      { label: "동아리회원관리(동아리회장)" },
      { label: "동아리활동계획서입력(동아리회장)" },
      { label: "동아리활동결과서입력(동아리회장)" },
      { label: "카드학생증신청 및 개인정보 동의" },
    ],
  },
  {
    title: "생활관",
    defaultOpen: false,
    items: [
      { label: "외박신청" },
      { label: "고장신고" },
      { label: "상벌조회" },
    ],
  },
  {
    title: "비밀번호 변경",
    defaultOpen: false,
    items: [
      { label: "사용자 비밀번호 변경" },
    ]
  },
  {
    title: "제증명",
    defaultOpen: false,
    items: [
      { label : "제증명발급"},
    ]
  },
  {
    title : "소통관리",
    defaultOpen : false,
    items: [
      {label : "시스템문의"},
    ]
  }
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const loginId = (getSession()?.studentId ?? "20230001");

  const [menuQuery, setMenuQuery] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);


  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const g of GROUPS) initial[g.title] = !!g.defaultOpen;
    return initial;
  });

  const activeHref = useMemo(() => pathname || "", [pathname]);
  const groupsToRender = useMemo(() => {
    const q = menuQuery.trim().toLowerCase();
    if (!q) return GROUPS;
  
    return GROUPS
      .map((g) => ({
        ...g,
        items: g.items.filter((it) => it.label.toLowerCase().includes(q)),
      }))
      .filter((g) => g.items.length > 0);
  }, [menuQuery]);
  

  const onClickItem = (item: MenuItem) => {
    if (!item.href) return; // Link가 처리
    window.alert("'개인정보관리 / 성적조회 / 시간표조회'만 이동할 수 있습니다.");
  };

  const onLogout = () => {
    logout();
    router.replace("/auth/login");
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex">
      {/* ✅ 왼쪽: Sidebar */}
      <aside className="hidden lg:block w-[280px] shrink-0 border-r border-neutral-200 bg-white">
        {/* ✅ 사이드바 전체 높이 */}
        <div className="h-[calc(100vh-56px)] flex flex-col">
          {/* ✅ (A) 상단 고정 영역: 로고/버튼/검색 */}
          <div className="p-3 border-b border-neutral-200 bg-white">
            {/* 로고 */}
            <div className="flex items-center gap-2 mb-2">
              <img src="/images/knutbe.png" alt="KNUTBE" className="h-7 w-auto" />
            </div>

            {/* 버튼 2개 */}
            <div className="flex gap-2 mb-2">
              <button
                className="flex-1 rounded border border-neutral-300 bg-white px-3 py-2 text-sm hover:bg-neutral-50"
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
              >
                MENU
              </button>
              <button
                className="flex-1 rounded border border-neutral-300 bg-white px-3 py-2 text-sm hover:bg-neutral-50"
                type="button"
                onClick={() => window.alert("즐겨찾기 기능은 데모에서 제공하지 않습니다.")}
              >
                ★ 즐겨찾기
              </button>
            </div>

            {/* 학부생 라벨 */}
            <div className="text-center text-sm font-semibold text-neutral-800 py-2 border border-neutral-200 rounded">
              학부생
            </div>

            {/* 검색 */}
            <div className="relative mt-2">
              <input
                value={menuQuery}
                onChange={(e) => setMenuQuery(e.target.value)}
                placeholder="메뉴명을 입력하세요."
                className="w-full rounded border border-neutral-300 bg-white px-3 py-2 pr-10 text-sm text-neutral-900 placeholder:text-neutral-400"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">🔍</span>
            </div>
          </div>

          {/* ✅ (B) 메뉴 영역: 여기만 스크롤 */}
          <div className="flex-1 overflow-y-auto p-3 bg-white">
            <nav className="space-y-2">
              {groupsToRender.map((g) => {
                const isOpen = menuQuery ? true : open[g.title];
                return (
                  <div key={g.title} className="rounded border border-neutral-200 bg-white">
                    {/* 그룹 헤더 */}
                    <button
                      type="button"
                      onClick={() => setOpen((p) => ({ ...p, [g.title]: !p[g.title] }))}
                      className="w-full flex items-center justify-between px-2 py-2 hover:bg-neutral-50"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`transition-transform ${isOpen ? "rotate-90" : ""}`}>▶</span>
                        <span className="font-semibold text-neutral-900">{g.title}</span>
                      </div>
                    </button>

                    {/* 그룹 아이템 */}
                    {isOpen && (
                      <div className="px-2 pb-2">
                        <div className="space-y-1">
                          {g.items.map((item) => {
                            const isActive = item.href && activeHref === item.href;
                            const base = "w-full text-left px-3 py-2 rounded text-sm";
                            const active = "bg-[#7d1316] text-white";
                            const idle = "hover:bg-neutral-50 text-neutral-800";

                            if (item.href) {
                              return (
                                <Link
                                  key={item.label}
                                  href={item.href}
                                  className={`${base} ${isActive ? active : idle} block`}
                                >
                                  {item.label}
                                </Link>
                              );
                            }

                            return (
                              <button
                                key={item.label}
                                type="button"
                                onClick={() => onClickItem(item)}
                                className={`${base} ${idle} opacity-80`}
                              >
                                {item.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>

  
      {/* ✅ 오른쪽: Header + Main */}
      <div className="min-w-0 flex-1 flex flex-col">
        <header className="h-14 border-b border-neutral-200 bg-white flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="logo"
              className="h-7 w-7 rounded"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="font-bold">통합정보시스템</div>
          </div>
  
          <div className="flex items-center gap-3 text-sm">
            <div className="text-neutral-600">엄승배 [사회기반공학전공] 님</div>
            <button
              className="px-3 py-1 rounded border border-neutral-300 bg-white hover:bg-neutral-50"
              onClick={() => window.alert("로그인 연장이 불가능합니다.")}
              type="button"
            >
              로그인 연장
            </button>
            <button
              className="px-3 py-1 rounded bg-[#7d1316] hover:opacity-90 text-white"
              onClick={onLogout}
              type="button"
            >
              로그아웃
            </button>
          </div>
        </header>
  
        <main className="min-w-0 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}  