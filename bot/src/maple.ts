import * as dotenv from "dotenv"
dotenv.config()

const BASE_URL = "https://open.api.nexon.com"
const API_KEYS = [
  process.env.NEXON_API_KEY,
  process.env.NEXON_API_KEY_2,
].filter(Boolean) as string[]

const ocidCache     = new Map<string, { ocid: string; ts: number }>()
const summaryCache  = new Map<string, { data: CharacterSummary; ts: number }>()
const levelCache    = new Map<string, { data: { expHistory: { date: string; value: number }[]; levelHistory: { date: string; value: number }[] }; ts: number }>()
const timelineCache = new Map<string, { data: { events: TimelineEvent[]; checkedFrom: string }; ts: number }>()

const OCID_TTL     = 60 * 60 * 1000       // 1시간
const SUMMARY_TTL  = 30 * 60 * 1000       // 30분
const LEVEL_TTL    = 30 * 60 * 1000       // 30분
const TIMELINE_TTL = 2 * 60 * 60 * 1000   // 2시간

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
    if (res.status === 429) {
      if (keyIndex + 1 < API_KEYS.length) return nexonFetch(path, keyIndex + 1)
      await new Promise(r => setTimeout(r, 2000))
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
  scrollUpgrade: number
  scrollUpgradeableCount: number
  cuttableCount: number
  goldenHammer: boolean
  soulName: string | null
  soulOption: string | null
  totalStats: Record<string, number>
}

const STAT_LABEL: Record<string, string> = {
  str: "STR", dex: "DEX", int: "INT", luk: "LUK",
  max_hp: "최대 HP", max_mp: "최대 MP",
  attack_power: "공격력", magic_power: "마력",
  armor: "방어력", all_stat: "올스탯%",
  boss_damage: "보스 데미지%", ignore_monster_armor: "방어율 무시%",
  damage: "데미지%", speed: "이동속도", jump: "점프력",
}

export async function fetchEquipment(name: string): Promise<EquipItem[] | null> {
  const ocid = await getOcid(name)
  if (!ocid) return null
  const q = `ocid=${ocid}`

  const data = await nexonFetch(`/maplestory/v1/character/item-equipment?${q}`)
  if (!data?.item_equipment) return null

  return data.item_equipment.map((item: any) => {
    const total = item.item_total_option ?? {}
    const totalStats: Record<string, number> = {}
    for (const [k, label] of Object.entries(STAT_LABEL)) {
      const v = Number(total[k] ?? 0)
      if (v !== 0) totalStats[label] = v
    }

    return {
      slot:                   item.item_equipment_slot ?? "",
      name:                   item.item_name ?? "",
      starforce:              Number(item.starforce ?? 0),
      potential:              item.potential_option_grade ?? "",
      additionalPotential:    item.additional_potential_option_grade ?? "",
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
      icon:                   item.item_icon ?? "",
      scrollUpgrade:          Number(item.scroll_upgrade ?? 0),
      scrollUpgradeableCount: Number(item.scroll_upgradeable_count ?? 0),
      cuttableCount:          Number(item.cuttable_count ?? 0),
      goldenHammer:           item.golden_hammer_flag === "적용",
      soulName:               item.soul_name ?? null,
      soulOption:             item.soul_option ?? null,
      totalStats,
    }
  })
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

async function scanWindowForChanges(
  ocid: string,
  prev: { date: string; name: string; guild: string },
  curr: { date: string; name: string; guild: string },
  keyOffset: number,
): Promise<TimelineEvent[]> {
  const s = new Date(prev.date).getTime()
  const e = new Date(curr.date).getTime()
  const dayMs = 86400000

  const dates: string[] = []
  for (let t = s + dayMs; t < e; t += dayMs)
    dates.push(new Date(t).toISOString().split("T")[0])

  if (dates.length === 0) {
    const events: TimelineEvent[] = []
    if (prev.name !== curr.name)
      events.push({ type: "nickname", date: curr.date, from: prev.name, to: curr.name })
    if (prev.guild !== curr.guild)
      events.push({ type: "guild", date: curr.date, from: prev.guild || "없음", to: curr.guild || "없음" })
    return events
  }

  const snapshots = await Promise.all(
    dates.map((date, i) =>
      nexonFetch(`/maplestory/v1/character/basic?ocid=${ocid}&date=${date}`, (keyOffset + i) % 2)
        .then((r: any) => r ? { date, name: (r.character_name as string) ?? prev.name, guild: (r.character_guild_name as string) ?? "" } : null)
        .catch(() => null)
    )
  )

  const points = [prev, ...snapshots.filter(Boolean) as typeof prev[], curr]
  const events: TimelineEvent[] = []

  for (let i = 1; i < points.length; i++) {
    const p = points[i - 1], c = points[i]
    if (p.name !== c.name && (i === 1 || points[i - 2].name === p.name))
      events.push({ type: "nickname", date: c.date, from: p.name, to: c.name })
    if (p.guild !== c.guild && (i === 1 || points[i - 2].guild === p.guild))
      events.push({ type: "guild", date: c.date, from: p.guild || "없음", to: c.guild || "없음" })
  }

  return events
}

export async function fetchCharacterTimeline(name: string): Promise<{ events: TimelineEvent[]; checkedFrom: string } | null> {
  const cached = timelineCache.get(name)
  if (cached && Date.now() - cached.ts < TIMELINE_TTL) return cached.data

  const ocid = await getOcid(name)
  if (!ocid) return null

  const today = new Date(Date.now() + 9 * 3600000)
  const checkpoints: string[] = []
  for (let days = 21; days <= 182; days += 21) {
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

  const windowJobs: Promise<TimelineEvent[]>[] = []
  for (let i = 1; i < valid.length; i++) {
    const prev = valid[i - 1], curr = valid[i]
    if (prev.name !== curr.name || prev.guild !== curr.guild)
      windowJobs.push(scanWindowForChanges(ocid, prev, curr, i * 2))
  }

  const allEvents = (await Promise.all(windowJobs)).flat()
  const events = allEvents.sort((a, b) => b.date.localeCompare(a.date))

  const result = { events, checkedFrom: valid[0].date }
  timelineCache.set(name, { data: result, ts: Date.now() })
  return result
}

function kstDateString(daysAgo: number): string {
  const now = Date.now() + 9 * 60 * 60 * 1000
  const d = new Date(now - daysAgo * 86400000)
  return d.toISOString().split("T")[0]
}

export async function fetchLevelHistory(name: string): Promise<{ expHistory: { date: string; value: number }[]; levelHistory: { date: string; value: number }[] } | null> {
  const cached = levelCache.get(name)
  if (cached && Date.now() - cached.ts < LEVEL_TTL) return cached.data

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

  const result = { expHistory, levelHistory }
  levelCache.set(name, { data: result, ts: Date.now() })
  return result
}

export interface BattlePracticeSkill {
  skillName: string
  damage: number
  damagePercent: string
  dps: number
  useCount: number
  maxDamage: number
}

export interface BattlePracticeResult {
  registerDate: string
  totalPlayTimeMs: number
  totalDamage: number
  totalDps: number
  endType: string
  likeCount: number
  skillStatistic: BattlePracticeSkill[]
}

export async function fetchBattlePractice(name: string): Promise<BattlePracticeResult | null> {
  const ocid = await getOcid(name)
  if (!ocid) return null

  const replayData = await nexonFetch(`/maplestory/v1/battle-practice/replay-id?ocid=${ocid}`)
  if (!replayData?.replay_id) return null

  const result = await nexonFetch(`/maplestory/v1/battle-practice/result?replay_id=${replayData.replay_id}`)
  if (!result) return null

  return {
    registerDate:    replayData.register_date ?? "",
    totalPlayTimeMs: result.total_play_time ?? 0,
    totalDamage:     result.total_damage ?? 0,
    totalDps:        result.total_dps ?? 0,
    endType:         result.end_type ?? "",
    likeCount:       result.like_count ?? 0,
    skillStatistic:  (result.skill_statistic ?? []).map((s: any) => ({
      skillName:     s.skill_name ?? "",
      damage:        s.damage ?? 0,
      damagePercent: s.damage_percent ?? "0",
      dps:           s.dps ?? 0,
      useCount:      s.use_count ?? 0,
      maxDamage:     s.max_damage ?? 0,
    })),
  }
}


export async function fetchCharacterSummary(name: string): Promise<CharacterSummary | null> {
  const cached = summaryCache.get(name)
  if (cached && Date.now() - cached.ts < SUMMARY_TTL) return cached.data

  const ocid = await getOcid(name)
  if (!ocid) return null

  const q = `ocid=${ocid}`
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

  const result: CharacterSummary = {
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
  summaryCache.set(name, { data: result, ts: Date.now() })
  return result
}
