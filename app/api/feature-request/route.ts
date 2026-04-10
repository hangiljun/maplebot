import { NextRequest, NextResponse } from "next/server"

const OWNER = "hangiljun"
const REPO  = "maplebot"

// ── GET: GitHub Issues에서 기능 요청 목록 조회 ────────────────────────────────
export async function GET() {
  try {
    const headers: HeadersInit = {
      "Accept": "application/vnd.github.v3+json",
      "X-GitHub-Api-Version": "2022-11-28",
    }
    if (process.env.GITHUB_TOKEN) {
      headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`
    }

    // open + closed(done) 모두 가져옴
    const [openRes, closedRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${OWNER}/${REPO}/issues?labels=feature-request&state=open&per_page=50&sort=created&direction=desc`, { headers, next: { revalidate: 30 } }),
      fetch(`https://api.github.com/repos/${OWNER}/${REPO}/issues?labels=feature-request&state=closed&per_page=20&sort=created&direction=desc`, { headers, next: { revalidate: 30 } }),
    ])

    const open   = openRes.ok   ? await openRes.json()   : []
    const closed = closedRes.ok ? await closedRes.json() : []

    return NextResponse.json([...open, ...closed])
  } catch {
    return NextResponse.json([])
  }
}

// ── POST: 새 기능 요청 → GitHub Issue 생성 ────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { title, description, nickname } = await req.json()

    if (!title?.trim() || !description?.trim()) {
      return NextResponse.json({ error: "제목과 내용을 입력해주세요." }, { status: 400 })
    }
    if (title.trim().length > 80) {
      return NextResponse.json({ error: "제목은 80자 이하로 입력해주세요." }, { status: 400 })
    }

    const token = process.env.GITHUB_TOKEN
    if (!token) {
      return NextResponse.json({ error: "서버 설정 오류입니다. 관리자에게 문의해주세요." }, { status: 500 })
    }

    const body = [
      `**요청자:** ${nickname?.trim() || "익명"}`,
      "",
      "**내용:**",
      description.trim(),
    ].join("\n")

    const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/issues`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/vnd.github.v3+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({
        title: title.trim(),
        body,
        labels: ["feature-request", "priority:medium", "status:reviewing"],
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      console.error("GitHub API error:", err)
      return NextResponse.json({ error: "요청 전송에 실패했습니다. 잠시 후 다시 시도해주세요." }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
