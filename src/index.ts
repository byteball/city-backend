import fastify from 'fastify';
import dotenv from 'dotenv';

import routesPlugin from './plugins/routes';
import config from './config';

dotenv.config();

const app = fastify({ logger: true });

app.register(routesPlugin);

const start = async () => {
  try {
    await app.listen({ port: config.port, host: '0.0.0.0' });
    app.log.info(`Server listening on port ${config.port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();