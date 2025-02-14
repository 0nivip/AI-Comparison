import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

interface Data {
  responses: {
    question: string;
    gemini: string | null;
    gpt: string | null;
    cohere: string | null;
    gpt4_analysis: string | null;
  }[];
}

// For lowdb v2 and above:
const adapter = new JSONFile<Data>('db.json');
const db = new Low<Data>(adapter, { responses: [] }); // Default data directly in the constructor

(async () => {
    await db.read();
})();


// Функция для записи ответа в БД
async function saveResponse(question: string, gemini: string | null, gpt: string | null, cohere: string | null, gpt4_analysis: string | null) {
  // Now db.data is guaranteed to be initialized *before* this function is called
  db.data!.responses.push({ // <--- Use ! here
    question,
    gemini,
    gpt,
    cohere,
    gpt4_analysis,
  });
  await db.write();
}

export default db;
export { saveResponse };
