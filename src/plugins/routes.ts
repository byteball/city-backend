import fp from 'fastify-plugin';

import healthRoutes from '../routes/health';
import ogImageRoutes from '../routes/og';

export default fp(async (app) => {
  app.register(healthRoutes);
  app.register(ogImageRoutes);
});