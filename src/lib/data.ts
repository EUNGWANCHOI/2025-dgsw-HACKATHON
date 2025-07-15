
import { db, IS_FIREBASE_CONFIGURED } from './firebase';
import { collection, getDocs, getDoc, doc, addDoc, query, where, serverTimestamp, orderBy, limit, Timestamp, updateDoc, arrayUnion } from 'firebase/firestore';
import type { Content, CommunityComment } from './types';
import { MOCK_CONTENTS, MOCK_USERS } from './mock-data';

// Firestore 사용 가능 여부를 더 명확하게 확인 (환경 변수 + 초기화 성공)
const USE_MOCK_DATA = !IS_FIREBASE_CONFIGURED;

const getMockContents = () => Promise.resolve(JSON.parse(JSON.stringify(MOCK_CONTENTS)));
const findMockContentById = (id: string) => MOCK_CONTENTS.find(c => c.id === id);

export async function getContents(): Promise<Content[]> {
  if (USE_MOCK_DATA) {
    console.warn("Using mock data: Firebase is not configured.");
    return getMockContents();
  }

  try {
    const contentsCol = collection(db, 'contents');
    const q = query(contentsCol, orderBy('createdAt', 'desc'), limit(20));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Content));
  } catch (error: any) {
    console.warn("Error fetching contents from Firestore, falling back to mock data:", error.message);
    return getMockContents();
  }
}

export async function getContentById(id: string): Promise<Content | undefined> {
  if (USE_MOCK_DATA) {
    console.warn(`Using mock data: Firebase is not configured (content ID: ${id}).`);
    const content = findMockContentById(id);
    return Promise.resolve(content ? JSON.parse(JSON.stringify(content)) : undefined);
  }

  try {
    const contentDocRef = doc(db, 'contents', id);
    const contentSnap = await getDoc(contentDocRef);
    
    if (!contentSnap.exists()) {
      console.warn(`Content with ID ${id} not found in Firestore. Falling back to mock data.`);
      const mockContent = findMockContentById(id);
      return Promise.resolve(mockContent ? JSON.parse(JSON.stringify(mockContent)) : undefined);
    }
    
    const contentData = { id: contentSnap.id, ...contentSnap.data() } as Content;
    
    const feedbackCol = collection(db, `contents/${id}/communityFeedback`);
    const feedbackQuery = query(feedbackCol, orderBy('createdAt', 'desc'));
    const feedbackSnapshot = await getDocs(feedbackCol);
    contentData.communityFeedback = feedbackSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()} as CommunityComment));
    
    return contentData;
  } catch (error: any) {
    console.warn(`Error fetching content by ID ${id} from Firestore, falling back to mock data:`, error.message);
    const mockContent = findMockContentById(id);
    return Promise.resolve(mockContent ? JSON.parse(JSON.stringify(mockContent)) : undefined);
  }
}

export async function getUserContents(userName: string): Promise<Content[]> {
  const getMockUserContents = () => Promise.resolve(JSON.parse(JSON.stringify(MOCK_CONTENTS.filter(c => c.author.name === userName))));
  
  if (USE_MOCK_DATA) {
    console.warn(`Using mock data: Firebase is not configured (user: ${userName}).`);
    return getMockUserContents();
  }
    
  try {
    const contentsCol = collection(db, 'contents');
    const q = query(contentsCol, where('author.name', '==', userName), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Content));
  } catch (error: any) {
    console.warn(`Error fetching user contents for ${userName} from Firestore, falling back to mock data:`, error.message);
    return getMockUserContents();
  }
}

export async function addContent(content: Omit<Content, 'id' | 'createdAt'>): Promise<string> {
  if (USE_MOCK_DATA) {
    console.warn("Adding mock content because Firebase is not configured.");
    const newContent: Content = {
        ...content,
        id: `mock-${Date.now()}`,
        createdAt: Timestamp.now(), // Firestore Timestamp for mock
        communityFeedback: content.communityFeedback || [],
    };
    MOCK_CONTENTS.unshift(newContent);
    return newContent.id;
  }

  try {
    const { communityFeedback, ...contentData } = content;
    const docRef = await addDoc(collection(db, 'contents'), {
      ...contentData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding document to Firestore: ", error);
    throw new Error("Failed to publish content to Firestore.");
  }
}

export async function addComment(contentId: string, comment: Omit<CommunityComment, 'id' | 'createdAt'>): Promise<string> {
  if (USE_MOCK_DATA) {
    console.warn(`Adding mock comment to content ID: ${contentId} because Firebase is not configured.`);
    const content = findMockContentById(contentId);
    if (content) {
      const newComment: CommunityComment = {
        ...comment,
        id: `mock-comment-${Date.now()}`,
        createdAt: Timestamp.now(), // Firestore Timestamp for mock
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
    console.error("Error adding comment to Firestore: ", error);
    throw new Error("Failed to add comment to Firestore.");
  }
}
