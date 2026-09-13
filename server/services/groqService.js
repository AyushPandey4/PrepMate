import Groq from 'groq-sdk';
import { config } from '../config/index.js';

if (!config.groq.apiKey) {
  console.warn('GROQ_API_KEY is not set. AI features will not work.');
}

const groq = new Groq({
  apiKey: config.groq.apiKey,
});

const MODEL_NAME = config.groq.model || 'openai/gpt-oss-120b';

// Send a single prompt to Groq and return the raw text/JSON response
export async function generateContent(prompt, systemInstruction = '') {
  const messages = [];

  if (systemInstruction) {
    messages.push({ role: 'system', content: systemInstruction });
  }

  messages.push({ role: 'user', content: prompt });

  const completion = await groq.chat.completions.create({
    model: MODEL_NAME,
    messages,
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  const text = completion.choices[0]?.message?.content;

  if (!text) {
    throw new Error('Groq returned an empty response.');
  }

  return text;
}

// Send a multi-turn conversation to Groq (used for interview Q&A)
export async function generateChatResponse(systemPrompt, history = [], userMessage = '') {
  const messages = [];

  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }

  // Normalize history turns into OpenAI/Groq format
  for (const entry of history) {
    const role =
      entry.role === 'ai' || entry.role === 'model' || entry.role === 'assistant'
        ? 'assistant'
        : 'user';

    const content = entry.parts?.[0]?.text || entry.content || '';

    if (content) {
      messages.push({ role, content });
    }
  }

  // Append new user message if provided
  if (userMessage) {
    messages.push({ role: 'user', content: userMessage });
  }

  const completion = await groq.chat.completions.create({
    model: MODEL_NAME,
    messages,
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  const text = completion.choices[0]?.message?.content;

  if (!text) {
    throw new Error('Groq returned an empty chat response.');
  }

  return text;
}
