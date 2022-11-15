import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example',
      googleId: '29387089123750912834709',
      avatarUrl: 'https://github.com/je4npw.png',
    },
  });
  const pool = await prisma.pool.create({
    data: {
      title: 'Example Pool',
      code: 'BOL123',
      ownerId: user.id,
      participants: {
        create: {
          userId: user.id,
        },
      },
    },
  });
  await prisma.game.create({
    data: {
      date: '2022-12-01T21:39:50.021Z',
      firstTeamCountryCode: 'AF',
      secoundTeamCountryCode: 'BO',
    },
  });
  await prisma.game.create({
    data: {
      date: '2022-12-02T21:39:50.021Z',
      firstTeamCountryCode: 'BR',
      secoundTeamCountryCode: 'AR',
      guesses: {
        create: {
          firstTeamPoints: 3,
          secoundTeamPoints: 1,
          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id,
              },
            },
          },
        },
      },
    },
  });
}
main();
