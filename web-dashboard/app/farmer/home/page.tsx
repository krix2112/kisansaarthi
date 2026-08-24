'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Clock,
  ChevronRight,
  FileText,
  PhoneCall,
  ListFilter,
  TrendingUp,
  User,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Phone,
  ShieldCheck,
  ArrowUpRight,
  RefreshCw,
  Navigation,
  Check
} from 'lucide-react';

type BookingState = 'BOOKED' | 'IN_QUEUE' | 'PROCURED' | 'PAID' | 'NO_BOOKING';
type Language = 'HI' | 'EN';

export default function FarmerHomePage() {
  const [lang, setLang] = useState<Language>('HI');
  const [bookingState, setBookingState] = useState<BookingState>('BOOKED');
  const [queueAhead, setQueueAhead] = useState(4);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);

  // Simulated live queue updates
  useEffect(() => {
    if (bookingState === 'IN_QUEUE') {
      const timer = setInterval(() => {
        setQueueAhead((prev) => (prev > 1 ? prev - 1 : 4));
      }, 12000);
      return () => clearInterval(timer);
    }
  }, [bookingState]);

  const refreshQueue = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // Farmer profile mock data
  const farmer = {
    name: 'Ramesh Yadav',
    nameHi: 'रमेश यादव',
    village: 'Sehore Village',
    villageHi: 'सीहोर ग्राम',
    mandal: 'Bhopal District',
    mandalHi: 'भोपाल जिला',
    token: 'T-054',
    crop: 'Wheat (गेहूं)',
    quantity: '42 Quintals',
    slotDate: '26 August 2026',
    slotTime: '09:30 AM',
    mandiName: 'Sehore Main Mandi (Gala No. 4)',
    mandiNameHi: 'सीहोर मुख्य मंडी (गाला नं. 4)',
    amount: '₹98,700',
    utr: 'PFMS-DBT-2026-991204',
    blockHash: '0x8f3a8b29f0e1d4c781a92e4b6c3d5f1a7b8c9d0e',
  };

  const isHindi = lang === 'HI';

  // Stepper vocabulary matching staff dashboard's StatusBadge
  const stepperStages = [
    { key: 'booked', labelEn: 'Booked', labelHi: 'बुक्ड' },
    { key: 'arrived', labelEn: 'Arrived', labelHi: 'पहुंचे' },
    { key: 'queue', labelEn: 'In Queue', labelHi: 'कतार में' },
    { key: 'procured', labelEn: 'Procured', labelHi: 'खरीद पूरी' },
    { key: 'processing', labelEn: 'Processing', labelHi: 'भुगतान जारी' },
    { key: 'paid', labelEn: 'Paid (DBT)', labelHi: 'भुगतान सफल' },
  ];

  const getActiveStepIndex = () => {
    switch (bookingState) {
      case 'BOOKED':
        return 0;
      case 'IN_QUEUE':
        return 2;
      case 'PROCURED':
        return 4;
      case 'PAID':
        return 5;
      default:
        return -1;
    }
  };

  return (
    <div className="space-y-6 text-government-text">
      {/* ── Demo State Controls & Language Bar ──────────────────────────── */}
      <div className="bg-white border border-government-border rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-government-text-secondary">
          <span>{isHindi ? 'प्रदर्शन स्थिति (Demo State):' : 'Demo Booking State:'}</span>
          <div className="flex flex-wrap gap-1">
            {(['BOOKED', 'IN_QUEUE', 'PROCURED', 'PAID', 'NO_BOOKING'] as BookingState[]).map((st) => (
              <button
                key={st}
                onClick={() => setBookingState(st)}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                  bookingState === st
                    ? 'bg-government-primary text-white'
                    : 'bg-government-bg text-government-text hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Language Toggle (EN / हिंदी) */}
        <div className="flex items-center gap-1 bg-government-bg p-1 rounded-md border border-government-border">
          <button
            onClick={() => setLang('EN')}
            className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
              lang === 'EN'
                ? 'bg-white text-government-primary shadow-xs'
                : 'text-government-text-secondary hover:text-government-text'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLang('HI')}
            className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
              lang === 'HI'
                ? 'bg-government-primary text-white shadow-xs'
                : 'text-government-text-secondary hover:text-government-text'
            }`}
          >
            हिंदी
          </button>
        </div>
      </div>

      {/* ── 1. Greeting Header Strip ────────────────────────────────────── */}
      <div className="bg-white border border-government-border rounded-xl p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xs">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-government-text tracking-tight flex items-center gap-2">
            {isHindi ? `नमस्ते, ${farmer.nameHi} जी` : `Namaste, ${farmer.name} ji`}
          </h1>
          <p className="text-base font-medium text-government-text-secondary mt-1 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-government-primary shrink-0" strokeWidth={1.5} />
            <span>{isHindi ? `${farmer.villageHi} · ${farmer.mandalHi}` : `${farmer.village} · ${farmer.mandal}`}</span>
          </p>
        </div>

        <div className="flex flex-col md:items-end gap-1.5 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-government-border">
          <div className="text-sm font-semibold text-government-text-secondary">
            24 August 2026
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-government-primary border border-government-primary/30 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{isHindi ? 'सिस्टम लाइव (System Live)' : 'System Live'}</span>
          </div>
        </div>
      </div>

      {/* ── 2. Primary Status Card (State Machine) ──────────────────────── */}
      <div className="bg-white border-l-4 border-l-government-primary border border-government-border rounded-xl p-6 md:p-8 shadow-sm">
        {/* State A: BOOKED */}
        {bookingState === 'BOOKED' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-government-border pb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded bg-emerald-100 text-government-primary text-xs font-bold uppercase tracking-wider">
                  {isHindi ? 'आगामी स्लॉट (Upcoming Slot)' : 'Upcoming Slot'}
                </span>
                <span className="text-xs text-government-text-secondary font-medium">
                  {isHindi ? 'खरीद कोड: #PROC-8812' : 'Booking Ref: #PROC-8812'}
                </span>
              </div>
              <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                {isHindi ? '⏳ 2 दिन में' : '⏳ in 2 days'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-xs font-bold uppercase text-government-text-secondary tracking-wider mb-1">
                  {isHindi ? 'दिनांक एवं समय (Date & Time)' : 'Date & Time'}
                </div>
                <div className="text-2xl font-extrabold text-government-text flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-government-primary" strokeWidth={1.5} />
                  <span>{farmer.slotDate}</span>
                </div>
                <div className="text-base font-semibold text-government-primary mt-1 flex items-center gap-1">
                  <Clock className="w-4 h-4" strokeWidth={1.5} />
                  <span>{farmer.slotTime}</span>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold uppercase text-government-text-secondary tracking-wider mb-1">
                  {isHindi ? 'उपार्जन केंद्र (Procurement Centre)' : 'Procurement Centre'}
                </div>
                <div className="text-lg font-bold text-government-text flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-government-primary shrink-0 mt-0.5" strokeWidth={1.5} />
                  <span>{isHindi ? farmer.mandiNameHi : farmer.mandiName}</span>
                </div>
                <div className="text-sm text-government-text-secondary mt-1 font-medium">
                  {isHindi ? `फसल: ${farmer.crop} · मात्रा: ${farmer.quantity}` : `Crop: ${farmer.crop} · Qty: ${farmer.quantity}`}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="min-h-[44px] px-5 py-2.5 rounded-lg bg-government-primary text-white font-semibold text-base flex items-center gap-2 hover:bg-emerald-900 transition-colors shadow-xs"
              >
                <Navigation className="w-5 h-5" strokeWidth={1.5} />
                <span>{isHindi ? 'दिशा-निर्देश प्राप्त करें (Get Directions)' : 'Get Directions'}</span>
              </a>
              <Link
                href="/farmer/register"
                className="min-h-[44px] px-5 py-2.5 rounded-lg bg-government-bg text-government-text font-semibold text-base border border-government-border flex items-center gap-2 hover:bg-slate-200 transition-colors"
              >
                <Calendar className="w-5 h-5 text-government-text-secondary" strokeWidth={1.5} />
                <span>{isHindi ? 'स्लॉट बदलें (Reschedule)' : 'Reschedule Slot'}</span>
              </Link>
            </div>
          </div>
        )}

        {/* State B: IN_QUEUE */}
        {bookingState === 'IN_QUEUE' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-government-border pb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
                  {isHindi ? 'लाइव कतार स्थिति (Live Queue)' : 'Live Queue Active'}
                </span>
                <span className="text-xs text-government-text-secondary font-medium">
                  {isHindi ? 'मंडी गेट 2 · सीहोर' : 'Mandi Gate 2 · Sehore'}
                </span>
              </div>
              <button
                onClick={refreshQueue}
                className="text-xs text-government-primary font-bold flex items-center gap-1 hover:underline min-h-[36px] px-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} strokeWidth={1.5} />
                <span>{isHindi ? 'अपडेट करें' : 'Refresh'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
                <div className="text-xs font-bold text-government-primary uppercase tracking-wider">
                  {isHindi ? 'आपका टोकन नंबर' : 'Your Token Number'}
                </div>
                <div className="text-4xl font-extrabold text-government-primary mt-1">
                  {farmer.token}
                </div>
                <div className="text-xs text-emerald-800 font-semibold mt-1">
                  {isHindi ? 'गेट पास सत्यापित' : 'Gate Pass Verified'}
                </div>
              </div>

              <div className="space-y-2 text-center md:text-left">
                <div className="text-xs font-bold uppercase text-government-text-secondary tracking-wider">
                  {isHindi ? 'आपसे आगे कुल किसान' : 'Farmers Ahead of You'}
                </div>
                <div className="text-3xl font-extrabold text-government-text flex items-center justify-center md:justify-start gap-2">
                  <span>{queueAhead}</span>
                  <span className="text-base font-normal text-government-text-secondary">
                    {isHindi ? 'किसान' : 'farmers'}
                  </span>
                </div>
                <p className="text-sm text-government-text-secondary font-medium">
                  {isHindi ? 'मंडी तौल कांटा 4 पर कार्यवाही जारी' : 'Processing at Weighbridge Scale 4'}
                </p>
              </div>

              <div className="bg-government-bg border border-government-border rounded-xl p-5 text-center">
                <div className="text-xs font-bold text-government-text-secondary uppercase tracking-wider">
                  {isHindi ? 'अनुमानित प्रतीक्षा समय' : 'Est. Wait Time'}
                </div>
                <div className="text-3xl font-extrabold text-government-text mt-1 flex items-center justify-center gap-1">
                  <Clock className="w-6 h-6 text-amber-700" strokeWidth={1.5} />
                  <span>~{queueAhead * 6} mins</span>
                </div>
                <div className="text-xs text-government-text-secondary mt-1">
                  {isHindi ? 'त्वरित तौल सुविधा उपलब्ध' : 'Express Weighbridge Available'}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-start">
              <Link
                href="/farmer/queue"
                className="min-h-[44px] px-5 py-2.5 rounded-lg bg-government-primary text-white font-semibold text-base inline-flex items-center gap-2 hover:bg-emerald-900 transition-colors shadow-xs"
              >
                <ListFilter className="w-5 h-5" strokeWidth={1.5} />
                <span>{isHindi ? 'संपूर्ण लाइव कतार देखें (View Full Live Queue)' : 'View Full Live Queue'}</span>
              </Link>
            </div>
          </div>
        )}

        {/* State C & D: PROCURED / PAYMENT_PROCESSING / PAID */}
        {(bookingState === 'PROCURED' || bookingState === 'PAID') && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-government-border pb-4">
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                    bookingState === 'PAID'
                      ? 'bg-emerald-100 text-government-primary'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {bookingState === 'PAID'
                    ? isHindi
                      ? 'भुगतान संपन्न (Payment Settled)'
                      : 'Payment Settled'
                    : isHindi
                    ? 'खरीद संपन्न (Procurement Complete)'
                    : 'Procurement Complete'}
                </span>
                <span className="text-xs text-government-text-secondary font-medium">
                  {isHindi ? 'रसीद सं: #PR-2026-8812' : 'Receipt: #PR-2026-8812'}
                </span>
              </div>
              <span className="text-xs text-government-text font-bold font-mono">
                {farmer.amount}
              </span>
            </div>

            {/* 6-Stage Stepper Vocabulary */}
            <div>
              <div className="text-xs font-bold uppercase text-government-text-secondary tracking-wider mb-3">
                {isHindi ? 'उपार्जन एवं भुगतान प्रगति (Procurement Stepper)' : 'Procurement & Payment Stepper'}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {stepperStages.map((st, idx) => {
                  const activeIdx = getActiveStepIndex();
                  const isDone = idx <= activeIdx;
                  const isCurrent = idx === activeIdx;

                  return (
                    <div
                      key={st.key}
                      className={`p-2.5 rounded-lg border text-center transition-all ${
                        isCurrent
                          ? 'bg-government-primary text-white border-government-primary font-bold shadow-xs'
                          : isDone
                          ? 'bg-emerald-50 text-government-primary border-emerald-200 font-semibold'
                          : 'bg-government-bg text-government-text-secondary border-government-border'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1 mb-1">
                        {isDone ? (
                          <Check className="w-3.5 h-3.5" strokeWidth={2} />
                        ) : (
                          <span className="text-[10px] opacity-60">0{idx + 1}</span>
                        )}
                      </div>
                      <div className="text-xs truncate">
                        {isHindi ? st.labelHi : st.labelEn}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* If PAID: Settled details & AgroChain reference */}
            {bookingState === 'PAID' ? (
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-government-primary" strokeWidth={1.5} />
                    <span className="text-base font-extrabold text-government-primary">
                      {isHindi ? `खाते में अंतरित राशि: ${farmer.amount}` : `Settled Amount: ${farmer.amount}`}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1 font-medium">
                    {isHindi
                      ? `PFMS UTR: ${farmer.utr} · खाता संख्या समाप्त ****4812`
                      : `PFMS UTR: ${farmer.utr} · Bank Account Ending ****4812`}
                  </p>
                </div>
                <button
                  onClick={() => setShowProofModal(true)}
                  className="min-h-[44px] px-4 py-2 rounded-lg bg-white border border-government-primary text-government-primary font-bold text-sm flex items-center gap-1.5 hover:bg-emerald-50 transition-colors shadow-xs"
                >
                  <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
                  <span>{isHindi ? 'ब्लॉकचेन प्रमाण देखें (View Proof)' : 'View Blockchain Proof'}</span>
                </button>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-700 shrink-0" strokeWidth={1.5} />
                  <span>
                    {isHindi
                      ? 'तौल सत्यापन पूर्ण ग्रेड A (42 क्विंटल)। DBT बैंक प्रेषण जारी है (24 घंटे में जमा)।'
                      : 'Weighment Grade A Verified (42 qtl). Direct Benefit Transfer queued for bank dispatch.'}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* State E: NO_BOOKING */}
        {bookingState === 'NO_BOOKING' && (
          <div className="space-y-4 text-center md:text-left py-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-100 text-government-text-secondary text-xs font-bold uppercase tracking-wider">
              <AlertCircle className="w-4 h-4 text-amber-600" strokeWidth={1.5} />
              <span>{isHindi ? 'कोई सक्रिय स्लॉट नहीं' : 'No Active Booking'}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-government-text">
              {isHindi ? 'रबी 2026-27 उपार्जन हेतु स्लॉट बुक करें' : 'Register for Rabi 2026-27 Wheat Procurement'}
            </h2>
            <p className="text-base text-government-text-secondary max-w-xl font-medium">
              {isHindi
                ? 'मध्य प्रदेश के 4,000+ उपार्जन केंद्रों पर समर्थन मूल्य (₹2,600/क्विंटल) पर गेहूं खरीद हेतु पंजीयन जारी है।'
                : 'MSP Wheat Procurement (₹2,600/quintal) is currently active across 4,000+ centers in Madhya Pradesh.'}
            </p>
            <div className="pt-2">
              <Link
                href="/farmer/register"
                className="min-h-[44px] px-6 py-3 rounded-lg bg-government-primary text-white font-bold text-base inline-flex items-center gap-2 hover:bg-emerald-900 transition-colors shadow-xs"
              >
                <FileText className="w-5 h-5" strokeWidth={1.5} />
                <span>{isHindi ? 'उपार्जन स्लॉट बुक करें (Register Procurement Slot)' : 'Register for Procurement Slot'}</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ── 3. Secondary Row (3 Compact Info Cards) ────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Today's Price for Registered Crop */}
        <div className="bg-white border border-government-border rounded-xl p-4 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-government-text-secondary tracking-wider">
                {isHindi ? 'गेहूं समर्थन मूल्य (Wheat MSP)' : 'Registered Crop MSP'}
              </span>
              <TrendingUp className="w-4 h-4 text-government-primary" strokeWidth={1.5} />
            </div>
            <div className="text-2xl font-extrabold text-government-text mt-2">
              ₹2,600 <span className="text-xs font-semibold text-government-text-secondary">/ quintal</span>
            </div>
            <div className="text-xs text-emerald-700 font-semibold mt-0.5">
              {isHindi ? 'मंडी मॉडल भाव: ₹2,348/क्विंटल' : 'Mandi Modal: ₹2,348/quintal'}
            </div>
          </div>
          <div className="text-[11px] text-government-text-secondary font-medium pt-3 border-t border-government-border/50 mt-3">
            data.gov.in · Agmarknet
          </div>
        </div>

        {/* Card 2: Centre Queue Load */}
        <div className="bg-white border border-government-border rounded-xl p-4 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-government-text-secondary tracking-wider">
                {isHindi ? 'केंद्र भार (Queue Load)' : 'Centre Queue Load'}
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            </div>
            <div className="text-base font-bold text-government-text mt-2">
              Sehore Main Mandi
            </div>
            <div className="text-sm font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded inline-block mt-1">
              {isHindi ? 'मध्यम प्रतीक्षा (12 वाहन द्वार पर)' : 'Moderate Wait (12 vehicles)'}
            </div>
          </div>
          <div className="text-[11px] text-government-text-secondary font-medium pt-3 border-t border-government-border/50 mt-3">
            {isHindi ? 'तौल कांटा समय: 15-20 मिनट' : 'Avg Weighment: 15-20 mins'}
          </div>
        </div>

        {/* Card 3: Need Help? Toll-Free Helpline */}
        <div className="bg-white border border-government-border rounded-xl p-4 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-government-text-secondary tracking-wider">
                {isHindi ? 'सहायता हेल्पलाइन' : 'Need Help?'}
              </span>
              <PhoneCall className="w-4 h-4 text-government-primary" strokeWidth={1.5} />
            </div>
            <div className="text-sm font-bold text-government-text mt-2">
              {isHindi ? 'किसानसारथी टोल-फ्री सपोर्ट' : 'Call KisanSaarthi Helpline'}
            </div>
            <a
              href="tel:18001801551"
              className="text-lg font-extrabold text-government-primary hover:underline flex items-center gap-1.5 mt-1"
            >
              <Phone className="w-4 h-4" strokeWidth={1.5} />
              <span>1800-180-1551</span>
            </a>
          </div>
          <div className="text-[11px] text-government-text-secondary font-medium pt-3 border-t border-government-border/50 mt-3">
            {isHindi ? '24x7 निःशुल्क वॉइस सपोर्ट उपलब्ध' : '24x7 Voice AI & Operator Line'}
          </div>
        </div>
      </div>

      {/* ── 4. Recent Activity Strip (Vertical Timeline) ────────────────── */}
      <div className="bg-white border border-government-border rounded-xl p-5 md:p-6 shadow-xs">
        <h3 className="text-base font-bold text-government-text mb-4 flex items-center justify-between border-b border-government-border pb-3">
          <span>{isHindi ? 'हाल की गतिविधियां (Recent Activity)' : 'Recent Activity Timeline'}</span>
          <span className="text-xs text-government-text-secondary font-semibold">
            {isHindi ? 'नवीनतम 4 अपडेट' : 'Last 4 Events'}
          </span>
        </h3>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-government-border">
          {/* Event 1 */}
          <div className="relative">
            <span className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white ring-2 ring-emerald-100" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-base font-bold text-government-text">
                {isHindi ? 'खरीद रसीद जारी की गई (#PR-8812)' : 'Procurement Receipt #PR-8812 Issued'}
              </span>
              <span className="text-xs text-government-text-secondary font-semibold">Today, 14:15</span>
            </div>
            <p className="text-sm text-government-text-secondary font-medium mt-0.5">
              {isHindi ? 'गेहूं ग्रेड A · 42 क्विंटल · कुल ₹98,700 स्वीकृत' : 'Wheat Grade A · 42 Quintals · Total ₹98,700 Approved'}
            </p>
          </div>

          {/* Event 2 */}
          <div className="relative">
            <span className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white ring-2 ring-emerald-100" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-base font-bold text-government-text">
                {isHindi ? 'मंडी द्वार प्रवेश सत्यापित (टोकन T-054)' : 'Gate Entry Verified (Token T-054)'}
              </span>
              <span className="text-xs text-government-text-secondary font-semibold">Today, 09:30</span>
            </div>
            <p className="text-sm text-government-text-secondary font-medium mt-0.5">
              {isHindi ? 'सीहोर मुख्य मंडी · तौल कांटा 4 पर प्रवेश' : 'Sehore Main Mandi · Entry at Weighbridge 4'}
            </p>
          </div>

          {/* Event 3 */}
          <div className="relative">
            <span className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-slate-400 border-2 border-white" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-base font-bold text-government-text">
                {isHindi ? 'उपार्जन स्लॉट बुक किया गया' : 'Procurement Slot Booked'}
              </span>
              <span className="text-xs text-government-text-secondary font-semibold">22 Aug 2026</span>
            </div>
            <p className="text-sm text-government-text-secondary font-medium mt-0.5">
              {isHindi ? 'किसानकॉल वॉइस एजेंट सहायता से बुक किया गया' : 'Booked via KisanCall Voice AI Agent Assistance'}
            </p>
          </div>

          {/* Event 4 */}
          <div className="relative">
            <span className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-slate-400 border-2 border-white" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-base font-bold text-government-text">
                {isHindi ? 'कृषक पंजीयन सत्यापित' : 'Farmer Registration Verified'}
              </span>
              <span className="text-xs text-government-text-secondary font-semibold">20 Aug 2026</span>
            </div>
            <p className="text-sm text-government-text-secondary font-medium mt-0.5">
              {isHindi ? 'आधार एवं भू-अभिलेख लिंक संपन्न' : 'Aadhaar & Land Records Synced with E-Uparjan Portal'}
            </p>
          </div>
        </div>
      </div>

      {/* ── 5. Quick Links Row (5 Icon+Label Tiles) ────────────────────── */}
      <div>
        <h3 className="text-base font-bold text-government-text mb-3">
          {isHindi ? 'त्वरित सेवाएं (Quick Services)' : 'Quick Services Directory'}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            {
              nameEn: 'Register Slot',
              nameHi: 'स्लॉट बुक करें',
              href: '/farmer/register',
              icon: FileText,
            },
            {
              nameEn: 'Live Queue',
              nameHi: 'लाइव कतार',
              href: '/farmer/queue',
              icon: ListFilter,
            },
            {
              nameEn: 'Mandi Prices',
              nameHi: 'मंडी भाव',
              href: '/farmer/price',
              icon: TrendingUp,
            },
            {
              nameEn: 'Call AI Agent',
              nameHi: 'वॉइस एजेंट',
              href: '/farmer/call-agent',
              icon: PhoneCall,
            },
            {
              nameEn: 'My Profile',
              nameHi: 'मेरी प्रोफाइल',
              href: '/farmer/profile',
              icon: User,
            },
          ].map((tile) => {
            const IconComponent = tile.icon;
            return (
              <Link
                key={tile.href}
                href={tile.href}
                className="min-h-[52px] bg-white border border-government-border rounded-lg p-3 flex items-center gap-3 hover:bg-emerald-50 hover:border-government-primary transition-all group shadow-xs"
              >
                <div className="w-8 h-8 rounded bg-government-bg text-government-primary flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                  <IconComponent className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div className="text-sm font-bold text-government-text group-hover:text-government-primary transition-colors leading-tight">
                  {isHindi ? tile.nameHi : tile.nameEn}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Blockchain Proof Modal ──────────────────────────────────────── */}
      {showProofModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-government-border rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-government-border pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-government-primary" strokeWidth={1.5} />
                <h3 className="text-lg font-bold text-government-text">
                  {isHindi ? 'AgroChain ब्लॉकचेन प्रमाण' : 'AgroChain Blockchain Verification'}
                </h3>
              </div>
              <button
                onClick={() => setShowProofModal(false)}
                className="text-government-text-secondary hover:text-government-text font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 font-medium">
                {isHindi
                  ? 'यह खरीद और भुगतान रिकॉर्ड AgroChain स्मार्ट कॉन्ट्रैक्ट पर स्थायी रूप से दर्ज है।'
                  : 'This procurement & DBT record is immutably anchored on AgroChain Ledger.'}
              </div>

              <div>
                <div className="text-xs font-bold text-government-text-secondary uppercase">
                  Transaction Hash
                </div>
                <div className="font-mono text-xs text-government-text bg-government-bg p-2 rounded border border-government-border break-all mt-1">
                  {farmer.blockHash}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-government-bg p-2 rounded border border-government-border">
                  <span className="text-government-text-secondary block">Smart Contract:</span>
                  <span className="font-bold font-mono">0x4F12...9A01</span>
                </div>
                <div className="bg-government-bg p-2 rounded border border-government-border">
                  <span className="text-government-text-secondary block">Block Number:</span>
                  <span className="font-bold font-mono">#18,940,219</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowProofModal(false)}
                className="min-h-[44px] px-5 py-2 rounded-lg bg-government-primary text-white font-bold text-sm hover:bg-emerald-900 transition-colors"
              >
                {isHindi ? 'बंद करें (Close)' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
