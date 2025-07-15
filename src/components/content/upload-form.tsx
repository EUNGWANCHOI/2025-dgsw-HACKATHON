
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, Wand2, Send,Youtube } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getAIFeedback, publishContent } from '@/app/actions';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import type { AIFeedback as AIFeedbackType } from '@/lib/types';
import AIFeedback from './ai-feedback';
import { useAuth } from '@/contexts/auth-context';


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
  content: z.string().max(5000, '콘텐츠가 너무 깁니다. 최대 5000자까지 입력 가능합니다.').optional(),
  youtubeUrl: z.string().optional(),
}).refine(data => {
    if (data.category === '영상') {
        return youtubeUrlSchema.safeParse(data.youtubeUrl).success;
    }
    return !!data.content && data.content.length >= 50;
}, {
    message: "선택한 카테고리에 맞는 콘텐츠를 입력해주세요.",
    path: ["content"],
});


export default function UploadForm() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<AIFeedbackType | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const { user, loading } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      content: '',
      youtubeUrl: '',
      category: '스크립트',
    },
  });

  const category = form.watch('category');

  async function onAnalyze(values: z.infer<typeof formSchema>) {
    setIsAnalyzing(true);
    setAiFeedback(null);

    if (!process.env.NEXT_PUBLIC_GOOGLE_API_KEY && !process.env.GOOGLE_API_KEY) {
        toast({
            variant: 'destructive',
            title: 'AI 분석 불가',
            description: 'API 키가 설정되지 않았습니다. AI 피드백을 받으려면 .env 파일에 키를 추가해주세요.',
        });
        setIsAnalyzing(false);
        return;
    }

    try {
      const result = await getAIFeedback(values);
      
      if (result.success && result.feedback) {
        setAiFeedback(result.feedback);
        toast({
          title: '분석 완료!',
          description: "콘텐츠 분석을 성공적으로 마쳤습니다. 결과를 확인해보세요.",
        });
      } else {
        throw new Error(result.error || 'AI 피드백을 가져오는 데 실패했습니다.');
      }
    } catch (error) {
       let message = '알 수 없는 오류가 발생했습니다.';
       if (error instanceof Error) {
         message = error.message;
       }
       toast({
        variant: 'destructive',
        title: '분석 실패',
        description: message,
      });
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function onPublish(values: z.infer<typeof formSchema>) {
    if (!user) {
        toast({
            variant: 'destructive',
            title: '오류',
            description: '콘텐츠를 게시하려면 먼저 로그인해야 합니다.',
        });
        return;
    }
    setIsPublishing(true);
     try {
      const result = await publishContent(values, aiFeedback, user);
      if (result.success && result.contentId) {
        toast({
          title: '게시 완료!',
          description: "콘텐츠를 피드에 성공적으로 게시했습니다.",
        });
        router.push(`/feed`);
      } else {
        throw new Error(result.error || '알 수 없는 오류가 발생했습니다.');
      }
    } catch (error) {
       let message = '알 수 없는 오류가 발생했습니다.';
       if (error instanceof Error) {
         message = error.message;
       }
       toast({
        variant: 'destructive',
        title: '게시 실패',
        description: message,
      });
    } finally {
      setIsPublishing(false);
    }
  }

  const isButtonDisabled = isAnalyzing || isPublishing || loading;

  return (
    <Card>
      <Form {...form}>
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          <CardContent className="p-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>콘텐츠 제목</FormLabel>
                    <FormControl>
                      <Input placeholder="예: 나의 첫 단편 영화" {...field} />
                    </FormControl>
                    <FormDescription>
                      시선을 사로잡는 멋진 제목을 지어보세요.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 mt-8">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>카테고리</FormLabel>
                      <Select onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue('content', '');
                          form.setValue('youtubeUrl', '');
                          setAiFeedback(null);
                      }} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="콘텐츠 카테고리 선택" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="영상">영상 (YouTube)</SelectItem>
                          <SelectItem value="스크립트">스크립트</SelectItem>
                          <SelectItem value="팟캐스트">팟캐스트</SelectItem>
                          <SelectItem value="아티클">아티클</SelectItem>
                          <SelectItem value="채널 기획">채널 기획</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        피드백을 맞춤화하는 데 도움이 됩니다.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className='mt-8'>
                    <FormLabel>설명</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="콘텐츠에 대해 간략하게 설명하고 어떤 피드백을 원하는지 알려주세요."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {category === '영상' ? (
                 <FormField
                  control={form.control}
                  name="youtubeUrl"
                  render={({ field }) => (
                    <FormItem className='mt-8'>
                      <FormLabel>YouTube 영상 주소</FormLabel>
                      <FormControl>
                        <div className="relative">
                           <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                           <Input placeholder="https://www.youtube.com/watch?v=..." {...field} className="pl-9" />
                        </div>
                      </FormControl>
                      <FormDescription>
                        분석할 YouTube 영상의 URL을 입력해주세요.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className='mt-8'>
                      <FormLabel>콘텐츠 / 스크립트</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="이곳에 스크립트, 아티클 텍스트 또는 비디오 스크립트를 붙여넣으세요..."
                          className="min-h-[250px] font-mono text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {category === '팟캐스트' || category === '스크립트' ? '스크립트를 제공해주세요.' : '콘텐츠를 입력해주세요.'} (최대 5000자)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
          </CardContent>
          <CardFooter className="flex flex-col-reverse sm:flex-row sm:justify-end items-center gap-2 p-6 pt-0">
              <Button type="button" variant="outline" onClick={form.handleSubmit(onAnalyze)} disabled={isButtonDisabled}>
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    분석 중...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    AI 피드백 받기
                  </>
                )}
              </Button>
              <Button type="button" onClick={form.handleSubmit(onPublish)} disabled={isButtonDisabled}>
                 {isPublishing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    게시 중...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    피드에 게시하기
                  </>
                )}
              </Button>
          </CardFooter>
        </form>
      </Form>
      {aiFeedback && (
        <div className="p-6 pt-0">
          <CardHeader className="px-0">
             <h2 className="text-2xl font-bold tracking-tight">AI 피드백 결과</h2>
          </CardHeader>
          <AIFeedback feedback={aiFeedback} />
        </div>
      )}
    </Card>
  );
}
