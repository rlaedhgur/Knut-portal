
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import TimetableGrid from "@/components/TimetableGrid";
import { MOCK_GRADE_SUMMARIES, MOCK_STUDENT, MOCK_TIMETABLE_BY_TERM } from "@/data/mock";

function termKey(y: number, t: string) {
  return `${y}-${t.startsWith("1") ? "1" : "2"}`;
}

const UI = {
  card: "border border-neutral-300 rounded bg-white",
  cardHeader: "px-4 py-2 bg-[#7d1316] text-white flex items-center justify-between",
  cardSub: "px-4 py-2 text-xs text-neutral-600 border-t border-neutral-300",
  cardBodyRow: "px-4 py-3 border-t border-neutral-300 flex flex-wrap items-center gap-3",

  labelSm: "text-xs text-neutral-600 mb-1",
  labelMd: "text-sm text-neutral-700",

  //input: "w-full border border-neutral-300 rounded px-3 py-2 bg-neutral-100 text-neutral-900 text-sm",
  //inputCompact: "w-40 border border-neutral-300 rounded px-3 py-2 bg-neutral-100 text-neutral-900 text-sm",
  input: "w-full border border-neutral-300 rounded px-2 py-1.5 bg-neutral-100 text-neutral-900 text-xs",
  inputCompact: "w-40 border border-neutral-300 rounded px-2 py-1.5 bg-neutral-100 text-neutral-900 text-xs",

  sectionBtn: "w-full px-4 py-3 flex items-center justify-between hover:bg-neutral-50",
  tabActive: "bg-[#7d1316] border-[#7d1316] text-white",
  tabIdle: "bg-white border-neutral-300 text-neutral-800 hover:bg-neutral-50",

  btnGray: "px-3 py-1 rounded border border-neutral-300 bg-white hover:bg-neutral-50 text-sm",
};
const s = MOCK_STUDENT;
/** ✅ 학기별 1주차 시작일(사용자 제공 기준) */
const TERM_WEEK1_START: Record<string, string> = {
  "2022-1": "2022-03-02",
  "2022-2": "2022-08-29",
  "2025-1": "2025-03-04",
  "2025-2": "2025-09-01",
};

function toLocalDate(ymd: string) {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d, 0, 0, 0);
}
function addDays(base: Date, days: number) {
  const x = new Date(base);
  x.setDate(x.getDate() + days);
  return x;
}
function fmtDot(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${dd}`;
}

type WeekOption = { value: string; label: string };

function makeWeekOptions(termKeyStr: string): WeekOption[] {
  const startStr = TERM_WEEK1_START[termKeyStr];
  // 시작일이 없으면 주차만
  if (!startStr) {
    return Array.from({ length: 16 }, (_, i) => {
      const v = `${i + 1}주차`;
      return { value: v, label: v };
    });
  }

  const w1 = toLocalDate(startStr);
  return Array.from({ length: 16 }, (_, i) => {
    const s = addDays(w1, i * 7);
    const e = addDays(s, 6);
    const v = `${i + 1}주차`;
    return { value: v, label: `${v} (${fmtDot(s)}~${fmtDot(e)})` };
  });
}

/** ✅ 수업주: 10개씩 보이고 스크롤되는 드롭다운(커스텀) */
function WeekDropdown({
  value,
  options,
  onChange,
}: {
  value: string;
  options: WeekOption[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const selectedLabel = useMemo(() => {
    return options.find((o) => o.value === value)?.label ?? value;
  }, [options, value]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-9 px-3 rounded border border-neutral-400 bg-white text-sm flex items-center gap-2 min-w-[260px]"
        title={selectedLabel}
      >
        <span className="truncate">{selectedLabel}</span>
        <span className="ml-auto text-neutral-500">▾</span>
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full rounded border border-neutral-400 bg-white shadow">
          {/* ✅ 여기서 10개 높이만 보이고 스크롤 */}
          <div className="max-h-[320px] overflow-y-auto">
            {options.map((opt) => {
              const active = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={[
                    "w-full text-left px-3 py-2 text-sm",
                    "hover:bg-neutral-100",
                    active ? "bg-neutral-100 font-semibold" : "",
                  ].join(" ")}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TimetablePage() {
  const summaries = MOCK_GRADE_SUMMARIES;

  const years = useMemo(
    () => Array.from(new Set(summaries.map((s) => s.year))).sort((a, b) => b - a),
    [summaries]
  );

  const [year, setYear] = useState<number>(years[0] ?? 2025);
  const [term, setTerm] = useState<"1학기" | "2학기">("2학기");
  const [week, setWeek] = useState<string>("1주차");

  const key = termKey(year, term);
  const entries = MOCK_TIMETABLE_BY_TERM[key] ?? [];

  const weekOptions = useMemo(() => makeWeekOptions(key), [key]);

  // ✅ 학기 바뀌면 주차는 1주차로(혹은 유효성 보장)
  useEffect(() => {
    if (!weekOptions.some((o) => o.value === week)) {
      setWeek("1주차");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const courseCount = useMemo(() => {
    return new Set(entries.map((e) => `${e.title}-${e.day}-${e.start}-${e.end}`)).size;
  }, [entries]);

  return (
    <div className="space-y-3">
      {/* 상단(실제 사이트 느낌의 헤더/경로/검색줄) */}
      <div className={`${UI.card} overflow-hidden`}>
        <div className={UI.cardHeader}>
          <div className="font-semibold">학생서비스</div>
        </div>

        <div className={UI.cardSub}>
          학생서비스 &gt; 학부생 &gt; 수강 &gt; 시간표조회
        </div>
      </div>
      {/* ✅ 버튼 전용 줄 (테두리 없음, 오른쪽 정렬) */}
      <div className="px-4 py-2 bg-white flex items-center justify-end gap-2">
        <button
          onClick={() => alert("시간표 출력은 제공하지 않습니다.")}
          className="h-9 px-4 rounded border border-neutral-500 bg-white hover:bg-neutral-100 text-sm"
        >
          시간표출력
        </button>

        <button
          onClick={() => alert(`조회 완료: ${year} ${term} / ${week}`)}
          className="h-9 px-4 rounded border border-neutral-500 bg-white hover:bg-neutral-100 text-sm"
        >
          조회
        </button>

        <button
          onClick={() => alert("도움말: 학기/년도 선택 후 조회하면 시간표가 표시됩니다.")}
          className="h-9 px-4 rounded border border-neutral-500 bg-white hover:bg-neutral-100 text-sm"
        >
          도움말
        </button>
      </div>
      {/* ✅ 포털형 조회바 (스타일 유지) */}
      <div className="border border-neutral-300 rounded-lg bg-[#fff2f2] p-3">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex items-center gap-2">
            <div className="text-sm text-neutral-700 w-[44px]">년도</div>
            <select
              className="h-9 px-3 rounded border border-neutral-400 bg-white text-sm"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm text-neutral-700 w-[44px]">학기</div>
            <select
              className="h-9 px-3 rounded border border-neutral-400 bg-white text-sm"
              value={term}
              onChange={(e) => setTerm(e.target.value as any)}
            >
              <option value="1학기">1학기</option>
              <option value="2학기">2학기</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm text-neutral-700 w-[70px]">학번/성명</div>
            <div className="flex items-center">
              <input
                readOnly
                value={MOCK_STUDENT.studentId}
                className="h-9 w-[110px] px-3 rounded-l border border-neutral-400 bg-white text-sm"
              />
              <button
                type="button"
                className="h-9 w-10 border-t border-b border-neutral-400 bg-neutral-100 hover:bg-neutral-200"
                title="검색"
              >
                🔍
              </button>
              <input
                readOnly
                value={MOCK_STUDENT.name}
                className="h-9 w-[120px] px-3 rounded-r border border-neutral-400 bg-white text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm text-neutral-700 w-[56px]">수업주</div>

            {/* ✅ 기존 select 대신: 10개씩 보이는 스크롤 드롭다운 */}
            <WeekDropdown value={week} options={weekOptions} onChange={setWeek} />
          </div>

          <div className="flex-1" />
        </div>
      </div>

      {/* ✅ 리스트 헤더(포털 느낌) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
          <span className="inline-block h-2 w-2 rounded-full bg-[#7d1316]" />
          시간표 리스트
        </div>
        <div className="text-sm text-neutral-600">총 {courseCount} 건</div>
      </div>

      <TimetableGrid entries={entries} />

      {entries.length === 0 && (
        <div className="text-sm text-neutral-500">
          이 학기({year} {term})에 등록된 시간표 데이터가 없습니다. (mock.ts에 추가하면 표시됩니다.)
        </div>
      )}
    </div>
  );
}
