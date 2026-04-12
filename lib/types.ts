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
  item_base_option?: Record<string, string>
  item_add_option?: Record<string, string>
  item_etc_option?: Record<string, string>
  item_starforce_option?: Record<string, string>
  scroll_upgrade?: string
  scroll_upgradeable_count?: string
  scroll_resilience_count?: string
  cuttable_count?: string
  golden_hammer_flag?: string
  soul_name?: string | null
  soul_option?: string | null
  item_exceptional_option?: Record<string, string>
}

export interface AbilityLine {
  ability_no: string
  ability_grade: string
  ability_value: string
}

export interface AbilityInfo {
  ability_grade: string
  ability_info: AbilityLine[]
}

export interface UnionInfo {
  union_level: number
  union_grade: string
  union_artifact_level: number
  union_artifact_exp: number
  union_artifact_point: number
}

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

export interface BasicCharacterData {
  basic: CharacterBasic
  stats: StatItem[]
  popularity: number
  union: UnionInfo | null
}

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

export interface TabEquipment { equipment: EquipmentItem[] }
export interface TabAbility   { ability: AbilityInfo | null }
export interface TabSymbol    { symbols: SymbolItem[] }
export interface TabHexa      { hexaCores: HexaCore[]; hexaStats: HexaStat[] }
export interface TabCodi      { codi: CodiInfo | null }

export interface HistoryPoint {
  date: string
  value: number
}

export interface CharacterHistory {
  expHistory: HistoryPoint[]
  levelHistory: HistoryPoint[]
}

export type TimelineEventType = "nickname" | "guild"

export interface TimelineEvent {
  type: TimelineEventType
  date: string   // YYYY-MM-DD
  from: string
  to: string
}

export interface CharacterTimeline {
  events: TimelineEvent[]
  checkedFrom: string   // 조회 시작 날짜
}

export const MAIN_STATS   = ["STR", "DEX", "INT", "LUK"]
export const BATTLE_STATS = ["HP", "MP", "공격력", "마력"]
export const DETAIL_STATS = ["보스 몬스터 데미지", "방어율 무시", "크리티컬 확률", "크리티컬 데미지", "방어력"]
export const COMBAT_POWER_STAT = "전투력"

export const POTENTIAL_COLORS: Record<string, string> = {
  "레전드리": "#FF8C00",
  "유니크":   "#EAB308",
  "에픽":     "#A855F7",
  "레어":     "#3B82F6",
}
