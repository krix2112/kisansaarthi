import { FastifyInstance } from 'fastify';
import { supabase, toApiError } from '../lib/supabase.js';

export async function farmerRoutes(app: FastifyInstance) {
  // POST /farmers – register a new farmer
  app.post('/farmers', async (request, reply) => {
    const { name, phone, preferred_mandi_id, crop, language } = (request.body || {}) as {
      name?: string;
      phone?: string;
      preferred_mandi_id?: string;
      crop?: string;
      language?: string;
    };

    if (!phone) {
      return reply.status(400).send({ error: true, message: 'phone is required', code: 'MISSING_PHONE' });
    }

    const { data, error } = await supabase
      .from('farmers')
      .insert({ name, phone, preferred_mandi_id, crop, language })
      .select()
      .single();

    if (error) {
      // unique violation on phone = farmer already registered
      const status = error.code === '23505' ? 409 : 500;
      return reply.status(status).send(toApiError(error));
    }

    return reply.status(201).send(data);
  });

  // GET /farmers/:id – fetch a single farmer record
  app.get('/farmers/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const { data, error } = await supabase
      .from('farmers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      const status = error.code === 'PGRST116' ? 404 : 500; // no rows found
      return reply.status(status).send(toApiError(error));
    }

    return reply.status(200).send(data);
  });
}

export const farmersRoutes = farmerRoutes;
export default farmerRoutes;
