import * as readline from 'readline';

// Интерфейс для ответов от API
interface ApiResponse {
  gemini: string | null; // Ответ Gemini
  gpt: string | null; // Ответ GPT
  cohere: string | null; // Ответ Cohere
}

// Интерфейс для лучшего ответа
export interface BestAnswer {
  model: string; // Название модели, давшей лучший ответ
  answer: string | null; // Сам лучший ответ
}


export async function getBestAnswer(question: string, responses: ApiResponse): Promise<BestAnswer | null> {
  // Если ни одна модель не дала ответа, выводим сообщение и возвращаем null
  if (!responses.gemini && !responses.gpt && !responses.cohere) {
    console.log("No responses provided to vote on.");
    return null;
  }

  // Создаем интерфейс для чтения ввода с консоли
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Выводим вопрос
  console.log(`Question: ${question}\n`);

  // Создаем массив вариантов ответа
  const choices: { key: string; value: string | null }[] = [];
  if (responses.gemini) {
    choices.push({ key: "Gemini", value: responses.gemini });
    console.log(`1. Gemini: ${responses.gemini}`);
  }
  if (responses.gpt) {
    choices.push({ key: "GPT", value: responses.gpt });
    console.log(`2. GPT: ${responses.gpt}`);
  }
  if (responses.cohere) {
    choices.push({ key: "Cohere", value: responses.cohere });
    console.log(`3. Cohere: ${responses.cohere}`);
  }

  console.log();

  try {
    // Цикл для запроса выбора лучшего ответа
    while (true) {
      const answer = await new Promise<string>(resolve => {
        // Запрос выбора лучшего ответа у пользователя
        rl.question(
          `Which response is best? (${choices.map(c => c.key).join(", ")}, or s to skip): `,
          resolve
        );
      });

      // Если пользователь ввел 's', пропускаем выбор лучшего ответа
      if (answer.toLowerCase() === "s") {
        return null;
      }

      // Ищем выбранный вариант ответа в массиве choices
      const selectedChoice = choices.find(c => c.key === answer);
      if (selectedChoice) {
        // Возвращаем выбранный ответ и название модели
        return { model: selectedChoice.key, answer: selectedChoice.value };
      } else {
        // Выводим сообщение об ошибке, если выбран неверный вариант
        console.log("Invalid choice. Please try again.");
      }
    }
  } finally {
    // Закрываем интерфейс чтения ввода
    rl.close();
  }
}
