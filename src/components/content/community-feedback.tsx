import { Check, MessageSquare, ThumbsDown, ThumbsUp } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { CommunityComment } from '@/lib/types';

interface CommunityFeedbackProps {
  comments: CommunityComment[];
}

export default function CommunityFeedback({ comments }: CommunityFeedbackProps) {
  if (comments.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 text-center">
        <MessageSquare className="h-12 w-12 text-muted-foreground/50" />
        <CardTitle className="mt-4 text-lg">아직 커뮤니티 피드백이 없습니다</CardTitle>
        <CardDescription className="mt-1">
          콘텐츠를 공유하여 다른 사람들로부터 피드백을 받아보세요.
        </CardDescription>
      </Card>
    );
  }
  return (
    <Card>
      <CardContent className="p-4">
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
                    <p className="text-xs text-muted-foreground">{comment.createdAt}</p>
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
      </CardContent>
    </Card>
  );
}
