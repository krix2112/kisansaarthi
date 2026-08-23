'use client';
import { useState, useEffect, useMemo } from "react";
import { useRealtimeTable } from "../hooks/useRealtimeTable";
import { useApiData } from "../hooks/useApiData";

type NavId = "today" | "queue" | "arrivals" | "procurement" | "payments" | "prices" | "settings";

// --- State Models ---
type Farmer = { token: string; name: string; village?: string; crop: string; qty: number; grade: string; amount: number; status: string; eta?: string };

interface QueueEventRow {
  id: string;
  farmer_id?: string;
  slot_id?: string;
  queue_position?: number | null;
  queue_eta_minutes?: number | null;
  event_type?: string;
  created_at?: string;
}

interface BookingRow {
  id: string;
  farmer_id?: string;
  slot_id?: string;
  status?: string;
  created_at?: string;
}

interface ProcurementRow {
  id: string;
  farmer_id?: string;
  slot_id?: string;
  mandi_id?: string;
  quantity_kg?: number;
  price_per_unit?: number;
  status?: string;
  procured_at?: string;
  created_at?: string;
}

interface PaymentRow {
  id: string;
  procurement_id?: string;
  amount?: number;
  status?: string;
  paid_at?: string;
  created_at?: string;
}

const INITIAL_WAITING = [
  { token: "T-048", name: "Ramesh Yadav", village: "Hoshangabad", crop: "Wheat", eta: "~5 min" },
  { token: "T-049", name: "Sunita Devi", village: "Betul", crop: "Soybean", eta: "~11 min" },
  { token: "T-050", name: "Mohan Patel", village: "Narsinghpur", crop: "Wheat", eta: "~17 min" },
  { token: "T-051", name: "Kavita Verma", village: "Raisen", crop: "Maize", eta: "~23 min" },
];

const INITIAL_LEDGER = [
  { token: "T-041", name: "Ramesh Yadav", crop: "Wheat", qty: 42, grade: "A", amount: 98700, status: "Completed" },
  { token: "T-042", name: "Sunita Devi", crop: "Soybean", qty: 28, grade: "B", amount: 58800, status: "Completed" },
  { token: "T-043", name: "Mohan Patel", crop: "Wheat", qty: 65, grade: "A", amount: 152750, status: "Pending" },
  { token: "T-044", name: "Kavita Verma", crop: "Maize", qty: 33, grade: "B", amount: 69300, status: "Processing" },
  { token: "T-045", name: "Suresh Rawat", crop: "Wheat", qty: 51, grade: "C", amount: 94350, status: "Completed" },
];

const INITIAL_ARRIVALS = [
  { token: "T-052", name: "Govind Singh", village: "Sehore", time: "14:45", status: "Expected" },
  { token: "T-053", name: "Lata Bai", village: "Ashta", time: "15:10", status: "Expected" },
];

const MSP: Record<string, number> = { A: 2350, B: 2100, C: 1850 };

// ── Icons ────────────────────────────────────────────────────────────────────
const IconToday = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
const IconQueue = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><circle cx="3" cy="6" r="1" fill="currentColor" /><circle cx="3" cy="12" r="1" fill="currentColor" /><circle cx="3" cy="18" r="1" fill="currentColor" /></svg>;
const IconArrivals = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const IconProcure = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>;
const IconPayments = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>;
const IconPrices = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
const IconSettings = () => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const IconWheat = () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V12" /><path d="M12 12c0-4 4-8 4-8s0 4-4 4" /><path d="M12 12c0-4-4-8-4-8s0 4 4 4" /><path d="M12 17c0-3 3-5 3-5s0 3-3 3" /><path d="M12 17c0-3-3-5-3-5s0 3 3 3" /></svg>;

const NAV: { id: NavId; label: string; icon: React.ReactNode }[] = [
  { id: "today", label: "Today", icon: <IconToday /> },
  { id: "queue", label: "Live Queue", icon: <IconQueue /> },
  { id: "arrivals", label: "Arrivals", icon: <IconArrivals /> },
  { id: "procurement", label: "Procurement", icon: <IconProcure /> },
  { id: "payments", label: "Payments", icon: <IconPayments /> },
  { id: "prices", label: "Mandi Prices", icon: <IconPrices /> },
  { id: "settings", label: "Settings", icon: <IconSettings /> },
];

function StatusChip({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Completed: "bg-green-50 text-green-700 border-green-500/30 dark:bg-green-900/30 dark:text-green-400 dark:border-green-500/30",
    Paid: "bg-green-50 text-green-700 border-green-500/30 dark:bg-green-900/30 dark:text-green-400 dark:border-green-500/30",
    Pending: "bg-amber-50 text-amber-700 border-amber-500/30 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-500/30",
    Processing: "bg-blue-50 text-blue-700 border-blue-500/30 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-500/30",
    Expected: "bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600",
    Arrived: "bg-blue-50 text-blue-700 border-blue-500/30 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-500/30",
  };
  const dots: Record<string, string> = {
    Completed: "bg-green-500", Paid: "bg-green-500", Pending: "bg-amber-500", Processing: "bg-blue-500", Expected: "bg-slate-400", Arrived: "bg-blue-500"
  };
  
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-2.5 py-0.5 border ${styles[status] || styles.Pending}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status] || dots.Pending}`} />
      {status}
    </span>
  );
}

// ── Main App Component ────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState<NavId>("today");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [currentTime, setCurrentTime] = useState<string>("");
  
  const [waiting, setWaiting] = useState(INITIAL_WAITING);
  const [ledger, setLedger] = useState<Farmer[]>(INITIAL_LEDGER);
  const [arrivals, setArrivals] = useState(INITIAL_ARRIVALS);
  const [serving, setServing] = useState({ token: "T-047", name: "Dinesh Kumar", village: "Sehore", crop: "Wheat" });
  
  // Real-time live clock updating every second
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      setCurrentTime(`${dateStr}, ${timeStr} IST`);
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Real-time Supabase table hooks
  const { rows: realtimeQueue } = useRealtimeTable<QueueEventRow>('queue_events');
  const { rows: realtimeBookings } = useRealtimeTable<BookingRow>('bookings');
  const { rows: realtimeProcurements } = useRealtimeTable<ProcurementRow>('procurements');
  const { rows: realtimePayments } = useRealtimeTable<PaymentRow>('payments');

  // Sync realtime queue events
  useEffect(() => {
    if (realtimeQueue && realtimeQueue.length > 0) {
      const mapped = realtimeQueue.map((item, idx) => ({
        token: `T-${(item.queue_position ?? idx + 1).toString().padStart(3, '0')}`,
        name: `Farmer ${item.farmer_id ? item.farmer_id.slice(0, 6) : 'Registered'}`,
        village: 'Sehore',
        crop: 'Wheat',
        eta: item.queue_eta_minutes ? `~${item.queue_eta_minutes} min` : '~5 min'
      }));
      setWaiting(mapped);
      if (mapped.length > 0 && serving.token === "T-047") {
        setServing({ token: mapped[0].token, name: mapped[0].name, village: mapped[0].village, crop: mapped[0].crop });
      }
    }
  }, [realtimeQueue]);

  // Sync realtime bookings to arrivals
  useEffect(() => {
    if (realtimeBookings && realtimeBookings.length > 0) {
      const mapped = realtimeBookings.map((b, idx) => ({
        token: `T-${(idx + 52).toString().padStart(3, '0')}`,
        name: `Farmer ${b.farmer_id ? b.farmer_id.slice(0, 6) : 'Registered'}`,
        village: 'Sehore',
        time: b.created_at ? new Date(b.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '15:00',
        status: b.status === 'ARRIVED' ? 'Arrived' : 'Expected'
      }));
      setArrivals(mapped);
    }
  }, [realtimeBookings]);

  // Sync realtime procurements & payments to ledger
  useEffect(() => {
    if (realtimeProcurements && realtimeProcurements.length > 0) {
      const mapped = realtimeProcurements.map((p, idx) => {
        const matchingPayment = realtimePayments.find(pay => pay.procurement_id === p.id);
        const qty = p.quantity_kg ? Number((p.quantity_kg / 100).toFixed(1)) : 40;
        const rate = p.price_per_unit ?? 2350;
        const amount = matchingPayment?.amount ?? (qty * rate);
        const status = matchingPayment?.status === 'PAID' ? 'Paid' : (p.status === 'PROCURED' ? 'Completed' : 'Pending');
        return {
          token: `T-${(idx + 41).toString().padStart(3, '0')}`,
          name: `Farmer ${p.farmer_id ? p.farmer_id.slice(0, 6) : 'Registered'}`,
          crop: 'Wheat',
          qty,
          grade: 'A',
          amount,
          status
        };
      });
      setLedger(mapped);
    }
  }, [realtimeProcurements, realtimePayments]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleCallNext = () => {
    if (waiting.length === 0) return;
    const next = waiting[0];
    setServing({ token: next.token, name: next.name, village: next.village, crop: next.crop });
    setWaiting(waiting.slice(1));
  };

  const handleProcure = (qty: number, grade: string) => {
    const amount = qty * MSP[grade];
    const newEntry = { token: serving.token, name: serving.name, crop: serving.crop, qty, grade, amount, status: "Pending" };
    setLedger([newEntry, ...ledger]);
  };

  const handleMarkArrived = (token: string) => {
    setArrivals(arrivals.map(a => a.token === token ? { ...a, status: "Arrived" } : a));
    const newlyArrived = arrivals.find(a => a.token === token);
    if (newlyArrived) {
      setWaiting([...waiting, { token: newlyArrived.token, name: newlyArrived.name, village: newlyArrived.village, crop: "Mixed", eta: "Just arrived" }]);
    }
  };

  const handleTriggerPayment = (token: string) => {
    setLedger(ledger.map(l => l.token === token ? { ...l, status: "Processing" } : l));
    setTimeout(() => {
      setLedger(prev => prev.map(l => l.token === token ? { ...l, status: "Paid" } : l));
    }, 2000);
  };

  const SCREEN_META: Record<NavId, { title: string; sub: string }> = {
    today: { title: "Today's Overview", sub: "Mandal: Sehore · District: Bhopal · 23 August 2026" },
    queue: { title: "Live Queue", sub: "Real-time token management · Sehore Mandi" },
    arrivals: { title: "Arrivals", sub: "Farmer arrival log · 23 August 2026" },
    procurement: { title: "Procurement Entry", sub: "Record crop purchase details for the current token" },
    payments: { title: "Payments & DBT", sub: "Direct benefit transfer status · Season 2025–26" },
    prices: { title: "Mandi Prices", sub: "Live MSP and market rates" },
    settings: { title: "Settings", sub: "System preferences and configurations" },
  };

  const meta = SCREEN_META[active];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Sidebar */}
      <aside className="w-[232px] shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full z-10 transition-colors">
        <div className="p-5 pb-4 border-b border-slate-100 dark:border-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-[34px] h-[34px] rounded-lg bg-blue-900 text-white flex items-center justify-center shrink-0">
              <IconWheat />
            </div>
            <div>
              <div className="font-bold text-[14px] text-slate-900 dark:text-white tracking-tight">KisanSaarthi</div>
              <div className="text-[11px] text-slate-400 font-medium mt-0.5">MP Agri Portal</div>
            </div>
          </div>
        </div>

        <div className="p-3 pb-2">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2.5 border border-blue-100 dark:border-blue-900/50">
            <div className="text-[10px] font-semibold text-blue-800 dark:text-blue-400 uppercase tracking-widest">Mandal</div>
            <div className="text-[13px] font-medium text-blue-950 dark:text-blue-300 mt-0.5">Sehore, MP</div>
            <div className="text-[11px] text-blue-500 dark:text-blue-500/80 mt-0.5">Season 2025–26</div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2 pt-2 pb-1">Menu</div>
          {NAV.map(({ id, label, icon }) => {
            const isActive = active === id;
            return (
              <button key={id} onClick={() => setActive(id)}
                className={`flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg mb-0.5 border-none cursor-pointer text-[13.5px] transition-colors
                  ${isActive ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-400 font-semibold' : 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 font-normal'}
                `}>
                <span className={`shrink-0 ${isActive ? 'text-blue-800 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>{icon}</span>
                {label}
                {id === "queue" && waiting.length > 0 && (
                  <span className="ml-auto bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-500 text-[11px] font-bold rounded-full px-1.5 py-0.5 border border-amber-200 dark:border-amber-700/50">
                    {waiting.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-100 dark:border-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/40 border border-blue-100 dark:border-blue-800 flex items-center justify-center text-[13px] font-bold text-blue-900 dark:text-blue-400 shrink-0">
              R
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-slate-900 dark:text-slate-200 truncate">Rajesh Kumar</div>
              <div className="text-[11px] text-slate-500">Mandi Operator</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-7 py-3.5 flex items-center justify-between shrink-0 transition-colors">
          <div>
            <h1 className="m-0 text-[17px] font-bold text-slate-900 dark:text-white tracking-tight">{meta.title}</h1>
            <p className="m-0 text-[12.5px] text-slate-500 dark:text-slate-400 mt-0.5">{meta.sub}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-500 animate-pulse"></span>
              <span className="text-[12px] font-semibold text-green-700 dark:text-green-400">
                {realtimeQueue.length > 0 || realtimeBookings.length > 0 || realtimeProcurements.length > 0 ? "Supabase Realtime Live" : "System Live"}
              </span>
            </div>
            <div className="text-[12px] font-mono text-slate-600 dark:text-slate-300 px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 tabular-nums">
              {currentTime || '23 Aug 2026, 22:27:02 IST'}
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-7">
          {active === "today" && <TodayScreen ledger={ledger} queueLength={waiting.length} />}
          {active === "queue" && <QueueScreen waiting={waiting} serving={serving} onCallNext={handleCallNext} />}
          {active === "procurement" && <ProcurementScreen serving={serving} onProcure={handleProcure} recent={ledger.slice(0, 4)} />}
          {active === "arrivals" && <ArrivalsScreen arrivals={arrivals} onArrive={handleMarkArrived} />}
          {active === "payments" && <PaymentsScreen ledger={ledger} onPay={handleTriggerPayment} />}
          {active === "prices" && <PricesScreen />}
          {active === "settings" && <SettingsScreen theme={theme} setTheme={setTheme} />}
        </main>
      </div>
    </div>
  );
}

// ── Screens ──────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, colorClass }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm transition-colors">
      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</div>
      <div className="text-[28px] font-bold text-slate-900 dark:text-white mt-1.5 tracking-tight leading-none">{value}</div>
      <div className={`text-xs mt-1.5 font-medium ${colorClass}`}>{sub}</div>
    </div>
  );
}

function TodayScreen({ ledger, queueLength }: any) {
  const completed = ledger.filter((l: any) => l.status === "Completed" || l.status === "Paid").length;
  const pendingAmt = ledger.filter((l: any) => l.status === "Pending").reduce((acc: number, l: any) => acc + l.amount, 0);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total Farmers" value="284" sub="↑ 18 from yesterday" colorClass="text-green-600 dark:text-green-400" />
        <StatCard label="In Queue" value={queueLength.toString()} sub="Avg. 6.4 min / farmer" colorClass="text-blue-700 dark:text-blue-400" />
        <StatCard label="Completed" value={completed.toString()} sub={`${(completed/284*100).toFixed(1)}% of daily target`} colorClass="text-green-600 dark:text-green-400" />
        <StatCard label="Pending Payment" value={`₹${(pendingAmt/100000).toFixed(1)}L`} sub="Awaiting DBT" colorClass="text-amber-600 dark:text-amber-500" />
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden transition-colors">
        <div className="p-4 px-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="font-semibold text-[14px] text-slate-900 dark:text-white">Procurement Ledger</div>
            <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">Recent transactions — 23 Aug 2026</div>
          </div>
          <button className="text-xs font-medium text-blue-900 dark:text-blue-400 px-3 py-1.5 border border-blue-200 dark:border-blue-900/50 rounded-md bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">View All →</button>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50">
              {["Token", "Farmer", "Crop", "Qty (q)", "Grade", "Amount", "Status"].map((h) => (
                <th key={h} className="text-left py-2.5 px-5 text-[11.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ledger.map((r: any, i: number) => (
              <tr key={i} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${i < ledger.length - 1 ? 'border-b border-slate-50 dark:border-slate-800/50' : ''}`}>
                <td className="py-3 px-5 text-[13px] font-semibold text-blue-900 dark:text-blue-400 tabular-nums">{r.token}</td>
                <td className="py-3 px-5 text-[13px] font-medium text-slate-900 dark:text-slate-200">{r.name}</td>
                <td className="py-3 px-5 text-[13px] text-slate-600 dark:text-slate-400">{r.crop}</td>
                <td className="py-3 px-5 text-[13px] text-slate-600 dark:text-slate-400 tabular-nums">{r.qty}</td>
                <td className="py-3 px-5">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded
                    ${r.grade === 'A' ? 'text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-900/30' : r.grade === 'B' ? 'text-amber-800 bg-amber-50 dark:text-amber-500 dark:bg-amber-900/30' : 'text-purple-700 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/30'}
                  `}>{r.grade}</span>
                </td>
                <td className="py-3 px-5 text-[13px] font-semibold text-slate-900 dark:text-slate-200 tabular-nums">₹{r.amount.toLocaleString("en-IN")}</td>
                <td className="py-3 px-5"><StatusChip status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function QueueScreen({ waiting, serving, onCallNext }: any) {
  return (
    <div className="grid grid-cols-[1fr_340px] gap-4 items-start">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm transition-colors">
        <div className="p-4 px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="font-semibold text-[14px] text-slate-900 dark:text-white">Currently Serving</div>
          <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-600"></span><span className="text-xs font-medium text-green-700 dark:text-green-400">Live</span></div>
        </div>
        <div className="p-8 px-6">
          <div className="bg-slate-50 dark:bg-slate-800 border-2 border-blue-900 dark:border-blue-500 rounded-xl p-7 text-center mb-6">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-[0.08em] mb-2">Token Number</div>
            <div className="text-[64px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">{serving.token}</div>
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="text-lg font-semibold text-slate-900 dark:text-white">{serving.name}</div>
              <div className="text-[14px] text-slate-500 dark:text-slate-400 mt-1">Village: {serving.village} · Crop: {serving.crop}</div>
            </div>
          </div>
          
          <button onClick={onCallNext} disabled={waiting.length === 0}
            className={`w-full p-3 rounded-lg text-[14px] font-semibold transition-all ${waiting.length > 0 ? 'bg-blue-900 hover:bg-blue-800 text-white shadow' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'}`}>
            ✓ Mark Complete & Call Next
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm transition-colors">
        <div className="p-4 px-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="font-semibold text-[14px] text-slate-900 dark:text-white">Waiting Queue</div>
          <span className="text-[11px] font-bold bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-500 border border-amber-200 dark:border-amber-700/50 rounded-full px-2 py-0.5">{waiting.length} waiting</span>
        </div>
        <div className="overflow-y-auto max-h-[420px]">
          {waiting.map((w: any, i: number) => (
            <div key={w.token} className={`p-3.5 px-5 flex items-center gap-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${i < waiting.length - 1 ? 'border-b border-slate-50 dark:border-slate-800/50' : ''}`}>
              <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold tabular-nums border ${i === 0 ? 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400' : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500'}`}>{i + 1}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-blue-900 dark:text-blue-400 tabular-nums">{w.token}</span>
                  {i === 0 && <span className="text-[10px] font-semibold bg-blue-50 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded px-1 border border-blue-200 dark:border-blue-800">Next</span>}
                </div>
                <div className="text-[13px] font-medium text-slate-900 dark:text-slate-200 mt-0.5">{w.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{w.village}</div>
              </div>
            </div>
          ))}
          {waiting.length === 0 && <div className="p-8 text-center text-sm text-slate-500">Queue is empty</div>}
        </div>
      </div>
    </div>
  );
}

function ProcurementScreen({ serving, onProcure, recent }: any) {
  const [qty, setQty] = useState("");
  const [grade, setGrade] = useState<"A" | "B" | "C" | "">("");
  const [submitted, setSubmitted] = useState(false);

  const numQty = parseFloat(qty) || 0;
  const rate = grade ? MSP[grade] : 0;
  const estimated = numQty * rate;
  const hasValues = numQty > 0 && grade !== "";

  function handleSubmit() {
    if (!hasValues) return;
    setSubmitted(true);
    onProcure(numQty, grade);
    setTimeout(() => { setSubmitted(false); setQty(""); setGrade(""); }, 1500);
  }

  return (
    <div className="grid grid-cols-[1fr_360px] gap-4 items-start">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm transition-colors">
        <div className="p-4 px-6 border-b border-slate-100 dark:border-slate-800">
          <div className="font-semibold text-[14px] text-slate-900 dark:text-white">Procurement Entry</div>
          <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">{serving.token} · {serving.name}</div>
        </div>
        <div className="p-6">
          <div className="mb-5">
            <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Quantity (Quintals)</label>
            <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="e.g., 50"
              className="w-full p-2.5 px-3.5 border border-slate-300 dark:border-slate-700 rounded-lg text-[15px] font-medium text-slate-900 dark:text-white bg-white dark:bg-slate-950 focus:border-blue-900 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-900/10 dark:focus:ring-blue-500/20 outline-none transition-all" />
          </div>
          <div className="mb-6">
            <label className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-2">Quality Grade</label>
            <div className="grid grid-cols-3 gap-2.5">
              {(["A", "B", "C"] as const).map((g) => (
                <button key={g} onClick={() => setGrade(g)}
                  className={`p-3.5 rounded-lg border text-center transition-all ${grade === g ? 'bg-blue-50 border-blue-400 dark:bg-blue-900/30 dark:border-blue-500' : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                  <div className={`text-2xl font-extrabold ${grade === g ? 'text-blue-900 dark:text-blue-400' : 'text-slate-400'}`}>{g}</div>
                  <div className={`text-xs font-semibold mt-1 ${grade === g ? 'text-blue-700 dark:text-blue-300' : 'text-slate-300 dark:text-slate-500'}`}>₹{MSP[g]}/q</div>
                </button>
              ))}
            </div>
          </div>
          
          <div className={`rounded-lg p-3.5 px-4 mb-5 transition-all border ${hasValues ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-700/50' : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700'}`}>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Estimated Amount</div>
            <div className={`text-[28px] font-extrabold tabular-nums leading-none ${hasValues ? 'text-amber-800 dark:text-amber-500' : 'text-slate-300 dark:text-slate-600'}`}>{hasValues ? `₹${estimated.toLocaleString("en-IN")}` : "₹ —"}</div>
          </div>
          
          <button onClick={handleSubmit} disabled={!hasValues}
            className={`w-full p-3 rounded-lg text-[15px] font-semibold transition-all ${submitted ? 'bg-green-600 text-white' : hasValues ? 'bg-blue-900 hover:bg-blue-800 text-white shadow' : 'bg-slate-400 dark:bg-slate-700 text-white cursor-not-allowed'}`}>
            {submitted ? "✓ Submitted Successfully" : "Submit Procurement"}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm transition-colors">
        <div className="p-4 px-5 border-b border-slate-100 dark:border-slate-800">
          <div className="font-semibold text-[14px] text-slate-900 dark:text-white">Recent Entries</div>
        </div>
        {recent.map((r: any, i: number) => (
          <div key={i} className="p-3 px-5 border-b border-slate-50 dark:border-slate-800/50 flex justify-between items-start">
            <div>
              <div className="text-[13px] font-semibold text-slate-900 dark:text-white">{r.name}</div>
              <div className="text-[12px] text-slate-500 mt-0.5">{r.token} · {r.qty}q</div>
            </div>
            <div className="text-right">
              <div className="text-[13px] font-bold text-slate-900 dark:text-white">₹{r.amount.toLocaleString()}</div>
              <StatusChip status={r.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArrivalsScreen({ arrivals, onArrive }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden transition-colors">
      <div className="p-4 px-5 border-b border-slate-100 dark:border-slate-800">
        <div className="font-semibold text-[14px] text-slate-900 dark:text-white">Expected Arrivals</div>
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800/50 text-left text-[11.5px] font-semibold text-slate-500 uppercase tracking-wider">
            <th className="py-2.5 px-5">Token</th><th className="py-2.5 px-5">Farmer</th><th className="py-2.5 px-5">Expected Time</th><th className="py-2.5 px-5">Status</th><th className="py-2.5 px-5 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {arrivals.map((a: any) => (
            <tr key={a.token} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <td className="py-3 px-5 text-[13px] font-bold text-blue-900 dark:text-blue-400">{a.token}</td>
              <td className="py-3 px-5 text-[13px] text-slate-900 dark:text-slate-200">{a.name} ({a.village})</td>
              <td className="py-3 px-5 text-[13px] text-slate-600 dark:text-slate-400">{a.time}</td>
              <td className="py-3 px-5"><StatusChip status={a.status} /></td>
              <td className="py-3 px-5 text-right">
                {a.status === "Expected" && (
                  <button onClick={() => onArrive(a.token)} className="text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800 px-3 py-1.5 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50">
                    Mark Arrived
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PaymentsScreen({ ledger, onPay }: any) {
  const pending = ledger.filter((l:any) => l.status === "Pending" || l.status === "Processing" || l.status === "Paid");
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden transition-colors">
      <div className="p-4 px-5 border-b border-slate-100 dark:border-slate-800">
        <div className="font-semibold text-[14px] text-slate-900 dark:text-white">Pending DBT Transfers</div>
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800/50 text-left text-[11.5px] font-semibold text-slate-500 uppercase tracking-wider">
            <th className="py-2.5 px-5">Token</th><th className="py-2.5 px-5">Farmer</th><th className="py-2.5 px-5">Amount</th><th className="py-2.5 px-5">Status</th><th className="py-2.5 px-5 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {pending.map((p: any) => (
            <tr key={p.token} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <td className="py-3 px-5 text-[13px] font-bold text-slate-900 dark:text-slate-200">{p.token}</td>
              <td className="py-3 px-5 text-[13px] text-slate-900 dark:text-slate-200">{p.name}</td>
              <td className="py-3 px-5 text-[13px] font-bold text-slate-900 dark:text-slate-200">₹{p.amount.toLocaleString()}</td>
              <td className="py-3 px-5"><StatusChip status={p.status} /></td>
              <td className="py-3 px-5 text-right">
                {p.status === "Pending" && (
                  <button onClick={() => onPay(p.token)} className="text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800 px-3 py-1.5 rounded hover:bg-amber-100 dark:hover:bg-amber-900/50">
                    Trigger DBT
                  </button>
                )}
                {p.status === "Processing" && <span className="text-xs text-blue-500 font-semibold animate-pulse">Processing...</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PricesScreen() {
  const [selectedCommodity, setSelectedCommodity] = useState<string>('Wheat');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);

  const { data: filtersData } = useApiData<{ commodities: string[]; states: string[] }>('/mandi-prices/filters');

  const apiPath = `/mandi-prices?commodity=${encodeURIComponent(selectedCommodity)}${
    selectedState !== 'All' ? `&state=${encodeURIComponent(selectedState)}` : ''
  }`;
  const { data: priceData, loading: priceLoading } = useApiData<any>(apiPath);

  const historyPath = `/mandi-prices/history?commodity=${encodeURIComponent(selectedCommodity)}${
    selectedState !== 'All' ? `&state=${encodeURIComponent(selectedState)}` : ''
  }&days=30`;
  const { data: historyData } = useApiData<any[]>(historyPath);

  const commodities = filtersData?.commodities || [
    'Wheat',
    'Soybean',
    'Maize',
    'Mustard',
    'Rice',
    'Bajra(Pearl Millet/Cumbu)',
    'Potato',
    'Gram(Chickpea)',
    'Cotton',
    'Onion',
  ];

  const states = filtersData?.states || [
    'All',
    'Madhya Pradesh',
    'Punjab',
    'Uttar Pradesh',
    'Rajasthan',
    'Haryana',
    'Andhra Pradesh',
    'Maharashtra',
    'Gujarat',
  ];

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    setRefreshMessage(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/mandi-prices/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commodity: selectedCommodity === 'All' ? undefined : selectedCommodity,
          state: selectedState === 'All' ? undefined : selectedState,
        }),
      });
      const json = await res.json();
      setRefreshMessage(json.message || 'Updated with live data.gov.in prices');
      setTimeout(() => setRefreshMessage(null), 4000);
      window.location.reload();
    } catch {
      setRefreshMessage('Sync failed. Showing cached data.');
      setTimeout(() => setRefreshMessage(null), 4000);
    } finally {
      setIsRefreshing(false);
    }
  };

  const [hoverPoint, setHoverPoint] = useState<any | null>(null);
  const [hoverXRatio, setHoverXRatio] = useState<number>(0);
  const [hoverSpreadPoint, setHoverSpreadPoint] = useState<any | null>(null);
  const [hoverSpreadXRatio, setHoverSpreadXRatio] = useState<number>(0);
  const [hoverSeasonPoint, setHoverSeasonPoint] = useState<any | null>(null);
  const [hoverSeasonXRatio, setHoverSeasonXRatio] = useState<number>(0);

  const SEASONALITY_POINTS = [
    { month: 'Jan', index: 104, label: 'Winter High', phase: 'Strong demand ahead of Rabi harvesting', factor: '+4%' },
    { month: 'Feb', index: 108, label: 'Peak Rabi Lean', phase: 'Pre-harvest inventory low; peak spot quotes', factor: '+8%' },
    { month: 'Mar', index: 106, label: 'Early Arrivals', phase: 'Initial mandi lots arriving with high moisture', factor: '+6%' },
    { month: 'Apr', index: 96, label: 'Peak Harvest Glut', phase: 'Maximum volume inflows; MSP floor support active', factor: '-4%' },
    { month: 'May', index: 91, label: 'Heavy Inflow', phase: 'Peak warehouse procurement; lowest trading band', factor: '-9%' },
    { month: 'Jun', index: 88, label: 'Seasonal Trough', phase: 'Post-harvest glut; trade shifts to warehouse releases', factor: '-12%' },
    { month: 'Jul', index: 93, label: 'Monsoon Sowing', phase: 'Kharif sowing underway; supply stabilizes', factor: '-7%' },
    { month: 'Aug', index: 101, label: 'Mid-Monsoon Lean', phase: 'Restocking phase; prices firming up across APMCs', factor: '+1%' },
  ];

  const getSeasonY = (idx: number) => {
    const raw = 100 - ((idx - 85) / 30) * 70;
    return Math.max(15, Math.min(105, isNaN(raw) ? 50 : raw));
  };

  const handleSeasonMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const ratio = x / rect.width;
    const index = Math.min(
      SEASONALITY_POINTS.length - 1,
      Math.max(0, Math.round(ratio * (SEASONALITY_POINTS.length - 1)))
    );
    setHoverSeasonPoint(SEASONALITY_POINTS[index]);
    setHoverSeasonXRatio(index / (SEASONALITY_POINTS.length - 1));
  };

  const handleSeasonMouseLeave = () => {
    setHoverSeasonPoint(null);
  };

  const chartMin = useMemo(() => {
    if (!historyData || historyData.length === 0) return 2000;
    const values = historyData.map((d: any) => d.min_price || d.modal_price).filter((v: number) => typeof v === 'number' && !isNaN(v));
    if (values.length === 0) return 2000;
    return Math.floor((Math.min(...values) - 60) / 50) * 50;
  }, [historyData]);

  const chartMax = useMemo(() => {
    if (!historyData || historyData.length === 0) return 2800;
    const values = historyData.map((d: any) => d.max_price || d.modal_price).filter((v: number) => typeof v === 'number' && !isNaN(v));
    if (values.length === 0) return 2800;
    return Math.ceil((Math.max(...values) + 60) / 50) * 50;
  }, [historyData]);

  const getY = (val: number) => {
    const range = chartMax - chartMin || 1;
    const raw = 180 - ((val - chartMin) / range) * 140;
    return Math.max(15, Math.min(185, isNaN(raw) ? 100 : raw));
  };

  const handleMomentumMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!historyData || historyData.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const ratio = x / rect.width;
    const index = Math.min(
      historyData.length - 1,
      Math.max(0, Math.round(ratio * (historyData.length - 1)))
    );
    setHoverPoint(historyData[index]);
    setHoverXRatio(index / (historyData.length - 1));
  };

  const handleMomentumMouseLeave = () => {
    setHoverPoint(null);
  };

  const handleSpreadMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!historyData || historyData.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const ratio = x / rect.width;
    const index = Math.min(
      historyData.length - 1,
      Math.max(0, Math.round(ratio * (historyData.length - 1)))
    );
    setHoverSpreadPoint(historyData[index]);
    setHoverSpreadXRatio(index / (historyData.length - 1));
  };

  const handleSpreadMouseLeave = () => {
    setHoverSpreadPoint(null);
  };

  const filteredMarkets = (priceData?.markets || []).filter((m: any) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.market.toLowerCase().includes(q) ||
      (m.district && m.district.toLowerCase().includes(q)) ||
      (m.state && m.state.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex flex-col gap-6">
      {/* ── Top Dark Ticker Bar (Seamless Continuously Scrolling Marquee) ── */}
      <div className="bg-[#0B1528] rounded-xl border border-slate-800 text-xs py-2.5 px-4 overflow-hidden shadow-inner select-none relative flex">
        <div className="flex shrink-0 animate-marquee items-center gap-8 text-slate-300">
          {priceData?.markets && priceData.markets.length > 0 ? (
            priceData.markets.slice(0, 10).map((m: any, i: number) => {
              const code = `${selectedCommodity.slice(0, 4).toUpperCase()}/${(m.state || 'IN').slice(0, 2).toUpperCase()}`;
              return (
                <div key={i} className="inline-flex items-center gap-2 font-mono shrink-0">
                  <span className="font-semibold text-slate-400">{code}</span>
                  <span className="font-bold text-white">₹{m.modal_price.toLocaleString('en-IN')}</span>
                  <span className={`text-[11px] font-semibold ${m.change_pct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {m.change_pct >= 0 ? `+${m.change_pct}%` : `${m.change_pct}%`}
                  </span>
                  <span className="text-slate-600 ml-4">•</span>
                </div>
              );
            })
          ) : (
            <>
              <div className="inline-flex items-center gap-2 font-mono shrink-0">
                <span className="font-semibold text-slate-400">WHEA/PB</span>
                <span className="font-bold text-white">₹2,322</span>
                <span className="text-[11px] font-semibold text-emerald-400">+1.2%</span>
                <span className="text-slate-600 ml-4">•</span>
              </div>
              <div className="inline-flex items-center gap-2 font-mono shrink-0">
                <span className="font-semibold text-slate-400">SOYB/MP</span>
                <span className="font-bold text-white">₹4,650</span>
                <span className="text-[11px] font-semibold text-emerald-400">+0.8%</span>
                <span className="text-slate-600 ml-4">•</span>
              </div>
              <div className="inline-flex items-center gap-2 font-mono shrink-0">
                <span className="font-semibold text-slate-400">MUST/RJ</span>
                <span className="font-bold text-white">₹5,400</span>
                <span className="text-[11px] font-semibold text-rose-400">-0.4%</span>
                <span className="text-slate-600 ml-4">•</span>
              </div>
              <div className="inline-flex items-center gap-2 font-mono shrink-0">
                <span className="font-semibold text-slate-400">MAIZ/AP</span>
                <span className="font-bold text-white">₹2,450</span>
                <span className="text-[11px] font-semibold text-emerald-400">+2.1%</span>
                <span className="text-slate-600 ml-4">•</span>
              </div>
            </>
          )}
        </div>
        <div className="flex shrink-0 animate-marquee items-center gap-8 text-slate-300" aria-hidden="true">
          {priceData?.markets && priceData.markets.length > 0 ? (
            priceData.markets.slice(0, 10).map((m: any, i: number) => {
              const code = `${selectedCommodity.slice(0, 4).toUpperCase()}/${(m.state || 'IN').slice(0, 2).toUpperCase()}`;
              return (
                <div key={`dup-${i}`} className="inline-flex items-center gap-2 font-mono shrink-0">
                  <span className="font-semibold text-slate-400">{code}</span>
                  <span className="font-bold text-white">₹{m.modal_price.toLocaleString('en-IN')}</span>
                  <span className={`text-[11px] font-semibold ${m.change_pct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {m.change_pct >= 0 ? `+${m.change_pct}%` : `${m.change_pct}%`}
                  </span>
                  <span className="text-slate-600 ml-4">•</span>
                </div>
              );
            })
          ) : (
            <>
              <div className="inline-flex items-center gap-2 font-mono shrink-0">
                <span className="font-semibold text-slate-400">WHEA/PB</span>
                <span className="font-bold text-white">₹2,322</span>
                <span className="text-[11px] font-semibold text-emerald-400">+1.2%</span>
                <span className="text-slate-600 ml-4">•</span>
              </div>
              <div className="inline-flex items-center gap-2 font-mono shrink-0">
                <span className="font-semibold text-slate-400">SOYB/MP</span>
                <span className="font-bold text-white">₹4,650</span>
                <span className="text-[11px] font-semibold text-emerald-400">+0.8%</span>
                <span className="text-slate-600 ml-4">•</span>
              </div>
              <div className="inline-flex items-center gap-2 font-mono shrink-0">
                <span className="font-semibold text-slate-400">MUST/RJ</span>
                <span className="font-bold text-white">₹5,400</span>
                <span className="text-[11px] font-semibold text-rose-400">-0.4%</span>
                <span className="text-slate-600 ml-4">•</span>
              </div>
              <div className="inline-flex items-center gap-2 font-mono shrink-0">
                <span className="font-semibold text-slate-400">MAIZ/AP</span>
                <span className="font-bold text-white">₹2,450</span>
                <span className="text-[11px] font-semibold text-emerald-400">+2.1%</span>
                <span className="text-slate-600 ml-4">•</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Real-Time Feed • data.gov.in AGMARKNET
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Market Intelligence
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm mt-1">
            Predictive pricing and logistics momentum for mandi operators.{' '}
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              Latest data: {priceData?.latest_date || '2026-08-23'}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search mandi, state or commodity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 md:w-72 px-3.5 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
            />
          </div>
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            title="Sync latest live prices from data.gov.in"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm text-slate-700 dark:text-slate-300"
          >
            <svg
              className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </div>

      {refreshMessage && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl">
          {refreshMessage}
        </div>
      )}

      {/* ── Row 1: Filter Context & Today Pricing Cards ─────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Market Context Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Market Context
            </span>
          </div>
          <div className="space-y-2.5">
            <div>
              <label className="text-[10.5px] font-semibold text-slate-500 uppercase block mb-0.5">Commodity</label>
              <select
                value={selectedCommodity}
                onChange={(e) => setSelectedCommodity(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-900 dark:text-white"
              >
                {commodities.map((c) => (
                  <option key={c} value={c}>🌾 {c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10.5px] font-semibold text-slate-500 uppercase block mb-0.5">State</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-900 dark:text-white"
              >
                {states.map((s) => (
                  <option key={s} value={s}>📍 {s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Min Price Today Card */}
        <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
              Min Price Today
            </div>
            <div className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              {priceLoading ? '…' : `₹${(priceData?.min_price || 2180).toLocaleString('en-IN')}`}
            </div>
            <div className="text-xs text-rose-600/80 dark:text-rose-400/70 mt-0.5">per quintal</div>
          </div>
          <div className="text-[11px] font-medium text-slate-500 mt-2">AGMARKNET floor</div>
        </div>

        {/* Modal Price Hero Card */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-xl p-4 shadow-lg shadow-emerald-600/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-100">Modal Price</div>
              <span className="px-1.5 py-0.5 rounded bg-white/20 text-[9px] font-extrabold uppercase">Govt Feed</span>
            </div>
            <div className="text-3xl font-extrabold text-white mt-2">
              {priceLoading ? '…' : `₹${(priceData?.modal_price || 2300).toLocaleString('en-IN')}`}
            </div>
            <div className="text-xs text-emerald-100 mt-0.5">per quintal</div>
          </div>
          <div className="text-[11px] font-semibold text-emerald-100/90 mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span> Weighted Mandi Avg
          </div>
        </div>

        {/* Max Price Today Card */}
        <div className="bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/40 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
              Max Price Today
            </div>
            <div className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              {priceLoading ? '…' : `₹${(priceData?.max_price || 2450).toLocaleString('en-IN')}`}
            </div>
            <div className="text-xs text-sky-600/80 dark:text-sky-400/70 mt-0.5">per quintal</div>
          </div>
          <div className="mt-2">
            <span className="px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-300 text-xs font-bold">
              Spread: ₹{priceData?.spread || 270}
            </span>
          </div>
        </div>
      </div>

      {/* ── Row 2: Market Signal & Interactive Momentum Chart ───────────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Market Signal Card */}
        <div className="md:col-span-4 bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-base shadow-sm">
                ↗
              </div>
              <div>
                <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-300">
                  {priceData?.market_signal || 'Hold'}
                </h3>
                <div className="text-[9.5px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Market Signal
                </div>
              </div>
            </div>
            <div className="mt-3 p-3 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-emerald-200/50 dark:border-emerald-800/50 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {priceData?.signal_reason ||
                'Prices holding steady within normal trading bands. Trailing 7-day trend reflects consistent volume.'}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-emerald-200/50 dark:border-emerald-800/40">
            <div className="bg-white/60 dark:bg-slate-900/60 p-2 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
              <div className="text-[9px] font-bold text-slate-500 uppercase">VS 30D Avg</div>
              <div className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 mt-0.5">
                +{priceData?.vs_30day_pct || 4.2}%
              </div>
            </div>
            <div className="bg-white/60 dark:bg-slate-900/60 p-2 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
              <div className="text-[9px] font-bold text-slate-500 uppercase">Spread</div>
              <div className="text-xs font-extrabold text-slate-900 dark:text-white mt-0.5">
                ₹{priceData?.spread || 270}
              </div>
            </div>
            <div className="bg-white/60 dark:bg-slate-900/60 p-2 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
              <div className="text-[9px] font-bold text-slate-500 uppercase">Reporting</div>
              <div className="text-xs font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">
                {priceData?.reporting_markets_count || 12} APMCs
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Price Momentum vs Moving Averages */}
        <div className="md:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Price Momentum vs Moving Averages
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold">
                  Interactive
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">Hover over the timeline to inspect live modal and moving average values</p>
            </div>
            <div className="flex items-center gap-2.5 text-[11px]">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Modal
              </span>
              <span className="flex items-center gap-1 text-blue-600 font-semibold">
                <span className="w-2 h-0.5 bg-blue-500 rounded"></span> 7D MA
              </span>
              <span className="flex items-center gap-1 text-slate-400 font-semibold">
                <span className="w-2 h-0.5 bg-slate-400 border-dashed"></span> 30D Base
              </span>
            </div>
          </div>

          {/* Interactive Chart Container */}
          <div
            className="w-full h-52 relative pt-1 cursor-crosshair select-none overflow-hidden rounded-lg"
            onMouseMove={handleMomentumMouseMove}
            onMouseLeave={handleMomentumMouseLeave}
          >
            {/* Floating Live Tooltip */}
            {hoverPoint && (
              <div
                className="absolute pointer-events-none z-30 transition-all duration-75 bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white px-3 py-2 rounded-xl shadow-xl border border-slate-700/60 text-xs flex flex-col gap-1 min-w-[170px]"
                style={{
                  left: `${Math.min(82, Math.max(18, hoverXRatio * 100))}%`,
                  top: '10px',
                  transform: 'translateX(-50%)',
                }}
              >
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-1 mb-0.5">
                  <span className="font-bold text-slate-200">
                    {new Date(hoverPoint.price_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    Govt Quote
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Modal Price:
                  </span>
                  <span className="font-extrabold text-emerald-400 font-mono">
                    ₹{hoverPoint.modal_price.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2 h-0.5 rounded bg-blue-400"></span> 7D Moving Avg:
                  </span>
                  <span className="font-semibold text-blue-300 font-mono">
                    ₹{hoverPoint.moving_avg_7d.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2 h-0.5 rounded bg-slate-400"></span> 30D Base:
                  </span>
                  <span className="text-slate-400 font-mono">
                    ₹{hoverPoint.moving_avg_30d.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] pt-1 mt-0.5 border-t border-slate-700/60 text-slate-400">
                  <span>Day Spread:</span>
                  <span className="font-mono text-amber-300">
                    ₹{hoverPoint.spread} (₹{hoverPoint.min_price} - ₹{hoverPoint.max_price})
                  </span>
                </div>
              </div>
            )}

            <svg className="w-full h-full overflow-hidden" viewBox="0 0 700 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <line x1="0" y1="20" x2="700" y2="20" stroke="#E2E8F0" strokeDasharray="3 3" className="dark:stroke-slate-800" />
              <line x1="0" y1="70" x2="700" y2="70" stroke="#E2E8F0" strokeDasharray="3 3" className="dark:stroke-slate-800" />
              <line x1="0" y1="120" x2="700" y2="120" stroke="#E2E8F0" strokeDasharray="3 3" className="dark:stroke-slate-800" />

              {historyData && historyData.length > 0 && (
                <>
                  <path
                    d={`M 0,${getY(historyData[0].modal_price)} ${historyData
                      .map(
                        (p: any, idx: number) =>
                          `L ${(idx / (historyData.length - 1)) * 700},${getY(p.modal_price)}`
                      )
                      .join(' ')} L 700,190 L 0,190 Z`}
                    fill="url(#chartGrad)"
                  />
                  <path
                    d={`M 0,${getY(historyData[0].moving_avg_30d)} ${historyData
                      .map(
                        (p: any, idx: number) =>
                          `L ${(idx / (historyData.length - 1)) * 700},${getY(p.moving_avg_30d)}`
                      )
                      .join(' ')}`}
                    fill="none"
                    stroke="#94A3B8"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <path
                    d={`M 0,${getY(historyData[0].moving_avg_7d)} ${historyData
                      .map(
                        (p: any, idx: number) =>
                          `L ${(idx / (historyData.length - 1)) * 700},${getY(p.moving_avg_7d)}`
                      )
                      .join(' ')}`}
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                  />
                  <path
                    d={`M 0,${getY(historyData[0].modal_price)} ${historyData
                      .map(
                        (p: any, idx: number) =>
                          `L ${(idx / (historyData.length - 1)) * 700},${getY(p.modal_price)}`
                      )
                      .join(' ')}`}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2.5"
                  />

                  {/* Active Hover Crosshair and Indicator Dots */}
                  {hoverPoint && (
                    <>
                      <line
                        x1={`${hoverXRatio * 700}`}
                        y1="10"
                        x2={`${hoverXRatio * 700}`}
                        y2="190"
                        stroke="#10B981"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                        className="opacity-75"
                      />
                      <circle
                        cx={`${hoverXRatio * 700}`}
                        cy={`${getY(hoverPoint.modal_price)}`}
                        r="6"
                        className="fill-emerald-500 stroke-white dark:stroke-slate-900 stroke-2 filter drop-shadow-md"
                      />
                      <circle
                        cx={`${hoverXRatio * 700}`}
                        cy={`${getY(hoverPoint.moving_avg_7d)}`}
                        r="4"
                        className="fill-blue-500 stroke-white dark:stroke-slate-900 stroke-2"
                      />
                    </>
                  )}
                </>
              )}
            </svg>
            <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
              <span>07-24</span>
              <span>07-30</span>
              <span>08-05</span>
              <span>08-11</span>
              <span>08-17</span>
              <span>08-23</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 3: Regional Comparison & Volatility ──────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Regional Price Comparison */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Regional Price Comparison</h3>
            <span className="text-[11px] text-slate-500 font-semibold">₹ / Quintal</span>
          </div>

          <div className="space-y-3">
            {filteredMarkets.slice(0, 5).map((m: any, idx: number) => {
              const maxBar = 2800;
              const widthPct = Math.min(100, Math.max(20, ((m.modal_price - 1800) / (maxBar - 1800)) * 100));
              return (
                <div key={idx} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 p-1.5 rounded-lg transition-colors">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                      {m.market}
                    </span>
                    <span className="text-slate-900 dark:text-white font-bold font-mono">
                      ₹{m.modal_price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 group-hover:brightness-110"
                      style={{ width: `${widthPct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Price Spread & Volatility */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Price Spread & Volatility
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold">
                Interactive
              </span>
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold">
              Avg spread: ₹{priceData?.spread || 270}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mb-2">Hover to inspect daily price volatility and spread range</p>

          <div
            className="w-full h-40 relative select-none cursor-crosshair overflow-hidden rounded-lg"
            onMouseMove={handleSpreadMouseMove}
            onMouseLeave={handleSpreadMouseLeave}
          >
            {hoverSpreadPoint && (
              <div
                className="absolute pointer-events-none z-30 transition-all duration-75 bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white px-3 py-1.5 rounded-xl shadow-xl border border-slate-700/60 text-xs flex flex-col gap-0.5 min-w-[140px]"
                style={{
                  left: `${Math.min(80, Math.max(20, hoverSpreadXRatio * 100))}%`,
                  top: '6px',
                  transform: 'translateX(-50%)',
                }}
              >
                <span className="font-bold text-slate-200 text-[11px] border-b border-slate-700 pb-0.5">
                  {new Date(hoverSpreadPoint.price_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                </span>
                <div className="flex justify-between items-center text-[11px] mt-0.5">
                  <span className="text-slate-300">Spread:</span>
                  <span className="font-bold font-mono text-emerald-400">₹{hoverSpreadPoint.spread}</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Range: ₹{hoverSpreadPoint.min_price} – ₹{hoverSpreadPoint.max_price}
                </div>
              </div>
            )}

            <svg className="w-full h-full overflow-hidden" viewBox="0 0 500 140" preserveAspectRatio="none">
              <defs>
                <linearGradient id="spreadGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {historyData && historyData.length > 0 && (
                <>
                  <path
                    d={`M 0,${130 - (historyData[0].spread / 450) * 100} ${historyData
                      .map(
                        (p: any, idx: number) =>
                          `L ${(idx / (historyData.length - 1)) * 500},${130 - (p.spread / 450) * 100}`
                      )
                      .join(' ')} L 500,140 L 0,140 Z`}
                    fill="url(#spreadGrad2)"
                  />
                  <path
                    d={`M 0,${130 - (historyData[0].spread / 450) * 100} ${historyData
                      .map(
                        (p: any, idx: number) =>
                          `L ${(idx / (historyData.length - 1)) * 500},${130 - (p.spread / 450) * 100}`
                      )
                      .join(' ')}`}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2"
                  />
                  {hoverSpreadPoint && (
                    <>
                      <line
                        x1={`${hoverSpreadXRatio * 500}`}
                        y1="10"
                        x2={`${hoverSpreadXRatio * 500}`}
                        y2="135"
                        stroke="#10B981"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                      />
                      <circle
                        cx={`${hoverSpreadXRatio * 500}`}
                        cy={`${130 - (hoverSpreadPoint.spread / 450) * 100}`}
                        r="5"
                        className="fill-emerald-500 stroke-white dark:stroke-slate-900 stroke-2"
                      />
                    </>
                  )}
                </>
              )}
            </svg>
            <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
              <span>07-26</span>
              <span>08-03</span>
              <span>08-11</span>
              <span>08-19</span>
              <span>08-23</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 4: Interactive Seasonality & Quality Grade Donut ─────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Interactive Historical Seasonality Curve */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Historical Seasonality Curve
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold">
                Interactive
              </span>
            </h3>
            <span className="text-[11px] font-semibold text-slate-400">Harvest vs Lean Cycle</span>
          </div>
          <p className="text-[11px] text-slate-500 mb-3">Hover across months to inspect seasonal price momentum & phase</p>

          <div
            className="w-full h-40 relative select-none cursor-crosshair overflow-hidden rounded-lg"
            onMouseMove={handleSeasonMouseMove}
            onMouseLeave={handleSeasonMouseLeave}
          >
            {/* Seasonality Hover Tooltip */}
            {hoverSeasonPoint && (
              <div
                className="absolute pointer-events-none z-30 transition-all duration-75 bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white px-3 py-2 rounded-xl shadow-xl border border-slate-700/60 text-xs flex flex-col gap-1 min-w-[160px]"
                style={{
                  left: `${Math.min(80, Math.max(20, hoverSeasonXRatio * 100))}%`,
                  top: '6px',
                  transform: 'translateX(-50%)',
                }}
              >
                <div className="flex items-center justify-between border-b border-slate-700 pb-1">
                  <span className="font-bold text-slate-200">{hoverSeasonPoint.month} ({hoverSeasonPoint.label})</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${hoverSeasonPoint.index >= 100 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                    {hoverSeasonPoint.factor}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[11px] mt-0.5">
                  <span className="text-slate-300">Seasonal Index:</span>
                  <span className="font-bold font-mono text-emerald-400">{hoverSeasonPoint.index} pts</span>
                </div>
                <div className="text-[10px] text-slate-400 leading-tight mt-0.5">
                  {hoverSeasonPoint.phase}
                </div>
              </div>
            )}

            <svg className="w-full h-full overflow-hidden" viewBox="0 0 500 120" preserveAspectRatio="none">
              <path
                d={`M 0,${getSeasonY(SEASONALITY_POINTS[0].index)} ${SEASONALITY_POINTS.map(
                  (pt, idx) => `L ${(idx / (SEASONALITY_POINTS.length - 1)) * 500},${getSeasonY(pt.index)}`
                ).join(' ')} L 500,120 L 0,120 Z`}
                fill="url(#chartGrad)"
              />
              <path
                d={`M 0,${getSeasonY(SEASONALITY_POINTS[0].index)} ${SEASONALITY_POINTS.map(
                  (pt, idx) => `L ${(idx / (SEASONALITY_POINTS.length - 1)) * 500},${getSeasonY(pt.index)}`
                ).join(' ')}`}
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
              />
              {/* Active Hover Crosshair and Dot */}
              {hoverSeasonPoint && (
                <>
                  <line
                    x1={`${hoverSeasonXRatio * 500}`}
                    y1="10"
                    x2={`${hoverSeasonXRatio * 500}`}
                    y2="115"
                    stroke="#10B981"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  <circle
                    cx={`${hoverSeasonXRatio * 500}`}
                    cy={`${getSeasonY(hoverSeasonPoint.index)}`}
                    r="5.5"
                    className="fill-emerald-500 stroke-white dark:stroke-slate-900 stroke-2 filter drop-shadow"
                  />
                </>
              )}
            </svg>
            <div className="flex justify-between text-[11px] font-medium text-slate-400 mt-1">
              {SEASONALITY_POINTS.map((p, i) => (
                <span key={i}>{p.month}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Volume by Quality Grade Donut */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Volume by Quality Grade</h3>
            <p className="text-[11px] text-slate-500">Government classification distribution across reported lots</p>
          </div>

          <div className="flex items-center justify-around my-3">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-100 dark:text-slate-800"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500"
                  strokeDasharray="60, 100"
                  strokeWidth="4"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-teal-400"
                  strokeDasharray="25, 100"
                  strokeDashoffset="-60"
                  strokeWidth="4"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-cyan-300"
                  strokeDasharray="15, 100"
                  strokeDashoffset="-85"
                  strokeWidth="4"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-[10px] font-bold text-slate-800 dark:text-white">AGMARK</span>
              </div>
            </div>

            <div className="space-y-1.5 text-[11px] font-semibold">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-slate-700 dark:text-slate-300">FAQ (Fair Average): 60%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
                <span className="text-slate-700 dark:text-slate-300">Grade A (Premium): 25%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-300"></span>
                <span className="text-slate-700 dark:text-slate-300">Grade B / Standard: 15%</span>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 text-center">Standard AGMARKNET quality grading scheme</div>
        </div>
      </div>
    </div>
  );
}

function SettingsScreen({ theme, setTheme }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden transition-colors p-6 max-w-lg">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Display Settings</h2>
      <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50">
        <div>
          <div className="font-semibold text-slate-900 dark:text-white">Theme Preference</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">Toggle between Light and Dark mode.</div>
        </div>
        <div className="flex gap-2 bg-slate-200 dark:bg-slate-950 p-1 rounded-lg">
          <button onClick={() => setTheme('light')} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${theme === 'light' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Light</button>
          <button onClick={() => setTheme('dark')} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${theme === 'dark' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500'}`}>Dark</button>
        </div>
      </div>
    </div>
  );
}
