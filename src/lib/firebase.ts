
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 모든 Firebase 관련 환경 변수가 설정되었는지 확인
const ARE_ALL_ENV_VARS_SET = 
    !!firebaseConfig.apiKey &&
    !!firebaseConfig.authDomain &&
    !!firebaseConfig.projectId &&
    !!firebaseConfig.storageBucket &&
    !!firebaseConfig.messagingSenderId &&
    !!firebaseConfig.appId;

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let IS_FIREBASE_CONFIGURED: boolean;

try {
  if (ARE_ALL_ENV_VARS_SET) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    IS_FIREBASE_CONFIGURED = true;
  } else {
    throw new Error("Firebase environment variables are not set.");
  }
} catch (e) {
    if (e instanceof Error && e.message.includes("Firebase environment variables are not set")) {
        console.warn("Firebase environment variables are not set. Firebase is not initialized. Using mock data where applicable.");
    } else {
        console.error('Firebase initialization error, falling back to mock implementation:', e);
    }
    app = {} as FirebaseApp;
    auth = { onAuthStateChanged: () => () => {} } as unknown as Auth;
    db = {} as Firestore;
    storage = {} as FirebaseStorage;
    IS_FIRE_CONFIGURED = false;
}


export { app, auth, db, storage, IS_FIREBASE_CONFIGURED };
