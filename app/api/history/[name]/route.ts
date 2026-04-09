import { NextRequest, NextResponse } from "next/server"
import { fetchHistory } from "@/lib/maple"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params
  const decoded = decodeURIComponent(name)
  const data = await fetchHistory(decoded)
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(data)
}
