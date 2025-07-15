'use client';

import { Lightbulb, Mic, Presentation, ThumbsUp } from 'lucide-react';

import type { AIFeedback as AIFeedbackType } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

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
      <CardContent>
        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-base">
              <div className="flex items-center gap-2">
                <Presentation className="h-5 w-5 text-primary" /> 전달력 제안
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {feedback.deliverySuggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-base">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" /> 주제 관련성
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              {feedback.topicRelevanceFeedback}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" className="border-b-0">
            <AccordionTrigger className="text-base">
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-5 w-5 text-primary" /> 시청자 친화성
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                {feedback.audienceFriendlinessSuggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
