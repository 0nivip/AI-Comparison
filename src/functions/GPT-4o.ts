import OpenAI from "openai";
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

// Загрузка переменных окружения
dotenv.config();

// Получение токена для GPT-4 из переменных окружения
const aiModel4Token = process.env.AI_MODEL_4_TOKEN;

if (!aiModel4Token) {
    throw new Error("API KEY is not set in the environment variables");
}
 
// Интерфейс для ответа от AI
interface AiResponse {
    response_text: string;
    confidence?: number;
    model_name?: string;
}

// Инициализация клиента OpenAI
const openai = new OpenAI({
    apiKey: aiModel4Token,
});


// Функция для вызова GPT-4
export async function callAiModel4(query: string): Promise<AiResponse> {
    try {
        // Формирование запроса к GPT-4
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: query }], 
            model: "gpt-4o", 
            max_tokens: 1000,        
        });
        // Извлечение сгенерированного текста
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

// Функция для обработки вопросов из файла Quest.json с помощью GPT-4
export async function processQuestionsWithGPT() {
    try {
      // Путь к файлу с вопросами
      const questPath = path.join(__dirname, '..', 'Quest.json');
      // Чтение вопросов из файла
      const questContent = await fs.readFile(questPath, 'utf-8');
      const quest = JSON.parse(questContent);
  
      // Проверка формата файла с вопросами
      if (!quest.questions || !Array.isArray(quest.questions)) {
        throw new Error('Invalid Quest.json format. "questions" must be an array of strings.');
      }
      
      // Обработка каждого вопроса
      for (const question of quest.questions) {
        // Проверка типа вопроса (должен быть строкой)
        if (typeof question !== 'string') {
          console.error(`Invalid question type: ${typeof question}. Skipping.`);
          continue; 
        }

        console.log(`Question: ${question}`);
        // Вызов GPT-4 для текущего вопроса
        const response = await callAiModel4(question);
        console.log(`GPT Answer: ${response.response_text}`);
        console.log('---');
      }
    } catch (error) {
      console.error('Error processing questions:', error);
    }
  }