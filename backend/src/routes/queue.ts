import { FastifyInstance } from 'fastify';
import { supabase, toApiError } from '../lib/supabase.js';

export async function queueRoutes(app: FastifyInstance) {
  // GET /farmers/:id/queue – a farmer's current queue position + ETA
  app.get('/farmers/:id/queue', async (request, reply) => {
    const { id } = request.params as { id: string };

    const { data, error } = await supabase
      .from('queue_events')
      .select('queue_position, queue_eta_minutes, event_type, created_at')
      .eq('farmer_id', id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(); // returns null instead of erroring if no rows yet

    if (error) {
      return reply.status(500).send(toApiError(error));
    }

    if (!data) {
      return reply.status(404).send({
        error: true,
        message: 'No queue record found for this farmer',
        code: 'NOT_IN_QUEUE',
      });
    }

    return reply.status(200).send(data);
  });
}

export default queueRoutes;
