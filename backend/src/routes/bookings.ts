import { FastifyInstance } from 'fastify';
import { supabase, toApiError } from '../lib/supabase.js';

export async function bookingRoutes(app: FastifyInstance) {
  // POST /bookings – create a booking for a farmer against a slot
  app.post('/bookings', async (request, reply) => {
    const { farmer_id, slot_id } = (request.body || {}) as {
      farmer_id?: string;
      slot_id?: string;
    };

    if (!farmer_id || !slot_id) {
      return reply.status(400).send({
        error: true,
        message: 'farmer_id and slot_id are required',
        code: 'MISSING_FIELDS',
      });
    }

    // Confirm the slot exists and isn't already booked before creating the booking
    const { data: slot, error: slotError } = await supabase
      .from('slots')
      .select('id, status')
      .eq('id', slot_id)
      .single();

    if (slotError) {
      const status = slotError.code === 'PGRST116' ? 404 : 500;
      return reply.status(status).send(toApiError(slotError));
    }

    if (slot && slot.status && slot.status === 'BOOKED') {
      return reply.status(409).send({
        error: true,
        message: 'Slot is already booked',
        code: 'SLOT_ALREADY_BOOKED',
      });
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert({ farmer_id, slot_id, status: 'BOOKED' })
      .select()
      .single();

    if (error) {
      return reply.status(500).send(toApiError(error));
    }

    // keep the slot row in sync with the booking
    await supabase.from('slots').update({ status: 'BOOKED' }).eq('id', slot_id);

    return reply.status(201).send(data);
  });
}

export const bookingsRoutes = bookingRoutes;
export default bookingRoutes;
