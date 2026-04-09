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


export async function execute(interaction: ChatInputCommandInteraction) {
  const name = interaction.options.getString("캐릭터명", true).trim()

  await interaction.deferReply()

  try {
    const char = await fetchCharacterSummary(name)

    if (!char) {
      await interaction.editReply(`❌ **${name}** 캐릭터를 찾을 수 없어요.`)
      return
    }

    const cardParams = new URLSearchParams({
      level: String(char.level),
      cls:   char.characterClass,
      world: char.world,
      guild: char.guild ?? "",
      cp:    char.combatPower,
      union: "",   // fetchCharacterSummary에 union 없으므로 빈값
      img:   char.image ?? "",
    })
    const cardUrl = `https://maplebot.co.kr/api/card/${encodeURIComponent(char.name)}?${cardParams}`

    const embed = new EmbedBuilder()
      .setColor(0xf59e0b)
      .setImage(cardUrl)

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

    const buildEmbeds = (chunk: typeof ordered) =>
      chunk.map((item) => {
        const sf    = item.starforce > 0 ? `★${item.starforce}` : ""
        const color = POTENTIAL_COLORS[item.potential] ?? 0x4b5563

        const lines: string[] = []
        lines.push(`\`${item.slot || "기타"}\``)
        if (sf) lines.push(`**${sf}**`)

        if (item.potentials?.length > 0) {
          lines.push(`\n잠재  ${item.potentials.join(" · ")}`)
        }
        if (item.additionalPotentials?.length > 0) {
          lines.push(`에디  ${item.additionalPotentials.join(" · ")}`)
        }

        const title       = (item.name || item.slot || "장비").slice(0, 256)
        const description = lines.join("\n") || "\u200b"

        const embed = new EmbedBuilder()
          .setColor(color)
          .setTitle(title)
          .setDescription(description)

        if (item.icon) embed.setThumbnail(item.icon)
        return embed
      })

    // 10개씩 나눠서 첫 번째는 editReply, 나머지는 followUp
    const first  = ordered.slice(0, 10)
    const second = ordered.slice(10, 20)

    await interaction.editReply({ embeds: buildEmbeds(first) })
    if (second.length > 0) {
      await interaction.followUp({ embeds: buildEmbeds(second) })
    }
  } catch (err) {
    console.error(err)
    await interaction.editReply("❌ 장비 정보 조회 중 오류가 발생했어요.")
  }
}

