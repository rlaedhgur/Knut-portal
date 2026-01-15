

"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import DataTable, { Column } from "@/components/DataTable";
import {
  MOCK_STUDENT,
  MOCK_GRADE_DETAILS,
  MOCK_GRADE_SUMMARIES,
  GradeTermSummary,
  GradeCourseDetail,
} from "@/data/mock";

import { createTranscriptPdfBlob } from "@/components/TranscriptPdf";

function termKey(y: number, t: string) {
  return `${y}-${t.startsWith("1") ? "1" : "2"}`;
}

const UI = {
  cardSub: "px-4 py-2 text-xs text-neutral-600 border-t border-neutral-300",
  btnPortal: "h-8 px-3 rounded border border-neutral-400 bg-white hover:bg-neutral-100 text-sm",
  card: "border border-neutral-300 rounded bg-white overflow-hidden",
  cardHeader: "px-4 py-2 bg-[#7d1316] text-white flex items-center justify-between",
  crumbRow: "px-4 py-2 bg-white flex items-center justify-between",
  crumbText: "text-xs text-neutral-600",
  infoRow: "px-4 py-3 bg-[#fff2f2] flex flex-wrap items-center gap-3",
  labelMd: "text-sm text-neutral-700",
  inputCompact:
    "w-40 border border-neutral-300 rounded px-2 py-1.5 bg-white text-neutral-900 text-sm",
  btn: "h-8 px-3 rounded border border-neutral-400 bg-white hover:bg-neutral-50 text-sm",
  sectionTitleWrap: "flex items-center gap-2 text-sm font-semibold text-neutral-900",
  sectionDot: "inline-block h-2 w-2 rounded-full bg-[#7d1316]",
};

export default function GradesPage() {
  const s = MOCK_STUDENT;
  const summaries = MOCK_GRADE_SUMMARIES;

  const [selectedKey, setSelectedKey] = useState<string>(() => {
    const first = summaries[0];
    return first ? termKey(first.year, first.term) : "2025-2";
  });

  const selectedSummary =
    summaries.find((x) => termKey(x.year, x.term) === selectedKey) ?? summaries[0];

  const details: GradeCourseDetail[] = MOCK_GRADE_DETAILS[selectedKey] ?? [];

  const totals = useMemo(() => {
    const major = summaries.reduce((a, b) => a + b.majorCredits, 0);
    const liberal = summaries.reduce((a, b) => a + b.liberalCredits, 0);
    const earned = summaries.reduce((a, b) => a + b.earnedCredits, 0);
    return { major, liberal, earned };
  }, [summaries]);

  /** ✅ PDF 모달 상태/핸들러 (컴포넌트 안!) */
  const [pdfOpen, setPdfOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // 언마운트/닫힘 때 blob url 정리
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const closePdf = () => {
    setPdfOpen(false);
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setPdfUrl(null);
  };

  const openPdf = async () => {
    try {
      setPdfLoading(true);

      // ✅ “전체 성적표”로 만들려면 detailsMap 전체를 넘기는 게 포털 느낌에 맞습니다.
      const blob = await createTranscriptPdfBlob({
        student: s,
        summaries,
        detailsMap: MOCK_GRADE_DETAILS,
      });

      const url = URL.createObjectURL(blob);
      // 기존 URL 있으면 정리
      setPdfUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });

      setPdfOpen(true);
    } finally {
      setPdfLoading(false);
    }
  };

  const downloadPdf = () => {
    if (!pdfUrl) return;
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = `한국교통대학교 통합정보시스템.pdf`;
    a.click();
  };

  const printPdf = () => {
    iframeRef.current?.contentWindow?.focus();
    iframeRef.current?.contentWindow?.print();
  };

  const onHelp = () => alert("학기별 성적 행을 클릭하면 하단 상세가 바뀝니다.");
  const onRefresh = () => {
    const first = summaries[0];
    if (first) setSelectedKey(termKey(first.year, first.term));
  };

  const summaryCols: Column<GradeTermSummary>[] = [
    { key: "year", header: "년도", render: (r) => r.year, className: "whitespace-nowrap" },
    { key: "term", header: "학기", render: (r) => r.term.replace("학기", ""), className: "whitespace-nowrap" },
    { key: "termType", header: "학기구분", render: (r) => r.termType, className: "whitespace-nowrap" },
    { key: "yearLevel", header: "수강학년", render: (r) => r.yearLevel },
    { key: "applied", header: "신청학점", render: (r) => r.appliedCredits },
    { key: "major", header: "전공학점", render: (r) => r.majorCredits },
    { key: "lib", header: "교양학점", render: (r) => r.liberalCredits },
    { key: "teach", header: "교직학점", render: (r) => r.teachingCredits },
    { key: "other", header: "기타학점", render: (r) => r.otherCredits },
    { key: "minor", header: "부전공학점", render: (r) => r.minorCredits },
    { key: "double", header: "복수전공학점", render: (r) => r.doubleMajorCredits },
    { key: "earned", header: "총 취득학점", render: (r) => r.earnedCredits },
    { key: "gpaTotal", header: "평점총계", render: (r) => r.gpaTotal.toFixed(1) },
    { key: "gpaAvg", header: "평점평균", render: (r) => r.gpaAvg.toFixed(2) },
    { key: "percentile", header: "백분위점수", render: (r) => r.percentile },
    {
      key: "warning",
      header: "학사경고 여부",
      render: (r) => <input type="checkbox" checked={r.warning} readOnly className="accent-rose-700" />,
    },
  ];

  const detailCols: Column<GradeCourseDetail>[] = [
    { key: "courseName", header: "교과목명", render: (r) => r.courseName, className: "min-w-[260px] text-left" },
    { key: "category", header: "이수구분", render: (r) => r.category, className: "whitespace-nowrap" },
    { key: "credits", header: "학점", render: (r) => r.credits, className: "whitespace-nowrap" },
    { key: "grade", header: "등급", render: (r) => r.grade, className: "whitespace-nowrap" },
    { key: "point", header: "평점", render: (r) => (r.point == null ? "-" : r.point), className: "whitespace-nowrap" },
    {
      key: "retake",
      header: "재수강 여부",
      render: (r) => <input type="checkbox" checked={r.retake} readOnly className="accent-rose-700" />,
      className: "whitespace-nowrap",
    },
    { key: "recogType", header: "성적인정 구분", render: (r) => r.recognitionType, className: "whitespace-nowrap" },
    {
      key: "recognized",
      header: "성적인정 여부",
      render: (r) => <input type="checkbox" checked={r.recognized} readOnly className="accent-rose-700" />,
      className: "whitespace-nowrap",
    },
  ];

  return (
    <div className="space-y-4">
      {/* 상단(헤더/경로/버튼/학번성명) */}
      <div className={`${UI.card} overflow-hidden`}>
        <div className={UI.cardHeader}>
          <div className="font-semibold">학생서비스</div>
        </div>

        {/* 경로(breadcrumb) */}
        <div className={UI.cardSub}>
          학생서비스 &gt; 학부생 &gt; 성적 &gt; 성적조회
        </div>
      </div>
        {/* ✅ 경로와 학번/성명 사이의 버튼 줄(분리) */}
      <div className="px-4 py-2 bg-white flex items-center justify-end gap-2">
        <button className={UI.btn} onClick={openPdf} disabled={pdfLoading}>
          {pdfLoading ? "생성중..." : "성적표"}
        </button>
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
          <div className="flex items-center gap-1">
            <div className={UI.infoRow}>학번/성명</div>
            <input readOnly value={s.studentId} className={UI.inputCompact} />
            <input readOnly value={s.name} className={UI.inputCompact} />
          </div>
        </div>
      </div>

      {/* 학기별 성적 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className={UI.sectionTitleWrap}>
            <span className={UI.sectionDot} />
            학기별 성적
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <button className="h-7 px-2 rounded border border-neutral-300 bg-white hover:bg-neutral-50">엑셀</button>
            <span>총 {summaries.length} 건</span>
          </div>
        </div>

        <DataTable
          theme="portal"
          columns={summaryCols}
          rows={summaries}
          rowKey={(r) => termKey(r.year, r.term)}
          selectedKey={selectedKey}
          onRowClick={(r) => setSelectedKey(termKey(r.year, r.term))}
          minWidth={1400}
        />

        <div className="border border-neutral-300 rounded bg-white px-4 py-3 text-sm">
          <span className="font-semibold mr-6">총계</span>
          <span className="mr-6">전공학점 <b>{totals.major}</b></span>
          <span className="mr-6">교양학점 <b>{totals.liberal}</b></span>
          <span>총취득학점 <b>{totals.earned}</b></span>
        </div>
      </div>

      {/* 학기별 성적 상세 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className={UI.sectionTitleWrap}>
            <span className={UI.sectionDot} />
            학기별 성적 상세
            <span className="text-neutral-500 ml-2">
              ({selectedSummary ? `${selectedSummary.year} ${selectedSummary.term}` : ""})
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <button className="h-7 px-2 rounded border border-neutral-300 bg-white hover:bg-neutral-50">엑셀</button>
            <span>총 {details.length} 건</span>
          </div>
        </div>

        <DataTable
          theme="portal"
          columns={detailCols}
          rows={details}
          rowKey={(r) => `${r.courseName}-${r.credits}-${r.grade}`}
          minWidth={1100}
        />
      </div>

      {/* ✅ PDF 모달 */}
      {pdfOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6">
          <div className="w-full max-w-5xl h-[85vh] bg-white rounded shadow overflow-hidden flex flex-col">
            {/* 상단바 */}
            <div className="h-12 px-4 bg-neutral-700 text-white flex items-center justify-between">
              <div className="font-semibold">성적표(학생)</div>
              <button onClick={closePdf} className="text-2xl leading-none">×</button>
            </div>

            {/* 툴바(아이콘) */}
            <div className="h-12 px-3 border-b border-neutral-200 flex items-center gap-2">
              <button 
                onClick={printPdf}
                type="button"
                title="인쇄"
                className="h-9 w-9 flex items-center justify-center rounded border border-neutral-300 hover:bg-neutral-50">
                <img src="/images/icons/insell.png" alt="인쇄" className="h-5 w-5" />
              </button>
              <button 
                onClick={downloadPdf}
                type="button"
                title="pdf 다운로드"
                className="h-9 px-3 rounded border border-neutral-300 hover:bg-neutral-50">
                <img src="/images/icons/pdf.png" alt="pdf 다운로드" className="h-5 w-5"/>
              </button>
              <div className="ml-auto text-sm text-neutral-600">
                {pdfLoading ? "PDF 생성 중..." : ""}
              </div>
            </div>

            {/* 내용 */}
            <div className="flex-1 bg-neutral-100">
              {pdfUrl && (
                // ✅ 기본 PDF 뷰어 툴바를 숨기고(0), 위의 버튼만 쓰고 싶으면 toolbar=0
                <iframe
                  ref={iframeRef}
                  src={`${pdfUrl}#toolbar=0&navpanes=0`}
                  className="w-full h-full"
                  title="transcript"
                />
              )}
            </div>

            {/* 하단 */}
            <div className="h-14 border-t border-neutral-200 flex items-center justify-center">
              <button onClick={closePdf} className="h-9 px-8 rounded border border-neutral-300 bg-neutral-50 hover:bg-neutral-100">
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

