'use server';

import { z } from 'zod';
import { analyzeContentForImprovements } from '@/ai/flows/analyze-content-for-improvements';

const formSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.enum(['Video', 'Script', 'Podcast', 'Article']),
  content: z.string(),
});

export async function handleContentUpload(values: z.infer<typeof formSchema>) {
  try {
    const validatedData = formSchema.parse(values);

    // In a real app, you would save the content to a database here
    // and get a new content ID. We'll simulate this.
    const newContentId = Math.random().toString(36).substring(2, 9);
    
    console.log(`[Server Action] New content created with ID: ${newContentId}`);
    console.log('[Server Action] Calling AI to analyze content...');

    const aiFeedback = await analyzeContentForImprovements({
      title: validatedData.title,
      description: validatedData.description,
      category: validatedData.category,
      content: validatedData.content,
    });
    
    console.log('[Server Action] AI analysis received:', aiFeedback);

    // Here you would update the new database record with the AI feedback.
    
    return { success: true, contentId: newContentId };

  } catch (error) {
    console.error('Error handling content upload:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid data provided.' };
    }
    return { success: false, error: 'Failed to analyze content due to a server error.' };
  }
}
