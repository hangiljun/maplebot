"use client"
import { EquipmentItem } from "@/lib/maple"

// ── 등급 색상 (maple.gg / 실제 게임 기준) ─────────────────
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

// ── 스탯 옵션 소스별 색상 (maple.gg 기준) ─────────────────
//   base  = 회색   기본값
//   etc   = 파랑   주문서 강화
//   add   = 초록   추가옵션
//   star  = 노랑   스타포스
//   ex    = 분홍   익셉셔널
const SRC: Record<string, string> = {
  base: "#a8a8a8",
  etc:  "#5ab4ff",
  add:  "#44cc44",
  star: "#ffd433",
  ex:   "#ff88bb",
}

// ── 스탯 정의 ─────────────────────────────────────────────
const STAT_LABEL: Record<string, string> = {
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

function n(v: string | undefined): number {
  return parseInt(v ?? "0") || 0
}

// ── 아이템 레벨 → 스타포스 최대치 ───────────────────────
function getMaxStars(reqLevel: number): number {
  if (reqLevel >= 138) return 25
  if (reqLevel >= 128) return 20
  if (reqLevel >= 118) return 15
  if (reqLevel >= 108) return 10
  if (reqLevel >= 95)  return 8
  if (reqLevel >= 1)   return 5
  return 0
}

// ── 스타포스 별 (SVG) ─────────────────────────────────────
function StarIcon({ lit }: { lit: boolean }) {
  return lit ? (
    // 달성한 별 — 노란 불빛
    <svg width="13" height="13" viewBox="0 0 24 24" fill="#ffd433" xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(0 0 3px rgba(255,212,51,0.9))", flexShrink: 0 }}>
      <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z" />
    </svg>
  ) : (
    // 미달성 별 — 어두운 외곽선만
    <svg width="13" height="13" viewBox="0 0 24 24" fill="#2a2a2a" stroke="#555" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}>
      <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z" />
    </svg>
  )
}

function Stars({ count, maxStars }: { count: number; maxStars: number }) {
  if (maxStars <= 0) return null
  const stars = Array.from({ length: maxStars }, (_, i) => i < count)
  // 15개씩 2행, 각 행을 다시 5개 그룹으로 분할
  const rows: boolean[][][] = []
  for (let r = 0; r < maxStars; r += 15) {
    const rowStars = stars.slice(r, r + 15)
    const groups: boolean[][] = []
    for (let g = 0; g < rowStars.length; g += 5) groups.push(rowStars.slice(g, g + 5))
    rows.push(groups)
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, marginBottom: 6 }}>
      {rows.map((groups, ri) => (
        <div key={ri} style={{ display: "flex", gap: 6 }}>
          {groups.map((group, gi) => (
            <div key={gi} style={{ display: "flex", gap: 2 }}>
              {group.map((lit, ci) => <StarIcon key={ci} lit={lit} />)}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

// ── 구분선 ────────────────────────────────────────────────
function HLine() {
  return (
    <div style={{
      margin: "5px 0",
      height: 1,
      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18) 15%, rgba(255,255,255,0.18) 85%, transparent)",
    }} />
  )
}

// ── 스탯 행 ───────────────────────────────────────────────
// maple.gg 형식: LABEL : +합계 (기본 +주문서 +추가 +스타)
//   기본값 = + 없이, 나머지 소스 = + 붙여서, 0이면 생략
function StatRow({ label, total, base, etc, add, star, ex }: {
  label: string; total: number
  base: number; etc: number; add: number; star: number; ex: number
}) {
  if (total === 0 && base === 0) return null

  // 0이 아닌 추가 소스만 수집
  const extras: { v: number; c: string }[] = []
  if (etc  > 0) extras.push({ v: etc,  c: SRC.etc  })
  if (add  > 0) extras.push({ v: add,  c: SRC.add  })
  if (star > 0) extras.push({ v: star, c: SRC.star })
  if (ex   > 0) extras.push({ v: ex,   c: SRC.ex   })

  // 추가 소스가 없으면 괄호 분해 표시 안 함
  const showBreak = extras.length > 0

  return (
    <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", columnGap: 4, fontSize: 11, lineHeight: 1.65 }}>
      {/* 라벨 */}
      <span style={{ color: "#b0b0b0", minWidth: 82, flexShrink: 0 }}>{label} :</span>
      {/* 합계 */}
      <span style={{ color: "#ffffff", fontWeight: 700 }}>+{total}</span>
      {/* 분해 (기본값 + 소스별) */}
      {showBreak && (
        <span style={{ fontSize: 10.5, color: "#666" }}>
          (<span style={{ color: SRC.base }}>{base}</span>
          {extras.map(({ v, c }, i) => (
            <span key={i} style={{ color: c }}> +{v}</span>
          ))})
        </span>
      )}
    </div>
  )
}

// ── 잠재 / 에디셔널 블록 ──────────────────────────────────
function PotBlock({ label, grade, opts }: {
  label: string; grade: string | null | undefined; opts: (string | null | undefined)[]
}) {
  const lines = opts.filter(Boolean)
  if (!lines.length || !grade) return null
  const color = GRADE_COLOR[grade] ?? "#cccccc"
  return (
    <>
      <HLine />
      <p style={{ fontSize: 11, fontWeight: 700, color, marginBottom: 2 }}>■ {label}</p>
      {lines.map((opt, i) => (
        <p key={i} style={{ fontSize: 11, color, lineHeight: 1.55 }}>■ {opt}</p>
      ))}
    </>
  )
}

// ── 메인 컴포넌트 ─────────────────────────────────────────
export default function MapleItemDetail({ item }: { item: EquipmentItem }) {
  const grade      = item.potential_option_grade ?? null
  const addGrade   = item.additional_potential_option_grade ?? null
  const sfNum      = parseInt(item.starforce ?? "0") || 0
  const scrollUp   = parseInt(item.scroll_upgrade ?? "0") || 0
  const scrollLeft = item.scroll_upgradeable_count
  const hammer     = item.golden_hammer_flag === "Y"
  const nameColor  = grade ? (GRADE_COLOR[grade] ?? "#ffffff") : "#ffffff"
  const borderCol  = grade ? (GRADE_COLOR[grade] ?? "#555555") : "#555555"

  const optBase  = item.item_base_option        ?? {}
  const optAdd   = item.item_add_option         ?? {}
  const optEtc   = item.item_etc_option         ?? {}
  const optStar  = item.item_starforce_option   ?? {}
  const optEx    = item.item_exceptional_option ?? {}
  const optTotal = item.item_total_option       ?? {}

  const reqLevel = parseInt(optBase.base_equipment_level ?? "0") || 0
  const maxStars = getMaxStars(reqLevel)
  const potOpts  = [item.potential_option_1, item.potential_option_2, item.potential_option_3]
  const addOpts  = [item.additional_potential_option_1, item.additional_potential_option_2, item.additional_potential_option_3]

  return (
    <div style={{
      /* maple.gg / 게임 UI 스타일: 거의 검정에 가까운 네이비, 보라 없음 */
      background: "linear-gradient(180deg, #131522 0%, #0b0d1c 100%)",
      border: `1px solid ${borderCol}`,
      borderRadius: 4,
      padding: "10px 12px 12px",
      minWidth: 244,
      color: "#e0e0e0",
      fontFamily: "'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif",
      boxShadow: `inset 0 0 80px rgba(0,0,0,0.35), 0 6px 36px rgba(0,0,0,0.95)`,
    }}>

      {/* 스타포스 별 */}
      <Stars count={sfNum} maxStars={maxStars} />

      {/* 아이템 이름 */}
      <p style={{
        color: nameColor,
        fontWeight: 700,
        fontSize: 13,
        textAlign: "center",
        lineHeight: 1.3,
        marginBottom: 2,
      }}>
        {item.item_name}{scrollUp > 0 ? ` (+${scrollUp})` : ""}
      </p>

      {/* 등급 라벨 */}
      {grade && (
        <p style={{ color: nameColor, fontSize: 11, textAlign: "center", marginBottom: 6 }}>
          ({GRADE_LABEL[grade] ?? `${grade} 아이템`})
        </p>
      )}

      <HLine />

      {/* 아이콘 + REQ LEV + 장비 분류 */}
      <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
        {item.item_icon && (
          <div style={{
            width: 54, height: 54, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.55)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 3,
            overflow: "hidden",   /* 아이콘이 컨테이너 밖으로 나오지 않도록 */
          }}>
            <img
              src={item.item_icon}
              alt={item.item_name}
              style={{
                imageRendering: "pixelated",
                width: 44,
                height: 44,
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>
        )}
        <div style={{ fontSize: 11, display: "flex", flexDirection: "column", gap: 3, paddingTop: 2 }}>
          {reqLevel && (
            <span style={{ color: "#888" }}>
              REQ LEV : <span style={{ color: "#cccccc" }}>{reqLevel}</span>
            </span>
          )}
          <span style={{ color: "#888" }}>
            장비 분류 : <span style={{ color: "#cccccc" }}>{item.item_equipment_slot}</span>
          </span>
        </div>
      </div>

      <HLine />

      {/* 스탯 영역 */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {STAT_ORDER.map(key => {
          const t = n(optTotal[key]), b = n(optBase[key])
          const e = n(optEtc[key]),  a = n(optAdd[key])
          const s = n(optStar[key]), x = n(optEx[key])
          if (t === 0 && b === 0) return null
          return (
            <StatRow key={key}
              label={STAT_LABEL[key] ?? key}
              total={t} base={b} etc={e} add={a} star={s} ex={x}
            />
          )
        })}
        {/* STAT_ORDER에 없는 추가 스탯 */}
        {Object.entries(optTotal).map(([key, v]) => {
          if (STAT_ORDER.includes(key) || key === "base_equipment_level") return null
          const t = n(v)
          if (t === 0) return null
          return (
            <StatRow key={`x-${key}`}
              label={STAT_LABEL[key] ?? key}
              total={t}
              base={n(optBase[key])} etc={n(optEtc[key])}
              add={n(optAdd[key])}  star={n(optStar[key])} ex={n(optEx[key])}
            />
          )
        })}
      </div>

      {/* 업그레이드 가능 횟수 */}
      {scrollLeft !== undefined && (
        <div style={{ fontSize: 11, color: scrollLeft === "0" ? "#555" : "#888", marginTop: 4 }}>
          업그레이드 가능 횟수 : {scrollLeft}
          {hammer && <span style={{ color: SRC.star }}> (황금망치 제련 적용)</span>}
        </div>
      )}

      {/* 가위 사용 가능 횟수 */}
      {item.cuttable_count !== undefined && item.cuttable_count !== null && item.cuttable_count !== "255" && (
        <div style={{ fontSize: 11, color: item.cuttable_count === "0" ? "#555" : "#888", marginTop: 1 }}>
          가위 사용 가능 횟수 : {item.cuttable_count}회
        </div>
      )}

      {/* 소울 */}
      {item.soul_name && (
        <>
          <HLine />
          <p style={{ fontSize: 11, fontWeight: 700, color: "#88c8ff", marginBottom: 1 }}>{item.soul_name}</p>
          {item.soul_option && <p style={{ fontSize: 11, color: "#88c8ff" }}>{item.soul_option}</p>}
        </>
      )}

      {/* 잠재 옵션 */}
      <PotBlock label="잠재 옵션" grade={grade} opts={potOpts} />

      {/* 에디셔널 잠재 옵션 */}
      <PotBlock label="에디셔널 잠재 옵션" grade={addGrade} opts={addOpts} />
    </div>
  )
}
