import { FastifyInstance } from 'fastify';

export async function staffRoutes(fastify: FastifyInstance) {
  // POST /staff/arrivals
  fastify.post('/staff/arrivals', async (request, reply) => {
    // TODO: Record farmer arrival at mandi by staff operator
    return { success: true, message: 'Arrival recorded stub', arrival_id: 'stub-arrival-id' };
  });

  // POST /staff/procurement
  fastify.post('/staff/procurement', async (request, reply) => {
    // TODO: Record procurement weight, quality grading & trigger AgroChain proof
    return { success: true, message: 'Procurement recorded stub', procurement_id: 'stub-procurement-id' };
  });
}
