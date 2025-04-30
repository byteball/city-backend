import { FastifyReply, FastifyRequest } from 'fastify';

import { getOgImageData, IUnitOptions } from '../services/ogImageService';

const availablePages = ['unit', 'market', 'governance', 'faq', 'user'];

export const getOgImage = async (
  request: FastifyRequest<{
    Params: { page: string };
    Querystring: { type?: 'plot' | 'house'; number?: string };
  }>,
  reply: FastifyReply
) => {
  const requestParams = request.params as { page: string };

  if (!availablePages.includes(requestParams.page)) {
    return reply.status(400).send({ error: 'Invalid page parameter' });
  }

  let unitOptions: IUnitOptions | undefined = undefined;
  let img: Buffer<ArrayBufferLike>;

  if (requestParams.page == 'unit') {
    unitOptions = {
      type: request.query.type as 'plot' | 'house',
      number: parseInt(request.query.number || '0', 10)
    };
  }

  try {
    img = await getOgImageData(requestParams.page, unitOptions);

  } catch (e) {
    console.error('error generating image', e);
    return reply.status(400).send({ error: (e as Error).message || 'Error generating image' });
  }

  return reply
    .header('Content-Type', 'image/jpeg')
    .code(200)
    .send(img);
};