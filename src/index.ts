import * as dotenv from 'dotenv';
dotenv.config();
import app from './functions/app';
import Quest from './Quest.json';

console.log("Токены AI моделей успешно загружены.");

// Функция для запуска запросов из Quest.json
async function runQueries() {
    try {
        if (!Quest || !Quest.questions || !Array.isArray(Quest.questions)) {
            throw new Error('Неверный формат файла Quest.json');
        }

        const questions = Quest.questions;

        for (const question of questions) {
            // Отправляем POST запрос к нашему API
            const response = await fetch('http://localhost:3001/api/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: question }),
            });

            if (!response.ok) {
                console.error(`Ошибка при запросе вопроса "${question}": ${response.status} ${response.statusText}`);
                continue; // Переходим к следующему вопросу
            }

            const data = await response.json();
            console.log(`Вопрос: ${question}`);
            console.log(`Ответ: ${data.response}`);
            console.log('---');
        }

        console.log('Все запросы выполнены.');

    } catch (error) {
        console.error('Ошибка при выполнении запросов:', error);
    }
}

// Запускаем сервер и выполнение запросов
app.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
    runQueries(); // Вызываем функцию для выполнения запросов после запуска сервера
});