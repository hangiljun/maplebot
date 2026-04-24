import { Client, EmbedBuilder, TextChannel } from "discord.js"

const POLL_INTERVAL = 10 * 60 * 1000
const EVENT_PAGE_URL = "https://maplestory.nexon.com/News/Event"

let lastSeenId = 0

interface MapleEvent {
  id: number
  title: string
  dateRange: string
  imageUrl: string
  url: string
}

function parseEvents(html: string): MapleEvent[] {
  const events: MapleEvent[] = []
  const items = html.split("<li>").slice(1)

  for (const li of items) {
    const idMatch = li.match(/\/News\/Event\/(\d+)/)
    if (!idMatch) continue
    const id = parseInt(idMatch[1], 10)

    const imgMatch = li.match(/<img src="([^"]+)"/)
    const imageUrl = imgMatch?.[1] ?? ""

    const titleMatch = li.match(/<dt><a[^>]+>([^<]+)<\/a><\/dt>/)
    const title = titleMatch?.[1]?.replace(/&amp;/g, "&").trim() ?? ""

    const dateMatch = li.match(/<dd><a[^>]+>([^<]+)<\/a><\/dd>/)
    const dateRange = dateMatch?.[1]?.trim() ?? ""

    if (title) {
      events.push({ id, title, dateRange, imageUrl, url: `${EVENT_PAGE_URL}/${id}` })
    }
  }

  return events.sort((a, b) => b.id - a.id)
}

async function fetchEvents(): Promise<MapleEvent[]> {
  try {
    const res = await fetch(EVENT_PAGE_URL, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
    })
    if (!res.ok) return []
    return parseEvents(await res.text())
  } catch {
    return []
  }
}

export function startEventPoller(client: Client) {
  const channelId = process.env.EVENT_NOTIFY_CHANNEL_ID
  if (!channelId) {
    console.warn("⚠️ EVENT_NOTIFY_CHANNEL_ID 미설정 — 이벤트 알림 비활성화")
    return
  }

  // 초기화: 현재 최신 ID 기록만 하고 알림은 안 보냄
  fetchEvents().then(events => {
    if (events.length > 0) {
      lastSeenId = events[0].id
      console.log(`✅ 이벤트 폴러 시작 (현재 최신 ID: ${lastSeenId})`)
    }
  })

  setInterval(async () => {
    const events = await fetchEvents()
    if (!events.length) return

    const newEvents = events.filter(e => e.id > lastSeenId)
    if (!newEvents.length) return

    const channel = client.channels.cache.get(channelId)
    if (!(channel instanceof TextChannel)) return

    for (const event of newEvents.reverse()) {
      const embed = new EmbedBuilder()
        .setTitle(event.title)
        .setURL(event.url)
        .setDescription(event.dateRange || null)
        .setImage(event.imageUrl || null)
        .setColor(0xF59E0B)
        .setFooter({ text: "메이플스토리 이벤트" })
        .setTimestamp()

      await channel.send({ content: "🍁 **새 이벤트가 시작됐어요!**", embeds: [embed] })
    }

    lastSeenId = events[0].id
  }, POLL_INTERVAL)
}
