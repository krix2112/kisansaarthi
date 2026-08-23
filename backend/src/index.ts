import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { farmerRoutes } from './routes/farmers.js';
import { bookingRoutes } from './routes/bookings.js';
import { queueRoutes } from './routes/queue.js';
import { statusRoutes } from './routes/status.js';
import { staffRoutes } from './routes/staff.js';
import { paymentRoutes } from './routes/payments.js';
import { mandiRoutes } from './routes/mandis.js';
import { healthRoutes } from './routes/health.js';

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: '*',
});

app.register(farmerRoutes);
app.register(bookingRoutes);
app.register(queueRoutes);
app.register(statusRoutes);
app.register(staffRoutes);
app.register(paymentRoutes);
app.register(mandiRoutes);
app.register(healthRoutes);

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3001;
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`Backend Fastify server running on port ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

export { app };
export default app;
