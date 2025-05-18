import fp from 'fastify-plugin';

import healthRoutes from '../routes/health';
import ogImageRoutes from '../routes/og';
import clientRoutes from '../routes/client';

export default fp(async (app) => {
  app.register(healthRoutes);
  app.register(ogImageRoutes);
  app.register(clientRoutes);
});