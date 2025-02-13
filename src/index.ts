import * as dotenv from 'dotenv';
import app from './functions/app';
import { processQuestionsWithGemini } from './functions/gemini';
import { processQuestionsWithAnthropic } from './functions/Claude';


dotenv.config();

console.log("AI model tokens successfully loaded.");

// Function to run queries from Quest.json
async function runQueries() {
//  await processQuestionsWithGemini();
  await processQuestionsWithAnthropic();

}

// Start the server and run queries
app.listen(3000, () => {
  console.log('Server is running on port 3000');
  runQueries().catch(console.error);
});