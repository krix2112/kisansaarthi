'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

// Subscribes to a table and returns the live rows Supabase pushes to us.
// Fetches the initial snapshot once, then patches state as change events arrive –
// it never re-fetches the whole table on every event.
export function useRealtimeTable<T extends { id: string }>(
  table: string,
  initialQuery?: () => Promise<{ data: T[] | null; error: unknown }>
) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let isMounted = true;

    // 1. Load whatever's already in the table right now
    async function loadInitial() {
      try {
        const query = initialQuery
          ? await initialQuery()
          : await supabase.from(table).select('*');

        if (!isMounted) return;
        if (query.error) {
          setError(query.error);
        } else {
          setRows((query.data as T[]) ?? []);
        }
      } catch (err) {
        if (!isMounted) return;
        setError(err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadInitial();

    // 2. Subscribe to future changes on this table
    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        (payload) => {
          setRows((current) => {
            if (payload.eventType === 'INSERT') {
              return [...current, payload.new as T];
            }
            if (payload.eventType === 'UPDATE') {
              return current.map((row) =>
                row.id === (payload.new as T).id ? (payload.new as T) : row
              );
            }
            if (payload.eventType === 'DELETE') {
              return current.filter((row) => row.id !== (payload.old as T).id);
            }
            return current;
          });
        }
      )
      .subscribe();

    // 3. Clean up on unmount – otherwise you leak a socket connection every
    //    time this component re-renders/re-mounts
    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [table]);

  return { rows, setRows, loading, error };
}
