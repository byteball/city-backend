import fp from 'fastify-plugin';

import healthRoutes from '../routes/health';

export default fp(async (app) => {
  app.register(healthRoutes);
});