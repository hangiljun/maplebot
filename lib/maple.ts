export * from "./types"
import type {
  BasicCharacterData, CharacterData, CharacterHistory, HistoryPoint,
  CashItem, HexaCore, HexaStat,
  TimelineEvent, CharacterTimeline,
} from "./types"

const BASE_URL = "https://open.api.nexon.com"
const ocidCache = new Map<string, { ocid: string; ts: number }>()
const OCID_TTL  = 60 * 60 * 1000

function getApiKeys(): string[] {
  return [process.env.NEXON_API_KEY, process.env.NEXON_API_KEY_2].filter(Boolean) as string[]
}

async function nexonFetch(path: string, keyIndex = 0): Promise<any> {
  const keys = getApiKeys()
  if (keys.length === 0) throw new Error("NEXON_API_KEY 환경변수가 설정되지 않았습니다")

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "x-nxopen-api-key": keys[keyIndex % keys.length] },
    cache: "no-store",
  })

  if (!res.ok) {
    if (res.status === 429 && keyIndex + 1 < keys.length) return nexonFetch(path, keyIndex + 1)
    if (res.status === 429) {
      await new Promise(r => setTimeout(r, 1000))
      return nexonFetch(path, 0)
    }
    console.error(`Nexon API 오류 [${res.status}]:`, path)
    return null
  }
  return res.json()
}

async function getOcid(name: string): Promise<string | null> {
  const cached = ocidCache.get(name)
  if (cached && Date.now() - cached.ts < OCID_TTL) return cached.ocid

  const data = await nexonFetch(`/maplestory/v1/id?character_name=${encodeURIComponent(name)}`)
  if (!data?.ocid) return null

  ocidCache.set(name, { ocid: data.ocid, ts: Date.now() })
  return data.ocid
}

function mapBasic(r: any) {
  return {
    character_name:        r.character_name,
    world_name:            r.world_name,
    character_class:       r.character_class,
    character_class_level: r.character_class_level,
    character_level:       r.character_level,
    character_exp:         r.character_exp,
    character_exp_rate:    r.character_exp_rate,
    character_guild_name:  r.character_guild_name ?? "",
    character_image:       r.character_image ?? "",
    character_date_create: r.character_date_create ?? "",
  }
}

function mapUnion(r: any) {
  if (!r) return null
  return {
    union_level:          r.union_level,
    union_grade:          r.union_grade,
    union_artifact_level: r.union_artifact_level ?? 0,
    union_artifact_exp:   r.union_artifact_exp ?? 0,
    union_artifact_point: r.union_artifact_point ?? 0,
  }
}

function mapPreset(items: CashItem[]) {
  return (items ?? []).map(({ cash_item_equipment_part, cash_item_equipment_slot, cash_item_name, cash_item_icon, cash_item_label }: CashItem) =>
    ({ cash_item_equipment_part, cash_item_equipment_slot, cash_item_name, cash_item_icon, cash_item_label: cash_item_label ?? null }))
}

function kstDateString(daysAgo: number): string {
  const now = Date.now() + 9 * 60 * 60 * 1000
  return new Date(now - daysAgo * 86400000).toISOString().split("T")[0]
}

function formatKoDate(dateStr: string): string {
  const [, m, d] = dateStr.split("-")
  return `${parseInt(m)}월 ${parseInt(d)}일`
}

// 기본 정보만 조회 (4개 API 호출) — 빠른 첫 렌더링용
export async function fetchBasicCharacter(name: string): Promise<BasicCharacterData | null> {
  if (!name?.trim()) return null

  const ocid = await getOcid(name)
  if (!ocid) return null

  const q = `ocid=${ocid}`
  const [basicR, statR, popularityR, unionR] = await Promise.all([
    nexonFetch(`/maplestory/v1/character/basic?${q}`),
    nexonFetch(`/maplestory/v1/character/stat?${q}`),
    nexonFetch(`/maplestory/v1/character/popularity?${q}`),
    nexonFetch(`/maplestory/v1/user/union?${q}`),
  ])

  if (!basicR) return null

  return {
    basic:      mapBasic(basicR),
    stats:      statR?.final_stat ?? [],
    popularity: popularityR?.popularity ?? 0,
    union:      mapUnion(unionR),
  }
}

// 탭별 데이터 조회 — 클릭 시 on-demand 로드
export async function fetchTabData(name: string, tab: string): Promise<Record<string, unknown> | null> {
  const ocid = await getOcid(name)
  if (!ocid) return null

  const q = `ocid=${ocid}`

  switch (tab) {
    case "equipment": {
      const r = await nexonFetch(`/maplestory/v1/character/item-equipment?${q}`)
      return { equipment: r?.item_equipment ?? [] }
    }
    case "ability": {
      const r = await nexonFetch(`/maplestory/v1/character/ability?${q}`)
      return { ability: r ?? null }
    }
    case "symbol": {
      const r = await nexonFetch(`/maplestory/v1/character/symbol-equipment?${q}`)
      return { symbols: r?.symbol ?? [] }
    }
    case "hexa": {
      const [coreR, statR] = await Promise.all([
        nexonFetch(`/maplestory/v1/character/hexamatrix?${q}`),
        nexonFetch(`/maplestory/v1/character/hexamatrix-stat?${q}`),
      ])
      return {
        hexaCores: (coreR?.character_hexa_core_equipment ?? []).map(({ hexa_core_name, hexa_core_level, hexa_core_type }: HexaCore) => ({ hexa_core_name, hexa_core_level, hexa_core_type })),
        hexaStats: (statR?.character_hexa_stat_core ?? []).map(({ slot_id, main_stat_name, sub_stat_name_1, sub_stat_name_2, main_stat_level, sub_stat_level_1, sub_stat_level_2 }: HexaStat) => ({ slot_id, main_stat_name, sub_stat_name_1, sub_stat_name_2, main_stat_level, sub_stat_level_1, sub_stat_level_2 })),
      }
    }
    case "codi": {
      const [codiR, beautyR] = await Promise.all([
        nexonFetch(`/maplestory/v1/character/cashitem-equipment?${q}`),
        nexonFetch(`/maplestory/v1/character/beauty-equipment?${q}`),
      ])
      return {
        codi: codiR ? {
          gender: codiR.character_gender ?? "",
          hair:   beautyR?.character_hair?.hair_name ?? "",
          face:   beautyR?.character_face?.face_name ?? "",
          skin:   beautyR?.character_skin?.skin_name ?? "",
          preset1: mapPreset(codiR.character_cashitem_equipment_preset_1),
          preset2: mapPreset(codiR.character_cashitem_equipment_preset_2),
          preset3: mapPreset(codiR.character_cashitem_equipment_preset_3),
        } : null,
      }
    }
    case "battlepractice": {
      const replayData = await nexonFetch(`/maplestory/v1/battle-practice/replay-id?${q}`)
      if (!replayData?.replay_id) return { battlepractice: null }
      const result = await nexonFetch(`/maplestory/v1/battle-practice/result?replay_id=${replayData.replay_id}`)
      if (!result) return { battlepractice: null }
      return {
        battlepractice: {
          register_date:   replayData.register_date ?? "",
          total_play_time: result.total_play_time ?? 0,
          total_damage:    result.total_damage ?? 0,
          total_dps:       result.total_dps ?? 0,
          end_type:        result.end_type ?? "",
          like_count:      result.like_count ?? 0,
          skill_statistic: (result.skill_statistic ?? []).map((s: any) => ({
            skill_name:     s.skill_name ?? "",
            damage:         s.damage ?? 0,
            damage_percent: s.damage_percent ?? "0",
            dps:            s.dps ?? 0,
            use_count:      s.use_count ?? 0,
            max_damage:     s.max_damage ?? 0,
          })),
        },
      }
    }
    default:
      return null
  }
}

export async function fetchHistory(name: string): Promise<CharacterHistory | null> {
  const ocid = await getOcid(name)
  if (!ocid) return null

  const expDates = Array.from({ length: 7 }, (_, i) => kstDateString(i + 1))

  const levelDates: string[] = []
  for (let i = 7; i >= 0; i--) {
    const d = new Date(Date.now() + 9 * 60 * 60 * 1000)
    d.setUTCMonth(d.getUTCMonth() - i, 1)
    levelDates.push(d.toISOString().split("T")[0])
  }
  const yesterday = kstDateString(1)
  if (!levelDates.includes(yesterday)) levelDates.push(yesterday)

  const [expResults, levelResults, todayResult] = await Promise.all([
    Promise.all(expDates.map(date => nexonFetch(`/maplestory/v1/character/basic?ocid=${ocid}&date=${date}`).catch(() => null))),
    Promise.all(levelDates.map(date => nexonFetch(`/maplestory/v1/character/basic?ocid=${ocid}&date=${date}`).catch(() => null))),
    nexonFetch(`/maplestory/v1/character/basic?ocid=${ocid}`).catch(() => null),
  ])

  const expHistory: HistoryPoint[] = expDates
    .map((date, i) => ({ date: formatKoDate(date), value: parseFloat(expResults[i]?.character_exp_rate ?? "0") }))
    .filter(e => e.value > 0)
    .reverse()

  if (todayResult?.character_exp_rate) {
    expHistory.push({ date: "오늘", value: parseFloat(todayResult.character_exp_rate) })
  }

  const allLevels = levelDates
    .map((date, i) => ({ date: formatKoDate(date), value: levelResults[i]?.character_level ?? 0 }))
    .filter(e => e.value > 0)

  if (todayResult?.character_level) {
    const last = allLevels[allLevels.length - 1]
    if (!last || last.value !== todayResult.character_level) allLevels.push({ date: "오늘", value: todayResult.character_level })
    else if (last) last.date = "오늘"
  }

  const levelHistory: HistoryPoint[] = allLevels.filter((p, i) => i === 0 || p.value !== allLevels[i - 1].value)

  return { expHistory, levelHistory }
}

// ── 캐릭터 역사: 과거 6개월 닉네임·길드 변경 이력 ──────────────

/** 두 날짜 사이에서 field 값이 바뀐 정확한 날짜를 이진 탐색으로 찾음 */
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
  const r = await nexonFetch(
    `/maplestory/v1/character/basic?ocid=${ocid}&date=${midDate}`,
  ).catch(() => null)

  const midValue = r?.[field] ?? startValue
  return midValue === startValue
    ? binarySearchChange(ocid, midDate, endDate, field, startValue, depth + 1)
    : binarySearchChange(ocid, startDate, midDate, field, startValue, depth + 1)
}

const timelineCache = new Map<string, { data: CharacterTimeline; ts: number }>()
const TIMELINE_TTL = 30 * 60 * 1000 // 30분

export async function fetchCharacterTimeline(name: string): Promise<CharacterTimeline | null> {
  const cached = timelineCache.get(name)
  if (cached && Date.now() - cached.ts < TIMELINE_TTL) return cached.data

  const ocid = await getOcid(name)
  if (!ocid) return null

  // 21일(3주) 간격으로 체크포인트 생성 (6개월 ≈ 182일 = 8개 포인트)
  const today = new Date(Date.now() + 9 * 3600000) // KST
  const checkpoints: string[] = []
  for (let days = 21; days <= 182; days += 21) {
    const d = new Date(today)
    d.setDate(d.getDate() - days)
    checkpoints.push(d.toISOString().split("T")[0])
  }
  checkpoints.reverse() // 오래된 순 (182일 전 → 21일 전)

  // 모든 체크포인트 병렬 조회
  const snapshots = await Promise.all(
    checkpoints.map(date =>
      nexonFetch(`/maplestory/v1/character/basic?ocid=${ocid}&date=${date}`)
        .then(r => r ? { date, name: r.character_name as string, guild: (r.character_guild_name as string) ?? "" } : null)
        .catch(() => null),
    ),
  )

  const valid = snapshots.filter(Boolean) as { date: string; name: string; guild: string }[]
  if (valid.length < 2) return { events: [], checkedFrom: checkpoints[0] }

  // 연속 스냅샷 비교 → 변경 감지 → 이진 탐색으로 정확한 날짜 확인
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
  const events = results
    .filter(Boolean)
    .sort((a, b) => b!.date.localeCompare(a!.date)) as TimelineEvent[]

  const result: CharacterTimeline = { events, checkedFrom: valid[0].date }
  timelineCache.set(name, { data: result, ts: Date.now() })
  return result
}

// 하위 호환 — /api/maple/character 라우트용
export async function fetchCharacter(name: string): Promise<CharacterData | null> {
  if (!name?.trim()) return null

  const ocid = await getOcid(name)
  if (!ocid) return null

  const q = `ocid=${ocid}`

  const [basicR, popularityR, statR, equipR, abilityR, unionR] = await Promise.all([
    nexonFetch(`/maplestory/v1/character/basic?${q}`),
    nexonFetch(`/maplestory/v1/character/popularity?${q}`),
    nexonFetch(`/maplestory/v1/character/stat?${q}`),
    nexonFetch(`/maplestory/v1/character/item-equipment?${q}`),
    nexonFetch(`/maplestory/v1/character/ability?${q}`),
    nexonFetch(`/maplestory/v1/user/union?${q}`),
  ])

  if (!basicR) return null

  const [symbolR, hexaCoreR, hexaStatR, codiR, beautyR] = await Promise.all([
    nexonFetch(`/maplestory/v1/character/symbol-equipment?${q}`),
    nexonFetch(`/maplestory/v1/character/hexamatrix?${q}`),
    nexonFetch(`/maplestory/v1/character/hexamatrix-stat?${q}`),
    nexonFetch(`/maplestory/v1/character/cashitem-equipment?${q}`),
    nexonFetch(`/maplestory/v1/character/beauty-equipment?${q}`),
  ])

  return {
    basic:      mapBasic(basicR),
    popularity: popularityR?.popularity ?? 0,
    stats:      statR?.final_stat ?? [],
    equipment:  equipR?.item_equipment ?? [],
    ability:    abilityR ?? null,
    union:      mapUnion(unionR),
    symbols:    symbolR?.symbol ?? [],
    hexaCores:  (hexaCoreR?.character_hexa_core_equipment ?? []).map(({ hexa_core_name, hexa_core_level, hexa_core_type }: HexaCore) => ({ hexa_core_name, hexa_core_level, hexa_core_type })),
    hexaStats:  (hexaStatR?.character_hexa_stat_core ?? []).map(({ slot_id, main_stat_name, sub_stat_name_1, sub_stat_name_2, main_stat_level, sub_stat_level_1, sub_stat_level_2 }: HexaStat) => ({ slot_id, main_stat_name, sub_stat_name_1, sub_stat_name_2, main_stat_level, sub_stat_level_1, sub_stat_level_2 })),
    codi: codiR ? {
      gender: codiR.character_gender ?? "",
      hair:   beautyR?.character_hair?.hair_name ?? "",
      face:   beautyR?.character_face?.face_name ?? "",
      skin:   beautyR?.character_skin?.skin_name ?? "",
      preset1: mapPreset(codiR.character_cashitem_equipment_preset_1),
      preset2: mapPreset(codiR.character_cashitem_equipment_preset_2),
      preset3: mapPreset(codiR.character_cashitem_equipment_preset_3),
    } : null,
  }
}
