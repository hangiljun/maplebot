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

const POTENTIAL_COLORS: Record<string, number> = {
  "레전드리": 0xFF8C00,
  "유니크":   0xEAB308,
  "에픽":     0xA855F7,
  "레어":     0x3B82F6,
}

const SLOT_ORDER = [
  "무기", "보조무기", "엠블렘",
  "모자", "얼굴장식", "눈장식", "귀고리",
  "상의", "하의", "전체갑옷", "장갑", "신발", "망토",
  "어깨장식", "벨트",
  "반지1", "반지2", "반지3", "반지4",
  "펜던트", "펜던트2",
  "포켓 아이템", "훈장", "뱃지", "안드로이드",
]

export async function handleEquipButton(interaction: ButtonInteraction, charName: string) {
  await interaction.deferReply({ ephemeral: false })

  try {
    const items = await fetchEquipment(charName)

    if (!items || items.length === 0) {
      await interaction.editReply(`❌ **${charName}**의 장비 정보를 불러올 수 없어요.`)
      return
    }

    const itemMap = new Map(items.map((i) => [i.slot, i]))

    // 슬롯 순서대로 정렬, 없는 슬롯은 뒤에 추가
    const ordered = [
      ...SLOT_ORDER.map((s) => itemMap.get(s)).filter(Boolean),
      ...items.filter((i) => !SLOT_ORDER.includes(i.slot)),
    ] as typeof items

    // Discord 최대 10개 embed 제한
    const visible = ordered.slice(0, 10)

    const embeds = visible.map((item) => {
      const sf    = item.starforce > 0 ? `✦${item.starforce} ` : ""
      const color = POTENTIAL_COLORS[item.potential] ?? 0x4b5563

      let desc = `**${item.slot}**`
      if (item.potential) {
        desc += `\n${POTENTIAL_EMOJI[item.potential] ?? ""} **${item.potential}**`
        if (item.potentials.length > 0) {
          desc += "\n" + item.potentials.join("\n")
        }
      }
      if (item.additionalPotential && item.additionalPotentials.length > 0) {
        desc += `\n\n${POTENTIAL_EMOJI[item.additionalPotential] ?? ""} **추가 잠재**`
        desc += "\n" + item.additionalPotentials.join("\n")
      }

      const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle(`${sf}${item.name}`)
        .setDescription(desc)

      if (item.icon) embed.setThumbnail(item.icon)

      return embed
    })

    // 첫 embed에만 제목 추가 (10개 초과 시 안내)
    const headerEmbed = new EmbedBuilder()
      .setColor(0x3182f6)
      .setTitle(`🛡️ ${charName}의 장비`)
      .setDescription(
        ordered.length > 10
          ? `총 ${ordered.length}개 장비 중 상위 10개 표시\n나머지는 [maplebot.co.kr](https://maplebot.co.kr/character/${encodeURIComponent(charName)}) 에서 확인하세요.`
          : `총 ${ordered.length}개 장비`
      )

    await interaction.editReply({ embeds: [headerEmbed, ...embeds] })
  } catch (err) {
    console.error(err)
    await interaction.editReply("❌ 장비 정보 조회 중 오류가 발생했어요.")
  }
}

