import { ImageResponse } from "next/og"
import { fetchCharacter, COMBAT_POWER_STAT } from "@/lib/maple"

export const runtime = "nodejs"

let fontCache: ArrayBuffer | null = null
async function loadFont() {
  if (fontCache) return fontCache
  const res = await fetch(
    "https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/public/static/Pretendard-Bold.woff2"
  )
  fontCache = await res.arrayBuffer()
  return fontCache
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

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params
  const decoded = decodeURIComponent(name)

  const [data, font] = await Promise.all([fetchCharacter(decoded), loadFont()])

  if (!data) return new Response("Not found", { status: 404 })

  const { basic } = data
  const cp = data.stats.find((s) => s.stat_name === COMBAT_POWER_STAT)?.stat_value ?? "0"
  const unionLevel = data.union?.union_level ?? null

  const rows = [
    { label: "서버",   value: basic.world_name },
    { label: "전투력", value: formatPower(cp) },
    { label: "길드",   value: basic.character_guild_name || "없음" },
    { label: "유니온", value: unionLevel !== null ? String(unionLevel) : "–" },
  ]

  return new ImageResponse(
    (
      <div
        style={{
          width: 400,
          height: 520,
          background: "linear-gradient(160deg, #fff8ed 0%, #fde8c8 100%)",
          borderRadius: 24,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: "Pretendard",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* 🍁 뱃지 */}
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            width: 36,
            height: 36,
            background: "#f59e0b",
            borderRadius: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
          }}
        >
          🍁
        </div>

        {/* 캐릭터 이미지 */}
        <div style={{ height: 220, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingTop: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={basic.character_image}
            width={180}
            height={180}
            style={{ objectFit: "contain" }}
            alt={basic.character_name}
          />
        </div>

        {/* 이름 + 레벨 */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            padding: "0 28px",
            marginTop: 8,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 26, fontWeight: 900, color: "#1c1917" }}>
              {basic.character_name}
            </span>
            <span style={{ fontSize: 13, color: "#78716c", marginTop: 2 }}>
              {basic.character_class}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <span style={{ fontSize: 52, fontWeight: 900, color: "#ef4444", lineHeight: 1 }}>
              {basic.character_level}
            </span>
            <span style={{ fontSize: 10, color: "#f87171", letterSpacing: 3, fontWeight: 700 }}>
              LEVEL
            </span>
          </div>
        </div>

        {/* 점선 구분선 */}
        <div
          style={{
            width: "calc(100% - 56px)",
            height: 1,
            background: "#d6b89a",
            margin: "12px 28px",
            opacity: 0.5,
          }}
        />

        {/* 정보 그리드 */}
        <div style={{ width: "100%", padding: "0 28px", display: "flex", flexDirection: "column", gap: 10 }}>
          {rows.map(({ label, value }) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 13, color: "#92400e", fontWeight: 700, opacity: 0.7 }}>
                {label}
              </span>
              <span style={{ fontSize: 15, fontWeight: 900, color: "#1c1917" }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      width: 400,
      height: 520,
      fonts: [{ name: "Pretendard", data: font, style: "normal", weight: 700 }],
    }
  )
}
