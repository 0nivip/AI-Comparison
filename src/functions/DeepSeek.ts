import { createDeepSeek, DeepSeekProviderSettings } from '@ai-sdk/deepseek';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

const aiModel1Token = process.env.AI_MODEL_1_TOKEN;

if (!aiModel1Token) {
  throw new Error("API KEY is not set in the environment variables");
}

const deepseekSettings: DeepSeekProviderSettings = {
  apiKey: aiModel1Token
};

const deepseek = createDeepSeek(deepseekSettings);

interface AiResponse {
  response_text: string;
  confidence?: number;
  model_name?: string;
}

export async function callAiModel1(query: string): Promise<AiResponse> {
  try {
    const result = await (deepseek as any).completions.create({
      messages: [{ role: 'user', content: query }],
      model: 'deepseek-chat',
      max_tokens: 1000,
    });
    const generatedText = result.choices[0]?.message?.content || '';
    return {
      response_text: generatedText,
      model_name: "DeepSeek-Chat"
    };
  } catch (error) {
    console.error("Error generating content with DeepSeek:", error);
    throw error;
  }
}

export async function processQuestionsWithDeepSeek() {
  try {
    const questPath = path.join(__dirname, '..', 'Quest.json');
    const questContent = await fs.readFile(questPath, 'utf-8');
    const quest = JSON.parse(questContent);

    if (!quest.questions || !Array.isArray(quest.questions)) {
      throw new Error('Invalid Quest.json format');
    }

    for (const question of quest.questions) {
      console.log(`Question: ${question}`);
      const response = await callAiModel1(question);
      console.log(`DeepSeek Answer: ${response.response_text}`);
      console.log('---');
    }
  } catch (error) {
    console.error('Error processing questions:', error);
  }
}