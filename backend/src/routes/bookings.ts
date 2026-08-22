import { FastifyInstance } from 'fastify';

export async function bookingRoutes(fastify: FastifyInstance) {
  // POST /bookings
  fastify.post('/bookings', async (request, reply) => {
    // TODO: Implement slot booking creation logic with Supabase
    return { success: true, message: 'Booking creation stub', booking_id: 'stub-booking-id' };
  });
}
