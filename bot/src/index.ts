import { Client, GatewayIntentBits, Events, ChatInputCommandInteraction } from "discord.js"
import * as dotenv from "dotenv"
import * as infoCommand from "./commands/info"

dotenv.config()

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.once(Events.ClientReady, (c) => {
  console.log(`✅ ${c.user.tag} 봇 온라인!`)
})

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  if (interaction.commandName === "정보") {
    await infoCommand.execute(interaction as ChatInputCommandInteraction)
  }
})

client.login(process.env.DISCORD_TOKEN)
