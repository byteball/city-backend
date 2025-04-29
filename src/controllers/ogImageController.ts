import { FastifyReply, FastifyRequest } from 'fastify';

import { getOgImageData } from '../services/ogImageService';

export const getOgImage = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const img = await getOgImageData();
  
  reply.send(img);
};