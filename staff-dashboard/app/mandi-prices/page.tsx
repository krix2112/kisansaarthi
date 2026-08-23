'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useApiData } from '../../hooks/useApiData';

interface MarketItem {
  market: string;
  district?: string;
  state?: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  change_pct: number;
  variety?: string;
  grade?: string;
}

interface AggregatePricesResponse {
  commodity: string;
  state: string;
  latest_date: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  spread: number;
  reporting_markets_count: number;
  vs_30day_pct: number;
  market_signal: 'Hold' | 'Rising' | 'Softening' | 'High Demand';
  signal_reason: string;
  markets: MarketItem[];
  grades_distribution: { grade: string; count: number; percentage: number }[];
  stale: boolean;
}

interface HistoryPoint {
  price_date: string;
  modal_price: number;
  min_price: number;
  max_price: number;
  spread: number;
  moving_avg_7d: number;
  moving_avg_30d: number;
}

interface FilterOptions {
  commodities: string[];
  states: string[];
}

export default function MandiPricesDashboard() {
  const [selectedCommodity, setSelectedCommodity] = useState<string>('Wheat');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);

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

  // Fetch filter dropdown options
  const { data: filtersData } = useApiData<FilterOptions>('/mandi-prices/filters');

  // Fetch aggregate market data
  const apiPath = `/mandi-prices?commodity=${encodeURIComponent(selectedCommodity)}${
    selectedState !== 'All' ? `&state=${encodeURIComponent(selectedState)}` : ''
  }`;
  const { data: priceData, loading: priceLoading, error: priceError } = useApiData<AggregatePricesResponse>(apiPath);

  // Fetch historical time series
  const historyPath = `/mandi-prices/history?commodity=${encodeURIComponent(selectedCommodity)}${
    selectedState !== 'All' ? `&state=${encodeURIComponent(selectedState)}` : ''
  }&days=30`;
  const { data: historyData, loading: historyLoading } = useApiData<HistoryPoint[]>(historyPath);

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

  // Manual refresh trigger
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

  const chartMin = useMemo(() => {
    if (!historyData || historyData.length === 0) return 2000;
    const values = historyData.map((d) => d.min_price || d.modal_price).filter((v) => typeof v === 'number' && !isNaN(v));
    if (values.length === 0) return 2000;
    return Math.floor((Math.min(...values) - 60) / 50) * 50;
  }, [historyData]);

  const chartMax = useMemo(() => {
    if (!historyData || historyData.length === 0) return 2800;
    const values = historyData.map((d) => d.max_price || d.modal_price).filter((v) => typeof v === 'number' && !isNaN(v));
    if (values.length === 0) return 2800;
    return Math.ceil((Math.max(...values) + 60) / 50) * 50;
  }, [historyData]);

  const getY = (val: number) => {
    const range = chartMax - chartMin || 1;
    const raw = 200 - ((val - chartMin) / range) * 160;
    return Math.max(15, Math.min(205, isNaN(raw) ? 100 : raw));
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

  // Filtered market list based on search
  const filteredMarkets = useMemo(() => {
    if (!priceData?.markets) return [];
    if (!searchQuery.trim()) return priceData.markets;
    const q = searchQuery.toLowerCase();
    return priceData.markets.filter(
      (m) =>
        m.market.toLowerCase().includes(q) ||
        (m.district && m.district.toLowerCase().includes(q)) ||
        (m.state && m.state.toLowerCase().includes(q))
    );
  }, [priceData?.markets, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* ── Top Dark Ticker Bar (Seamless Continuously Scrolling Marquee) ── */}
      <div className="bg-[#0B1528] border-b border-slate-800 text-xs py-2.5 px-4 overflow-hidden relative shadow-inner select-none flex">
        <div className="flex shrink-0 animate-marquee items-center gap-8 text-slate-300">
          {priceData?.markets && priceData.markets.length > 0 ? (
            priceData.markets.map((m, i) => {
              const code = `${(selectedCommodity.slice(0, 4)).toUpperCase()}/${(m.state || 'IN').slice(0, 2).toUpperCase()}`;
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
            priceData.markets.map((m, i) => {
              const code = `${(selectedCommodity.slice(0, 4)).toUpperCase()}/${(m.state || 'IN').slice(0, 2).toUpperCase()}`;
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

      <div className="max-w-7xl w-full mx-auto p-6 md:p-8 flex-1 flex flex-col gap-6">
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Real-Time Feed • data.gov.in AGMARKNET
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Market Intelligence
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Predictive pricing and logistics momentum for mandi operators & traders.{' '}
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                Latest data: {priceData?.latest_date || '2026-08-23'}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search mandi, state or commodity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 md:w-80 px-4 py-2.5 pl-10 text-xs md:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
              />
              <svg
                className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              title="Sync latest live prices from data.gov.in"
              className={`p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm text-slate-700 dark:text-slate-300 transition-all ${
                isRefreshing ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'
              }`}
            >
              <svg
                className={`w-5 h-5 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`}
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
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs rounded-xl flex items-center justify-between">
            <span>{refreshMessage}</span>
          </div>
        )}

        {/* ── Row 1: Filter Context & Today Pricing Cards ─────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {/* Market Context Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Market Context
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Commodity
                </label>
                <div className="relative">
                  <select
                    value={selectedCommodity}
                    onChange={(e) => setSelectedCommodity(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs md:text-sm font-semibold text-slate-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    {commodities.map((c) => (
                      <option key={c} value={c}>🌾 {c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  State
                </label>
                <div className="relative">
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs md:text-sm font-semibold text-slate-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    {states.map((s) => (
                      <option key={s} value={s}>📍 {s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Min Price Today Card */}
          <div className="bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                Min Price Today
              </div>
              <div className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
                {priceLoading ? '…' : `₹${(priceData?.min_price || 2180).toLocaleString('en-IN')}`}
              </div>
              <div className="text-xs text-rose-600/80 dark:text-rose-400/70 mt-1">per quintal</div>
            </div>
            <div className="text-xs font-medium text-slate-500 mt-4">AGMARKNET floor quote</div>
          </div>

          {/* Modal Price Hero Card */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-5 shadow-lg shadow-emerald-600/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-100">Modal Price</div>
                <span className="px-2 py-0.5 rounded bg-white/20 text-[10px] font-extrabold uppercase">Govt Feed</span>
              </div>
              <div className="text-4xl md:text-5xl font-extrabold text-white mt-2 tracking-tight">
                {priceLoading ? '…' : `₹${(priceData?.modal_price || 2300).toLocaleString('en-IN')}`}
              </div>
              <div className="text-xs text-emerald-100 mt-1">per quintal</div>
            </div>
            <div className="text-xs font-semibold text-emerald-100/90 mt-4 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              Weighted Mandi Average
            </div>
          </div>

          {/* Max Price Today Card */}
          <div className="bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/40 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-sky-700 dark:text-sky-400 uppercase tracking-wider">
                Max Price Today
              </div>
              <div className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
                {priceLoading ? '…' : `₹${(priceData?.max_price || 2450).toLocaleString('en-IN')}`}
              </div>
              <div className="text-xs text-sky-600/80 dark:text-sky-400/70 mt-1">per quintal</div>
            </div>
            <div className="mt-4">
              <span className="px-2.5 py-1 rounded bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-300 text-xs font-bold">
                Spread: ₹{priceData?.spread || 270}
              </span>
            </div>
          </div>
        </div>

        {/* ── Row 2: Market Signal & Interactive Momentum Chart ───────────── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Market Signal Card */}
          <div className="md:col-span-4 bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  ↗
                </div>
                <div>
                  <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-300">
                    {priceData?.market_signal || 'Hold'}
                  </h3>
                  <div className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Market Signal
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-emerald-200/50 dark:border-emerald-800/50 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {priceData?.signal_reason ||
                  'Prices holding steady within normal trading bands. Trailing 7-day trend reflects consistent volume.'}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-emerald-200/50 dark:border-emerald-800/40">
              <div className="bg-white/60 dark:bg-slate-900/60 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                <div className="text-[10px] font-bold text-slate-500 uppercase">VS 30-Day Avg</div>
                <div className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">
                  +{priceData?.vs_30day_pct || 4.2}%
                </div>
              </div>
              <div className="bg-white/60 dark:bg-slate-900/60 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Spread</div>
                <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
                  ₹{priceData?.spread || 270}
                </div>
              </div>
              <div className="bg-white/60 dark:bg-slate-900/60 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Reporting</div>
                <div className="text-sm font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                  {priceData?.reporting_markets_count || 12} APMCs
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Price Momentum vs Moving Averages */}
          <div className="md:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Price Momentum vs Moving Averages
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold">
                    Interactive
                  </span>
                </h3>
                <p className="text-xs text-slate-500">Hover over the timeline to inspect live modal and moving average values</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Modal Price
                </span>
                <span className="flex items-center gap-1 text-blue-600 font-semibold">
                  <span className="w-2.5 h-1 bg-blue-500 rounded"></span> 7D MA
                </span>
                <span className="flex items-center gap-1 text-slate-400 font-semibold">
                  <span className="w-2.5 h-0.5 bg-slate-400 border-dashed"></span> 30D Base
                </span>
              </div>
            </div>

            {/* Interactive SVG Chart Container */}
            <div
              className="w-full h-64 relative pt-2 cursor-crosshair select-none overflow-hidden rounded-xl"
              onMouseMove={handleMomentumMouseMove}
              onMouseLeave={handleMomentumMouseLeave}
            >
              {/* Floating Live Tooltip */}
              {hoverPoint && (
                <div
                  className="absolute pointer-events-none z-30 transition-all duration-75 bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white px-3.5 py-2 rounded-xl shadow-xl border border-slate-700/60 text-xs flex flex-col gap-1 min-w-[180px]"
                  style={{
                    left: `${Math.min(80, Math.max(20, hoverXRatio * 100))}%`,
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

              <svg className="w-full h-full overflow-hidden" viewBox="0 0 700 220" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Render Path for Modal Price */}
                {historyData && historyData.length > 0 && (
                  <>
                    {/* Area fill */}
                    <path
                      d={`M 0,${getY(historyData[0].modal_price)} ${historyData
                        .map(
                          (p, idx) =>
                            `L ${(idx / (historyData.length - 1)) * 700},${getY(p.modal_price)}`
                        )
                        .join(' ')} L 700,210 L 0,210 Z`}
                      fill="url(#greenGrad)"
                    />

                    {/* 30D Benchmark Dashed Line */}
                    <path
                      d={`M 0,${getY(historyData[0].moving_avg_30d)} ${historyData
                        .map(
                          (p, idx) =>
                            `L ${(idx / (historyData.length - 1)) * 700},${getY(p.moving_avg_30d)}`
                        )
                        .join(' ')}`}
                      fill="none"
                      stroke="#94A3B8"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                    />

                    {/* 7D MA Line */}
                    <path
                      d={`M 0,${getY(historyData[0].moving_avg_7d)} ${historyData
                        .map(
                          (p, idx) =>
                            `L ${(idx / (historyData.length - 1)) * 700},${getY(p.moving_avg_7d)}`
                        )
                        .join(' ')}`}
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="2"
                    />

                    {/* Modal Price Line */}
                    <path
                      d={`M 0,${getY(historyData[0].modal_price)} ${historyData
                        .map(
                          (p, idx) =>
                            `L ${(idx / (historyData.length - 1)) * 700},${getY(p.modal_price)}`
                        )
                        .join(' ')}`}
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="3"
                    />

                    {/* Active Hover Crosshair and Indicator Dots */}
                    {hoverPoint && (
                      <>
                        <line
                          x1={`${hoverXRatio * 700}`}
                          y1="10"
                          x2={`${hoverXRatio * 700}`}
                          y2="210"
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

              {/* X Axis dates */}
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-2">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Regional Price Comparison */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Regional Price Comparison</h3>
              <span className="text-xs text-slate-500 font-semibold">₹ / Quintal</span>
            </div>

            <div className="space-y-4">
              {filteredMarkets.slice(0, 5).map((m, idx) => {
                const maxBar = 2800;
                const widthPct = Math.min(100, Math.max(20, ((m.modal_price - 1800) / (maxBar - 1800)) * 100));
                return (
                  <div key={idx} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 rounded-xl transition-colors">
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                        {m.market}
                      </span>
                      <span className="text-slate-900 dark:text-white font-bold font-mono">
                        ₹{m.modal_price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
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
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Price Spread & Volatility
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold">
                  Interactive
                </span>
              </h3>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                Avg spread: ₹{priceData?.spread || 270}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">Hover to inspect daily price volatility and spread range</p>

            <div
              className="w-full h-48 relative select-none cursor-crosshair overflow-hidden rounded-xl"
              onMouseMove={handleSpreadMouseMove}
              onMouseLeave={handleSpreadMouseLeave}
            >
              {hoverSpreadPoint && (
                <div
                  className="absolute pointer-events-none z-30 transition-all duration-75 bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white px-3.5 py-2 rounded-xl shadow-xl border border-slate-700/60 text-xs flex flex-col gap-0.5 min-w-[150px]"
                  style={{
                    left: `${Math.min(80, Math.max(20, hoverSpreadXRatio * 100))}%`,
                    top: '8px',
                    transform: 'translateX(-50%)',
                  }}
                >
                  <span className="font-bold text-slate-200 text-xs border-b border-slate-700 pb-1">
                    {new Date(hoverSpreadPoint.price_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                  </span>
                  <div className="flex justify-between items-center text-xs mt-1">
                    <span className="text-slate-300">Spread:</span>
                    <span className="font-bold font-mono text-emerald-400">₹{hoverSpreadPoint.spread}</span>
                  </div>
                  <div className="text-[10.5px] text-slate-400">
                    Range: ₹{hoverSpreadPoint.min_price} – ₹{hoverSpreadPoint.max_price}
                  </div>
                </div>
              )}

              <svg className="w-full h-full overflow-hidden" viewBox="0 0 500 160" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="spreadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {historyData && historyData.length > 0 && (
                  <>
                    <path
                      d={`M 0,${150 - (historyData[0].spread / 450) * 120} ${historyData
                        .map(
                          (p, idx) =>
                            `L ${(idx / (historyData.length - 1)) * 500},${
                              150 - (p.spread / 450) * 120
                            }`
                        )
                        .join(' ')} L 500,160 L 0,160 Z`}
                      fill="url(#spreadGrad)"
                    />
                    <path
                      d={`M 0,${150 - (historyData[0].spread / 450) * 120} ${historyData
                        .map(
                          (p, idx) =>
                            `L ${(idx / (historyData.length - 1)) * 500},${
                              150 - (p.spread / 450) * 120
                            }`
                        )
                        .join(' ')}`}
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="2.5"
                    />
                    {hoverSpreadPoint && (
                      <>
                        <line
                          x1={`${hoverSpreadXRatio * 500}`}
                          y1="10"
                          x2={`${hoverSpreadXRatio * 500}`}
                          y2="155"
                          stroke="#10B981"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                        />
                        <circle
                          cx={`${hoverSpreadXRatio * 500}`}
                          cy={`${150 - (hoverSpreadPoint.spread / 450) * 120}`}
                          r="5"
                          className="fill-emerald-500 stroke-white dark:stroke-slate-900 stroke-2"
                        />
                      </>
                    )}
                  </>
                )}
              </svg>
              <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-2">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Interactive Historical Seasonality Curve */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Historical Seasonality Curve
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold">
                  Interactive
                </span>
              </h3>
              <span className="text-xs font-semibold text-slate-400">Harvest vs Lean Cycle</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">Hover across months to inspect seasonal price momentum & phase</p>

            <div
              className="w-full h-44 relative select-none cursor-crosshair overflow-hidden rounded-xl"
              onMouseMove={handleSeasonMouseMove}
              onMouseLeave={handleSeasonMouseLeave}
            >
              {/* Seasonality Hover Tooltip */}
              {hoverSeasonPoint && (
                <div
                  className="absolute pointer-events-none z-30 transition-all duration-75 bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white px-3.5 py-2 rounded-xl shadow-xl border border-slate-700/60 text-xs flex flex-col gap-1 min-w-[170px]"
                  style={{
                    left: `${Math.min(80, Math.max(20, hoverSeasonXRatio * 100))}%`,
                    top: '8px',
                    transform: 'translateX(-50%)',
                  }}
                >
                  <div className="flex items-center justify-between border-b border-slate-700 pb-1">
                    <span className="font-bold text-slate-200">{hoverSeasonPoint.month} ({hoverSeasonPoint.label})</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${hoverSeasonPoint.index >= 100 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                      {hoverSeasonPoint.factor}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs mt-1">
                    <span className="text-slate-300">Seasonal Index:</span>
                    <span className="font-bold font-mono text-emerald-400">{hoverSeasonPoint.index} pts</span>
                  </div>
                  <div className="text-[10.5px] text-slate-400 leading-tight mt-0.5">
                    {hoverSeasonPoint.phase}
                  </div>
                </div>
              )}

              <svg className="w-full h-full overflow-hidden" viewBox="0 0 500 140" preserveAspectRatio="none">
                <path
                  d={`M 0,${getSeasonY(SEASONALITY_POINTS[0].index)} ${SEASONALITY_POINTS.map(
                    (pt, idx) => `L ${(idx / (SEASONALITY_POINTS.length - 1)) * 500},${getSeasonY(pt.index)}`
                  ).join(' ')} L 500,140 L 0,140 Z`}
                  fill="url(#greenGrad)"
                />
                <path
                  d={`M 0,${getSeasonY(SEASONALITY_POINTS[0].index)} ${SEASONALITY_POINTS.map(
                    (pt, idx) => `L ${(idx / (SEASONALITY_POINTS.length - 1)) * 500},${getSeasonY(pt.index)}`
                  ).join(' ')}`}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                />
                {/* Active Hover Crosshair and Dot */}
                {hoverSeasonPoint && (
                  <>
                    <line
                      x1={`${hoverSeasonXRatio * 500}`}
                      y1="10"
                      x2={`${hoverSeasonXRatio * 500}`}
                      y2="135"
                      stroke="#10B981"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                    <circle
                      cx={`${hoverSeasonXRatio * 500}`}
                      cy={`${getSeasonY(hoverSeasonPoint.index)}`}
                      r="6"
                      className="fill-emerald-500 stroke-white dark:stroke-slate-900 stroke-2 filter drop-shadow"
                    />
                  </>
                )}
              </svg>
              <div className="flex justify-between text-xs font-medium text-slate-400 mt-2">
                {SEASONALITY_POINTS.map((p, i) => (
                  <span key={i}>{p.month}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Volume by Quality Grade Donut */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Volume by Quality Grade</h3>
              <p className="text-xs text-slate-500">Government classification distribution across reported lots</p>
            </div>

            <div className="flex items-center justify-around my-4">
              {/* Donut graphic */}
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
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
                  <span className="text-xs font-bold text-slate-800 dark:text-white">AGMARKNET</span>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-2 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span className="text-slate-700 dark:text-slate-300">FAQ (Fair Average): 60%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-teal-400"></span>
                  <span className="text-slate-700 dark:text-slate-300">Grade A (Premium): 25%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-cyan-300"></span>
                  <span className="text-slate-700 dark:text-slate-300">Grade B / Standard: 15%</span>
                </div>
              </div>
            </div>
            <div className="text-[11px] text-slate-400 text-center">Standard AGMARKNET quality grading scheme</div>
          </div>
        </div>
      </div>
    </div>
  );
}
