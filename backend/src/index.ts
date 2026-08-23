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
import { fetchAndCachePrices } from './services/mandiPriceFeed.js';

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

    // Initial background prefetch from data.gov.in AGMARKNET
    fetchAndCachePrices({ limit: 50 }).catch((err) => {
      console.warn('Initial background price fetch notice:', err?.message || err);
    });

    // Scheduled background refresh every 2 hours
    setInterval(() => {
      console.log('Running scheduled data.gov.in price feed synchronization...');
      fetchAndCachePrices({ limit: 50 }).catch(console.error);
    }, 2 * 60 * 60 * 1000);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

export { app };
export default app;
