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


function formatPower(value: string | number): string {
  const num = Number(value)
  if (!num) return "0"
  const eok = Math.floor(num / 100_000_000)
  const man = Math.floor((num % 100_000_000) / 10_000)
  const rest = num % 10_000
  const parts: string[] = []
  if (eok > 0) parts.push(`${eok}억`)
  if (man > 0) parts.push(`${man}만`)
  if (rest > 0) parts.push(`${rest}`)
  return parts.join(" ") || "0"
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

    const cp = formatPower(char.combatPower)

    const embed = new EmbedBuilder()
      .setColor(0xf59e0b)
      .setTitle(`${char.name}  LV${char.level}`)
      .setThumbnail(char.image || null)
      .setDescription(
        [
          `• 월드 : ${char.world}`,
          `• 직업 : ${char.characterClass}`,
          `• 길드 : ${char.guild || "없음"}`,
          `• 인기도 : ${char.popularity.toLocaleString()}`,
          `• 전투력 : ${cp}`,
          char.unionGrade && char.unionLevel
            ? `• 유니온 : ${char.unionGrade} (Lv.${char.unionLevel.toLocaleString()})`
            : `• 유니온 : 정보 없음`,
        ].join("\n")
      )

    const button = new ButtonBuilder()
      .setCustomId(`equip:${char.name}`)
      .setLabel("🛡️ 장비 보기")
      .setStyle(ButtonStyle.Secondary)

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button)

    await interaction.editReply({ embeds: [embed], components: [row] })
  } catch (err) {
    console.error("[info] 오류:", err)
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
  // 버튼 비활성화
  const disabledButton = new ButtonBuilder()
    .setCustomId(`equip:${charName}`)
    .setLabel(`🛡️ 장비 보기 (${interaction.user.displayName})`)
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(true)

  const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(disabledButton)
  await interaction.update({ components: [disabledRow] })

  try {
    const items = await fetchEquipment(charName)

    if (!items || items.length === 0) {
      await interaction.followUp(`❌ **${charName}**의 장비 정보를 불러올 수 없어요.`)
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

    await interaction.followUp({ embeds: buildEmbeds(first), ephemeral: true })
    if (second.length > 0) {
      await interaction.followUp({ embeds: buildEmbeds(second), ephemeral: true })
    }
  } catch (err) {
    console.error(err)
    await interaction.followUp({ content: "❌ 장비 정보 조회 중 오류가 발생했어요.", ephemeral: true })
  }
}

