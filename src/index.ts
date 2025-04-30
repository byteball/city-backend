import fastify from 'fastify';
import dotenv from 'dotenv';
import config from './config';
import routesPlugin from './plugins/routes';

dotenv.config();

const app = fastify({ logger: true });

app.register(routesPlugin);

const start = async () => {
  try {
    await app.listen({ port: config.port, host: 'localhost' });
    app.log.info(`Server listening on port ${config.port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();