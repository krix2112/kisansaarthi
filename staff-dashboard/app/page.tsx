'use client';
import { useState } from "react";

type NavId = "today" | "queue" | "arrivals" | "procurement" | "payments";

const NAV: { id: NavId; label: string; icon: React.ReactNode }[] = [
  { id: "today", label: "Today", icon: <IconToday /> },
  { id: "queue", label: "Live Queue", icon: <IconQueue /> },
  { id: "arrivals", label: "Arrivals", icon: <IconArrivals /> },
  { id: "procurement", label: "Procurement", icon: <IconProcure /> },
  { id: "payments", label: "Payments", icon: <IconPayments /> },
];

const WAITING = [
  { token: 48, name: "Ramesh Yadav", village: "Hoshangabad", eta: "~5 min" },
  { token: 49, name: "Sunita Devi", village: "Betul", eta: "~11 min" },
  { token: 50, name: "Mohan Patel", village: "Narsinghpur", eta: "~17 min" },
  { token: 51, name: "Kavita Verma", village: "Raisen", eta: "~23 min" },
];

const MSP: Record<string, number> = { A: 2350, B: 2100, C: 1850 };

// ── Icons ────────────────────────────────────────────────────────────────────

function IconToday() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function IconQueue() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
      <circle cx="3" cy="6" r="1" fill="currentColor" /><circle cx="3" cy="12" r="1" fill="currentColor" /><circle cx="3" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}
function IconArrivals() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function IconProcure() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}
function IconPayments() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}
function IconWheat() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22V12" /><path d="M12 12c0-4 4-8 4-8s0 4-4 4" /><path d="M12 12c0-4-4-8-4-8s0 4 4 4" /><path d="M12 17c0-3 3-5 3-5s0 3-3 3" /><path d="M12 17c0-3-3-5-3-5s0 3 3 3" />
    </svg>
  );
}

// ── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ active, onNav }: { active: NavId; onNav: (id: NavId) => void }) {
  return (
    <aside style={{
      width: 232,
      flexShrink: 0,
      background: "#FFFFFF",
      borderRight: "1px solid #E2E8F0",
      display: "flex",
      flexDirection: "column",
      height: "100%",
    }}>
      {/* Logo */}
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #F1F5F9" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: "#1E3A8A",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <span style={{ color: "#fff" }}><IconWheat /></span>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#0F172A", letterSpacing: "-0.01em" }}>KisanSaarthi</div>
            <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500, marginTop: 1 }}>MP Agri Portal</div>
          </div>
        </div>
      </div>

      {/* Mandal pill */}
      <div style={{ padding: "12px 16px" }}>
        <div style={{
          background: "#EFF6FF", borderRadius: 8, padding: "8px 12px",
          border: "1px solid #DBEAFE",
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#1E40AF", letterSpacing: "0.04em", textTransform: "uppercase" }}>Mandal</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: "#1E3A8A", marginTop: 2 }}>Sehore, MP</div>
          <div style={{ fontSize: 11, color: "#60A5FA", marginTop: 1 }}>Season 2025–26</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "4px 12px", overflowY: "auto" }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", letterSpacing: "0.06em", textTransform: "uppercase", padding: "8px 8px 4px" }}>
          Menu
        </div>
        {NAV.map(({ id, label, icon }) => {
          const isActive = active === id;
          return (
            <button key={id} onClick={() => onNav(id)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                width: "100%", padding: "9px 10px",
                borderRadius: 8, marginBottom: 2,
                background: isActive ? "#EFF6FF" : "transparent",
                color: isActive ? "#1E3A8A" : "#475569",
                border: "none", cursor: "pointer",
                fontFamily: "inherit", fontSize: 13.5, fontWeight: isActive ? 600 : 400,
                textAlign: "left", transition: "background 0.12s, color 0.12s",
              }}
              onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "#F8FAFC"; }}
              onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>
              <span style={{ color: isActive ? "#1E3A8A" : "#94A3B8", flexShrink: 0 }}>{icon}</span>
              {label}
              {id === "queue" && (
                <span style={{
                  marginLeft: "auto", background: "#FEF3C7", color: "#92400E",
                  fontSize: 11, fontWeight: 700, borderRadius: 99, padding: "1px 7px",
                  border: "1px solid #FDE68A",
                }}>4</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid #F1F5F9" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "#EFF6FF", border: "1px solid #DBEAFE",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: "#1E3A8A", flexShrink: 0,
          }}>R</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Rajesh Kumar</div>
            <div style={{ fontSize: 11, color: "#94A3B8" }}>Mandi Operator</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ── Header ───────────────────────────────────────────────────────────────────

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{
      background: "#FFFFFF", borderBottom: "1px solid #E2E8F0",
      padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between",
      flexShrink: 0,
    }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#0F172A", letterSpacing: "-0.01em" }}>{title}</h1>
        <p style={{ margin: 0, fontSize: 12.5, color: "#64748B", marginTop: 2 }}>{subtitle}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "5px 10px", borderRadius: 6,
          background: "#F0FDF4", border: "1px solid #BBF7D0",
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#16A34A", display: "inline-block" }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: "#15803D" }}>System Live</span>
        </div>
        <div style={{ fontSize: 12, color: "#94A3B8", padding: "5px 10px", border: "1px solid #E2E8F0", borderRadius: 6, background: "#fff" }}>
          23 Aug 2026, 14:37 IST
        </div>
      </div>
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div style={{
      background: "#FFFFFF", border: "1px solid #E2E8F0",
      borderRadius: 12, padding: "18px 20px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
    }}>
      <div style={{ fontSize: 12, fontWeight: 500, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#0F172A", marginTop: 6, letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color, marginTop: 6, fontWeight: 500 }}>{sub}</div>
    </div>
  );
}

// ── Today Screen ─────────────────────────────────────────────────────────────

const LEDGER = [
  { token: "T-041", name: "Ramesh Yadav", crop: "Wheat", qty: 42, grade: "A", amount: 98700, status: "Completed" },
  { token: "T-042", name: "Sunita Devi", crop: "Soybean", qty: 28, grade: "B", amount: 58800, status: "Completed" },
  { token: "T-043", name: "Mohan Patel", crop: "Wheat", qty: 65, grade: "A", amount: 152750, status: "Pending" },
  { token: "T-044", name: "Kavita Verma", crop: "Maize", qty: 33, grade: "B", amount: 69300, status: "Processing" },
  { token: "T-045", name: "Suresh Rawat", crop: "Wheat", qty: 51, grade: "C", amount: 94350, status: "Completed" },
];

function StatusChip({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string; dot: string }> = {
    Completed: { bg: "#F0FDF4", color: "#15803D", dot: "#16A34A" },
    Pending: { bg: "#FFFBEB", color: "#92400E", dot: "#F59E0B" },
    Processing: { bg: "#EFF6FF", color: "#1E40AF", dot: "#3B82F6" },
  };
  const s = styles[status] || styles.Pending;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: s.bg, color: s.color,
      fontSize: 12, fontWeight: 600, borderRadius: 99, padding: "3px 9px",
      border: `1px solid ${s.dot}30`,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
      {status}
    </span>
  );
}

function TodayScreen() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        <StatCard label="Total Farmers" value="284" sub="↑ 18 from yesterday" color="#16A34A" />
        <StatCard label="Serving Token" value="T-047" sub="Avg. 6.4 min / farmer" color="#1E40AF" />
        <StatCard label="Completed" value="231" sub="81.3% of daily target" color="#16A34A" />
        <StatCard label="Pending Payment" value="₹18.4L" sub="32 farmers awaiting DBT" color="#D97706" />
      </div>

      <div style={{
        background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 12,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        overflow: "hidden",
      }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#0F172A" }}>Procurement Ledger</div>
            <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>Recent transactions — 23 Aug 2026</div>
          </div>
          <button style={{
            fontSize: 12, fontWeight: 500, color: "#1E3A8A", padding: "5px 12px",
            border: "1px solid #DBEAFE", borderRadius: 6, background: "#EFF6FF", cursor: "pointer", fontFamily: "inherit",
          }}>View All →</button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F8FAFC" }}>
              {["Token", "Farmer", "Crop", "Qty (q)", "Grade", "Amount", "Status"].map((h) => (
                <th key={h} style={{
                  textAlign: "left", padding: "10px 20px",
                  fontSize: 11.5, fontWeight: 600, color: "#94A3B8",
                  textTransform: "uppercase", letterSpacing: "0.05em",
                  borderBottom: "1px solid #F1F5F9",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {LEDGER.map((r, i) => (
              <tr key={i} style={{ borderBottom: i < LEDGER.length - 1 ? "1px solid #F8FAFC" : "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFBFD")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <td style={{ padding: "12px 20px", fontSize: 13, fontWeight: 600, color: "#1E3A8A", fontVariantNumeric: "tabular-nums" }}>{r.token}</td>
                <td style={{ padding: "12px 20px", fontSize: 13, color: "#0F172A", fontWeight: 500 }}>{r.name}</td>
                <td style={{ padding: "12px 20px", fontSize: 13, color: "#475569" }}>{r.crop}</td>
                <td style={{ padding: "12px 20px", fontSize: 13, color: "#475569", fontVariantNumeric: "tabular-nums" }}>{r.qty}</td>
                <td style={{ padding: "12px 20px" }}>
                  <span style={{
                    fontSize: 12, fontWeight: 700, color: r.grade === "A" ? "#15803D" : r.grade === "B" ? "#92400E" : "#6D28D9",
                    background: r.grade === "A" ? "#F0FDF4" : r.grade === "B" ? "#FFFBEB" : "#F5F3FF",
                    padding: "2px 8px", borderRadius: 4,
                  }}>{r.grade}</span>
                </td>
                <td style={{ padding: "12px 20px", fontSize: 13, fontWeight: 600, color: "#0F172A", fontVariantNumeric: "tabular-nums" }}>₹{r.amount.toLocaleString("en-IN")}</td>
                <td style={{ padding: "12px 20px" }}><StatusChip status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: "12px 20px", borderTop: "1px solid #F1F5F9", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: "#94A3B8" }}>Day Total:</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", fontVariantNumeric: "tabular-nums" }}>₹4,73,900</span>
        </div>
      </div>
    </div>
  );
}

// ── Queue Screen ──────────────────────────────────────────────────────────────

function QueueScreen() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 16, alignItems: "start" }}>
      {/* Currently Serving */}
      <div style={{
        background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 12,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: "#0F172A" }}>Currently Serving</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#16A34A", display: "inline-block" }} />
            <span style={{ fontSize: 12, fontWeight: 500, color: "#15803D" }}>Live</span>
          </div>
        </div>

        <div style={{ padding: "32px 24px" }}>
          {/* Token display */}
          <div style={{
            background: "#F8FAFC", border: "2px solid #1E3A8A",
            borderRadius: 12, padding: "28px 24px", textAlign: "center", marginBottom: 24,
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
              Token Number
            </div>
            <div style={{ fontSize: 64, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.03em", lineHeight: 1 }}>
              #47
            </div>
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: "#0F172A" }}>Dinesh Kumar</div>
              <div style={{ fontSize: 14, color: "#64748B", marginTop: 4 }}>Village: Sehore · Crop: Wheat</div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {[
              { label: "Elapsed", value: "6:42", color: "#0F172A" },
              { label: "In Queue", value: "4", color: "#D97706" },
              { label: "Completed", value: "231", color: "#15803D" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{
                background: "#F8FAFC", border: "1px solid #E2E8F0",
                borderRadius: 8, padding: "12px", textAlign: "center",
              }}>
                <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color, marginTop: 4, fontVariantNumeric: "tabular-nums" }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Action */}
          <button style={{
            marginTop: 20, width: "100%", padding: "12px",
            background: "#1E3A8A", color: "#FFFFFF",
            border: "none", borderRadius: 8,
            fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 1px 3px rgba(30,58,138,0.3)",
            transition: "background 0.15s",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1e40af")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1E3A8A")}>
            ✓ Mark Complete &amp; Call Next
          </button>
        </div>
      </div>

      {/* Waiting Queue */}
      <div style={{
        background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 12,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: "#0F172A" }}>Waiting Queue</div>
          <span style={{
            fontSize: 11, fontWeight: 700, background: "#FFFBEB", color: "#92400E",
            border: "1px solid #FDE68A", borderRadius: 99, padding: "2px 8px",
          }}>4 waiting</span>
        </div>

        <div style={{ overflowY: "auto", maxHeight: 420 }}>
          {WAITING.map((w, i) => (
            <div key={w.token} style={{
              padding: "14px 20px",
              borderBottom: i < WAITING.length - 1 ? "1px solid #F8FAFC" : "none",
              display: "flex", alignItems: "center", gap: 12,
              transition: "background 0.1s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFBFD")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                background: i === 0 ? "#EFF6FF" : "#F8FAFC",
                border: `1px solid ${i === 0 ? "#BFDBFE" : "#E2E8F0"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color: i === 0 ? "#1E3A8A" : "#94A3B8",
                fontVariantNumeric: "tabular-nums",
              }}>{i + 1}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#1E3A8A", fontVariantNumeric: "tabular-nums" }}>#{w.token}</span>
                  {i === 0 && <span style={{
                    fontSize: 10, fontWeight: 600, background: "#EFF6FF", color: "#1E40AF",
                    borderRadius: 4, padding: "1px 5px", border: "1px solid #BFDBFE",
                  }}>Next</span>}
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#0F172A", marginTop: 1 }}>{w.name}</div>
                <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 1 }}>{w.village}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 12, color: "#64748B", fontWeight: 500 }}>{w.eta}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ padding: "14px 20px", borderTop: "1px solid #F1F5F9" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: "#64748B" }}>Daily Progress</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#0F172A" }}>231 / 284</span>
          </div>
          <div style={{ height: 6, background: "#F1F5F9", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ width: "81.3%", height: "100%", background: "#16A34A", borderRadius: 99 }} />
          </div>
          <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 5 }}>81.3% of target · Est. completion by 6:15 PM</div>
        </div>
      </div>
    </div>
  );
}

// ── Procurement Screen ────────────────────────────────────────────────────────

function ProcurementScreen() {
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
    setTimeout(() => { setSubmitted(false); setQty(""); setGrade(""); }, 2000);
  }

  const gradeColors: Record<string, { bg: string; border: string; text: string }> = {
    A: { bg: "#F0FDF4", border: "#86EFAC", text: "#15803D" },
    B: { bg: "#FFFBEB", border: "#FCD34D", text: "#92400E" },
    C: { bg: "#F5F3FF", border: "#C4B5FD", text: "#6D28D9" },
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16, alignItems: "start" }}>
      {/* Form Card */}
      <div style={{
        background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 12,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}>
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #F1F5F9" }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: "#0F172A" }}>Procurement Entry</div>
          <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>Token #47 · Dinesh Kumar · Sehore</div>
        </div>

        <div style={{ padding: "24px" }}>
          {/* Farmer summary strip */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            background: "#F8FAFC", border: "1px solid #E2E8F0",
            borderRadius: 8, padding: "12px 14px", marginBottom: 24,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%", background: "#EFF6FF",
              border: "1px solid #BFDBFE", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 700, color: "#1E3A8A", flexShrink: 0,
            }}>D</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>Dinesh Kumar Sahu</div>
              <div style={{ fontSize: 12, color: "#64748B", marginTop: 1 }}>Aadhaar: ●●●● 4821 · SBI A/c: ●●●● 7732</div>
            </div>
            <StatusChip status="Processing" />
          </div>

          {/* Quantity */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
              Quantity (Quintals)
            </label>
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              placeholder="e.g., 50"
              style={{
                width: "100%", padding: "10px 14px",
                border: "1px solid #D1D5DB", borderRadius: 8,
                fontSize: 15, fontWeight: 500, color: "#0F172A",
                fontFamily: "inherit", background: "#FFFFFF",
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#1E3A8A"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(30,58,138,0.08)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "#D1D5DB"; e.currentTarget.style.boxShadow = "none"; }}
            />
            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              {[10, 25, 50, 100].map((v) => (
                <button key={v} onClick={() => setQty(String(v))}
                  style={{
                    padding: "4px 10px", fontSize: 12, fontWeight: 500,
                    border: qty === String(v) ? "1px solid #1E3A8A" : "1px solid #E2E8F0",
                    background: qty === String(v) ? "#EFF6FF" : "#F8FAFC",
                    color: qty === String(v) ? "#1E3A8A" : "#64748B",
                    borderRadius: 6, cursor: "pointer", fontFamily: "inherit",
                  }}>
                  {v}q
                </button>
              ))}
            </div>
          </div>

          {/* Quality Grade */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
              Quality Grade
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {(["A", "B", "C"] as const).map((g) => {
                const c = gradeColors[g];
                const active = grade === g;
                return (
                  <button key={g} onClick={() => setGrade(g)}
                    style={{
                      padding: "14px 12px", borderRadius: 8,
                      border: active ? `2px solid ${c.border}` : "1px solid #E2E8F0",
                      background: active ? c.bg : "#F8FAFC",
                      cursor: "pointer", fontFamily: "inherit",
                      textAlign: "center", transition: "all 0.15s",
                    }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: active ? c.text : "#94A3B8" }}>{g}</div>
                    <div style={{ fontSize: 11, fontWeight: 500, color: active ? c.text : "#94A3B8", marginTop: 2 }}>
                      {g === "A" ? "Premium" : g === "B" ? "Standard" : "Basic"}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: active ? c.text : "#CBD5E1", marginTop: 3 }}>
                      ₹{MSP[g].toLocaleString("en-IN")}/q
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Estimated Amount */}
          <div style={{
            background: hasValues ? "#FFFBEB" : "#F8FAFC",
            border: `1px solid ${hasValues ? "#FDE68A" : "#E2E8F0"}`,
            borderRadius: 8, padding: "14px 16px", marginBottom: 20,
            transition: "all 0.2s",
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
              Estimated Amount
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: hasValues ? "#92400E" : "#CBD5E1", letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>
              {hasValues ? `₹${estimated.toLocaleString("en-IN")}` : "₹ —"}
            </div>
            {hasValues && (
              <div style={{ fontSize: 12, color: "#A16207", marginTop: 4 }}>
                {numQty}q × ₹{rate.toLocaleString("en-IN")}/q · MSP Grade {grade} · DBT to SBI ●●●● 7732
              </div>
            )}
          </div>

          <button onClick={handleSubmit}
            disabled={!hasValues}
            style={{
              width: "100%", padding: "13px",
              background: submitted ? "#16A34A" : hasValues ? "#1E3A8A" : "#94A3B8",
              color: "#FFFFFF", border: "none", borderRadius: 8,
              fontSize: 15, fontWeight: 600, cursor: hasValues ? "pointer" : "not-allowed",
              fontFamily: "inherit", transition: "background 0.2s",
              boxShadow: hasValues ? "0 1px 3px rgba(30,58,138,0.25)" : "none",
            }}>
            {submitted ? "✓ Submitted Successfully" : "Submit Procurement"}
          </button>
        </div>
      </div>

      {/* Recent Procurements */}
      <div style={{
        background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 12,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #F1F5F9" }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: "#0F172A" }}>Recent Entries</div>
          <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>Today, 23 Aug 2026</div>
        </div>
        {LEDGER.slice(0, 4).map((r, i) => (
          <div key={i} style={{
            padding: "12px 20px",
            borderBottom: i < 3 ? "1px solid #F8FAFC" : "none",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{r.name}</div>
                <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 1 }}>{r.token} · {r.crop} · {r.qty}q · Grade {r.grade}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", fontVariantNumeric: "tabular-nums" }}>₹{r.amount.toLocaleString("en-IN")}</div>
                <StatusChip status={r.status} />
              </div>
            </div>
          </div>
        ))}

        {/* Summary */}
        <div style={{ padding: "14px 20px", borderTop: "1px solid #F1F5F9", background: "#F8FAFC", borderRadius: "0 0 12px 12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "#64748B" }}>Today&apos;s Procurement Total</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", fontVariantNumeric: "tabular-nums" }}>₹4,73,900</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            <span style={{ fontSize: 12, color: "#94A3B8" }}>Pending DBT Transfer</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#D97706", fontVariantNumeric: "tabular-nums" }}>₹18,40,000</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Placeholder ───────────────────────────────────────────────────────────────

function PlaceholderScreen({ label }: { label: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center", height: "calc(100vh - 200px)",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.2 }}>⊡</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8" }}>{label}</div>
        <div style={{ fontSize: 13, color: "#CBD5E1", marginTop: 4 }}>This module is under development.</div>
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

const SCREEN_META: Record<NavId, { title: string; sub: string }> = {
  today: { title: "Today's Overview", sub: "Mandal: Sehore · District: Bhopal · 23 August 2026" },
  queue: { title: "Live Queue", sub: "Real-time token management · Sehore Mandi" },
  arrivals: { title: "Arrivals", sub: "Farmer arrival log · 23 August 2026" },
  procurement: { title: "Procurement Entry", sub: "Record crop purchase details for the current token" },
  payments: { title: "Payments & DBT", sub: "Direct benefit transfer status · Season 2025–26" },
};

export default function App() {
  const [active, setActive] = useState<NavId>("today");
  const meta = SCREEN_META[active];

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#F8FAFC" }}>
      <Sidebar active={active} onNav={setActive} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Header title={meta.title} subtitle={meta.sub} />
        <main style={{ flex: 1, overflowY: "auto", padding: "20px 28px" }}>
          {active === "today" && <TodayScreen />}
          {active === "queue" && <QueueScreen />}
          {active === "procurement" && <ProcurementScreen />}
          {active === "arrivals" && <PlaceholderScreen label="Arrivals Module" />}
          {active === "payments" && <PlaceholderScreen label="Payments & DBT Module" />}
        </main>
      </div>
    </div>
  );
}

