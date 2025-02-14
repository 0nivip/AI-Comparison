import * as dotenv from 'dotenv';
import { callAiModel2 } from './functions/gemini';
import { callAiModel1 } from './functions/GPT';
import { callAiModel3 } from './functions/Cohere';
import { callAiModel4 } from './functions/DeepSeek';
import * as readline from 'readline';

dotenv.config();

async function runQueries() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const question = await new Promise<string>((resolve) => {
        rl.question('Enter a question: ', (answer) => {
            rl.close();
            resolve(answer);
        });
    });

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

    console.log("\nDeepSeek Analysis:");
    console.log(deepSeekResponse.response_text);
}

async function main() {
    await runQueries();
}

main();

