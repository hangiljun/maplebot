import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ButtonInteraction,
} from "discord.js"
import { fetchCharacterSummary, fetchEquipment } from "../maple"

export const data = new SlashCommandBuilder()
  .setName("정보")
  .setDescription("메이플스토리 캐릭터 정보를 조회합니다")
  .addStringOption((opt) =>
    opt
      .setName("캐릭터명")
      .setDescription("조회할 캐릭터 닉네임")
      .setRequired(true)
  )

const POTENTIAL_EMOJI: Record<string, string> = {
  "레전드리": "🟡",
  "유니크":   "🟣",
  "에픽":     "🟣",
  "레어":     "🔵",
}

export async function execute(interaction: ChatInputCommandInteraction) {
  const name = interaction.options.getString("캐릭터명", true).trim()

  await interaction.deferReply()

  try {
    const char = await fetchCharacterSummary(name)

    if (!char) {
      await interaction.editReply(`❌ **${name}** 캐릭터를 찾을 수 없어요.`)
      return
    }

    const embed = new EmbedBuilder()
      .setColor(0x3182f6)
      .setTitle(`🍁 ${char.name}`)
      .setThumbnail(char.image || null)
      .addFields(
        { name: "레벨",   value: `Lv.**${char.level}**`,    inline: true },
        { name: "직업",   value: char.characterClass,        inline: true },
        { name: "서버",   value: char.world,                 inline: true },
        { name: "길드",   value: char.guild || "없음",       inline: true },
        { name: "인기도", value: `${char.popularity}`,       inline: true },
        { name: "전투력", value: `**${Number(char.combatPower).toLocaleString()}**`, inline: true },
      )

    const button = new ButtonBuilder()
      .setCustomId(`equip:${char.name}`)
      .setLabel("🛡️ 장비 보기")
      .setStyle(ButtonStyle.Secondary)

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button)

    await interaction.editReply({ embeds: [embed], components: [row] })
  } catch (err) {
    console.error(err)
    await interaction.editReply("❌ 캐릭터 정보 조회 중 오류가 발생했어요.")
  }
}

export async function handleEquipButton(interaction: ButtonInteraction, charName: string) {
  await interaction.deferReply({ ephemeral: false })

  try {
    const items = await fetchEquipment(charName)

    if (!items || items.length === 0) {
      await interaction.editReply(`❌ **${charName}**의 장비 정보를 불러올 수 없어요.`)
      return
    }

    // 슬롯 순서
    const SLOT_ORDER = [
      "모자", "얼굴장식", "눈장식", "귀고리",
      "상의", "하의", "전체갑옷", "신발", "장갑", "망토",
      "무기", "보조무기", "엠블렘",
      "벨트", "어깨장식",
      "반지1", "반지2", "반지3", "반지4",
      "펜던트", "펜던트2",
      "포켓 아이템", "훈장", "뱃지", "안드로이드",
    ]

    const itemMap = new Map(items.map((i) => [i.slot, i]))

    const lines: string[] = []
    for (const slot of SLOT_ORDER) {
      const item = itemMap.get(slot)
      if (!item) continue
      const star = item.starforce > 0 ? `✦${item.starforce} ` : ""
      const pot  = POTENTIAL_EMOJI[item.potential] ?? ""
      lines.push(`**${slot}** ${star}${pot}\n└ ${item.name}`)
    }

    // 슬롯 순서에 없는 기타 아이템 추가
    for (const item of items) {
      if (!SLOT_ORDER.includes(item.slot)) {
        const star = item.starforce > 0 ? `✦${item.starforce} ` : ""
        const pot  = POTENTIAL_EMOJI[item.potential] ?? ""
        lines.push(`**${item.slot}** ${star}${pot}\n└ ${item.name}`)
      }
    }

    // 25줄씩 나눠서 embed 구성
    const chunks: string[][] = []
    for (let i = 0; i < lines.length; i += 10) {
      chunks.push(lines.slice(i, i + 10))
    }

    const embeds = chunks.map((chunk, idx) =>
      new EmbedBuilder()
        .setColor(0x3182f6)
        .setTitle(idx === 0 ? `🛡️ ${charName}의 장비` : "\u200b")
        .setDescription(chunk.join("\n\n"))
    )

    await interaction.editReply({ embeds })
  } catch (err) {
    console.error(err)
    await interaction.editReply("❌ 장비 정보 조회 중 오류가 발생했어요.")
  }
}

