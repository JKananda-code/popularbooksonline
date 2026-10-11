import OpenAI from 'openai';

let _client = null;

export function getOpenAI() {
  if (_client) return _client;
  const key = process.env.EMERGENT_LLM_KEY;
  if (!key) {
    throw new Error('Missing EMERGENT_LLM_KEY at runtime');
  }
  _client = new OpenAI({
    apiKey: key,
    baseURL: 'https://integrations.emergentagent.com/llm',
  });
  return _client;
}

// Proxy so existing `openai.chat.completions.create(...)` calls keep working.
// The real client isn't constructed until the first property access happens
// at request time (never during Next.js "Collecting page data" build phase).
export const openai = new Proxy({}, {
  get(_target, prop) {
    return getOpenAI()[prop];
  }
});

export const MODEL = 'gpt-4o-mini';
