import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';

const COLLECTION = 'bookmark-visits';

export async function GET() {
  try {
    const db = getDb();
    const snapshot = await db.collection(COLLECTION).limit(1).get();

    if (snapshot.empty) {
      return NextResponse.json({});
    }

    const data = snapshot.docs[0].data();
    return NextResponse.json(data.visits || {});
  } catch (error) {
    console.error('Error fetching bookmark visits:', error);
    return NextResponse.json({}, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { bookmarkId } = await request.json();

    if (!bookmarkId) {
      return NextResponse.json({ error: 'Bookmark ID is required' }, { status: 400 });
    }

    const db = getDb();
    const docRef = db.collection(COLLECTION).doc('admin-visits');
    const now = new Date().toISOString();

    await docRef.set({
      visits: {
        [bookmarkId]: now
      }
    }, { merge: true });

    return NextResponse.json({ success: true, timestamp: now });
  } catch (error) {
    console.error('Error saving bookmark visit:', error);
    return NextResponse.json({ error: 'Failed to save visit' }, { status: 500 });
  }
}
