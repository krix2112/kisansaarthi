'use client';

import { useEffect, useState } from 'react';

export function resolveApiPath(path: string): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const isCloudOrVercel =
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1';

  // For /mandi-prices endpoints, if on Vercel or if apiUrl is localhost, use internal /api/mandi-prices
  if (path.startsWith('/mandi-prices')) {
    if (isCloudOrVercel || !apiUrl || apiUrl.includes('localhost')) {
      return `/api${path}`;
    }
  }

  // If explicit cloud external API URL provided
  if (apiUrl && !apiUrl.includes('localhost')) {
    return `${apiUrl}${path}`;
  }

  // Default internal route for mandi prices
  if (path.startsWith('/mandi-prices')) {
    return `/api${path}`;
  }

  return `${apiUrl || 'http://localhost:3001'}${path}`;
}

// Fetches once from a backend endpoint and gives back { data, loading, error }
export function useApiData<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const targetUrl = resolveApiPath(path);
        let res = await fetch(targetUrl);

        // Fallback to internal /api if external failed and path is mandi-prices
        if (!res.ok && path.startsWith('/mandi-prices') && !targetUrl.startsWith('/api')) {
          res = await fetch(`/api${path}`);
        }

        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }
        const json = await res.json();
        if (isMounted) setData(json);
      } catch (err) {
        // Fallback attempt to internal /api/mandi-prices
        if (path.startsWith('/mandi-prices')) {
          try {
            const fallbackRes = await fetch(`/api${path}`);
            if (fallbackRes.ok) {
              const fallbackJson = await fallbackRes.json();
              if (isMounted) {
                setData(fallbackJson);
                setLoading(false);
                return;
              }
            }
          } catch {
            // Ignore fallback error
          }
        }
        if (isMounted) setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [path]);

  return { data, loading, error };
}
