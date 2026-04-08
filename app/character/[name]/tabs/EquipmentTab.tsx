import { EquipmentItem, POTENTIAL_COLORS } from "@/lib/maple"

function StarForce({ count }: { count: string }) {
  const n = parseInt(count) || 0
  if (n === 0) return null
  return (
    <div className="flex items-center gap-0.5 mt-0.5">
      <span className="text-yellow-400 text-[10px]">{"★".repeat(Math.min(n, 25))}</span>
      {n > 10 && <span className="text-[10px] text-yellow-500 font-bold ml-0.5">{n}</span>}
    </div>
  )
}

function PotentialBadge({ grade }: { grade: string | null }) {
  if (!grade) return null
  const color = POTENTIAL_COLORS[grade] ?? "#888"
  return (
    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
      style={{ backgroundColor: color + "22", color }}>
      {grade}
    </span>
  )
}

function ItemCard({ item }: { item: EquipmentItem }) {
  const potentials = [item.potential_option_1, item.potential_option_2, item.potential_option_3].filter(Boolean)
  const additionals = [item.additional_potential_option_1, item.additional_potential_option_2, item.additional_potential_option_3].filter(Boolean)

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-3 hover:border-blue-200 hover:shadow-sm transition-all">
      <div className="flex gap-3">
        {/* 아이콘 */}
        <div className="w-12 h-12 bg-[#1a1a2e] rounded-lg flex items-center justify-center shrink-0 border border-gray-200">
          {item.item_icon
            ? <img src={item.item_icon} alt={item.item_name} className="w-10 h-10 object-contain" />
            : <span className="text-xl">🗡️</span>
          }
        </div>

        {/* 정보 */}
        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-gray-400 font-medium">{item.item_equipment_slot}</p>
          <p className="text-[13px] font-bold text-[#191F28] truncate leading-tight">{item.item_name}</p>
          <StarForce count={item.starforce} />
          <div className="flex flex-wrap gap-1 mt-1">
            <PotentialBadge grade={item.potential_option_grade} />
            {item.additional_potential_option_grade && (
              <PotentialBadge grade={item.additional_potential_option_grade} />
            )}
          </div>
        </div>
      </div>

      {/* 포텐셜 옵션 */}
      {potentials.length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-50">
          {potentials.map((opt, i) => (
            <p key={i} className="text-[11px] text-blue-600 leading-snug">{opt}</p>
          ))}
        </div>
      )}
      {additionals.length > 0 && (
        <div className="mt-1">
          {additionals.map((opt, i) => (
            <p key={i} className="text-[11px] text-purple-500 leading-snug">{opt}</p>
          ))}
        </div>
      )}
    </div>
  )
}

const SLOT_ORDER = [
  "무기", "보조무기", "엠블렘",
  "모자", "상의", "하의", "장갑", "신발", "망토", "어깨장식", "벨트",
  "얼굴장식", "눈장식", "귀고리", "반지1", "반지2", "반지3", "반지4",
  "펜던트", "펜던트2", "뱃지", "메달", "포켓 아이템", "기계 심장",
]

export default function EquipmentTab({ items }: { items: EquipmentItem[] }) {
  if (!items.length) {
    return (
      <div className="text-center py-12 text-gray-400">
        <div className="text-4xl mb-3">🗡️</div>
        <p className="text-sm">장비 정보를 불러올 수 없어요</p>
      </div>
    )
  }

  // 슬롯 순서대로 정렬
  const sorted = [...items].sort((a, b) => {
    const ai = SLOT_ORDER.indexOf(a.item_equipment_slot)
    const bi = SLOT_ORDER.indexOf(b.item_equipment_slot)
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
  })

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {sorted.map((item, i) => (
        <ItemCard key={i} item={item} />
      ))}
    </div>
  )
}
