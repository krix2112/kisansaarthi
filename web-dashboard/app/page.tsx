'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  PhoneCall, MapPin, TrendingUp, Clock, CheckCircle,
  Mic, Radio, Navigation, ArrowRight, ChevronRight
} from 'lucide-react';

// ─── Data layer ────────────────────────────────────────────────────────────
// Wheat MSP is a real government-published figure for Rabi 2026-27.
// Other stats are sourced/illustrative; labeled accordingly.
const WHEAT_MSP = 2600; // ₹/quintal — GoI Rabi 2026-27 MSP

const STATS = [
  {
    value: '7,000+',
    label: 'Procurement Centres',
    caption: 'Rabi 2026-27 · DCA',
    live: false,
  },
  {
    value: `₹${WHEAT_MSP.toLocaleString('en-IN')}`,
    label: 'Today\'s Wheat MSP',
    caption: 'Rabi 2026-27 · Ministry of Agriculture',
    live: true,
  },
  {
    value: '1,656',
    label: 'Mandis on e-NAM',
    caption: 'As of 2025 · eNAM.gov.in',
    live: false,
  },
  {
    value: '24 × 7',
    label: 'Voice Support',
    caption: 'Hindi · English · 8 regional languages',
    live: false,
  },
];

const TICKER_NOTICES = [
  `Rabi 2026-27 wheat procurement now open across 7,000+ centres nationwide`,
  `Today's wheat MSP: ₹${WHEAT_MSP.toLocaleString('en-IN')}/quintal — GoI Rabi 2026-27`,
  `Book your mandi slot 48 hours in advance via KisanCall voice line`,
  `New: Instant DBT payment within 72 hours of successful procurement`,
  `Agmarknet live prices updated daily — check before you bring your crop`,
  `Help: Call 1800-XXX-XXXX (toll-free) for slot booking in Hindi or English`,
];

const PROCESS_STEPS = [
  {
    num: '01',
    icon: Navigation,
    title: 'Register',
    desc: 'One-time phone-number based registration. No paper form.',
  },
  {
    num: '02',
    icon: Clock,
    title: 'Book Your Slot',
    desc: 'Choose a mandi and time. Get a token number instantly.',
  },
  {
    num: '03',
    icon: Radio,
    title: 'Track Your Queue',
    desc: 'Live position updates via SMS or the portal. No waiting in the dark.',
  },
  {
    num: '04',
    icon: CheckCircle,
    title: 'Get Paid, Verified',
    desc: 'Amount transferred directly to your bank within 72 hours.',
  },
];

const TRUST_ITEMS = [
  'Data sourced from data.gov.in · Agmarknet',
  'Built for Smart India Hackathon 2026',
  'Dept. of Consumer Affairs, Food & Public Distribution',
  'e-NAM Integration · Ministry of Agriculture & Farmers\' Welfare',
];

// ─── Scroll-reveal wrapper ──────────────────────────────────────────────────
function FadeUp({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.38, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Live Ticker ───────────────────────────────────────────────────────────
function Ticker() {
  const text = TICKER_NOTICES.join('   ·   ') + '   ·   ' + TICKER_NOTICES.join('   ·   ');
  return (
    <div className="bg-government-primary text-white overflow-hidden select-none" style={{ height: '2rem' }}>
      <div className="flex items-center h-full">
        <span className="shrink-0 bg-government-accent text-government-text text-eyebrow uppercase tracking-widest px-3 h-full flex items-center font-bold mr-0 z-10" style={{ minWidth: 'max-content' }}>
          NOTICE
        </span>
        <div className="overflow-hidden flex-1 relative">
          <div className="animate-marquee whitespace-nowrap flex gap-0 text-body-sm font-medium opacity-95" style={{ willChange: 'transform' }}>
            <span className="inline-block px-6">{text}</span>
            <span className="inline-block px-6" aria-hidden="true">{text}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────
export default function WebHomePage() {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* ── Live ticker beneath header ── */}
      <Ticker />

      {/* ── Hero — asymmetric, left text / right image ── */}
      <section className="relative min-h-[88vh] flex items-stretch overflow-hidden bg-government-bg">
        {/* Left: text on solid ground */}
        <div className="relative z-10 w-full md:w-[48%] flex flex-col justify-center px-8 md:px-14 lg:px-20 py-section">
          <FadeUp delay={0}>
            <p className="text-eyebrow uppercase text-government-primary tracking-widest mb-5">
              Department of Consumer Affairs · Government of India
            </p>
          </FadeUp>
          <FadeUp delay={0.06}>
            <h1 className="text-h1 md:text-h1-xl font-bold text-government-text leading-[1.1] tracking-tight mb-6 max-w-[18ch]">
              Every farmer&apos;s procurement journey,&nbsp;on one line.
            </h1>
          </FadeUp>
          <FadeUp delay={0.12}>
            <p className="text-body-lg text-government-text-secondary mb-10 max-w-[42ch] leading-relaxed">
              KisanCall coordinates mandi slots, live queue tracking, and
              direct bank payments — all from a single voice call or this portal.
            </p>
          </FadeUp>
          <FadeUp delay={0.18}>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {/* Primary — Farmer (dominant user) */}
              <Link
                href="/farmer/login"
                className="inline-flex items-center gap-2.5 px-7 py-4 bg-government-primary text-white text-body font-semibold rounded hover:bg-government-secondary transition-colors"
              >
                Farmer Login
                <ArrowRight size={18} strokeWidth={1.5} />
              </Link>
              {/* Secondary — Staff (subordinate) */}
              <Link
                href="http://localhost:3001"
                className="inline-flex items-center gap-2 px-5 py-3 border border-government-border text-government-text-secondary text-body-sm font-medium rounded hover:border-government-primary hover:text-government-primary transition-colors"
              >
                Staff Portal
                <ChevronRight size={15} strokeWidth={1.5} />
              </Link>
            </div>
          </FadeUp>

          {/* Credibility micro-line */}
          <FadeUp delay={0.24}>
            <p className="mt-10 text-caption text-government-text-muted flex items-center gap-2">
              <span className="w-4 h-px bg-government-border inline-block" />
              Integrated with Agmarknet · e-NAM · PFMS
            </p>
          </FadeUp>
        </div>

        {/* Right: full-bleed wheat photo — directional gradient, not dark overlay */}
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[57%]">
          {/* Directional gradient: solid off-white on left edge → fully transparent */}
          <div
            className="absolute inset-0 z-10"
            style={{
              background:
                'linear-gradient(to right, #FAFAF7 0%, #FAFAF7 6%, rgba(250,250,247,0.7) 28%, rgba(250,250,247,0) 55%)',
            }}
          />
          <img
            src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=1600&auto=format&fit=crop"
            alt="Wheat fields — India"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </div>
      </section>

      {/* ── Stats bar — full-width, annual-report pull-quote style ── */}
      <section className="border-y border-government-border bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-government-border">
          {STATS.map((s, i) => (
            <FadeUp key={i} delay={i * 0.07} className="px-8 py-8 flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                <span className="text-stat text-government-primary font-extrabold tabular-nums">
                  {s.value}
                </span>
                {s.live && (
                  <span className="text-eyebrow uppercase text-government-accent tracking-widest ml-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-government-accent animate-pulse inline-block" />
                    Live
                  </span>
                )}
              </div>
              <div className="text-body-sm font-semibold text-government-text">{s.label}</div>
              <div className="text-caption text-government-text-muted mt-0.5">{s.caption}</div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ── How it works — horizontal numbered rail ── */}
      <section className="bg-government-bg py-section-lg">
        <div className="max-w-7xl mx-auto px-8 md:px-14 lg:px-20">
          <FadeUp>
            <p className="text-eyebrow uppercase text-government-primary tracking-widest mb-3">
              The Process
            </p>
            <h2 className="text-h2 text-government-text mb-section-sm max-w-[30ch]">
              From crop to verified payment — four steps.
            </h2>
          </FadeUp>

          {/* Step rail */}
          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-0">
            {/* Connecting line — desktop only */}
            <div className="hidden md:block absolute top-[2.25rem] left-[calc(12.5%+1rem)] right-[calc(12.5%+1rem)] h-px bg-government-border z-0" />

            {PROCESS_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <FadeUp key={i} delay={i * 0.1} className="relative flex flex-col items-start md:items-center text-left md:text-center px-0 md:px-6">
                  {/* Node */}
                  <div className="relative z-10 w-[4.5rem] h-[4.5rem] rounded-full border border-government-border bg-white flex flex-col items-center justify-center mb-5 shadow-sm">
                    <span className="text-eyebrow text-government-text-muted tracking-widest">{step.num}</span>
                    <Icon size={18} strokeWidth={1.5} className="text-government-primary mt-0.5" />
                  </div>
                  <h3 className="text-h3 font-semibold text-government-text mb-2">{step.title}</h3>
                  <p className="text-body-sm text-government-text-secondary leading-relaxed max-w-[22ch] md:max-w-[18ch]">
                    {step.desc}
                  </p>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Feature A: Voice AI — image left, text right ── */}
      <section className="bg-white border-t border-government-border py-section-lg">
        <div className="max-w-7xl mx-auto px-8 md:px-14 lg:px-20 grid md:grid-cols-2 gap-16 items-center">
          {/* Illustrative call transcript */}
          <FadeUp className="bg-government-bg border border-government-border rounded-sm p-7 font-sans">
            <div className="text-eyebrow uppercase text-government-text-muted tracking-widest mb-5">
              Sample call · KisanCall AI Agent
            </div>
            <div className="space-y-4">
              {/* Agent bubble */}
              <div className="flex gap-3 items-start">
                <div className="w-7 h-7 rounded-full bg-government-primary text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Mic size={13} strokeWidth={1.5} />
                </div>
                <div className="bg-government-primary/8 border border-government-border rounded-sm px-4 py-3 max-w-[82%]">
                  <p className="text-body-sm text-government-text leading-relaxed">
                    नमस्ते! मैं KisanCall हूँ। आपका टोकन नंबर T-048 है। कृपया बताएं — आज आप कितनी मात्रा में गेहूँ लाए हैं?
                  </p>
                  <p className="text-caption text-government-text-muted mt-1.5 italic">
                    Hello! I&apos;m KisanCall. Your token is T-048. Please tell me — how much wheat did you bring today?
                  </p>
                </div>
              </div>
              {/* Farmer bubble */}
              <div className="flex gap-3 items-start flex-row-reverse">
                <div className="w-7 h-7 rounded-full bg-government-border flex items-center justify-center shrink-0 mt-0.5 text-eyebrow font-bold text-government-text-muted">
                  R
                </div>
                <div className="bg-white border border-government-border rounded-sm px-4 py-3 max-w-[72%]">
                  <p className="text-body-sm text-government-text">पचास क्विंटल — ग्रेड A</p>
                  <p className="text-caption text-government-text-muted mt-1 italic">Fifty quintals — Grade A</p>
                </div>
              </div>
              {/* Agent confirmation */}
              <div className="flex gap-3 items-start">
                <div className="w-7 h-7 rounded-full bg-government-primary text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Mic size={13} strokeWidth={1.5} />
                </div>
                <div className="bg-government-primary/8 border border-government-border rounded-sm px-4 py-3 max-w-[82%]">
                  <p className="text-body-sm text-government-text leading-relaxed">
                    50 क्विंटल, Grade A — MSP पर ₹1,30,000। रसीद SMS पर भेजी जाएगी।
                  </p>
                  <p className="text-caption text-government-text-muted mt-1.5 italic">
                    50 q, Grade A — ₹1,30,000 at MSP. Receipt will be sent via SMS.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-caption text-government-text-muted mt-5 border-t border-government-border-light pt-3">
              Illustrative · KisanCall voice AI supports Hindi, English + 8 regional languages
            </p>
          </FadeUp>

          {/* Text */}
          <FadeUp delay={0.08}>
            <p className="text-eyebrow uppercase text-government-primary tracking-widest mb-4">Voice-First by Design</p>
            <h2 className="text-h2 text-government-text mb-5 leading-snug">
              The mandi, on a phone call. No smartphone needed.
            </h2>
            <p className="text-body text-government-text-secondary leading-relaxed mb-7">
              A farmer who has never used a smartphone can register, book a slot, and confirm their
              procurement entirely over a voice call — in Hindi, Punjabi, Marathi, or 5 other languages.
              The AI agent understands natural speech, confirms crop quantities, and dispatches
              receipts to any basic mobile via SMS.
            </p>
            <ul className="space-y-3">
              {['Works on 2G and basic feature phones', 'No app download, no registration form', 'Hindi speech recognition — MSE 2026 benchmark'].map((pt) => (
                <li key={pt} className="flex items-start gap-2.5 text-body-sm text-government-text">
                  <CheckCircle size={16} strokeWidth={1.5} className="text-government-primary shrink-0 mt-0.5" />
                  {pt}
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </section>

      {/* ── Feature B: Live Queue — text left, widget right ── */}
      <section className="bg-government-bg border-t border-government-border py-section-lg">
        <div className="max-w-7xl mx-auto px-8 md:px-14 lg:px-20 grid md:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <FadeUp>
            <p className="text-eyebrow uppercase text-government-primary tracking-widest mb-4">Live Queue Tracking</p>
            <h2 className="text-h2 text-government-text mb-5 leading-snug">
              Know exactly where you are. Down to the minute.
            </h2>
            <p className="text-body text-government-text-secondary leading-relaxed mb-7">
              Once your slot is booked, you can track your live position in the mandi queue from anywhere.
              The system auto-sends SMS updates when you move inside the top 5. No waiting in the
              sun for hours — drive to the mandi only when it&apos;s time.
            </p>
            <ul className="space-y-3">
              {['Real-time position updates every 5 minutes', 'SMS alerts when you enter top 5 queue', 'Estimated arrival time shown to mandi staff'].map((pt) => (
                <li key={pt} className="flex items-start gap-2.5 text-body-sm text-government-text">
                  <CheckCircle size={16} strokeWidth={1.5} className="text-government-primary shrink-0 mt-0.5" />
                  {pt}
                </li>
              ))}
            </ul>
          </FadeUp>

          {/* Queue widget mockup */}
          <FadeUp delay={0.08} className="bg-white border border-government-border rounded-sm overflow-hidden font-sans">
            {/* Widget header */}
            <div className="bg-government-primary text-white px-6 py-4 flex items-center justify-between">
              <div>
                <div className="text-body-sm font-semibold">Sehore Mandi · Queue</div>
                <div className="text-caption opacity-75 mt-0.5">Live · Updated 09:41 AM</div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-government-accent animate-pulse" />
                <span className="text-eyebrow text-government-accent uppercase tracking-widest">Live</span>
              </div>
            </div>

            {/* Currently serving */}
            <div className="px-6 py-5 border-b border-government-border bg-government-accent-light">
              <div className="text-eyebrow uppercase text-government-text-muted tracking-widest mb-2">Now Serving</div>
              <div className="flex items-baseline gap-3">
                <span className="text-stat text-government-primary font-extrabold">T-046</span>
                <span className="text-body-sm text-government-text-secondary">Dinesh Kumar · 42 q Wheat</span>
              </div>
            </div>

            {/* Your position */}
            <div className="px-6 py-5 border-b border-government-border">
              <div className="text-eyebrow uppercase text-government-text-muted tracking-widest mb-2">Your Token</div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-h2 text-government-text font-bold">T-048</span>
                  <p className="text-caption text-government-text-muted mt-1">Position 3 in queue · Est. 18 min</p>
                </div>
                <div className="w-16 h-16 rounded-full border-2 border-government-primary flex items-center justify-center">
                  <span className="text-h3 font-bold text-government-primary">3</span>
                </div>
              </div>
            </div>

            {/* Queue ahead */}
            <div className="px-6 py-4">
              <div className="text-eyebrow uppercase text-government-text-muted tracking-widest mb-3">Ahead of You</div>
              {[
                { token: 'T-047', name: 'Ramesh Yadav', eta: '~6 min' },
                { token: 'T-046', name: 'Currently serving', eta: '' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-government-border-light last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-caption font-bold text-government-primary w-10 tabular-nums">{item.token}</span>
                    <span className="text-body-sm text-government-text-secondary">{item.name}</span>
                  </div>
                  <span className="text-caption text-government-text-muted">{item.eta}</span>
                </div>
              ))}
            </div>

            <p className="px-6 pb-4 text-caption text-government-text-muted">
              Illustrative widget · Real data shown post-login
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── Trust / Credibility row ── */}
      <section className="bg-white border-t border-government-border py-section-sm">
        <div className="max-w-7xl mx-auto px-8 md:px-14 lg:px-20">
          <FadeUp>
            <div className="flex flex-wrap items-center gap-x-12 gap-y-4 justify-center md:justify-start">
              {TRUST_ITEMS.map((item, i) => (
                <span
                  key={i}
                  className="text-caption text-government-text-muted font-medium tracking-wide uppercase border-r border-government-border pr-12 last:border-0 last:pr-0"
                >
                  {item}
                </span>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Footer — real sitemap depth ── */}
      <footer className="bg-government-text text-white border-t border-government-border">
        <div className="max-w-7xl mx-auto px-8 md:px-14 lg:px-20 pt-14 pb-8 grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* For Farmers */}
          <div>
            <div className="text-eyebrow uppercase tracking-widest text-government-accent mb-5">For Farmers</div>
            <ul className="space-y-3">
              {[
                { label: 'Register', href: '/farmer/register' },
                { label: 'Book a Slot', href: '/farmer/home' },
                { label: 'Track Queue Status', href: '/farmer/queue' },
                { label: 'Find a Procurement Centre', href: '#' },
                { label: 'Mandi Prices', href: '/farmer/price' },
                { label: 'My Profile', href: '/farmer/profile' },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-body-sm text-white/70 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Staff */}
          <div>
            <div className="text-eyebrow uppercase tracking-widest text-government-accent mb-5">For Staff</div>
            <ul className="space-y-3">
              {[
                { label: 'Staff Portal Login', href: 'http://localhost:3001' },
                { label: 'Queue Management', href: '#' },
                { label: 'Procurement Entry', href: '#' },
                { label: 'DBT Payments', href: '#' },
                { label: 'Staff Support', href: '#' },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-body-sm text-white/70 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <div className="text-eyebrow uppercase tracking-widest text-government-accent mb-5">About</div>
            <ul className="space-y-3">
              {[
                'Problem Statement',
                'System Architecture',
                'Grievance Redressal',
                'RTI Requests',
                'Contact Us',
                'Accessibility',
              ].map((l) => (
                <li key={l}>
                  <a href="#" className="text-body-sm text-white/70 hover:text-white transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Ministry branding */}
          <div className="flex flex-col gap-4">
            <div>
              <div className="text-body-sm font-semibold text-white mb-1">KisanCall</div>
              <div className="text-caption text-white/60 leading-relaxed">
                Ministry of Consumer Affairs,<br />Food &amp; Public Distribution<br />
                Government of India
              </div>
            </div>
            <div className="mt-auto">
              <div className="text-eyebrow uppercase tracking-widest text-government-accent mb-2">Data Sources</div>
              <div className="text-caption text-white/60 leading-relaxed">
                data.gov.in · Agmarknet<br />
                eNAM · PFMS · NPCI UPI
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 max-w-7xl mx-auto px-8 md:px-14 lg:px-20 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <p className="text-caption text-white/40">
            &copy; {new Date().getFullYear()} Department of Consumer Affairs, Government of India.
            All data sourced from official government databases. This portal is for authorised
            procurement participants only.
          </p>
          <div className="flex gap-5 text-caption text-white/40">
            <a href="#" className="hover:text-white/70 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/70 transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-white/70 transition-colors">Sitemap</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
