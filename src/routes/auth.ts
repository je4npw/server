import { FastifyInstance } from 'fastify';
import { string, z } from 'zod';
import { prisma } from '../lib/prisma';

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/users', async (request) => {
    const createUserBody = z.object({
      access_token: z.string(),
    });
    const { access_token } = createUserBody.parse(request.body);
    const userResponse = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const userData = await userResponse.json();
    const userinfoSchema = z.object({
      id: z.string(),
      email: z.string().email(),
      name: z.string(),
      picture: z.string().url(),
    });
    const userInfo = userinfoSchema.parse(userData);
    let user = await prisma.user.findUnique({
      where: {
        googleId: userInfo.id,
      },
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          googleId: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          avatarUrl: userInfo.picture,
        },
      });
    }
  });
}
