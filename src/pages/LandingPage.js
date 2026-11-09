import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Lightbulb,
  ArrowRight,
  MapPin,
  Search,
  CheckCircle,
  Cpu,
  Truck
} from 'lucide-react';
import { useLumos } from '../contexts/LumosContext';
import { QuickPoleInspectorModal } from '../components/modals/QuickPoleInspectorModal';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { poles } = useLumos();
  const [searchTag, setSearchTag] = useState('#LUM-W12-1049');
  const [inspectedPole, setInspectedPole] = useState(null);

  const handleInspect = (tagToSearch) => {
    const query = (tagToSearch || searchTag).trim().toUpperCase();
    const cleanQuery = query.replace('#', '');
    const found = poles.find(
      (p) => p.id.toUpperCase() === cleanQuery || p.tag?.toUpperCase() === query
    ) || poles[0];

    setInspectedPole(found);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-amber-100 selection:text-amber-900 flex flex-col relative">
      {/* Top Navbar */}
      <header className="border-b border-amber-100/80 bg-white/85 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 shadow-xs">
              <Lightbulb className="w-5 h-5 fill-amber-500 text-amber-600" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold tracking-tight text-slate-900 text-xl">LUMOS</span>
              <span className="text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                MUNICIPAL
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NavLink
              to="/login"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-sm transition-all"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </NavLink>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-amber-100/60 bg-gradient-to-b from-amber-100/40 via-amber-50/20 to-white">
        {/* Subtle Atmospheric Luminaire Glow from Figma */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[420px] bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.16),rgba(251,191,36,0.06)_55%,transparent_75%)] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Ticker Badges */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-amber-200/60 shadow-xs text-[9.5px] sm:text-[10.5px] font-semibold text-slate-700 mb-6 backdrop-blur-xs tracking-wide">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              CIVIC INFRASTRUCTURE OS • ISO 37122 CERTIFIED
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Grid Telemetry Live • 99.98% Network Uptime
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
            <span className="block">Intelligent Streetlight Telemetry for Modern</span>
            <span className="block text-slate-900">Municipalities.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            LUMOS bridges high-precision IoT mesh monitoring, automated citizen fault triage, and dynamic field crew dispatch into one unified municipal operations console.
          </p>

          {/* Primary CTA */}
          <div className="mt-8 flex items-center justify-center">
            <button
              onClick={() => navigate('/citizen')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              <span>Launch Citizen Grievance Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* KPI Stat Bar */}
          <div className="mt-14 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs backdrop-blur-xs">
            <div className="text-left border-l-2 border-amber-500 pl-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                POLES MONITORED
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">14,820+</span>
              <span className="text-xs text-slate-500 block">Active Municipal Mesh</span>
            </div>

            <div className="text-left border-l-2 border-emerald-500 pl-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                FAULT TRIAGE SPEED
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">180ms</span>
              <span className="text-xs text-slate-500 block flex items-center gap-1">
                <Cpu className="w-3 h-3 text-emerald-600" />
                Edge Neural Ingest
              </span>
            </div>

            <div className="text-left border-l-2 border-sky-500 pl-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                ENERGY CONSERVATION
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">38%</span>
              <span className="text-xs text-slate-500 block">Adaptive Lux Dimming</span>
            </div>

            <div className="text-left border-l-2 border-amber-500 pl-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                AVERAGE SLA MTTR
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">&lt; 4h</span>
              <span className="text-xs text-slate-500 block">Civic Redressal Turnaround</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section: System Capabilities */}
      <section className="py-16 md:py-20 bg-slate-50/70 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-700 bg-amber-100/70 px-3 py-1 rounded-full border border-amber-300/60">
              SYSTEM CAPABILITIES
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-900 tracking-tight">
              Architected for Civic Scale Reliability
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Eliminating operational guesswork with authoritative edge instrumentation and proactive civic governance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Geospatial Telemetry */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">
                Geospatial Telemetry & GIS Digital Twin
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Live mapping of every luminaire, feeder pillar, and circuit loop across the municipality. Instantaneous voltage sag monitoring identifies underground cable degradation before physical blackouts occur.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Sub-meter GIS pole coordinates</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Automated circuit load balancing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Dark sky compliant lux modulation</span>
                </li>
              </ul>
            </div>

            {/* Card 2: AI Auto-Triage */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">
                Citizen Grievance & AI Auto-Triage
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Instant mobile photographic upload with GPS geo-fencing. Custom neural classifiers diagnose ballast burnout, sparking risks, or knocked-down poles while spatial clustering suppresses redundant citizen reports.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Zero login friction for commuters</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Instant photo defect verification</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>SMS & WhatsApp automated tracking</span>
                </li>
              </ul>
            </div>

            {/* Card 3: Field Workforce & SLA Dispatch */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-4">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">
                Field Workforce & SLA Dispatch
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                SLA-prioritized work queues automatically route municipal linemen vans based on spare-parts inventory and traffic patterns. Required photographic before/after timestamps enforce municipal contractor audits.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Lineman mobile app with offline mode</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Cryptographic photographic audit trail</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Strict 4-hour SLA penalty enforcement</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Portal Access Matrix */}
      <section className="py-16 md:py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              PORTAL ACCESS MATRIX
            </span>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-900 tracking-tight">
              Select Your Civic Interface
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Tailored experiences designed for civic residents and ward infrastructure engineers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Resident Card */}
            <div className="rounded-2xl border-2 border-slate-200 p-6 sm:p-8 flex flex-col justify-between hover:border-amber-300 transition-colors bg-slate-50/50">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-slate-200 text-slate-700">
                    PUBLIC ACCESS • NO SIGNUP NEEDED
                  </span>
                  <span className="text-xs font-semibold text-amber-700">Citizen Redressal</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  For Residents & Commuters
                </h3>
                <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                  Experience prompt civic care. Report damaged luminaires, dark public corridors, or hanging electrical wires in 30 seconds without creating an account. Receive continuous progress notifications directly to your phone.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-700 font-bold text-xs flex items-center justify-center shrink-0">1</span>
                    <span className="text-xs text-slate-700">Scan pole QR sticker or auto-detect GPS location</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-700 font-bold text-xs flex items-center justify-center shrink-0">2</span>
                    <span className="text-xs text-slate-700">Upload photo for AI categorization</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-700 font-bold text-xs flex items-center justify-center shrink-0">3</span>
                    <span className="text-xs text-slate-700">Receive real-time lineman repair verification</span>
                  </div>
                </div>
              </div>

              <div>
                <button
                  onClick={() => navigate('/citizen')}
                  className="w-full py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <span>Report a Fault Now</span>
                  <span className="text-[11px] font-normal text-slate-400">Takes under 45 seconds</span>
                </button>
              </div>
            </div>

            {/* Engineer Card */}
            <div className="rounded-2xl border-2 border-slate-200 p-6 sm:p-8 flex flex-col justify-between hover:border-amber-400 transition-colors bg-amber-50/20">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    RESTRICTED WARD CREDENTIALS
                  </span>
                  <span className="text-xs font-semibold text-slate-700">Tier-3 Auth</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  For Ward Officers & Engineers
                </h3>
                <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                  Full administrative console for municipal corporation electrical divisions, smart city mission directors, and contracted field engineering supervisors. Complete telemetry control and work-order management.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">A</span>
                    <span className="text-xs text-slate-700">Feeder pillar live circuit overrides & emergency flashing</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">B</span>
                    <span className="text-xs text-slate-700">Lineman SLA audit & GPS live fleet coordination</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">C</span>
                    <span className="text-xs text-slate-700">Automated energy billing audit & power leakage alarms</span>
                  </div>
                </div>
              </div>

              <div>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <span>Sign In to Console</span>
                  <span className="text-[11px] font-medium text-slate-800">Municipal CAC / PKI Support</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Municipal Milestones & Audit Data */}
      <section className="py-16 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                DEMONSTRATED CIVIC ROI
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Municipal Milestones & Audit Data
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Audit Period: Q1-Q3 2025 Municipal Fiscal Report
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                ENERGY OFFSET
              </span>
              <span className="text-3xl font-extrabold text-slate-900 font-mono block">4.2 GWh</span>
              <p className="text-xs text-slate-600 mt-2 mb-3 leading-relaxed">
                Saved annually via dynamic photometric dimming during 01:00 to 05:00 low-traffic intervals.
              </p>
              <span className="inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                Equivalent to 2,980 tons CO₂
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                RELIABILITY INDEX
              </span>
              <span className="text-3xl font-extrabold text-slate-900 font-mono block">99.4%</span>
              <p className="text-xs text-slate-600 mt-2 mb-3 leading-relaxed">
                Grid circuit reliability sustained across 4 monsoon seasons with zero localized blackout cascading.
              </p>
              <span className="inline-block text-[11px] font-semibold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded border border-sky-200">
                IEC 62386 Compliant
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                FIRST-VISIT RESOLUTION
              </span>
              <span className="text-3xl font-extrabold text-slate-900 font-mono block">82%</span>
              <p className="text-xs text-slate-600 mt-2 mb-3 leading-relaxed">
                Grievances solved on the very first dispatch owing to automated spare-part staging recommendations.
              </p>
              <span className="inline-block text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                Reduced repeat truck rolls
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                TAMPER & LEAKAGE LOSS
              </span>
              <span className="text-3xl font-extrabold text-slate-900 font-mono block">0.0%</span>
              <p className="text-xs text-slate-600 mt-2 mb-3 leading-relaxed">
                Unaccounted power tapping eliminated across all 12 operational municipal wards through phase telemetry.
              </p>
              <span className="inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                Full Revenue Assurance
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Civic Transparency / Quick Pole Inspector */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/30 p-6 sm:p-8">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
              CIVIC TRANSPARENCY
            </span>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">
              Track Any Streetlight in the Municipal Grid
            </h3>
            <p className="text-xs text-slate-600 mt-1 mb-6">
              Enter the pole tag found stamped on any municipal light post to view its real-time telemetry status, schedule, or pending work order history.
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchTag}
                  onChange={(e) => setSearchTag(e.target.value)}
                  placeholder="Enter Pole ID (e.g. #LUM-W12-1049)"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-xs"
                />
              </div>
              <button
                onClick={() => handleInspect(searchTag)}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Check Telemetry Status</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Recent Lookups */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="text-[11px] font-medium text-slate-400">Recent lookups:</span>
              {['#LUM-W12-1049', '#LUM-W12-0891', '#LUM-W12-0741'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSearchTag(tag);
                    handleInspect(tag);
                  }}
                  className="font-mono text-slate-700 bg-white hover:bg-amber-100 px-2.5 py-0.5 rounded border border-slate-200 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Quick Preview Pill */}
            <div className="mt-4 p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-mono">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                <span className="font-bold text-slate-800">Pole #LUM-W12-1049</span>
                <span className="text-slate-400 hidden sm:inline">• Somaiya North Gate</span>
              </div>
              <span className="font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                Crew Dispatched
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
            {/* Col 1 */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 fill-amber-400" />
                </div>
                <span className="font-extrabold text-white text-base tracking-tight">LUMOS MUNICIPAL</span>
              </div>
              <p className="text-slate-400 text-xs max-w-sm mb-4 leading-relaxed">
                Autonomous Municipal Smart Streetlighting & Urban Telemetry Network. Endorsed by the Municipal Corporation of Greater Mumbai under the Smart City Mission.
              </p>
              <div className="flex flex-wrap gap-2 text-[10px] text-slate-400">
                <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">ISO 37122 & ISO 37120 Certified</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">AES-256 Civic Encryption</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">99.98% System Telemetry Uptime</span>
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">
                Municipal Governance
              </h4>
              <ul className="space-y-2 text-slate-400 text-xs">
                <li><a href="#bylaws" className="hover:text-white transition-colors">Municipal Bylaws</a></li>
                <li><NavLink to="/citizen" className="hover:text-white transition-colors">Grievance Redressal Cell</NavLink></li>
                <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact Desk</a></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">
                Developer & Systems
              </h4>
              <ul className="space-y-2 text-slate-400 text-xs">
                <li><NavLink to="/gis-map" className="hover:text-white transition-colors">API Documentation</NavLink></li>
                <li><NavLink to="/gis-map" className="hover:text-white transition-colors">Architecture Specification</NavLink></li>
                <li><NavLink to="/gis-map" className="hover:text-white transition-colors">Grid Status Monitor</NavLink></li>
                <li><NavLink to="/sla-analytics" className="hover:text-white transition-colors">Civic Open Data Charter</NavLink></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
            <span>© 2025 LUMOS Infrastructure. Municipal Corporation of Greater Mumbai / Smart City Governance Framework.</span>
            <span className="font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-900">
              ACTIVE NODE GRID: WESTERN DISTRICT 04
            </span>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {inspectedPole && (
        <QuickPoleInspectorModal
          pole={inspectedPole}
          isOpen={!!inspectedPole}
          onClose={() => setInspectedPole(null)}
        />
      )}
    </div>
  );
};
