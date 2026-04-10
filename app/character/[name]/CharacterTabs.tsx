"use client"
import { useState } from "react"
import {
  type CharacterBasic, type UnionInfo, type StatItem,
  type EquipmentItem, type AbilityInfo, type SymbolItem,
  type HexaCore, type HexaStat, type CodiInfo,
  MAIN_STATS, BATTLE_STATS, DETAIL_STATS, COMBAT_POWER_STAT,
} from "@/lib/maple"
import EquipmentTab from "./tabs/EquipmentTab"
import AbilityTab   from "./tabs/AbilityTab"
import UnionTab     from "./tabs/UnionTab"
import SymbolTab    from "./tabs/SymbolTab"
import HexaTab      from "./tabs/HexaTab"
import CodiTab      from "./tabs/CodiTab"

type TabCache = {
  equipment?: EquipmentItem[]
  ability?:   AbilityInfo | null
  symbols?:   SymbolItem[]
  hexaCores?: HexaCore[]
  hexaStats?: HexaStat[]
  codi?:      CodiInfo | null
}

const TABS = [
  { key: "stat",      label: "기본 정보",  lazy: false },
  { key: "equipment", label: "장비",       lazy: true  },
  { key: "ability",   label: "어빌리티",   lazy: true  },
  { key: "union",     label: "유니온",     lazy: false },
  { key: "symbol",    label: "심볼",       lazy: true  },
  { key: "hexa",      label: "헥사",       lazy: true  },
  { key: "codi",      label: "코디",       lazy: true  },
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

function TabLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-7 h-7 rounded-full border-2 border-transparent animate-spin"
        style={{ borderTopColor: "var(--blue-light)" }} />
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>불러오는 중...</p>
    </div>
  )
}

export default function CharacterTabs({
  basic, stats, union,
}: {
  basic: CharacterBasic
  stats: StatItem[]
  union: UnionInfo | null
}) {
  const [activeTab, setActiveTab] = useState("stat")
  const [tabCache, setTabCache]   = useState<TabCache>({})
  const [loading, setLoading]     = useState<string | null>(null)

  const handleTab = async (key: string, lazy: boolean) => {
    setActiveTab(key)
    if (!lazy || key in tabCache) return

    setLoading(key)
    try {
      const res = await fetch(`/api/maple/tab?name=${encodeURIComponent(basic.character_name)}&tab=${key}`)
      if (res.ok) {
        const data = await res.json()
        setTabCache(prev => ({ ...prev, ...data }))
      }
    } finally {
      setLoading(null)
    }
  }

  const combatPower = stats.find(s => s.stat_name === COMBAT_POWER_STAT)
  const isLoading   = loading === activeTab

  return (
    <div className="glass rounded-3xl overflow-hidden">
      {/* 탭 바 */}
      <div className="flex overflow-x-auto" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => handleTab(t.key, t.lazy)}
            className="flex-1 py-3.5 text-[13px] font-semibold whitespace-nowrap transition-all"
            style={{
              color:        activeTab === t.key ? "var(--blue-light)" : "var(--text-muted)",
              borderBottom: activeTab === t.key ? "2px solid var(--blue-light)" : "2px solid transparent",
              background:   activeTab === t.key ? "rgba(59,130,246,0.05)" : "transparent",
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* 콘텐츠 */}
      <div className="p-5">
        {activeTab === "stat" && (
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

        {activeTab === "equipment" && (
          isLoading ? <TabLoading /> : <EquipmentTab items={tabCache.equipment ?? []} />
        )}

        {activeTab === "ability" && (
          isLoading ? <TabLoading /> : <AbilityTab ability={tabCache.ability ?? null} />
        )}

        {activeTab === "union" && (
          <UnionTab union={union} basic={basic} />
        )}

        {activeTab === "symbol" && (
          isLoading ? <TabLoading /> : <SymbolTab symbols={tabCache.symbols ?? []} />
        )}

        {activeTab === "hexa" && (
          isLoading ? <TabLoading /> : <HexaTab hexaCores={tabCache.hexaCores ?? []} hexaStats={tabCache.hexaStats ?? []} />
        )}

        {activeTab === "codi" && (
          isLoading ? <TabLoading /> : <CodiTab codi={tabCache.codi ?? null} />
        )}
      </div>
    </div>
  )
}
