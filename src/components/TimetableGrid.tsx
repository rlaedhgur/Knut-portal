
// src/components/TimetableGrid.tsx
"use client";

import React, { useMemo } from "react";
import { TimetableEntry } from "@/data/mock";

const DAYS: TimetableEntry["day"][] = ["월", "화", "수", "목", "금", "토"];

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}
function pad(n: number) {
  return String(n).padStart(2, "0");
}
function minutesToHHMM(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${pad(h)}:${pad(m)}`;
}

/**
 * 08:00 시작 기준
 * 0A(08:00) 0B(08:30) 1A(09:00) ...
 * 9B 다음은 야1A
 */
function periodLabel(slotIndex: number) {
  const periodNum = Math.floor(slotIndex / 2);
  const half = slotIndex % 2 === 0 ? "A" : "B";
  if (periodNum <= 9) return `${periodNum}${half}`;
  return `야${periodNum - 9}${half}`;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function colorClass(c?: any) {
  // ✅ 포털 느낌의 “쨍한” 색감
  switch (c) {
    case "yellow":
      return "bg-[#FFF200] text-black";
    case "emerald":
      return "bg-[#00E5C3] text-black";
    case "lime":
      return "bg-[#B6FF00] text-black";
    case "orange":
      return "bg-[#FF6A00] text-black";
    case "pink":
      return "bg-[#FFD0D0] text-black";
    case "sky":
      return "bg-[#00A8FF] text-black";
    case "violet":
      return "bg-[#7A2CFF] text-white";
    case "red":
      return "bg-[#E60012] text-white";
    case "blue":
      return "bg-[#1E5BFF] text-white";
    case "green":
      return "bg-[#00A86B] text-white";
    case "brown":
      return "bg-[#7A5A2B] text-white";
    default:
      return "";
  }
}

// ✅ 슬롯별 표시: 과목명 → 교수 → 강의실 → 과목명 → ...
function slotText(e: TimetableEntry, offset: number) {
  const mod = offset % 3;
  if (mod === 0) return e.title;
  if (mod === 1) return (e.professor ?? "").trim();
  return (e.room ?? "").trim();
}

type Cell = { text: string; color?: any };

export default function TimetableGrid({
  entries,
  start = "08:00",
  end = "18:30",
  stepMinutes = 30,
}: {
  entries: TimetableEntry[];
  start?: string;
  end?: string;
  stepMinutes?: number;
}) {
  const startMin = toMinutes(start);
  const endMin = toMinutes(end);
  const slotCount = Math.floor((endMin - startMin) / stepMinutes);

  const slots = useMemo(() => {
    return Array.from({ length: slotCount }, (_, i) => {
      const t = startMin + i * stepMinutes;
      return { idx: i, time: minutesToHHMM(t), period: periodLabel(i) };
    });
  }, [slotCount, startMin, stepMinutes]);

  // ✅ day+slot 단위로 셀 채우기 (rowSpan 없음)
  const cellMap = useMemo(() => {
    const map: Record<string, Record<number, Cell>> = {};
    for (const d of DAYS) map[d] = {};

    for (const e of entries) {
      const day = e.day;
      const sMin = toMinutes(e.start);
      const eMin = toMinutes(e.end);

      const s = clamp(Math.floor((sMin - startMin) / stepMinutes), 0, slotCount - 1);
      const t = clamp(Math.ceil((eMin - startMin) / stepMinutes), 0, slotCount);

      for (let idx = s; idx < t; idx++) {
        map[day][idx] = {
          text: slotText(e, idx - s),
          color: e.color,
        };
      }
    }
    return map;
  }, [entries, startMin, stepMinutes, slotCount]);

  return (
    <div className="border border-neutral-300 rounded-lg bg-white overflow-auto">
      <div className="min-w-[1100px]">
        {/* ✅ 요일 폭 고정하려면 table-fixed + colgroup이 안정적 */}
        <table className="w-full table-fixed border-separate border-spacing-0 text-sm">
          <colgroup>
            {/* 시간은 조금 더 넓게, 교시는 조금 더 좁게 */}
            <col style={{ width: 110 }} />
            <col style={{ width: 70 }} />
            {/* 월~토 동일 폭 */}
            {DAYS.map((d) => (
              <col key={d} style={{ width: 155 }} />
            ))}
          </colgroup>

          <thead className="sticky top-0 z-10">
            <tr>
              <th className="bg-neutral-100 border-b border-neutral-300 border-r border-neutral-300 px-3 py-2 text-left font-semibold text-neutral-800">
                시간
              </th>
              <th className="bg-neutral-100 border-b border-neutral-300 border-r border-neutral-300 px-3 py-2 text-center font-semibold text-neutral-800">
                교시
              </th>
              {DAYS.map((d) => (
                <th
                  key={d}
                  className="bg-neutral-100 border-b border-neutral-300 border-r border-neutral-300 px-3 py-2 text-center font-semibold text-neutral-800"
                >
                  {d}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {slots.map(({ idx, time, period }) => {
              const zebra = idx % 2 === 0 ? "bg-white" : "bg-neutral-50";
              return (
                <tr key={idx} className="hover:bg-neutral-100/60">
                  <td className={`border-b border-neutral-200 border-r border-neutral-200 px-3 py-2 text-neutral-700 ${zebra}`}>
                    {time}
                  </td>
                  <td className={`border-b border-neutral-200 border-r border-neutral-200 px-3 py-2 text-center font-medium text-neutral-800 ${zebra}`}>
                    {period}
                  </td>

                  {DAYS.map((day) => {
                    const cell = cellMap[day]?.[idx];
                    const filled = Boolean(cell);
                    const bg = filled ? colorClass(cell?.color) : zebra;

                    return (
                      <td
                        key={`${day}-${idx}`}
                        className={[
                          "border-b border-neutral-200 border-r border-neutral-200 px-3 py-2",
                          "text-[12px] leading-tight", // ✅ 전부 동일 글자 크기
                          filled
                            ? `shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)] ${bg}`
                            : bg,
                        ].join(" ")}
                      >
                        {cell?.text ? (
                          <span className="whitespace-nowrap">{cell.text}</span>
                        ) : (
                          <span className="opacity-0">.</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
