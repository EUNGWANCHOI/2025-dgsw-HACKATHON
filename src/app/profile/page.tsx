
'use client';

import AppSidebar from '@/components/common/app-sidebar';
import Header from '@/components/common/header';
import ContentCard from '@/components/content/content-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SidebarInset } from '@/components/ui/sidebar';
import { getUserContents } from '@/lib/data';
import { useAuth } from '@/contexts/auth-context';
import { useEffect, useState } from 'react';
import type { Content } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [userContent, setUserContent] = useState<Content[]>([]);
    const [contentLoading, setContentLoading] = useState(true);

    useEffect(() => {
        if (loading) return;
        if (!user) {
            router.push('/login');
            return;
        }

        const fetchContent = async () => {
            setContentLoading(true);
            const content = await getUserContents(user.name);
            setUserContent(content);
            setContentLoading(false);
        }
        fetchContent();
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="flex min-h-screen">
                <AppSidebar />
                <div className="flex-1">
                    <SidebarInset>
                    <Header title="프로필" />
                    <main className="p-4 sm:p-6 lg:p-8">
                        <Card className="mb-8">
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                                    <Skeleton className="h-24 w-24 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-8 w-32" />
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-10 w-full max-w-prose" />
                                    </div>
                                    <Skeleton className="h-10 w-24" />
                                </div>
                            </CardContent>
                        </Card>
                        <Skeleton className="h-8 w-48 mb-6" />
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {[...Array(4)].map((_, i) => (
                                <Card key={i}>
                                    <Skeleton className="aspect-video w-full" />
                                    <CardContent className="p-4 space-y-2">
                                        <Skeleton className="h-4 w-1/4" />
                                        <Skeleton className="h-6 w-3/4" />
                                        <Skeleton className="h-10 w-full" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </main>
                    </SidebarInset>
                </div>
            </div>
        )
    }

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1">
        <SidebarInset>
          <Header title="프로필" />
          <main className="p-4 sm:p-6 lg:p-8">
            <Card className="mb-8">
                <CardContent className="p-6">
                    <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                        <Avatar className="h-24 w-24 border-4 border-primary/20">
                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                            <AvatarFallback className="text-3xl">
                                {user.name.split(' ').map((n) => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
                            <p className="text-muted-foreground">콘텐츠 크리에이터</p>
                            <p className="mt-2 text-sm max-w-prose">
                                스토리텔링과 시각 예술에 열정을 가지고 있습니다. 커뮤니티와 함께 배우고 성장하기 위해 왔습니다.
                            </p>
                        </div>
                        <Button>프로필 수정</Button>
                    </div>
                </CardContent>
            </Card>
            
            <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">내 콘텐츠</h2>
                {contentLoading ? (
                     <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {[...Array(4)].map((_, i) => (
                            <Card key={i}>
                                <Skeleton className="aspect-video w-full" />
                                <CardContent className="p-4 space-y-2">
                                    <Skeleton className="h-4 w-1/4" />
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-10 w-full" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : userContent.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {userContent.map((content) => (
                        <ContentCard key={content.id} content={content} />
                    ))}
                    </div>
                ) : (
                    <p>아직 업로드된 콘텐츠가 없습니다.</p>
                )}
            </div>

          </main>
        </SidebarInset>
      </div>
    </div>
  );
}
