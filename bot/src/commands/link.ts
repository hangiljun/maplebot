import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js"
import { fetchLinkSkills } from "../maple"

export const data = new SlashCommandBuilder()
  .setName("링크")
  .setDescription("메이플스토리 캐릭터의 링크 스킬 정보를 조회합니다")
  .addStringOption(opt =>
    opt.setName("캐릭터명")
       .setDescription("조회할 캐릭터 닉네임")
       .setRequired(true)
  )

export async function execute(interaction: ChatInputCommandInteraction) {
  const name = interaction.options.getString("캐릭터명", true).trim()
  await interaction.deferReply()

  try {
    const info = await fetchLinkSkills(name)

    if (!info) {
      await interaction.editReply(`❌ **${name}** 캐릭터를 찾을 수 없어요.`)
      return
    }

    const embeds: EmbedBuilder[] = []

    // ── 이 캐릭터의 링크 스킬 (다른 캐릭터에게 제공) ──
    const ownEmbed = new EmbedBuilder()
      .setColor(0x22c55e)
      .setTitle(`🔗 ${name} 링크 스킬`)

    if (info.ownSkill) {
      ownEmbed.addFields({
        name:  `✨ 보유 링크 스킬 — ${info.ownSkill.name} Lv.${info.ownSkill.level}`,
        value: info.ownSkill.effect || "효과 정보 없음",
        inline: false,
      })
    } else {
      ownEmbed.setDescription("보유 링크 스킬 정보가 없습니다.")
    }

    embeds.push(ownEmbed)

    // ── 장착된 링크 스킬 목록 ──
    if (info.linkedSkills.length > 0) {
      const lines = info.linkedSkills.map(s =>
        `\`Lv.${s.level}\` **${s.name}**\n${s.effect}`
      )

      // Discord embed description 4096자 제한 대응
      const chunks: string[][] = []
      let cur: string[] = []
      let len = 0
      for (const line of lines) {
        if (len + line.length > 3800) { chunks.push(cur); cur = []; len = 0 }
        cur.push(line); len += line.length
      }
      if (cur.length) chunks.push(cur)

      chunks.forEach((chunk, i) => {
        embeds.push(
          new EmbedBuilder()
            .setColor(0x3b82f6)
            .setTitle(i === 0 ? `📋 장착된 링크 스킬 (${info.linkedSkills.length}개)` : "\u200b")
            .setDescription(chunk.join("\n\n"))
        )
      })
    }

    embeds[embeds.length - 1].setFooter({ text: "메이플봇 · 실시간 조회" })

    await interaction.editReply({ embeds: embeds.slice(0, 10) })
  } catch (err) {
    console.error("[링크] 오류:", err)
    await interaction.editReply("❌ 링크 스킬 정보 조회 중 오류가 발생했어요.")
  }
}
