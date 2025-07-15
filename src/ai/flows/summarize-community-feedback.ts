// Summarizes community feedback on content, identifying common themes and sentiment.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCommunityFeedbackInputSchema = z.object({
  feedback: z
    .string()
    .describe('The community feedback on the content, as a single string.'),
  title: z.string().describe('The title of the content being reviewed.'),
});

export type SummarizeCommunityFeedbackInput =
  z.infer<typeof SummarizeCommunityFeedbackInputSchema>;

const SummarizeCommunityFeedbackOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise summary of the community feedback, highlighting common themes and overall sentiment.'
    ),
  themes: z
    .string()
    .describe('A list of common themes identified in the feedback.'),
  sentiment: z
    .string()
    .describe('The overall sentiment expressed in the feedback (e.g., positive, negative, mixed).'),
});

export type SummarizeCommunityFeedbackOutput =
  z.infer<typeof SummarizeCommunityFeedbackOutputSchema>;

export async function summarizeCommunityFeedback(
  input: SummarizeCommunityFeedbackInput
): Promise<SummarizeCommunityFeedbackOutput> {
  return summarizeCommunityFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeCommunityFeedbackPrompt',
  input: {schema: SummarizeCommunityFeedbackInputSchema},
  output: {schema: SummarizeCommunityFeedbackOutputSchema},
  prompt: `You are an AI assistant tasked with summarizing community feedback on content.

  Analyze the provided feedback to identify common themes, overall sentiment, and key points.
  Provide a concise summary that captures the essence of the community's reaction to the content.

  Title: {{{title}}}
  Feedback: {{{feedback}}}

  Summary should contain:
  - A summary of the feedback.
  - Common themes
  - Sentiment analysis.

  Output in a JSON format:
  {
    summary: string,
    themes: string,
    sentiment: string
  }`,
});

const summarizeCommunityFeedbackFlow = ai.defineFlow(
  {
    name: 'summarizeCommunityFeedbackFlow',
    inputSchema: SummarizeCommunityFeedbackInputSchema,
    outputSchema: SummarizeCommunityFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
