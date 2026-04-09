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
  unionLevel: number | null
  unionGrade: string | null
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

export async function fetchImageAsBase64(url: string): Promise<string> {
  if (!url) return ""
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 5000)
    const res = await fetch(url, {
      headers: { "x-nxopen-api-key": API_KEY },
      signal: controller.signal,
    })
    clearTimeout(timer)
    if (!res.ok) return ""
    const mime = res.headers.get("content-type") ?? "image/png"
    const buf = Buffer.from(await res.arrayBuffer())
    return `data:${mime};base64,${buf.toString("base64")}`
  } catch {
    return ""
  }
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

export async function fetchHexa(name: string): Promise<{ cores: HexaCore[]; stats: HexaStat[] } | null> {
  const idData = await nexonFetch(`/maplestory/v1/id?character_name=${encodeURIComponent(name)}`)
  if (!idData?.ocid) return null
  const q = `ocid=${idData.ocid}`

  const [coreR, statR] = await Promise.all([
    nexonFetch(`/maplestory/v1/character/hexamatrix?${q}`),
    nexonFetch(`/maplestory/v1/character/hexamatrix-stat?${q}`),
  ])

  return {
    cores: (coreR?.character_hexa_core_equipment ?? []).map((h: HexaCore) => ({
      hexa_core_name:  h.hexa_core_name,
      hexa_core_level: h.hexa_core_level,
      hexa_core_type:  h.hexa_core_type,
    })),
    stats: (statR?.character_hexa_stat_core ?? []).map((s: HexaStat) => ({
      slot_id:          s.slot_id,
      main_stat_name:   s.main_stat_name,
      sub_stat_name_1:  s.sub_stat_name_1,
      sub_stat_name_2:  s.sub_stat_name_2,
      main_stat_level:  s.main_stat_level,
      sub_stat_level_1: s.sub_stat_level_1,
      sub_stat_level_2: s.sub_stat_level_2,
    })),
  }
}

function kstDateString(daysAgo: number): string {
  const now = Date.now() + 9 * 60 * 60 * 1000
  const d = new Date(now - daysAgo * 86400000)
  return d.toISOString().split("T")[0]
}

export async function fetchLevelHistory(name: string): Promise<{ expHistory: { date: string; value: number }[]; levelHistory: { date: string; value: number }[] } | null> {
  const idData = await nexonFetch(`/maplestory/v1/id?character_name=${encodeURIComponent(name)}`)
  if (!idData?.ocid) return null
  const { ocid } = idData

  const expDates = Array.from({ length: 7 }, (_, i) => kstDateString(i + 1))
  const levelDates: string[] = []
  for (let i = 11; i >= 0; i--) {
    const d = new Date(Date.now() + 9 * 60 * 60 * 1000)
    d.setUTCMonth(d.getUTCMonth() - i, 1)
    levelDates.push(d.toISOString().split("T")[0])
  }

  const [expResults, levelResults, todayR] = await Promise.all([
    Promise.all(expDates.map(date =>
      nexonFetch(`/maplestory/v1/character/basic?ocid=${ocid}&date=${date}`).catch(() => null)
    )),
    Promise.all(levelDates.map(date =>
      nexonFetch(`/maplestory/v1/character/basic?ocid=${ocid}&date=${date}`).catch(() => null)
    )),
    nexonFetch(`/maplestory/v1/character/basic?ocid=${ocid}`).catch(() => null),
  ])

  const fmt = (dateStr: string) => {
    const [, m, d] = dateStr.split("-")
    return `${parseInt(m)}/${parseInt(d)}`
  }

  const expHistory = expDates
    .map((date, i) => ({ date: fmt(date), value: parseFloat(expResults[i]?.character_exp_rate ?? "0") }))
    .filter(e => e.value > 0)
    .reverse()

  if (todayR?.character_exp_rate) {
    expHistory.push({ date: "오늘", value: parseFloat(todayR.character_exp_rate) })
  }

  const allLevels = levelDates.map((date, i) => ({
    date: fmt(date),
    value: levelResults[i]?.character_level ?? 0,
  })).filter(e => e.value > 0)

  if (todayR?.character_level) {
    const last = allLevels[allLevels.length - 1]
    if (!last || last.value !== todayR.character_level) {
      allLevels.push({ date: "오늘", value: todayR.character_level })
    } else if (last) {
      last.date = "오늘"
    }
  }

  const levelHistory = allLevels.filter((p, i) => i === 0 || p.value !== allLevels[i - 1].value)

  return { expHistory, levelHistory }
}

export async function fetchCharacterSummary(name: string): Promise<CharacterSummary | null> {
  // ocid 조회
  const idData = await nexonFetch(`/maplestory/v1/id?character_name=${encodeURIComponent(name)}`)
  if (!idData?.ocid) return null
  const { ocid } = idData

  const q = `ocid=${ocid}`

  // 기본 정보 + 인기도 + 스탯 + 유니온 병렬 조회
  const [basic, popularityData, statData, unionData] = await Promise.all([
    nexonFetch(`/maplestory/v1/character/basic?${q}`),
    nexonFetch(`/maplestory/v1/character/popularity?${q}`),
    nexonFetch(`/maplestory/v1/character/stat?${q}`),
    nexonFetch(`/maplestory/v1/user/union?ocid=${ocid}`),
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
    unionLevel:     unionData?.union_level ?? null,
    unionGrade:     unionData?.union_grade ?? null,
  }
}
