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

// ── 심볼 ───────────────────────────────────────────────────
export interface SymbolItem {
  symbol_name: string
  symbol_icon: string
  symbol_description: string
  symbol_force: string
  symbol_level: number
  symbol_str: string
  symbol_dex: string
  symbol_int: string
  symbol_luk: string
  symbol_hp: string
  symbol_growth_count: number
  symbol_require_growth_count: number
}

// ── 하이퍼스탯 ─────────────────────────────────────────────
export interface HyperStatItem {
  stat_type: string
  stat_point: number | null
  stat_level: number
  stat_increase: string | null
}

// ── 유니온 ─────────────────────────────────────────────────
export interface UnionInfo {
  union_level: number
  union_grade: string
  union_artifact_level: number
  union_artifact_exp: number
  union_artifact_point: number
}

// ── 스킬 ───────────────────────────────────────────────────
export interface SkillItem {
  skill_name: string
  skill_description: string
  skill_level: number
  skill_effect: string | null
  skill_icon: string
}

// ── 전체 캐릭터 데이터 ────────────────────────────────────
export interface CharacterData {
  basic: CharacterBasic
  popularity: number
  stats: StatItem[]
  equipment: EquipmentItem[]
  ability: AbilityInfo | null
  symbols: SymbolItem[]
  hyperStats: HyperStatItem[]
  union: UnionInfo | null
  skills: SkillItem[]
}

// 표시할 주요 스탯
export const MAIN_STATS   = ["STR", "DEX", "INT", "LUK"]
export const BATTLE_STATS = ["HP", "MP", "공격력", "마력"]
export const DETAIL_STATS = ["보스 몬스터 데미지", "방어율 무시", "크리티컬 확률", "크리티컬 데미지", "방어력"]

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

// KST 어제 날짜 반환 (Nexon API는 전날 데이터 기준)
function getKSTYesterday(): string {
  const kst = new Date(Date.now() + 9 * 60 * 60 * 1000)
  kst.setDate(kst.getDate() - 1)
  return kst.toISOString().slice(0, 10)
}

async function nexonFetch(path: string) {
  const apiKey = process.env.NEXON_API_KEY
  if (!apiKey) throw new Error("NEXON_API_KEY 환경변수가 설정되지 않았습니다")

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "x-nxopen-api-key": apiKey },
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    console.error(`Nexon API 오류 [${res.status}]:`, path)
    return null
  }
  return res.json()
}

// ─────────────────────────────────────────────────────────────
// 캐릭터 전체 조회
// ─────────────────────────────────────────────────────────────
export async function fetchCharacter(name: string): Promise<CharacterData | null> {
  if (!name?.trim()) return null

  // 1. ocid 조회
  const idData = await nexonFetch(
    `/maplestory/v1/id?character_name=${encodeURIComponent(name)}`
  )
  if (!idData?.ocid) return null
  const { ocid } = idData

  // 2. 병렬 조회 (date 파라미터 필수)
  const date = getKSTYesterday()
  const q = `ocid=${ocid}&date=${date}`

  const results = await Promise.allSettled([
    nexonFetch(`/maplestory/v1/character/basic?${q}`),
    nexonFetch(`/maplestory/v1/character/popularity?${q}`),
    nexonFetch(`/maplestory/v1/character/stat?${q}`),
    nexonFetch(`/maplestory/v1/character/item-equipment?${q}`),
    nexonFetch(`/maplestory/v1/character/ability?${q}`),
    nexonFetch(`/maplestory/v1/character/symbol-equipment?${q}`),
    nexonFetch(`/maplestory/v1/character/hyper-stat?${q}`),
    nexonFetch(`/maplestory/v1/user/union?${q}`),
    nexonFetch(`/maplestory/v1/character/skill?${q}&character_skill_grade=6`),
  ])

  const [
    basicR, popularityR, statR, equipR,
    abilityR, symbolR, hyperR, unionR, skillR,
  ] = results.map((r) => (r.status === "fulfilled" ? r.value : null))

  if (!basicR) return null

  // 하이퍼스탯: 프리셋1 사용
  const hyperStats: HyperStatItem[] = hyperR?.character_hyper_stat_preset_1 ?? []

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
    symbols:    symbolR?.character_symbol ?? [],
    hyperStats: hyperStats.filter((h: HyperStatItem) => h.stat_level > 0),
    union: unionR
      ? {
          union_level:          unionR.union_level,
          union_grade:          unionR.union_grade,
          union_artifact_level: unionR.union_artifact_level ?? 0,
          union_artifact_exp:   unionR.union_artifact_exp ?? 0,
          union_artifact_point: unionR.union_artifact_point ?? 0,
        }
      : null,
    skills: skillR?.character_skill ?? [],
  }
}
