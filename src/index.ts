import * as dotenv from 'dotenv';
import app from './functions/app';
import { processQuestionsWithGemini } from './functions/gemini';
import { processQuestionsWithDeepSeek } from './functions/DeepSeek';
import { processQuestionsWithCohere } from './functions/Cohere';


dotenv.config();

console.log("AI model tokens successfully loaded.");

async function runQueries() {
  await processQuestionsWithGemini();
//  await processQuestionsWithDeepSeek();
  await processQuestionsWithCohere();

}

app.listen(3000, () => {
  console.log('Server is running on port 3000');
  runQueries().catch(console.error);
});