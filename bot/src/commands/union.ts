import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ButtonInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js"
import { UNION_DATA } from "../data/union"
import { JOB_TREE, GROUP_KEYWORDS, SUBCLASS_KEYWORDS } from "../data/jobTree"

export const data = new SlashCommandBuilder()
  .setName("유니온")
  .setDescription("유니온 캐릭터 효과를 검색합니다 (직업명, 직업군, 효과 키워드)")
  .addStringOption(opt =>
    opt.setName("검색어")
       .setDescription("예: 모험가 / 전사 / 메르세데스 / 크리티컬")
       .setRequired(true)
  )

// ── 타입 ────────────────────────────────────────────────────
type Grade = "B" | "A" | "S" | "SS" | "SSS"

const GRADE_LEVEL: Record<Grade, number> = {
  B: 60, A: 100, S: 140, SS: 200, SSS: 250,
}
const GRADE_COLOR: Record<Grade, number> = {
  B: 0x6b7280, A: 0x22c55e, S: 0x3b82f6, SS: 0xa855f7, SSS: 0xf97316,
}

// ── 유틸 ────────────────────────────────────────────────────
function makeRows(buttons: ButtonBuilder[]): ActionRowBuilder<ButtonBuilder>[] {
  const rows: ActionRowBuilder<ButtonBuilder>[] = []
  for (let i = 0; i < buttons.length; i += 5)
    rows.push(new ActionRowBuilder<ButtonBuilder>().addComponents(...buttons.slice(i, i + 5)))
  return rows
}

function gradeRows(grade: Grade, query: string): ActionRowBuilder<ButtonBuilder>[] {
  const grades: Grade[] = ["B", "A", "S", "SS", "SSS"]
  return [new ActionRowBuilder<ButtonBuilder>().addComponents(
    ...grades.map(g =>
      new ButtonBuilder()
        .setCustomId(`uniongrade:${g}:${query}`)
        .setLabel(`${g}등급 (${GRADE_LEVEL[g]})`)
        .setStyle(g === grade ? ButtonStyle.Primary : ButtonStyle.Secondary)
        .setDisabled(g === grade)
    )
  )]
}

// ── 임베드 빌더 ────────────────────────────────────────────
/** 직업군 선택 → 세부 직업 버튼 */
function buildGroupEmbed(group: string) {
  const subclasses = Object.keys(JOB_TREE[group] ?? {})
  const buttons = subclasses.map(sub =>
    new ButtonBuilder()
      .setCustomId(`ucat:${group}:${sub}`)
      .setLabel(sub)
      .setStyle(ButtonStyle.Secondary)
  )
  return {
    embeds: [
      new EmbedBuilder()
        .setColor(0xf59e0b)
        .setTitle(`🏆 ${group} 직업군`)
        .setDescription("세부 직업을 선택하세요.")
        .setFooter(null),
    ],
    components: makeRows(buttons),
  }
}

/** 세부 직업 선택 → 캐릭터 버튼 */
function buildSubclassEmbed(group: string, subclass: string) {
  const chars = JOB_TREE[group]?.[subclass] ?? []
  const buttons = chars.map(name =>
    new ButtonBuilder()
      .setCustomId(`uchar:${name}`)
      .setLabel(name)
      .setStyle(ButtonStyle.Secondary)
  )
  return {
    embeds: [
      new EmbedBuilder()
        .setColor(0xf59e0b)
        .setTitle(`🏆 ${group} · ${subclass}`)
        .setDescription("캐릭터를 선택하세요.")
        .setFooter(null),
    ],
    components: makeRows(buttons),
  }
}

/** 세부 직업 키워드 → 해당 직업군 버튼 */
function buildSubclassGroupEmbed(subclass: string) {
  const groups = Object.entries(JOB_TREE)
    .filter(([, subs]) => subclass in subs)
    .map(([group]) => group)

  const buttons = groups.map(group =>
    new ButtonBuilder()
      .setCustomId(`ucat:${group}:${subclass}`)
      .setLabel(group)
      .setStyle(ButtonStyle.Secondary)
  )
  return {
    embeds: [
      new EmbedBuilder()
        .setColor(0xf59e0b)
        .setTitle(`🏆 ${subclass} 직업군 선택`)
        .setDescription("어느 직업군의 전사인지 선택하세요.")
        .setFooter(null),
    ],
    components: makeRows(buttons),
  }
}

/** 캐릭터 상세 (모든 등급 한눈에) */
function buildCharEmbed(name: string) {
  const char = UNION_DATA.find(c => c.name === name)
  if (!char) {
    return {
      embeds: [new EmbedBuilder().setColor(0xef4444).setDescription(`❌ **${name}** 정보를 찾을 수 없어요.`)],
      components: [] as ActionRowBuilder<ButtonBuilder>[],
    }
  }
  const grades: Grade[] = ["B", "A", "S", "SS", "SSS"]
  const gradeLines = grades
    .map(g => `**${g}등급** (Lv.${GRADE_LEVEL[g]}+) → ${char.grades[g]}`)
    .join("\n")

  return {
    embeds: [
      new EmbedBuilder()
        .setColor(0xf59e0b)
        .setTitle(`🏆 ${char.name} 유니온 공격대원 효과`)
        .setDescription(`**${char.effect}**\n\n${gradeLines}`)
        .addFields({ name: "계열", value: char.category, inline: true })
        .setFooter(null),
    ],
    components: [] as ActionRowBuilder<ButtonBuilder>[],
  }
}

/** 키워드 검색 결과 (등급 버튼 포함) */
function buildSearchEmbed(query: string, grade: Grade) {
  const lq = query.toLowerCase()
  const matches = UNION_DATA.filter(c =>
    c.name.toLowerCase().includes(lq) ||
    c.effect.toLowerCase().includes(lq) ||
    c.category.toLowerCase().includes(lq)
  )
  if (matches.length === 0) {
    return {
      embeds: [new EmbedBuilder().setColor(0xef4444).setDescription(`❌ **"${query}"** 에 해당하는 유니온 정보를 찾을 수 없어요.`)],
      components: [] as ActionRowBuilder<ButtonBuilder>[],
    }
  }

  const lines = matches.map(c =>
    `**${c.name}** - ${c.effect}\n → ${c.grades[grade]}`
  )

  const chunks: string[] = []
  let cur = ""
  for (const line of lines) {
    const next = cur ? cur + "\n\n" + line : line
    if (next.length > 4000) { chunks.push(cur); cur = line }
    else cur = next
  }
  if (cur) chunks.push(cur)

  const embeds = chunks.map((chunk, i) =>
    new EmbedBuilder()
      .setColor(GRADE_COLOR[grade])
      .setTitle(i === 0 ? `🏆 유니온 검색 — "${query}" (${matches.length}개) · ${grade}등급 (Lv.${GRADE_LEVEL[grade]}+)` : "\u200b")
      .setDescription(chunk)
      .setFooter(null)
  )

  return { embeds, components: gradeRows(grade, query) }
}

// ── 커맨드 핸들러 ───────────────────────────────────────────
export async function execute(interaction: ChatInputCommandInteraction) {
  const query = interaction.options.getString("검색어", true).trim()
  await interaction.deferReply()

  const lq = query.toLowerCase()

  // 1) 직업군 키워드 (모험가, 시그너스 …)
  if (GROUP_KEYWORDS.has(query)) {
    const result = buildGroupEmbed(query)
    await interaction.editReply(result)
    return
  }

  // 2) 세부 직업 키워드 (전사, 마법사 …)
  if (SUBCLASS_KEYWORDS.has(query)) {
    const result = buildSubclassGroupEmbed(query)
    await interaction.editReply(result)
    return
  }

  // 3) 직업명 완전 일치
  const exact = UNION_DATA.find(c => c.name === query || c.name.toLowerCase() === lq)
  if (exact) {
    const result = buildCharEmbed(exact.name)
    await interaction.editReply(result)
    return
  }

  // 4) 키워드 검색 (등급 버튼)
  const result = buildSearchEmbed(query, "SSS")
  if (result.components.length === 0)
    await interaction.editReply({ embeds: result.embeds })
  else
    await interaction.editReply({ embeds: result.embeds, components: result.components })
}

// ── 버튼 핸들러 ─────────────────────────────────────────────
/** ucat:{group}:{subclass} */
export async function handleCatButton(interaction: ButtonInteraction, group: string, subclass: string) {
  const result = buildSubclassEmbed(group, subclass)
  await interaction.update(result)
}

/** uchar:{name} */
export async function handleCharButton(interaction: ButtonInteraction, name: string) {
  const result = buildCharEmbed(name)
  await interaction.update(result)
}

/** uniongrade:{grade}:{query} */
export async function handleUnionGradeButton(interaction: ButtonInteraction, grade: Grade, query: string) {
  const result = buildSearchEmbed(query, grade)
  await interaction.update({ embeds: result.embeds, components: result.components })
}
