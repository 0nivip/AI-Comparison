import { CohereClient } from "cohere-ai";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import env from "../helpers/env";
import { makeShorterPrompt } from "../helpers/prompt-tool";
import fetch from "node-fetch";

// Загрузка переменных окружения
dotenv.config();

// Получение токена для Cohere API из переменных окружения
const aiModel3Token = env.COHERE_API_KEY;

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
    token: aiModel3Token,
});

// Функция для вызова Cohere API
export async function callAiModel3(query: string): Promise<AiResponse> {
    try {
        // Формирование запроса к Cohere API.  Важно: указание модели command-xlarge
        const result = await cohere.generate({
            prompt: makeShorterPrompt(query),
            model: "command-xlarge",
            maxTokens: 1000,
        });
        // Извлечение сгенерированного текста
        const generatedText = result.generations[0]?.text || "";
        return {
            response_text: generatedText,
            model_name: "Command-XLARGE",
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
        const questPath = path.join(__dirname, "..", "Quest.json");
        const questContent = await fs.readFile(questPath, "utf-8");
        const quest = JSON.parse(questContent);

        // Проверка формата JSON
        if (!quest.questions || !Array.isArray(quest.questions)) {
            throw new Error("Invalid Quest.json format");
        }

        // Цикл по вопросам из файла
        for (const question of quest.questions) {
            console.log(`Question: ${question}`);
            // Вызов Cohere API для каждого вопроса
            const response = await callAiModel3(question);
            console.log(`Cohere Answer: ${response.response_text}`);
            console.log("---");
        }
    } catch (error) {
        console.error("Error processing questions:", error);
    }
}

/**
 * Get a response from Cohere API for a given prompt.
 * @param prompt The user's question.
 * @returns The answer from Cohere or null if an error occurs.
 */
export async function getCohereResponse(prompt: string): Promise<string | null> {
  try {
    const response = await fetch("https://api.cohere.ai/v1/chat", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.COHERE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: prompt,
        model: "command-r-plus",
        temperature: 0.3,
        max_tokens: 512,
      }),
    });

    if (!response.ok) {
      console.error("Cohere API error:", response.statusText);
      return null;
    }

    const data = await response.json();
    return data.text ?? null;
  } catch (error) {
    console.error("Cohere API request failed:", error);
    return null;
  }
}
