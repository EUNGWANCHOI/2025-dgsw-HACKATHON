
import { db, IS_FIREBASE_CONFIGURED } from './firebase';
import { collection, getDocs, getDoc, doc, addDoc, query, where, serverTimestamp, orderBy, limit, Timestamp } from 'firebase/firestore';
import type { Content, CommunityComment } from './types';
import { MOCK_CONTENTS } from './mock-data';

// Firestore 사용 가능 여부를 더 명확하게 확인 (환경 변수 + 초기화 성공)
const USE_MOCK_DATA = !IS_FIREBASE_CONFIGURED;

// Helper to deep copy mock data to avoid mutation issues across requests
const getMockContents = () => JSON.parse(JSON.stringify(MOCK_CONTENTS));
const findMockContentById = (id: string) => MOCK_CONTENTS.find(c => c.id === id);

export async function getContents(): Promise<Content[]> {
  if (USE_MOCK_DATA) {
    console.warn("Using mock data: Firebase is not configured.");
    return Promise.resolve(getMockContents());
  }

  return getDocs(query(collection(db, 'contents'), orderBy('createdAt', 'desc'), limit(20)))
    .then(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Content)))
    .catch(error => {
      console.warn("Error fetching contents from Firestore, falling back to mock data:", error.message);
      return getMockContents();
    });
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
      throw new Error(`Content with ID ${id} not found.`);
    }
    
    const contentData = { id: contentSnap.id, ...contentSnap.data() } as Content;
    
    const feedbackCol = collection(db, `contents/${id}/communityFeedback`);
    const feedbackQuery = query(feedbackCol, orderBy('createdAt', 'desc'));
    const feedbackSnapshot = await getDocs(feedbackQuery);
    contentData.communityFeedback = feedbackSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()} as CommunityComment));
    
    return contentData;
  } catch (error: any) {
    console.warn(`Error fetching content by ID ${id} from Firestore, falling back to mock data:`, error.message);
    const mockContent = findMockContentById(id);
    return Promise.resolve(mockContent ? JSON.parse(JSON.stringify(mockContent)) : undefined);
  }
}

export async function getUserContents(userName: string): Promise<Content[]> {
  if (USE_MOCK_DATA) {
    console.warn(`Using mock data: Firebase is not configured (user: ${userName}).`);
    return Promise.resolve(MOCK_CONTENTS.filter(c => c.author.name === userName));
  }
    
  return getDocs(query(collection(db, 'contents'), where('author.name', '==', userName), orderBy('createdAt', 'desc')))
    .then(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Content)))
    .catch(error => {
      console.warn(`Error fetching user contents for ${userName} from Firestore, falling back to mock data:`, error.message);
      return MOCK_CONTENTS.filter(c => c.author.name === userName);
    });
}

export async function addContent(content: Omit<Content, 'id' | 'createdAt'>): Promise<string> {
  if (USE_MOCK_DATA) {
    console.warn("Adding mock content because Firebase is not configured.");
    const newContent: Content = {
        ...content,
        id: `mock-${Date.now()}`,
        // Use a structure that mimics a serialized Firestore Timestamp
        createdAt: {
          seconds: Math.floor(Date.now() / 1000),
          nanoseconds: 0,
        } as unknown as Timestamp,
        communityFeedback: content.communityFeedback || [],
    };
    MOCK_CONTENTS.unshift(newContent);
    return newContent.id;
  }

  const { communityFeedback, ...contentData } = content;
  const docRef = await addDoc(collection(db, 'contents'), {
    ...contentData,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function addComment(contentId: string, comment: Omit<CommunityComment, 'id' | 'createdAt'>): Promise<string> {
  if (USE_MOCK_DATA) {
    console.warn(`Adding mock comment to content ID: ${contentId} because Firebase is not configured.`);
    const content = findMockContentById(contentId);
    if (content) {
      const newComment: CommunityComment = {
        ...comment,
        id: `mock-comment-${Date.now()}`,
        createdAt: {
          seconds: Math.floor(Date.now() / 1000),
          nanoseconds: 0,
        } as unknown as Timestamp,
      };
      if (!content.communityFeedback) {
        content.communityFeedback = [];
      }
      content.communityFeedback.unshift(newComment);
      return newComment.id!;
    }
    throw new Error('Mock content not found');
  }

  const feedbackCol = collection(db, `contents/${contentId}/communityFeedback`);
  const docRef = await addDoc(feedbackCol, {
    ...comment,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}
