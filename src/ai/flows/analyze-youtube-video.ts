'use server';

/**
 * @fileOverview Analyzes a YouTube video and provides suggestions for improvements.
 *
 * - analyzeYouTubeVideo - A function that handles the video analysis process.
 * - AnalyzeYouTubeVideoInput - The input type for the analyzeYouTubeVideo function.
 * - AnalyzeYouTubeVideoOutput - The return type for the analyzeYouTubeVideo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { YoutubeTranscript } from 'youtube-transcript';

const AnalyzeYouTubeVideoInputSchema = z.object({
  videoUrl: z.string().url().describe('The URL of the YouTube video to analyze.'),
  title: z.string().describe('The title of the content.'),
  description: z.string().describe('A detailed description of the content.'),
});
export type AnalyzeYouTubeVideoInput = z.infer<typeof AnalyzeYouTubeVideoInputSchema>;

const AnalyzeYouTubeVideoOutputSchema = z.object({
  deliverySuggestions: z.array(z.string()).describe('Suggestions for improving the delivery of the content.'),
  topicRelevanceFeedback: z.string().describe('Feedback on the relevance of the topic to the target audience.'),
  audienceFriendlinessSuggestions: z.array(z.string()).describe('Suggestions for making the content more audience-friendly.'),
  overallScore: z.number().describe('The overall score of the content based on the AI analysis, the higher the better.'),
});
export type AnalyzeYouTubeVideoOutput = z.infer<typeof AnalyzeYouTubeVideoOutputSchema>;

const youtubeTranscriptTool = ai.defineTool(
  {
    name: 'getYoutubeTranscript',
    description: 'Fetches the transcript for a given YouTube video URL.',
    inputSchema: z.object({ url: z.string().url() }),
    outputSchema: z.string(),
  },
  async (input) => {
    try {
      const transcript = await YoutubeTranscript.fetchTranscript(input.url);
      return transcript.map(t => t.text).join(' ');
    } catch (error) {
      console.error('Error fetching transcript:', error);
      return '스크립트를 가져오는 데 실패했습니다. 비디오에 스크립트가 없거나 비공개일 수 있습니다.';
    }
  }
);


const prompt = ai.definePrompt({
  name: 'analyzeYoutubeVideoPrompt',
  input: {schema: z.object({
      title: z.string(),
      description: z.string(),
      transcript: z.string(),
  })},
  output: {schema: AnalyzeYouTubeVideoOutputSchema},
  prompt: `You are an AI content analysis tool designed to provide feedback to content creators.

You will analyze the video transcript provided based on the following criteria:
- Delivery: How well the content is delivered (e.g., clarity, pacing, engagement).
- Topic Relevance: How relevant the topic is to the target audience.
- Audience Friendliness: How friendly the content is to the target audience (e.g., accessibility, inclusivity).

Provide specific and actionable suggestions for improvement in each of these areas.
Also provide an overall score between 0 and 1, where 1 is the best possible score, representing the overall quality of the content.

Content Title: {{{title}}}
Content Description: {{{description}}}
Video Transcript: {{{transcript}}}

Please provide all feedback in Korean.
`,
});

const analyzeYouTubeVideoFlow = ai.defineFlow(
  {
    name: 'analyzeYouTubeVideoFlow',
    inputSchema: AnalyzeYouTubeVideoInputSchema,
    outputSchema: AnalyzeYouTubeVideoOutputSchema,
  },
  async (input) => {
    const transcript = await youtubeTranscriptTool({url: input.videoUrl});

    const {output} = await prompt({
        title: input.title,
        description: input.description,
        transcript: transcript,
    });
    return output!;
  }
);

export async function analyzeYouTubeVideo(input: AnalyzeYouTubeVideoInput): Promise<AnalyzeYouTubeVideoOutput> {
  return analyzeYouTubeVideoFlow(input);
}
