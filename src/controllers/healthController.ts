import { FastifyReply, FastifyRequest } from 'fastify';

import { getHealthStatus } from '../services/healthService';

export const getHealth = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const status = await getHealthStatus();
  reply.send({ status });
};