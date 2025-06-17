import { callAiModel3 } from '../backend/functions/Cohere';
import { callAiModel4 } from '../backend/functions/GPT-4o';
import { callAiModel2 } from '../backend/functions/Gemini';
import Fastify from 'fastify';
import cors from '@fastify/cors';

const fastify = Fastify();

await fastify.register(cors);

// Cohere endpoint
fastify.post('/api/cohere', async (request, reply) => {
  const { prompt } = request.body as { prompt?: string };
  if (!prompt) return reply.status(400).send({ error: 'Prompt is required' });
  try {
    const answerObj = await callAiModel3(prompt);
    reply.send({ answer: answerObj.response_text });
  } catch {
    reply.status(500).send({ error: 'Cohere error' });
  }
});


// GPT and Gemini still in development
