import * as readline from 'readline';

// Interface for API responses
interface ApiResponse {
  gemini: string | null; // Gemini answer
  gpt: string | null; // GPT answer
  cohere: string | null; // Cohere answer
}

// Interface for the best answer
export interface BestAnswer {
  model: string; // Model name that gave the best answer
  answer: string | null; // The best answer itself
}

export async function getBestAnswer(
  question: string,
  responses: ApiResponse
): Promise<BestAnswer | null> {
  // If no model provided an answer, print a message and return null
  if (!responses.gemini && !responses.gpt && !responses.cohere) {
    console.log("No responses provided to vote on.");
    return null;
  }

  // Create a readline interface for console input
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Print the question
  console.log(`Question: ${question}\n`);

  // Create an array of answer choices
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
    // Loop to prompt for the best answer
    while (true) {
      const answer = await new Promise<string>(resolve => {
        rl.question(
          `Which response is best? (${choices.map(c => c.key).join(", ")}, or s to skip): `,
          resolve
        );
      });

      // If user entered 's', skip selecting the best answer
      if (answer.toLowerCase() === "s") {
        return null;
      }

      // Find the selected answer in the choices array
      const selectedChoice = choices.find(c => c.key === answer);
      if (selectedChoice) {
        // Return the selected answer and model name
        return { model: selectedChoice.key, answer: selectedChoice.value };
      } else {
        // Print error message if invalid choice
        console.log("Invalid choice. Please try again.");
      }
    }
  } finally {
    // Close the readline interface
    rl.close();
  }
}
