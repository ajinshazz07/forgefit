import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY || 'AIzaSyBdX38cZd10BsSM2dFv1_feM8TG9yXS5yg',
    }),
  ],
  model: 'googleai/gemini-2.5-flash',
});