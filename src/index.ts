import * as dotenv from 'dotenv';
import { callAiModel2 } from './functions/gemini';
import { callAiModel1 } from './functions/GPT';
import { callAiModel3 } from './functions/Cohere';
import { callAiModel4 } from './functions/GPT-4o';
import * as readline from 'readline';
import * as fs from 'fs/promises';
import * as path from 'path';
import db, { saveResponse } from './functions/db';
import { getBestAnswer, BestAnswer } from './functions/Vote';

// Загрузка переменных окружения
dotenv.config();

// Создание интерфейса readline один раз
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Функция для отображения истории запросов и ответов
async function showHistory() {
    await db.read();
    if (!db.data || db.data.responses.length === 0) {
        console.log("No responses saved yet."); // Сообщений нет
        return;
    }

    db.data.responses.forEach((response, index) => {
        console.log(`\n--- Entry ${index + 1} ---`); // Запись номер ...
        console.log(`Question: ${response.question}`); // Вопрос
        console.log(`Gemini: ${response.gemini}`); // Ответ Gemini
        console.log(`GPT: ${response.gpt}`); // Ответ GPT
        console.log(`Cohere: ${response.cohere}`); // Ответ Cohere
        console.log(`GPT-4 Analysis: ${response.gpt4_analysis}`); // Анализ GPT-4
        console.log(`Chosen Model (Vote): ${response.Vote}`); // Выбранная модель
    });
}

// Функция для выполнения запросов к моделям
async function runQueries() {
    while (true) {
        const action = await new Promise<string>((resolve) => {
            rl.question('(a)sk, (l)ist questions, (h)istory, or (e)xit? ', resolve);
        });

        if (action === 'a' || action === 'l') {
            let question: string;

            try {
                    if (action === 'a') {
                        question = await new Promise<string>((resolve) => {
                            rl.question('Enter a question: ', resolve); // Запрос вопроса от пользователя
                        });
                    } else {
                        const questPath = path.join(__dirname, 'Quest.json'); // Путь к файлу с вопросами
                        const questContent = await fs.readFile(questPath, 'utf-8'); // Чтение файла с вопросами
                        const quest = JSON.parse(questContent); // Парсинг JSON

                        if (!quest.questions || !Array.isArray(quest.questions) || quest.questions.length < 5) {
                            throw new Error('Invalid Quest.json format or not enough questions.'); // Ошибка формата файла с вопросами
                        }

                        for (let i = 0; i < 5; i++) {
                            console.log(`${i + 1}. ${quest.questions[i]}`); // Вывод 5 вопросов на выбор
                        }

                        const chosenQuestionIndex = await new Promise<number>((resolve) => {
                            rl.question('Choose a question number (1-5): ', (answer) => { // Запрос номера вопроса у пользователя
                                const index = parseInt(answer) - 1;
                                if (isNaN(index) || index < 0 || index >= 5) {
                                    console.error("Invalid choice. Using the first question."); // Ошибка выбора, используется первый вопрос
                                    resolve(0);
                                } else {
                                    resolve(index);
                                }
                            });
                        });
                        question = quest.questions[chosenQuestionIndex]; // Выбранный вопрос
                    }


                    const responses = await Promise.all([
                        callAiModel2(question), // Запрос к Gemini
                        callAiModel1(question), // Запрос к GPT
                        callAiModel3(question), // Запрос к Cohere
                    ]);

                    const responsesJson = JSON.stringify(responses, null, 2);
                    console.log("Responses in JSON format:"); // Ответы в формате JSON
                    console.log(responsesJson);

                    const deepSeekPrompt = `Which of the following answers is better for the question "${question}"? Please provide your reasoning and return all three original answers along with your assessment.

Answers:
1. Gemini: ${responses[0].response_text}
2. GPT: ${responses[1].response_text}
3. Cohere: ${responses[2].response_text}`; // Формирование запроса для GPT-4 для анализа ответов

                    const deepSeekResponse = await callAiModel4(deepSeekPrompt); // Запрос к GPT-4 для анализа

                    console.log("\nGPT-4 Analysis:"); // Анализ GPT-4
                    console.log(deepSeekResponse.response_text);

                    const bestAnswer: BestAnswer | null = await getBestAnswer(question, {
                        gemini: responses[0].response_text,
                        gpt: responses[1].response_text,
                        cohere: responses[2].response_text,
                    });
    
                    let chosenModel = null;
                    if (bestAnswer) {
                        console.log(`\nYou chose: ${bestAnswer.model}`);
                        chosenModel = bestAnswer.model;
                    } else {
                        console.log("\nNo best answer selected.");
                    }
    
                    await saveResponse(
                        question,
                        responses[0].response_text,
                        responses[1].response_text,
                        responses[2].response_text,
                        deepSeekResponse.response_text,
                        chosenModel ? chosenModel : null 
                    );
    
                    console.log('Response saved to db.json');
    
                } catch (error) {
                    console.error('Error processing question or saving response:', error);
                }
    
            } else if (action === 'h') {
                await showHistory();
            } else if (action === 'e') {
                console.log("Exiting the application. Goodbye!");
                return; // Выход из функции runQueries
            } else {
                console.log("Invalid input. Please enter 'a', 'l', 'h', or 'e'.");
            }
            
        }
    }
    
    async function main() {
        try {
            await runQueries();
        } finally {
            rl.close(); // Закрываем интерфейс readline только при выходе из приложения
        }
    }
    
    main();