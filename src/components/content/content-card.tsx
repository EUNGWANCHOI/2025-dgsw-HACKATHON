
import Link from 'next/link';
import Image from 'next/image';
import { FileText, MessageSquare, Video, Mic, ThumbsUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { Timestamp } from 'firebase/firestore';

import type { Content } from '@/lib/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ContentCardProps {
  content: Content;
}

const categoryIcons = {
  '영상': <Video className="h-4 w-4" />,
  '스크립트': <FileText className="h-4 w-4" />,
  '팟캐스트': <Mic className="h-4 w-4" />,
  '아티클': <FileText className="h-4 w-4" />,
  '채널 기획': <FileText className="h-4 w-4" />,
};

// Helper function to safely convert various date formats to a Date object
const toSafeDate = (dateValue: any): Date | null => {
  if (!dateValue) return null;
  // Firestore Timestamp
  if (typeof dateValue.toDate === 'function') {
    return dateValue.toDate();
  }
  // JSON serialized Firestore Timestamp { seconds, nanoseconds }
  if (typeof dateValue === 'object' && dateValue.seconds) {
    return new Date(dateValue.seconds * 1000);
  }
  // Standard Date object or ISO string
  const date = new Date(dateValue);
  if (!isNaN(date.getTime())) {
      return date;
  }
  return null;
}

export default function ContentCard({ content }: ContentCardProps) {
    const totalLikes = content.communityFeedback?.reduce((acc, curr) => acc + curr.likes, 0) || 0;
    const createdAtDate = toSafeDate(content.createdAt);

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/content/${content.id}`} className="flex flex-col flex-grow">
        <CardHeader className="p-0">
            <div className="relative aspect-video">
              <Image
                src={content.thumbnailUrl}
                alt={content.title}
                fill
                className="object-cover"
                data-ai-hint="creative content"
              />
            </div>
        </CardHeader>
        <CardContent className="flex-1 p-4">
          <Badge variant="secondary" className="mb-2">
            {categoryIcons[content.category]}
            <span className="ml-1.5">{content.category}</span>
          </Badge>
          <CardTitle className="text-lg font-medium leading-tight hover:text-primary">
            {content.title}
          </CardTitle>
           <p className="text-xs text-muted-foreground mt-1">
             {createdAtDate ? `${formatDistanceToNow(createdAtDate, { addSuffix: true, locale: ko })}` : '날짜 정보 없음'}
           </p>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{content.description}</p>
        </CardContent>
      </Link>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={content.author.avatarUrl} />
            <AvatarFallback>
              {content.author.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">
            {content.author.name}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
                <ThumbsUp className="h-3.5 w-3.5" />
                <span>{totalLikes}</span>
            </div>
            <div className="flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>{content.communityFeedback?.length || 0}</span>
            </div>
        </div>
      </CardFooter>
    </Card>
  );
}
