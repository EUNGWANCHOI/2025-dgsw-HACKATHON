
'use client';

import { Check, MessageSquare, Send, ThumbsDown, ThumbsUp, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { CommunityComment } from '@/lib/types';
import { useAuth } from '@/contexts/auth-context';
import { Textarea } from '../ui/textarea';
import React, { useRef, useState, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { addCommunityComment } from '@/app/actions';

interface CommunityFeedbackFormProps {
  contentId: string;
  comments: CommunityComment[];
}

function SubmitButton() {
    const [isPending, startTransition] = useTransition();
    
    return (
        <Button type="submit" size="icon" disabled={isPending} >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">댓글 달기</span>
        </Button>
    )
}

export default function CommunityFeedbackForm({ contentId, comments }: CommunityFeedbackFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  const handleFormAction = async (formData: FormData) => {
    if (!user) {
        toast({ variant: 'destructive', title: '오류', description: '로그인이 필요합니다.' });
        return;
    }
    
    startTransition(async () => {
        const result = await addCommunityComment(contentId, user, formData);
        if(result.success) {
            toast({ title: '성공', description: '댓글이 성공적으로 등록되었습니다.' });
            formRef.current?.reset();
        } else {
            toast({ variant: 'destructive', title: '오류', description: result.error });
        }
    });
  }

  return (
    <Card>
      <CardContent className="p-4">
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground/50" />
            <CardTitle className="mt-4 text-lg">아직 커뮤니티 피드백이 없습니다</CardTitle>
            <CardDescription className="mt-1">
              가장 먼저 피드백을 남겨보세요!
            </CardDescription>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={comment.author.avatarUrl} />
                  <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">{comment.author.name}</p>
                      <p className="text-xs text-muted-foreground">
                          {comment.createdAt ? formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true, locale: ko }) : ''}
                      </p>
                    </div>
                    {comment.isAccepted ? (
                        <Button variant="secondary" size="sm" className="bg-primary/10 text-primary hover:bg-primary/20 cursor-default">
                          <Check className="mr-2 h-4 w-4" />
                          수락됨
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm">
                          <Check className="mr-2 h-4 w-4" />
                          수락
                        </Button>
                    )}
                  </div>
                  <p className="text-sm">{comment.comment}</p>
                  <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1.5 px-2 text-muted-foreground">
                          <ThumbsUp className="h-4 w-4" /> {comment.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1.5 px-2 text-muted-foreground">
                          <ThumbsDown className="h-4 w-4" /> {comment.dislikes}
                      </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {user && (
        <CardFooter className="p-4 pt-0 border-t">
          <form action={handleFormAction} ref={formRef} className="flex w-full items-start gap-3">
              <Avatar className="h-9 w-9 mt-1">
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Textarea
                  name="comment"
                  placeholder="피드백을 남겨주세요..."
                  className="min-h-[40px] resize-none"
                  rows={1}
                  disabled={isPending}
              />
              <Button type="submit" size="icon" disabled={isPending}>
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                <span className="sr-only">댓글 달기</span>
              </Button>
          </form>
        </CardFooter>
      )}
    </Card>
  );
}
