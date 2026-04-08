"use client"
import { useState } from "react"
import { CharacterData, MAIN_STATS, BATTLE_STATS, DETAIL_STATS, type StatItem } from "@/lib/maple"
import EquipmentTab from "./tabs/EquipmentTab"
import UnionTab from "./tabs/UnionTab"
import SkillTab from "./tabs/SkillTab"

const TABS = [
  { key: "stat",      label: "기본 정보" },
  { key: "equipment", label: "장비" },
  { key: "union",     label: "유니온" },
  { key: "skill",     label: "헥사 스킬" },
]

function pickStats(stats: StatItem[], keys: string[]) {
  return keys.map((k) => stats.find((s) => s.stat_name === k)).filter(Boolean) as StatItem[]
}

function StatGrid({ title, items }: { title: string; items: StatItem[] }) {
  if (!items.length) return null
  return (
    <section>
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {items.map((item) => (
          <div key={item.stat_name} className="bg-white rounded-xl px-4 py-3 border border-gray-100">
            <p className="text-[11px] text-gray-400 mb-0.5 font-medium">{item.stat_name}</p>
            <p className="text-[15px] font-bold text-[#191F28]">{item.stat_value ?? "-"}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function CharacterTabs({ data }: { data: CharacterData }) {
  const [tab, setTab] = useState("stat")
  const { stats, equipment, union, skills } = data

  return (
    <>
      {/* 탭 바 */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="flex border-b border-gray-100">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                tab === t.key
                  ? "text-[#3182F6] border-b-2 border-[#3182F6] bg-blue-50/50"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        <div className="p-4">
          {tab === "stat" && (
            <div className="space-y-5">
              <StatGrid title="기본 능력치" items={pickStats(stats, MAIN_STATS)} />
              <StatGrid title="전투 능력치" items={pickStats(stats, BATTLE_STATS)} />
              <StatGrid title="전투 상세"   items={pickStats(stats, DETAIL_STATS)} />
            </div>
          )}
          {tab === "equipment" && <EquipmentTab items={equipment} />}
          {tab === "union"     && <UnionTab union={union} />}
          {tab === "skill"     && <SkillTab skills={skills} />}
        </div>
      </div>
    </>
  )
}
