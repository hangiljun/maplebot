import { Request } from "./types"
import ContactClient from "./ContactClient"

export const dynamic = "force-dynamic"

const COLLECTION = "feature-requests"

async function getRequests(): Promise<Request[]> {
  try {
    const { getDb } = await import("@/lib/firebase-admin")
    const db = getDb()
    const snapshot = await db
      .collection(COLLECTION)
      .orderBy("createdAt", "desc")
      .limit(100)
      .get()
    return snapshot.docs.map(doc => {
      const d = doc.data()
      return {
        id:          doc.id,
        title:       d.title,
        description: d.description ?? null,
        nickname:    d.nickname || "익명",
        priority:    d.priority ?? "medium",
        status:      d.status   ?? "reviewing",
        createdAt:   d.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
      } as Request
    })
  } catch {
    return []
  }
}

export default async function ContactPage() {
  const initialRequests = await getRequests()
  return <ContactClient initialRequests={initialRequests} />
}
