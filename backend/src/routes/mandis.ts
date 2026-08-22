import { FastifyInstance } from 'fastify';

export async function mandiRoutes(fastify: FastifyInstance) {
  // GET /mandis/:id/prices
  fastify.get('/mandis/:id/prices', async (request, reply) => {
    const { id } = request.params as { id: string };
    // TODO: Fetch crop prices from cached Data.gov.in integration
    return { mandi_id: id, prices: [{ crop: 'Wheat', price_per_quintal: 2275, date: '2026-08-22' }] };
  });
}
