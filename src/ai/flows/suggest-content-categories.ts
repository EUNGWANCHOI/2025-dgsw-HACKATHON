'use server';

/**
 * @fileOverview An AI agent that suggests relevant categories for uploaded content.
 *
 * - suggestContentCategories - A function that suggests categories for content.
 * - SuggestContentCategoriesInput - The input type for the suggestContentCategories function.
 * - SuggestContentCategoriesOutput - The return type for the suggestContentCategories function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestContentCategoriesInputSchema = z.object({
  title: z.string().describe('The title of the content.'),
  description: z.string().describe('The description of the content.'),
  contentSnippet: z.string().describe('A snippet of the content itself.'),
});
export type SuggestContentCategoriesInput = z.infer<
  typeof SuggestContentCategoriesInputSchema
>;

const SuggestContentCategoriesOutputSchema = z.object({
  categories: z
    .array(z.string())
    .describe(
      'An array of relevant categories for the content, each category should be a string.'
    ),
  reasoning: z
    .string()
    .describe(
      'A brief explanation of why these categories were suggested, including the aspects of the content which led to this suggestion.'
    ),
});
export type SuggestContentCategoriesOutput = z.infer<
  typeof SuggestContentCategoriesOutputSchema
>;

export async function suggestContentCategories(
  input: SuggestContentCategoriesInput
): Promise<SuggestContentCategoriesOutput> {
  return suggestContentCategoriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestContentCategoriesPrompt',
  input: {schema: SuggestContentCategoriesInputSchema},
  output: {schema: SuggestContentCategoriesOutputSchema},
  prompt: `You are an expert in content categorization. Given the title, description, and a snippet of content, you will suggest relevant categories for the content.

Title: {{{title}}}
Description: {{{description}}}
Content Snippet: {{{contentSnippet}}}

Please provide a list of categories and a brief explanation of your reasoning. Focus on categories that improve content discoverability.

Categories should be a simple array of strings, avoid bulleted lists or other formatting.
Reasoning should be clear and concise.

Output in JSON format.`,
});

const suggestContentCategoriesFlow = ai.defineFlow(
  {
    name: 'suggestContentCategoriesFlow',
    inputSchema: SuggestContentCategoriesInputSchema,
    outputSchema: SuggestContentCategoriesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
