import OpenAI from "openai";
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

const aiModel4Token = process.env.AI_MODEL_4_TOKEN;

if (!aiModel4Token) {
    throw new Error("API KEY is not set in the environment variables");
}
 
interface AiResponse {
    response_text: string;
    confidence?: number;
    model_name?: string;
}

const openai = new OpenAI({
    apiKey: aiModel4Token,
});


export async function callAiModel4(query: string): Promise<AiResponse> {
    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: query }], 
            model: "gpt-4o", 
            max_tokens: 1000,        
        });
        const generatedText = completion.choices[0].message.content; 
        return {
            response_text: generatedText ?? '',
            model_name: "gpt-4o" 
        };
    } catch (error) {
        console.error("Error generating content with GPT:", error);
        throw error;
    }
}
export async function processQuestionsWithGPT() {
    try {
      const questPath = path.join(__dirname, '..', 'Quest.json');
      const questContent = await fs.readFile(questPath, 'utf-8');
      const quest = JSON.parse(questContent);
  
      if (!quest.questions || !Array.isArray(quest.questions)) {
        throw new Error('Invalid Quest.json format. "questions" must be an array of strings.');
      }

      
      for (const question of quest.questions) {
        if (typeof question !== 'string') {
          console.error(`Invalid question type: ${typeof question}. Skipping.`);
          continue; 
        }

        console.log(`Question: ${question}`);
        const response = await callAiModel4(question);
        console.log(`GPT Answer: ${response.response_text}`);
        console.log('---');
      }
    } catch (error) {
      console.error('Error processing questions:', error);
    }
  }



