"use client"
import { useState } from "react"
import Image from "next/image"
import { CodiInfo, CashItem } from "@/lib/maple"

const PRESET_LABELS = ["프리셋 1", "프리셋 2", "프리셋 3"]

function CashItemCard({ item }: { item: CashItem }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-3">
      {item.cash_item_icon ? (
        <Image
          src={item.cash_item_icon}
          alt={item.cash_item_name}
          width={40}
          height={40}
          unoptimized
          className="object-contain flex-shrink-0"
        />
      ) : (
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0" />
      )}
      <div className="min-w-0">
        <p className="text-[11px] text-gray-400 mb-0.5">{item.cash_item_equipment_part}</p>
        <p className="text-sm font-bold text-[#191F28] truncate">{item.cash_item_name}</p>
        {item.cash_item_label && (
          <span className="text-[10px] bg-amber-100 text-amber-600 font-semibold px-1.5 py-0.5 rounded-full">
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
      <div className="text-center py-12 text-gray-400">
        <div className="text-4xl mb-3">👗</div>
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
          <div key={label} className="bg-[#F5F6FA] rounded-xl py-3 px-3 text-center">
            <p className="text-[10px] text-gray-400 mb-1">{label}</p>
            <p className="text-xs font-bold text-[#191F28] truncate">{value}</p>
          </div>
        ))}
      </div>

      {/* 프리셋 선택 */}
      <div className="flex gap-2">
        {PRESET_LABELS.map((label, i) => (
          <button
            key={i}
            onClick={() => setPreset(i)}
            className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-colors ${
              preset === i
                ? "bg-pink-500 text-white"
                : "bg-[#F5F6FA] text-gray-400 hover:text-gray-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 코디 아이템 목록 */}
      {current.length > 0 ? (
        <div className="space-y-2">
          {current.map((item, i) => (
            <CashItemCard key={i} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400 text-sm">이 프리셋은 비어있어요</div>
      )}
    </div>
  )
}
