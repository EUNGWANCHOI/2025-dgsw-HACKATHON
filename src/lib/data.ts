
import { db } from './firebase';
import { collection, getDocs, getDoc, doc, addDoc, query, where, serverTimestamp, orderBy, limit, Timestamp } from 'firebase/firestore';
import type { Content } from './types';
import { MOCK_CONTENTS, MOCK_USERS } from './mock-data';

const USE_MOCK_DATA = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

export async function getContents(): Promise<Content[]> {
  if (USE_MOCK_DATA) {
    console.log("Using mock data for contents");
    return MOCK_CONTENTS;
  }
  if (!db.app) return [];
  try {
    const contentsCol = collection(db, 'contents');
    const q = query(contentsCol, orderBy('createdAt', 'desc'), limit(20));
    const contentSnapshot = await getDocs(q);
    const contentList = contentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Content));
    return contentList;
  } catch (error) {
    console.error("Error fetching contents: ", error);
    return [];
  }
}

export async function getContentById(id: string): Promise<Content | undefined> {
   if (USE_MOCK_DATA) {
    console.log(`Using mock data for content ID: ${id}`);
    return MOCK_CONTENTS.find(c => c.id === id);
  }
  if (!db.app) return undefined;
  try {
    const contentDocRef = doc(db, 'contents', id);
    const contentSnap = await getDoc(contentDocRef);
    if (contentSnap.exists()) {
      return { id: contentSnap.id, ...contentSnap.data() } as Content;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error("Error fetching content by ID: ", error);
    return undefined;
  }
}

export async function getUserContents(userName: string): Promise<Content[]> {
    if (USE_MOCK_DATA) {
        console.log(`Using mock data for user contents: ${userName}`);
        return MOCK_CONTENTS.filter(c => c.author.name === userName);
    }
    if (!db.app) return [];
    try {
        const contentsCol = collection(db, 'contents');
        const q = query(contentsCol, where('author.name', '==', userName), orderBy('createdAt', 'desc'));
        const contentSnapshot = await getDocs(q);
        const contentList = contentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Content));
        return contentList;
    } catch (error) {
        console.error("Error fetching user contents: ", error);
        return [];
    }
}

export async function addContent(content: Omit<Content, 'id' | 'createdAt'>): Promise<string> {
  if (USE_MOCK_DATA) {
    console.log("Adding mock content");
    const newContent = {
        ...content,
        id: `mock-${Date.now()}`,
        createdAt: Timestamp.now(),
    };
    MOCK_CONTENTS.unshift(newContent);
    return newContent.id;
  }
  if (!db.app) throw new Error("Firestore is not initialized");
  try {
    const docRef = await addDoc(collection(db, 'contents'), {
      ...content,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw new Error("Failed to publish content to Firestore.");
  }
}
