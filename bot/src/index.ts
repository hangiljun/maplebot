import { Client, GatewayIntentBits, Events, ChatInputCommandInteraction } from "discord.js"
import * as dotenv from "dotenv"
import * as infoCommand from "./commands/info"

dotenv.config()

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.once(Events.ClientReady, (c) => {
  console.log(`✅ ${c.user.tag} 봇 온라인!`)
})

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === "정보") {
      await infoCommand.execute(interaction as ChatInputCommandInteraction)
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
    }
  }
})

client.login(process.env.DISCORD_TOKEN)
