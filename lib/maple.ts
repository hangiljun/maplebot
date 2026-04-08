// ─────────────────────────────────────────────────────────────
// 메이플스토리 캐릭터 데이터 타입 & Nexon OpenAPI fetch 함수
// ─────────────────────────────────────────────────────────────

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
  stat_value: string
}

export interface CharacterData {
  basic: CharacterBasic
  stats: StatItem[]
}

// 표시할 주요 스탯 (순서대로 렌더링)
export const MAIN_STATS   = ["STR", "DEX", "INT", "LUK"]
export const BATTLE_STATS = ["HP", "MP", "공격력", "마력"]
export const DETAIL_STATS = ["보스 몬스터 데미지", "방어율 무시", "크리티컬 확률", "크리티컬 데미지", "방어력"]

// ─────────────────────────────────────────────────────────────
// Nexon OpenAPI 내부 fetch 헬퍼
// ─────────────────────────────────────────────────────────────
const BASE_URL = "https://open.api.nexon.com"

async function nexonFetch(path: string) {
  const apiKey = process.env.NEXON_API_KEY
  if (!apiKey) throw new Error("NEXON_API_KEY 환경변수가 설정되지 않았습니다")

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "x-nxopen-api-key": apiKey },
    next: { revalidate: 3600 }, // 1시간 캐시
  })

  if (!res.ok) return null
  return res.json()
}

// ─────────────────────────────────────────────────────────────
// 캐릭터 조회 메인 함수
// ─────────────────────────────────────────────────────────────
export async function fetchCharacter(name: string): Promise<CharacterData | null> {
  if (!name?.trim()) return null

  // 1. 캐릭터 식별자(ocid) 조회
  const idData = await nexonFetch(
    `/maplestory/v1/id?character_name=${encodeURIComponent(name)}`
  )
  if (!idData?.ocid) return null

  const { ocid } = idData

  // 2. 기본 정보 + 스탯 병렬 조회
  const [basicData, statData] = await Promise.all([
    nexonFetch(`/maplestory/v1/character/basic?ocid=${ocid}`),
    nexonFetch(`/maplestory/v1/character/stat?ocid=${ocid}`),
  ])

  if (!basicData) return null

  return {
    basic: {
      character_name:       basicData.character_name,
      world_name:           basicData.world_name,
      character_class:      basicData.character_class,
      character_class_level: basicData.character_class_level,
      character_level:      basicData.character_level,
      character_exp:        basicData.character_exp,
      character_exp_rate:   basicData.character_exp_rate,
      character_guild_name: basicData.character_guild_name ?? "",
      character_image:      basicData.character_image ?? "",
      character_date_create: basicData.character_date_create ?? "",
    },
    stats: statData?.final_stat ?? [],
  }
}
