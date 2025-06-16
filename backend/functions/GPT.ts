import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import env from "../helpers/env";
import { makeShorterPrompt } from "../helpers/prompt-tool";

// Загрузка переменных окружения
dotenv.config();

// Получение токена для GPT-4 mini из переменных окружения
const aiModel1Token = env.OPENAI_API_KEY;

if (!aiModel1Token) {
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
    apiKey: aiModel1Token,
});

// Функция для вызова GPT-4 mini
export async function callAiModel1(query: string): Promise<AiResponse> {
    try {
        // Формирование запроса к GPT-4 mini
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: makeShorterPrompt(query) }],
            model: "gpt-4o-mini", // Важно: указание модели gpt-4o-mini
            max_tokens: 1000,
        });
        // Извлечение сгенерированного текста
        const generatedText = completion.choices[0].message.content;
        return {
            response_text: generatedText ?? "",
            model_name: "gpt-4o-mini",
        };
    } catch (error) {
        console.error("Error generating content with GPT:", error);
        throw error;
    }
}

// Функция для обработки вопросов из файла Quest.json с помощью GPT-4 mini
export async function processQuestionsWithGPT() {
    try {
        // Чтение вопросов из файла Quest.json
        const questPath = path.join(__dirname, "..", "Quest.json");
        const questContent = await fs.readFile(questPath, "utf-8");
        const quest = JSON.parse(questContent);

        // Валидация формата JSON
        if (!quest.questions || !Array.isArray(quest.questions)) {
            throw new Error(
                'Invalid Quest.json format. "questions" must be an array of strings.',
            );
        }

        // Цикл по вопросам из файла
        for (const question of quest.questions) {
            // Проверка типа вопроса
            if (typeof question !== "string") {
                console.error(
                    `Invalid question type: ${typeof question}. Skipping.`,
                );
                continue;
            }

            console.log(`Question: ${question}`);
            // Вызов GPT-4 mini для каждого вопроса
            const response = await callAiModel1(question);
            console.log(`GPT Answer: ${response.response_text}`);
            console.log("---");
        }
    } catch (error) {
        console.error("Error processing questions:", error);
    }
}
