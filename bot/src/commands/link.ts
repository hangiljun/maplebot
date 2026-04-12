import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js"
import { LINK_DATA } from "../data/link"

export const data = new SlashCommandBuilder()
  .setName("링크")
  .setDescription("링크 스킬을 검색합니다 (직업명 또는 효과 키워드)")
  .addStringOption(opt =>
    opt.setName("검색어")
       .setDescription("직업명(예: 메르세데스) 또는 효과 키워드(예: 경험치, 공격력)")
       .setRequired(true)
  )

export async function execute(interaction: ChatInputCommandInteraction) {
  const query = interaction.options.getString("검색어", true).trim()
  await interaction.deferReply()

  const lq = query.toLowerCase()

  // 1) 직업명 완전 일치 → 레벨별 효과 상세 표시
  const exact = LINK_DATA.find(c => c.name === query || c.name.toLowerCase() === lq)
  if (exact) {
    const effectLines = exact.effects
      .map((eff, i) => `**Lv.${i + 1}** ${eff}`)
      .join("\n")

    const embed = new EmbedBuilder()
      .setColor(0x22c55e)
      .setTitle(`🔗 ${exact.name} — ${exact.skillName}`)
      .setDescription(effectLines || "효과 정보 없음")
      .addFields(
        { name: "카테고리", value: exact.category, inline: true },
        { name: "최대 레벨", value: `Lv.${exact.maxLevel}`, inline: true },
      )
      .setFooter({ text: "메이플봇 · 링크 스킬 정보" })

    await interaction.editReply({ embeds: [embed] })
    return
  }

  // 2) 키워드 검색 → 매칭 목록
  const matches = LINK_DATA.filter(c =>
    c.name.toLowerCase().includes(lq) ||
    c.skillName.toLowerCase().includes(lq) ||
    c.category.toLowerCase().includes(lq) ||
    c.effects.some(e => e.toLowerCase().includes(lq))
  )

  if (matches.length === 0) {
    await interaction.editReply(`❌ **"${query}"** 에 해당하는 링크 스킬을 찾을 수 없어요.`)
    return
  }

  const shown = matches.slice(0, 25)
  const lines = shown.map(c =>
    `**${c.name}** (${c.skillName}) — ${c.effects[c.effects.length - 1]}`
  )

  const embed = new EmbedBuilder()
    .setColor(0x22c55e)
    .setTitle(`🔗 링크 스킬 검색 결과 — "${query}" (${matches.length}개)`)
    .setDescription(lines.join("\n"))
    .setFooter({ text: matches.length > 25 ? "상위 25개만 표시됩니다 · 메이플봇" : "메이플봇 · 링크 스킬 정보" })

  await interaction.editReply({ embeds: [embed] })
}
