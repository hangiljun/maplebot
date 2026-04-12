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

export const data = new SlashCommandBuilder()
  .setName("유니온")
  .setDescription("유니온 캐릭터 효과를 검색합니다 (직업명 또는 효과 키워드)")
  .addStringOption(opt =>
    opt.setName("검색어")
       .setDescription("직업명(예: 메르세데스) 또는 효과 키워드(예: 공격력, 크리티컬)")
       .setRequired(true)
  )

type Grade = "B" | "A" | "S" | "SS" | "SSS"

const GRADE_LEVEL: Record<Grade, number> = {
  B: 60, A: 100, S: 140, SS: 200, SSS: 250,
}

const GRADE_COLOR: Record<Grade, number> = {
  B: 0x6b7280, A: 0x22c55e, S: 0x3b82f6, SS: 0xa855f7, SSS: 0xf97316,
}

function gradeRow(grade: Grade, query: string): ActionRowBuilder<ButtonBuilder> {
  const grades: Grade[] = ["B", "A", "S", "SS", "SSS"]
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    ...grades.map(g =>
      new ButtonBuilder()
        .setCustomId(`uniongrade:${g}:${query}`)
        .setLabel(`${g}등급 (${GRADE_LEVEL[g]})`)
        .setStyle(g === grade ? ButtonStyle.Primary : ButtonStyle.Secondary)
        .setDisabled(g === grade)
    )
  )
}

function buildSearchEmbed(query: string, grade: Grade) {
  const lq = query.toLowerCase()
  const matches = UNION_DATA.filter(c =>
    c.name.toLowerCase().includes(lq) ||
    c.effect.toLowerCase().includes(lq) ||
    c.category.toLowerCase().includes(lq)
  )

  if (matches.length === 0) {
    return {
      embeds: [
        new EmbedBuilder()
          .setColor(0xef4444)
          .setDescription(`❌ **"${query}"** 에 해당하는 유니온 정보를 찾을 수 없어요.`),
      ],
      components: [] as ActionRowBuilder<ButtonBuilder>[],
    }
  }

  const lines = matches.map(c =>
    `**${c.name}** - ${c.effect}\n → ${c.grades[grade]}`
  )

  // 4000자 기준으로 여러 embed에 나눠 담기
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
      .setFooter(i === chunks.length - 1 ? { text: "메이플봇 · 유니온 공격대원 효과" } : null)
  )

  return { embeds, components: [gradeRow(grade, query)] }
}

export async function execute(interaction: ChatInputCommandInteraction) {
  const query = interaction.options.getString("검색어", true).trim()
  await interaction.deferReply({ ephemeral: true })

  const lq = query.toLowerCase()

  // 직업명 완전 일치 → 등급별 수치 전체 표시
  const exact = UNION_DATA.find(c => c.name === query || c.name.toLowerCase() === lq)
  if (exact) {
    const gradeLines = (["B", "A", "S", "SS", "SSS"] as Grade[])
      .map(g => `**${g}등급** (Lv.${GRADE_LEVEL[g]}+) → ${exact.grades[g]}`)
      .join("\n")

    const embed = new EmbedBuilder()
      .setColor(0xf59e0b)
      .setTitle(`🏆 ${exact.name} 유니온 공격대원 효과`)
      .setDescription(`**${exact.effect}**\n\n${gradeLines}`)
      .addFields({ name: "계열", value: exact.category, inline: true })
      .setFooter({ text: "메이플봇 · 유니온 공격대원 효과" })

    await interaction.editReply({ embeds: [embed] })
    return
  }

  // 키워드 검색 → 등급 버튼 포함 목록 (기본 SSS등급)
  const result = buildSearchEmbed(query, "SSS")
  if (result.components.length === 0) {
    await interaction.editReply({ embeds: result.embeds })
  } else {
    await interaction.editReply({ embeds: result.embeds, components: result.components })
  }
}

export async function handleUnionGradeButton(interaction: ButtonInteraction, grade: Grade, query: string) {
  const result = buildSearchEmbed(query, grade)
  await interaction.update({ embeds: result.embeds, components: result.components })
}
