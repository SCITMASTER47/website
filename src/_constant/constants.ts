import { Book, Certification, WeekDay } from "@/_types/schedule";
export const books: Book[] = [
  {
    id: "book1",
    certificate_id: "1",
    title: "일본어 능력시험 N1 공식 문제집1",
    company_name: "JLPT 위원회",
  },
  {
    id: "book2",
    certificate_id: "1",
    title: "일본어 능력시험 N1 공식 문제집2",
    company_name: "JLPT 위원회",
  },
  {
    id: "book3",
    certificate_id: "1",
    title: "일본어 능력시험 N1 공식 문제집3",
    company_name: "JLPT 위원회",
  },
  {
    id: "book4",
    certificate_id: "1",
    title: "일본어 능력시험 N1 공식 문제집4",
    company_name: "JLPT 위원회",
  },
  {
    id: "book5",
    certificate_id: "jlpt-n1",
    title: "일본어 능력시험 N1 공식 문제집5",
    company_name: "JLPT 위원회",
  },
  {
    id: "book6",
    certificate_id: "jlpt-n1",
    title: "일본어 능력시험 N1 공식 문제집6",
    company_name: "JLPT 위원회",
  },
  {
    id: "book7",
    certificate_id: "jlpt-n1",
    title: "N1 한권으로 끝내기7",
    company_name: "김일본",
  },
  {
    id: "book8",
    certificate_id: "jlpt-n2",
    title: "일본어 능력시험 N2 공식 문제집",
    company_name: "JLPT 위원회",
  },
  {
    id: "book9",
    certificate_id: "info-processing",
    title: "정보처리기사 실전 문제집",
    company_name: "정보처리연구소",
  },
];

export const certifications: Certification[] = [
  {
    id: "jlpt-n1",
    title: "JLPT N1",
    subjects: [
      { id: "1", name: "문자·어휘" },
      { id: "2", name: "문법" },
      { id: "3", name: "독해" },
      { id: "4", name: "청해" },
    ],
    description:
      "JLPT N1은 일본어 능력 시험의 최상위 등급으로, 고급 일본어 능력을 평가합니다. 이 시험은 복잡한 문법 구조와 고급 어휘를 이해하고 사용할 수 있는 능력을 측정하며, 비즈니스 및 학술적 상황에서의 일본어 활용 능력을 요구합니다.",
  },
  {
    id: "jlpt-n2",
    title: "JLPT N2",
    subjects: [
      { id: "1", name: "문자·어휘" },
      { id: "2", name: "문법" },
      { id: "3", name: "독해" },
      { id: "4", name: "청해" },
    ],
    description:
      "JLPT N2는 일본어 능력 시험의 두 번째 수준으로, 중급 일본어 능력을 평가합니다. 이 시험은 일상적인 상황에서의 일본어 이해 및 사용 능력을 측정하며, 비즈니스 및 학술적 상황에서도 활용할 수 있는 능력을 요구합니다.",
  },
  {
    id: "jpt",
    title: "JPT (일본어 능력 시험)",
    subjects: [
      { id: "1", name: "청해" },
      { id: "2", name: "청독해" },
      { id: "3", name: "독해" },
    ],
    description:
      "JPT는 일본어 능력 시험의 하나로, 주로 비즈니스 상황에서의 일본어 능력을 평가합니다. 이 시험은 듣기, 읽기, 문법 등의 영역에서 일본어 능력을 종합적으로 측정합니다.",
  },
  {
    id: "info-processing",
    title: "정보처리기사",
    subjects: [
      { id: "1", name: "소프트웨어 설계" },
      { id: "2", name: "소프트웨어 개발" },
      { id: "3", name: "데이터베이스 구축" },
      { id: "4", name: "프로그래밍 언어 활용" },
      { id: "5", name: "정보시스템 구축관리" },
    ],
    description:
      "정보처리기사는 IT 분야의 전문 자격증으로, 정보 시스템의 설계, 개발, 운영 및 관리에 대한 지식을 평가합니다. 이 시험은 소프트웨어 개발, 데이터베이스 구축, 네트워크 관리 등 다양한 분야의 지식을 요구합니다.",
  },
];

export const timeSlots = [
  { id: "morning", label: "오전 (6-12시)", value: "morning" },
  { id: "afternoon", label: "오후 (12-18시)", value: "afternoon" },
  { id: "evening", label: "저녁 (18-24시)", value: "evening" },
];

export const weekdays: WeekDay[] = [
  { id: "MON", label: "월요일", value: "MON" },
  { id: "TUE", label: "화요일", value: "TUE" },
  { id: "WED", label: "수요일", value: "WED" },
  { id: "THU", label: "목요일", value: "THU" },
  { id: "FRI", label: "금요일", value: "FRI" },
  { id: "SAT", label: "토요일", value: "SAT" },
  { id: "SUN", label: "일요일", value: "SUN" },
];
