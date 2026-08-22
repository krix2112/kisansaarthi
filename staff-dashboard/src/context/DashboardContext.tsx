'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  FarmerRecord,
  INITIAL_RECORDS,
  Procurement,
  MANDI_PRICE_PER_QUINTAL,
} from '@/src/lib/mockData';
import { StatusVocabulary } from '@/components/StatusBadge';

// ─────────────────────────────────────────────
// Context shape
// ─────────────────────────────────────────────
interface DashboardContextValue {
  records: FarmerRecord[];
  currentToken: number; // the token currently being served at the window

  // Actions (swap internals for real API calls later)
  markArrived:   (bookingId: string) => void;
  callNext:      () => void;
  markProcured:  (bookingId: string, quantity: number, grade: 'A' | 'B' | 'C') => void;
  triggerPayment:(bookingId: string) => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

// ─────────────────────────────────────────────
// BroadcastChannel key for cross-tab sync
// ─────────────────────────────────────────────
const CHANNEL = 'kisansaarthi_staff';

interface BroadcastMsg {
  records: FarmerRecord[];
  currentToken: number;
}

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────
export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [records, setRecords] = useState<FarmerRecord[]>(INITIAL_RECORDS);
  const [currentToken, setCurrentToken] = useState<number>(
    // Start serving at the first IN_QUEUE token
    INITIAL_RECORDS.find(r => r.booking.status === 'IN_QUEUE')?.booking.token ?? 1
  );

  // BroadcastChannel for cross-tab sync
  const channelRef = useRef<BroadcastChannel | null>(null);
  const isBroadcasting = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ch = new BroadcastChannel(CHANNEL);
    channelRef.current = ch;

    ch.onmessage = (ev: MessageEvent<BroadcastMsg>) => {
      if (isBroadcasting.current) return;
      setRecords(ev.data.records);
      setCurrentToken(ev.data.currentToken);
    };

    return () => ch.close();
  }, []);

  // Broadcast helper — call after any state mutation
  const broadcast = useCallback(
    (nextRecords: FarmerRecord[], nextToken: number) => {
      if (!channelRef.current) return;
      isBroadcasting.current = true;
      channelRef.current.postMessage({ records: nextRecords, currentToken: nextToken } satisfies BroadcastMsg);
      setTimeout(() => { isBroadcasting.current = false; }, 50);
    },
    []
  );

  // ── helpers ──────────────────────────────
  function updateRecord(bookingId: string, patch: Partial<FarmerRecord>): FarmerRecord[] {
    return records.map(r =>
      r.booking.id === bookingId ? { ...r, ...patch } : r
    );
  }

  function updateBookingStatus(bookingId: string, status: StatusVocabulary): FarmerRecord[] {
    return records.map(r =>
      r.booking.id === bookingId
        ? { ...r, booking: { ...r.booking, status } }
        : r
    );
  }

  // ── actions ───────────────────────────────
  const markArrived = useCallback((bookingId: string) => {
    setRecords(prev => {
      const next = prev.map(r =>
        r.booking.id === bookingId
          ? { ...r, booking: { ...r.booking, status: 'IN_QUEUE' as StatusVocabulary } }
          : r
      );
      broadcast(next, currentToken);
      return next;
    });
  }, [broadcast, currentToken]);

  const callNext = useCallback(() => {
    setRecords(prev => {
      const queued = prev
        .filter(r => r.booking.status === 'IN_QUEUE')
        .sort((a, b) => a.booking.token - b.booking.token);

      if (!queued.length) return prev;
      const serving = queued[0];
      // still serving — already at window, nothing to advance
      const nextQueued = queued[1];
      const newToken = nextQueued?.booking.token ?? serving.booking.token;

      setCurrentToken(newToken);
      broadcast(prev, newToken);
      return prev;
    });
  }, [broadcast]);

  const markProcured = useCallback((bookingId: string, quantity: number, grade: 'A' | 'B' | 'C') => {
    setRecords(prev => {
      const procId = `P_${bookingId}`;
      const amount = quantity * MANDI_PRICE_PER_QUINTAL;
      const newProc: Procurement = {
        id: procId,
        booking_id: bookingId,
        quantity_quintals: quantity,
        quality_grade: grade,
        price_per_quintal: MANDI_PRICE_PER_QUINTAL,
        amount,
        status: 'COMPLETED',
      };
      const next = prev.map(r =>
        r.booking.id === bookingId
          ? {
              ...r,
              booking: { ...r.booking, status: 'PROCURED' as StatusVocabulary },
              procurement: newProc,
            }
          : r
      );
      broadcast(next, currentToken);
      return next;
    });
  }, [broadcast, currentToken]);

  const triggerPayment = useCallback((bookingId: string) => {
    // Immediately → PAYMENT_PROCESSING
    setRecords(prev => {
      const next = prev.map(r =>
        r.booking.id === bookingId
          ? {
              ...r,
              booking: { ...r.booking, status: 'PAYMENT_PROCESSING' as StatusVocabulary },
              payment: {
                id: `PAY_${bookingId}`,
                procurement_id: r.procurement?.id ?? '',
                status: 'PROCESSING' as const,
                updated_at: new Date().toISOString(),
              },
            }
          : r
      );
      broadcast(next, currentToken);
      return next;
    });

    // After 2.5 s → PAID
    setTimeout(() => {
      setRecords(prev => {
        const next = prev.map(r =>
          r.booking.id === bookingId
            ? {
                ...r,
                booking: { ...r.booking, status: 'PAID' as StatusVocabulary },
                payment: r.payment
                  ? { ...r.payment, status: 'PAID' as const, reference: `DBT${Date.now().toString().slice(-6)}`, updated_at: new Date().toISOString() }
                  : r.payment,
              }
            : r
        );
        broadcast(next, currentToken);
        return next;
      });
    }, 2500);
  }, [broadcast, currentToken]);

  const value: DashboardContextValue = {
    records,
    currentToken,
    markArrived,
    callNext,
    markProcured,
    triggerPayment,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

// ─────────────────────────────────────────────
// Per-resource hooks (swap internals for API later)
// ─────────────────────────────────────────────
export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used inside DashboardProvider');
  return ctx;
}

export function useFarmers() {
  const { records } = useDashboard();
  return records.map(r => r.farmer);
}

export function useQueue() {
  const { records, currentToken, callNext } = useDashboard();
  const queued = records
    .filter(r => r.booking.status === 'IN_QUEUE')
    .sort((a, b) => a.booking.token - b.booking.token);
  const serving = records.find(r => r.booking.token === currentToken) ?? queued[0];
  return { queued, serving, currentToken, callNext };
}

export function usePayments() {
  const { records, triggerPayment } = useDashboard();
  const payable = records.filter(r =>
    ['PROCURED', 'PAYMENT_PROCESSING', 'PAID'].includes(r.booking.status)
  );
  return { payable, triggerPayment };
}

export function useArrivals() {
  const { records, markArrived } = useDashboard();
  const booked = records.filter(r => r.booking.status === 'BOOKED');
  const arrived = records.filter(r => r.booking.status === 'ARRIVED');
  return { booked, arrived, markArrived };
}

export function useProcurement() {
  const { records, currentToken, markProcured } = useDashboard();
  const serving = records.find(r => r.booking.token === currentToken);
  return { serving, markProcured };
}
