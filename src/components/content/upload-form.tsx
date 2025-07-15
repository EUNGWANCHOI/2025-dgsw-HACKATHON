'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, Wand2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { handleContentUpload } from '@/app/actions';
import { Card, CardContent } from '@/components/ui/card';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long.'),
  description: z.string().min(10, 'Description is too short.'),
  category: z.enum(['Video', 'Script', 'Podcast', 'Article']),
  content: z
    .string()
    .min(50, 'Content is too short, please provide at least 50 characters.')
    .max(5000, 'Content is too long, please provide at most 5000 characters.'),
});

export default function UploadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      content: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      // Here you would typically handle file uploads to a storage bucket
      // and then pass the URLs or content to the server action.
      // For this demo, we'll pass the text content directly.
      const result = await handleContentUpload(values);
      
      if (result.success) {
        toast({
          title: 'Analysis Complete!',
          description: "We've successfully analyzed your content.",
        });
        // In a real app, you would redirect to the new content page:
        // router.push(`/content/${result.contentId}`);
        console.log('Simulated redirection to content page for:', result.contentId);
        form.reset();
      } else {
        throw new Error(result.error || 'An unknown error occurred.');
      }
    } catch (error) {
       let message = 'An unknown error occurred';
       if (error instanceof Error) {
         message = error.message;
       }
       toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., My First Short Film" {...field} />
                  </FormControl>
                  <FormDescription>
                    A catchy title that grabs attention.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a content category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Video">Video</SelectItem>
                        <SelectItem value="Script">Script</SelectItem>
                        <SelectItem value="Podcast">Podcast</SelectItem>
                        <SelectItem value="Article">Article</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      This helps us tailor the feedback.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Briefly describe your content and what you're looking for feedback on."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content / Script</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste your script, article text, or video transcript here..."
                      className="min-h-[250px] font-mono text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    For videos/podcasts, please provide a transcript. (Max 5000 chars)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Analyze Content
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
