

// src/components/TranscriptPdf.tsx
// "use client";

// import React from "react";
// import {
//   Document,
//   Page,
//   Text,
//   View,
//   StyleSheet,
//   Font,
//   pdf,
// } from "@react-pdf/renderer";
// import type { GradeCourseDetail, GradeTermSummary, StudentProfile } from "@/data/mock";



// /** -------------------------
//  * ✅ 폰트 등록 (public/fonts 기준)
//  *  - 파일 필요:
//  *    public/fonts/NotoSansKR-Regular.ttf
//  *    public/fonts/NotoSansKR-Bold.ttf
//  * ------------------------ */
// let fontReady = false;
// function ensureFont() {
//   if (fontReady) return;

//   Font.register({
//     family: "NotoSansKR",
//     fonts: [
//       { src: "/fonts/NotoSansKR-Regular.ttf", fontWeight: 400 },
//       { src: "/fonts/NotoSansKR-Bold.ttf", fontWeight: 700 },
//     ],
//   });

//   fontReady = true;
// }

// /** -------------------------
//  * ✅ 키/라벨
//  * ------------------------ */
// function termKey(y: number, t: string) {
//   return `${y}-${t.startsWith("1") ? "1" : "2"}`;
// }
// function termLabel(y: number, t: string) {
//   const n = t.startsWith("1") ? "1학기" : "2학기";
//   return `${y}학년도 ${n}`;
// }

// /** -------------------------
//  * ✅ 레이아웃 상수
//  *  - 전체 표 폭을 살짝 줄여서(540) "짤림" 방지
//  *  - 3열(각 180) 구성
//  * ------------------------ */
// const TABLE_W = 540;
// const SET_W = 180;

// // 구분(전공선택/전공필수/교양)이 들어가므로 폭을 조금 넉넉히
// const COL_W = {
//   cat: 48,
//   name: 92,
//   credit: 20,
//   grade: 20,
// }; // 합 180

// const C = {
//   line: "#111",
//   blue: "#1d4ed8",
//   red: "#dc2626",
// };

// const styles = StyleSheet.create({
//   page: {
//     paddingTop: 22,
//     paddingBottom: 22,
//     paddingLeft: 24,
//     paddingRight: 24,
//     fontFamily: "NotoSansKR",
//     fontSize: 8.3,
//     color: "#111",
//   },

//   /** 상단(제목 박스 + 정보표) */
//   headerWrap: {
//     width: TABLE_W,
//     alignSelf: "center",
//     position: "relative",
//     marginBottom: 8,
//     paddingTop: 0, // 제목 박스 자리
//   },
//   titleBox: {
//     position: "absolute",
//     top: -8,
//     left: (TABLE_W - 230) / 2,
//     width: 250,
//     height: 26,
//     borderWidth: 1,
//     borderColor: C.line,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   titleText: {
//     fontSize: 15,
//     fontWeight: 700,
//     // letterSpacing 너무 세게 주면 글자가 박스 밖으로 튀어서 "안 보이는" 느낌이 납니다.
//     letterSpacing: 1,
//   },

//   metaTable: {
//     width: TABLE_W,
//     borderWidth: 1,
//     borderColor: C.line,
//   },
//   metaRow: { flexDirection: "row" },
//   metaCell: {
//     borderRightWidth: 1,
//     borderBottomWidth: 1,
//     borderColor: C.line,
//     paddingVertical: 4,
//     paddingHorizontal: 4,
//     justifyContent: "center",
//   },
//   metaLabel: { fontWeight: 700, textAlign: "center", fontSize: 9 },
//   metaValue: { textAlign: "center", fontSize: 9 },

//   /** 본문 큰 테이블 */
//   mainTable: {
//     width: TABLE_W,
//     alignSelf: "center",
//     borderWidth: 1,
//     borderColor: C.line,
//   },

//   headRow: { flexDirection: "row" },
//   headCell: {
//     borderRightWidth: 1,
//     borderBottomWidth: 1,
//     borderColor: C.line,
//     paddingVertical: 3,
//     paddingHorizontal: 2,
//     fontWeight: 700,
//     textAlign: "center",
//     fontSize: 9,
//   },

//   colsRow: {
//     flexDirection: "row",
//     alignItems: "stretch", // ✅ 오른쪽(3열)이 왼쪽/가운데 높이에 맞춰 "늘어나게"
//   },
//   col: {
//     width: SET_W,
//     borderRightWidth: 1,
//     borderColor: C.line,
//     flexDirection: "column",
//     flexGrow: 1,
//   },
//   colLast: {
//     width: SET_W,
//     flexDirection: "column",
//     flexGrow: 1,
//   },

//   termBlock: {
//     width: "100%",
//     borderBottomWidth: 1,
//     borderColor: C.line,
//   },
//   termTitle: {
//     borderBottomWidth: 1,
//     borderColor: C.line,
//     paddingVertical: 3,
//     textAlign: "center",
//     fontWeight: 700,
//     fontSize: 9,
//   },

//   /** 과목 행: 가로줄은 최소화(샘플처럼) → borderBottom 없음 */
//   courseRow: { flexDirection: "row" },
//   courseCell: {
//     borderRightWidth: 1,
//     borderColor: C.line,
//     paddingVertical: 1.6,
//     paddingHorizontal: 1,
//     justifyContent: "center",
//   },
//   courseCat: { color: C.blue, fontSize: 8.2, textAlign: "center" },
//   courseName: { fontSize: 8.2 },
//   courseCredit: { color: C.red, textAlign: "center", fontSize: 8.2 },
//   courseGrade: { color: C.red, textAlign: "center", fontSize: 8.2 },

//   /** 학기 요약(전필/전선/.../신청/취득 + 백분위/평점) */
//   termSummaryWrap: {
//     borderTopWidth: 1,
//     borderColor: C.line,
//   },
//   sumRow: { flexDirection: "row" },
//   sumCell: {
//     borderRightWidth: 1,
//     borderBottomWidth: 1,
//     borderColor: C.line,
//     paddingVertical: 2,
//     paddingHorizontal: 1,
//     textAlign: "center",
//     color: C.blue,
//     fontSize: 8.2,
//   },
//   sumCellLast: {
//     borderBottomWidth: 1,
//     borderColor: C.line,
//     paddingVertical: 2,
//     paddingHorizontal: 1,
//     textAlign: "center",
//     color: C.blue,
//     fontSize: 8.2,
//   },

//   /** ✅ 전체 총계표(오른쪽 3열 안에 들어갈 버전) */
//   overallWrap: {
//     borderTopWidth: 1,
//     borderColor: C.line,
//   },
//   overallRow: { flexDirection: "row" },
//   overallCell: {
//     borderRightWidth: 1,
//     borderBottomWidth: 1,
//     borderColor: C.line,
//     paddingVertical: 2.2,
//     paddingHorizontal: 1,
//     textAlign: "center",
//     color: C.blue,
//     fontSize: 8.2,
//   },
//   overallCellLast: {
//     borderBottomWidth: 1,
//     borderColor: C.line,
//     paddingVertical: 2.2,
//     paddingHorizontal: 1,
//     textAlign: "center",
//     color: C.blue,
//     fontSize: 8.2,
//   },

//   /** 테두리 밖 footer */
//   footerRow: {
//     width: TABLE_W,
//     alignSelf: "center",
//     marginTop: 8,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-end",
//   },
//   printedDate: { fontSize: 11 },
//   redWarn: { fontSize: 15, fontWeight: 700, color: C.red },
//   footnote: {
//     width: TABLE_W,
//     alignSelf: "center",
//     marginTop: 2,
//     fontSize: 9.5,
//     textAlign: "center",
//   },
// });

// /** -------------------------
//  * ✅ 목업 category 매핑 (중요!)
//  *  - 전공필수 => 전필
//  *  - 전공선택 => 전선
//  *  - 교양 => 교양
//  * ------------------------ */
// function sumCreditsByCategory(details: GradeCourseDetail[]) {
//   const acc = {
//     jeonpil: 0,
//     jeonseon: 0,
//     gyoyang: 0,
//     gyojik: 0,
//     sanhak: 0,
//     jaseon: 0,
//     seonsu: 0,
//   };

//   for (const d of details) {
//     const c = (d.category || "").trim();

//     // ✅ 사용하시는 목업 값 기준 매핑
//     if (c.includes("전공필수")) acc.jeonpil += d.credits || 0;
//     else if (c.includes("전공선택")) acc.jeonseon += d.credits || 0;
//     else if (c.includes("교양")) acc.gyoyang += d.credits || 0;

//     // (확장 가능)
//     else if (c.includes("교직")) acc.gyojik += d.credits || 0;
//     else if (c.includes("산학")) acc.sanhak += d.credits || 0;
//     else if (c.includes("자선") || c.includes("자유선택")) acc.jaseon += d.credits || 0;
//     else if (c.includes("선수")) acc.seonsu += d.credits || 0;
//   }

//   return acc;
// }

// function formatKoreanDate(d: Date) {
//   const y = d.getFullYear();
//   const m = String(d.getMonth() + 1).padStart(2, "0");
//   const day = String(d.getDate()).padStart(2, "0");
//   return `${y}년${m}월${day}일`;
// }

// /** 4학기면: 왼쪽 2, 가운데 2, 오른쪽 0 (오른쪽이 비어서 총계표 넣기 딱 좋게) */
// function splitTo3Cols<T>(arr: T[]) {
//   const n = arr.length;
//   const c1 = Math.ceil(n * 0.4);
//   const c2 = Math.ceil(n * 0.4);
//   const col1 = arr.slice(0, c1);
//   const col2 = arr.slice(c1, c1 + c2);
//   const col3 = arr.slice(c1 + c2);
//   return [col1, col2, col3] as const;
// }

// /** -------------------------
//  * ✅ PDF 생성
//  * ------------------------ */
// export async function createTranscriptPdfBlob({
//   student,
//   summaries,
//   detailsMap,
// }: {
//   student: StudentProfile;
//   summaries: GradeTermSummary[];
//   detailsMap: Record<string, GradeCourseDetail[]>;
// }) {
//   ensureFont();

//   // 정렬: 2022 → 2025, 1학기 → 2학기 (샘플 배치와 동일)
//   const sorted = [...summaries].sort((a, b) => {
//     if (a.year !== b.year) return a.year - b.year;
//     const at = a.term.startsWith("1") ? 1 : 2;
//     const bt = b.term.startsWith("1") ? 1 : 2;
//     return at - bt;
//   });

//   const [col1, col2, col3] = splitTo3Cols(sorted);

//   /** ✅ 전체 총계(오른쪽 3열에 들어갈 값) */
//   let totalJeonpil = 0,
//     totalJeonseon = 0,
//     totalGyoyang = 0,
//     totalGyojik = 0,
//     totalSanhak = 0,
//     totalJaseon = 0,
//     totalSeonsu = 0;

//   let totalApplied = 0;
//   let totalEarned = 0;
//   let totalGpaTotal = 0;
//   let totalDoubleMajor = 0;

//   for (const s of sorted) {
//     const k = termKey(s.year, s.term);
//     const details = detailsMap[k] ?? [];
//     const by = sumCreditsByCategory(details);

//     totalJeonpil += by.jeonpil;
//     totalJeonseon += by.jeonseon;
//     totalGyoyang += by.gyoyang;
//     totalGyojik += by.gyojik;
//     totalSanhak += by.sanhak;
//     totalJaseon += by.jaseon;
//     totalSeonsu += by.seonsu;

//     totalApplied += s.appliedCredits ?? 0;
//     totalEarned += s.earnedCredits ?? 0;
//     totalGpaTotal += s.gpaTotal ?? 0;

//     totalDoubleMajor += s.doubleMajorCredits ?? 0;
//   }

  
//   // ✅ 전체 평점총합(합) / 평점평균(학기평균) / 백분위(학기평균)
//   const overallGpaTotalStr = totalGpaTotal.toFixed(1);

//   const overallGpaAvgStr =
//     sorted.length > 0
//       ? (sorted.reduce((a, s) => a + (s.gpaAvg ?? 0), 0) / sorted.length).toFixed(2)
//       : "0.00";

//   const overallPercentile =
//     sorted.length > 0
//       ? Math.round(sorted.reduce((a, s) => a + (s.percentile ?? 0), 0) / sorted.length)
//       : 0;


//     const printed = formatKoreanDate(new Date());

//   /** -------------------------
//    * ✅ 학기 블록(1개)
//    * ------------------------ */
//   const TermBlock = ({ s }: { s: GradeTermSummary }) => {
//     const k = termKey(s.year, s.term);
//     const details = detailsMap[k] ?? [];
//     const by = sumCreditsByCategory(details);

//     // 9칸: 전필 전선 교양 교직 산학 자선 선수 신청 취득 (합 180)
//     const wSmall = 18; // 7칸 = 126
//     const wBig = 27;   // 2칸 = 54  → 총 180

//     const sumLabels = ["전필", "전선", "교양", "교직", "산학", "자선", "선수", "신청", "취득"];
//     const sumValues = [
//       by.jeonpil,
//       by.jeonseon,
//       by.gyoyang,
//       by.gyojik,
//       by.sanhak,
//       by.jaseon,
//       by.seonsu,
//       s.appliedCredits ?? 0,
//       s.earnedCredits ?? 0,
//     ];

//     return (
//       <View style={styles.termBlock}>
//         <Text style={styles.termTitle}>{termLabel(s.year, s.term)}</Text>

//         {/* 과목 리스트 */}
//         {details.map((d, idx) => (
//           <View key={`${d.courseName}-${idx}`} style={styles.courseRow}>
//             <View style={[styles.courseCell, { width: COL_W.cat }]}>
//               <Text style={styles.courseCat}>{d.category}</Text>
//             </View>

//             <View style={[styles.courseCell, { width: COL_W.name }]}>
//               <Text style={styles.courseName}>{d.courseName}</Text>
//             </View>

//             <View style={[styles.courseCell, { width: COL_W.credit }]}>
//               <Text style={styles.courseCredit}>{String(d.credits ?? "")}</Text>
//             </View>

//             {/* 마지막 셀: borderRightWidth 0 (null 금지!) */}
//             <View style={[styles.courseCell, { width: COL_W.grade, borderRightWidth: 0 }]}>
//               <Text style={styles.courseGrade}>{d.grade}</Text>
//             </View>
//           </View>
//         ))}

//         {/* 학기 요약(칸별 구분선 있어야 함) */}
//         <View style={styles.termSummaryWrap}>
//           <View style={styles.sumRow}>
//             {sumLabels.map((h, i) => {
//               const isLast = i === sumLabels.length - 1;
//               const w = i < 7 ? wSmall : wBig;
//               return (
//                 <Text
//                   key={h}
//                   style={[
//                     isLast ? styles.sumCellLast : styles.sumCell,
//                     { width: w, fontWeight: 700 },
//                     isLast ? { borderRightWidth: 0 } : {},
//                   ]}
//                 >
//                   {h}
//                 </Text>
//               );
//             })}
//           </View>

//           <View style={styles.sumRow}>
//             {sumValues.map((v, i) => {
//               const isLast = i === sumValues.length - 1;
//               const w = i < 7 ? wSmall : wBig;
//               return (
//                 <Text
//                   key={`${i}-${v}`}
//                   style={[
//                     isLast ? styles.sumCellLast : styles.sumCell,
//                     { width: w },
//                     isLast ? { borderRightWidth: 0 } : {},
//                   ]}
//                 >
//                   {String(v)}
//                 </Text>
//               );
//             })}
//           </View>

//           {/* 백분위/평점총점/평점평균 (6칸 x 30 = 180) */}
//           <View style={styles.sumRow}>
//             {[
//               ["백분위", String(s.percentile ?? 0)],
//               ["평점총합", (s.gpaTotal ?? 0).toFixed(1)],
//               ["평점평균", (s.gpaAvg ?? 0).toFixed(2)],
//             ].map(([lab, val], idx) => {
//               const isLastPair = idx === 2;
//               const wLab = 34;
//               const wVal = 26;
//               return (
//                 <React.Fragment key={lab}>
//                   <Text style={[styles.sumCell, { width: wLab, fontWeight: 700 }]}>{lab}</Text>
//                   <Text
//                     style={[
//                       isLastPair ? styles.sumCellLast : styles.sumCell,
//                       { width: wVal },
//                       isLastPair ? { borderRightWidth: 0 } : {},
//                     ]}
//                   >
//                     {val}
//                   </Text>
//                 </React.Fragment>
//               );
//             })}
//           </View>
//         </View>
//       </View>
//     );
//   };

//   /** -------------------------
//    * ✅ 상단 공통 헤더(구분/교과목명/학점/성적 * 3세트)
//    * ------------------------ */
//   const CourseHeaderRow = () => {
//     const one = [
//       { text: "구분", w: COL_W.cat },
//       { text: "교과목명", w: COL_W.name },
//       { text: "학점", w: COL_W.credit },
//       { text: "성적", w: COL_W.grade },
//     ];

//     return (
//       <View style={styles.headRow}>
//         {[0, 1, 2].map((setIdx) => (
//           <React.Fragment key={setIdx}>
//             {one.map((c, i) => {
//               const isLastCellOfSet = i === one.length - 1;
//               const isLastOfAll = setIdx === 2 && isLastCellOfSet;
//               return (
//                 <Text
//                   key={`${setIdx}-${c.text}`}
//                   style={[
//                     styles.headCell,
//                     { width: c.w },
//                     isLastOfAll ? { borderRightWidth: 0 } : {},
//                   ]}
//                 >
//                   {c.text}
//                 </Text>
//               );
//             })}
//           </React.Fragment>
//         ))}
//       </View>
//     );
//   };

//   /** -------------------------
//    * ✅ (요구사항) 전체 총계표를 "오른쪽 3열 내부"에 표시
//    * ------------------------ */
//   const OverallTotalsInRightCol = () => {
//     // 8칸 (전필~다전공): 180/8 = 22.5
//     const w8 = 22.5;
//     // 4칸 (신청/취득 등): 180/4 = 45
//     const w4 = 45;

//     const topLabels = ["전필", "전선", "교양", "교직", "산학", "자선", "선수", "다전공"];
//     const topValues = [
//       totalJeonpil,
//       totalJeonseon,
//       totalGyoyang,
//       totalGyojik,
//       totalSanhak,
//       totalJaseon,
//       totalSeonsu,
//       totalDoubleMajor,
//     ];

//     const PairRow = (aLab: string, aVal: string, bLab: string, bVal: string) => (
//       <View style={styles.overallRow}>
//         <Text style={[styles.overallCell, { width: w4, fontWeight: 700 }]}>{aLab}</Text>
//         <Text style={[styles.overallCell, { width: w4 }]}>{aVal}</Text>
//         <Text style={[styles.overallCell, { width: w4, fontWeight: 700 }]}>{bLab}</Text>
//         <Text style={[styles.overallCellLast, { width: w4, borderRightWidth: 0 }]}>{bVal}</Text>
//       </View>
//     );

//     return (
//       <View style={styles.overallWrap}>
//         {/* 라벨 row */}
//         <View style={styles.overallRow}>
//           {topLabels.map((h, i) => {
//             const isLast = i === topLabels.length - 1;
//             return (
//               <Text
//                 key={h}
//                 style={[
//                   isLast ? styles.overallCellLast : styles.overallCell,
//                   { width: w8, fontWeight: 700 },
//                   isLast ? { borderRightWidth: 0 } : {},
//                 ]}
//               >
//                 {h}
//               </Text>
//             );
//           })}
//         </View>

//         {/* 값 row */}
//         <View style={styles.overallRow}>
//           {topValues.map((v, i) => {
//             const isLast = i === topValues.length - 1;
//             return (
//               <Text
//                 key={`${i}-${v}`}
//                 style={[
//                   isLast ? styles.overallCellLast : styles.overallCell,
//                   { width: w8 },
//                   isLast ? { borderRightWidth: 0 } : {},
//                 ]}
//               >
//                 {String(v)}
//               </Text>
//             );
//           })}
//         </View>

//         {PairRow("신청학점", String(totalApplied), "취득학점", String(totalEarned))}
//         {PairRow("평점총합", overallGpaTotalStr, "평점평균", overallGpaAvgStr)}
//         {PairRow("백분위", String(overallPercentile), "졸업논문", "")}
//       </View>
//     );
//   };

//   /** -------------------------
//    * ✅ 상단 정보표: student 목업 기준 매핑
//    * ------------------------ */
//   const department = student.department ?? "";
//   const doubleMajor = ""; // 목업에 없으니 비움(원하면 StudentProfile에 필드 추가 가능)
//   const degreeNo = "";    // 동일
//   const entranceDate = "2022.03.02"; // 원하시면 student에 필드 추가해서 자동으로 넣어드릴 수 있어요.
//   const gradDate = "";

//   const doc = (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         {/* ---------------- 상단 제목+정보표 ---------------- */}
//         <View style={styles.headerWrap}>
//           <View style={styles.titleBox}>
//             <Text style={styles.titleText}>증 명 용 성 적 표</Text>
//           </View>

//           <View style={styles.metaTable}>
//             {/* row 1 (합 540): 40 + 70 + 40 + 140 + 50 + 200 */}
//             <View style={styles.metaRow}>
//               <View style={[styles.metaCell, { width: 40 }]}>
//                 <Text style={styles.metaLabel}>학 번</Text>
//               </View>
//               <View style={[styles.metaCell, { width: 70 }]}>
//                 <Text style={styles.metaValue}>{student.studentId}</Text>
//               </View>

//               <View style={[styles.metaCell, { width: 40 }]}>
//                 <Text style={styles.metaLabel}>학 과</Text>
//               </View>
//               <View style={[styles.metaCell, { width: 140 }]}>
//                 <Text style={[styles.metaValue, { fontWeight: 700}]}>{student.department}</Text>
//               </View>

//               <View style={[styles.metaCell, { width: 50 }]}>
//                 <Text style={styles.metaLabel}>다전공</Text>
//               </View>
//               <View style={[styles.metaCell, { width: 200, borderRightWidth: 0 }]}>
//                 <Text style={styles.metaValue}>{doubleMajor}</Text>
//               </View>
//             </View>

//             {/* row 2 (합 540): 40 + 70 + 40 + 140 + 50 + 70 + 80 + 50 */}
//             <View style={styles.metaRow}>
//               <View style={[styles.metaCell, { width: 40, borderBottomWidth: 0 }]}>
//                 <Text style={styles.metaLabel}>성 명</Text>
//               </View>
//               <View style={[styles.metaCell, { width: 70, borderBottomWidth: 0 }]}>
//                 <Text style={styles.metaValue}>{student.name}</Text>
//               </View>

//               <View style={[styles.metaCell, { width: 40, borderBottomWidth: 0 }]}>
//                 <Text style={styles.metaLabel}>학위번호</Text>
//               </View>
//               <View style={[styles.metaCell, { width: 140, borderBottomWidth: 0 }]}>
//                 <Text style={styles.metaValue}>{degreeNo}</Text>
//               </View>

//               <View style={[styles.metaCell, { width: 50, borderBottomWidth: 0 }]}>
//                 <Text style={styles.metaLabel}>입학일자</Text>
//               </View>
//               <View style={[styles.metaCell, { width: 70, borderBottomWidth: 0 }]}>
//                 <Text style={styles.metaValue}>{entranceDate}</Text>
//               </View>

//               <View style={[styles.metaCell, { width: 80, borderBottomWidth: 0 }]}>
//                 <Text style={styles.metaLabel}>졸업(수료)일자</Text>
//               </View>
//               <View style={[styles.metaCell, { width: 50, borderRightWidth: 0, borderBottomWidth: 0 }]}>
//                 <Text style={styles.metaValue}>{gradDate}</Text>
//               </View>
//             </View>
//           </View>
//         </View>

//         {/* ---------------- 본문 ---------------- */}
//         <View style={styles.mainTable}>
//           <CourseHeaderRow />

//           <View style={styles.colsRow}>
//             {/* 왼쪽 열 */}
//             <View style={styles.col}>
//               {col1.map((s) => (
//                 <TermBlock key={termKey(s.year, s.term)} s={s} />
//               ))}
//             </View>

//             {/* 가운데 열 */}
//             <View style={styles.col}>
//               {col2.map((s) => (
//                 <TermBlock key={termKey(s.year, s.term)} s={s} />
//               ))}
//             </View>

//             {/* ✅ 오른쪽(3번째) 열: 남는 공간 아래쪽에 전체 총계표 넣기 */}
//             <View style={styles.colLast}>
//               {col3.map((s) => (
//                 <TermBlock key={termKey(s.year, s.term)} s={s} />
//               ))}

//               {/* ✅ 아래로 밀어서 "열의 밑부분"에 붙이기 */}
//               <View style={{ flexGrow: 1 }} />

//               <OverallTotalsInRightCol />
//             </View>
//           </View>
//         </View>

//         {/* ---------------- 테두리 밖 ---------------- */}
//         <View style={styles.footerRow}>
//           <Text style={styles.printedDate}>{printed}</Text>
//           <Text style={styles.redWarn}>본 성적표는 제출용으로 사용하실 수 없습니다.</Text>
//         </View>

//         <Text style={styles.footnote}>
//           * 비동일계 편입생은 선이수과목 이수 여부를 반드시 별도로 확인하시기 바랍니다
//         </Text>
//       </Page>
//     </Document>
//   );

//   return pdf(doc).toBlob();
// }

// src/components/TranscriptPdf.tsx
"use client";

import React from "react";
import { Document, Page, Text, View, StyleSheet, Font, pdf } from "@react-pdf/renderer";
import type { GradeCourseDetail, GradeTermSummary, StudentProfile } from "@/data/mock";

/** -------------------------
 * ✅ 폰트 등록 (public/fonts 기준)
 *  - 파일 필요:
 *    public/fonts/NotoSansKR-Regular.ttf
 *    public/fonts/NotoSansKR-Bold.ttf
 * ------------------------ */
let fontReady = false;
function ensureFont() {
  if (fontReady) return;

  Font.register({
    family: "NotoSansKR",
    fonts: [
      { src: "/fonts/NotoSansKR-Regular.ttf", fontWeight: 400 },
      { src: "/fonts/NotoSansKR-Bold.ttf", fontWeight: 700 },
    ],
  });

  fontReady = true;
}

/** -------------------------
 * ✅ 키/라벨
 * ------------------------ */
function termKey(y: number, t: string) {
  return `${y}-${t.startsWith("1") ? "1" : "2"}`;
}
function termLabel(y: number, t: string) {
  const n = t.startsWith("1") ? "1학기" : "2학기";
  return `${y}학년도 ${n}`;
}

/** -------------------------
 * ✅ 레이아웃 상수 (스타일 유지)
 * ------------------------ */
const TABLE_W = 540;
const SET_W = 180;

const COL_W = {
  cat: 48,
  name: 92,
  credit: 20,
  grade: 20,
}; // 합 180

const C = {
  line: "#111",
  blue: "#1d4ed8",
  red: "#dc2626",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 20,
    paddingBottom: 12, // ✅ footer 아래 흰 여백 줄이기(과하지 않게)
    paddingLeft: 24,
    paddingRight: 24,
    fontFamily: "NotoSansKR",
    fontSize: 8.3,
    color: "#111",
  },

  /** ✅ 상단: 제목 박스(흐름 배치) + 정보표 */
  headerWrap: {
    width: TABLE_W,
    alignSelf: "center",
    marginBottom: 6,
  },

  /** ✅ 예시처럼: 제목 박스를 metaTable 위에 “그냥” 올림 */
  titleBox: {
    alignSelf: "center",
    width: 250,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: "#fff",
    paddingTop: 4,
    paddingBottom: 10,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  titleText: {
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: 1,
    lineHeight: 1.1,
  },
  /** ✅ 두번째 사진처럼 전공을 제목 아래에 한 줄 더 */
  titleSub: {
    marginTop: 2,
    fontSize: 10.5,
    fontWeight: 700,
    lineHeight: 1.1,
  },

  metaTable: {
    width: TABLE_W,
    borderWidth: 1,
    borderColor: C.line,
  },
  metaRow: { flexDirection: "row" },
  metaCell: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: C.line,
    paddingVertical: 4,
    paddingHorizontal: 4,
    justifyContent: "center",
  },
  metaLabel: { fontWeight: 700, textAlign: "center", fontSize: 9 },
  metaValue: { textAlign: "center", fontSize: 9 },

  /** 본문 큰 테이블 */
  mainTable: {
    width: TABLE_W,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: C.line,
  },

  headRow: { flexDirection: "row" },
  headCell: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: C.line,
    paddingVertical: 3,
    paddingHorizontal: 2,
    fontWeight: 700,
    textAlign: "center",
    fontSize: 9,
  },

  colsRow: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  col: {
    width: SET_W,
    borderRightWidth: 1,
    borderColor: C.line,
    flexDirection: "column",
    flexGrow: 1,
  },
  colLast: {
    width: SET_W,
    flexDirection: "column",
    flexGrow: 1,
  },

  termBlock: {
    width: "100%",
    borderBottomWidth: 1,
    borderColor: C.line,
  },
  termTitle: {
    borderBottomWidth: 1,
    borderColor: C.line,
    paddingVertical: 3,
    textAlign: "center",
    fontWeight: 700,
    fontSize: 9,
  },

  courseRow: { flexDirection: "row" },
  courseCell: {
    borderRightWidth: 1,
    borderColor: C.line,
    paddingVertical: 1.6,
    paddingHorizontal: 1,
    justifyContent: "center",
  },
  courseCat: { color: C.blue, fontSize: 8.2, textAlign: "center" },
  courseName: { fontSize: 8.2 },
  courseCredit: { color: C.red, textAlign: "center", fontSize: 8.2 },
  courseGrade: { color: C.red, textAlign: "center", fontSize: 8.2 },

  termSummaryWrap: {
    borderTopWidth: 1,
    borderColor: C.line,
  },
  sumRow: { flexDirection: "row" },
  sumCell: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: C.line,
    paddingVertical: 2,
    paddingHorizontal: 1,
    textAlign: "center",
    color: C.blue,
    fontSize: 8.2,
  },
  sumCellLast: {
    borderBottomWidth: 1,
    borderColor: C.line,
    paddingVertical: 2,
    paddingHorizontal: 1,
    textAlign: "center",
    color: C.blue,
    fontSize: 8.2,
  },

  overallWrap: {
    borderTopWidth: 1,
    borderColor: C.line,
  },
  overallRow: { flexDirection: "row" },
  overallCell: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: C.line,
    paddingVertical: 2.2,
    paddingHorizontal: 1,
    textAlign: "center",
    color: C.blue,
    fontSize: 8.2,
  },
  overallCellLast: {
    borderBottomWidth: 1,
    borderColor: C.line,
    paddingVertical: 2.2,
    paddingHorizontal: 1,
    textAlign: "center",
    color: C.blue,
    fontSize: 8.2,
  },

  /** ✅ rows 밑 간격은 작게, footer 아래 흰 여백은 과하지 않게 */
  footerSpacer: {
    flexGrow: 1,
    maxHeight: 10, // ✅ 남는 공간이 있어도 “조금만” 내려가게(고정처럼 벌어지지 않게)
  },

  footerRow: {
    width: TABLE_W,
    alignSelf: "center",
    marginTop: 6, // ✅ rows 바로 아래 느낌
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  printedDate: { fontSize: 11 },
  redWarn: { fontSize: 15, fontWeight: 700, color: C.red },
  footnote: {
    width: TABLE_W,
    alignSelf: "center",
    marginTop: 1,
    fontSize: 9.5,
    textAlign: "center",
  },
});

/** -------------------------
 * ✅ category 매핑
 * ------------------------ */
function sumCreditsByCategory(details: GradeCourseDetail[]) {
  const acc = {
    jeonpil: 0,
    jeonseon: 0,
    gyoyang: 0,
    gyojik: 0,
    sanhak: 0,
    jaseon: 0,
    seonsu: 0,
  };

  for (const d of details) {
    const c = (d.category || "").trim();

    if (c.includes("전공필수")) acc.jeonpil += d.credits || 0;
    else if (c.includes("전공선택")) acc.jeonseon += d.credits || 0;
    else if (c.includes("교양")) acc.gyoyang += d.credits || 0;
    else if (c.includes("교직")) acc.gyojik += d.credits || 0;
    else if (c.includes("산학")) acc.sanhak += d.credits || 0;
    else if (c.includes("자선") || c.includes("자유선택")) acc.jaseon += d.credits || 0;
    else if (c.includes("선수")) acc.seonsu += d.credits || 0;
  }

  return acc;
}

function formatKoreanDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}년${m}월${day}일`;
}

function splitTo3Cols<T>(arr: T[]) {
  const n = arr.length;
  const c1 = Math.ceil(n * 0.4);
  const c2 = Math.ceil(n * 0.4);
  const col1 = arr.slice(0, c1);
  const col2 = arr.slice(c1, c1 + c2);
  const col3 = arr.slice(c1 + c2);
  return [col1, col2, col3] as const;
}

/** -------------------------
 * ✅ PDF 생성
 * ------------------------ */
export async function createTranscriptPdfBlob({
  student,
  summaries,
  detailsMap,
}: {
  student: StudentProfile;
  summaries: GradeTermSummary[];
  detailsMap: Record<string, GradeCourseDetail[]>;
}) {
  ensureFont();

  const sorted = [...summaries].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    const at = a.term.startsWith("1") ? 1 : 2;
    const bt = b.term.startsWith("1") ? 1 : 2;
    return at - bt;
  });

  const [col1, col2, col3] = splitTo3Cols(sorted);

  let totalJeonpil = 0,
    totalJeonseon = 0,
    totalGyoyang = 0,
    totalGyojik = 0,
    totalSanhak = 0,
    totalJaseon = 0,
    totalSeonsu = 0;

  let totalApplied = 0;
  let totalEarned = 0;
  let totalGpaTotal = 0;
  let totalDoubleMajor = 0;

  for (const s of sorted) {
    const k = termKey(s.year, s.term);
    const details = detailsMap[k] ?? [];
    const by = sumCreditsByCategory(details);

    totalJeonpil += by.jeonpil;
    totalJeonseon += by.jeonseon;
    totalGyoyang += by.gyoyang;
    totalGyojik += by.gyojik;
    totalSanhak += by.sanhak;
    totalJaseon += by.jaseon;
    totalSeonsu += by.seonsu;

    totalApplied += s.appliedCredits ?? 0;
    totalEarned += s.earnedCredits ?? 0;
    totalGpaTotal += s.gpaTotal ?? 0;

    totalDoubleMajor += s.doubleMajorCredits ?? 0;
  }

  const overallGpaTotalStr = totalGpaTotal.toFixed(1);

  const overallGpaAvgStr =
    sorted.length > 0
      ? (sorted.reduce((a, s) => a + (s.gpaAvg ?? 0), 0) / sorted.length).toFixed(2)
      : "0.00";

  const overallPercentile =
    sorted.length > 0
      ? Math.round(sorted.reduce((a, s) => a + (s.percentile ?? 0), 0) / sorted.length)
      : 0;

  const printed = formatKoreanDate(new Date());

  const TermBlock = ({ s }: { s: GradeTermSummary }) => {
    const k = termKey(s.year, s.term);
    const details = detailsMap[k] ?? [];
    const by = sumCreditsByCategory(details);

    const wSmall = 18;
    const wBig = 27;

    const sumLabels = ["전필", "전선", "교양", "교직", "산학", "자선", "선수", "신청", "취득"];
    const sumValues = [
      by.jeonpil,
      by.jeonseon,
      by.gyoyang,
      by.gyojik,
      by.sanhak,
      by.jaseon,
      by.seonsu,
      s.appliedCredits ?? 0,
      s.earnedCredits ?? 0,
    ];

    return (
      <View style={styles.termBlock}>
        <Text style={styles.termTitle}>{termLabel(s.year, s.term)}</Text>

        {details.map((d, idx) => (
          <View key={`${d.courseName}-${idx}`} style={styles.courseRow}>
            <View style={[styles.courseCell, { width: COL_W.cat }]}>
              <Text style={styles.courseCat}>{d.category}</Text>
            </View>

            <View style={[styles.courseCell, { width: COL_W.name }]}>
              <Text style={styles.courseName}>{d.courseName}</Text>
            </View>

            <View style={[styles.courseCell, { width: COL_W.credit }]}>
              <Text style={styles.courseCredit}>{String(d.credits ?? "")}</Text>
            </View>

            <View style={[styles.courseCell, { width: COL_W.grade, borderRightWidth: 0 }]}>
              <Text style={styles.courseGrade}>{d.grade}</Text>
            </View>
          </View>
        ))}

        <View style={styles.termSummaryWrap}>
          <View style={styles.sumRow}>
            {sumLabels.map((h, i) => {
              const isLast = i === sumLabels.length - 1;
              const w = i < 7 ? wSmall : wBig;
              return (
                <Text
                  key={h}
                  style={[
                    isLast ? styles.sumCellLast : styles.sumCell,
                    { width: w, fontWeight: 700 },
                    isLast ? { borderRightWidth: 0 } : {},
                  ]}
                >
                  {h}
                </Text>
              );
            })}
          </View>

          <View style={styles.sumRow}>
            {sumValues.map((v, i) => {
              const isLast = i === sumValues.length - 1;
              const w = i < 7 ? wSmall : wBig;
              return (
                <Text
                  key={`${i}-${v}`}
                  style={[
                    isLast ? styles.sumCellLast : styles.sumCell,
                    { width: w },
                    isLast ? { borderRightWidth: 0 } : {},
                  ]}
                >
                  {String(v)}
                </Text>
              );
            })}
          </View>

          <View style={styles.sumRow}>
            {[
              ["백분위", String(s.percentile ?? 0)],
              ["평점총합", (s.gpaTotal ?? 0).toFixed(1)],
              ["평점평균", (s.gpaAvg ?? 0).toFixed(2)],
            ].map(([lab, val], idx) => {
              const isLastPair = idx === 2;
              const wLab = 34;
              const wVal = 26;
              return (
                <React.Fragment key={lab}>
                  <Text style={[styles.sumCell, { width: wLab, fontWeight: 700 }]}>{lab}</Text>
                  <Text
                    style={[
                      isLastPair ? styles.sumCellLast : styles.sumCell,
                      { width: wVal },
                      isLastPair ? { borderRightWidth: 0 } : {},
                    ]}
                  >
                    {val}
                  </Text>
                </React.Fragment>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  const CourseHeaderRow = () => {
    const one = [
      { text: "구분", w: COL_W.cat },
      { text: "교과목명", w: COL_W.name },
      { text: "학점", w: COL_W.credit },
      { text: "성적", w: COL_W.grade },
    ];

    return (
      <View style={styles.headRow}>
        {[0, 1, 2].map((setIdx) => (
          <React.Fragment key={setIdx}>
            {one.map((c, i) => {
              const isLastCellOfSet = i === one.length - 1;
              const isLastOfAll = setIdx === 2 && isLastCellOfSet;
              return (
                <Text
                  key={`${setIdx}-${c.text}`}
                  style={[
                    styles.headCell,
                    { width: c.w },
                    isLastOfAll ? { borderRightWidth: 0 } : {},
                  ]}
                >
                  {c.text}
                </Text>
              );
            })}
          </React.Fragment>
        ))}
      </View>
    );
  };

  const OverallTotalsInRightCol = () => {
    const w8 = 22.5;
    const w4 = 45;

    const topLabels = ["전필", "전선", "교양", "교직", "산학", "자선", "선수", "다전공"];
    const topValues = [
      totalJeonpil,
      totalJeonseon,
      totalGyoyang,
      totalGyojik,
      totalSanhak,
      totalJaseon,
      totalSeonsu,
      totalDoubleMajor,
    ];

    const PairRow = (aLab: string, aVal: string, bLab: string, bVal: string) => (
      <View style={styles.overallRow}>
        <Text style={[styles.overallCell, { width: w4, fontWeight: 700 }]}>{aLab}</Text>
        <Text style={[styles.overallCell, { width: w4 }]}>{aVal}</Text>
        <Text style={[styles.overallCell, { width: w4, fontWeight: 700 }]}>{bLab}</Text>
        <Text style={[styles.overallCellLast, { width: w4, borderRightWidth: 0 }]}>{bVal}</Text>
      </View>
    );

    return (
      <View style={styles.overallWrap}>
        <View style={styles.overallRow}>
          {topLabels.map((h, i) => {
            const isLast = i === topLabels.length - 1;
            return (
              <Text
                key={h}
                style={[
                  isLast ? styles.overallCellLast : styles.overallCell,
                  { width: w8, fontWeight: 700 },
                  isLast ? { borderRightWidth: 0 } : {},
                ]}
              >
                {h}
              </Text>
            );
          })}
        </View>

        <View style={styles.overallRow}>
          {topValues.map((v, i) => {
            const isLast = i === topValues.length - 1;
            return (
              <Text
                key={`${i}-${v}`}
                style={[
                  isLast ? styles.overallCellLast : styles.overallCell,
                  { width: w8 },
                  isLast ? { borderRightWidth: 0 } : {},
                ]}
              >
                {String(v)}
              </Text>
            );
          })}
        </View>

        {PairRow("신청학점", String(totalApplied), "취득학점", String(totalEarned))}
        {PairRow("평점총합", overallGpaTotalStr, "평점평균", overallGpaAvgStr)}
        {PairRow("백분위", String(overallPercentile), "졸업논문", "")}
      </View>
    );
  };

  const doubleMajor = "";
  const degreeNo = "";
  const entranceDate = "2022.03.02";
  const gradDate = "";

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ✅ 제목 박스(흐름대로) + 정보표 */}
        <View style={styles.headerWrap}>
          <View style={styles.titleBox}>
            <Text style={styles.titleText}>증 명 용 성 적 표</Text>
            
          </View>

          <View style={styles.metaTable}>
            <View style={styles.metaRow}>
              <View style={[styles.metaCell, { width: 40 }]}>
                <Text style={styles.metaLabel}>학 번</Text>
              </View>
              <View style={[styles.metaCell, { width: 70 }]}>
                <Text style={styles.metaValue}>{student.studentId}</Text>
              </View>

              <View style={[styles.metaCell, { width: 40 }]}>
                <Text style={styles.metaLabel}>학 과</Text>
              </View>
              <View style={[styles.metaCell, { width: 140 }]}>
                <Text style={[styles.metaValue, { fontWeight: 700 }]}>{student.department}</Text>
              </View>

              <View style={[styles.metaCell, { width: 50 }]}>
                <Text style={styles.metaLabel}>다전공</Text>
              </View>
              <View style={[styles.metaCell, { width: 200, borderRightWidth: 0 }]}>
                <Text style={styles.metaValue}>{doubleMajor}</Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <View style={[styles.metaCell, { width: 40, borderBottomWidth: 0 }]}>
                <Text style={styles.metaLabel}>성 명</Text>
              </View>
              <View style={[styles.metaCell, { width: 70, borderBottomWidth: 0 }]}>
                <Text style={styles.metaValue}>{student.name}</Text>
              </View>

              <View style={[styles.metaCell, { width: 40, borderBottomWidth: 0 }]}>
                <Text style={styles.metaLabel}>학위번호</Text>
              </View>
              <View style={[styles.metaCell, { width: 140, borderBottomWidth: 0 }]}>
                <Text style={styles.metaValue}>{degreeNo}</Text>
              </View>

              <View style={[styles.metaCell, { width: 50, borderBottomWidth: 0 }]}>
                <Text style={styles.metaLabel}>입학일자</Text>
              </View>
              <View style={[styles.metaCell, { width: 70, borderBottomWidth: 0 }]}>
                <Text style={styles.metaValue}>{entranceDate}</Text>
              </View>

              <View style={[styles.metaCell, { width: 80, borderBottomWidth: 0 }]}>
                <Text style={styles.metaLabel}>졸업(수료)일자</Text>
              </View>
              <View style={[styles.metaCell, { width: 50, borderRightWidth: 0, borderBottomWidth: 0 }]}>
                <Text style={styles.metaValue}>{gradDate}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ---------------- 본문 ---------------- */}
        <View style={styles.mainTable}>
          <CourseHeaderRow />

          <View style={styles.colsRow}>
            <View style={styles.col}>
              {col1.map((s) => (
                <TermBlock key={termKey(s.year, s.term)} s={s} />
              ))}
            </View>

            <View style={styles.col}>
              {col2.map((s) => (
                <TermBlock key={termKey(s.year, s.term)} s={s} />
              ))}
            </View>

            <View style={styles.colLast}>
              {col3.map((s) => (
                <TermBlock key={termKey(s.year, s.term)} s={s} />
              ))}

              <View style={{ flexGrow: 1 }} />
              <OverallTotalsInRightCol />
            </View>
          </View>
        </View>

        {/* ✅ footer를 “조금만” 아래로 내려서 흰 여백 과함 방지 */}
        <View style={styles.footerSpacer} />

        <View style={styles.footerRow}>
          <Text style={styles.printedDate}>{printed}</Text>
          <Text style={styles.redWarn}>본 성적표는 제출용으로 사용하실 수 없습니다.</Text>
        </View>

        <Text style={styles.footnote}>
          * 비동일계 편입생은 선이수과목 이수 여부를 반드시 별도로 확인하시기 바랍니다
        </Text>
      </Page>
    </Document>
  );

  return pdf(doc).toBlob();
}
