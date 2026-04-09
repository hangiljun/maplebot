import { REST, Routes } from "discord.js"
import * as dotenv from "dotenv"
import { data as infoCommand } from "./commands/info"

dotenv.config()

const token    = process.env.DISCORD_TOKEN!
const clientId = process.env.DISCORD_CLIENT_ID!
const guildId  = "1079813015022612520"

const rest = new REST().setToken(token)

;(async () => {
  console.log("슬래시 커맨드 등록 중...")
  await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
    body: [infoCommand.toJSON()],
  })
  console.log("✅ /정보 커맨드 등록 완료!")
})()
