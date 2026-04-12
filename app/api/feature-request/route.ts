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
        id:           doc.id,
        title:        d.title,
        description:  d.description,
        nickname:     d.nickname || "익명",
        priority:     d.priority ?? "medium",
        status:       d.status   ?? "reviewing",
        createdAt:    d.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
        adminComment: d.adminComment ?? null,
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

    const now = new Date()
    const docRef = await db.collection(COLLECTION).add({
      title:       title.trim(),
      description: description.trim(),
      nickname:    nickname?.trim() || "익명",
      priority:    "medium",
      status:      "reviewing",
      createdAt:   FieldValue.serverTimestamp(),
    })

    // 새 아이템을 응답으로 반환 → 클라이언트에서 즉시 목록에 추가
    return NextResponse.json({
      success: true,
      item: {
        id:          docRef.id,
        title:       title.trim(),
        description: description.trim(),
        nickname:    nickname?.trim() || "익명",
        priority:    "medium",
        status:      "reviewing",
        createdAt:   now.toISOString(),
      },
    })
  } catch (e) {
    console.error("POST /api/feature-request", e)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

// ── PATCH: 우선순위/상태 변경 (관리자 전용) ──────────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const { id, adminPassword, priority, status, adminComment } = await req.json()

    if (!id) return NextResponse.json({ error: "ID가 없습니다." }, { status: 400 })

    const correctPassword = process.env.ADMIN_PASSWORD
    if (!correctPassword || adminPassword !== correctPassword) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 })
    }

    const update: Record<string, string | null> = {}
    if (priority)                update.priority     = priority
    if (status)                  update.status       = status
    if (adminComment !== undefined) update.adminComment = adminComment ?? null

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "변경할 항목이 없습니다." }, { status: 400 })
    }

    const { getDb } = await import("@/lib/firebase-admin")
    const db = getDb()

    await db.collection(COLLECTION).doc(id).update(update)
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("PATCH /api/feature-request", e)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}

// ── DELETE: 기능 요청 삭제 (관리자 전용) ─────────────────────────────────────
export async function DELETE(req: NextRequest) {
  try {
    const { id, adminPassword } = await req.json()

    if (!id) {
      return NextResponse.json({ error: "ID가 없습니다." }, { status: 400 })
    }

    const correctPassword = process.env.ADMIN_PASSWORD
    if (!correctPassword || adminPassword !== correctPassword) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 })
    }

    // 비밀번호 확인용 더미 요청 — 삭제하지 않고 400 반환
    if (id === "__check__") {
      return NextResponse.json({ ok: true }, { status: 400 })
    }

    const { getDb } = await import("@/lib/firebase-admin")
    const db = getDb()

    await db.collection(COLLECTION).doc(id).delete()

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("DELETE /api/feature-request", e)
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 })
  }
}
