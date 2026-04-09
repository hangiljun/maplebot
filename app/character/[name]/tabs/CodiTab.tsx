"use client"
import { useState } from "react"
import Image from "next/image"
import { CodiInfo, CashItem } from "@/lib/maple"

const PRESET_LABELS = ["프리셋 1", "프리셋 2", "프리셋 3"]

function CashItemCard({ item }: { item: CashItem }) {
  return (
    <div className="rounded-xl p-3 flex items-center gap-3"
      style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
      {item.cash_item_icon ? (
        <Image src={item.cash_item_icon} alt={item.cash_item_name} width={40} height={40} unoptimized
          className="object-contain flex-shrink-0 rounded-lg" />
      ) : (
        <div className="w-10 h-10 rounded-lg flex-shrink-0" style={{ background: "var(--bg-card)" }} />
      )}
      <div className="min-w-0">
        <p className="text-[11px] mb-0.5" style={{ color: "var(--text-muted)" }}>{item.cash_item_equipment_part}</p>
        <p className="text-sm font-bold text-white truncate">{item.cash_item_name}</p>
        {item.cash_item_label && (
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
            style={{ background: "rgba(96,165,250,0.15)", color: "var(--blue-light)" }}>
            {item.cash_item_label}
          </span>
        )}
      </div>
    </div>
  )
}

export default function CodiTab({ codi }: { codi: CodiInfo | null }) {
  const [preset, setPreset] = useState(0)

  if (!codi) {
    return (
      <div className="text-center py-12" style={{ color: "var(--text-muted)" }}>
        <p className="text-sm">코디 정보가 없어요</p>
      </div>
    )
  }

  const presets = [codi.preset1, codi.preset2, codi.preset3]
  const current = presets[preset]

  return (
    <div className="space-y-4">
      {/* 기본 정보 */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "헤어", value: codi.hair || "기본" },
          { label: "성형", value: codi.face || "기본" },
          { label: "피부", value: codi.skin || "기본" },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl py-3 px-3 text-center"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
            <p className="text-[10px] mb-1" style={{ color: "var(--text-muted)" }}>{label}</p>
            <p className="text-xs font-bold text-white truncate">{value}</p>
          </div>
        ))}
      </div>

      {/* 프리셋 선택 */}
      <div className="flex gap-2">
        {PRESET_LABELS.map((label, i) => (
          <button key={i} onClick={() => setPreset(i)}
            className="flex-1 py-2 text-sm font-semibold rounded-xl transition-all"
            style={{
              background: preset === i ? "var(--blue)" : "var(--bg-surface)",
              color: preset === i ? "#fff" : "var(--text-sub)",
              border: "1px solid var(--border)",
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* 코디 아이템 목록 */}
      {current.length > 0 ? (
        <div className="space-y-2">
          {current.map((item, i) => <CashItemCard key={i} item={item} />)}
        </div>
      ) : (
        <div className="text-center py-8 text-sm" style={{ color: "var(--text-muted)" }}>
          이 프리셋은 비어있어요
        </div>
      )}
    </div>
  )
}
