import { REST, Routes } from "discord.js"
import * as dotenv from "dotenv"
import { data as infoCommand  } from "./commands/info"
import { data as unionCommand } from "./commands/union"
import { data as linkCommand  } from "./commands/link"

dotenv.config()

const token    = process.env.DISCORD_TOKEN!
const clientId = process.env.DISCORD_CLIENT_ID!

const rest = new REST().setToken(token)

;(async () => {
  console.log("슬래시 커맨드 전체 서버 등록 중...")
  await rest.put(Routes.applicationCommands(clientId), {
    body: [infoCommand.toJSON(), unionCommand.toJSON(), linkCommand.toJSON()],
  })
  console.log("✅ /정보, /유니온, /링크 글로벌 커맨드 등록 완료! (최대 1시간 내 전파)")
})()
