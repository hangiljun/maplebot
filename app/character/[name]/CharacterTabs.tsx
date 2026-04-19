"use client"
import { useState, useCallback, useMemo, useRef, useEffect } from "react"
import {
  type CharacterBasic, type UnionInfo, type StatItem,
  type EquipmentItem, type AbilityInfo, type SymbolItem,
  type HexaCore, type HexaStat, type CodiInfo, type CharacterTimeline,
  type BattlePracticeResult,
  MAIN_STATS, BATTLE_STATS, DETAIL_STATS, COMBAT_POWER_STAT,
  POTENTIAL_COLORS,
} from "@/lib/maple"
import EquipmentTab        from "./tabs/EquipmentTab"
import UnionTab            from "./tabs/UnionTab"
import SymbolTab           from "./tabs/SymbolTab"
import HexaTab             from "./tabs/HexaTab"
import CodiTab             from "./tabs/CodiTab"
import CharacterHistoryTab from "./tabs/CharacterHistoryTab"
import BattlePracticeTab   from "./tabs/BattlePracticeTab"

type TabCache = {
  equipment?:      EquipmentItem[]
  ability?:        AbilityInfo | null
  symbols?:        SymbolItem[]
  hexaCores?:      HexaCore[]
  hexaStats?:      HexaStat[]
  codi?:           CodiInfo | null
  charhistory?:    CharacterTimeline
  battlepractice?: BattlePracticeResult | null
}

const TABS = [
  { key: "stat",           label: "기본 정보",  lazy: false },
  { key: "equipment",      label: "장비",       lazy: true  },
  { key: "battlepractice", label: "연무장",     lazy: true  },
  { key: "union",          label: "유니온",     lazy: false },
  { key: "symbol",         label: "심볼",       lazy: true  },
  { key: "hexa",           label: "헥사",       lazy: true  },
  { key: "codi",           label: "코디",       lazy: true  },
  { key: "charhistory",    label: "캐릭터 역사", lazy: true  },
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
  const abortRef                  = useRef<AbortController | null>(null)
  const tabCacheRef               = useRef<TabCache>({})
  tabCacheRef.current = tabCache

  const handleTab = useCallback(async (key: string, lazy: boolean) => {
    setActiveTab(key)
    if (!lazy || key in tabCacheRef.current) return

    abortRef.current?.abort()
    abortRef.current = new AbortController()

    setLoading(key)
    try {
      const res = await fetch(
        `/api/maple/tab?name=${encodeURIComponent(basic.character_name)}&tab=${key}`,
        { signal: abortRef.current.signal },
      )
      if (res.ok) {
        const data = await res.json()
        setTabCache(prev => ({ ...prev, ...data }))
      }
    } catch (e: unknown) {
      if ((e as Error).name !== "AbortError") console.error(e)
    } finally {
      setLoading(null)
    }
  }, [basic.character_name])

  // 페이지 로드와 동시에 히스토리 백그라운드 prefetch
  useEffect(() => {
    const ctrl = new AbortController()
    fetch(`/api/maple/tab?name=${encodeURIComponent(basic.character_name)}&tab=charhistory`, { signal: ctrl.signal })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setTabCache(prev => ({ ...prev, ...data })) })
      .catch(() => {})
    return () => ctrl.abort()
  }, [basic.character_name])

  const combatPower = useMemo(() => stats.find(s => s.stat_name === COMBAT_POWER_STAT), [stats])
  const mainStats   = useMemo(() => pickStats(stats, MAIN_STATS),   [stats])
  const battleStats = useMemo(() => pickStats(stats, BATTLE_STATS), [stats])
  const detailStats = useMemo(() => pickStats(stats, DETAIL_STATS), [stats])
  const isLoading   = loading === activeTab

  // 기본정보 탭 클릭 시 어빌리티도 함께 로드
  const handleStatTab = useCallback(async () => {
    setActiveTab("stat")
    if ("ability" in tabCacheRef.current) return
    abortRef.current?.abort()
    abortRef.current = new AbortController()
    setLoading("stat")
    try {
      const res = await fetch(
        `/api/maple/tab?name=${encodeURIComponent(basic.character_name)}&tab=ability`,
        { signal: abortRef.current.signal },
      )
      if (res.ok) {
        const data = await res.json()
        setTabCache(prev => ({ ...prev, ...data }))
      }
    } catch (e: unknown) {
      if ((e as Error).name !== "AbortError") console.error(e)
    } finally {
      setLoading(null)
    }
  }, [basic.character_name])

  return (
    <div className="glass rounded-3xl overflow-hidden">
      {/* 탭 바 */}
      <div className="flex overflow-x-auto" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => t.key === "stat" ? handleStatTab() : handleTab(t.key, t.lazy)}
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

      {/* 콘텐츠 — minHeight 로 탭 영역을 충분히 확보, 페이지 스크롤 자연 발생 */}
      <div className="p-6" style={{ minHeight: "520px" }}>
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
            <StatGrid title="기본 능력치" items={mainStats} />
            <StatGrid title="전투 능력치" items={battleStats} />
            <StatGrid title="전투 상세"   items={detailStats} />

            {/* 어빌리티 인라인 */}
            {"ability" in tabCache ? (
              tabCache.ability && (
                <section>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>어빌리티</p>
                  <div className="space-y-2">
                    <div className="mb-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: (POTENTIAL_COLORS[tabCache.ability.ability_grade] ?? "#6B7280") + "22",
                          color: POTENTIAL_COLORS[tabCache.ability.ability_grade] ?? "#6B7280",
                        }}>
                        {tabCache.ability.ability_grade}
                      </span>
                    </div>
                    {tabCache.ability.ability_info.map((line, i) => {
                      const lineColor = POTENTIAL_COLORS[line.ability_grade] ?? "#6B7280"
                      return (
                        <div key={i} className="glass rounded-xl px-4 py-3 flex items-center gap-3"
                          style={{ border: "1px solid var(--border)" }}>
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
                </section>
              )
            ) : (
              loading === "stat" && (
                <section>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>어빌리티</p>
                  <TabLoading />
                </section>
              )
            )}
          </div>
        )}

        {activeTab === "equipment" && (
          isLoading ? <TabLoading /> : <EquipmentTab items={tabCache.equipment ?? []} />
        )}

        {activeTab === "battlepractice" && (
          isLoading ? <TabLoading /> : <BattlePracticeTab data={tabCache.battlepractice ?? null} />
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

        {activeTab === "charhistory" && (
          isLoading
            ? <TabLoading />
            : tabCache.charhistory
              ? <CharacterHistoryTab timeline={tabCache.charhistory} />
              : <TabLoading />
        )}
      </div>
    </div>
  )
}
