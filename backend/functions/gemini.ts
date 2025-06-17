import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import env from "../helpers/env";
import { makeShorterPrompt } from "../helpers/prompt-tool";

// Загрузка переменных окружения
dotenv.config();

// Получение токена для Gemini API из переменных окружения
const aiModel2Token = env.GEMINI_API_KEY;

if (!aiModel2Token) {
  throw new Error("API KEY is not set in the environment variables");
}

// Инициализация клиента Google Generative AI  и указание модели gemini-2.0-flash
const genAI = new GoogleGenerativeAI(aiModel2Token);
const model = genAI.getGenerativeModel({ 
    model: "gemini-pro" // Исправлено с "gemini-2.0-flash" на "gemini-pro"
});

// Интерфейс для ответа от AI
interface AiResponse {
  response_text: string;
  confidence?: number;
  model_name?: string;
}

// Функция для вызова Gemini API
export async function callAiModel2(query: string): Promise<AiResponse> {
  try {
    // Вызов Gemini API с заданным вопросом
    const result = await model.generateContent(makeShorterPrompt(query));
    // Извлечение текста ответа
    const generatedText = result.response.text();
    return {
      response_text: generatedText,
      model_name: "Gemini-2.0-flash",
    };
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    throw error;
  }
}

// Функция для обработки вопросов из файла Quest.json с помощью Gemini API
export async function processQuestionsWithGemini() {
  try {
    // Чтение вопросов из файла Quest.json
    const questPath = path.join(__dirname, "..", "Quest.json");
    const questContent = await fs.readFile(questPath, "utf-8");
    const quest = JSON.parse(questContent);

    // Проверка корректности формата JSON
    if (!quest.questions || !Array.isArray(quest.questions)) {
      throw new Error("Invalid Quest.json format");
    }

    // Цикл по всем вопросам в файле
    for (const question of quest.questions) {
      console.log(`Question: ${question}`);
      // Вызов Gemini API для каждого вопроса
      const response = await callAiModel2(question);
      console.log(`Gemini Answer: ${response.response_text}`);
      console.log("---");
    }
  } catch (error) {
    console.error("Error processing questions:", error);
  }
}
