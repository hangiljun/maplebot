import { BattlePracticeResult } from "@/lib/types"

function formatNum(n: number): string {
  if (n >= 1_000_000_000_000) return `${(n / 1_000_000_000_000).toFixed(2)}조`
  if (n >= 100_000_000)       return `${(n / 100_000_000).toFixed(2)}억`
  if (n >= 10_000)            return `${(n / 10_000).toFixed(1)}만`
  return n.toLocaleString()
}

const END_TYPE: Record<string, string> = {
  "1": "자동 종료", "2": "수동 종료", "3": "시간 초과", "9": "기타 종료",
}

export default function BattlePracticeTab({ data }: { data: BattlePracticeResult | null }) {
  if (!data) {
    return (
      <div className="text-center py-12" style={{ color: "var(--text-muted)" }}>
        <p className="text-2xl mb-3">🥊</p>
        <p className="text-sm">연무장 리플레이 기록이 없어요</p>
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>리플레이를 등록한 캐릭터만 조회할 수 있습니다</p>
      </div>
    )
  }

  const playTimeSec = Math.floor(data.total_play_time / 1000)
  const m = Math.floor(playTimeSec / 60)
  const s = playTimeSec % 60
  const timeStr = m > 0 ? `${m}분 ${s}초` : `${s}초`
  const dateStr = data.register_date ? data.register_date.split("T")[0] : "-"

  const topSkills = [...data.skill_statistic]
    .sort((a, b) => b.dps - a.dps)
    .slice(0, 5)

  const summaryItems = [
    { label: "총합 데미지", value: formatNum(data.total_damage), accent: true },
    { label: "평균 DPS",   value: formatNum(data.total_dps),    accent: true },
    { label: "연무 시간",  value: timeStr,                       accent: false },
    { label: "종료 유형",  value: END_TYPE[data.end_type] ?? data.end_type, accent: false },
    { label: "추천 수",    value: `${data.like_count}개`,        accent: false },
    { label: "기록 일시",  value: dateStr,                       accent: false },
  ]

  return (
    <div className="space-y-5">
      {/* 요약 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {summaryItems.map(({ label, value, accent }) => (
          <div key={label} className="glass rounded-xl px-4 py-3">
            <p className="text-[11px] mb-0.5" style={{ color: "var(--text-sub)" }}>{label}</p>
            <p className="text-[15px] font-bold" style={{ color: accent ? "#f97316" : "white" }}>{value}</p>
          </div>
        ))}
      </div>

      {/* 스킬 TOP 5 */}
      {topSkills.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
            스킬별 DPS TOP {topSkills.length}
          </p>
          <div className="space-y-2">
            {topSkills.map((sk, i) => {
              const pct = parseFloat(sk.damage_percent) || 0
              return (
                <div key={i} className="glass rounded-xl px-4 py-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold text-white truncate mr-2">{sk.skill_name}</span>
                    <span className="text-sm font-bold shrink-0" style={{ color: "#f97316" }}>{sk.damage_percent}%</span>
                  </div>
                  <div className="w-full rounded-full h-1.5 mb-2" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div
                      className="h-1.5 rounded-full"
                      style={{ width: `${Math.min(pct, 100)}%`, background: "#f97316" }}
                    />
                  </div>
                  <div className="flex gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
                    <span>DPS {formatNum(sk.dps)}</span>
                    <span>최대 {formatNum(sk.max_damage)}</span>
                    <span>{sk.use_count}회</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
