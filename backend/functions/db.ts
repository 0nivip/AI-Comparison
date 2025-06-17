import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

// Interface for the data stored in the database
interface Data {
    responses: { // Array of responses
      question: string; // User question
      gemini: string | null; // Gemini answer
      gpt: string | null; // GPT answer
      cohere: string | null; // Cohere answer
      gpt4_analysis: string | null; // GPT-4 analysis
      vote: string | null; // User-selected model (best answer)
    }[];
}

// Adapter for working with a JSON file
const adapter = new JSONFile<Data>('db.json');
// Initialize LowDB database with the specified adapter and initial data
const db = new Low<Data>(adapter, { responses: [] }); 

// Asynchronously read data from file on startup
(async () => {
    await db.read();
})();

/**
 * Function to save a response to the database.
 * @param question User question.
 * @param gemini Gemini answer.
 * @param gpt GPT answer.
 * @param cohere Cohere answer.
 * @param gpt4_analysis GPT-4 analysis.
 * @param vote User-selected model.
 */
async function saveResponse(
  question: string,
  gemini: string | null,
  gpt: string | null,
  cohere: string | null,
  gpt4_analysis: string | null,
  vote: string | null
) {
    db.data!.responses.push({
      question,
      gemini,
      gpt,
      cohere,
      gpt4_analysis,
      vote,
    });
    await db.write();
}

// Export the database and saveResponse function
export default db;
export { saveResponse };
