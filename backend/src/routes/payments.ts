import { FastifyInstance } from 'fastify';

export async function paymentRoutes(fastify: FastifyInstance) {
  // PATCH /payments/:id
  fastify.patch('/payments/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    // TODO: Update payment state (e.g. PROCESSING -> PAID) & trigger AgroChain proof
    return { success: true, payment_id: id, status: 'PAID' };
  });
}
