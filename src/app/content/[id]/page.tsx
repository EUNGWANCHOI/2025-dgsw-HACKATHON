
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  FileText,
  MessageSquare,
  Mic,
  Users,
  Video,
  Wand2,
} from 'lucide-react';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

import { getContentById } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AIFeedback from '@/components/content/ai-feedback';
import CommunityFeedback from '@/components/content/community-feedback';
import { Separator } from '@/components/ui/separator';
import type { ContentCategory } from '@/lib/types';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';

const categoryIcons: Record<ContentCategory, React.ReactNode> = {
  '영상': <Video className="h-4 w-4 text-muted-foreground" />,
  '스크립트': <FileText className="h-4 w-4 text-muted-foreground" />,
  '팟캐스트': <Mic className="h-4 w-4 text-muted-foreground" />,
  '아티클': <FileText className="h-4 w-4 text-muted-foreground" />,
  '채널 기획': <FileText className="h-4 w-4 text-muted-foreground" />,
};

export default async function ContentPage({ params }: { params: { id: string } }) {
  const content = await getContentById(params.id);

  if (!content) {
    notFound();
  }
  
  const createdAtDate = content.createdAt?.toDate();

  return (
    <div className="bg-muted/30">
        <div className="container mx-auto max-w-6xl py-8">
            <Button asChild variant="ghost" className="mb-4">
                <Link href="/feed">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    피드로 돌아가기
                </Link>
            </Button>

            <main className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <div className="relative aspect-video overflow-hidden rounded-lg border bg-white shadow-sm">
                        <Image
                            src={content.thumbnailUrl}
                            alt={content.title}
                            fill
                            className="object-cover"
                            data-ai-hint="creative concept"
                        />
                    </div>
                    <div className="space-y-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                           <div>
                             <h1 className="font-headline text-3xl font-bold tracking-tight">
                                {content.title}
                             </h1>
                             <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    {categoryIcons[content.category]}
                                    <span>{content.category}</span>
                                </div>
                                <span>•</span>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={content.author.avatarUrl} />
                                        <AvatarFallback>{content.author.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span>{content.author.name}</span>
                                </div>
                                <span>•</span>
                                <span>{createdAtDate ? format(createdAtDate, 'yyyy년 MM월 dd일', { locale: ko }) : ''}</span>
                             </div>
                           </div>
                        </div>

                        <Separator/>
                        
                        <div className="prose prose-stone max-w-none text-card-foreground/90">
                            <p className='font-semibold'>설명:</p>
                            <p>{content.description}</p>
                            <p className='font-semibold mt-4'>콘텐츠/스크립트:</p>
                            <blockquote className='text-sm'>
                                {content.content}
                            </blockquote>
                        </div>
                    </div>
                </div>

                <aside className="space-y-6 lg:col-span-1">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Wand2 className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight">AI 피드백</h2>
                        </div>
                        {content.aiFeedback ? (
                            <AIFeedback feedback={content.aiFeedback} />
                        ) : (
                            <Card className="flex flex-col items-center justify-center p-8 text-center">
                                <Wand2 className="h-12 w-12 text-muted-foreground/50" />
                                <CardTitle className="mt-4 text-lg">AI 피드백이 없습니다</CardTitle>
                                <CardDescription className="mt-1">
                                이 콘텐츠는 AI 피드백 없이 게시되었습니다.
                                </CardDescription>
                            </Card>
                        )}
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-accent-foreground">
                                <Users className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight">커뮤니티 피드백</h2>
                        </div>
                        <CommunityFeedback comments={content.communityFeedback || []} />
                    </div>
                </aside>
            </main>
        </div>
    </div>
  );
}
