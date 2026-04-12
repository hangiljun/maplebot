import { CharacterTimeline } from "@/lib/maple"
import { UserRound, Shield } from "lucide-react"

const EVENT_META = {
  nickname: {
    label: "닉네임 변경",
    Icon: UserRound,
    color: "#a78bfa",
    colorBg: "rgba(167,139,250,0.1)",
    colorBorder: "rgba(167,139,250,0.25)",
    dot: "#a78bfa",
  },
  guild: {
    label: "길드 변경",
    Icon: Shield,
    color: "#60a5fa",
    colorBg: "rgba(96,165,250,0.1)",
    colorBorder: "rgba(96,165,250,0.25)",
    dot: "#60a5fa",
  },
} as const

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
}

export default function CharacterHistoryTab({ timeline }: { timeline: CharacterTimeline }) {
  const { events, checkedFrom } = timeline

  return (
    <div className="space-y-5">

      {/* 조회 범위 안내 */}
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          조회 범위:&nbsp;
          <strong style={{ color: "var(--text-sub)" }}>{formatDate(checkedFrom)}</strong>
          &nbsp;→ 현재 (약 6개월, 2주 간격 스냅샷 기준)
        </span>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3"
          style={{ color: "var(--text-muted)" }}>
          <span style={{ fontSize: "2rem" }}>🔍</span>
          <p className="text-sm font-medium">닉네임·길드 변경 기록 없음</p>
          <p className="text-xs text-center" style={{ maxWidth: 260, lineHeight: 1.7 }}>
            최근 6개월 내에 닉네임 또는 길드 변경 이력이 발견되지 않았습니다.
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* 수직 타임라인 선 */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px"
            style={{ background: "rgba(255,255,255,0.07)" }} />

          <div className="space-y-4">
            {events.map((ev, i) => {
              const meta = EVENT_META[ev.type]
              const { Icon } = meta
              return (
                <div key={i} className="relative flex gap-4 pl-1">
                  {/* 타임라인 점 */}
                  <div className="shrink-0 flex items-start justify-center"
                    style={{ width: 38, paddingTop: 14 }}>
                    <div className="w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: meta.colorBg, border: `2px solid ${meta.dot}`, zIndex: 1 }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: meta.dot }} />
                    </div>
                  </div>

                  {/* 카드 */}
                  <div className="flex-1 min-w-0 rounded-xl px-4 py-4"
                    style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${meta.colorBorder}` }}>

                    {/* 날짜 + 뱃지 */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                        {formatDate(ev.date)}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background: meta.colorBg, color: meta.color, border: `1px solid ${meta.colorBorder}` }}>
                        <Icon size={10} />
                        {meta.label}
                      </span>
                    </div>

                    {/* From → To */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold px-2.5 py-1 rounded-lg text-sm"
                        style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        {ev.from || "없음"}
                      </span>
                      <span style={{ color: "var(--text-muted)", fontSize: 13 }}>→</span>
                      <span className="font-bold px-2.5 py-1 rounded-lg text-sm"
                        style={{ background: meta.colorBg, color: meta.color, border: `1px solid ${meta.colorBorder}` }}>
                        {ev.to || "없음"}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.15)", paddingTop: 4 }}>
        Nexon OpenAPI 날짜별 조회 기반 · 정확한 날짜는 ±1일 오차 가능
      </p>
    </div>
  )
}
