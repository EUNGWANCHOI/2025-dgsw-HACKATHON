
import { db } from './firebase';
import { collection, getDocs, getDoc, doc, addDoc, query, where, serverTimestamp, orderBy, limit, Timestamp, updateDoc, arrayUnion } from 'firebase/firestore';
import type { Content, CommunityComment } from './types';
import { MOCK_CONTENTS, MOCK_USERS } from './mock-data';

const USE_MOCK_DATA = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

export async function getContents(): Promise<Content[]> {
  if (USE_MOCK_DATA || !db.app) {
    console.log("Using mock data for contents");
    return MOCK_CONTENTS;
  }
  try {
    const contentsCol = collection(db, 'contents');
    const q = query(contentsCol, orderBy('createdAt', 'desc'), limit(20));
    const contentSnapshot = await getDocs(q);
    const contentList = contentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Content));
    return contentList;
  } catch (error) {
    console.error("Error fetching contents, falling back to mock data:", error);
    return MOCK_CONTENTS;
  }
}

export async function getContentById(id: string): Promise<Content | undefined> {
   if (USE_MOCK_DATA || !db.app) {
    console.log(`Using mock data for content ID: ${id}`);
    const content = MOCK_CONTENTS.find(c => c.id === id);
    return content;
  }
  try {
    const contentDocRef = doc(db, 'contents', id);
    const contentSnap = await getDoc(contentDocRef);
    if (contentSnap.exists()) {
      const contentData = { id: contentSnap.id, ...contentSnap.data() } as Content;
      const feedbackCol = collection(db, `contents/${id}/communityFeedback`);
      const feedbackQuery = query(feedbackCol, orderBy('createdAt', 'desc'));
      const feedbackSnapshot = await getDocs(feedbackQuery);
      contentData.communityFeedback = feedbackSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()} as CommunityComment));
      return contentData;
    } else {
      console.warn(`Content with ID ${id} not found in Firestore. Checking mock data.`);
      return MOCK_CONTENTS.find(c => c.id === id);
    }
  } catch (error) {
    console.error("Error fetching content by ID, falling back to mock data: ", error);
    console.warn(`Falling back to mock data for content ID: ${id}`);
    return MOCK_CONTENTS.find(c => c.id === id);
  }
}

export async function getUserContents(userName: string): Promise<Content[]> {
    if (USE_MOCK_DATA || !db.app) {
        console.log(`Using mock data for user contents: ${userName}`);
        return MOCK_CONTENTS.filter(c => c.author.name === userName);
    }
    try {
        const contentsCol = collection(db, 'contents');
        const q = query(contentsCol, where('author.name', '==', userName), orderBy('createdAt', 'desc'));
        const contentSnapshot = await getDocs(q);
        const contentList = contentSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Content));
        return contentList;
    } catch (error) {
        console.error("Error fetching user contents, falling back to mock data: ", error);
        console.warn(`Falling back to mock data for user contents: ${userName}`);
        return MOCK_CONTENTS.filter(c => c.author.name === userName);
    }
}

export async function addContent(content: Omit<Content, 'id' | 'createdAt'>): Promise<string> {
  if (USE_MOCK_DATA || !db.app) {
    console.log("Adding mock content");
    const newContent = {
        ...content,
        id: `mock-${Date.now()}`,
        createdAt: Timestamp.now(),
    };
    MOCK_CONTENTS.unshift(newContent);
    return newContent.id;
  }
  try {
    const docRef = await addDoc(collection(db, 'contents'), {
      ...content,
      communityFeedback: [], // Start with empty array, subcollection will be used
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw new Error("Failed to publish content to Firestore.");
  }
}

export async function addComment(contentId: string, comment: Omit<CommunityComment, 'id' | 'createdAt'>): Promise<string> {
  if (USE_MOCK_DATA || !db.app) {
    console.log(`Adding mock comment to content ID: ${contentId}`);
    const content = MOCK_CONTENTS.find(c => c.id === contentId);
    if (content) {
      const newComment: CommunityComment = {
        ...comment,
        id: `mock-comment-${Date.now()}`,
        createdAt: Timestamp.now(),
      };
      if (!content.communityFeedback) {
        content.communityFeedback = [];
      }
      content.communityFeedback.unshift(newComment);
      return newComment.id!;
    }
    throw new Error('Mock content not found');
  }

  try {
    const feedbackCol = collection(db, `contents/${contentId}/communityFeedback`);
    const docRef = await addDoc(feedbackCol, {
      ...comment,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding comment: ", error);
    throw new Error("Failed to add comment to Firestore.");
  }
}
