import { FastifyInstance } from 'fastify';

export async function farmerRoutes(fastify: FastifyInstance) {
  // POST /farmers
  fastify.post('/farmers', async (request, reply) => {
    // TODO: Implement farmer creation logic with Supabase
    return { success: true, message: 'Farmer registration stub', farmer_id: 'stub-farmer-id' };
  });

  // GET /farmers/:id/queue
  fastify.get('/farmers/:id/queue', async (request, reply) => {
    const { id } = request.params as { id: string };
    // TODO: Fetch live queue position for farmer from Supabase
    return { farmer_id: id, queue_position: 1, queue_eta: '10:30 AM', status: 'IN_QUEUE' };
  });

  // GET /farmers/:id/status
  fastify.get('/farmers/:id/status', async (request, reply) => {
    const { id } = request.params as { id: string };
    // TODO: Fetch farmer status overview from Supabase
    return { farmer_id: id, status: 'BOOKED', latest_booking_id: 'stub-booking-id' };
  });
}
