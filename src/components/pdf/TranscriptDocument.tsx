// src/components/pdf/TranscriptDocument.tsx
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { StudentProfile, GradeTermSummary, GradeCourseDetail } from "@/data/mock";

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 10 },
  title: { fontSize: 16, textAlign: "center", marginBottom: 12 },
  sub: { fontSize: 10, marginBottom: 10 },

  sectionTitle: { fontSize: 12, marginTop: 10, marginBottom: 6 },
  table: { borderWidth: 1, borderColor: "#999" },
  tr: { flexDirection: "row" },
  th: { backgroundColor: "#f2f2f2", borderRightWidth: 1, borderRightColor: "#999", padding: 4, fontSize: 9 },
  td: { borderTopWidth: 1, borderTopColor: "#ddd", borderRightWidth: 1, borderRightColor: "#ddd", padding: 4 },
});

function Cell({ w, children, last }: { w: number; children: React.ReactNode; last?: boolean }) {
  return (
    <View style={[{ width: `${w}%` }, last ? { borderRightWidth: 0 } : {}]}>
      {children}
    </View>
  );
}

export default function TranscriptDocument({
  student,
  summaries,
  detailsMap,
}: {
  student: StudentProfile;
  summaries: GradeTermSummary[];
  detailsMap: Record<string, GradeCourseDetail[]>;
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>증명용 성적표</Text>
        <Text style={styles.sub}>
          학번: {student.studentId}   성명: {student.name}   학과: {student.department}
        </Text>

        <Text style={styles.sectionTitle}>학기별 성적</Text>
        <View style={styles.table}>
          <View style={styles.tr}>
            <Cell w={10}><Text style={styles.th}>년도</Text></Cell>
            <Cell w={10}><Text style={styles.th}>학기</Text></Cell>
            <Cell w={14}><Text style={styles.th}>학기구분</Text></Cell>
            <Cell w={10}><Text style={styles.th}>신청학점</Text></Cell>
            <Cell w={10}><Text style={styles.th}>전공</Text></Cell>
            <Cell w={10}><Text style={styles.th}>교양</Text></Cell>
            <Cell w={10}><Text style={styles.th}>총취득</Text></Cell>
            <Cell w={10}><Text style={styles.th}>평점평균</Text></Cell>
            <Cell w={16} last><Text style={[styles.th, { borderRightWidth: 0 }]}>백분위</Text></Cell>
          </View>

          {summaries.map((s) => (
            <View key={`${s.year}-${s.term}`} style={styles.tr}>
              <Cell w={10}><Text style={styles.td}>{s.year}</Text></Cell>
              <Cell w={10}><Text style={styles.td}>{s.term}</Text></Cell>
              <Cell w={14}><Text style={styles.td}>{s.termType}</Text></Cell>
              <Cell w={10}><Text style={styles.td}>{s.appliedCredits}</Text></Cell>
              <Cell w={10}><Text style={styles.td}>{s.majorCredits}</Text></Cell>
              <Cell w={10}><Text style={styles.td}>{s.liberalCredits}</Text></Cell>
              <Cell w={10}><Text style={styles.td}>{s.earnedCredits}</Text></Cell>
              <Cell w={10}><Text style={styles.td}>{s.gpaAvg.toFixed(2)}</Text></Cell>
              <Cell w={16} last><Text style={[styles.td, { borderRightWidth: 0 }]}>{s.percentile}</Text></Cell>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>학기별 성적 상세</Text>
        {Object.entries(detailsMap).map(([k, list]) => (
          <View key={k} wrap={false} style={{ marginBottom: 10 }}>
            <Text style={{ marginBottom: 4 }}>{k.replace("-", "년도 ")}학기</Text>
            <View style={styles.table}>
              <View style={styles.tr}>
                <Cell w={46}><Text style={styles.th}>교과목명</Text></Cell>
                <Cell w={16}><Text style={styles.th}>이수구분</Text></Cell>
                <Cell w={8}><Text style={styles.th}>학점</Text></Cell>
                <Cell w={10}><Text style={styles.th}>등급</Text></Cell>
                <Cell w={10}><Text style={styles.th}>평점</Text></Cell>
                <Cell w={10} last><Text style={[styles.th, { borderRightWidth: 0 }]}>인정</Text></Cell>
              </View>

              {list.map((d, idx) => (
                <View key={`${k}-${idx}`} style={styles.tr}>
                  <Cell w={46}><Text style={styles.td}>{d.courseName}</Text></Cell>
                  <Cell w={16}><Text style={styles.td}>{d.category}</Text></Cell>
                  <Cell w={8}><Text style={styles.td}>{d.credits}</Text></Cell>
                  <Cell w={10}><Text style={styles.td}>{d.grade}</Text></Cell>
                  <Cell w={10}><Text style={styles.td}>{d.point == null ? "-" : d.point}</Text></Cell>
                  <Cell w={10} last><Text style={[styles.td, { borderRightWidth: 0 }]}>{d.recognized ? "Y" : "N"}</Text></Cell>
                </View>
              ))}
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
}
