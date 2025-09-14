import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

let initializationAttempted = false;

function areFirebaseKeysPresent(): boolean {
  const env = (globalThis as any).process?.env;
  return !!(env?.FIREBASE_API_KEY && env?.FIREBASE_AUTH_DOMAIN && env?.FIREBASE_PROJECT_ID);
}
export const isFirebaseEnabled = areFirebaseKeysPresent();

function initializeFirebase() {
  if (app) {
    return;
  }
  
  if (initializationAttempted || !isFirebaseEnabled) {
      if (!initializationAttempted && !isFirebaseEnabled) {
          console.log("Firebase configuration is missing. Login and history features are disabled.");
      }
      initializationAttempted = true;
      return;
  }
  initializationAttempted = true;

  const env = (globalThis as any).process?.env;

  const firebaseConfig = {
    apiKey: env?.FIREBASE_API_KEY,
    authDomain: env?.FIREBASE_AUTH_DOMAIN,
    projectId: env?.FIREBASE_PROJECT_ID,
    storageBucket: env?.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env?.FIREBASE_MESSAGING_SENDER_ID,
    appId: env?.FIREBASE_APP_ID,
  };

  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export function getFirebaseAuth(): Auth | null {
  initializeFirebase();
  return auth || null;
}

export function getFirestoreDb(): Firestore | null {
  initializeFirebase();
  return db || null;
}
