'use server';

import { z } from 'zod';
import { analyzeContentForImprovements } from '@/ai/flows/analyze-content-for-improvements';
import { analyzeYouTubeVideo } from '@/ai/flows/analyze-youtube-video';
import type { AIFeedback, Content } from '@/lib/types';
import { getContents, getCurrentUser, addContent } from '@/lib/data';


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
    return { success: false, error: '서버 오류로 인해 콘텐츠 분석에 실패했습니다.' };
  }
}

export async function publishContent(
  values: z.infer<typeof formSchema>,
  aiFeedback: AIFeedback | null
): Promise<{ success: boolean, contentId?: string; error?: string; }> {
  try {
    const validatedData = formSchema.parse(values);
    const [contents, user] = await Promise.all([getContents(), getCurrentUser()]);
    
    const newContentId = (contents.length + 1).toString();
    
    const newContent: Content = {
      id: newContentId,
      title: validatedData.title,
      description: validatedData.description,
      category: validatedData.category,
      content: validatedData.content || `YouTube 영상: ${validatedData.youtubeUrl}`,
      author: user,
      thumbnailUrl: 'https://placehold.co/600x400.png',
      createdAt: '방금 전',
      communityFeedback: [],
    };

    if (aiFeedback) {
        newContent.aiFeedback = aiFeedback;
    }

    addContent(newContent);
    
    return { success: true, contentId: newContentId };

  } catch (error) {
    console.error('Error publishing content:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: '잘못된 데이터가 제공되었습니다.' };
    }
    return { success: false, error: '서버 오류로 인해 콘텐츠 게시에 실패했습니다.' };
  }
}
