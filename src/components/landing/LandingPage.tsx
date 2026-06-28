import React from 'react';
import { DataVisualization3D } from './DataVisualization3D';
import { ScrollReveal } from './ScrollReveal';
import { TelemetryModel, GridModel, SearchModel } from './FeatureModels3D';

const LIME_ACCENT = '#a8d91d';

interface Props {
  onEnter: () => void;
}

function StarIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C10.5 6.5 6.5 10.5 2 12c4.5 1.5 8.5 5.5 10 10 1.5-4.5 5.5-8.5 10-10-4.5-1.5-8.5-5.5-10-10z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <ellipse cx="12" cy="12" rx="4" ry="10" />
      <path d="M2 12h20" />
    </svg>
  );
}

function ArrowDiagonal() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path d="M7 17L17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Decorative UI fragments matching reference ─ */
function PieChartDecor() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="28" r="26" stroke="#ccc" strokeWidth="1" fill="none" />
      <path d="M28 28 L28 2 A26 26 0 0 1 54 28 Z" fill={LIME_ACCENT} opacity="0.85" />
      <path d="M28 28 L54 28 A26 26 0 0 1 28 54 Z" fill="#1a1a1a" opacity="0.7" />
      <path d="M28 28 L28 54 A26 26 0 0 1 2 28 Z" fill="#888" opacity="0.5" />
    </svg>
  );
}

function BarChartDecor() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      <rect x="4" y="24" width="8" height="16" fill="#ccc" rx="1" />
      <rect x="16" y="14" width="8" height="26" fill={LIME_ACCENT} rx="1" />
      <rect x="28" y="8" width="8" height="32" fill="#1a1a1a" rx="1" />
    </svg>
  );
}

function LinesDecor() {
  return (
    <svg width="52" height="24" viewBox="0 0 52 24" fill="none">
      <rect y="0" width="52" height="3" rx="1.5" fill="#ccc" opacity="0.6" />
      <rect y="7" width="36" height="3" rx="1.5" fill="#ccc" opacity="0.5" />
      <rect y="14" width="44" height="3" rx="1.5" fill="#ccc" opacity="0.4" />
      <rect y="21" width="28" height="3" rx="1.5" fill="#ccc" opacity="0.3" />
    </svg>
  );
}

function ChevronDoubleDown() {
  return (
    <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
      <path d="M4 4l8 8 8-8" stroke={LIME_ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 13l8 8 8-8" stroke={LIME_ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LandingPage({ onEnter }: Props) {
  return (
    <div
      className="h-full w-full overflow-y-auto overflow-x-hidden select-none bg-[#f0efe9]"
      style={{
        background: '#f0efe9',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ── HERO SECTION ── */}
      <section className="relative flex flex-col min-h-full">
        {/* ── Top Navigation ── */}
        <nav className="flex items-center justify-between px-10 pt-8 pb-0 shrink-0 z-20">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: LIME_ACCENT }}
          >
            <StarIcon className="w-6 h-6 text-black" />
          </div>
          <div>
            <div className="text-[15px] font-bold text-black tracking-tight leading-none">TERMINAL 01</div>
            <div className="text-[11px] text-gray-500 mt-0.5 font-medium">RPA Command Center</div>
          </div>
        </div>

        {/* Status pills */}
        <div className="flex items-center gap-5 text-sm font-medium text-gray-700">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            <span className="text-gray-800">Connected</span>
          </div>
          <div className="w-px h-5 bg-gray-300" />
          <div className="flex items-center gap-2 text-gray-500">
            <GlobeIcon />
            <span>Client Side</span>
          </div>
        </div>
      </nav>

      {/* ── Main two-column body ── */}
      <div className="flex-1 flex min-h-0 px-10 pb-8 pt-6 gap-4">

        {/* Left column */}
        <div className="flex flex-col justify-center w-[48%] shrink-0 pr-4">

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-0.5 bg-[color:var(--lime-accent)]" style={{ backgroundColor: LIME_ACCENT }} />
            <span
              className="text-xs font-bold tracking-[0.18em] text-gray-700 uppercase"
              style={{ letterSpacing: '0.18em' }}
            >
              Live Data. Real Impact.
            </span>
          </div>

          {/* Hero title */}
          <div className="leading-none mb-2" style={{ fontFamily: "'Anton', sans-serif" }}>
            <div
              className="text-black leading-none block"
              style={{
                fontSize: 'clamp(72px, 9.5vw, 128px)',
                lineHeight: 0.92,
                letterSpacing: '-0.01em',
              }}
            >
              YOUR DATA
            </div>
            <div
              className="leading-none flex items-center block"
              style={{
                fontSize: 'clamp(72px, 9.5vw, 128px)',
                lineHeight: 0.92,
                color: LIME_ACCENT,
                letterSpacing: '-0.01em',
              }}
            >
              <span>IN CONTROL</span>
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-sm text-gray-500 font-medium mt-5 mb-8 max-w-sm leading-relaxed">
            Real-time automation intelligence across your entire enterprise.
            Monitor, analyze, and act on live RPA data streams.
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-4">
            <button
              onClick={onEnter}
              className="flex items-center gap-2.5 font-bold text-sm tracking-wider px-7 py-4 rounded-full transition-all duration-200 hover:scale-[1.03] hover:shadow-lg active:scale-[0.98]"
              style={{
                background: LIME_ACCENT,
                color: '#000',
                letterSpacing: '0.06em',
                boxShadow: '0 4px 20px rgba(191, 255, 43, 0.4)',
              }}
            >
              ENTER TERMINAL
              <ArrowDiagonal />
            </button>
            <button
              onClick={onEnter}
              className="flex items-center gap-2.5 font-bold text-sm tracking-wider px-7 py-4 rounded-full border-2 border-gray-300 text-gray-800 bg-white transition-all duration-200 hover:border-gray-500 hover:scale-[1.03] active:scale-[0.98]"
              style={{ letterSpacing: '0.06em' }}
            >
              EXPLORE
              <ArrowDiagonal />
            </button>
          </div>
        </div>

        {/* Right column — 3D visualization */}
        <div className="flex-1 relative min-w-0">
          {/* Decorative floating UI fragments */}
          <div className="absolute top-[12%] left-[5%] opacity-50 z-10">
            <LinesDecor />
          </div>
          <div className="absolute top-[30%] left-[2%] opacity-70 z-10">
            <PieChartDecor />
          </div>
          <div className="absolute top-[28%] right-[2%] opacity-60 z-10">
            <BarChartDecor />
          </div>
          <div className="absolute top-[10%] right-[6%] opacity-40 z-10">
            <LinesDecor />
          </div>

          {/* 3D Canvas — fills the right column */}
          <div className="absolute inset-0">
            <DataVisualization3D />
          </div>
        </div>
      </div>

      {/* Bottom scroll hint */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 opacity-70 animate-bounce">
          <ChevronDoubleDown />
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section className="bg-[#0b0b0b] text-white py-32 px-10 relative z-20">
        <div className="max-w-6xl mx-auto space-y-40">
          
          {/* Feature 1 */}
          <ScrollReveal>
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-0.5" style={{ backgroundColor: LIME_ACCENT }} />
                  <span className="text-xs font-bold tracking-[0.15em] text-gray-400 uppercase">Feature 01</span>
                </div>
                <h3 className="text-5xl font-bold tracking-tight" style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '0.02em' }}>
                  CLIENT-SIDE PROCESSING
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                  Everything runs entirely on your browser. There is no server latency, no database querying, 
                  and no external library dependencies. Your data remains fully local, ensuring instant 
                  performance and maximum security.
                </p>
              </div>
              <div className="flex-1 w-full flex justify-center">
                <TelemetryModel />
              </div>
            </div>
          </ScrollReveal>

          {/* Feature 2 */}
          <ScrollReveal delay={100}>
            <div className="flex flex-col md:flex-row-reverse items-center gap-16">
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-0.5" style={{ backgroundColor: LIME_ACCENT }} />
                  <span className="text-xs font-bold tracking-[0.15em] text-gray-400 uppercase">Feature 02</span>
                </div>
                <h3 className="text-5xl font-bold tracking-tight" style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '0.02em' }}>
                  LIVE DATA ANALYSIS
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                  Continuously monitor incoming data streams in real-time. The dashboard processes 
                  and renders live telemetry instantly, allowing you to track changes, identify 
                  anomalies, and act on insights as soon as they happen.
                </p>
              </div>
              <div className="flex-1 w-full flex justify-center">
                <GridModel />
              </div>
            </div>
          </ScrollReveal>

          {/* Feature 3 */}
          <ScrollReveal delay={100}>
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-0.5" style={{ backgroundColor: LIME_ACCENT }} />
                  <span className="text-xs font-bold tracking-[0.15em] text-gray-400 uppercase">Feature 03</span>
                </div>
                <h3 className="text-4xl font-bold tracking-tight" style={{ fontFamily: "'Anton', sans-serif", letterSpacing: '0.02em' }}>
                  CUSTOMIZABLE VIEW INTERFACE
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                  Tailor the dataset to your exact needs. You can sort by multiple columns simultaneously 
                  and apply dynamic category filters. Your customized view remains perfectly intact and 
                  responsive even while live data updates.
                </p>
              </div>
              <div className="flex-1 w-full flex justify-center">
                <SearchModel />
              </div>
            </div>
          </ScrollReveal>

        </div>
        
        <div className="mt-40 text-center">
           <button
              onClick={onEnter}
              className="inline-flex items-center gap-2.5 font-bold text-sm tracking-wider px-8 py-5 rounded-full transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
              style={{
                background: LIME_ACCENT,
                color: '#000',
                letterSpacing: '0.06em',
                boxShadow: '0 4px 20px rgba(191, 255, 43, 0.4)',
              }}
            >
              LAUNCH CONTROL TERMINAL
              <ArrowDiagonal />
            </button>
        </div>
      </section>

      {/* Footer Credit */}
      <div className="w-full bg-[#0b0b0b] pb-12 flex justify-center items-center">
        <span className="text-[#555555] text-xs tracking-[0.15em] font-medium opacity-80 uppercase">
          made with purpose - by Tanish_K
        </span>
      </div>
    </div>
  );
}
