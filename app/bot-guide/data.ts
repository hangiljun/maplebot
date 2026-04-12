import { Zap, Terminal, Layers, Lock, Shield, TrendingUp, Star, Sparkles } from "lucide-react"

export const DISCORD_URL = "https://discord.com/oauth2/authorize?client_id=1491444296623325194&permissions=51200&integration_type=0&scope=bot"
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
    preview: ["투구   앱솔랩스 마기나 헬름 ★17", "상의   앱솔랩스 마기나 아머 ★17", "잠재   보스 데미지 +40% / STR +12%"],
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
    preview: ["강화 코어  파이널 어택 Lv.5", "공격 코어  아케인 에임 Lv.3", "헥사 STR +240 / DEX +180"],
  },
  {
    Icon: Sparkles, label: "코디", color: "#c084fc",
    colorBg: "rgba(168,85,247,0.1)", colorBorder: "rgba(168,85,247,0.22)",
    desc: "캐릭터가 착용 중인 캐시 아이템(외형 아이템)과 헤어·성형·피부 등 현재 외형 정보를 조회합니다.",
    tags: ["캐시 아이템", "헤어 / 성형 / 피부"],
    preview: ["머리 장식  루시드의 왕관", "눈 장식   환상의 별빛 안경", "헤어      오로라 컷"],
  },
]
