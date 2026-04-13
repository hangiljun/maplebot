import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ButtonInteraction,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  StringSelectMenuInteraction,
} from "discord.js"
import { fetchCharacterSummary, fetchEquipment, fetchLevelHistory, fetchHexa, fetchCodi, fetchCharacterTimeline, fetchBattlePractice } from "../maple"

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

    const equipBtn = new ButtonBuilder()
      .setCustomId(`equip:${char.name}`)
      .setLabel("🛡️ 장비")
      .setStyle(ButtonStyle.Secondary)

    const levelBtn = new ButtonBuilder()
      .setCustomId(`level:${char.name}`)
      .setLabel("📈 레벨 변동")
      .setStyle(ButtonStyle.Secondary)

    const hexaBtn = new ButtonBuilder()
      .setCustomId(`hexa:${char.name}`)
      .setLabel("💎 헥사")
      .setStyle(ButtonStyle.Secondary)

    const codiBtn = new ButtonBuilder()
      .setCustomId(`codi:${char.name}`)
      .setLabel("👗 코디")
      .setStyle(ButtonStyle.Secondary)

    const historyBtn = new ButtonBuilder()
      .setCustomId(`history:${char.name}`)
      .setLabel("🕰️ 캐릭터 역사")
      .setStyle(ButtonStyle.Secondary)

    const dojangBtn = new ButtonBuilder()
      .setCustomId(`dojang:${char.name}`)
      .setLabel("🥊 연무장")
      .setStyle(ButtonStyle.Secondary)

    const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(equipBtn, levelBtn, hexaBtn, codiBtn, historyBtn)
    const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(dojangBtn)

    await interaction.editReply({ embeds: [embed], components: [row1, row2] })
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
  await interaction.deferReply({ ephemeral: true })

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

    // 아이템 선택 드롭다운 (최대 25개)
    const selectOptions = ordered.slice(0, 25).map((item) =>
      new StringSelectMenuOptionBuilder()
        .setLabel((item.name || item.slot || "장비").slice(0, 100))
        .setValue(item.slot.slice(0, 100))
        .setDescription(`${item.slot}${item.starforce > 0 ? ` · ★${item.starforce}` : ""}${item.potential ? ` · ${item.potential}` : ""}`.slice(0, 100))
    )

    const select = new StringSelectMenuBuilder()
      .setCustomId(`equipdetail:${charName}`)
      .setPlaceholder("🔍 아이템을 선택하면 상세 정보를 확인할 수 있어요")
      .addOptions(selectOptions)

    const selectRow = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select)

    // 10개씩 나눠서 첫 번째는 editReply, 나머지는 followUp
    // 드롭다운은 항상 마지막 메시지 하단에 표시
    const first  = ordered.slice(0, 10)
    const second = ordered.slice(10, 20)

    if (second.length > 0) {
      await interaction.editReply({ embeds: buildEmbeds(first) })
      await interaction.followUp({ embeds: buildEmbeds(second), components: [selectRow], ephemeral: true })
    } else {
      await interaction.editReply({ embeds: buildEmbeds(first), components: [selectRow] })
    }
  } catch (err) {
    console.error(err)
    await interaction.editReply("❌ 장비 정보 조회 중 오류가 발생했어요.")
  }
}

export async function handleEquipDetailSelect(interaction: StringSelectMenuInteraction, charName: string, slot: string) {
  await interaction.deferReply({ ephemeral: true })

  try {
    const items = await fetchEquipment(charName)
    if (!items) {
      await interaction.editReply("❌ 장비 정보를 불러올 수 없어요.")
      return
    }

    const item = items.find((i) => i.slot === slot)
    if (!item) {
      await interaction.editReply("❌ 해당 아이템 정보를 찾을 수 없어요.")
      return
    }

    const color = POTENTIAL_COLORS[item.potential] ?? 0x4b5563
    const lines: string[] = []

    // 강화
    if (item.starforce > 0) {
      const starStr = "★".repeat(Math.min(item.starforce, 25))
      lines.push(`**${starStr}** (${item.starforce}성)`)
    }
    lines.push(`\`${item.slot}\``)
    lines.push("")

    // 총합 스탯
    if (Object.keys(item.totalStats).length > 0) {
      lines.push("**📊 스탯**")
      lines.push(
        Object.entries(item.totalStats)
          .map(([k, v]) => `**${k}** +${v}`)
          .join("  ·  ")
      )
      lines.push("")
    }

    // 스크롤 정보
    const scrollParts: string[] = []
    if (item.scrollUpgrade > 0)          scrollParts.push(`업그레이드 ${item.scrollUpgrade}회`)
    if (item.scrollUpgradeableCount >= 0) scrollParts.push(`가능 ${item.scrollUpgradeableCount}회`)
    if (item.cuttableCount > 0)           scrollParts.push(`가위 ${item.cuttableCount}회`)
    if (item.goldenHammer)                scrollParts.push("황금망치 적용")
    if (scrollParts.length > 0) {
      lines.push(`🔧 ${scrollParts.join("  ·  ")}`)
      lines.push("")
    }

    // 소울
    if (item.soulName) {
      lines.push(`**✨ 소울** ${item.soulName}`)
      if (item.soulOption) lines.push(item.soulOption)
      lines.push("")
    }

    // 잠재능력
    if (item.potentials?.length > 0) {
      lines.push(`**🟠 잠재능력** (${item.potential || "일반"})`)
      item.potentials.forEach(p => lines.push(`■ ${p}`))
      lines.push("")
    }

    // 에디셔널 잠재능력
    if (item.additionalPotentials?.length > 0) {
      lines.push(`**🟣 에디셔널 잠재능력** (${item.additionalPotential || "일반"})`)
      item.additionalPotentials.forEach(p => lines.push(`■ ${p}`))
    }

    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle((item.name || item.slot).slice(0, 256))
      .setDescription(lines.join("\n").slice(0, 4096) || "\u200b")

    if (item.icon) embed.setThumbnail(item.icon)

    await interaction.editReply({ embeds: [embed] })
  } catch (err) {
    console.error(err)
    await interaction.editReply("❌ 아이템 상세 정보 조회 중 오류가 발생했어요.")
  }
}

export async function handleLevelButton(interaction: ButtonInteraction, charName: string) {
  await interaction.deferReply({ ephemeral: true })
  try {
    const data = await fetchLevelHistory(charName)
    if (!data) {
      await interaction.editReply("❌ 히스토리 정보를 불러올 수 없어요.")
      return
    }

    const expLines = data.expHistory.map(e => `\`${e.date}\` ${e.value.toFixed(3)}%`).join("\n")
    const levelLines = data.levelHistory.map(l => `\`${l.date}\` Lv.${l.value}`).join("\n")

    const embed = new EmbedBuilder()
      .setColor(0x22c55e)
      .setTitle(`📈 ${charName} 레벨 변동`)
      .addFields(
        { name: "경험치 히스토리 (최근 7일)", value: expLines || "데이터 없음", inline: false },
        { name: "레벨 히스토리 (최근 12개월)", value: levelLines || "데이터 없음", inline: false },
      )

    await interaction.editReply({ embeds: [embed] })
  } catch (err) {
    console.error(err)
    await interaction.editReply("❌ 히스토리 조회 중 오류가 발생했어요.")
  }
}

export async function handleCodiButton(interaction: ButtonInteraction, charName: string) {
  await interaction.deferReply({ ephemeral: true })
  try {
    const codi = await fetchCodi(charName)
    if (!codi) {
      await interaction.editReply("❌ 코디 정보를 불러올 수 없어요.")
      return
    }

    const equippedLines = codi.equipped.length
      ? codi.equipped.map(i => `\`${i.part}\` ${i.name}${i.label ? ` (${i.label})` : ""}`).join("\n")
      : "착용 중인 캐시 아이템 없음"

    const embed = new EmbedBuilder()
      .setColor(0xec4899)
      .setTitle(`👗 ${charName} 코디`)
      .addFields(
        { name: "헤어", value: codi.hair || "기본", inline: true },
        { name: "성형", value: codi.face || "기본", inline: true },
        { name: "피부", value: codi.skin || "기본", inline: true },
        { name: "착용 중인 캐시 아이템", value: equippedLines, inline: false },
      )

    await interaction.editReply({ embeds: [embed] })
  } catch (err) {
    console.error(err)
    await interaction.editReply("❌ 코디 정보 조회 중 오류가 발생했어요.")
  }
}

export async function handleHexaButton(interaction: ButtonInteraction, charName: string) {
  await interaction.deferReply({ ephemeral: true })
  try {
    const data = await fetchHexa(charName)
    if (!data) {
      await interaction.editReply("❌ 헥사 정보를 불러올 수 없어요.")
      return
    }

    const coreLines = data.cores.length
      ? data.cores.map(c => `\`${c.hexa_core_type}\` **${c.hexa_core_name}** Lv.${c.hexa_core_level}/30`).join("\n")
      : "데이터 없음"

    const statLines = data.stats.length
      ? data.stats.map(s =>
          `**[${s.slot_id}] ${s.main_stat_name}** Lv.${s.main_stat_level}\n` +
          (s.sub_stat_name_1 ? `  ∟ ${s.sub_stat_name_1} Lv.${s.sub_stat_level_1}\n` : "") +
          (s.sub_stat_name_2 ? `  ∟ ${s.sub_stat_name_2} Lv.${s.sub_stat_level_2}` : "")
        ).join("\n")
      : "데이터 없음"

    const embeds: EmbedBuilder[] = []

    if (coreLines.length <= 4096) {
      embeds.push(new EmbedBuilder()
        .setColor(0xf97316)
        .setTitle(`💎 ${charName} 헥사 코어`)
        .setDescription(coreLines))
    }
    if (statLines.length <= 4096) {
      embeds.push(new EmbedBuilder()
        .setColor(0xa855f7)
        .setTitle("헥사 스탯")
        .setDescription(statLines))
    }

    await interaction.editReply({ embeds })
  } catch (err) {
    console.error(err)
    await interaction.editReply("❌ 헥사 정보 조회 중 오류가 발생했어요.")
  }
}

export async function handleDojangButton(interaction: ButtonInteraction, charName: string) {
  await interaction.deferReply({ ephemeral: true })
  try {
    const result = await fetchBattlePractice(charName)
    if (!result) {
      await interaction.editReply(`❌ **${charName}**의 연무장 기록을 찾을 수 없어요.\n리플레이를 등록한 캐릭터만 조회할 수 있습니다.`)
      return
    }

    const playTimeSec = Math.floor(result.totalPlayTimeMs / 1000)
    const m = Math.floor(playTimeSec / 60)
    const s = playTimeSec % 60
    const timeStr = m > 0 ? `${m}분 ${s}초` : `${s}초`

    const END_TYPE: Record<string, string> = {
      "1": "자동 종료", "2": "수동 종료", "3": "시간 초과", "9": "기타 종료",
    }
    const endLabel = END_TYPE[result.endType] ?? result.endType

    const formatNum = (n: number) => {
      if (n >= 1_000_000_000_000) return `${(n / 1_000_000_000_000).toFixed(2)}조`
      if (n >= 100_000_000) return `${(n / 100_000_000).toFixed(2)}억`
      if (n >= 10_000) return `${(n / 10_000).toFixed(1)}만`
      return n.toLocaleString()
    }

    const dateStr = result.registerDate ? result.registerDate.split("T")[0] : "-"

    // 상위 5개 스킬
    const topSkills = [...result.skillStatistic]
      .sort((a, b) => b.dps - a.dps)
      .slice(0, 5)

    const skillLines = topSkills.length
      ? topSkills.map(sk =>
          `**${sk.skillName}** (${sk.damagePercent}%)\n  DPS ${formatNum(sk.dps)} · 최대 ${formatNum(sk.maxDamage)} · ${sk.useCount}회`
        ).join("\n")
      : "스킬 데이터 없음"

    const embed = new EmbedBuilder()
      .setColor(0xf97316)
      .setTitle(`🥊 ${charName} 연무장 측정 결과`)
      .addFields(
        { name: "총합 데미지", value: formatNum(result.totalDamage), inline: true },
        { name: "평균 DPS", value: formatNum(result.totalDps), inline: true },
        { name: "연무 시간", value: timeStr, inline: true },
        { name: "종료 유형", value: endLabel, inline: true },
        { name: "추천 수", value: `${result.likeCount}`, inline: true },
        { name: "기록 일시", value: dateStr, inline: true },
        { name: "스킬별 DPS TOP 5", value: skillLines, inline: false },
      )
      .setFooter(null)

    await interaction.editReply({ embeds: [embed] })
  } catch (err) {
    console.error(err)
    await interaction.editReply("❌ 연무장 정보 조회 중 오류가 발생했어요.")
  }
}

export async function handleHistoryButton(interaction: ButtonInteraction, charName: string) {
  await interaction.deferReply({ ephemeral: true })
  try {
    const result = await fetchCharacterTimeline(charName)
    if (!result) {
      await interaction.editReply("❌ 캐릭터 역사를 불러올 수 없어요.")
      return
    }

    const { events, checkedFrom } = result

    let description: string
    if (events.length === 0) {
      description = "최근 6개월 내 닉네임·길드 변경 기록이 없습니다."
    } else {
      description = events.map(ev => {
        const icon = ev.type === "nickname" ? "🏷️" : "🏰"
        const label = ev.type === "nickname" ? "닉네임 변경" : "길드 변경"
        const d = new Date(ev.date)
        const dateStr = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`
        return `${icon} **${label}** \`${dateStr}\`\n  ${ev.from || "없음"} → **${ev.to || "없음"}**`
      }).join("\n\n")
    }

    const fromDate = new Date(checkedFrom)
    const fromStr = `${fromDate.getFullYear()}.${String(fromDate.getMonth() + 1).padStart(2, "0")}.${String(fromDate.getDate()).padStart(2, "0")}`

    const embed = new EmbedBuilder()
      .setColor(0xa78bfa)
      .setTitle(`🕰️ ${charName} 캐릭터 역사`)
      .setDescription(description)
      .setFooter({ text: `조회 범위: ${fromStr} ~ 현재 (약 6개월 · ±1일 오차 가능)` })

    await interaction.editReply({ embeds: [embed] })
  } catch (err) {
    console.error(err)
    await interaction.editReply("❌ 캐릭터 역사 조회 중 오류가 발생했어요.")
  }
}

