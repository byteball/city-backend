import { FastifyInstance } from 'fastify';
import { getIndexPageWithSeoTags } from '../services/clientService';

export default async function clientRoutes(app: FastifyInstance) {
  app.setNotFoundHandler((request, reply) => {
    getIndexPageWithSeoTags(request, reply);
  });
}