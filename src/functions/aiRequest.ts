import fetch from 'node-fetch';

// Определяем интерфейс AiResponse для лучшей типобезопасности
interface AiResponse {
    response_text: string;
    confidence?: number;
    model_name?: string;
}

// Функция для вызова AI модели с использованием токена и URL
export async function callAiModel(query: string, token: string, url: string): Promise<any> {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ query: query })
        });

        if (!response.ok) {
            throw new Error(`Ошибка при запросе к AI модели: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Ошибка при вызове AI модели:', error);
        throw error; // Пробрасываем ошибку для обработки на верхнем уровне
    }
}

// Функции для вызова каждой AI модели
// Временные реализации, возвращающие заглушки
export const callAiModel1 = async (query: string, token: string): Promise<AiResponse> => {
    // TODO: Реализовать вызов AI Model 1 с использованием токена
    // Временная заглушка
    console.log("Вызов AI Model 1 с query:", query);
    return { response_text: 'Ответ от модели 1' };
};

export const callAiModel3 = async (query: string, token: string): Promise<AiResponse> => {
    // TODO: Реализовать вызов AI Model 3 с использованием токена
    // Временная заглушка
    console.log("Вызов AI Model 3 с query:", query);
    return { response_text: 'Ответ от модели 3' };
};