'use client';
import { useState, useEffect } from "react";
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
  
  const [waiting, setWaiting] = useState(INITIAL_WAITING);
  const [ledger, setLedger] = useState<Farmer[]>(INITIAL_LEDGER);
  const [arrivals, setArrivals] = useState(INITIAL_ARRIVALS);
  const [serving, setServing] = useState({ token: "T-047", name: "Dinesh Kumar", village: "Sehore", crop: "Wheat" });
  
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
            <div className="text-[12px] text-slate-500 dark:text-slate-400 px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800">
              23 Aug 2026, 14:37 IST
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
  const { data: mandiPrices, loading, error } = useApiData<any>('/mandis/default/prices');

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden transition-colors p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Current Mandi Prices (MSP)</h2>
          <p className="text-xs text-slate-500 mt-0.5">Live rates from backend Data.gov.in integration</p>
        </div>
        {loading ? (
          <span className="text-xs text-slate-400">Loading rates...</span>
        ) : error ? (
          <span className="text-xs text-amber-600 dark:text-amber-400">Using standard MSP</span>
        ) : (
          <span className="text-xs font-semibold text-green-600 dark:text-green-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Live Rates Active
          </span>
        )}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(MSP).map(([grade, price]) => (
          <div key={grade} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">Wheat Grade {grade}</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">₹{price} / qtl</div>
          </div>
        ))}
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
