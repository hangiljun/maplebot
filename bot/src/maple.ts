import * as dotenv from "dotenv"
dotenv.config()

const BASE_URL = "https://open.api.nexon.com"
const API_KEYS = [
  process.env.NEXON_API_KEY,
  process.env.NEXON_API_KEY_2,
].filter(Boolean) as string[]

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function nexonFetch(path: string, keyIndex = 0): Promise<any> {
  if (API_KEYS.length === 0) {
    console.error("❌ NEXON_API_KEY 환경변수가 설정되지 않았습니다")
    return null
  }
  const key = API_KEYS[keyIndex % API_KEYS.length]
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "x-nxopen-api-key": key },
  })
  if (!res.ok) {
    if (res.status === 429 && keyIndex + 1 < API_KEYS.length) {
      // 다음 키로 재시도
      return nexonFetch(path, keyIndex + 1)
    }
    if (res.status === 429 && keyIndex + 1 >= API_KEYS.length) {
      await new Promise((r) => setTimeout(r, 2000))
      return nexonFetch(path, 0)
    }
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
  const ocid = await getOcid(name)
  if (!ocid) return null
  const q = `ocid=${ocid}`

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
      headers: { "x-nxopen-api-key": API_KEYS[0] },
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

export interface CodiPresetItem {
  part: string
  name: string
  label: string | null
}

export interface CodiSummary {
  hair: string
  face: string
  skin: string
  equipped: CodiPresetItem[]
}

export async function fetchCodi(name: string): Promise<CodiSummary | null> {
  const ocid = await getOcid(name)
  if (!ocid) return null
  const q = `ocid=${ocid}`

  const [codiR, beautyR] = await Promise.all([
    nexonFetch(`/maplestory/v1/character/cashitem-equipment?${q}`),
    nexonFetch(`/maplestory/v1/character/beauty-equipment?${q}`),
  ])

  if (!codiR) return null

  const mapItems = (arr: any[]): CodiPresetItem[] =>
    (arr ?? []).map((c: any) => ({
      part:  c.cash_item_equipment_part ?? "",
      name:  c.cash_item_name ?? "",
      label: c.cash_item_label ?? null,
    }))

  return {
    hair:     beautyR?.character_hair?.hair_name ?? "",
    face:     beautyR?.character_face?.face_name ?? "",
    skin:     beautyR?.character_skin?.skin_name ?? "",
    equipped: mapItems(codiR.character_cashitem_equipment_base),
  }
}

export async function fetchHexa(name: string): Promise<{ cores: HexaCore[]; stats: HexaStat[] } | null> {
  const ocid = await getOcid(name)
  if (!ocid) return null
  const q = `ocid=${ocid}`

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

export interface TimelineEvent {
  type: "nickname" | "guild"
  date: string
  from: string
  to: string
}

async function binarySearchChange(
  ocid: string,
  startDate: string,
  endDate: string,
  field: "character_name" | "character_guild_name",
  startValue: string,
  depth = 0,
): Promise<string> {
  if (depth >= 8) return endDate
  const s = new Date(startDate).getTime()
  const e = new Date(endDate).getTime()
  if ((e - s) / 86400000 <= 1) return endDate
  const midDate = new Date(Math.floor((s + e) / 2)).toISOString().split("T")[0]
  const r = await nexonFetch(`/maplestory/v1/character/basic?ocid=${ocid}&date=${midDate}`).catch(() => null)
  const midValue = r?.[field] ?? startValue
  return midValue === startValue
    ? binarySearchChange(ocid, midDate, endDate, field, startValue, depth + 1)
    : binarySearchChange(ocid, startDate, midDate, field, startValue, depth + 1)
}

export async function fetchCharacterTimeline(name: string): Promise<{ events: TimelineEvent[]; checkedFrom: string } | null> {
  const ocid = await getOcid(name)
  if (!ocid) return null

  const today = new Date(Date.now() + 9 * 3600000)
  const checkpoints: string[] = []
  for (let days = 14; days <= 182; days += 14) {
    const d = new Date(today)
    d.setDate(d.getDate() - days)
    checkpoints.push(d.toISOString().split("T")[0])
  }
  checkpoints.reverse()

  const snapshots = await Promise.all(
    checkpoints.map(date =>
      nexonFetch(`/maplestory/v1/character/basic?ocid=${ocid}&date=${date}`)
        .then((r: any) => r ? { date, name: r.character_name as string, guild: (r.character_guild_name as string) ?? "" } : null)
        .catch(() => null),
    ),
  )

  const valid = snapshots.filter(Boolean) as { date: string; name: string; guild: string }[]
  if (valid.length < 2) return { events: [], checkedFrom: checkpoints[0] }

  const changeJobs: Promise<TimelineEvent | null>[] = []
  for (let i = 1; i < valid.length; i++) {
    const prev = valid[i - 1]
    const curr = valid[i]
    if (prev.name !== curr.name) {
      changeJobs.push(
        binarySearchChange(ocid, prev.date, curr.date, "character_name", prev.name)
          .then(date => ({ type: "nickname" as const, date, from: prev.name, to: curr.name }))
      )
    }
    if (prev.guild !== curr.guild) {
      changeJobs.push(
        binarySearchChange(ocid, prev.date, curr.date, "character_guild_name", prev.guild)
          .then(date => ({ type: "guild" as const, date, from: prev.guild || "없음", to: curr.guild || "없음" }))
      )
    }
  }

  const results = await Promise.all(changeJobs)
  const events = (results.filter(Boolean) as TimelineEvent[])
    .sort((a, b) => b.date.localeCompare(a.date))

  return { events, checkedFrom: valid[0].date }
}

function kstDateString(daysAgo: number): string {
  const now = Date.now() + 9 * 60 * 60 * 1000
  const d = new Date(now - daysAgo * 86400000)
  return d.toISOString().split("T")[0]
}

export async function fetchLevelHistory(name: string): Promise<{ expHistory: { date: string; value: number }[]; levelHistory: { date: string; value: number }[] } | null> {
  const ocid = await getOcid(name)
  if (!ocid) return null

  // 경험치: 최근 7일 (1~7일 전)
  const expDates = Array.from({ length: 7 }, (_, i) => kstDateString(i + 1))

  // 레벨: 최근 30일 매일 조회 (레벨업 날짜 정확히 포착)
  const levelDates = Array.from({ length: 30 }, (_, i) => kstDateString(i + 1)).reverse()

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

  const allLevels = levelDates
    .map((date, i) => ({ date: fmt(date), value: levelResults[i]?.character_level ?? 0 }))
    .filter(e => e.value > 0)

  // 오늘 실시간 레벨 항상 마지막에 추가
  if (todayR?.character_level) {
    allLevels.push({ date: "오늘", value: todayR.character_level })
  }

  // 연속된 같은 레벨 제거 (오늘은 항상 유지)
  const levelHistory = allLevels.filter((p, i, arr) =>
    p.date === "오늘" || i === 0 || p.value !== arr[i - 1].value
  )

  return { expHistory, levelHistory }
}

export interface UnionDetail {
  grade: string
  level: number
  artifactLevel: number
  artifactExp: number
  artifactPoint: number
}

export async function fetchUnion(name: string): Promise<UnionDetail | null> {
  const ocid = await getOcid(name)
  if (!ocid) return null

  const r = await nexonFetch(`/maplestory/v1/user/union?ocid=${ocid}`)
  if (!r) return null

  return {
    grade:         r.union_grade         ?? "정보 없음",
    level:         r.union_level         ?? 0,
    artifactLevel: r.union_artifact_level ?? 0,
    artifactExp:   r.union_artifact_exp   ?? 0,
    artifactPoint: r.union_artifact_point ?? 0,
  }
}

export interface LinkSkill {
  name:   string
  level:  number
  effect: string
}

export interface LinkSkillInfo {
  ownSkill:      LinkSkill | null   // 이 캐릭터가 제공하는 링크 스킬
  linkedSkills:  LinkSkill[]        // 장착된 링크 스킬 목록
}

export async function fetchLinkSkills(name: string): Promise<LinkSkillInfo | null> {
  const ocid = await getOcid(name)
  if (!ocid) return null

  const r = await nexonFetch(`/maplestory/v1/character/link-skill?ocid=${ocid}`)
  if (!r) return null

  const mapSkill = (s: any): LinkSkill => ({
    name:   s.skill_name   ?? "",
    level:  s.skill_level  ?? 0,
    effect: s.skill_effect ?? "",
  })

  const own = r.character_class_link_skill?.[0]
  return {
    ownSkill:     own ? mapSkill(own) : null,
    linkedSkills: (r.character_link_skill ?? []).map(mapSkill),
  }
}

export async function fetchCharacterSummary(name: string): Promise<CharacterSummary | null> {
  const ocid = await getOcid(name)
  if (!ocid) return null

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
