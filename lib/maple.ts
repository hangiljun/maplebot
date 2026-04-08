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

// ── 전체 캐릭터 데이터 ────────────────────────────────────
export interface CharacterData {
  basic: CharacterBasic
  popularity: number
  stats: StatItem[]
  equipment: EquipmentItem[]
  ability: AbilityInfo | null
  union: UnionInfo | null
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

async function nexonFetch(path: string) {
  const apiKey = process.env.NEXON_API_KEY
  if (!apiKey) throw new Error("NEXON_API_KEY 환경변수가 설정되지 않았습니다")

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "x-nxopen-api-key": apiKey },
    cache: "no-store", // 항상 최신 데이터 (빈 결과 캐시 방지)
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

  // 2. 요청을 두 묶음으로 나눠서 Rate Limit 방지
  const q = `ocid=${ocid}`

  // 1묶음: 핵심 정보
  const [basicR, popularityR, statR, equipR] = await Promise.all([
    nexonFetch(`/maplestory/v1/character/basic?${q}`),
    nexonFetch(`/maplestory/v1/character/popularity?${q}`),
    nexonFetch(`/maplestory/v1/character/stat?${q}`),
    nexonFetch(`/maplestory/v1/character/item-equipment?${q}`),
  ])

  if (!basicR) return null

  // 2묶음: 어빌리티 + 유니온
  await new Promise((r) => setTimeout(r, 200))

  const [abilityR, unionR] = await Promise.all([
    nexonFetch(`/maplestory/v1/character/ability?${q}`),
    nexonFetch(`/maplestory/v1/user/union?${q}`),
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
    union: unionR
      ? {
          union_level:          unionR.union_level,
          union_grade:          unionR.union_grade,
          union_artifact_level: unionR.union_artifact_level ?? 0,
          union_artifact_exp:   unionR.union_artifact_exp ?? 0,
          union_artifact_point: unionR.union_artifact_point ?? 0,
        }
      : null,
  }
}
