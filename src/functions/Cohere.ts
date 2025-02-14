import { CohereClient } from "cohere-ai";
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

const aiModel3Token = process.env.AI_MODEL_3_TOKEN;

if (!aiModel3Token) {
	throw new Error("API KEY is not set in the environment variables");
  }

 
  interface AiResponse {
    response_text: string;
    confidence?: number;
    model_name?: string;
  }
  
  const cohere = new CohereClient({
	  token: aiModel3Token
  });
  
  export async function callAiModel3(query: string): Promise<AiResponse> {
    try {
        const result = await cohere.generate({
            prompt: query,
            model: 'command-xlarge', 
            maxTokens: 1000,
        });
        const generatedText = result.generations[0]?.text || '';
        return {
            response_text: generatedText,
            model_name: "Command-XLARGE" 
        };
    } catch (error) {
        console.error("Error generating content with Cohere:", error);
        throw error;
    }
}
  export async function processQuestionsWithCohere() {
	try {
	  const questPath = path.join(__dirname, '..', 'Quest.json');
	  const questContent = await fs.readFile(questPath, 'utf-8');
	  const quest = JSON.parse(questContent);
  
	  if (!quest.questions || !Array.isArray(quest.questions)) {
		throw new Error('Invalid Quest.json format');
	  }
  
	  for (const question of quest.questions) {
		console.log(`Question: ${question}`);
		const response = await callAiModel3(question);
		console.log(`Cohere Answer: ${response.response_text}`);
		console.log('---');
	  }
	} catch (error) {
	  console.error('Error processing questions:', error);
	}
  }

