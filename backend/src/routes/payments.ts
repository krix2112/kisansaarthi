import { FastifyInstance } from 'fastify';
import { supabase, toApiError } from '../lib/supabase.js';

export async function paymentRoutes(app: FastifyInstance) {
  // PATCH /payments/:id – update a payment's status (e.g. PENDING -> PAID)
  app.patch('/payments/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { status, amount } = (request.body || {}) as { status?: string; amount?: number };

    if (!status) {
      return reply.status(400).send({ error: true, message: 'status is required', code: 'MISSING_STATUS' });
    }

    const updates: Record<string, unknown> = { status };
    if (amount != null) updates.amount = amount;
    if (status === 'PAID') updates.paid_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('payments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      const httpStatus = error.code === 'PGRST116' ? 404 : 500;
      return reply.status(httpStatus).send(toApiError(error));
    }

    // NOTE: PAYMENT_CONFIRMED is the other event the agrochain/ proof-builder
    // hashes + anchors – same plug-in point as procurement completion above.

    return reply.status(200).send(data);
  });
}

export const paymentsRoutes = paymentRoutes;
export default paymentRoutes;
