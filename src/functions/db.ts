import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

// Определение интерфейса для данных, хранящихся в базе данных
interface Data {
    responses: { // Массив ответов
      question: string; // Вопрос пользователя
      gemini: string | null; // Ответ Gemini
      gpt: string | null; // Ответ GPT
      cohere: string | null; // Ответ Cohere
      gpt4_analysis: string | null; // Анализ GPT-4
      userVoice: string | null; // Голосовой ввод пользователя
      chosenModel: string | null; // Выбранная пользователем модель (лучший ответ)
    }[];
}

// Адаптер для работы с JSON файлом
const adapter = new JSONFile<Data>('db.json');
// Инициализация базы данных LowDB с заданным адаптером и начальными данными
const db = new Low<Data>(adapter, { responses: [] }); 

// Асинхронное чтение данных из файла при запуске
(async () => {
    await db.read();
})();

/**
 * Функция для сохранения ответа в базу данных.
 * @param question Вопрос пользователя.
 * @param gemini Ответ Gemini.
 * @param gpt Ответ GPT.
 * @param cohere Ответ Cohere.
 * @param gpt4_analysis Анализ GPT-4.
 * @param userVoice Голосовой ввод пользователя.
 * @param chosenModel Выбранная пользователем модель.
 */
async function saveResponse(question: string, gemini: string | null, gpt: string | null, cohere: string | null, gpt4_analysis: string | null, userVoice: string | null, chosenModel: string | null) {
    // Добавление нового ответа в массив responses
    db.data!.responses.push({
      question,
      gemini,
      gpt,
      cohere,
      gpt4_analysis,
      userVoice,
      chosenModel,
    });
    // Запись данных в файл
    await db.write();
  }

// Экспорт базы данных и функции saveResponse
export default db;
export { saveResponse };
