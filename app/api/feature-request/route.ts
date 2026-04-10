import { NextRequest, NextResponse } from "next/server"
import { FieldValue } from "firebase-admin/firestore"

export const dynamic = "force-dynamic"

const COLLECTION = "feature-requests"

// ── GET: Firestore에서 기능 요청 목록 조회 ────────────────────────────────────
export async function GET() {
  try {
    const { getDb } = await import("@/lib/firebase-admin")
    const db = getDb()

    const snapshot = await db
      .collection(COLLECTION)
      .orderBy("createdAt", "desc")
      .limit(100)
      .get()

    const requests = snapshot.docs.map(doc => {
      const d = doc.data()
      return {
        id:          doc.id,
        title:       d.title,
        description: d.description,
        nickname:    d.nickname || "익명",
        priority:    d.priority ?? "medium",
        status:      d.status   ?? "reviewing",
        createdAt:   d.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
      }
    })

    return NextResponse.json(requests)
  } catch (e) {
    console.error("GET /api/feature-request", e)
    return NextResponse.json([])
  }
}

// ── POST: 새 기능 요청 → Firestore 저장 ──────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { title, description, nickname } = await req.json()

    if (!title?.trim() || !description?.trim()) {
      return NextResponse.json({ error: "제목과 내용을 입력해주세요." }, { status: 400 })
    }
    if (title.trim().length > 80) {
      return NextResponse.json({ error: "제목은 80자 이하로 입력해주세요." }, { status: 400 })
    }
    if (description.trim().length > 500) {
      return NextResponse.json({ error: "내용은 500자 이하로 입력해주세요." }, { status: 400 })
    }

    const { getDb } = await import("@/lib/firebase-admin")
    const db = getDb()

    await db.collection(COLLECTION).add({
      title:       title.trim(),
      description: description.trim(),
      nickname:    nickname?.trim() || "익명",
      priority:    "medium",
      status:      "reviewing",
      createdAt:   FieldValue.serverTimestamp(),
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("POST /api/feature-request", e)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
