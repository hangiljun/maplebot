"use client"
import { useState, useMemo } from "react"
import { X } from "lucide-react"
import { EquipmentItem } from "@/lib/maple"

const SLOT_LAYOUT: { slot: string; col: number; row: number }[] = [
  { slot: "반지1",       col: 1, row: 1 },
  { slot: "반지2",       col: 1, row: 2 },
  { slot: "반지3",       col: 1, row: 3 },
  { slot: "반지4",       col: 1, row: 4 },
  { slot: "뱃지",        col: 1, row: 5 },
  { slot: "모자",        col: 2, row: 1 },
  { slot: "얼굴장식",    col: 2, row: 2 },
  { slot: "눈장식",      col: 2, row: 3 },
  { slot: "귀고리",      col: 2, row: 4 },
  { slot: "엠블렘",      col: 2, row: 5 },
  { slot: "보조무기",    col: 3, row: 3 },
  { slot: "어깨장식",    col: 3, row: 4 },
  { slot: "훈장",        col: 3, row: 5 },
  { slot: "무기",        col: 4, row: 1 },
  { slot: "상의",        col: 4, row: 2 },
  { slot: "하의",        col: 4, row: 3 },
  { slot: "벨트",        col: 4, row: 4 },
  { slot: "안드로이드",  col: 4, row: 5 },
  { slot: "망토",        col: 5, row: 1 },
  { slot: "신발",        col: 5, row: 2 },
  { slot: "장갑",        col: 5, row: 3 },
  { slot: "포켓 아이템", col: 5, row: 4 },
  { slot: "기계 심장",   col: 5, row: 6 },
]

const GRADE_BORDER: Record<string, string> = {
  "레전드리": "border-[#FF8C00]",
  "유니크":   "border-[#EAB308]",
  "에픽":     "border-[#A855F7]",
  "레어":     "border-[#3B82F6]",
}

const GRADE_COLOR: Record<string, string> = {
  "레전드리": "#FF8C00",
  "유니크":   "#f0c040",
  "에픽":     "#c060ff",
  "레어":     "#60a8ff",
}

const STAT_ORDER = [
  "str","dex","int","luk","max_hp","max_mp",
  "attack_power","magic_power","armor","speed","jump",
  "boss_damage","ignore_monster_armor","damage","all_stat",
  "critical_rate","critical_damage","equipment_level_decrease",
]

const STAT_KO: Record<string, string> = {
  str: "STR", dex: "DEX", int: "INT", luk: "LUK",
  max_hp: "최대 HP", max_mp: "최대 MP",
  attack_power: "공격력", magic_power: "마력",
  armor: "방어력", speed: "이동속도", jump: "점프력",
  boss_damage: "보스 데미지", ignore_monster_armor: "방어율 무시",
  critical_rate: "크리티컬 확률", critical_damage: "크리티컬 데미지",
  damage: "데미지", all_stat: "올스탯",
  equipment_level_decrease: "착용 레벨 감소",
  max_hp_rate: "최대 HP %", max_mp_rate: "최대 MP %",
}

function Divider() {
  return <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", margin: "6px 0" }} />
}

function PotentialBlock({ label, grade, opts }: {
  label: string
  grade: string | null | undefined
  opts: (string | null | undefined)[]
}) {
  const lines = opts.filter(Boolean)
  if (!lines.length || !grade) return null
  const color = GRADE_COLOR[grade] ?? "#aaa"
  return (
    <div>
      <Divider />
      <p className="text-[11px] font-bold mb-1" style={{ color }}>■ {label} : {grade}</p>
      {lines.map((opt, i) => (
        <p key={i} className="text-[11px] leading-snug" style={{ color }}>■ {opt}</p>
      ))}
    </div>
  )
}

function ItemDetail({ item }: { item: EquipmentItem }) {
  const potGrade  = item.potential_option_grade ?? null
  const addGrade  = item.additional_potential_option_grade ?? null
  const sfNum     = parseInt(item.starforce ?? "0") || 0
  const nameColor = potGrade ? (GRADE_COLOR[potGrade] ?? "#fff") : "#fff"

  const totalOpts = item.item_total_option ?? {}
  const stats = STAT_ORDER
    .filter(k => totalOpts[k] && totalOpts[k] !== "0" && totalOpts[k] !== "")
    .map(k => ({ k, v: totalOpts[k] }))
  Object.entries(totalOpts).forEach(([k, v]) => {
    if (!STAT_ORDER.includes(k) && v !== "0" && v !== "") stats.push({ k, v })
  })

  const reqLevel    = item.item_base_option?.["base_equipment_level"]
  const scrollUp    = item.scroll_upgrade
  const scrollLeft  = item.scroll_upgradeable_count
  const goldenHammer = item.golden_hammer_flag === "Y"
  const soulName    = item.soul_name
  const soulOption  = item.soul_option

  return (
    <div className="text-[12px] leading-relaxed" style={{ color: "#e0e0e0" }}>
      {sfNum > 0 && (
        <p className="text-center text-[11px] font-bold mb-1" style={{ color: "#f0c040", letterSpacing: "1px" }}>
          {"★".repeat(Math.min(sfNum, 15))}{sfNum > 15 ? `+${sfNum - 15}` : ""}
        </p>
      )}

      <div className="flex items-center gap-3 mb-2">
        {item.item_icon && (
          <img src={item.item_icon} alt={item.item_name}
            className="w-14 h-14 object-contain shrink-0"
            style={{ imageRendering: "pixelated" }} />
        )}
        <div>
          <p className="font-bold text-[13px] leading-tight" style={{ color: nameColor }}>{item.item_name}</p>
          <p className="text-[10px] mt-0.5" style={{ color: "#888" }}>{item.item_equipment_slot}</p>
          {reqLevel && <p className="text-[10px] mt-0.5" style={{ color: "#aaa" }}>요구 레벨 : {reqLevel}</p>}
        </div>
      </div>

      <Divider />

      {stats.length > 0 && (
        <div className="space-y-0.5 mb-1">
          {stats.map(({ k, v }) => (
            <div key={k} className="flex justify-between gap-4">
              <span style={{ color: "#ccc" }}>{STAT_KO[k] ?? k}</span>
              <span style={{ color: "#fff", fontWeight: 600 }}>+{v}</span>
            </div>
          ))}
        </div>
      )}

      {(scrollUp !== undefined || scrollLeft !== undefined) && (
        <>
          <Divider />
          <p className="text-[11px]" style={{ color: scrollLeft === "0" ? "#666" : "#aaa" }}>
            {scrollLeft === "0"
              ? "주문서 강화 불가"
              : `주문서 강화 +${scrollUp ?? 0} (남은 횟수: ${scrollLeft}${goldenHammer ? ", 황금망치" : ""})`}
          </p>
        </>
      )}

      {soulName && (
        <>
          <Divider />
          <p className="text-[11px] font-bold" style={{ color: "#a0c8ff" }}>{soulName}</p>
          {soulOption && <p className="text-[11px]" style={{ color: "#a0c8ff" }}>{soulOption}</p>}
        </>
      )}

      <PotentialBlock label="잠재능력" grade={potGrade}
        opts={[item.potential_option_1, item.potential_option_2, item.potential_option_3]} />
      <PotentialBlock label="에디셔널 잠재능력" grade={addGrade}
        opts={[item.additional_potential_option_1, item.additional_potential_option_2, item.additional_potential_option_3]} />
    </div>
  )
}

function SlotCell({ item, col, row, onClick }: {
  item: EquipmentItem | undefined
  col: number
  row: number
  onClick: (item: EquipmentItem) => void
}) {
  const grade     = item?.potential_option_grade ?? null
  const sfNum     = parseInt(item?.starforce ?? "0") || 0
  const borderCls = grade ? (GRADE_BORDER[grade] ?? "border-gray-600") : "border-gray-600"
  const tipSide   = col >= 4 ? "right-full mr-2" : "left-full ml-2"
  const tipVert   = row >= 4 ? "bottom-0" : "top-0"

  return (
    <div className="relative group flex items-center justify-center">
      <div
        onClick={() => item && onClick(item)}
        className={`w-[52px] h-[52px] rounded-lg border-2 flex items-center justify-center bg-[#12122a] transition-all ${item ? borderCls + " hover:brightness-110 cursor-pointer" : "border-gray-700 opacity-40 cursor-default"}`}>
        {item ? (
          <>
            {item.item_icon
              ? <img src={item.item_icon} alt={item.item_name} className="w-10 h-10 object-contain" />
              : <span className="text-xl">🗡️</span>}
            {sfNum > 0 && (
              <span className="absolute -top-1.5 -right-1 bg-yellow-400 text-[#111] text-[9px] font-extrabold px-1 rounded-full leading-tight">{sfNum}</span>
            )}
          </>
        ) : (
          <span className="text-gray-600 text-xs">–</span>
        )}
      </div>

      {item && (
        <div className={`hidden md:group-hover:block absolute z-50 ${tipVert} w-72 ${tipSide}`}>
          <div className="text-white rounded-xl shadow-2xl p-3" style={{ background: "#1a1422", border: "1px solid rgba(255,255,255,0.15)" }}>
            <ItemDetail item={item} />
          </div>
        </div>
      )}
    </div>
  )
}

export default function EquipmentTab({ items }: { items: EquipmentItem[] }) {
  const [selected, setSelected] = useState<EquipmentItem | null>(null)
  const itemMap = useMemo(() => new Map(items.map(it => [it.item_equipment_slot, it])), [items])

  if (!items.length) {
    return <div className="text-center py-12 text-sm" style={{ color: "var(--text-muted)" }}>장비 정보를 불러올 수 없어요</div>
  }

  return (
    <>
      <div className="flex justify-center">
        <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(5, 52px)", gridTemplateRows: "repeat(6, 52px)" }}>
          {SLOT_LAYOUT.map(({ slot, col, row }) => (
            <div key={slot} style={{ gridColumn: col, gridRow: row }}>
              <SlotCell item={itemMap.get(slot)} col={col} row={row} onClick={setSelected} />
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", cursor: "pointer" }}
          onPointerDown={() => setSelected(null)}>
          <div
            className="w-full sm:w-80 rounded-t-2xl sm:rounded-2xl p-5"
            style={{ background: "#1a1422", border: "1px solid rgba(255,255,255,0.15)", maxHeight: "80vh", overflowY: "auto", cursor: "default" }}
            onPointerDown={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>장비 정보</p>
              <button onClick={() => setSelected(null)} style={{ color: "var(--text-muted)" }}>
                <X size={16} />
              </button>
            </div>
            <ItemDetail item={selected} />
          </div>
        </div>
      )}
    </>
  )
}
