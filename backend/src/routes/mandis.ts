import { FastifyInstance } from 'fastify';
import { supabase, toApiError } from '../lib/supabase.js';

export async function mandiRoutes(app: FastifyInstance) {
  // GET /mandis/:id/prices – latest cached price(s) for a mandi
  app.get('/mandis/:id/prices', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { crop } = (request.query || {}) as { crop?: string };

    let query = supabase
      .from('price_cache')
      .select('crop, price, price_date, fetched_at')
      .eq('mandi_id', id)
      .order('price_date', { ascending: false });

    if (crop) {
      query = query.eq('crop', crop);
    }

    const { data, error } = await query.limit(crop ? 1 : 20);

    if (error) {
      return reply.status(500).send(toApiError(error));
    }

    if (!data || data.length === 0) {
      return reply.status(404).send({
        error: true,
        message: 'No cached price data for this mandi',
        code: 'NO_PRICE_DATA',
      });
    }

    return reply.status(200).send(crop ? data[0] : data);
  });
}

export const mandisRoutes = mandiRoutes;
export default mandiRoutes;
