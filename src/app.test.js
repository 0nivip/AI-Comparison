import { describe, it, expect } from 'bun:test'; 
import { callAiModel1 } from './functions/GPT.ts';
import { callAiModel2 } from './functions/gemini.ts';
import { callAiModel3 } from './functions/Cohere.ts';
import { callAiModel4 } from './functions/GPT-4o.ts';


describe('AI Model Tests', () => { 

  it('GPT should return a response', async () => {
    const response = await callAiModel1("Test prompt");
    expect(response).toBeDefined(); 
  });

  it('Gemini should return a response', async () => {
    const response = await callAiModel2("Test prompt");
    expect(response).toBeDefined();
  });

  it('Cohere should return a response', async () => {
    const response = await callAiModel3("Test prompt");
    expect(response).toBeDefined();
  });
  
  it('GPT-4o should return a response', async () => {
    const response = await callAiModel4("Test prompt");
    expect(response).toBeDefined();
  });
});
