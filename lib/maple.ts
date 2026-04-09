// ─────────────────────────────────────────────────────────────
// 메이플스토리 캐릭터 데이터 타입 & Nexon OpenAPI fetch 함수
// ─────────────────────────────────────────────────────────────

// ── 기본 정보 ──────────────────────────────────────────────
export interface CharacterBasic {
  character_name: string
  world_name: string
  character_class: string
  character_class_level: string
  character_level: number
  character_exp: number
  character_exp_rate: string
  character_guild_name: string
  character_image: string
  character_date_create: string
}

export interface StatItem {
  stat_name: string
  stat_value: string | null
}

// ── 장비 ───────────────────────────────────────────────────
export interface EquipmentItem {
  item_equipment_part: string
  item_equipment_slot: string
  item_name: string
  item_icon: string
  starforce: string
  starforce_scroll_flag: string
  potential_option_grade: string | null
  additional_potential_option_grade: string | null
  potential_option_1: string | null
  potential_option_2: string | null
  potential_option_3: string | null
  additional_potential_option_1: string | null
  additional_potential_option_2: string | null
  additional_potential_option_3: string | null
  item_total_option: Record<string, string>
}

// ── 어빌리티 ───────────────────────────────────────────────
export interface AbilityLine {
  ability_no: string
  ability_grade: string
  ability_value: string
}

export interface AbilityInfo {
  ability_grade: string
  ability_info: AbilityLine[]
}

// ── 유니온 ─────────────────────────────────────────────────
export interface UnionInfo {
  union_level: number
  union_grade: string
  union_artifact_level: number
  union_artifact_exp: number
  union_artifact_point: number
}

// ── 코디 ───────────────────────────────────────────────────
export interface CashItem {
  cash_item_equipment_part: string
  cash_item_equipment_slot: string
  cash_item_name: string
  cash_item_icon: string
  cash_item_label: string | null
}

export interface CodiInfo {
  gender: string
  hair: string
  face: string
  skin: string
  preset1: CashItem[]
  preset2: CashItem[]
  preset3: CashItem[]
}

// ── 심볼 ───────────────────────────────────────────────────
export interface SymbolItem {
  symbol_name: string
  symbol_icon: string
  symbol_force: string
  symbol_level: number
  symbol_exp: number
  symbol_exp_required: number
  symbol_item_count: number
  symbol_growth_count: number
  symbol_require_growth_count: number
}

// ── 헥사 ───────────────────────────────────────────────────
export interface HexaCore {
  hexa_core_name: string
  hexa_core_level: number
  hexa_core_type: string
}

export interface HexaStat {
  slot_id: string
  main_stat_name: string
  sub_stat_name_1: string
  sub_stat_name_2: string
  main_stat_level: number
  sub_stat_level_1: number
  sub_stat_level_2: number
}

// ── 전체 캐릭터 데이터 ────────────────────────────────────
export interface CharacterData {
  basic: CharacterBasic
  popularity: number
  stats: StatItem[]
  equipment: EquipmentItem[]
  ability: AbilityInfo | null
  union: UnionInfo | null
  symbols: SymbolItem[]
  hexaCores: HexaCore[]
  hexaStats: HexaStat[]
  codi: CodiInfo | null
}

// 표시할 주요 스탯
export const MAIN_STATS   = ["STR", "DEX", "INT", "LUK"]
export const BATTLE_STATS = ["HP", "MP", "공격력", "마력"]
export const DETAIL_STATS = ["보스 몬스터 데미지", "방어율 무시", "크리티컬 확률", "크리티컬 데미지", "방어력"]
export const COMBAT_POWER_STAT = "전투력"

// 포텐셜 등급 색상
export const POTENTIAL_COLORS: Record<string, string> = {
  "레전드리": "#FF8C00",
  "유니크":   "#EAB308",
  "에픽":     "#A855F7",
  "레어":     "#3B82F6",
}

// ─────────────────────────────────────────────────────────────
// Nexon OpenAPI 내부 fetch 헬퍼
// ─────────────────────────────────────────────────────────────
const BASE_URL = "https://open.api.nexon.com"

// ocid 캐시 (1시간)
const ocidCache = new Map<string, { ocid: string; ts: number }>()
const OCID_TTL  = 60 * 60 * 1000

async function getOcid(name: string): Promise<string | null> {
  const cached = ocidCache.get(name)
  if (cached && Date.now() - cached.ts < OCID_TTL) return cached.ocid

  const data = await nexonFetch(`/maplestory/v1/id?character_name=${encodeURIComponent(name)}`)
  if (!data?.ocid) return null

  ocidCache.set(name, { ocid: data.ocid, ts: Date.now() })
  return data.ocid
}

function getApiKeys(): string[] {
  return [
    process.env.NEXON_API_KEY,
    process.env.NEXON_API_KEY_2,
  ].filter(Boolean) as string[]
}

async function nexonFetch(path: string, keyIndex = 0): Promise<any> {
  const keys = getApiKeys()
  if (keys.length === 0) throw new Error("NEXON_API_KEY 환경변수가 설정되지 않았습니다")

  const key = keys[keyIndex % keys.length]
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "x-nxopen-api-key": key },
    cache: "no-store",
  })

  if (!res.ok) {
    if (res.status === 429 && keyIndex + 1 < keys.length) {
      return nexonFetch(path, keyIndex + 1)
    }
    if (res.status === 429 && keyIndex + 1 >= keys.length) {
      await new Promise((r) => setTimeout(r, 2000))
      return nexonFetch(path, 0)
    }
    console.error(`Nexon API 오류 [${res.status}]:`, path)
    return null
  }
  return res.json()
}

// ─────────────────────────────────────────────────────────────
// 히스토리
// ─────────────────────────────────────────────────────────────
export interface HistoryPoint {
  date: string
  value: number
}

export interface CharacterHistory {
  expHistory: HistoryPoint[]
  levelHistory: HistoryPoint[]
}

function kstDateString(daysAgo: number): string {
  const now = Date.now() + 9 * 60 * 60 * 1000 // UTC → KST
  const d = new Date(now - daysAgo * 86400000)
  return d.toISOString().split("T")[0]
}

function formatKoDate(dateStr: string): string {
  const [, m, d] = dateStr.split("-")
  return `${parseInt(m)}월 ${parseInt(d)}일`
}

export async function fetchHistory(name: string): Promise<CharacterHistory | null> {
  const ocid = await getOcid(name)
  if (!ocid) return null

  // 경험치: 어제~7일 전 (1~7)
  const expDates = Array.from({ length: 7 }, (_, i) => kstDateString(i + 1))

  // 레벨: 최근 8개월 (매월 1일) + 어제 날짜 추가 (Vercel 10s 제한 고려)
  const levelDates: string[] = []
  for (let i = 7; i >= 0; i--) {
    const d = new Date(Date.now() + 9 * 60 * 60 * 1000)
    d.setUTCMonth(d.getUTCMonth() - i, 1)
    levelDates.push(d.toISOString().split("T")[0])
  }
  const yesterday = kstDateString(1)
  if (!levelDates.includes(yesterday)) levelDates.push(yesterday)

  // 경험치/레벨/오늘 동시 조회
  const [expResults, levelResults, todayResult] = await Promise.all([
    Promise.all(expDates.map(date =>
      nexonFetch(`/maplestory/v1/character/basic?ocid=${ocid}&date=${date}`)
        .catch(() => null)
    )),
    Promise.all(levelDates.map(date =>
      nexonFetch(`/maplestory/v1/character/basic?ocid=${ocid}&date=${date}`)
        .catch(() => null)
    )),
    nexonFetch(`/maplestory/v1/character/basic?ocid=${ocid}`).catch(() => null),
  ])

  const expHistory: HistoryPoint[] = expDates
    .map((date, i) => ({
      date: formatKoDate(date),
      value: parseFloat(expResults[i]?.character_exp_rate ?? "0"),
    }))
    .filter(e => e.value > 0)
    .reverse()

  if (todayResult?.character_exp_rate) {
    expHistory.push({ date: "오늘", value: parseFloat(todayResult.character_exp_rate) })
  }

  // 레벨이 변하는 시점만 추출
  const allLevels = levelDates.map((date, i) => ({
    date: formatKoDate(date),
    value: levelResults[i]?.character_level ?? 0,
  })).filter(e => e.value > 0)

  // 오늘 실시간 데이터 추가
  if (todayResult?.character_level) {
    const todayStr = "오늘"
    const last = allLevels[allLevels.length - 1]
    if (!last || last.value !== todayResult.character_level) {
      allLevels.push({ date: todayStr, value: todayResult.character_level })
    } else if (last) {
      last.date = todayStr
    }
  }

  const levelHistory: HistoryPoint[] = allLevels.filter((p, i) =>
    i === 0 || p.value !== allLevels[i - 1].value
  )

  return { expHistory, levelHistory }
}

// ─────────────────────────────────────────────────────────────
// 캐릭터 전체 조회
// ─────────────────────────────────────────────────────────────
export async function fetchCharacter(name: string): Promise<CharacterData | null> {
  if (!name?.trim()) return null

  const ocid = await getOcid(name)
  if (!ocid) return null

  const q = `ocid=${ocid}`

  // 1묶음: 핵심 정보
  const [basicR, popularityR, statR, equipR] = await Promise.all([
    nexonFetch(`/maplestory/v1/character/basic?${q}`),
    nexonFetch(`/maplestory/v1/character/popularity?${q}`),
    nexonFetch(`/maplestory/v1/character/stat?${q}`),
    nexonFetch(`/maplestory/v1/character/item-equipment?${q}`),
  ])

  if (!basicR) return null

  // 2묶음: 어빌리티 + 유니온 + 심볼
  await new Promise((r) => setTimeout(r, 200))

  const [abilityR, unionR, symbolR] = await Promise.all([
    nexonFetch(`/maplestory/v1/character/ability?${q}`),
    nexonFetch(`/maplestory/v1/user/union?${q}`),
    nexonFetch(`/maplestory/v1/character/symbol-equipment?${q}`),
  ])

  // 3묶음: 헥사 + 코디 + 뷰티
  await new Promise((r) => setTimeout(r, 200))

  const [hexaCoreR, hexaStatR, codiR, beautyR] = await Promise.all([
    nexonFetch(`/maplestory/v1/character/hexamatrix?${q}`),
    nexonFetch(`/maplestory/v1/character/hexamatrix-stat?${q}`),
    nexonFetch(`/maplestory/v1/character/cashitem-equipment?${q}`),
    nexonFetch(`/maplestory/v1/character/beauty-equipment?${q}`),
  ])

  return {
    basic: {
      character_name:        basicR.character_name,
      world_name:            basicR.world_name,
      character_class:       basicR.character_class,
      character_class_level: basicR.character_class_level,
      character_level:       basicR.character_level,
      character_exp:         basicR.character_exp,
      character_exp_rate:    basicR.character_exp_rate,
      character_guild_name:  basicR.character_guild_name ?? "",
      character_image:       basicR.character_image ?? "",
      character_date_create: basicR.character_date_create ?? "",
    },
    popularity: popularityR?.popularity ?? 0,
    stats:      statR?.final_stat ?? [],
    equipment:  equipR?.item_equipment ?? [],
    ability:    abilityR ?? null,
    union: unionR ? {
      union_level:          unionR.union_level,
      union_grade:          unionR.union_grade,
      union_artifact_level: unionR.union_artifact_level ?? 0,
      union_artifact_exp:   unionR.union_artifact_exp ?? 0,
      union_artifact_point: unionR.union_artifact_point ?? 0,
    } : null,
    symbols:   symbolR?.symbol ?? [],
    hexaCores: (hexaCoreR?.character_hexa_core_equipment ?? []).map(({ hexa_core_name, hexa_core_level, hexa_core_type }: HexaCore) => ({ hexa_core_name, hexa_core_level, hexa_core_type })),
    hexaStats: (hexaStatR?.character_hexa_stat_core ?? []).map(({ slot_id, main_stat_name, sub_stat_name_1, sub_stat_name_2, main_stat_level, sub_stat_level_1, sub_stat_level_2 }: HexaStat) => ({ slot_id, main_stat_name, sub_stat_name_1, sub_stat_name_2, main_stat_level, sub_stat_level_1, sub_stat_level_2 })),
    codi: codiR ? (() => {
      const mapPreset = (items: CashItem[]) => (items ?? []).map(({ cash_item_equipment_part, cash_item_equipment_slot, cash_item_name, cash_item_icon, cash_item_label }: CashItem) => ({ cash_item_equipment_part, cash_item_equipment_slot, cash_item_name, cash_item_icon, cash_item_label: cash_item_label ?? null }))
      return {
        gender: codiR.character_gender ?? "",
        hair:   beautyR?.character_hair?.hair_name ?? "",
        face:   beautyR?.character_face?.face_name ?? "",
        skin:   beautyR?.character_skin?.skin_name ?? "",
        preset1: mapPreset(codiR.character_cashitem_equipment_preset_1),
        preset2: mapPreset(codiR.character_cashitem_equipment_preset_2),
        preset3: mapPreset(codiR.character_cashitem_equipment_preset_3),
      }
    })() : null,
  }
}
