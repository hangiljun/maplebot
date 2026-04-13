import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ButtonInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js"
import { fetchDojangRanking } from "../maple"

export const data = new SlashCommandBuilder()
  .setName("연무장")
  .setDescription("연무장 랭킹을 조회합니다")
  .addSubcommand(sub =>
    sub
      .setName("랭킹")
      .setDescription("연무장 랭킹을 조회합니다")
      .addStringOption(opt =>
        opt.setName("난이도")
           .setDescription("일반 또는 통달")
           .setRequired(false)
           .addChoices(
             { name: "일반", value: "1" },
             { name: "통달", value: "2" },
           )
      )
      .addStringOption(opt =>
        opt.setName("월드")
           .setDescription("특정 월드만 조회 (미선택 시 전체)")
           .setRequired(false)
           .addChoices(
             { name: "스카니아", value: "스카니아" },
             { name: "베라",     value: "베라" },
             { name: "루나",     value: "루나" },
             { name: "크로아",   value: "크로아" },
             { name: "유니온",   value: "유니온" },
             { name: "엘리시움", value: "엘리시움" },
             { name: "에오스",   value: "에오스" },
             { name: "레드",     value: "레드" },
             { name: "이노시스", value: "이노시스" },
             { name: "오로라",   value: "오로라" },
             { name: "핼리오스", value: "핼리오스" },
           )
      )
  )

function formatTime(seconds: number): string {
  if (!seconds) return "-"
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}분 ${s}초` : `${s}초`
}

function buildRankingEmbed(entries: Awaited<ReturnType<typeof fetchDojangRanking>>, difficulty: 1 | 2, worldName?: string) {
  if (!entries || entries.length === 0) {
    return {
      embeds: [new EmbedBuilder().setColor(0xef4444).setDescription("❌ 랭킹 정보를 불러올 수 없어요. 잠시 후 다시 시도해주세요.")],
      components: [] as ActionRowBuilder<ButtonBuilder>[],
    }
  }

  const diffLabel = difficulty === 2 ? "통달" : "일반"
  const worldLabel = worldName ? ` · ${worldName}` : ""

  const lines = entries.map(r =>
    `**${r.ranking}위** ${r.characterName} \`${r.className}\` Lv.${r.level}\n` +
    `  └ ${r.floor}층 · ${formatTime(r.timeSeconds)} · ${r.worldName}`
  )

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
      .setColor(difficulty === 2 ? 0xf97316 : 0x22c55e)
      .setTitle(i === 0 ? `🥊 연무장 랭킹 — ${diffLabel}${worldLabel} (TOP ${entries.length})` : "\u200b")
      .setDescription(chunk)
      .setFooter(i === chunks.length - 1 ? { text: "메이플봇 · 연무장 랭킹 (전일 기준)" } : null)
  )

  const diffRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`dojangrank:1:${worldName ?? ""}`)
      .setLabel("일반")
      .setStyle(difficulty === 1 ? ButtonStyle.Primary : ButtonStyle.Secondary)
      .setDisabled(difficulty === 1),
    new ButtonBuilder()
      .setCustomId(`dojangrank:2:${worldName ?? ""}`)
      .setLabel("통달")
      .setStyle(difficulty === 2 ? ButtonStyle.Primary : ButtonStyle.Secondary)
      .setDisabled(difficulty === 2),
  )

  return { embeds, components: [diffRow] }
}

export async function execute(interaction: ChatInputCommandInteraction) {
  const sub = interaction.options.getSubcommand()
  if (sub !== "랭킹") return

  await interaction.deferReply()

  const diffStr = interaction.options.getString("난이도") ?? "1"
  const difficulty = (diffStr === "2" ? 2 : 1) as 1 | 2
  const worldName = interaction.options.getString("월드") ?? undefined

  const entries = await fetchDojangRanking(difficulty, worldName)
  const result = buildRankingEmbed(entries, difficulty, worldName)

  if (result.components.length === 0) {
    await interaction.editReply({ embeds: result.embeds })
  } else {
    await interaction.editReply({ embeds: result.embeds, components: result.components })
  }
}

export async function handleDojangRankButton(interaction: ButtonInteraction, difficulty: 1 | 2, worldName?: string) {
  const entries = await fetchDojangRanking(difficulty, worldName)
  const result = buildRankingEmbed(entries, difficulty, worldName)
  await interaction.update({ embeds: result.embeds, components: result.components })
}
