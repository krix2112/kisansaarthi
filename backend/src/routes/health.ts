import { FastifyInstance } from 'fastify';

export async function healthRoutes(fastify: FastifyInstance) {
  // GET /health
  fastify.get('/health', async (request, reply) => {
    // TODO: System health check status response
    return { status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() };
  });
}
