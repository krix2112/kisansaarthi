import { FastifyInstance } from 'fastify';
import { supabase, toApiError } from '../lib/supabase.js';
import {
  fetchAndCachePrices,
  getAggregatePrices,
  getPriceHistory,
  getAvailableFilters,
} from '../services/mandiPriceFeed.js';

export async function mandiRoutes(app: FastifyInstance) {
  // GET /mandis/:id/prices – latest cached price(s) for a single mandi
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

  // GET /mandi-prices – aggregate market pricing and ticker data
  app.get('/mandi-prices', async (request, reply) => {
    const { commodity, state } = (request.query || {}) as {
      commodity?: string;
      state?: string;
    };

    try {
      const data = await getAggregatePrices({ commodity, state });
      return reply.status(200).send(data);
    } catch (err: any) {
      return reply.status(500).send({
        error: true,
        message: err?.message || 'Failed to retrieve aggregate mandi prices',
        code: 'PRICE_FEED_ERROR',
      });
    }
  });

  // GET /mandi-prices/history – time series for price momentum & volatility charts
  app.get('/mandi-prices/history', async (request, reply) => {
    const { commodity, state, days } = (request.query || {}) as {
      commodity?: string;
      state?: string;
      days?: string;
    };

    try {
      const daysCount = days ? parseInt(days, 10) : 30;
      const history = await getPriceHistory({
        commodity,
        state,
        days: isNaN(daysCount) ? 30 : daysCount,
      });
      return reply.status(200).send(history);
    } catch (err: any) {
      return reply.status(500).send({
        error: true,
        message: err?.message || 'Failed to retrieve mandi price history',
        code: 'HISTORY_FEED_ERROR',
      });
    }
  });

  // GET /mandi-prices/filters & GET /mandis/filters – dropdown options
  const filterHandler = async (request: any, reply: any) => {
    try {
      const filters = getAvailableFilters();
      return reply.status(200).send(filters);
    } catch (err: any) {
      return reply.status(500).send({
        error: true,
        message: err?.message || 'Failed to load filter options',
        code: 'FILTER_ERROR',
      });
    }
  };

  app.get('/mandi-prices/filters', filterHandler);
  app.get('/mandis/filters', filterHandler);

  // POST /mandi-prices/refresh – on-demand manual refresh from data.gov.in
  app.post('/mandi-prices/refresh', async (request, reply) => {
    const { commodity, state } = (request.body || {}) as {
      commodity?: string;
      state?: string;
    };

    try {
      const refreshed = await fetchAndCachePrices({ commodity, state, limit: 50 });
      return reply.status(200).send({
        success: true,
        count: refreshed.length,
        message: `Successfully synchronized ${refreshed.length} live mandi price records from data.gov.in`,
      });
    } catch (err: any) {
      return reply.status(500).send({
        error: true,
        message: err?.message || 'Failed to refresh mandi prices from data.gov.in',
        code: 'REFRESH_ERROR',
      });
    }
  });
}

export const mandisRoutes = mandiRoutes;
export default mandiRoutes;
