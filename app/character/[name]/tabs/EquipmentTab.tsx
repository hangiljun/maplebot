"use client"
import { useState, useMemo } from "react"
import { X } from "lucide-react"
import { EquipmentItem, POTENTIAL_COLORS } from "@/lib/maple"

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

function PotentialBlock({ grade, opts }: { grade: string | null | undefined; opts: (string | null | undefined)[] }) {
  const lines = opts.filter(Boolean)
  if (!lines.length || !grade) return null
  const color = POTENTIAL_COLORS[grade] ?? "#888"
  return (
    <div className="border-t border-gray-700 pt-2 mb-1">
      <p className="text-[10px] font-bold mb-1" style={{ color }}>[{grade}]</p>
      {lines.map((opt, i) => <p key={i} className="leading-snug" style={{ color }}>{opt}</p>)}
    </div>
  )
}

function ItemDetail({ item }: { item: EquipmentItem }) {
  const grade = item.potential_option_grade ?? null
  const sfNum = parseInt(item.starforce ?? "0") || 0
  const stats = Object.entries(item.item_total_option ?? {}).filter(([, v]) => v !== "0" && v !== "")

  return (
    <div className="text-[12px]">
      <div className="flex items-start gap-3 mb-3">
        {item.item_icon && (
          <img src={item.item_icon} alt={item.item_name} className="w-12 h-12 object-contain shrink-0" />
        )}
        <div>
          <p className="font-bold text-[14px] leading-tight mb-0.5"
            style={{ color: grade ? (POTENTIAL_COLORS[grade] ?? "#fff") : "#fff" }}>
            {sfNum > 0 && (
              <span className="text-yellow-400 mr-1">
                {"★".repeat(Math.min(sfNum, 5))}{sfNum > 5 ? ` ${sfNum}성` : ""}
              </span>
            )}
            {item.item_name}
          </p>
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{item.item_equipment_slot}</p>
        </div>
      </div>

      {stats.length > 0 && (
        <div className="border-t border-gray-700 pt-2 mb-2 space-y-0.5">
          {stats.map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-gray-300">{STAT_KO[k] ?? k}</span>
              <span className="text-white font-semibold">+{v}</span>
            </div>
          ))}
        </div>
      )}

      <PotentialBlock grade={item.potential_option_grade} opts={[item.potential_option_1, item.potential_option_2, item.potential_option_3]} />
      <PotentialBlock grade={item.additional_potential_option_grade} opts={[item.additional_potential_option_1, item.additional_potential_option_2, item.additional_potential_option_3]} />
    </div>
  )
}

function SlotCell({ item, col, onClick }: { item: EquipmentItem | undefined; col: number; onClick: (item: EquipmentItem) => void }) {
  const grade     = item?.potential_option_grade ?? null
  const sfNum     = parseInt(item?.starforce ?? "0") || 0
  const borderCls = grade ? (GRADE_BORDER[grade] ?? "border-gray-600") : "border-gray-600"
  const tipSide   = col >= 4 ? "right-full mr-2" : "left-full ml-2"

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

      {/* 데스크탑 hover 툴팁 */}
      {item && (
        <div className={`hidden md:group-hover:block absolute z-50 top-0 w-64 ${tipSide}`}>
          <div className="bg-[#1a1a2e] text-white rounded-xl shadow-2xl border border-gray-700 p-3">
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
              <SlotCell item={itemMap.get(slot)} col={col} onClick={setSelected} />
            </div>
          ))}
        </div>
      </div>

      {/* 모바일 + 데스크탑 클릭 모달 */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", cursor: "pointer" }}
          onPointerDown={() => setSelected(null)}>
          <div
            className="w-full sm:w-80 rounded-t-2xl sm:rounded-2xl p-5"
            style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", maxHeight: "80vh", overflowY: "auto", cursor: "default" }}
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
