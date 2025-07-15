import Link from 'next/link';
import Image from 'next/image';
import { FileText, MessageSquare, Video, Mic } from 'lucide-react';

import type { Content } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface ContentCardProps {
  content: Content;
}

const categoryIcons = {
  Video: <Video className="h-4 w-4" />,
  Script: <FileText className="h-4 w-4" />,
  Podcast: <Mic className="h-4 w-4" />,
  Article: <FileText className="h-4 w-4" />,
};

export default function ContentCard({ content }: ContentCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <Link href={`/content/${content.id}`}>
          <div className="relative aspect-video">
            <Image
              src={content.thumbnailUrl}
              alt={content.title}
              fill
              className="object-cover"
              data-ai-hint="creative content"
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <Badge variant="secondary" className="mb-2">
          {categoryIcons[content.category]}
          <span className="ml-1.5">{content.category}</span>
        </Badge>
        <Link href={`/content/${content.id}`}>
          <CardTitle className="text-lg leading-tight hover:text-primary">
            {content.title}
          </CardTitle>
        </Link>
      </CardContent>
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
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MessageSquare className="h-3.5 w-3.5" />
          <span>{content.communityFeedback.length}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
