"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  MOCK_STUDENT,
  MOCK_ACADEMIC_BASIC_FIELDS,
  MOCK_ACADEMIC_SCHOOL_FIELDS,
  type FormField,
} from "@/data/mock";
import { safeGetJSON, safeSetJSON } from "@/lib/storage";

const TABS = ["학적", "신상", "변동", "등록", "장학", "수강", "성적", "다전공/교직", "자격시험/논문"];
// ✅ 공통 스타일(라이트 테마 고정)
const UI = {
  btnPortal:
    "h-8 px-3 rounded border border-neutral-400 bg-white hover:bg-neutral-100 text-sm",
  toolbarRow:
    "px-4 py-2 border-t border-neutral-300 bg-white flex items-center justify-end gap-2",
  card: "border border-neutral-300 rounded bg-white",
  cardHeader: "px-4 py-2 bg-[#7d1316] text-white flex items-center justify-between",
  cardSub: "px-4 py-2 text-xs text-neutral-600 border-t border-neutral-300",
  // cardBodyRow: "px-4 py-3 border-t border-neutral-300 flex flex-wrap items-center gap-3",
  // ✅ 학번/성명 줄은 옅은 핑크 느낌
  cardBodyRow: "px-4 py-2 border-t border-neutral-300 bg-[#fff2f2] flex flex-wrap items-center gap-3",
  labelSm: "text-xs text-neutral-600 mb-1",
  labelMd: "text-sm text-neutral-700",
  infoRow: "px-4 py-3 bg-[#fff2f2] flex flex-wrap items-center gap-3",

  //input: "w-full border border-neutral-300 rounded px-3 py-2 bg-neutral-100 text-neutral-900 text-sm",
  //inputCompact: "w-40 border border-neutral-300 rounded px-3 py-2 bg-neutral-100 text-neutral-900 text-sm",
  input: "w-full border border-neutral-300 rounded px-2 py-1.5 bg-neutral-100 text-neutral-900 text-xs",
  inputCompact: "w-40 border border-neutral-300 rounded px-2 py-1.5 bg-neutral-100 text-neutral-900 text-xs",

  sectionBtn: "w-full px-4 py-3 flex items-center justify-between hover:bg-neutral-50",
  tabActive: "bg-[#7d1316] border-[#7d1316] text-white",
  tabIdle: "bg-white border-neutral-300 text-neutral-800 hover:bg-neutral-50",

  btnGray: "px-3 py-1 rounded border border-neutral-300 bg-white hover:bg-neutral-50 text-sm",
};

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[90px_1fr] items-center gap-2">
      <div className="text-xs text-neutral-700">{label}</div>
      {children}
    </div>
  );
}


function Section({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={UI.card}>
      <button
        type="button"
        onClick={onToggle}
        className={UI.sectionBtn}
      >
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-rose-700" />
          <div className="font-semibold">{title}</div>
        </div>
        <span className={`transition-transform ${open ? "rotate-90" : ""}`}>▶</span>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

function FieldGrid({ fields }: { fields: FormField[] }) {
  return (
    <div className="grid grid-cols-12 gap-2">
      {fields.map((f) => (
        <div key={f.label} className="col-span-12 lg:col-span-6 xl:col-span-4">
          <FieldRow label={f.label}>
            {"type" in f && f.type === "checkbox" ? (
              <label className="flex items-center gap-2 border border-neutral-300 rounded px-2 py-1.5 bg-neutral-100">
                <input type="checkbox" checked={f.checked} readOnly />
                <span className="text-xs text-neutral-900">해당</span>
              </label>
            ) : "type" in f && f.type === "select" ? (
              <select disabled value={f.value} className={UI.input}>
                {f.options.map((opt) => (
                  <option key={opt} value={opt}>{opt || "(없음)"}</option>
                ))}
              </select>
            ) : (
              <input readOnly value={(f as any).value ?? ""} className={UI.input} />
            )}
          </FieldRow>
        </div>
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const s = MOCK_STUDENT;

  const [activeTab, setActiveTab] = useState<string>("학적");
  const [openBasic, setOpenBasic] = useState(false);
  const [openSchool, setOpenSchool] = useState(false);

  const [contact, setContact] = useState(() => {
    return (
      safeGetJSON<{ phone: string; email: string }>("demo_contact", { phone: "", email: "" }) || {
        phone: s.phone,
        email: s.email,
      }
    );
  });
  

  const onTabClick = (tab: string) => {
    if (tab !== "학적") {
      window.alert("제공해드리는 기간이 아닙니다.");
      return;
    }
    setActiveTab(tab);
  };

  const studentTopRows = useMemo(
    () => [
      { label: "학번", value: s.studentId },
      { label: "성명", value: s.name },
      { label: "국적", value: s.nationality },
      { label: "생일/성별", value: `${s.birthDate} / ${s.gender}` },
      { label: "대학(원)", value: s.college },
      { label: "학과/반", value: s.department },
      { label: "학년/주야", value: `${s.gradeYear} / ${s.dayNight}` },
      { label: "과정", value: s.program },
      { label: "과정년도", value: s.entryYear},
      { label: "이수학기", value: s.completedTerms },
      { label: "학적상태", value: s.status },
      { label: "변동세부사유", value: s.changeReason },
      { label: "변동일자", value: s.changeDate },
      { label: "지도교수", value: s.advisor },
      { label: "휴대전화", value: contact.phone },
      { label: "이메일", value: contact.email },
      { label: "기타", value: "" },
    ],
    [contact, s]
  );

  const onSaveContact = () => {
    safeSetJSON("demo_contact", contact);
    window.alert("저장되었습니다.");
  };
  

  return (
    <div className="space-y-4">
      {/* 상단(헤더/경로/버튼/학번성명) */}
      <div className={`${UI.card} overflow-hidden`}>
        <div className={UI.cardHeader}>
          <div className="font-semibold">학생서비스</div>
        </div>

        {/* 경로(breadcrumb) */}
        <div className={UI.cardSub}>
          학생서비스 &gt; 학부생 &gt; 학적 &gt; 개인정보관리
        </div>
      </div>
        {/* ✅ 경로와 학번/성명 사이의 버튼 줄(분리) */}
      <div className="px-4 py-2 bg-white flex items-center justify-end gap-2">
        <button className={UI.btnPortal}>
          조회
        </button>
        <button className={UI.btnPortal}>
          도움말
        </button>
      </div>

        {/* 학번/성명 */}
      <div className="border border-neutral-300 rounded-lg bg-[#fff2f2] p-3">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex items-center gap-2">
            <div className={UI.infoRow}>학번/성명</div>
            <input readOnly value={s.studentId} className={UI.inputCompact} />
            <input readOnly value={s.name} className={UI.inputCompact} />
          </div>
        </div>
      </div>

      {/* 학생 정보(사진 + 상단 필드들) */}
      <div className={`${UI.card} p-4`}>
        <div className="grid grid-cols-[140px_1fr] gap-4">
          <div>
            <Image
              src="/images/student.jpg"
              alt="student"
              width={140}
              height={180}
              className="rounded-lg border border-neutral-300 object-cover bg-white"
            />
          </div>

          <div className="space-y-3">
            <div className="text-xl font-bold">학생정보</div>
            <div className="grid grid-cols-12 gap-2">
              {studentTopRows.map((r) => (
                <div key={r.label} className="col-span-12 lg:col-span-6 xl:col-span-4">
                  <FieldRow label={r.label}>
                    <input readOnly value={r.value} className={UI.input} />
                  </FieldRow>
                </div>
              ))}
            </div>

            {/* 연락처 수정 */}
            <div className="mt-2 border-t border-neutral-800 pt-4">
              <div className="font-semibold mb-2">연락처 수정</div>
              <div className="grid grid-cols-12 gap-3 items-end">
                <div className="col-span-12 md:col-span-5">
                  <div className={UI.labelSm}>휴대전화</div>
                  <input
                    value={contact.phone}
                    onChange={(e) => setContact((p) => ({ ...p, phone: e.target.value }))}
                    className={UI.input}
                  />
                </div>
                <div className="col-span-12 md:col-span-5">
                  <div className={UI.labelSm}>이메일</div>
                  <input
                    value={contact.email}
                    onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))}
                    className={UI.input}
                  />
                </div>
                <div className="col-span-12 md:col-span-2 flex md:justify-end">
                  <button
                    type="button"
                    onClick={onSaveContact}
                    className="w-full md:w-auto px-4 py-2 rounded bg-[#7d1316] hover:opacity-90 text-white"
                  >
                    저장
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ✅ 탭 바(카드 사이) */}
      <div className={`${UI.card} px-3 py-2`}>
        <div className="flex flex-wrap gap-2">
            {TABS.map((t) => {
              const active = t === activeTab;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => onTabClick(t)}
                  className={[
                    "px-3 py-2 rounded-lg text-sm border",
                    active
                      ? UI.tabActive
                      : UI.tabIdle,
                  ].join(" ")}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      {/* 학적 탭 내용(접기/펼치기) */}
      <Section title="기본정보" open={openBasic} onToggle={() => setOpenBasic((v) => !v)}>
        <FieldGrid fields={MOCK_ACADEMIC_BASIC_FIELDS} />
      </Section>

      <Section title="출신학교정보" open={openSchool} onToggle={() => setOpenSchool((v) => !v)}>
        <FieldGrid fields={MOCK_ACADEMIC_SCHOOL_FIELDS} />
      </Section>
    </div>
  );
}
