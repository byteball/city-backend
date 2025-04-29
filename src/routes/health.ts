import { FastifyInstance } from 'fastify';
import { getHealth } from '../controllers/healthController';

export default async function healthRoutes(app: FastifyInstance) {
  app.get('/health', getHealth);
}