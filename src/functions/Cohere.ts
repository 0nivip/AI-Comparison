import { CohereClient } from "cohere-ai";
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

// Загрузка переменных окружения
dotenv.config();

// Получение токена для Cohere API из переменных окружения
const aiModel3Token = process.env.AI_MODEL_3_TOKEN;

if (!aiModel3Token) {
  throw new Error("API KEY is not set in the environment variables");
  }

// Интерфейс для ответа от AI
interface AiResponse {
    response_text: string;
    confidence?: number;
    model_name?: string;
  }
  
// Инициализация клиента Cohere
const cohere = new CohereClient({
    token: aiModel3Token
  });
  
// Функция для вызова Cohere API
export async function callAiModel3(query: string): Promise<AiResponse> {
    try {
        // Формирование запроса к Cohere API.  Важно: указание модели command-xlarge
        const result = await cohere.generate({
            prompt: query,
            model: 'command-xlarge', 
            maxTokens: 1000,
        });
        // Извлечение сгенерированного текста
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

// Функция для обработки вопросов из файла Quest.json с помощью Cohere API
  export async function processQuestionsWithCohere() {
  try {
      // Чтение вопросов из файла Quest.json
    const questPath = path.join(__dirname, '..', 'Quest.json');
    const questContent = await fs.readFile(questPath, 'utf-8');
    const quest = JSON.parse(questContent);
  
      // Проверка формата JSON
    if (!quest.questions || !Array.isArray(quest.questions)) {
    throw new Error('Invalid Quest.json format');
    }
  
      // Цикл по вопросам из файла
    for (const question of quest.questions) {
    console.log(`Question: ${question}`);
        // Вызов Cohere API для каждого вопроса
    const response = await callAiModel3(question);
    console.log(`Cohere Answer: ${response.response_text}`);
    console.log('---');
    }
  } catch (error) {
    console.error('Error processing questions:', error);
  }
  }