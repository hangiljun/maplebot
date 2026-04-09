import { ImageResponse } from "next/og"
import { fetchCharacter, COMBAT_POWER_STAT } from "@/lib/maple"

export const runtime = "nodejs"

let fontCache: ArrayBuffer | null = null
async function loadFont(): Promise<ArrayBuffer | null> {
  if (fontCache) return fontCache
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@700;900&display=swap",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      }
    ).then((r) => r.text())
    const woff2Url = css.match(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/)?.[1]
    if (!woff2Url) return null
    fontCache = await fetch(woff2Url).then((r) => r.arrayBuffer())
    return fontCache
  } catch {
    return null
  }
}

async function toDataUrl(url: string): Promise<string> {
  try {
    const res = await fetch(url)
    if (!res.ok) return ""
    const mime = res.headers.get("content-type") ?? ""
    if (!mime.startsWith("image/")) return ""
    const buf = Buffer.from(await res.arrayBuffer())
    return `data:${mime};base64,${buf.toString("base64")}`
  } catch {
    return ""
  }
}

function formatPower(value: string | number) {
  const num = Number(value)
  if (!num) return "0"
  const eok = Math.floor(num / 100_000_000)
  const man = Math.floor((num % 100_000_000) / 10_000)
  if (eok > 0 && man > 0) return `${eok}억 ${man}만`
  if (eok > 0) return `${eok}억`
  if (man > 0) return `${man}만`
  return num.toLocaleString()
}

function renderCard(
  charName: string,
  level: string,
  cls: string,
  world: string,
  guild: string,
  cp: string,
  union: string,
  charImg: string,
  font: ArrayBuffer | null
) {
  const rows = [
    { label: "서버",   value: world },
    { label: "전투력", value: formatPower(cp) },
    { label: "길드",   value: guild || "없음" },
    { label: "유니온", value: union || "–" },
  ]

  const fonts = font
    ? [{ name: "NotoSansKR", data: font, style: "normal" as const, weight: 700 as const }]
    : []

  return new ImageResponse(
    (
      <div
        style={{
          width: 400, height: 520,
          background: "linear-gradient(160deg, #fff8ed 0%, #fde8c8 100%)",
          borderRadius: 24,
          display: "flex", flexDirection: "column", alignItems: "center",
          fontFamily: font ? "NotoSansKR" : "sans-serif",
          overflow: "hidden", position: "relative",
        }}
      >
        {/* 🍁 뱃지 */}
        <div style={{
          position: "absolute", top: 16, left: 16,
          width: 36, height: 36, background: "#f59e0b",
          borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
        }}>
          🍁
        </div>

        {/* 캐릭터 이미지 */}
        <div style={{ height: 210, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingTop: 24 }}>
          {charImg
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={charImg} width={180} height={180} style={{ objectFit: "contain" }} alt="" />
            : <div style={{ fontSize: 80 }}>🍁</div>
          }
        </div>

        {/* 이름 + 레벨 */}
        <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "0 28px", marginTop: 8 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 26, fontWeight: 900, color: "#1c1917" }}>{charName}</span>
            <span style={{ fontSize: 13, color: "#78716c", marginTop: 2 }}>{cls}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <span style={{ fontSize: 52, fontWeight: 900, color: "#ef4444", lineHeight: "1" }}>{level}</span>
            <span style={{ fontSize: 10, color: "#f87171", letterSpacing: 3, fontWeight: 700 }}>LEVEL</span>
          </div>
        </div>

        {/* 구분선 */}
        <div style={{ width: "calc(100% - 56px)", height: 2, background: "#d6b89a", margin: "12px 0", opacity: 0.5 }} />

        {/* 정보 그리드 */}
        <div style={{ width: "100%", padding: "0 28px", display: "flex", flexDirection: "column", gap: 12 }}>
          {rows.map(({ label, value }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "#92400e", fontWeight: 700, opacity: 0.7 }}>{label}</span>
              <span style={{ fontSize: 15, fontWeight: 900, color: "#1c1917" }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { width: 400, height: 520, fonts }
  )
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params
  const decoded = decodeURIComponent(name)
  const body = await req.json()
  const { level, cls, world, guild, cp, union, imageData } = body

  const [font] = await Promise.all([loadFont()])
  return renderCard(decoded, String(level), cls ?? "", world ?? "", guild ?? "", cp ?? "0", union ?? "", imageData ?? "", font)
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params
  const decoded = decodeURIComponent(name)
  const url = new URL(req.url)

  // 봇이 쿼리 파라미터로 데이터를 넘긴 경우 → Nexon API 호출 없이 빠르게 렌더링
  const qLevel = url.searchParams.get("level")
  if (qLevel) {
    const cls   = url.searchParams.get("cls")   ?? ""
    const world = url.searchParams.get("world")  ?? ""
    const guild = url.searchParams.get("guild")  ?? ""
    const cp    = url.searchParams.get("cp")     ?? "0"
    const union = url.searchParams.get("union")  ?? ""
    const imgUrl = url.searchParams.get("img")  ?? ""

    const [font, charImg] = await Promise.all([
      loadFont(),
      imgUrl ? toDataUrl(imgUrl) : Promise.resolve(""),
    ])
    return renderCard(decoded, qLevel, cls, world, guild, cp, union, charImg, font)
  }

  // 쿼리 없이 직접 접근한 경우 → Nexon API 호출
  const [data, font] = await Promise.all([fetchCharacter(decoded), loadFont()])
  if (!data) return new Response("Not found", { status: 404 })

  const { basic } = data
  const cp = data.stats.find((s) => s.stat_name === COMBAT_POWER_STAT)?.stat_value ?? "0"
  const unionLevel = data.union?.union_level ?? null
  const charImg = basic.character_image ? await toDataUrl(basic.character_image) : ""

  return renderCard(
    basic.character_name,
    String(basic.character_level),
    basic.character_class,
    basic.world_name,
    basic.character_guild_name ?? "",
    cp,
    unionLevel !== null ? String(unionLevel) : "",
    charImg,
    font
  )
}
