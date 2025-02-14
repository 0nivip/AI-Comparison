import express, { Request, Response, NextFunction } from 'express';
import { callAiModel1, callAiModel3 } from './aiRequest';
interface QueryRequest {
    query: string;
}

interface AiResponse {
    response_text: string;
    confidence?: number;
    model_name?: string;
}

interface ApiResponse {
    response: string;
    error?: string;
}

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

const validateQuery = (req: Request, res: Response, next: NextFunction) => {
    const { query } = req.body as QueryRequest;
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
        res.status(400).json({ error: 'Неверный параметр запроса' });
        return;
    }
    next();
};
app.get('/', (_req: Request, res: Response) => {
    res.status(200).send('Сервер запущен');
});

app.post('/api/query', validateQuery, async (req: Request, res: Response) => {
    const { query } = req.body as QueryRequest;

    try {
        const aiModel1Token = process.env.AI_MODEL_1_TOKEN;
        const aiModel2Token = process.env.AI_MODEL_2_TOKEN;
        const aiModel3Token = process.env.AI_MODEL_3_TOKEN;

        if (!aiModel1Token || !aiModel2Token || !aiModel3Token) {
            throw new Error('Отсутствуют токены AI моделей в переменных окружения');
        }

        const responses = await Promise.all([
            callAiModel1(query, aiModel1Token),
            callAiModel3(query, aiModel3Token),
        ]);

        const combinedResponse = processResponses(responses);
        const apiResponse: ApiResponse = { response: combinedResponse };

        res.status(200).json(apiResponse);

    } catch (error) {
        console.error('Ошибка обработки запроса:', error);

        const errorMessage = error instanceof Error ? error.message : 'Внутренняя ошибка сервера';
        const apiResponse: ApiResponse = {
            response: '',
            error: errorMessage
        };

        res.status(500).json(apiResponse);
    }
});

function processResponses(responses: AiResponse[]): string {
    if (!responses || responses.length === 0) {
        return 'Нет ответа от AI моделей.';
    }

    const validResponses = responses.filter(r => r && r.response_text);

    if (validResponses.length === 0) {
        return 'Нет валидных ответов от AI моделей.';
    }

    return validResponses[0].response_text;
}

app.use((err: Error, _req: Request, res: Response, _next: Function) => {
    console.error('Необработанная ошибка:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

const server = app.listen(port, () => {
    console.log(`Сервер запущен по адресу http://localhost:${port}`);
});

process.on('SIGTERM', () => {
    console.log('Получен сигнал SIGTERM: закрываем HTTP сервер');
    server.close(() => {
        console.log('HTTP сервер закрыт');
    });
});

export default app;