import * as dotenv from 'dotenv';
import { callAiModel2 } from './functions/gemini';
import { callAiModel1 } from './functions/GPT';
import { callAiModel3 } from './functions/Cohere';
import { callAiModel4 } from './functions/GPT-4o';
import * as readline from 'readline';
import * as fs from 'fs/promises';
import * as path from 'path';
import db, { saveResponse } from './functions/db';
import { getBestAnswer } from './functions/Vote';

// Загрузка переменных окружения
dotenv.config();

// Функция для отображения истории запросов и ответов
async function showHistory() {
    await db.read(); // Чтение данных из базы данных
    if (!db.data || db.data.responses.length === 0) { // Проверка наличия данных
        console.log("No responses saved yet."); // Вывод сообщения об отсутствии данных
        return;
    }

    // Перебор всех сохраненных ответов
    db.data.responses.forEach((response, index) => {
        console.log(`\n--- Entry ${index + 1} ---`); // Вывод номера записи
        console.log(`Question: ${response.question}`); // Вывод вопроса
        console.log(`Gemini: ${response.gemini}`); // Вывод ответа Gemini
        console.log(`GPT: ${response.gpt}`); // Вывод ответа GPT
        console.log(`Cohere: ${response.cohere}`); // Вывод ответа Cohere
        console.log(`GPT-4 Analysis: ${response.gpt4_analysis}`); // Вывод анализа GPT-4
        console.log(`User Voice: ${response.userVoice}`); // Вывод голосового ввода пользователя
    });
}

// Функция для выполнения запросов к моделям
async function runQueries() {
    // Создание интерфейса для чтения строки ввода
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    try {
        while (true) { // Бесконечный цикл для обработки запросов
            let userVoice: string | null = null; // Переменная для голосового ввода пользователя
            // Запрос действия от пользователя
            const action = await new Promise<string>((resolve) => {
                rl.question('(a)sk, (l)ist questions, (h)istory, or (e)xit? ', (answer) => {
                    resolve(answer.toLowerCase()); // Преобразование ответа в нижний регистр
                });
            });

            // Обработка действия "задать вопрос" или "выбрать вопрос из списка"
            if (action === 'a' || action === 'l') {
                let question: string;

                try {
                    if (action === 'a') {
                        // Запрос вопроса от пользователя
                        question = await new Promise<string>((resolve) => {
                            rl.question('Enter a question: ', (answer) => {
                                resolve(answer);
                            });
                        });
                    } else { // action === 'l'
                        // Чтение вопросов из файла Quest.json
                        const questPath = path.join(__dirname, './', 'Quest.json');
                        const questContent = await fs.readFile(questPath, 'utf-8');
                        const quest = JSON.parse(questContent);

                        // Валидация формата файла Quest.json
                        if (!quest.questions || !Array.isArray(quest.questions) || quest.questions.length < 5) {
                            throw new Error('Invalid Quest.json format or not enough questions.');
                        }

                        // Вывод первых 5 вопросов из файла
                        for (let i = 0; i < 5; i++) {
                            console.log(`${i + 1}. ${quest.questions[i]}`);
                        }

                        // Запрос номера выбранного вопроса от пользователя
                        const chosenQuestionIndex = await new Promise<number>((resolve) => {
                            rl.question('Choose a question number (1-5): ', (answer) => {
                                const index = parseInt(answer) - 1;
                                if (isNaN(index) || index < 0 || index >= 5) {
                                    console.error("Invalid choice. Using the first question.");
                                    resolve(0); // Использование первого вопроса по умолчанию при некорректном вводе
                                } else {
                                    resolve(index);
                                }
                            });
                        });
                        question = quest.questions[chosenQuestionIndex];
                    }

                    // Запрос голосового ввода пользователя (только при ручном вводе вопроса)
                    if (action === 'a') {
                        userVoice = await new Promise<string | null>((resolve) => {
                            rl.question('Enter your voice input (or press Enter to skip): ', (answer) => {
                                resolve(answer || null);
                            });
                        });
                    }

                    // Параллельный вызов всех моделей
                    const responses = await Promise.all([
                        callAiModel2(question),
                        callAiModel1(question),
                        callAiModel3(question),
                    ]);

                    // Преобразование ответов в JSON формат и вывод в консоль
                    const responsesJson = JSON.stringify(responses, null, 2);
                    console.log("Responses in JSON format:");
                    console.log(responsesJson);


                    // Формирование запроса для GPT-4 для анализа ответов
                    const deepSeekPrompt = `Which of the following answers is better for the question "${question}"? Please provide your reasoning and return all three original answers along with your assessment.

Answers:
1. Gemini: ${responses[0].response_text}
2. GPT: ${responses[1].response_text}
3. Cohere: ${responses[2].response_text}`;

                    // Вызов GPT-4 для анализа
                    const deepSeekResponse = await callAiModel4(deepSeekPrompt);

                    // Вывод анализа GPT-4
                    console.log("\nGPT-4 Analysis:");
                    console.log(deepSeekResponse.response_text);

                    // Запрос выбора лучшего ответа от пользователя
                    const bestAnswer = await getBestAnswer(question, {
                        gemini: responses[0].response_text,
                        gpt: responses[1].response_text,
                        cohere: responses[2].response_text,
                    });

                    let chosenModel = null;
                    if (bestAnswer) {
                        console.log(`\nYou chose: ${bestAnswer.answer} (from ${bestAnswer.model})`);
                        chosenModel = bestAnswer.model;
                    } else {
                        console.log("\nNo best answer selected.");
                    }

                    // Сохранение результатов в базу данных
                    await saveResponse(
                        question,
                        responses[0].response_text,
                        responses[1].response_text,
                        responses[2].response_text,
                        deepSeekResponse.response_text,
                        userVoice,
                        chosenModel
                    );

                    console.log('Response saved to db.json');

                } catch (error) {
                    console.error('Error processing question or saving response:', error);
                }

            // Обработка действия "показать историю"
            } else if (action === 'h') {
                await showHistory();
            // Обработка действия "выйти"
            } else if (action === 'e') {
                break; // Выход из цикла
            // Обработка некорректного ввода
            } else {
                console.log("Invalid input. Please enter 'a', 'l', 'h', or 'e'.");
            }
        }
    } finally {
        rl.close(); // Закрытие интерфейса чтения строки ввода
    }
}


async function main() {
    await runQueries();
}

main();
