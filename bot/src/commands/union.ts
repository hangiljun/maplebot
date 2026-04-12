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
       .setDescription("직업명(예: 메르세데스) 또는 효과 키워드(예: 공격력)")
       .setRequired(true)
  )

export async function execute(interaction: ChatInputCommandInteraction) {
  const query = interaction.options.getString("검색어", true).trim()
  await interaction.deferReply()

  if (UNION_DATA.length === 0) {
    await interaction.editReply("⚙️ 유니온 데이터가 아직 준비되지 않았습니다.")
    return
  }

  const lq = query.toLowerCase()

  // 1) 직업명 완전 일치 → 상세 정보
  const exact = UNION_DATA.find(c => c.name === query || c.name.toLowerCase() === lq)
  if (exact) {
    const embed = new EmbedBuilder()
      .setColor(0xf59e0b)
      .setTitle(`🏆 ${exact.name} 유니온 블록 효과`)
      .setDescription(exact.effect)
      .setFooter({ text: "메이플봇 · 유니온 정보" })

    if (exact.category) {
      embed.addFields({ name: "직업 계열", value: exact.category, inline: true })
    }

    await interaction.editReply({ embeds: [embed] })
    return
  }

  // 2) 키워드 검색 → 매칭 목록
  const matches = UNION_DATA.filter(c =>
    c.name.toLowerCase().includes(lq) ||
    c.effect.toLowerCase().includes(lq) ||
    (c.category?.toLowerCase().includes(lq) ?? false)
  )

  if (matches.length === 0) {
    await interaction.editReply(`❌ **"${query}"** 에 해당하는 유니온 정보를 찾을 수 없어요.`)
    return
  }

  // 결과 목록 (최대 25개)
  const shown = matches.slice(0, 25)
  const lines = shown.map(c => `**${c.name}** — ${c.effect}`)

  const embed = new EmbedBuilder()
    .setColor(0xf59e0b)
    .setTitle(`🏆 유니온 검색 결과 — "${query}" (${matches.length}개)`)
    .setDescription(lines.join("\n"))
    .setFooter({ text: matches.length > 25 ? `상위 25개만 표시됩니다 · 메이플봇` : "메이플봇 · 유니온 정보" })

  await interaction.editReply({ embeds: [embed] })
}
