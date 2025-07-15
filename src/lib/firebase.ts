
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

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

// 모든 Firebase 관련 환경 변수가 설정되었는지 확인
const IS_FIREBASE_CONFIGURED = 
    !!firebaseConfig.apiKey &&
    !!firebaseConfig.authDomain &&
    !!firebaseConfig.projectId &&
    !!firebaseConfig.storageBucket &&
    !!firebaseConfig.messagingSenderId &&
    !!firebaseConfig.appId;


if (IS_FIREBASE_CONFIGURED) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
} else {
    console.warn("Firebase environment variables are not set. Firebase is not initialized. Using mock data where applicable.");
    // Firebase가 설정되지 않았을 때 mock 객체 할당
    app = {} as FirebaseApp; // 빈 객체로 초기화
    auth = { onAuthStateChanged: () => () => {} } as unknown as Auth; // onAuthStateChanged가 있는 mock auth
    db = { app: null } as unknown as Firestore; // app 속성으로 초기화 여부 판단
    storage = {} as FirebaseStorage;
}


export { app, auth, db, storage, IS_FIREBASE_CONFIGURED };
