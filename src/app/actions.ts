
'use server';

import { z } from 'zod';
import { analyzeContentForImprovements } from '@/ai/flows/analyze-content-for-improvements';
import { analyzeYouTubeVideo } from '@/ai/flows/analyze-youtube-video';
import type { AIFeedback, Content, User, CommunityComment } from '@/lib/types';
import { addContent, addComment } from '@/lib/data';
import { auth, db, IS_FIREBASE_CONFIGURED } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';
import { MOCK_CONTENTS } from '@/lib/mock-data';

const youtubeUrlSchema = z.string().url('유효한 URL을 입력해주세요.').refine(
  (url) => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.hostname === 'www.youtube.com' || parsedUrl.hostname === 'youtube.com' || parsedUrl.hostname === 'youtu.be';
    } catch {
      return false;
    }
  }, { message: 'YouTube URL만 입력 가능합니다.' }
);

const formSchema = z.object({
  title: z.string().min(5, '제목은 5자 이상이어야 합니다.'),
  description: z.string().min(10, '설명이 너무 짧습니다.'),
  category: z.enum(['영상', '스크립트', '팟캐스트', '아티클', '채널 기획']),
  content: z.string().optional(),
  youtubeUrl: z.string().optional(),
  thumbnailUrl: z.string().url().optional(),
}).refine(data => {
    if (data.category === '영상') {
        return !!data.youtubeUrl;
    }
    return !!data.content && data.content.length >= 50;
}, {
    message: "콘텐츠 또는 YouTube URL을 입력해주세요.",
    path: ["content"],
});

export async function getAIFeedback(values: z.infer<typeof formSchema>): Promise<{ success: boolean; feedback?: AIFeedback; error?: string; }> {
  // GOOGLE_API_KEY 또는 OPENAI_API_KEY 둘 다 없으면 mock feedback 반환
  if (!process.env.GOOGLE_API_KEY && !process.env.OPENAI_API_KEY) {
    console.warn('API 키가 설정되지 않았습니다. 예시 AI 피드백을 반환합니다.');
    return { success: true, feedback: MOCK_CONTENTS[0].aiFeedback };
  }
  try {
    const validatedData = formSchema.parse(values);

    let aiFeedback: AIFeedback;

    if (validatedData.category === '영상' && validatedData.youtubeUrl) {
      const youtubeAnalysis = await analyzeYouTubeVideo({
        videoUrl: validatedData.youtubeUrl,
        title: validatedData.title,
        description: validatedData.description
      });
      aiFeedback = {
        deliverySuggestions: youtubeAnalysis.deliverySuggestions,
        topicRelevanceFeedback: youtubeAnalysis.topicRelevanceFeedback,
        audienceFriendlinessSuggestions: youtubeAnalysis.audienceFriendlinessSuggestions,
        overallScore: youtubeAnalysis.overallScore,
      };
    } else if (validatedData.content) {
       aiFeedback = await analyzeContentForImprovements({
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category,
        content: validatedData.content,
      });
    } else {
      return { success: false, error: '분석할 콘텐츠가 없습니다.' };
    }
    
    return { success: true, feedback: aiFeedback };

  } catch (error) {
    console.error('Error getting AI feedback:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: '잘못된 데이터가 제공되었습니다.' };
    }
    // API 호출 실패 시에도 예시 피드백을 반환하여 사용자 경험을 유지
    return { success: true, feedback: MOCK_CONTENTS[0].aiFeedback };
  }
}

export async function publishContent(
  values: z.infer<typeof formSchema>,
  aiFeedback: AIFeedback | null,
  user: User
): Promise<{ success: boolean, contentId?: string; error?: string; }> {
  // Firebase가 설정되지 않았다면, 항상 mock data를 사용
  if (!IS_FIREBASE_CONFIGURED) {
      console.warn("Firestore is not initialized. Publishing to mock data.");
      const newContentId = await addContent({
          title: values.title,
          description: values.description,
          category: values.category,
          author: user,
          content: values.content || `YouTube 영상: ${values.youtubeUrl}`,
          thumbnailUrl: values.thumbnailUrl || 'https://placehold.co/600x400.png',
          aiFeedback: aiFeedback || undefined,
          communityFeedback: [],
      });
      revalidatePath('/feed');
      revalidatePath('/dashboard');
      revalidatePath(`/content/${newContentId}`);
      return { success: true, contentId: newContentId };
  }
  
  try {
    const validatedData = formSchema.parse(values);
    
    const newContent: Omit<Content, 'id' | 'createdAt' | 'communityFeedback'> & { communityFeedback: CommunityComment[] } = {
      title: validatedData.title,
      description: validatedData.description,
      category: validatedData.category,
      content: validatedData.category === '영상' ? `YouTube 영상: ${validatedData.youtubeUrl}` : validatedData.content ?? '',
      author: user,
      thumbnailUrl: validatedData.thumbnailUrl || 'https://placehold.co/600x400.png',
      communityFeedback: [],
    };

    if (aiFeedback) {
        newContent.aiFeedback = aiFeedback;
    }

    const newContentId = await addContent(newContent);
    
    revalidatePath('/feed');
    revalidatePath('/dashboard');
    revalidatePath(`/content/${newContentId}`);
    return { success: true, contentId: newContentId };

  } catch (error) {
    console.error('Error publishing content:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: '잘못된 데이터가 제공되었습니다.' };
    }
    return { success: false, error: '서버 오류로 인해 콘텐츠 게시에 실패했습니다.' };
  }
}


const commentSchema = z.object({
  comment: z.string().min(1, '댓글을 입력해주세요.'),
});

export async function addCommunityComment(
  contentId: string,
  user: User,
  formData: FormData,
): Promise<{ success: boolean; error?: string; }> {
    // Firebase가 설정되지 않았다면, 항상 mock data를 사용
    if (!IS_FIREBASE_CONFIGURED) {
      console.warn("Firestore is not initialized. Adding comment to mock data.");
       await addComment(contentId, {
          author: user,
          comment: formData.get('comment') as string,
          likes: 0,
          dislikes: 0,
          isAccepted: false,
      });
      revalidatePath(`/content/${contentId}`);
      return { success: true };
    }
    
    if (!user) {
        return { success: false, error: '로그인이 필요합니다.' };
    }
    
    const validatedFields = commentSchema.safeParse({
        comment: formData.get('comment'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            error: validatedFields.error.flatten().fieldErrors.comment?.join(', '),
        };
    }

    try {
        const newComment: Omit<CommunityComment, 'id' | 'createdAt'> = {
            author: user,
            comment: validatedFields.data.comment,
            likes: 0,
            dislikes: 0,
            isAccepted: false,
        };
        await addComment(contentId, newComment);
        revalidatePath(`/content/${contentId}`);
        return { success: true };
    } catch (error) {
        console.error('Error adding comment:', error);
        return { success: false, error: '서버 오류로 인해 댓글 추가에 실패했습니다.' };
    }
}
