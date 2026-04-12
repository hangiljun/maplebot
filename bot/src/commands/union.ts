import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
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

export async function execute(interaction: ChatInputCommandInteraction) {
  const query = interaction.options.getString("검색어", true).trim()
  await interaction.deferReply()

  const lq = query.toLowerCase()

  // 1) 직업명 완전 일치 → 등급별 수치 상세 표시
  const exact = UNION_DATA.find(c => c.name === query || c.name.toLowerCase() === lq)
  if (exact) {
    const embed = new EmbedBuilder()
      .setColor(0xf59e0b)
      .setTitle(`🏆 ${exact.name} 유니온 블록 효과`)
      .setDescription(`**${exact.effect}**`)
      .addFields(
        { name: "B등급",   value: exact.grades.B,   inline: true },
        { name: "A등급",   value: exact.grades.A,   inline: true },
        { name: "S등급",   value: exact.grades.S,   inline: true },
        { name: "SS등급",  value: exact.grades.SS,  inline: true },
        { name: "SSS등급", value: exact.grades.SSS, inline: true },
        { name: "계열",    value: exact.category,   inline: true },
      )
      .setFooter({ text: "메이플봇 · 유니온 정보" })

    await interaction.editReply({ embeds: [embed] })
    return
  }

  // 2) 키워드 검색 → 매칭 목록
  const matches = UNION_DATA.filter(c =>
    c.name.toLowerCase().includes(lq) ||
    c.effect.toLowerCase().includes(lq) ||
    c.category.toLowerCase().includes(lq)
  )

  if (matches.length === 0) {
    await interaction.editReply(`❌ **"${query}"** 에 해당하는 유니온 정보를 찾을 수 없어요.`)
    return
  }

  const shown = matches.slice(0, 25)
  const lines = shown.map(c => `**${c.name}** — ${c.effect} \`[${c.category}]\``)

  const embed = new EmbedBuilder()
    .setColor(0xf59e0b)
    .setTitle(`🏆 유니온 검색 결과 — "${query}" (${matches.length}개)`)
    .setDescription(lines.join("\n"))
    .setFooter({ text: matches.length > 25 ? "상위 25개만 표시됩니다 · 메이플봇" : "메이플봇 · 유니온 정보" })

  await interaction.editReply({ embeds: [embed] })
}
