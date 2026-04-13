import { Zap, Terminal, Layers, Lock, Shield, TrendingUp, Star, Sparkles, Clock, Swords, Link2, Trophy } from "lucide-react"
export { DISCORD_URL } from "@/lib/constants"
export const M = { red: "#e84040", orange: "#f5832e", gold: "#fbbf24" }

export const SECTIONS = [
  { id: "start",       label: "시작하기",    Icon: Zap      },
  { id: "command",     label: "명령어",      Icon: Terminal },
  { id: "features",    label: "버튼 기능",   Icon: Layers   },
  { id: "permissions", label: "권한 / 보안", Icon: Lock     },
]

export type FeatureItem = {
  Icon: React.ElementType
  label: string
  color: string
  colorBg: string
  colorBorder: string
  desc: string
  tags: string[]
  preview: string[]
}

export const FEATURES: FeatureItem[] = [
  {
    Icon: Shield, label: "장비 보기", color: "#60a5fa",
    colorBg: "rgba(59,130,246,0.1)", colorBorder: "rgba(59,130,246,0.22)",
    desc: "캐릭터가 착용 중인 모든 장비를 확인합니다. 스타포스, 잠재능력, 에디셔널 잠재능력이 표시되며, 하단 드롭다운으로 아이템을 선택하면 스탯·소울·스크롤 정보까지 상세하게 조회됩니다.",
    tags: ["장비 목록", "잠재능력", "에디셔널 잠재", "스타포스", "아이템 상세"],
    preview: ["노리개  빛나는 사욱 노리개  ★22", "잠재   방무율 무시 +40% (레전드리)", "▼ 아이템 선택 시 스탯·소울·스크롤 상세 표시"],
  },
  {
    Icon: TrendingUp, label: "레벨 변동", color: "#4ade80",
    colorBg: "rgba(34,197,94,0.1)", colorBorder: "rgba(34,197,94,0.22)",
    desc: "최근 경험치 획득량과 레벨업 히스토리를 날짜별로 확인합니다. 성장 추이를 한눈에 파악할 수 있습니다.",
    tags: ["경험치 히스토리", "레벨업 기록"],
    preview: ["04/12  Lv.280 → 281 달성", "04/11  경험치 +3.21%", "04/10  경험치 +2.87%"],
  },
  {
    Icon: Star, label: "헥사", color: "#facc15",
    colorBg: "rgba(234,179,8,0.1)", colorBorder: "rgba(234,179,8,0.22)",
    desc: "6차 직업 강화 시스템인 헥사 코어의 레벨 현황과 헥사 스탯 수치를 확인합니다.",
    tags: ["헥사 코어 레벨", "헥사 스탯"],
    preview: ["스킬 코어  새록새록 꽃누리 Lv.1/30", "강화 코어  큰 기지개 Lv.1/30", "헥사 스탯  주력 스탯 증가 Lv.4"],
  },
  {
    Icon: Sparkles, label: "코디", color: "#c084fc",
    colorBg: "rgba(168,85,247,0.1)", colorBorder: "rgba(168,85,247,0.22)",
    desc: "캐릭터가 착용 중인 캐시 아이템(외형 아이템)과 헤어·성형·피부 등 현재 외형 정보를 조회합니다.",
    tags: ["캐시 아이템", "헤어 / 성형 / 피부"],
    preview: ["머리 장식  (착용 중인 캐시 아이템)", "헤어      (현재 헤어 스타일)", "피부      (현재 피부 색상)"],
  },
  {
    Icon: Clock, label: "캐릭터 역사", color: "#f472b6",
    colorBg: "rgba(244,114,182,0.1)", colorBorder: "rgba(244,114,182,0.22)",
    desc: "최근 6개월 내 닉네임 변경·길드 가입 및 탈퇴 이력을 날짜와 함께 조회합니다. Nexon OpenAPI 날짜별 조회를 이진 탐색으로 분석합니다.",
    tags: ["닉네임 변경", "길드 변경", "6개월 이력"],
    preview: ["🏷️ 닉네임 변경  2025.03.12  구닉 → 렌캔디", "🏰 길드 변경    2025.01.08  없음 → 라아", "※ Nexon OpenAPI 출시(2023.12) 이후 기록만 조회 가능"],
  },
  {
    Icon: Swords, label: "연무장", color: "#f97316",
    colorBg: "rgba(249,115,22,0.1)", colorBorder: "rgba(249,115,22,0.22)",
    desc: "리플레이를 등록한 캐릭터의 연무장 DPS 측정 결과를 조회합니다. 총합 데미지·평균 DPS·연무 시간과 함께 스킬별 DPS TOP 5를 분석해 보여줍니다.",
    tags: ["총합 데미지", "평균 DPS", "스킬 TOP 5", "리플레이 기록"],
    preview: ["총합 데미지  125.43조  평균 DPS  8.92조", "1위 파이널 어택  32.1%  DPS 2.86조", "2위 레이징 블로우  18.4%  DPS 1.64조"],
  },
]

export const LINK_FEATURES = [
  { icon: "🔍", text: "직업명 완전 일치 → 전 레벨 효과 한눈에 표시" },
  { icon: "🔑", text: "키워드 검색 → 조건에 맞는 모든 링크 스킬 목록" },
  { icon: "🔢", text: "Lv.1(Lv.70) / Lv.2(Lv.120) / Lv.3(Lv.285) 버튼 전환" },
]

export const UNION_FEATURES = [
  { icon: "🏆", text: "직업군 입력 (예: 모험가, 시그너스) → 세부 직업 버튼 탐색" },
  { icon: "⚔️", text: "직업 계열 입력 (예: 전사, 마법사) → 해당 직업군 선택 후 탐색" },
  { icon: "🔍", text: "직업명 완전 일치 → 전 등급(B~SSS) 효과 한눈에 표시" },
  { icon: "🔑", text: "키워드 검색 → B / A / S / SS / SSS 등급 버튼 전환" },
]
