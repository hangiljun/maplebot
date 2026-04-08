// ─────────────────────────────────────────────────────────────
// 메이플스토리 캐릭터 데이터 타입 & fetch 함수
// API 코드를 받으면 fetchCharacter 함수 내부를 교체하세요
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
// TODO: 아래 함수를 Nexon API 코드로 교체하세요
// ─────────────────────────────────────────────────────────────
export async function fetchCharacter(name: string): Promise<CharacterData | null> {
  if (!name?.trim()) return null

  // ↓↓↓ 여기를 실제 Nexon API 호출 코드로 교체 ↓↓↓
  return {
    basic: {
      character_name: name,
      world_name: "스카니아",
      character_class: "아크메이지(불,독)",
      character_class_level: "6",
      character_level: 250,
      character_exp: 23456789012,
      character_exp_rate: "67.89",
      character_guild_name: "TestGuild",
      character_image: "",
      character_date_create: "2020-03-15T00:00:00.000+09:00",
    },
    stats: [
      { stat_name: "STR",              stat_value: "550" },
      { stat_name: "DEX",              stat_value: "550" },
      { stat_name: "INT",              stat_value: "11,250" },
      { stat_name: "LUK",              stat_value: "550" },
      { stat_name: "HP",               stat_value: "42,850" },
      { stat_name: "MP",               stat_value: "31,710" },
      { stat_name: "공격력",            stat_value: "1,580" },
      { stat_name: "마력",              stat_value: "3,120" },
      { stat_name: "방어력",            stat_value: "6,200" },
      { stat_name: "보스 몬스터 데미지", stat_value: "280%" },
      { stat_name: "방어율 무시",        stat_value: "94%" },
      { stat_name: "크리티컬 확률",      stat_value: "100%" },
      { stat_name: "크리티컬 데미지",    stat_value: "60%" },
    ],
  }
  // ↑↑↑ 여기까지 교체 ↑↑↑
}
