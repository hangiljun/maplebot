import { AbilityInfo, POTENTIAL_COLORS } from "@/lib/maple"

export default function AbilityTab({ ability }: { ability: AbilityInfo | null }) {
  if (!ability) {
    return (
      <div className="text-center py-12 text-gray-400">
        <div className="text-4xl mb-3">🎯</div>
        <p className="text-sm">어빌리티 정보를 불러올 수 없어요</p>
      </div>
    )
  }

  const gradeColor = POTENTIAL_COLORS[ability.ability_grade] ?? "#6B7280"

  return (
    <div className="space-y-3">
      {/* 등급 배지 */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-bold px-3 py-1 rounded-full"
          style={{ backgroundColor: gradeColor + "22", color: gradeColor }}>
          {ability.ability_grade}
        </span>
      </div>

      {/* 어빌리티 라인 */}
      {ability.ability_info.map((line, i) => {
        const lineColor = POTENTIAL_COLORS[line.ability_grade] ?? "#6B7280"
        return (
          <div key={i}
            className="rounded-xl px-4 py-3 flex items-center gap-3"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
            <span className="text-xs font-bold w-4" style={{ color: "var(--text-muted)" }}>{i + 1}</span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0"
              style={{ backgroundColor: lineColor + "22", color: lineColor }}>
              {line.ability_grade}
            </span>
            <p className="text-sm font-medium text-white">{line.ability_value}</p>
          </div>
        )
      })}
    </div>
  )
}
