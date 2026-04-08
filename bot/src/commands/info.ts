import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} from "discord.js"
import { fetchCharacterSummary } from "../maple"

export const data = new SlashCommandBuilder()
  .setName("정보")
  .setDescription("메이플스토리 캐릭터 정보를 조회합니다")
  .addStringOption((opt) =>
    opt
      .setName("캐릭터명")
      .setDescription("조회할 캐릭터 닉네임")
      .setRequired(true)
  )

export async function execute(interaction: ChatInputCommandInteraction) {
  const name = interaction.options.getString("캐릭터명", true).trim()

  await interaction.deferReply()

  try {
    const char = await fetchCharacterSummary(name)

    if (!char) {
      await interaction.editReply(`❌ **${name}** 캐릭터를 찾을 수 없어요.`)
      return
    }

    const expBar = buildExpBar(parseFloat(char.expRate))

    const embed = new EmbedBuilder()
      .setColor(0x3182f6)
      .setTitle(`🍁 ${char.name}`)
      .setURL(`https://maplebot.co.kr/character/${encodeURIComponent(char.name)}`)
      .setThumbnail(char.image || null)
      .addFields(
        { name: "레벨",   value: `Lv.**${char.level}**`,    inline: true },
        { name: "직업",   value: char.characterClass,        inline: true },
        { name: "서버",   value: char.world,                 inline: true },
        { name: "길드",   value: char.guild || "없음",       inline: true },
        { name: "인기도", value: `${char.popularity}`,       inline: true },
        { name: "전투력", value: `**${Number(char.combatPower).toLocaleString()}**`, inline: true },
        { name: `경험치 ${char.expRate}%`, value: expBar,   inline: false },
      )
      .setFooter({ text: "maplebot.co.kr" })
      .setTimestamp()

    const button = new ButtonBuilder()
      .setLabel("자세히 보기")
      .setStyle(ButtonStyle.Link)
      .setURL(`https://maplebot.co.kr/character/${encodeURIComponent(char.name)}`)
      .setEmoji("🔍")

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button)

    await interaction.editReply({ embeds: [embed], components: [row] })
  } catch (err) {
    console.error(err)
    await interaction.editReply("❌ 캐릭터 정보 조회 중 오류가 발생했어요.")
  }
}

function buildExpBar(rate: number): string {
  const filled = Math.round(Math.min(Math.max(rate, 0), 100) / 10)
  return "🟦".repeat(filled) + "⬛".repeat(10 - filled)
}
