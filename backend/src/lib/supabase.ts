import { createClient } from '@supabase/supabase-js';

// SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY come from Settings → API in your Supabase project.
// service_role key = backend only. Never expose this in dashboard/app/frontend code.
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Standard error shape every route below uses, so the frontend/voice engine
// always gets a predictable error response instead of a raw Supabase error object.
export function toApiError(error: { message: string; code?: string }) {
  return {
    error: true,
    message: error.message,
    code: error.code ?? 'UNKNOWN',
  };
}
