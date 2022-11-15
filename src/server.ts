import Fastify from "fastify"
import cors from "@fastify/cors"
import { PrismaClient } from "@prisma/client"
import { poolRoutes } from "./routes/pool"
import { userRoutes } from "./routes/user"
import { guessRoutes } from "./routes/guess"
import { gameRoutes } from "./routes/game"
import { authRoutes } from "./routes/auth"

interface Props {
  title: string
}
const prisma = new PrismaClient({
  log: ['query']
});

async function bootstrap() {
  const fastify = Fastify({
    logger: true
  })

  await fastify.register(cors, {
    origin: true,
  })

  await fastify.register(gameRoutes)
  await fastify.register(authRoutes)
  await fastify.register(poolRoutes)
  await fastify.register(guessRoutes)
  await fastify.register(userRoutes)
  await fastify.listen({ port: 3333, /*host: '0.0.0.0' */ })
}

bootstrap()