import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// API 키가 있을 때만 플러그인을 활성화합니다.
// OPENAI_API_KEY가 있으면 OpenAI를, GOOGLE_API_KEY가 있으면 Google AI를 사용합니다.
const plugins = [];
if (process.env.GOOGLE_API_KEY) {
  plugins.push(googleAI());
}


export const ai = genkit({
  plugins: plugins,
  model: 'google/gemini-1.5-flash',
});
