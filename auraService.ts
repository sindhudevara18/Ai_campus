import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from "../types";
import { Flashcard } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const auraService = {
  async explainTopic(topic: string): Promise<string> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explain the topic "${topic}" in a clear, concise way suitable for a college student. Use markdown formatting.`,
    });
    return response.text || "Sorry, I couldn't generate an explanation.";
  },

  async generateQuiz(topic: string): Promise<QuizQuestion[]> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 3 multiple-choice questions for the topic "${topic}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              correctAnswer: { type: Type.INTEGER, description: "Index of the correct option (0-3)" },
            },
            required: ["question", "options", "correctAnswer"],
          },
        },
      },
    });
    return JSON.parse(response.text || "[]");
  },

  async getMoodEncouragement(moodScore: number): Promise<string> {
    const moodText = moodScore <= 3 ? "low" : moodScore <= 7 ? "neutral" : "high";
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `The user's mood is ${moodText} (${moodScore}/10). Provide a short, empathetic, and encouraging message (max 2 sentences) for a college student. If the mood is low, suggest a small, manageable action like a 5-minute break.`,
    });
    return response.text || "Keep going, you're doing great!";
  },
 
  async summarizeNotice(notice: string): Promise<string> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Summarize this campus notice in 2-3 bullet points: "${notice}"`,
    });
    return response.text || "Could not summarize notice.";
  },

async analyzeMoodTrend(moodHistory: number[]) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
Analyze this 7-day mood pattern: ${moodHistory.join(", ")}.
Give one short insight and one suggestion.
`,
  });

  return response.text;
},
  async generateStudyPlan(topic: string): Promise<string> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a 3-step study plan for the topic "${topic}". Keep it very brief and actionable for a student.`,
    });
    return response.text || "Focus on the basics and practice problems.";
  },
  async generateFlashcards(topic: string): Promise<Flashcard[]> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate 5 flashcards for the topic "${topic}". 
Return a JSON array with objects in this format:
[
  { "term": "concept name", "definition": "short explanation" }
]`,
    config: {
      responseMimeType: "application/json",
    },
  });

  return JSON.parse(response.text || "[]");
},
async getMoodSupport(moodScore: number) {
  const moodText =
    moodScore <= 3
      ? "low"
      : moodScore <= 7
      ? "moderate"
      : "high";

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
The user's mood score is ${moodScore}/10 (${moodText}).

Return a JSON object with:
- message: short empathetic message (2 sentences max)
- suggestedActivity: one practical action
- duration: how long it takes (e.g., "5 minutes")
- energyType: low | moderate | high
`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          message: { type: Type.STRING },
          suggestedActivity: { type: Type.STRING },
          duration: { type: Type.STRING },
          energyType: { type: Type.STRING },
        },
        required: ["message", "suggestedActivity"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
}
};
