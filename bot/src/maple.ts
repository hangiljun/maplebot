import * as dotenv from "dotenv"
dotenv.config()

const BASE_URL = "https://open.api.nexon.com"
const API_KEY  = process.env.NEXON_API_KEY!

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function nexonFetch(path: string): Promise<any> {
  if (!API_KEY) {
    console.error("❌ NEXON_API_KEY 환경변수가 설정되지 않았습니다")
    return null
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "x-nxopen-api-key": API_KEY },
  })
  if (!res.ok) {
    console.error(`❌ Nexon API 오류 [${res.status}] ${path}`)
    return null
  }
  return res.json()
}

export interface CharacterSummary {
  name: string
  world: string
  characterClass: string
  level: number
  expRate: string
  guild: string
  image: string
  popularity: number
  combatPower: string
  dateCreate: string
}

export interface EquipItem {
  slot: string
  name: string
  starforce: number
  potential: string
  additionalPotential: string
  potentials: string[]
  additionalPotentials: string[]
  icon: string
}

export async function fetchEquipment(name: string): Promise<EquipItem[] | null> {
  const idData = await nexonFetch(`/maplestory/v1/id?character_name=${encodeURIComponent(name)}`)
  if (!idData?.ocid) return null
  const q = `ocid=${idData.ocid}`

  const data = await nexonFetch(`/maplestory/v1/character/item-equipment?${q}`)
  if (!data?.item_equipment) return null

  return data.item_equipment.map((item: any) => ({
    slot:                item.item_equipment_slot ?? "",
    name:                item.item_name ?? "",
    starforce:           Number(item.starforce ?? 0),
    potential:           item.potential_option_grade ?? "",
    additionalPotential: item.additional_potential_option_grade ?? "",
    potentials: [
      item.potential_option_1,
      item.potential_option_2,
      item.potential_option_3,
    ].filter(Boolean) as string[],
    additionalPotentials: [
      item.additional_potential_option_1,
      item.additional_potential_option_2,
      item.additional_potential_option_3,
    ].filter(Boolean) as string[],
    icon: item.item_icon ?? "",
  }))
}

export async function fetchCharacterSummary(name: string): Promise<CharacterSummary | null> {
  // ocid 조회
  const idData = await nexonFetch(`/maplestory/v1/id?character_name=${encodeURIComponent(name)}`)
  if (!idData?.ocid) return null
  const { ocid } = idData

  const q = `ocid=${ocid}`

  // 기본 정보 + 인기도 + 스탯 병렬 조회
  const [basic, popularityData, statData] = await Promise.all([
    nexonFetch(`/maplestory/v1/character/basic?${q}`),
    nexonFetch(`/maplestory/v1/character/popularity?${q}`),
    nexonFetch(`/maplestory/v1/character/stat?${q}`),
  ])

  if (!basic) return null

  const combatPower = statData?.final_stat?.find(
    (s: { stat_name: string }) => s.stat_name === "전투력"
  )?.stat_value ?? "0"

  return {
    name:           basic.character_name,
    world:          basic.world_name,
    characterClass: basic.character_class,
    level:          basic.character_level,
    expRate:        basic.character_exp_rate,
    guild:          basic.character_guild_name ?? "",
    image:          basic.character_image ?? "",
    popularity:     popularityData?.popularity ?? 0,
    combatPower,
    dateCreate:     basic.character_date_create ?? "",
  }
}
