import { FastifyInstance } from 'fastify';
import { supabase, toApiError } from '../lib/supabase.js';

export async function staffRoutes(app: FastifyInstance) {
  // POST /staff/arrivals – staff marks a farmer as arrived, moves them into queue
  app.post('/staff/arrivals', async (request, reply) => {
    const { farmer_id, slot_id } = (request.body || {}) as {
      farmer_id?: string;
      slot_id?: string;
    };

    if (!farmer_id) {
      return reply.status(400).send({ error: true, message: 'farmer_id is required', code: 'MISSING_FARMER_ID' });
    }

    const { error: slotError } = slot_id
      ? await supabase.from('slots').update({ status: 'ARRIVED' }).eq('id', slot_id)
      : { error: null };

    if (slotError) {
      return reply.status(500).send(toApiError(slotError));
    }

    const { data, error } = await supabase
      .from('queue_events')
      .insert({
        farmer_id,
        slot_id,
        event_type: 'ARRIVED',
      })
      .select()
      .single();

    if (error) {
      return reply.status(500).send(toApiError(error));
    }

    return reply.status(201).send(data);
  });

  // POST /staff/procurement – staff logs a completed procurement
  app.post('/staff/procurement', async (request, reply) => {
    const { farmer_id, slot_id, mandi_id, quantity_kg, price_per_unit } = (request.body || {}) as {
      farmer_id?: string;
      slot_id?: string;
      mandi_id?: string;
      quantity_kg?: number;
      price_per_unit?: number;
    };

    if (!farmer_id || quantity_kg == null || price_per_unit == null) {
      return reply.status(400).send({
        error: true,
        message: 'farmer_id, quantity_kg, and price_per_unit are required',
        code: 'MISSING_FIELDS',
      });
    }

    const { data, error } = await supabase
      .from('procurements')
      .insert({
        farmer_id,
        slot_id,
        mandi_id,
        quantity_kg,
        price_per_unit,
        status: 'PROCURED',
        procured_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return reply.status(500).send(toApiError(error));
    }

    if (slot_id) {
      await supabase.from('slots').update({ status: 'PROCURED' }).eq('id', slot_id);
    }

    // NOTE: this is the PROCUREMENT_COMPLETED event the agrochain/ proof-builder
    // listens for (or gets called from) to hash + anchor on Shardeum.
    // If Krishna/Vansh haven't wired that trigger yet, flag it – this is the
    // exact point where your agrochain work plugs in.

    return reply.status(201).send(data);
  });
}

export default staffRoutes;
