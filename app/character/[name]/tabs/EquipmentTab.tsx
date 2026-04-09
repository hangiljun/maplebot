"use client"
import { EquipmentItem, POTENTIAL_COLORS } from "@/lib/maple"

const STAT_KO: Record<string, string> = {
  str: "STR", dex: "DEX", int: "INT", luk: "LUK",
  max_hp: "최대 HP", max_mp: "최대 MP",
  attack_power: "공격력", magic_power: "마력",
  armor: "방어력", speed: "이동속도", jump: "점프력",
  boss_damage: "보스 데미지",
  ignore_monster_armor: "방어율 무시",
  critical_rate: "크리티컬 확률",
  critical_damage: "크리티컬 데미지",
  damage: "데미지", all_stat: "올스탯",
  equipment_level_decrease: "착용 레벨 감소",
  max_hp_rate: "최대 HP %", max_mp_rate: "최대 MP %",
}

// ── 슬롯 그리드 레이아웃 정의 (col 1-5, row 1-6) ──────────────
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

// ── 호버 툴팁 ─────────────────────────────────────────────────
function Tooltip({ item }: { item: EquipmentItem }) {
  const sf   = parseInt(item.starforce) || 0
  const pColor = item.potential_option_grade
    ? (POTENTIAL_COLORS[item.potential_option_grade] ?? "#888")
    : null
  const apColor = item.additional_potential_option_grade
    ? (POTENTIAL_COLORS[item.additional_potential_option_grade] ?? "#888")
    : null

  // 총 옵션 중 0이 아닌 것만
  const totalStats = Object.entries(item.item_total_option ?? {}).filter(
    ([, v]) => v !== "0" && v !== "" && v != null
  )

  const potentials  = [item.potential_option_1, item.potential_option_2, item.potential_option_3].filter(Boolean)
  const additionals = [item.additional_potential_option_1, item.additional_potential_option_2, item.additional_potential_option_3].filter(Boolean)

  return (
    <div className="
      absolute z-50 left-full top-0 ml-2
      w-64 bg-[#1a1a2e] text-white rounded-xl shadow-2xl
      border border-gray-700 p-3 text-[12px]
      pointer-events-none
    ">
      {/* 아이템 이름 */}
      <p className="font-bold text-[13px] leading-tight mb-1"
        style={{ color: pColor ?? "#ffffff" }}>
        {sf > 0 && <span className="text-yellow-400 mr-1">{"★".repeat(Math.min(sf, 5))}{sf > 5 ? ` ${sf}성` : ""}</span>}
        {item.item_name}
      </p>
      <p className="text-gray-400 text-[11px] mb-2">{item.item_equipment_slot}</p>

      {/* 총 옵션 */}
      {totalStats.length > 0 && (
        <div className="border-t border-gray-700 pt-2 mb-2 space-y-0.5">
          {totalStats.map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-gray-300">{k}</span>
              <span className="text-white font-semibold">+{v}</span>
            </div>
          ))}
        </div>
      )}

      {/* 잠재옵션 */}
      {potentials.length > 0 && (
        <div className="border-t border-gray-700 pt-2 mb-1">
          <p className="text-[10px] font-bold mb-1" style={{ color: pColor ?? "#888" }}>
            [{item.potential_option_grade}]
          </p>
          {potentials.map((opt, i) => (
            <p key={i} className="leading-snug" style={{ color: pColor ?? "#aaa" }}>{opt}</p>
          ))}
        </div>
      )}

      {/* 에디셔널 잠재옵션 */}
      {additionals.length > 0 && (
        <div className="border-t border-gray-700 pt-2">
          <p className="text-[10px] font-bold mb-1" style={{ color: apColor ?? "#888" }}>
            [{item.additional_potential_option_grade}]
          </p>
          {additionals.map((opt, i) => (
            <p key={i} className="leading-snug" style={{ color: apColor ?? "#aaa" }}>{opt}</p>
          ))}
        </div>
      )}
    </div>
  )
}

// ── 슬롯 셀 ────────────────────────────────────────────────────
function SlotCell({ item, col }: { item: EquipmentItem | undefined; col: number }) {
  const grade    = item?.potential_option_grade ?? null
  const sfNum    = parseInt(item?.starforce ?? "0") || 0
  const borderCls = grade ? GRADE_BORDER[grade] ?? "border-gray-600" : "border-gray-600"

  // 오른쪽 컬럼(4,5)이면 툴팁을 왼쪽으로
  const tooltipSide = col >= 4
    ? "right-full left-auto mr-2 ml-0"
    : "left-full ml-2"

  return (
    <div className="relative group flex items-center justify-center">
      <div className={`
        w-[52px] h-[52px] rounded-lg border-2 flex items-center justify-center
        bg-[#12122a] cursor-default transition-all
        ${item ? borderCls + " hover:brightness-110" : "border-gray-700 opacity-40"}
      `}>
        {item ? (
          <>
            {item.item_icon
              ? <img src={item.item_icon} alt={item.item_name} className="w-10 h-10 object-contain" />
              : <span className="text-xl">🗡️</span>
            }
            {sfNum > 0 && (
              <span className="absolute -top-1.5 -right-1 bg-yellow-400 text-[#111] text-[9px] font-extrabold px-1 rounded-full leading-tight">
                {sfNum}
              </span>
            )}
          </>
        ) : (
          <span className="text-gray-600 text-xs">–</span>
        )}
      </div>

      {/* 호버 툴팁 */}
      {item && (
        <div className={`
          hidden group-hover:block
          absolute z-50 top-0
          w-64
          ${tooltipSide}
        `}>
          <div className="bg-[#1a1a2e] text-white rounded-xl shadow-2xl border border-gray-700 p-3 text-[12px]">
            {/* 아이템 이름 */}
            <p className="font-bold text-[13px] leading-tight mb-1"
              style={{ color: item.potential_option_grade ? (POTENTIAL_COLORS[item.potential_option_grade] ?? "#ffffff") : "#ffffff" }}>
              {sfNum > 0 && (
                <span className="text-yellow-400 mr-1">
                  {"★".repeat(Math.min(sfNum, 5))}{sfNum > 5 ? ` ${sfNum}성` : ""}
                </span>
              )}
              {item.item_name}
            </p>
            <p className="text-gray-400 text-[11px] mb-2">{item.item_equipment_slot}</p>

            {/* 총 옵션 */}
            {(() => {
              const stats = Object.entries(item.item_total_option ?? {}).filter(([, v]) => v !== "0" && v !== "")
              return stats.length > 0 ? (
                <div className="border-t border-gray-700 pt-2 mb-2 space-y-0.5">
                  {stats.map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-gray-300">{STAT_KO[k] ?? k}</span>
                      <span className="text-white font-semibold">+{v}</span>
                    </div>
                  ))}
                </div>
              ) : null
            })()}

            {/* 잠재옵션 */}
            {[item.potential_option_1, item.potential_option_2, item.potential_option_3].filter(Boolean).length > 0 && (
              <div className="border-t border-gray-700 pt-2 mb-1">
                <p className="text-[10px] font-bold mb-1"
                  style={{ color: item.potential_option_grade ? (POTENTIAL_COLORS[item.potential_option_grade] ?? "#888") : "#888" }}>
                  [{item.potential_option_grade}]
                </p>
                {[item.potential_option_1, item.potential_option_2, item.potential_option_3].filter(Boolean).map((opt, i) => (
                  <p key={i} className="leading-snug"
                    style={{ color: item.potential_option_grade ? (POTENTIAL_COLORS[item.potential_option_grade] ?? "#aaa") : "#aaa" }}>
                    {opt}
                  </p>
                ))}
              </div>
            )}

            {/* 에디셔널 잠재옵션 */}
            {[item.additional_potential_option_1, item.additional_potential_option_2, item.additional_potential_option_3].filter(Boolean).length > 0 && (
              <div className="border-t border-gray-700 pt-2">
                <p className="text-[10px] font-bold mb-1"
                  style={{ color: item.additional_potential_option_grade ? (POTENTIAL_COLORS[item.additional_potential_option_grade!] ?? "#888") : "#888" }}>
                  [{item.additional_potential_option_grade}]
                </p>
                {[item.additional_potential_option_1, item.additional_potential_option_2, item.additional_potential_option_3].filter(Boolean).map((opt, i) => (
                  <p key={i} className="leading-snug"
                    style={{ color: item.additional_potential_option_grade ? (POTENTIAL_COLORS[item.additional_potential_option_grade!] ?? "#aaa") : "#aaa" }}>
                    {opt}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── 메인 컴포넌트 ───────────────────────────────────────────────
export default function EquipmentTab({ items }: { items: EquipmentItem[] }) {
  if (!items.length) {
    return (
      <div className="text-center py-12 text-gray-400">
        <div className="text-4xl mb-3">🗡️</div>
        <p className="text-sm">장비 정보를 불러올 수 없어요</p>
      </div>
    )
  }

  const itemMap = new Map(items.map((it) => [it.item_equipment_slot, it]))

  return (
    <div className="flex justify-center">
      <div
        className="grid gap-1.5"
        style={{
          gridTemplateColumns: "repeat(5, 52px)",
          gridTemplateRows:    "repeat(6, 52px)",
        }}
      >
        {SLOT_LAYOUT.map(({ slot, col, row }) => (
          <div
            key={slot}
            style={{ gridColumn: col, gridRow: row }}
          >
            <SlotCell item={itemMap.get(slot)} col={col} />
          </div>
        ))}
      </div>
    </div>
  )
}
