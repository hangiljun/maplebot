import { REST, Routes } from "discord.js"
import * as dotenv from "dotenv"
import { data as infoCommand   } from "./commands/info"
import { data as unionCommand  } from "./commands/union"
import { data as linkCommand   } from "./commands/link"
import { data as dojangCommand } from "./commands/dojang"

dotenv.config()

const token    = process.env.DISCORD_TOKEN!
const clientId = process.env.DISCORD_CLIENT_ID!
const guildId  = "1079813015022612520"

const rest = new REST().setToken(token)

;(async () => {
  console.log("슬래시 커맨드 등록 중...")
  await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
    body: [infoCommand.toJSON(), unionCommand.toJSON(), linkCommand.toJSON(), dojangCommand.toJSON()],
  })
  console.log("✅ /정보, /유니온, /링크, /연무장 커맨드 등록 완료!")
})()
