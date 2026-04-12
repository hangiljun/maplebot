import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} from "discord.js"
import { fetchUnion } from "../maple"

export const data = new SlashCommandBuilder()
  .setName("유니온")
  .setDescription("메이플스토리 캐릭터의 유니온 정보를 조회합니다")
  .addStringOption(opt =>
    opt.setName("캐릭터명")
       .setDescription("조회할 캐릭터 닉네임")
       .setRequired(true)
  )

// 유니온 등급 → 뱃지 + 색상
function gradeColor(grade: string): number {
  if (grade.includes("그랜드 마스터")) return 0xf97316
  if (grade.includes("마스터"))        return 0xa855f7
  if (grade.includes("다이아몬드"))    return 0x3b82f6
  if (grade.includes("플래티넘"))      return 0x60a5fa
  if (grade.includes("골드"))         return 0xf59e0b
  return 0x6b7280
}

export async function execute(interaction: ChatInputCommandInteraction) {
  const name = interaction.options.getString("캐릭터명", true).trim()
  await interaction.deferReply()

  try {
    const union = await fetchUnion(name)

    if (!union) {
      await interaction.editReply(`❌ **${name}** 캐릭터를 찾을 수 없어요.`)
      return
    }

    const embed = new EmbedBuilder()
      .setColor(gradeColor(union.grade))
      .setTitle(`🏆 ${name} 유니온`)
      .addFields(
        { name: "유니온 등급",  value: union.grade,                              inline: false },
        { name: "유니온 레벨",  value: union.level.toLocaleString(),              inline: true  },
        { name: "아티팩트 레벨", value: String(union.artifactLevel),              inline: true  },
        { name: "아티팩트 경험치", value: union.artifactExp.toLocaleString(),     inline: true  },
        { name: "아티팩트 포인트", value: union.artifactPoint.toLocaleString(),   inline: true  },
      )
      .setFooter({ text: "메이플봇 · 실시간 조회" })

    await interaction.editReply({ embeds: [embed] })
  } catch (err) {
    console.error("[유니온] 오류:", err)
    await interaction.editReply("❌ 유니온 정보 조회 중 오류가 발생했어요.")
  }
}
