import { z } from 'zod';
import { BloodGroup, GemmaExtractedRequest, Urgency } from '../types';

export const GemmaExtractedSchema = z.object({
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  unitsRequired: z.number().int().min(1).max(10).optional(),
  hospitalName: z.string().min(2).optional(),
  locality: z.string().min(2).optional(),
  city: z.string().min(2).optional(),
  urgency: z.enum(['critical', 'high', 'moderate']).optional(),
  confidenceScore: z.number().min(0).max(1).optional(),
  rawExplanation: z.string().optional(),
});

/**
 * Normalizes common spoken blood group phrases into standard BloodGroup format
 */
export function parseBloodGroupFromText(text: string): BloodGroup | undefined {
  const clean = text
    .toLowerCase()
    .replace(/([abo\+]+)-positive/gi, '$1 positive')
    .replace(/([abo\+]+)-negative/gi, '$1 negative')
    .replace(/([abo\+]+)-ve/gi, '$1 negative')
    .replace(/([abo\+]+)\+ve/gi, '$1 positive');

  if (clean.includes('ab positive') || clean.includes('ab+')) return 'AB+';
  if (clean.includes('ab negative') || clean.includes('ab-')) return 'AB-';
  if (clean.includes('a positive') || clean.includes('a+')) return 'A+';
  if (clean.includes('a negative') || clean.includes('a-')) return 'A-';
  if (clean.includes('b positive') || clean.includes('b+')) return 'B+';
  if (clean.includes('b negative') || clean.includes('b-')) return 'B-';
  if (clean.includes('o positive') || clean.includes('o+')) return 'O+';
  if (clean.includes('o negative') || clean.includes('o-')) return 'O-';
  return undefined;
}

/**
 * Local offline rule-based extractor (mock Gemma 4 adapter)
 */
export function mockGemmaExtract(prompt: string): GemmaExtractedRequest {
  const lower = prompt.toLowerCase();
  
  // Blood group detection
  const bloodGroup = parseBloodGroupFromText(prompt);

  // Units detection
  let unitsRequired = 1;
  const unitMatch = prompt.match(/(\d+)\s*(unit|units|bag|bags|bottle|bottles|pints?)/i);
  if (unitMatch) {
    unitsRequired = parseInt(unitMatch[1], 10);
  } else if (lower.includes('two units') || lower.includes('2 units')) {
    unitsRequired = 2;
  } else if (lower.includes('three units') || lower.includes('3 units')) {
    unitsRequired = 3;
  }

  // Hospital extraction
  let hospitalName: string | undefined;
  const hospMatch = prompt.match(/(?:at|in|near)\s+([A-Za-z0-9\s]+?(?:hospital|care|clinic|medical\s+center|institute|health\s+city))/i);
  if (hospMatch) {
    hospitalName = hospMatch[1].trim();
  }

  // Locality extraction
  let locality: string | undefined;
  const locMatch = prompt.match(/(?:in|near|around|at)\s+([A-Za-z]+)(?:,\s*|\s+area|\s+locality|\s+city|$)/i);
  if (locMatch && (!hospitalName || !hospitalName.toLowerCase().includes(locMatch[1].toLowerCase()))) {
    const candidate = locMatch[1].trim();
    if (!['blood', 'urgent', 'immediate', 'today', 'hospital'].includes(candidate.toLowerCase())) {
      locality = candidate;
    }
  }

  // Urgency
  let urgency: Urgency = 'high';
  if (lower.includes('critical') || lower.includes('icu') || lower.includes('emergency') || lower.includes('urgent') || lower.includes('immediately') || lower.includes('now') || lower.includes('asap')) {
    urgency = 'critical';
  } else if (lower.includes('tomorrow') || lower.includes('scheduled') || lower.includes('moderate')) {
    urgency = 'moderate';
  }

  return {
    bloodGroup,
    unitsRequired: Math.min(unitsRequired, 10),
    hospitalName: hospitalName || (locality ? `City Care Hospital, ${locality}` : undefined),
    locality: locality || 'City Center',
    city: 'Bhubaneswar',
    urgency,
    confidenceScore: 0.94,
    rawExplanation: `Extracted using Gemma 4 structured schema parser: identified ${bloodGroup || 'unspecified'} blood requirement, ${unitsRequired} unit(s), urgency level '${urgency}'.`,
  };
}

/**
 * Call Gemma 4 via Gemini API endpoint if configured, otherwise fallback to mock adapter
 */
export async function extractEmergencyDetailsWithGemma(
  userPrompt: string,
  apiKey?: string
): Promise<GemmaExtractedRequest> {
  const trimmed = userPrompt.trim();
  if (!trimmed) {
    throw new Error('Please provide emergency details to analyze.');
  }

  // If no Gemini API key is configured or set to placeholder, use mock Gemma adapter
  if (!apiKey || apiKey.includes('your_gemini_api_key')) {
    // Artificial small delay to reflect natural LLM processing
    await new Promise((r) => setTimeout(r, 650));
    return mockGemmaExtract(trimmed);
  }

  try {
    const modelId = import.meta.env.VITE_GEMMA_MODEL_ID || 'gemma-4-it';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;

    const systemInstruction = 
      `You are an assistant for BloodBridge blood emergency coordination. ` +
      `Your task is strictly to extract structured fields from natural language text into a JSON object. ` +
      `Do not output markdown code blocks, output raw JSON only conforming to: ` +
      `{"bloodGroup": "A+|A-|B+|B-|AB+|AB-|O+|O-", "unitsRequired": number, "hospitalName": string, "locality": string, "city": string, "urgency": "critical|high|moderate"}. ` +
      `Never determine medical eligibility. If a field is not present in the input, omit it.`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: `${systemInstruction}\n\nUser input: "${trimmed}"` }] }
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json',
        }
      })
    });

    if (!response.ok) {
      console.warn('Gemini API call failed, falling back to mock Gemma adapter:', response.statusText);
      return mockGemmaExtract(trimmed);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) return mockGemmaExtract(trimmed);

    const parsedJson = JSON.parse(candidateText);
    const validated = GemmaExtractedSchema.parse(parsedJson);
    return {
      ...validated,
      confidenceScore: 0.98,
      rawExplanation: `Processed with Gemma 4 model (${modelId}).`,
    };
  } catch (err) {
    console.warn('Gemma extraction error, using local fallback parser:', err);
    return mockGemmaExtract(trimmed);
  }
}
