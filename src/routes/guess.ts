import { FastifyInstance } from 'fastify';
import { string, z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate } from '../plugins/authenticate';

export async function guessRoutes(fastify: FastifyInstance) {
  fastify.get('/guesses/count', async () => {
    const count = await prisma.guess.count();
    return { count };
  });

  fastify.post(
    '/pools/:poolId/games/:gameId/guesses',
    { onRequest: [authenticate] },
    async (request, reply) => {
      const createGuessBody = z.object({
        firstTeamPoints: z.number(),
        secondTeamPoints: z.number(),
      });

      const createGuessParams = z.object({
        poolId: string(),
        gameId: string(),
      });
      const { poolId, gameId } = createGuessParams.parse(request.params);
      const { firstTeamPoints, secondTeamPoints } = createGuessBody.parse(
        request.body
      );
      const participant = await prisma.participant.findUnique({
        where: {
          userId_poolId: {
            poolId,
            userId: request.user.sub,
          },
        },
      });
      if (!participant) {
        return reply.status(400).send({
          message: 'Não tem permissão para criar palpite neste bolão',
        });
      }
      const guess = await prisma.guess.findUnique({
        where: {
          participantsId_gameId: {
            participantsId: participant.id,
            gameId,
          },
        },
      });
      if (guess) {
        return reply.status(400).send({
          message: 'Já tem um palpite nesse bolão',
        });
      }
      const game = await prisma.game.findUnique({
        where: {
          id: gameId,
        },
      });
      if (!game) {
        return reply.status(400).send({
          message: 'Este jogo non exsiste',
        });
      }
      if (game.date < new Date()) {
        return reply.status(400).send({
          message: 'Este jogo já foi jogado',
        });
      }
      await prisma.guess.create({
        data: {
          gameId,
          participantsId: participant.id,
          firstTeamPoints,
          secoundTeamPoints: secondTeamPoints,
        },
      });
      return reply.status(200).send({
        gameId,
        firstTeamPoints,
        secondTeamPoints,
      });
    }
  );
}
