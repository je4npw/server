import Fastify from 'fastify';
import jwt from '@fastify/jwt';

import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import { poolRoutes } from './routes/pool';
import { userRoutes } from './routes/user';
import { guessRoutes } from './routes/guess';
import { gameRoutes } from './routes/game';
import { authRoutes } from './routes/auth';

interface Props {
  title: string;
}
const prisma = new PrismaClient({
  log: ['error'],
});

async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: true,
  });

  // em produção isso precisa ser uma variável ambiente

  await fastify.register(jwt, {
    secret: 'm@l0k@ssss',
  });

  await fastify.register(gameRoutes);
  await fastify.register(authRoutes);
  await fastify.register(poolRoutes);
  await fastify.register(guessRoutes);
  await fastify.register(userRoutes);
  await fastify.listen({ port: 3333, host: '0.0.0.0' });
}

bootstrap();
