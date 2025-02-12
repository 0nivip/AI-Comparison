import * as dotenv from 'dotenv';
import fetch from 'node-fetch'
import express, { Request, Response } from 'express';
dotenv.config();

// Теперь ты можешь получить доступ к переменным окружения через process.env
const aiModel1Token = process.env.AI_MODEL_1_TOKEN;
const aiModel2Token = process.env.AI_MODEL_2_TOKEN;
const aiModel3Token = process.env.AI_MODEL_3_TOKEN;

if (!aiModel1Token || !aiModel2Token || !aiModel3Token) {
  console.error("Ошибка: Не найдены токены AI моделей в файле .env");
  process.exit(1); // Завершить приложение с ошибкой, если токены не найдены
}

console.log("Токены AI моделей успешно загружены.");

const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Working');
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});


app.post('/api/query', (req: Request, res: Response) => {
    const userQuery = req.body.query;

    try {
        const responses = await Promise.all([
            callAiModel1(userQuery, aiModel1Token as string),
            callAiModel2(userQuery, aiModel2Token as string),
            callAiModel3(userQuery, aiModel3Token as string),
        ]);

        const combinedResponse = processResponses(responses);
        res.json({ response: combinedResponse });

    } catch (error) {
        console.error("Ошибка при обработке запроса:", error);
        res.status(500).json({ error: "Ошибка при обработке запроса" });
    }
});

async function callAiModel1(query: string, token:string): Promise<any> {
    const response = await fetch('AI_MODEL_1_URL', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query: query })
    });

    if (!response.ok) {
        throw new Error(`Ошибка при запросе к AI модели 1: ${response.status} ${response.statusText}`);
    }
    return await response.json();
}

async function callAiModel2(query: string, token:string): Promise<any> {
    const response = await fetch('AI_MODEL_2_URL', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query: query })
    });

    if (!response.ok) {
        throw new Error(`Ошибка при запросе к AI модели 2: ${response.status} ${response.statusText}`);
    }
    return await response.json();
}

async function callAiModel3(query: string, token:string): Promise<any> {
    const response = await fetch('AI_MODEL_3_URL', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query: query })
    });

    if (!response.ok) {
        throw new Error(`Ошибка при запросе к AI модели 3: ${response.status} ${response.statusText}`);
    }    
    return await response.json();
}

function processResponses(responses: any[]): string {
    // настройка логики обработки 
    return aiResponses[0]?.response_text || "Нет ответа от AI моделей.";
}