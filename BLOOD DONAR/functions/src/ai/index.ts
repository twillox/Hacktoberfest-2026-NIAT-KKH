import { z } from 'zod';

export const GemmaSchema = z.object({
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  unitsRequired: z.number().int().min(1).max(10).optional(),
  hospitalName: z.string().optional(),
  locality: z.string().optional(),
  city: z.string().optional(),
  urgency: z.enum(['critical', 'high', 'moderate']).optional(),
});

export async function parseEmergencyWithGemini(
  text: string,
  apiKey: string,
  model = 'gemma-4-it'
) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const prompt = 
    `Extract structured fields from blood request into valid JSON: ` +
    `{"bloodGroup": "...", "unitsRequired": number, "hospitalName": "...", "locality": "...", "city": "...", "urgency": "critical|high|moderate"}.\n` +
    `Input: "${text}"`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.1 }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API returned ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return GemmaSchema.parse(JSON.parse(rawJson));
}
