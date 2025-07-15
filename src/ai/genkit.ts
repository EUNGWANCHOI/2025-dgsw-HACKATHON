import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// API 키가 있을 때만 플러그인을 활성화합니다.
// OPENAI_API_KEY가 있으면 OpenAI를, GOOGLE_API_KEY가 있으면 Google AI를 사용합니다.
const plugins = [];
if (process.env.OPENAI_API_KEY) {
  // googleAI() 플러그인은 OpenAI API 키도 지원합니다.
  plugins.push(googleAI({apiKey: process.env.OPENAI_API_KEY}));
} else if (process.env.GOOGLE_API_KEY) {
  plugins.push(googleAI());
}


export const ai = genkit({
  plugins: plugins,
  // OpenAI 모델을 사용하려면 모델 이름을 지정해야 합니다.
  model: process.env.OPENAI_API_KEY ? 'openai/gpt-4-turbo' : 'google/gemini-pro',
});
