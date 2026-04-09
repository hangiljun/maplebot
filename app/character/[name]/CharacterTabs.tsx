"use client"
import { useState } from "react"
import { CharacterData, MAIN_STATS, BATTLE_STATS, DETAIL_STATS, COMBAT_POWER_STAT, type StatItem } from "@/lib/maple"
import EquipmentTab from "./tabs/EquipmentTab"
import AbilityTab   from "./tabs/AbilityTab"
import UnionTab     from "./tabs/UnionTab"
import SymbolTab    from "./tabs/SymbolTab"
import HexaTab      from "./tabs/HexaTab"
import CodiTab      from "./tabs/CodiTab"

const TABS = [
  { key: "stat",      label: "기본 정보" },
  { key: "equipment", label: "장비" },
  { key: "ability",   label: "어빌리티" },
  { key: "union",     label: "유니온" },
  { key: "symbol",    label: "심볼" },
  { key: "hexa",      label: "헥사" },
  { key: "codi",      label: "코디" },
]

function pickStats(stats: StatItem[], keys: string[]) {
  return keys.map(k => stats.find(s => s.stat_name === k)).filter(Boolean) as StatItem[]
}

function StatGrid({ title, items }: { title: string; items: StatItem[] }) {
  if (!items.length) return null
  return (
    <section>
      <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>{title}</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {items.map(item => (
          <div key={item.stat_name} className="glass rounded-xl px-4 py-3">
            <p className="text-[11px] mb-0.5" style={{ color: "var(--text-sub)" }}>{item.stat_name}</p>
            <p className="text-[15px] font-bold text-white">{item.stat_value ?? "-"}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function CharacterTabs({ data }: { data: CharacterData }) {
  const [tab, setTab] = useState("stat")
  const { stats, equipment, ability, union } = data
  const combatPower = stats.find(s => s.stat_name === COMBAT_POWER_STAT)

  return (
    <div className="glass rounded-3xl overflow-hidden">
      {/* 탭 바 */}
      <div className="flex overflow-x-auto" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="flex-1 py-3.5 text-[13px] font-semibold whitespace-nowrap transition-all"
            style={{
              color: tab === t.key ? "var(--blue-light)" : "var(--text-muted)",
              borderBottom: tab === t.key ? "2px solid var(--blue-light)" : "2px solid transparent",
              background: tab === t.key ? "rgba(59,130,246,0.05)" : "transparent",
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* 콘텐츠 */}
      <div className="p-5">
        {tab === "stat" && (
          <div className="space-y-5">
            {combatPower?.stat_value && (
              <div className="glass rounded-xl px-5 py-4 flex items-center justify-between"
                style={{ border: "1px solid rgba(59,130,246,0.25)" }}>
                <span className="text-sm font-bold text-white">전투력</span>
                <span className="text-xl font-extrabold" style={{ color: "var(--blue-light)" }}>
                  {Number(combatPower.stat_value ?? 0).toLocaleString()}
                </span>
              </div>
            )}
            <StatGrid title="기본 능력치" items={pickStats(stats, MAIN_STATS)} />
            <StatGrid title="전투 능력치" items={pickStats(stats, BATTLE_STATS)} />
            <StatGrid title="전투 상세"   items={pickStats(stats, DETAIL_STATS)} />
          </div>
        )}
        {tab === "equipment" && <EquipmentTab items={equipment} />}
        {tab === "ability"   && <AbilityTab ability={ability} />}
        {tab === "union"     && <UnionTab union={union} basic={data.basic} />}
        {tab === "symbol"    && <SymbolTab symbols={data.symbols} />}
        {tab === "hexa"      && <HexaTab hexaCores={data.hexaCores} hexaStats={data.hexaStats} />}
        {tab === "codi"      && <CodiTab codi={data.codi} />}
      </div>
    </div>
  )
}
