import * as dotenv from 'dotenv';
import { callAiModel2 } from './functions/gemini';
import { callAiModel1 } from './functions/GPT';
import { callAiModel3 } from './functions/Cohere';
import { callAiModel4 } from './functions/GPT-4o';
import * as readline from 'readline';
import * as fs from 'fs/promises';
import * as path from 'path';

dotenv.config();

async function runQueries() {
  const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
  });

  const questionType = await new Promise<string>((resolve) => {
      rl.question('Ask a question (a) or choose from a list (l)? ', (answer) => {
          resolve(answer.toLowerCase());
          });
  });

  let question: string;

  if (questionType === 'a') {
      question = await new Promise<string>((resolve) => {
          rl.question('Enter a question: ', (answer) => {
              resolve(answer);
          });
      });
  } else if (questionType === 'l') {
      try {
          const questPath = path.join(__dirname, './', 'Quest.json'); 
          
          const questContent = await fs.readFile(questPath, 'utf-8');
          const quest = JSON.parse(questContent);

          if (!quest.questions || !Array.isArray(quest.questions) || quest.questions.length < 5) {
              throw new Error('Invalid Quest.json format or not enough questions.');
          }

          for (let i = 0; i < 5; i++) { 
              console.log(`${i + 1}. ${quest.questions[i]}`);
          }

          const chosenQuestionIndex = await new Promise<number>((resolve) => {
              rl.question('Choose a question number (1-5): ', (answer) => {
                  const index = parseInt(answer) - 1;
                  if (isNaN(index) || index < 0 || index >= 5) {
                      console.error("Invalid choice. Using the first question.");
                      resolve(0); 
                  } else {
                      resolve(index);
                  }
              });
          });
           question = quest.questions[chosenQuestionIndex] as string;

      } catch (error) {
          console.error('Error reading or parsing Quest.json:', error);
          rl.close();
          return;
      }
  } else {
      console.error("Invalid input.  Exiting.");
      rl.close();
      return;
  }

  rl.close(); 

  const responses = await Promise.all([
      callAiModel2(question),
      callAiModel1(question),
      callAiModel3(question),
  ]);

    const responsesJson = JSON.stringify(responses, null, 2);
    console.log("Responses in JSON format:");
    console.log(responsesJson);

    const deepSeekPrompt = `Which of the following answers is better for the question "${question}"? Please provide your reasoning and return all three original answers along with your assessment.

Answers:
1. Gemini: ${responses[0].response_text}
2. GPT: ${responses[1].response_text}
3. Cohere: ${responses[2].response_text}`;

    const deepSeekResponse = await callAiModel4(deepSeekPrompt);

    console.log("\nGPT-4 Analysis:");
    console.log(deepSeekResponse.response_text);
}

async function main() {
    await runQueries();
}

main();

