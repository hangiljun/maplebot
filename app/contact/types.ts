export type Priority = "high" | "medium" | "low"
export type Status   = "reviewing" | "planned" | "in-progress" | "done"

export type Request = {
  id: string
  title: string
  description: string | null
  nickname: string
  priority: Priority
  status: Status
  createdAt: string
}

export const PRIORITY_META: Record<Priority, { text: string; color: string; bg: string; border: string }> = {
  high:   { text: "높음", color: "#f87171", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.25)"   },
  medium: { text: "보통", color: "#fb923c", bg: "rgba(251,146,60,0.1)",  border: "rgba(251,146,60,0.25)"  },
  low:    { text: "낮음", color: "#60a5fa", bg: "rgba(96,165,250,0.1)",  border: "rgba(96,165,250,0.25)"  },
}

export const STATUS_META: Record<Status, { text: string; color: string; bg: string; border: string }> = {
  reviewing:    { text: "검토중", color: "#9ca3af", bg: "rgba(156,163,175,0.1)", border: "rgba(156,163,175,0.2)" },
  planned:      { text: "예정",   color: "#818cf8", bg: "rgba(129,140,248,0.1)", border: "rgba(129,140,248,0.2)" },
  "in-progress":{ text: "진행중", color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.2)"  },
  done:         { text: "완료",   color: "#4ade80", bg: "rgba(74,222,128,0.1)",   border: "rgba(74,222,128,0.2)"  },
}

export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })
}
