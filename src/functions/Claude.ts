import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';

// Load environment variables
dotenv.config();

const aiModel3Token = process.env.AI_MODEL_3_TOKEN;

if (!aiModel3Token) {
    throw new Error("API KEY is not set in the environment variables");
}

const anthropic = new Anthropic({
    apiKey: aiModel3Token,
});

interface AiResponse {
    response_text: string;
    confidence?: number; // Anthropic responses might not have confidence scores directly
    model_name?: string;
}

export async function callAiModel3(query: string): Promise<AiResponse> {
    try {
        const msg = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 1024,
            messages: [{ role: "user", content: query }],
        });

        const generatedText = msg.content.join(''); // Extract the text content from Anthropic's response

        return {
            response_text: generatedText,
            model_name: "Claude-3-5-Sonnet-20241022"
        };
    } catch (error) {
        console.error("Error generating content with Claude:", error);
        throw error;
    }
}

export async function processQuestionsWithAnthropic() {
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
            console.log(`Claude Answer: ${response.response_text}`);
            console.log('---');
        }
    } catch (error) {
        console.error('Error processing questions:', error);
    }
}