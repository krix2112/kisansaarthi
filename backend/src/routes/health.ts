import { FastifyInstance } from 'fastify';

export async function healthRoutes(fastify: FastifyInstance) {
  // GET /health
  fastify.get('/health', async (request, reply) => {
    return { status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() };
  });
}

export default healthRoutes;
