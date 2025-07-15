'use server';

/**
 * @fileOverview Analyzes uploaded content and provides suggestions for improvements.
 *
 * - analyzeContentForImprovements - A function that handles the content analysis process.
 * - AnalyzeContentInput - The input type for the analyzeContentForImprovements function.
 * - AnalyzeContentOutput - The return type for the analyzeContentForImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeContentInputSchema = z.object({
  title: z.string().describe('The title of the content.'),
  description: z.string().describe('A detailed description of the content.'),
  category: z.string().describe('The category of the content (e.g., educational, entertainment).'),
  content: z.string().describe('The actual content (e.g., script, video transcript).'),
});
export type AnalyzeContentInput = z.infer<typeof AnalyzeContentInputSchema>;

const AnalyzeContentOutputSchema = z.object({
  deliverySuggestions: z.array(z.string()).describe('Suggestions for improving the delivery of the content.'),
  topicRelevanceFeedback: z.string().describe('Feedback on the relevance of the topic to the target audience.'),
  audienceFriendlinessSuggestions: z.array(z.string()).describe('Suggestions for making the content more audience-friendly.'),
  overallScore: z.number().describe('The overall score of the content based on the AI analysis, the higher the better.'),
});
export type AnalyzeContentOutput = z.infer<typeof AnalyzeContentOutputSchema>;

export async function analyzeContentForImprovements(input: AnalyzeContentInput): Promise<AnalyzeContentOutput> {
  return analyzeContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeContentPrompt',
  input: {schema: AnalyzeContentInputSchema},
  output: {schema: AnalyzeContentOutputSchema},
  prompt: `You are an AI content analysis tool designed to provide feedback to content creators.

You will analyze the content provided based on the following criteria:
- Delivery: How well the content is delivered (e.g., clarity, pacing, engagement).
- Topic Relevance: How relevant the topic is to the target audience.
- Audience Friendliness: How friendly the content is to the target audience (e.g., accessibility, inclusivity).

Provide specific and actionable suggestions for improvement in each of these areas.
Also provide an overall score between 0 and 1, where 1 is the best possible score, representing the overall quality of the content.

Content Title: {{{title}}}
Content Description: {{{description}}}
Content Category: {{{category}}}
Content: {{{content}}}
`,
});

const analyzeContentFlow = ai.defineFlow(
  {
    name: 'analyzeContentFlow',
    inputSchema: AnalyzeContentInputSchema,
    outputSchema: AnalyzeContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
