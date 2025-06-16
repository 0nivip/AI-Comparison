export const makeShorterPrompt = (prompt: string) => {
    prompt =
        "Please make an answer as small as possible. This is my question: " +
        prompt;
    return prompt.trim();
};
