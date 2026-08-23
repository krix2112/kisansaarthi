import { createClient } from '@supabase/supabase-js';

// Polyfill WebSocket constructor for Node runtime if not present
if (typeof (globalThis as any).WebSocket === 'undefined') {
  (globalThis as any).WebSocket = class MockWebSocket {
    static readonly CONNECTING = 0;
    static readonly OPEN = 1;
    static readonly CLOSING = 2;
    static readonly CLOSED = 3;
    readyState = 3;
    constructor() {}
    addEventListener() {}
    removeEventListener() {}
    send() {}
    close() {}
  };
}

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://vjvikglucrvqoputxggp.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy_key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Standard error shape every route uses
export function toApiError(error: { message: string; code?: string }) {
  return {
    error: true,
    message: error.message,
    code: error.code ?? 'UNKNOWN',
  };
}
