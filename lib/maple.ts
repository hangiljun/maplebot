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
export interface ItemTotalOption {
  str: string
  dex: string
  int: string
  luk: string
  max_hp: string
  max_mp: string
  attack_power: string
  magic_power: string
  armor: string
  [key: string]: string
}

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
  item_total_option: ItemTotalOption
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
  stats: StatItem[]
  equipment: EquipmentItem[]
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
  "유니크":   "#FFD700",
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
    next: { revalidate: 3600 },
  })

  if (!res.ok) return null
  return res.json()
}

// ─────────────────────────────────────────────────────────────
// 캐릭터 전체 조회 (기본정보 + 스탯 + 장비 + 유니온 + 스킬)
// ─────────────────────────────────────────────────────────────
export async function fetchCharacter(name: string): Promise<CharacterData | null> {
  if (!name?.trim()) return null

  // 1. ocid 조회
  const idData = await nexonFetch(
    `/maplestory/v1/id?character_name=${encodeURIComponent(name)}`
  )
  if (!idData?.ocid) return null
  const { ocid } = idData

  // 2. 병렬 조회
  const [basicData, statData, equipData, unionData, skillData] = await Promise.allSettled([
    nexonFetch(`/maplestory/v1/character/basic?ocid=${ocid}`),
    nexonFetch(`/maplestory/v1/character/stat?ocid=${ocid}`),
    nexonFetch(`/maplestory/v1/character/item-equipment?ocid=${ocid}`),
    nexonFetch(`/maplestory/v1/user/union?ocid=${ocid}`),
    nexonFetch(`/maplestory/v1/character/skill?ocid=${ocid}&character_skill_grade=6`),
  ])

  const basic = basicData.status === "fulfilled" ? basicData.value : null
  if (!basic) return null

  const stat     = statData.status   === "fulfilled" ? statData.value   : null
  const equip    = equipData.status  === "fulfilled" ? equipData.value  : null
  const union    = unionData.status  === "fulfilled" ? unionData.value  : null
  const skill    = skillData.status  === "fulfilled" ? skillData.value  : null

  return {
    basic: {
      character_name:        basic.character_name,
      world_name:            basic.world_name,
      character_class:       basic.character_class,
      character_class_level: basic.character_class_level,
      character_level:       basic.character_level,
      character_exp:         basic.character_exp,
      character_exp_rate:    basic.character_exp_rate,
      character_guild_name:  basic.character_guild_name ?? "",
      character_image:       basic.character_image ?? "",
      character_date_create: basic.character_date_create ?? "",
    },
    stats:     stat?.final_stat ?? [],
    equipment: equip?.item_equipment ?? [],
    union: union
      ? {
          union_level:           union.union_level,
          union_grade:           union.union_grade,
          union_artifact_level:  union.union_artifact_level ?? 0,
          union_artifact_exp:    union.union_artifact_exp ?? 0,
          union_artifact_point:  union.union_artifact_point ?? 0,
        }
      : null,
    skills: skill?.character_skill ?? [],
  }
}
