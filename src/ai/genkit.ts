import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// API 키가 있을 때만 Google AI 플러그인을 활성화합니다.
const plugins = process.env.GOOGLE_API_KEY ? [googleAI()] : [];

export const ai = genkit({
  plugins: plugins,
  model: 'googleai/gemini-2.0-flash',
});
