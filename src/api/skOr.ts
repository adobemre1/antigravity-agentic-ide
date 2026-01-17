import { SK_OR_KEY } from '@/config';

/**
 * Sends a prompt to the SK_OR completion endpoint and returns the generated text.
 */
export async function askSK(prompt: string): Promise<string> {
  const response = await fetch('https://api.sk-or.com/v1/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SK_OR_KEY}`,
    },
    body: JSON.stringify({ prompt, max_tokens: 200 }),
  });
  if (!response.ok) {
    throw new Error(`SK_OR request failed: ${response.status}`);
  }
  const data = await response.json();
  return data?.choices?.[0]?.text?.trim() ?? '';
}
