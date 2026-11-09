import React, { useState } from 'react';
import { Download, Calendar } from 'lucide-react';
import { ConsoleLayout } from '../layouts/ConsoleLayout';
import { useLumos } from '../contexts/LumosContext';
import { showSuccessToast } from '../utils/helpers';

export const SlaAnalyticsPage = () => {
  const { analytics, analyticsWindow, setAnalyticsWindow, exportAuditReport } = useLumos();
  const { kpis, mttrBySector, faultCategories, activeEscalations } = analytics;
  const [filterBreachedOnly, setFilterBreachedOnly] = useState(false);

  const displayedEscalations = filterBreachedOnly
    ? activeEscalations.filter((e) => e.penaltyStage.includes('Penalty'))
    : activeEscalations;

  return (
    <ConsoleLayout>
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                WARD 12 MUNICIPAL MONITOR • MCGM CODE 44-B AUTONOMOUS AUDIT
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              SLA Compliance &amp; Operations Analytics
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Continuous resolution velocity metrics, contractor guarantees, and automated escalation logs.
            </p>
          </div>

          {/* Action & Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs font-semibold text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] text-slate-400 uppercase font-bold">Window:</span>
              <select
                value={analyticsWindow}
                onChange={(e) => setAnalyticsWindow(e.target.value)}
                className="bg-transparent font-bold text-slate-900 focus:outline-hidden cursor-pointer"
              >
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Q1-Q3 2025">Q1-Q3 2025</option>
                <option value="Fiscal Year 2025-26">Fiscal Year 2025-26</option>
              </select>
            </div>

            <button
              onClick={exportAuditReport}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export Audit Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* KPI 1: Citywide MTTR */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              CITYWIDE MTTR
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
              {kpis.mttr.diff}
            </span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {kpis.mttr.value}
            </span>
            <span className="text-xs text-slate-500 font-semibold">{kpis.mttr.unit}</span>
          </div>

          <div className="flex justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span>SLA Target: 5.0h max</span>
            <span className="font-semibold text-emerald-700">{kpis.mttr.sub}</span>
          </div>
        </div>

        {/* KPI 2: SLA Compliance Rate */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              SLA COMPLIANCE RATE
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {kpis.slaCompliance.target}
            </span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {kpis.slaCompliance.value}
            </span>
          </div>

          <div className="flex justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span>{kpis.slaCompliance.total}</span>
            <span className="font-semibold text-rose-600">{kpis.slaCompliance.violations}</span>
          </div>
        </div>

        {/* KPI 3: Energy Conservation */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              ENERGY CONSERVATION
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200">
              {kpis.energySavings.diff}
            </span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {kpis.energySavings.value}
            </span>
            <span className="text-xs text-slate-500 font-semibold">{kpis.energySavings.unit}</span>
          </div>

          <div className="text-xs text-slate-500 pt-1 border-t border-slate-100 truncate">
            {kpis.energySavings.sub}
          </div>
        </div>

        {/* KPI 4: Work Orders Cleared */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              WORK ORDERS CLEARED
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {kpis.ordersCleared.period}
            </span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {kpis.ordersCleared.value}
            </span>
            <span className="text-xs text-slate-500 font-semibold">{kpis.ordersCleared.unit}</span>
          </div>

          <div className="flex justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span>Avg Unit Repair Cost</span>
            <span className="font-semibold text-slate-800 font-mono">{kpis.ordersCleared.avgCost}</span>
          </div>
        </div>
      </div>

      {/* Visualizations Grid: MTTR Breakdown by Sector (Left) & Fault Category Distribution (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left: MTTR Breakdown by Sector */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-900">MTTR Breakdown by Sector</h3>
              <p className="text-xs text-slate-500">
                Average repair turnaround relative to the 5.0h limit
              </p>
            </div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Comparative
            </span>
          </div>

          {/* Sector Visual Bar List */}
          <div className="space-y-4 pt-2">
            {mttrBySector.map((sector) => {
              const isBreached = sector.status === 'Breached';
              // Normalized to 8.0h max
              const barWidth = `${(sector.mttr / 8.0) * 100}%`;

              return (
                <div key={sector.sector} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          isBreached ? 'bg-rose-500' : 'bg-amber-400'
                        }`}
                      ></span>
                      <span className="font-bold text-slate-800">{sector.sector}</span>
                    </div>
                    <span
                      className={`font-mono font-bold ${
                        isBreached ? 'text-rose-600' : 'text-emerald-700'
                      }`}
                    >
                      {sector.mttr}h ({sector.status})
                    </span>
                  </div>

                  {/* Relative bar with 5.0h target indicator */}
                  <div className="relative w-full h-3.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isBreached ? 'bg-rose-500' : 'bg-slate-700'
                      }`}
                      style={{ width: barWidth }}
                    ></div>

                    {/* 5.0h target line at 62.5% */}
                    <div className="absolute top-0 bottom-0 left-[62.5%] w-0.5 bg-rose-400 z-10"></div>
                  </div>
                </div>
              );
            })}

            {/* Scale Axis */}
            <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-1">
              <span>0.0h</span>
              <span>2.5h</span>
              <span className="text-rose-600 font-bold">5.0h Target Limit</span>
              <span>8.0h Max</span>
            </div>
          </div>

          {/* Penalty Clause Warning Callout */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2.5">
            <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
              i
            </span>
            <p className="leading-relaxed">
              Ward 04 triggered penalty clause:{' '}
              <strong className="text-amber-950 font-mono">$4,800 withheld</strong> due to underground splice delays.
            </p>
          </div>
        </div>

        {/* Right: Fault Category Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-900">Fault Category Distribution</h3>
              <p className="text-xs text-slate-500">
                Primary root causes across 1,248 reported incidents
              </p>
            </div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Breakdown
            </span>
          </div>

          {/* Fault Category List */}
          <div className="space-y-3.5 pt-2">
            {faultCategories.map((cat) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    ></span>
                    <span className="font-bold text-slate-800">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-slate-500">{cat.count} units</span>
                    <span className="font-bold text-slate-900">{cat.pct}%</span>
                  </div>
                </div>

                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${cat.pct}%`, backgroundColor: cat.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Warranty Claim & Download Logs */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
            <span className="font-semibold text-slate-700">{analytics.warrantyClaimInfo}</span>

            <button
              onClick={() => {
                showSuccessToast('Fault Logs Downloaded', 'Exported fault category incident CSV logs.');
              }}
              className="text-amber-800 hover:text-amber-900 font-bold flex items-center gap-1"
            >
              <span>Download Logs</span>
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Active SLA Escalations */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <h3 className="font-bold text-base text-slate-900">Active SLA Escalations</h3>
            <p className="text-xs text-slate-500">
              Priority incidents approaching or exceeding resolution thresholds
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">
              {displayedEscalations.length} Monitored
            </span>
            <button
              onClick={() => setFilterBreachedOnly(!filterBreachedOnly)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                filterBreachedOnly
                  ? 'bg-rose-50 border-rose-300 text-rose-700'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {filterBreachedOnly ? 'Showing Breached Only' : 'Filter Queue'}
            </button>
          </div>
        </div>

        {/* Escalations Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">TICKET ID</th>
                <th className="py-3 px-4">INCIDENT &amp; LOCATION</th>
                <th className="py-3 px-4">ELAPSED TIME</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">ASSIGNED UNIT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedEscalations.map((esc) => (
                <tr key={esc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {esc.ticketTag}
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{esc.title}</div>
                    <div className="text-[11px] text-slate-500">{esc.location}</div>
                  </td>

                  <td className="py-3 px-4 font-mono">
                    <span className="font-bold text-slate-800">{esc.elapsedTime}</span>{' '}
                    <span className="text-slate-400">/ {esc.slaThreshold}</span>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold border ${esc.statusColor}`}
                    >
                      {esc.statusBadge}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{esc.assignedUnit}</span>
                      <span
                        className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${esc.penaltyColor}`}
                      >
                        {esc.penaltyStage}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Escalation note */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <span>Refreshed automatically every 15s</span>
          <span>Tier 2 SLA escalation occurs at 04h 00m</span>
        </div>
      </div>
    </ConsoleLayout>
  );
};
