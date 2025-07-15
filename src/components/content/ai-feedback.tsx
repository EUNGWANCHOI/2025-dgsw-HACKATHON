'use client';

import { Lightbulb, Presentation, ThumbsUp } from 'lucide-react';

import type { AIFeedback as AIFeedbackType } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '../ui/separator';

interface AIFeedbackProps {
  feedback: AIFeedbackType;
}

export default function AIFeedback({ feedback }: AIFeedbackProps) {
  const scorePercentage = Math.round(feedback.overallScore * 100);

  return (
    <Card>
      <CardHeader>
        <CardDescription>종합 점수</CardDescription>
        <div className="flex items-baseline gap-2">
          <CardTitle className="text-4xl font-bold tracking-tighter">
            {scorePercentage}
          </CardTitle>
          <span className="text-muted-foreground">/ 100</span>
        </div>
        <Progress value={scorePercentage} className="mt-2 h-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <Presentation className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-base">전달력 제안</h3>
            </div>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {feedback.deliverySuggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                ))}
            </ul>
        </div>
        <Separator />
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-base">주제 관련성</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {feedback.topicRelevanceFeedback}
            </p>
        </div>
        <Separator />
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <ThumbsUp className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-base">시청자 친화성</h3>
            </div>
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {feedback.audienceFriendlinessSuggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                ))}
            </ul>
        </div>
      </CardContent>
    </Card>
  );
}
