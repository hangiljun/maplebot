import { Zap, Terminal, Layers, Lock, Shield, TrendingUp, Star, Sparkles, Clock } from "lucide-react"
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
    desc: "캐릭터가 착용 중인 모든 장비를 확인합니다. 스타포스 강화 수치, 잠재능력, 에디셔널 잠재능력까지 상세하게 표시됩니다.",
    tags: ["장비 목록", "잠재능력", "에디셔널 잠재", "스타포스"],
    preview: ["노리개  빛나는 사욱 노리개", "잠재   몬스터 방무율 무시 +40% (레전드리)", "에디셔널  마력 +9% / 보스 데미지 +40% (유니크)"],
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
]
