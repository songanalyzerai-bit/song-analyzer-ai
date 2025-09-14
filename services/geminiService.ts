import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

let ai: GoogleGenAI | null = null;
let initializationError: string | null = null;

function getAiClient(): GoogleGenAI {
  if (ai) {
    return ai;
  }
  if (initializationError) {
    throw new Error(initializationError);
  }

  try {
    const apiKey = (globalThis as any).process?.env?.API_KEY;

    if (!apiKey) {
      throw new Error("API Key is not available.");
    }
    
    ai = new GoogleGenAI({ apiKey: apiKey });
    return ai;
  } catch (e: any) {
    console.error("Failed to initialize GoogleGenAI:", e);
    initializationError = "Analysis service is not configured. Please ensure the API Key is set.";
    throw new Error(initializationError);
  }
}

const analysisCategorySchema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.NUMBER, description: 'A score from 0.0 to 10.0, can be a float.' },
    feedback: { type: Type.STRING, description: 'Detailed feedback for this category (2-3 sentences).' },
  },
  required: ['score', 'feedback']
};

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "The title of the song being analyzed." },
    creativity: { ...analysisCategorySchema, description: 'Evaluation of the song\'s originality and uniqueness.' },
    emotionalImpact: { ...analysisCategorySchema, description: 'Evaluation of the song\'s ability to evoke emotion.' },
    lyricism: { ...analysisCategorySchema, description: 'Evaluation of the quality and artistry of the lyrics.' },
    craftsmanship: { ...analysisCategorySchema, description: 'Evaluation of the song\'s structure, flow, and technical construction.' },
    audienceAppeal: { ...analysisCategorySchema, description: 'Evaluation of the song\'s potential to connect with a target audience.' },
    commercialPotential: { ...analysisCategorySchema, description: 'Evaluation of the song\'s viability for mainstream success and radio play.' },
    overallScore: { type: Type.NUMBER, description: 'The overall weighted average score for the song, from 0.0 to 10.0.' },
    firstImpression: { type: Type.STRING, description: 'A concise, one-sentence initial reaction to the song.' },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'A list of 3-4 key strengths of the song, as bullet points.'
    },
    weaknesses: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'A list of 3-4 key weaknesses or areas for improvement, as bullet points.'
    },
    suggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'A list of 3-4 concrete suggestions for improving the song, as bullet points.'
    },
    artistComparisons: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          artist: { type: Type.STRING, description: 'The name of a comparable artist.' },
          reason: { type: Type.STRING, description: 'A brief explanation for the comparison.' },
        },
        required: ['artist', 'reason']
      },
      description: 'A list of 2-3 artists that the song is similar to.'
    },
    suggestedGenres: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'The name of a suitable genre.' },
          reason: { type: Type.STRING, description: 'A brief explanation for the genre suggestion.' },
        },
        required: ['name', 'reason']
      },
      description: 'A list of 2-3 genres that fit the song.'
    },
    finalVerdict: { type: Type.STRING, description: 'A final, summary paragraph (3-5 sentences) providing a holistic verdict on the song that balances artistic merit, commercial potential, and niche appeal.' },
  },
  required: [
      "title", "creativity", "emotionalImpact", "lyricism", "craftsmanship", "audienceAppeal",
      "commercialPotential", "overallScore", "firstImpression", "strengths", "weaknesses",
      "suggestions", "artistComparisons", "suggestedGenres", "finalVerdict"
  ]
};

const normalizeScore = (score: number): number => {
    if (score > 10) {
        return parseFloat((score / 10.0).toFixed(1));
    }
    return parseFloat(score.toFixed(1));
};

export async function analyzeSong(title: string, lyrics: string, musicDescription: string, genre: string): Promise<AnalysisResult> {
    const localAi = getAiClient();
    
    const model = 'gemini-2.5-flash';
    
    const prompt = `
      You are a world-class A&R executive and music critic with a deep understanding of music theory, songwriting, and market trends.
      Analyze the following song. Provide a detailed, constructive, and unbiased critique. Your feedback should be professional and helpful for the artist.
      
      **Rules for Analysis:**
      - **Be Forgiving with User Input:** The user may provide song structure labels like "[Verse]", "Verse:", "V1", etc. Recognize these as valid. Similarly, accept common synonyms like "Hook" for "Chorus". Do not penalize for formatting variations.
      - **Music Description Context:** The user's music description may be simple (e.g., "upbeat country") or complex. Use whatever information is provided as context. A simple description is just as valid as a technical one. If no description is provided, analyze based on lyrics alone.
      - **Genre Context:** If a genre is provided by the user, use it as the primary lens for your analysis. Evaluate how well the song fits that genre. Always provide 2-3 genre suggestions, even if the user provided one.
      - **Scoring:** All scores MUST be on a 0.0 to 10.0 scale, with one decimal place. The overall score should be a weighted average, not a simple average.
      - **Final Verdict:** The verdict should be a balanced summary, considering artistic merit, commercial potential, and niche appeal, not just "Grammy potential".

      **Song Title:** "${title}"
      
      **Provided Genre (if any):** ${genre || 'Not provided'}

      **Lyrics:**
      ---
      ${lyrics}
      ---

      **Music Description (for context):**
      ---
      ${musicDescription || 'Not provided.'}
      ---

      Evaluate the song based on the defined criteria in the JSON schema.
    `;

    try {
        const response = await localAi.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
            },
        });

        const jsonText = response.text.trim();
        const result: AnalysisResult = JSON.parse(jsonText);
        
        result.overallScore = normalizeScore(result.overallScore);
        result.creativity.score = normalizeScore(result.creativity.score);
        result.emotionalImpact.score = normalizeScore(result.emotionalImpact.score);
        result.lyricism.score = normalizeScore(result.lyricism.score);
        result.craftsmanship.score = normalizeScore(result.craftsmanship.score);
        result.audienceAppeal.score = normalizeScore(result.audienceAppeal.score);
        result.commercialPotential.score = normalizeScore(result.commercialPotential.score);

        result.title = title;

        return result;
    } catch (error) {
        console.error("Error analyzing song with Gemini:", error);
        if (error instanceof Error) {
             if (error.message.includes("SAFETY")) {
                 throw new Error("The request was blocked due to safety concerns. Please revise the lyrics and try again.");
             }
             if (error.message.includes("API Key")) {
                 throw new Error("The AI service is not configured correctly. Please check the API Key.");
             }
        }
        throw new Error("The AI model failed to generate a valid analysis. This could be a temporary issue. Please try again later.");
    }
}
