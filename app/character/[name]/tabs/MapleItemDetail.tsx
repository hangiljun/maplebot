"use client"
import { EquipmentItem } from "@/lib/maple"

// ── 등급 색상 ──────────────────────────────────────────────
const GRADE_COLOR: Record<string, string> = {
  "레전드리": "#FF8C00",
  "유니크":   "#f0c040",
  "에픽":     "#c060ff",
  "레어":     "#60a8ff",
}

const GRADE_LABEL: Record<string, string> = {
  "레전드리": "레전드리 아이템",
  "유니크":   "유니크 아이템",
  "에픽":     "에픽 아이템",
  "레어":     "레어 아이템",
}

// ── 스탯 정의 ─────────────────────────────────────────────
const STAT_LABELS: Record<string, string> = {
  str:                      "STR",
  dex:                      "DEX",
  int:                      "INT",
  luk:                      "LUK",
  max_hp:                   "최대 HP",
  max_mp:                   "최대 MP",
  attack_power:             "공격력",
  magic_power:              "마력",
  armor:                    "방어력",
  speed:                    "이동속도",
  jump:                     "점프력",
  boss_damage:              "보스 데미지",
  ignore_monster_armor:     "방어율 무시",
  damage:                   "데미지",
  all_stat:                 "올스탯",
  critical_rate:            "크리티컬 확률",
  critical_damage:          "크리티컬 데미지",
  equipment_level_decrease: "착용 레벨 감소",
  max_hp_rate:              "최대 HP %",
  max_mp_rate:              "최대 MP %",
}

const STAT_ORDER = [
  "str","dex","int","luk","max_hp","max_mp",
  "attack_power","magic_power","armor","speed","jump",
  "boss_damage","ignore_monster_armor","damage","all_stat",
  "critical_rate","critical_damage","equipment_level_decrease",
  "max_hp_rate","max_mp_rate",
]

function num(v: string | undefined): number {
  return parseInt(v ?? "0") || 0
}

// ── 스타포스 별 ───────────────────────────────────────────
function Stars({ count }: { count: number }) {
  if (count <= 0) return null
  const capped = Math.min(count, 25)
  // 5개씩 행으로 나눔
  const rows: number[] = []
  for (let i = 0; i < capped; i += 5) rows.push(Math.min(5, capped - i))
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, marginBottom: 5 }}>
      {rows.map((len, ri) => (
        <div key={ri} style={{ display: "flex", gap: 2 }}>
          {Array.from({ length: len }).map((_, ci) => (
            <span key={ci} style={{
              color: "#f0c040",
              fontSize: 11,
              lineHeight: 1,
              textShadow: "0 0 5px rgba(240,192,64,0.8), 0 0 10px rgba(240,192,64,0.3)",
            }}>★</span>
          ))}
        </div>
      ))}
    </div>
  )
}

// ── 구분선 ────────────────────────────────────────────────
function Divider() {
  return (
    <div style={{
      margin: "6px -2px",
      height: 1,
      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2) 20%, rgba(255,255,255,0.2) 80%, transparent)",
    }} />
  )
}

// ── 스탯 행 ───────────────────────────────────────────────
// 색상 기준:
//   기본 (base)       → 흰색  #ffffff
//   기타/주문서 (etc) → 파랑  #a0c8ff
//   추가옵션 (add)    → 연초록 #90e890
//   스타포스 (star)   → 금색  #f0c040
//   익셉셔널 (ex)     → 분홍  #ffa0c8
function StatRow({ label, total, base, etc, add, star, ex }: {
  label: string
  total: number
  base: number
  etc: number
  add: number
  star: number
  ex: number
}) {
  if (total === 0 && base === 0) return null

  const parts: { val: number; color: string }[] = []
  if (base > 0) parts.push({ val: base, color: "#ffffff" })
  if (etc  > 0) parts.push({ val: etc,  color: "#a0c8ff" })
  if (add  > 0) parts.push({ val: add,  color: "#90e890" })
  if (star > 0) parts.push({ val: star, color: "#f0c040" })
  if (ex   > 0) parts.push({ val: ex,   color: "#ffa0c8" })

  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 6, fontSize: 11, lineHeight: 1.55 }}>
      {/* 라벨 */}
      <span style={{ color: "#b8b8b8", flexShrink: 0, minWidth: 76 }}>{label} :</span>
      {/* 총합 */}
      <span style={{ color: "#ffffff", fontWeight: 700 }}>+{total}</span>
      {/* 분해 */}
      {parts.length > 1 && (
        <span style={{ fontSize: 10, color: "#888" }}>
          ({parts.map((p, i) => (
            <span key={i}>
              {i > 0 && <span> </span>}
              <span style={{ color: p.color }}>+{p.val}</span>
            </span>
          ))})
        </span>
      )}
    </div>
  )
}

// ── 잠재/에디셔널 블록 ────────────────────────────────────
function PotentialBlock({ label, grade, opts }: {
  label: string
  grade: string | null | undefined
  opts: (string | null | undefined)[]
}) {
  const lines = opts.filter(Boolean)
  if (!lines.length || !grade) return null
  const color = GRADE_COLOR[grade] ?? "#cccccc"
  return (
    <>
      <Divider />
      <p style={{ fontSize: 11, fontWeight: 700, color, marginBottom: 3 }}>
        ■ {label} ({grade})
      </p>
      {lines.map((opt, i) => (
        <p key={i} style={{ fontSize: 11, color, lineHeight: 1.5 }}>■ {opt}</p>
      ))}
    </>
  )
}

// ── 메인 컴포넌트 ─────────────────────────────────────────
export default function MapleItemDetail({ item }: { item: EquipmentItem }) {
  const grade    = item.potential_option_grade ?? null
  const addGrade = item.additional_potential_option_grade ?? null
  const sfNum    = parseInt(item.starforce ?? "0") || 0
  const scrollUp = parseInt(item.scroll_upgrade ?? "0") || 0
  const scrollLeft     = item.scroll_upgradeable_count
  const goldenHammer   = item.golden_hammer_flag === "Y"
  const nameColor      = grade ? (GRADE_COLOR[grade] ?? "#ffffff") : "#ffffff"
  const borderColor    = grade ? (GRADE_COLOR[grade] ?? "#555555") : "#555555"

  // 옵션 소스별 분리
  const optBase  = item.item_base_option          ?? {}
  const optAdd   = item.item_add_option           ?? {}
  const optEtc   = item.item_etc_option           ?? {}
  const optStar  = item.item_starforce_option     ?? {}
  const optEx    = item.item_exceptional_option   ?? {}
  const optTotal = item.item_total_option         ?? {}

  const reqLevel = optBase.base_equipment_level

  const potOpts = [item.potential_option_1, item.potential_option_2, item.potential_option_3]
  const addOpts = [item.additional_potential_option_1, item.additional_potential_option_2, item.additional_potential_option_3]

  return (
    <div style={{
      background: "linear-gradient(175deg, #1c1228 0%, #0e0818 55%, #12102a 100%)",
      border: `1px solid ${borderColor}55`,
      outline: `1px solid ${borderColor}18`,
      borderRadius: 6,
      padding: "12px 14px",
      minWidth: 248,
      color: "#e4e4e4",
      fontFamily: "'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif",
      boxShadow: `0 0 0 2px ${borderColor}10, 0 12px 40px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.06)`,
      userSelect: "none",
    }}>

      {/* 스타포스 별 */}
      <Stars count={sfNum} />

      {/* 아이템 이름 */}
      <p style={{
        color: nameColor,
        fontWeight: 700,
        fontSize: 14,
        textAlign: "center",
        lineHeight: 1.3,
        marginBottom: 2,
        textShadow: grade ? `0 0 12px ${nameColor}55` : "none",
      }}>
        {item.item_name}{scrollUp > 0 ? ` (+${scrollUp})` : ""}
      </p>

      {/* 등급 라벨 */}
      {grade && (
        <p style={{
          color: nameColor,
          fontSize: 11,
          textAlign: "center",
          opacity: 0.7,
          marginBottom: 8,
        }}>
          ({GRADE_LABEL[grade] ?? `${grade} 아이템`})
        </p>
      )}

      <Divider />

      {/* 아이콘 + 기본 정보 */}
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
        {/* 아이콘 박스 */}
        {item.item_icon && (
          <div style={{
            width: 56, height: 56, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.45)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 4,
          }}>
            <img
              src={item.item_icon}
              alt={item.item_name}
              style={{ imageRendering: "pixelated", maxWidth: 48, maxHeight: 48, objectFit: "contain" }}
            />
          </div>
        )}

        {/* REQ LEV + 분류 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingTop: 4 }}>
          {reqLevel && (
            <span style={{ fontSize: 11, color: "#a0a0a0" }}>
              REQ LEV :{" "}
              <span style={{ color: "#d0d0d0", fontWeight: 600 }}>{reqLevel}</span>
            </span>
          )}
          <span style={{ fontSize: 11, color: "#a0a0a0" }}>
            장비 분류 :{" "}
            <span style={{ color: "#d0d0d0" }}>{item.item_equipment_slot}</span>
          </span>
        </div>
      </div>

      <Divider />

      {/* 스탯 영역 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {STAT_ORDER.map(key => {
          const t = num(optTotal[key])
          const b = num(optBase[key])
          const e = num(optEtc[key])
          const a = num(optAdd[key])
          const s = num(optStar[key])
          const x = num(optEx[key])
          if (t === 0 && b === 0) return null
          return (
            <StatRow key={key}
              label={STAT_LABELS[key] ?? key}
              total={t} base={b} etc={e} add={a} star={s} ex={x}
            />
          )
        })}
        {/* STAT_ORDER 이외의 스탯도 표시 */}
        {Object.entries(optTotal).map(([key, v]) => {
          if (STAT_ORDER.includes(key) || key === "base_equipment_level") return null
          const t = num(v)
          if (t === 0) return null
          return (
            <StatRow key={`extra-${key}`}
              label={STAT_LABELS[key] ?? key}
              total={t}
              base={num(optBase[key])}
              etc={num(optEtc[key])}
              add={num(optAdd[key])}
              star={num(optStar[key])}
              ex={num(optEx[key])}
            />
          )
        })}
      </div>

      {/* 업그레이드 가능 횟수 */}
      {scrollLeft !== undefined && (
        <>
          <div style={{ marginTop: 6 }}>
            <span style={{ fontSize: 11, color: scrollLeft === "0" ? "#555" : "#a0a0a0" }}>
              업그레이드 가능 횟수 : {scrollLeft}
            </span>
            {goldenHammer && (
              <span style={{ fontSize: 11, color: "#f0c040" }}> (황금망치 제련 적용)</span>
            )}
          </div>
        </>
      )}

      {/* 소울 */}
      {item.soul_name && (
        <>
          <Divider />
          <p style={{ fontSize: 11, fontWeight: 700, color: "#88c8ff", marginBottom: 2 }}>
            {item.soul_name}
          </p>
          {item.soul_option && (
            <p style={{ fontSize: 11, color: "#88c8ff" }}>{item.soul_option}</p>
          )}
        </>
      )}

      {/* 잠재능력 */}
      <PotentialBlock label="잠재옵션" grade={grade} opts={potOpts} />

      {/* 에디셔널 잠재능력 */}
      <PotentialBlock label="에디셔널 잠재옵션" grade={addGrade} opts={addOpts} />
    </div>
  )
}
