// firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Session ID for this couple
export const SESSION_ID = 'jenny-andrew-2026'; // Change this to something unique

export async function saveAnswer(scenarioId: string, userId: string, answerId: string) {
  await setDoc(
    doc(db, 'sessions', SESSION_ID, 'scenarios', scenarioId),
    { [userId]: answerId },
    { merge: true }
  );
}

export async function getAnswer(scenarioId: string, userId: string) {
  const docRef = doc(db, 'sessions', SESSION_ID, 'scenarios', scenarioId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data()[userId] : null;
}

export function subscribeToScenario(scenarioId: string, callback: (data: any) => void) {
  const docRef = doc(db, 'sessions', SESSION_ID, 'scenarios', scenarioId);
  return onSnapshot(docRef, (doc) => {
    callback(doc.data() || {});
  });
}

export async function saveCharacter(userId: string, characterId: string) {
  await setDoc(
    doc(db, 'sessions', SESSION_ID),
    { [userId]: characterId },
    { merge: true }
  );
}

export async function getSession() {
  const docRef = doc(db, 'sessions', SESSION_ID);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
}
