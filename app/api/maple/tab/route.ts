import { NextRequest, NextResponse } from "next/server"
import { fetchTabData, fetchCharacterTimeline } from "@/lib/maple"

export const dynamic = "force-dynamic"

const VALID_TABS = new Set(["equipment", "ability", "symbol", "hexa", "codi", "charhistory", "battlepractice"])

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name")?.trim()
  const tab  = req.nextUrl.searchParams.get("tab")?.trim()

  if (!name || !tab) return NextResponse.json({ error: "name과 tab이 필요합니다" }, { status: 400 })
  if (!VALID_TABS.has(tab)) return NextResponse.json({ error: "유효하지 않은 탭입니다" }, { status: 400 })

  if (tab === "charhistory") {
    const data = await fetchCharacterTimeline(name)
    if (!data) return NextResponse.json({ error: "캐릭터를 찾을 수 없습니다" }, { status: 404 })
    return NextResponse.json({ charhistory: data })
  }

  const data = await fetchTabData(name, tab)
  if (!data) return NextResponse.json({ error: "캐릭터를 찾을 수 없습니다" }, { status: 404 })

  return NextResponse.json(data)
}
