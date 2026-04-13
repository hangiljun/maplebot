import { Client, GatewayIntentBits, Events, ChatInputCommandInteraction } from "discord.js"
import * as dotenv from "dotenv"
import * as infoCommand   from "./commands/info"
import * as unionCommand  from "./commands/union"
import * as linkCommand   from "./commands/link"
import * as dojangCommand from "./commands/dojang"

dotenv.config()

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.once(Events.ClientReady, (c) => {
  console.log(`✅ ${c.user.tag} 봇 온라인!`)
})

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === "정보") {
      await infoCommand.execute(interaction as ChatInputCommandInteraction)
    } else if (interaction.commandName === "유니온") {
      await unionCommand.execute(interaction as ChatInputCommandInteraction)
    } else if (interaction.commandName === "링크") {
      await linkCommand.execute(interaction as ChatInputCommandInteraction)
    } else if (interaction.commandName === "연무장") {
      await dojangCommand.execute(interaction as ChatInputCommandInteraction)
    }
    return
  }

  if (interaction.isButton()) {
    const [action, ...rest] = interaction.customId.split(":")
    const charName = rest.join(":")
    if (action === "equip") {
      await infoCommand.handleEquipButton(interaction, charName)
    } else if (action === "level") {
      await infoCommand.handleLevelButton(interaction, charName)
    } else if (action === "hexa") {
      await infoCommand.handleHexaButton(interaction, charName)
    } else if (action === "codi") {
      await infoCommand.handleCodiButton(interaction, charName)
    } else if (action === "history") {
      await infoCommand.handleHistoryButton(interaction, charName)
    } else if (action === "linklv") {
      const level = parseInt(rest[0], 10)
      const query = rest.slice(1).join(":")
      await linkCommand.handleLinkLevelButton(interaction, level, query)
    } else if (action === "uniongrade") {
      const grade = rest[0] as "B" | "A" | "S" | "SS" | "SSS"
      const query = rest.slice(1).join(":")
      await unionCommand.handleUnionGradeButton(interaction, grade, query)
    } else if (action === "ucat") {
      const group = rest[0]
      const subclass = rest.slice(1).join(":")
      await unionCommand.handleCatButton(interaction, group, subclass)
    } else if (action === "uchar") {
      const name = rest.join(":")
      await unionCommand.handleCharButton(interaction, name)
    } else if (action === "dojang") {
      const name = rest.join(":")
      await infoCommand.handleDojangButton(interaction, name)
    } else if (action === "dojangrank") {
      const difficulty = (rest[0] === "2" ? 2 : 1) as 1 | 2
      const worldName = rest.slice(1).join(":") || undefined
      await dojangCommand.handleDojangRankButton(interaction, difficulty, worldName)
    }
  }
})

client.login(process.env.DISCORD_TOKEN)
