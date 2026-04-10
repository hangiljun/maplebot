import { initializeApp, getApps, cert, App } from "firebase-admin/app"
import { getFirestore, Firestore } from "firebase-admin/firestore"

let app: App | undefined
let _db: Firestore | undefined

export function getDb(): Firestore {
  if (_db) return _db

  if (!getApps().length) {
    app = initializeApp({
      credential: cert({
        projectId:   process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    })
  }

  _db = getFirestore(app ?? getApps()[0])
  return _db
}
