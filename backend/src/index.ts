import Fastify from 'fastify';
import { farmerRoutes } from './routes/farmers.js';
import { bookingRoutes } from './routes/bookings.js';
import { queueRoutes } from './routes/queue.js';
import { statusRoutes } from './routes/status.js';
import { staffRoutes } from './routes/staff.js';
import { paymentRoutes } from './routes/payments.js';
import { mandiRoutes } from './routes/mandis.js';
import { healthRoutes } from './routes/health.js';

const fastify = Fastify({ logger: true });

fastify.register(farmerRoutes);
fastify.register(bookingRoutes);
fastify.register(queueRoutes);
fastify.register(statusRoutes);
fastify.register(staffRoutes);
fastify.register(paymentRoutes);
fastify.register(mandiRoutes);
fastify.register(healthRoutes);

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3001;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Backend Fastify server running on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
