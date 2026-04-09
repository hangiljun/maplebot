import { HexaCore, HexaStat } from "@/lib/maple"

const TYPE_COLOR: Record<string, { bg: string; text: string }> = {
  "스킬":     { bg: "rgba(249,115,22,0.15)", text: "#f97316" },
  "강화":     { bg: "rgba(59,130,246,0.15)", text: "#60a5fa" },
  "공용":     { bg: "rgba(34,197,94,0.15)",  text: "#4ade80" },
  "마스터리": { bg: "rgba(168,85,247,0.15)", text: "#c084fc" },
}

function HexaCoreCard({ core }: { core: HexaCore }) {
  const color = TYPE_COLOR[core.hexa_core_type] ?? { bg: "rgba(255,255,255,0.06)", text: "var(--text-muted)" }
  const pct = Math.min((core.hexa_core_level / 30) * 100, 100)

  return (
    <div className="rounded-xl px-4 py-3" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ background: color.bg, color: color.text }}>
            {core.hexa_core_type}
          </span>
          <span className="text-sm font-bold text-white truncate">{core.hexa_core_name}</span>
        </div>
        <span className="text-sm font-black ml-2 flex-shrink-0" style={{ color: "#f97316" }}>
          Lv.{core.hexa_core_level}
        </span>
      </div>
      <div className="w-full rounded-full h-1.5" style={{ background: "var(--bg-card)" }}>
        <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, background: "#f97316" }} />
      </div>
      <div className="flex justify-between text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>
        <span>{core.hexa_core_level} / 30</span>
        <span>{pct.toFixed(0)}%</span>
      </div>
    </div>
  )
}

function HexaStatCard({ stat }: { stat: HexaStat }) {
  return (
    <div className="rounded-xl px-4 py-3" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
      <p className="text-[10px] mb-2" style={{ color: "var(--text-muted)" }}>슬롯 {stat.slot_id}</p>
      <div className="space-y-1.5">
        <div className="flex justify-between">
          <span className="text-sm font-bold text-white">{stat.main_stat_name}</span>
          <span className="text-sm font-black" style={{ color: "#f97316" }}>Lv.{stat.main_stat_level}</span>
        </div>
        {stat.sub_stat_name_1 && (
          <div className="flex justify-between text-xs" style={{ color: "var(--text-sub)" }}>
            <span>{stat.sub_stat_name_1}</span>
            <span className="font-semibold">Lv.{stat.sub_stat_level_1}</span>
          </div>
        )}
        {stat.sub_stat_name_2 && (
          <div className="flex justify-between text-xs" style={{ color: "var(--text-sub)" }}>
            <span>{stat.sub_stat_name_2}</span>
            <span className="font-semibold">Lv.{stat.sub_stat_level_2}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function HexaTab({ hexaCores, hexaStats }: { hexaCores: HexaCore[]; hexaStats: HexaStat[] }) {
  if (!hexaCores.length && !hexaStats.length) {
    return (
      <div className="text-center py-12" style={{ color: "var(--text-muted)" }}>
        <p className="text-sm">헥사 정보가 없어요</p>
      </div>
    )
  }

  const grouped = hexaCores.reduce<Record<string, HexaCore[]>>((acc, c) => {
    const t = c.hexa_core_type || "기타"
    if (!acc[t]) acc[t] = []
    acc[t].push(c)
    return acc
  }, {})

  return (
    <div className="space-y-5">
      {Object.entries(grouped).map(([type, cores]) => (
        <section key={type}>
          <h3 className="text-[10px] font-bold uppercase tracking-widest mb-2"
            style={{ color: TYPE_COLOR[type]?.text ?? "var(--text-muted)" }}>
            {type} 코어
          </h3>
          <div className="space-y-2">
            {cores.map(c => <HexaCoreCard key={c.hexa_core_name} core={c} />)}
          </div>
        </section>
      ))}

      {hexaStats.length > 0 && (
        <section>
          <h3 className="text-[10px] font-bold uppercase tracking-widest mb-2"
            style={{ color: "var(--text-muted)" }}>헥사 스탯</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {hexaStats.map(s => <HexaStatCard key={s.slot_id} stat={s} />)}
          </div>
        </section>
      )}
    </div>
  )
}
