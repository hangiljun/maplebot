import { HexaCore, HexaStat } from "@/lib/maple"

const TYPE_COLOR: Record<string, string> = {
  "스킬":   "bg-orange-100 text-orange-600",
  "강화":   "bg-blue-100 text-blue-600",
  "공용":   "bg-green-100 text-green-600",
  "마스터리": "bg-purple-100 text-purple-600",
}

function HexaCoreCard({ core }: { core: HexaCore }) {
  const colorClass = TYPE_COLOR[core.hexa_core_type] ?? "bg-gray-100 text-gray-500"
  const pct = Math.min((core.hexa_core_level / 30) * 100, 100)

  return (
    <div className="bg-white border border-gray-100 rounded-xl px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${colorClass}`}>
            {core.hexa_core_type}
          </span>
          <span className="text-sm font-bold text-[#191F28] truncate">{core.hexa_core_name}</span>
        </div>
        <span className="text-sm font-black text-orange-500 ml-2 flex-shrink-0">Lv.{core.hexa_core_level}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div className="h-1.5 rounded-full bg-orange-400 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 mt-1">
        <span>{core.hexa_core_level} / 30</span>
        <span>{pct.toFixed(0)}%</span>
      </div>
    </div>
  )
}

function HexaStatCard({ stat }: { stat: HexaStat }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl px-4 py-3">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-gray-400">슬롯 {stat.slot_id}</span>
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between">
          <span className="text-sm font-bold text-[#191F28]">{stat.main_stat_name}</span>
          <span className="text-sm font-black text-orange-500">Lv.{stat.main_stat_level}</span>
        </div>
        {stat.sub_stat_name_1 && (
          <div className="flex justify-between text-xs text-gray-500">
            <span>{stat.sub_stat_name_1}</span>
            <span className="font-semibold">Lv.{stat.sub_stat_level_1}</span>
          </div>
        )}
        {stat.sub_stat_name_2 && (
          <div className="flex justify-between text-xs text-gray-500">
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
      <div className="text-center py-12 text-gray-400">
        <div className="text-4xl mb-3">💎</div>
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
    <div className="space-y-4">
      {Object.entries(grouped).map(([type, cores]) => (
        <section key={type}>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{type} 코어</h3>
          <div className="space-y-2">
            {cores.map(c => <HexaCoreCard key={c.hexa_core_name} core={c} />)}
          </div>
        </section>
      ))}

      {hexaStats.length > 0 && (
        <section>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">헥사 스탯</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {hexaStats.map(s => <HexaStatCard key={s.slot_id} stat={s} />)}
          </div>
        </section>
      )}
    </div>
  )
}
