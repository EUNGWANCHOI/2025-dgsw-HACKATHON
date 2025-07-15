import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-content-for-improvements.ts';
import '@/ai/flows/suggest-content-categories.ts';
import '@/ai/flows/summarize-community-feedback.ts';
import '@/ai/flows/analyze-youtube-video.ts';
