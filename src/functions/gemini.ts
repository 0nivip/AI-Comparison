import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

// Load environment variables
dotenv.config();

const aiModel2Token = process.env.AI_MODEL_2_TOKEN;

if (!aiModel2Token) {
  throw new Error("API KEY is not set in the environment variables");
}

const genAI = new GoogleGenerativeAI(aiModel2Token);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

interface AiResponse {
  response_text: string;
  confidence?: number;
  model_name?: string;
}

export async function callAiModel2(query: string): Promise<AiResponse> {
  try {
    const result = await model.generateContent(query);
    const generatedText = result.response.text();
    return {
      response_text: generatedText,
      model_name: "Gemini-2.0-flash"
    };
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    throw error;
  }
}

export async function processQuestionsWithGemini() {
  try {
    const questPath = path.join(__dirname, '..', 'Quest.json');
    const questContent = await fs.readFile(questPath, 'utf-8');
    const quest = JSON.parse(questContent);

    if (!quest.questions || !Array.isArray(quest.questions)) {
      throw new Error('Invalid Quest.json format');
    }

    for (const question of quest.questions) {
      console.log(`Question: ${question}`);
      const response = await callAiModel2(question);
      console.log(`Gemini Answer: ${response.response_text}`);
      console.log('---');
    }
  } catch (error) {
    console.error('Error processing questions:', error);
  }
}