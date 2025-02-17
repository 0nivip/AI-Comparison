# AI Comparison

A CLI tool that compares responses from multiple AI models in real time. Query various AI services simultaneously, analyze their outputs using GPT-4, and determine the best answer based on a voting mechanism.

## Overview

**AI Comparison** is built with TypeScript and Node.js. The tool queries multiple AI models—such as Gemini, GPT, and Cohere—by sending the same prompt to each. A GPT-4 powered analysis then reviews all responses, selects the best answer through a voting mechanism, and saves the full interaction history.

## Features

- **Multi-AI Querying:** Simultaneously fetch responses from different AI models.
- **Automated Analysis:** Leverage GPT-4 to analyze and compare AI responses.
- **History Logging:** Save questions and all corresponding responses in a JSON database.
- **Predefined Questions:** Option to list and select from a set of pre-defined questions.
- **Interactive CLI:** Simple command-line interface for seamless user interaction.

## Getting Started

### Prerequisites

- **Node.js** (version 14 or higher) or [Bun](https://bun.sh) for running scripts.
- A valid `.env` file containing API keys for each AI service used.

### Installation

- Clone the repository and install dependencies:

```bash
git clone https://github.com/VIPSempai/AI-Comparison.git
cd AI-Comparison
npm install
```

## Configuration
>> Create a `.env` file in the project root and add your API keys and other necessary environment variables. 
# For example: 
```Don't forget to change them in the files assigned to them.```
* OPENAI_API_KEY=your_openai_api_key
* COHERE_API_KEY=your_cohere_api_key
# Add other API keys as needed

## Running the Application
+ Start the application with: ``npm run start`` or ``npm start``
+ For development purposes, you can use: ``npm run dev``
+  Follow the interactive prompts to ask a question, stay from a list of pre-defined questions, view history, or exit the application.

## Project Structure

AI-Comparison/
├── src/
│   ├── functions/
│   │   ├── GPT.ts           # Interacts with GPT model
│   │   ├── gemini.ts        # Interacts with Gemini model
│   │   ├── Cohere.ts        # Interacts with Cohere model
│   │   ├── GPT-4o.ts        # Handles GPT-4 analysis
│   │   └── db.ts            # Functions for history storage
│   ├── index.ts             # Main CLI application entry point
│   └── Quest.json           # Pre-defined questions for selection
├── db.json                  # JSON database to log interactions
├── package.json
├── tsconfig.json
└── .gitignore


***How It Works***
+ User Interaction: Choose to ask a new question or list pre-defined ones.
+ AI Responses: The tool sends the question concurrently to Gemini, GPT, and Cohere.
+ Analysis: A GPT-4 powered function analyzes the responses, provides reasoning, and selects the best answer.
+ History Logging: All interactions (question, responses, analysis, and chosen model) are stored in db.json.
+ Review: Users can view their interaction history at any time.

## Dependencies
### Key dependencies include:

- @ai-sdk/deepseek & @ai-sdk/mistral: For specific AI integrations. ``Please note that I do not use either DeepSeek or Mistal in this project, but they are installed and you can configure these models yourself on your API keys.``
- @anthropic-ai/sdk & @google/generative-ai: To connect with Anthropic and Google AI services. ``Please note that I do not use anthropic-ai in this project, but it is installed and you can configure this model yourself on your API keys.``
- cohere-ai & openai: For accessing Cohere and OpenAI models.
- dotenv: Loads environment variables.
- readline: For interactive command-line prompts.
- lowdb: Provides a simple JSON-based database.
- See the package.json for the complete dependency list.

## Contributing
+ Contributions are welcome! If you have suggestions, improvements, or bug fixes, please open an issue or submit a pull request.

## Author & Acknowledgments
**VIP**
**Initial work -** [GitHub](https://github.com/VIPSempai/AI-Comparison)

### Special thanks to the developers behind the various AI SDKs and platforms, including OpenAI, Cohere, Anthropic, and Google, whose tools make projects like this possible