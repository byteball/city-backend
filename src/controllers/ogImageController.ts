import { FastifyReply, FastifyRequest } from 'fastify';

import { getOgImageData } from '../services/ogImageService';

const availablePages = ['unit', 'market', 'governance', 'faq', 'user'];

export const getOgImage = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const requestParams = request.params as { page: string };

  if (!availablePages.includes(requestParams.page)) {
    return reply.status(400).send({ error: 'Invalid page parameter' });
  }

  console.error('start generating image');
  const img = await getOgImageData(requestParams.page);
  console.error('image generated');
  
  return reply
    .header('Content-Type', 'image/jpeg')
    .code(200)
    .send(img);
};