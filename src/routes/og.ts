import { FastifyInstance } from 'fastify';

import { getOgImage } from '../controllers/ogImageController';

export default async function ogImageRoutes(app: FastifyInstance) {
  app.get('/og', getOgImage);
}