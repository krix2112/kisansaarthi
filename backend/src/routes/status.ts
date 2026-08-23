import { FastifyInstance } from 'fastify';
import { supabase, toApiError } from '../lib/supabase.js';

export async function statusRoutes(app: FastifyInstance) {
  // GET /farmers/:id/status – combined procurement + payment status
  app.get('/farmers/:id/status', async (request, reply) => {
    const { id } = request.params as { id: string };

    const { data: procurement, error: procError } = await supabase
      .from('procurements')
      .select('id, status, quantity_kg, price_per_unit, procured_at')
      .eq('farmer_id', id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (procError) {
      return reply.status(500).send(toApiError(procError));
    }

    let payment = null;
    if (procurement) {
      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .select('status, amount, paid_at')
        .eq('procurement_id', procurement.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (paymentError) {
        return reply.status(500).send(toApiError(paymentError));
      }
      payment = paymentData;
    }

    return reply.status(200).send({
      procurement_status: procurement?.status ?? 'NOT_STARTED',
      procurement,
      payment_status: payment?.status ?? 'NOT_STARTED',
      payment,
    });
  });
}

export default statusRoutes;
