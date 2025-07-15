'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, Wand2 } from 'lucide-react';
import { useState } from 'react';

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
import { handleContentUpload } from '@/app/actions';
import { Card, CardContent } from '@/components/ui/card';

const formSchema = z.object({
  title: z.string().min(5, '제목은 5자 이상이어야 합니다.'),
  description: z.string().min(10, '설명이 너무 짧습니다.'),
  category: z.enum(['영상', '스크립트', '팟캐스트', '아티클']),
  content: z
    .string()
    .min(50, '콘텐츠가 너무 짧습니다. 최소 50자 이상 입력해주세요.')
    .max(5000, '콘텐츠가 너무 깁니다. 최대 5000자까지 입력 가능합니다.'),
});

export default function UploadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      content: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const result = await handleContentUpload(values);
      
      if (result.success) {
        toast({
          title: '분석 완료!',
          description: "콘텐츠 분석을 성공적으로 마쳤습니다.",
        });
        console.log('콘텐츠 페이지로 시뮬레이션된 리디렉션:', result.contentId);
        form.reset();
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
        title: '업로드 실패',
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>카테고리</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="콘텐츠 카테고리 선택" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="영상">영상</SelectItem>
                        <SelectItem value="스크립트">스크립트</SelectItem>
                        <SelectItem value="팟캐스트">팟캐스트</SelectItem>
                        <SelectItem value="아티클">아티클</SelectItem>
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
                <FormItem>
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

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>콘텐츠 / 스크립트</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="이곳에 스크립트, 아티클 텍스트 또는 비디오 스크립트를 붙여넣으세요..."
                      className="min-h-[250px] font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    영상/팟캐스트의 경우 스크립트를 제공해주세요. (최대 5000자)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    분석 중...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    콘텐츠 분석
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
