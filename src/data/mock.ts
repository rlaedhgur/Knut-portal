// src/data/mock.ts
export type StudentProfile = {
    studentId: string;
    name: string;
    college: string;        // 대학(원)
    department: string;     // 학과/전공
    program: string;        // 과정(학사)
    status: string;         // 학적상태
    advisor: string;        // 지도교수
    nationality: string;    // 국적
    birthDate: string;      // 생일
    gender: string;         // 성별
    entryYear: string;      // 입학년도
    entryTerm: string;      // 입학학기
    dayNight: string;       // 주/야
    gradeYear: string;      // 학년
    completedTerms: string; // 이수학기
    phone: string;
    email: string;
  
    // 아래는 "있어 보이게" 넣는 옵션 필드(필요 없으면 안 써도 됨)
    admissionType?: string; // 전형
    changeReason?: string;  // 변동세부사유
    changeDate?: string;    // 변동일자
  };
  
  export type GradeTermSummary = {
    year: number;
    term: "1학기" | "2학기";
    termType: string; // 정규학기 등
    yearLevel: number; // 수강학년
    appliedCredits: number; // 신청학점
    majorCredits: number; // 전공학점
    liberalCredits: number; // 교양학점
    teachingCredits: number; // 교직학점
    otherCredits: number; // 기타학점
    minorCredits: number; // 부전공학점
    doubleMajorCredits: number; // 복수전공학점
    earnedCredits: number; // 총취득학점
    gpaTotal: number; // 평점총계
    gpaAvg: number; // 평점평균
    percentile: number; // 백분위점수
    warning: boolean; // 학사경고여부
  };
  
  export type GradeCourseDetail = {
    courseName: string;
    category: string; // 이수구분
    credits: number;
    grade: string;    // 등급
    point: number | null; // 평점(P/NP는 null)
    retake: boolean;  // 재수강 여부
    recognitionType: string; // 성적인정구분 (학점취득 등)
    recognized: boolean;     // 성적인정여부
  };
  
  export type TimetableEntry = {
    day: "월" | "화" | "수" | "목" | "금" | "토";
    start: string; // "09:00"
    end: string;   // "10:30"
    title: string;
    professor?: string;
    room?: string;
    color?: "yellow" | "emerald" | "lime" | "orange" | "pink" | "sky" | "violet" | "purple" | "green" | "blue" | "red" | "teal" | "brown";
  };
  
  export const MOCK_STUDENT: StudentProfile = {
    studentId: "2240030",
    name: "엄승배",
    college: "공과대학",
    department: "사회기반공학전공",
    program: "학사",
    status: "재학",
    advisor: "이승용",
    nationality: "대한민국",
    birthDate: "2003-04-24",
    gender: "남",
    entryYear: "2022",
    entryTerm: "1학기",
    dayNight: "주",
    gradeYear: "3학년",
    completedTerms: "4",
    phone: "010-8951-2420",
    email: "tmdqo5758@gmail.com",
    admissionType: "일반전형",
    changeReason: "일반복학",
    changeDate: "2025-01-02",
  };
  
  export const MOCK_GRADE_SUMMARIES: GradeTermSummary[] = [
    // ✅ 스샷에 보이는 4학기 요약 그대로
    {
      year: 2025,
      term: "2학기",
      termType: "정규학기",
      yearLevel: 2,
      appliedCredits: 17,
      majorCredits: 17,
      liberalCredits: 0,
      teachingCredits: 0,
      otherCredits: 0,
      minorCredits: 0,
      doubleMajorCredits: 0,
      earnedCredits: 17,
      gpaTotal: 63.6,
      gpaAvg: 3.74,
      percentile: 89,
      warning: false,
    },
    {
      year: 2025,
      term: "1학기",
      termType: "정규학기",
      yearLevel: 2,
      appliedCredits: 19,
      majorCredits: 19,
      liberalCredits: 0,
      teachingCredits: 0,
      otherCredits: 0,
      minorCredits: 0,
      doubleMajorCredits: 0,
      earnedCredits: 19,
      gpaTotal: 49.4,
      gpaAvg: 3.29,
      percentile: 84,
      warning: false,
    },
    {
      year: 2022,
      term: "2학기",
      termType: "정규학기",
      yearLevel: 1,
      appliedCredits: 18,
      majorCredits: 6,
      liberalCredits: 12,
      teachingCredits: 0,
      otherCredits: 0,
      minorCredits: 0,
      doubleMajorCredits: 0,
      earnedCredits: 18,
      gpaTotal: 61.0,
      gpaAvg: 3.59,
      percentile: 87,
      warning: false,
    },
    {
      year: 2022,
      term: "1학기",
      termType: "정규학기",
      yearLevel: 1,
      appliedCredits: 18,
      majorCredits: 6,
      liberalCredits: 12,
      teachingCredits: 0,
      otherCredits: 0,
      minorCredits: 0,
      doubleMajorCredits: 0,
      earnedCredits: 18,
      gpaTotal: 49.5,
      gpaAvg: 3.3,
      percentile: 85,
      warning: false,
    },
  ];
  
  export const MOCK_GRADE_DETAILS: Record<string, GradeCourseDetail[]> = {
    // key: "2025-2"
    "2025-1": [
      { courseName: "건설CAD및실습", category: "전공선택", credits: 2, grade: "B+", point: 3.5, retake: false, recognitionType: "학점취득", recognized: true },
      { courseName: "건설재료학Ⅰ", category: "전공선택", credits: 3, grade: "B+", point: 3.5, retake: false, recognitionType: "학점취득", recognized: true },
      { courseName: "공업역학", category: "전공선택", credits: 3, grade: "B+", point: 3.5, retake: false, recognitionType: "학점취득", recognized: true },
      { courseName: "공학수학", category: "전공선택", credits: 3, grade: "B+", point: 3.5, retake: false, recognitionType: "학점취득", recognized: true },
      { courseName: "기초유체역학", category: "전공선택", credits: 3, grade: "B+", point: 3.5, retake: false, recognitionType: "학점취득", recognized: true },
      { courseName: "기초측량및실습", category: "전공선택", credits: 2, grade: "B0", point: 3.0, retake: false, recognitionType: "학점취득", recognized: true },
      { courseName: "토질역학", category: "전공선택", credits: 3, grade: "B+", point: 3.5, retake: false, recognitionType: "학점취득", recognized: true },
    ],
    "2025-2": [
      { courseName: "상수도공학", category: "전공필수", credits: 3, grade: "B+", point: 3.5, retake: false, recognitionType: "학점취득", recognized: true },
      { courseName: "수리학Ⅰ", category: "전공필수", credits: 3, grade: "B+", point: 3.5, retake: false, recognitionType: "학점취득", recognized: true },
      { courseName: "응용역학", category: "전공필수", credits: 3, grade: "B+", point: 3.5, retake: false, recognitionType: "학점취득", recognized: true },
      { courseName: "건설재료학Ⅱ및실험", category: "전공선택", credits: 2, grade: "A+", point: 4.5, retake: false, recognitionType: "학점취득", recognized: true },
      { courseName: "재료역학및연습", category: "전공선택", credits: 2, grade: "B+", point: 3.5, retake: false, recognitionType: "학점취득", recognized: true },
      { courseName: "지반공학및실험", category: "전공선택", credits: 2, grade: "B0", point: 3.0, retake: false, recognitionType: "학점취득", recognized: true },
      { courseName: "지오매틱스공학및실습", category: "전공선택", credits: 2, grade: "B+", point: 3.5, retake: false, recognitionType: "학점취득", recognized: true },
    ],
    "2022-1": [
      { courseName: "도시의이해", category: "전공선택", credits: 2, grade: "B0", point: 3.0, retake: false, recognitionType: "학점취득", recognized: true },
      { courseName: "사회기반공학개론", category: "전공선택", credits: 2, grade: "A+", point: 4.5, retake: false, recognitionType: "학점취득", recognized: true },
      { courseName: "환경공학개론", category: "전공선택", credits: 2, grade: "C+", point: 2.5, retake: false, recognitionType: "학점취득", recognized: true },
      { courseName: "20대의 재테크", category: "교양", credits: 2, grade: "A+", point: 4.5, retake: false, recognitionType: "학점취득", recognized: true },
      { courseName: "글로벌인재", category: "교양", credits: 1, grade: "P", point: null, retake: false, recognitionType: "학점취득", recognized: true },
      { courseName: "논리적사고", category: "교양", credits: 2, grade: "B+", point: 3.5, retake: false, recognitionType: "학점취득", recognized: true },
      { courseName: "미래사회와인재", category: "교양", credits: 1, grade: "P", point: null, retake: false, recognitionType: "학점취득", recognized: true },
      { courseName: "지휘통솔", category: "교양", credits: 3, grade: "C+", point: 2.5, retake: false, recognitionType: "학점취득", recognized: true },
      { courseName: "진로탐색세미나", category: "교양", credits: 1, grade: "P", point: null, retake: false, recognitionType: "학점취득", recognized: true },
      { courseName: "컴퓨터활용", category: "교양", credits: 2, grade: "B0", point: 3.0, retake: false, recognitionType: "학점취득", recognized: true },
    ],
    "2022-2": [
      { courseName: "교통의이해", category: "전공선택", credits: 2, grade: "B+", point: 3.5, retake: false, recognitionType: "학점취득", recognized: true },
      { courseName: "스마트SOC의미래", category: "전공선택", credits: 2, grade: "A+", point: 4.5, retake: false, recognitionType: "학점취득", recognized: true },
      { courseName: "인간과환경", category: "전공선택", credits: 2, grade: "B+", point: 3.5, retake: false, recognitionType: "학점취득", recognized: true },
      { courseName: "교통사고와해결", category: "교양", credits: 3, grade: "B+", point: 3.5, retake: false, recognitionType: "학점취득", recognized: true },
      { courseName: "동계스포츠", category: "교양", credits: 1, grade: "P", point: null, retake: false, recognitionType: "학점취득", recognized: true },
      { courseName: "자동차산업의 패러다임 변화-1", category: "교양", credits: 3, grade: "B+", point: 3.5, retake: false, recognitionType: "학점취득", recognized: true },
      { courseName: "클래식음악이야기", category: "교양", credits: 2, grade: "B0", point: 3.0, retake: false, recognitionType: "학점취득", recognized: true },
      { courseName: "술의과학,문화그리고생활", category: "교양", credits: 3 , grade: "B0", point: 3.0, retake: false, recognitionType: "학점취득", recognized: true},
    ],
  };
  
  export const MOCK_TIMETABLE_BY_TERM: Record<string, TimetableEntry[]> = {
    // ✅ 2022-1 (스샷: 2022.03.02~)
    "2022-1": [
      { day: "월", start: "10:00", end: "12:00", title: "도시의이해-1", professor: "류상규", room: "W20-304", color: "violet" },
      { day: "화", start: "10:00", end: "12:00", title: "논리적사고-4", professor: "김동현", room: "E8-202", color: "emerald" },
      { day: "수", start: "10:00", end: "13:00", title: "컴퓨터활용-8", professor: "정혜선", room: "W4-305", color: "sky" },
  
      { day: "월", start: "13:00", end: "15:00", title: "환경공학개론-1", professor: "환경진", room: "E13-412", color: "sky" },
      { day: "화", start: "13:00", end: "15:00", title: "20대의 재테크-1", professor: "정기만", room: "E8-201", color: "yellow" },
      { day: "수", start: "13:00", end: "16:00", title: "지휘통솔-1", professor: "노승한", room: "E7-418", color: "orange" },
  
      { day: "화", start: "15:00", end: "17:00", title: "사회기반공학개론-3", professor: "김정환", room: "E13-423", color: "violet" },
      { day: "월", start: "16:00", end: "17:00", title: "진로탐색세미나-51", professor: "이원호", room: "E13-119", color: "emerald" },
    ],
  
    // ✅ 2022-2 (스샷: 2022.08.29~)  ※ 화면상 배치를 기준으로 자연스럽게 맞춘 버전
    "2022-2": [
      { day: "월", start: "10:00", end: "12:00", title: "동계스포츠-1", professor: "석강훈", room: "W20-406", color: "emerald" },
      { day: "화", start: "10:00", end: "12:00", title: "인간과환경-3", professor: "연익준", room: "E13-412", color: "sky" },
      { day: "수", start: "10:00", end: "12:00", title: "교통의이해-1", professor: "김용석", room: "W20-304", color: "sky" },
      { day: "목", start: "09:00", end: "12:00", title: "자동차산업의패러다임변화-1", professor: "차준표", room: "E7-106", color: "orange" },
  
      { day: "월", start: "13:00", end: "15:00", title: "스마트SOC의미래-1", professor: "김정환", room: "E13-423", color: "emerald" },
      { day: "화", start: "13:00", end: "16:00", title: "교통사고와해결-2", professor: "한성훈", room: "W5-325", color: "emerald" },
  
      { day: "월", start: "16:00", end: "18:00", title: "클래식음악이야기-2", professor: "박경환", room: "W5-110", color: "yellow" },
      { day: "금", start: "15:00", end: "18:00", title: "술의과학,문화그리고생활-1", professor: "김종은", room: "W20-304", color: "orange" },
    ],
  
    // ✅ 2025-1 (스샷: 2025.03.04~)
    "2025-1": [
      { day: "수", start: "09:00", end: "12:00", title: "지오매틱스공학및실습-1", professor: "엄대용", room: "E13-115", color: "emerald" },
      { day: "목", start: "09:00", end: "12:00", title: "재료역학및연습-1", professor: "연영모", room: "E13-115", color: "yellow" },
      { day: "금", start: "09:00", end: "12:00", title: "상수도공학-1", professor: "김주철", room: "E13-401", color: "yellow" },
  
      { day: "화", start: "10:30", end: "12:00", title: "응용역학-1", professor: "이승용", room: "E13-101", color: "emerald" },
  
      { day: "월", start: "13:30", end: "15:00", title: "응용역학-1", professor: "이승용", room: "E13-101", color: "emerald" },
      { day: "화", start: "13:30", end: "15:00", title: "수리학Ⅰ-3", professor: "장창래", room: "E13-101", color: "orange" },
      { day: "수", start: "14:30", end: "16:00", title: "수리학Ⅰ-3", professor: "장창래", room: "E13-101", color: "orange" },
  
      { day: "월", start: "15:00", end: "18:00", title: "지반공학및실험-1", professor: "이봉직", room: "E13-115", color: "sky" },
      { day: "목", start: "14:00", end: "17:00", title: "건설재료학Ⅱ및실험-3", professor: "김경태", room: "E13-119", color: "orange" },
    ],
  
    // ✅ 2025-2 (스샷: 2025.09.01~)
    "2025-2": [
      { day: "월", start: "09:00", end: "10:30", title: "기초유체역학-1", professor: "이원호", room: "E13-401", color: "emerald" },
      { day: "화", start: "09:00", end: "10:30", title: "기초유체역학-1", professor: "이원호", room: "E13-401", color: "emerald" },
  
      { day: "수", start: "09:00", end: "10:30", title: "공학수학-1", professor: "김경환", room: "E13-401", color: "yellow" },
      { day: "화", start: "10:30", end: "12:00", title: "공학수학-1", professor: "김경환", room: "E13-401", color: "yellow" },
  
      { day: "월", start: "10:30", end: "12:00", title: "토질역학-1", professor: "이봉직", room: "E13-401", color: "sky" },
      { day: "수", start: "10:30", end: "12:00", title: "토질역학-1", professor: "이봉직", room: "E13-401", color: "sky" },
  
      { day: "화", start: "13:30", end: "15:00", title: "공업역학-1", professor: "이승용", room: "E13-101", color: "orange" },
      { day: "수", start: "13:30", end: "15:00", title: "공업역학-1", professor: "이승용", room: "E13-101", color: "orange" },
  
      { day: "월", start: "14:00", end: "17:00", title: "건설재료학Ⅰ-1", professor: "김경태", room: "E13-101", color: "emerald" },
      { day: "화", start: "15:00", end: "18:00", title: "기초측량및실습-1", professor: "엄대용", room: "E13-101", color: "pink" },
      { day: "목", start: "14:00", end: "17:00", title: "건설CAD및실습-3", professor: "송용현", room: "E13-317", color: "emerald" },
    ],
  };
  
  export type FormField =
  | { label: string; type?: "text"; value: string }
  | { label: string; type: "select"; value: string; options: string[] }
  | { label: string; type: "checkbox"; checked: boolean };

  export const MOCK_ACADEMIC_BASIC_FIELDS: FormField[] = [
    { label: "입학학년도", value: "2022" },
    { label: "입학학기", value: "1학기" },
    { label: "모집시기", value: "수시모집" },
    { label: "수험번호", value: "3102057" },

    { label: "입학대학", value: "공과대학" },
    { label: "입학학과", value: "건설환경도시교통공학부" },
    { label: "입학학년", value: "1학년" },
    { label: "입학학습", value: "주간" },

    { label: "입학구분", value: "신입학" },
    { label: "입학전형", value: "일반전형" },
    { label: "정원내외", value: "정원내" },
    { label: "입학일자", value: "2022-03-02" },

    { label: "졸업학제", value: "4년제" },
    { label: "재입학년도", value: "" },
    { label: "재입학학기", value: "" },
    { label: "재입학일자", value: "" },

    { label: "졸업학년도", value: "" },
    { label: "졸업학기", value: "" },
    { label: "졸업학과", value: "" },
    { label: "졸업/수료일자", value: "" },

    { label: "증서번호", value: "" },
    { label: "학위명", value: "" },
    { label: "학위(국)", value: "" },
    { label: "학위(영)", value: "" },

    { label: "교직자격종류", value: "" },
    { label: "교직자격번호", value: "" },
    { label: "토픽급수", value: "" },
    { label: "영어시험종류/점수", value: "" },
  ];

  export const MOCK_ACADEMIC_SCHOOL_FIELDS: FormField[] = [
    { label: "고교코드", value: "J100000792" },
    { label: "고교명", value: "정왕고등학교" },
    { label: "국가", value: "대한민국" },
    { label: "고교졸업구분", type: "select", value: "졸업", options: ["졸업", "검정고시", "중퇴"] },
    { label: "고교졸업일자", value: "2022-01-01" },

    { label: "전적대학코드", value: "" },
    { label: "대학졸업구분", type: "select", value: "", options: ["", "졸업", "수료", "중퇴"] },
    { label: "대학졸업일자", value: "" },
    { label: "학과명", value: "" },
    { label: "동일계여부", type: "checkbox", checked: false },

    { label: "타대학명", value: "" },
    { label: "타대학학과명", value: "" },
    { label: "타대학학번", value: "" },
  ];
