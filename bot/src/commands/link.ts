import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ButtonInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js"
import { LINK_DATA } from "../data/link"

export const data = new SlashCommandBuilder()
  .setName("링크")
  .setDescription("링크 스킬을 검색합니다 (직업명 또는 효과 키워드)")
  .addStringOption(opt =>
    opt.setName("검색어")
       .setDescription("직업명(예: 메르세데스) 또는 효과 키워드(예: 경험치, 데미지)")
       .setRequired(true)
  )

function buildSearchResult(query: string, level: number) {
  const lq = query.toLowerCase()
  const matches = LINK_DATA.filter(c =>
    c.name.toLowerCase().includes(lq) ||
    c.skillName.toLowerCase().includes(lq) ||
    c.category.toLowerCase().includes(lq) ||
    c.effects.some(e => e.toLowerCase().includes(lq))
  )
  return { matches }
}

function buildSearchEmbed(query: string, level: number) {
  const { matches } = buildSearchResult(query, level)

  if (matches.length === 0) {
    return {
      embeds: [
        new EmbedBuilder()
          .setColor(0xef4444)
          .setDescription(`❌ **"${query}"** 에 해당하는 링크 스킬을 찾을 수 없어요.`),
      ],
      components: [] as ActionRowBuilder<ButtonBuilder>[],
    }
  }

  const lines = matches.map(c => {
    const idx = Math.min(level - 1, c.effects.length - 1)
    const effect = c.effects[idx]
    const actualLv = idx + 1
    const lvNote = actualLv < level ? ` *(최대 Lv.${actualLv})*` : ""
    return `**${c.name}** - ${c.skillName}${lvNote}\n → ${effect}`
  })

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
      .setColor(0x22c55e)
      .setTitle(i === 0 ? `🔗 링크 스킬 검색 — "${query}" (${matches.length}개) · Lv.${level}` : "\u200b")
      .setDescription(chunk)
      .setFooter(null)
  )

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`linklv:1:${query}`)
      .setLabel("Lv.1 (70)")
      .setStyle(level === 1 ? ButtonStyle.Primary : ButtonStyle.Secondary)
      .setDisabled(level === 1),
    new ButtonBuilder()
      .setCustomId(`linklv:2:${query}`)
      .setLabel("Lv.2 (120)")
      .setStyle(level === 2 ? ButtonStyle.Primary : ButtonStyle.Secondary)
      .setDisabled(level === 2),
    new ButtonBuilder()
      .setCustomId(`linklv:3:${query}`)
      .setLabel("Lv.3 (285)")
      .setStyle(level === 3 ? ButtonStyle.Primary : ButtonStyle.Secondary)
      .setDisabled(level === 3),
  )

  return { embeds, components: [row] }
}

export async function execute(interaction: ChatInputCommandInteraction) {
  const query = interaction.options.getString("검색어", true).trim()
  await interaction.deferReply()

  const lq = query.toLowerCase()

  // 직업명 완전 일치 → 레벨별 효과 전체 표시 (버튼 없음)
  const exact = LINK_DATA.find(c => c.name === query || c.name.toLowerCase() === lq)
  if (exact) {
    const effectLines = exact.effects
      .map((eff, i) => `**Lv.${i + 1}** ${eff}`)
      .join("\n")

    const embed = new EmbedBuilder()
      .setColor(0x22c55e)
      .setTitle(`🔗 ${exact.name} - ${exact.skillName}`)
      .setDescription(effectLines || "효과 정보 없음")
      .addFields(
        { name: "카테고리", value: exact.category, inline: true },
        { name: "최대 레벨", value: `Lv.${exact.maxLevel}`, inline: true },
      )
      .setFooter(null)

    await interaction.editReply({ embeds: [embed] })
    return
  }

  // 키워드 검색 → 레벨 선택 버튼 포함 목록 (기본 Lv.3)
  const result = buildSearchEmbed(query, 3)
  if (result.components.length === 0) {
    await interaction.editReply({ embeds: result.embeds })
  } else {
    await interaction.editReply({ embeds: result.embeds, components: result.components })
  }
}

export async function handleLinkLevelButton(interaction: ButtonInteraction, level: number, query: string) {
  const result = buildSearchEmbed(query, level)
  await interaction.update({ embeds: result.embeds, components: result.components })
}
