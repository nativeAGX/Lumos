import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Search,
  Clock,
  CheckCircle2,
  Play,
  Navigation,
  Radio,
  Check,
  X
} from 'lucide-react';
import { ConsoleLayout } from '../layouts/ConsoleLayout';
import { useLumos } from '../contexts/LumosContext';
import { showInfoToast } from '../utils/helpers';

export const WorkOrdersPage = () => {
  const {
    workOrders,
    dispatchWorkOrder,
    approveAndCloseWorkOrder,
    rejectWorkOrder,
    setIsCreateWorkOrderOpen
  } = useLumos();

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [crewFilter, setCrewFilter] = useState('ALL');
  const [trackingCrewModal, setTrackingCrewModal] = useState(null);

  // Filtered orders
  const filteredOrders = workOrders.filter((wo) => {
    const matchesSearch =
      wo.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.poleTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority =
      priorityFilter === 'ALL' || wo.priorityLevel === priorityFilter;

    const matchesCrew =
      crewFilter === 'ALL' || wo.assignedCrewName?.includes(crewFilter) || wo.crewBadge?.includes(crewFilter);

    return matchesSearch && matchesPriority && matchesCrew;
  });

  const toDispatchList = filteredOrders.filter((wo) => wo.column === 'TO_DISPATCH');
  const inProgressList = filteredOrders.filter((wo) => wo.column === 'IN_PROGRESS');
  const underReviewList = filteredOrders.filter((wo) => wo.column === 'UNDER_REVIEW');

  return (
    <ConsoleLayout>
      {/* Top Banner & Header Metrics */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                DISPATCH TELEMETRY ENGINE • SOMAIYA WARD 12
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Work Orders &amp; Maintenance Scheduling
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Live multi-crew telemetry, rapid hazard intervention, and photographic repair sign-offs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-xs">
              <div className="text-center">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">ACTIVE ORDERS</span>
                <span className="font-extrabold font-mono text-base text-slate-900">
                  {workOrders.length}
                </span>
              </div>
              <div className="h-6 w-px bg-slate-200"></div>
              <div className="text-center">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">FIELD CREWS</span>
                <span className="font-extrabold font-mono text-base text-emerald-700">14/18 Active</span>
              </div>
              <div className="h-6 w-px bg-slate-200"></div>
              <div className="text-center">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">SLA HEALTH</span>
                <span className="font-extrabold font-mono text-base text-amber-700">97.4%</span>
              </div>
            </div>

            <button
              onClick={() => setIsCreateWorkOrderOpen(true)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Work Order</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by Pole ID (e.g., LUM-W12-1049) or WO#... CMD+K"
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end text-xs">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-500 uppercase text-[10px]">PRIORITY:</span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700 focus:outline-hidden"
              >
                <option value="ALL">All Levels</option>
                <option value="CRITICAL">Critical Hazard</option>
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="LOW">Low Priority</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-500 uppercase text-[10px]">CREW:</span>
              <select
                value={crewFilter}
                onChange={(e) => setCrewFilter(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700 focus:outline-hidden"
              >
                <option value="ALL">All Teams (18 Crews)</option>
                <option value="07">Crew #07 (Rajesh K.)</option>
                <option value="04">Crew #04 (Vikram S.)</option>
                <option value="02">Crew #02 (Anita V.)</option>
                <option value="11">Crew #11 (S. Kulkarni)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Column 1: TO DISPATCH */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <h2 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                TO DISPATCH
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {toDispatchList.length} Pending
            </span>
          </div>

          <div className="space-y-4">
            {toDispatchList.map((wo) => {
              const isCrit = wo.priorityLevel === 'CRITICAL';
              return (
                <div
                  key={wo.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                        isCrit
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {wo.priority}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-600" />
                      {wo.slaTimeLeft}
                    </span>
                  </div>

                  <div>
                    <span className="font-mono text-xs text-slate-400 font-bold block">
                      #{wo.id}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 mt-0.5 leading-snug">
                      {wo.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {wo.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-[9px] font-bold uppercase text-slate-400 block">
                        POLE IDENTIFIER
                      </span>
                      <span className="font-mono font-bold text-slate-800">{wo.poleTag}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold uppercase text-slate-400 block">
                        CIRCUIT ZONE
                      </span>
                      <span className="text-slate-700 truncate block">{wo.circuitZone}</span>
                    </div>
                  </div>

                  {/* Dispatch Controls */}
                  <div className="flex items-center gap-2 pt-1">
                    <select
                      className="flex-1 text-xs py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
                      defaultValue={wo.assignedCrewName}
                    >
                      <option value="Crew #07 (Available)">Assign: Crew #07 (Available)</option>
                      <option value="Crew #04">Assign: Crew #04 (On Site)</option>
                      <option value="Crew #02">Assign: Crew #02</option>
                    </select>

                    <button
                      onClick={() => dispatchWorkOrder(wo.id)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <span>Dispatch</span>
                      <Play className="w-3 h-3 fill-white" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2: IN PROGRESS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
              <h2 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                IN PROGRESS
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {inProgressList.length} Active
            </span>
          </div>

          <div className="space-y-4">
            {inProgressList.map((wo) => (
              <div
                key={wo.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200">
                    {wo.priority}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    {wo.statusBadge}
                  </span>
                </div>

                <div>
                  <span className="font-mono text-xs text-slate-400 font-bold block">
                    #{wo.id}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 mt-0.5 leading-snug">
                    {wo.title}
                  </h3>
                  <div className="text-xs text-slate-500 mt-1">
                    Pole <strong className="text-slate-700 font-mono">{wo.poleTag}</strong> •{' '}
                    <span>{wo.location || wo.circuitZone}</span>
                  </div>
                </div>

                {/* Assigned Crew Info */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center">
                        {wo.crewInitials || 'RK'}
                      </div>
                      <span className="font-bold text-xs text-slate-800">{wo.crewBadge}</span>
                    </div>
                    {wo.gpsEta && (
                      <span className="text-[11px] font-mono font-bold text-slate-700">
                        GPS ETA <span className="text-amber-600">{wo.gpsEta}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                    <span>Vehicle {wo.vehicle}</span>
                    <span className="font-semibold text-slate-700">
                      Phase {wo.interventionPhase || wo.progressPct || '40%'}
                    </span>
                  </div>
                </div>

                {/* Tracking & Logs Controls */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => setTrackingCrewModal(wo)}
                    className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Navigation className="w-3.5 h-3.5 text-sky-600" />
                    <span>Track Crew</span>
                  </button>

                  <button
                    onClick={() =>
                      showInfoToast(
                        'Audit Trail Telemetry',
                        `Crew telemetry stream: Ping 28ms, Speed: 24 km/h, LOTO protocol verified.`
                      )
                    }
                    className="ml-2 text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1.5 rounded"
                  >
                    View Logs →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: UNDER REVIEW / QA */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h2 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                UNDER REVIEW / QA
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {underReviewList.length} Audits
            </span>
          </div>

          <div className="space-y-4">
            {underReviewList.map((wo) => (
              <div
                key={wo.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                    AUDIT PENDING
                  </span>
                  <span className="text-[11px] font-mono text-emerald-700 font-bold">
                    Evidence Ready
                  </span>
                </div>

                <div>
                  <span className="font-mono text-xs text-slate-400 font-bold block">
                    #{wo.id}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 mt-0.5 leading-snug">
                    {wo.title}
                  </h3>
                  <div className="text-xs text-slate-500 mt-1">
                    Pole <strong className="text-slate-700 font-mono">{wo.poleTag}</strong> •{' '}
                    <span>{wo.techBadge || wo.crewBadge}</span>
                  </div>
                </div>

                {/* Photographic Evidence Before / After */}
                {wo.proofBefore && wo.proofAfter && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <span>FIELD PHOTOGRAPHIC VERIFICATION</span>
                      <span className="text-emerald-600 font-semibold">GEO-TAGGED OK</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {/* Before */}
                      <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 text-white">
                        <div className="h-20 bg-slate-800 relative">
                          <img
                            src={wo.proofBefore.imageUrl}
                            alt="Before"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-1 left-1 bg-slate-900/80 text-[8px] font-bold px-1.5 py-0.5 rounded">
                            {wo.proofBefore.label}
                          </span>
                        </div>
                        <div className="p-1.5 text-[9px] font-mono text-slate-300">
                          {wo.proofBefore.note}
                        </div>
                      </div>

                      {/* After */}
                      <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 text-white">
                        <div className="h-20 bg-slate-800 relative">
                          <img
                            src={wo.proofAfter.imageUrl}
                            alt="After"
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-1 left-1 bg-emerald-600/90 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">
                            {wo.proofAfter.label}
                          </span>
                        </div>
                        <div className="p-1.5 text-[9px] font-mono text-slate-300">
                          {wo.proofAfter.note}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Report verification text if grounding */}
                {wo.resistanceReport && (
                  <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 font-medium">
                    <div className="flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{wo.resistanceReport}</span>
                    </div>
                    <div className="text-[10px] text-emerald-700 mt-0.5">
                      {wo.inspectorBadge}
                    </div>
                  </div>
                )}

                {/* QA Decision Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => approveAndCloseWorkOrder(wo.id)}
                    className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1 shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Approve &amp; Close</span>
                  </button>

                  <button
                    onClick={() => rejectWorkOrder(wo.id)}
                    className="py-2 px-3 bg-slate-100 hover:bg-rose-50 text-rose-600 font-bold text-xs rounded-xl border border-slate-200 hover:border-rose-200 transition-colors"
                  >
                    Reject (Redo)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Track Crew Modal */}
      {trackingCrewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm leading-tight">Live Lineman GPS Fleet Tracking</h3>
                  <p className="text-xs text-slate-400">{trackingCrewModal.crewBadge}</p>
                </div>
              </div>
              <button
                onClick={() => setTrackingCrewModal(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="h-44 bg-slate-950 rounded-xl border border-slate-800 map-grid-dark flex items-center justify-center relative overflow-hidden">
                <div className="text-center text-xs text-slate-400 space-y-2">
                  <Radio className="w-8 h-8 text-amber-500 mx-auto animate-pulse" />
                  <p className="font-mono text-white">Van #04 en route to Vidyavihar Link Road East</p>
                  <p className="text-[11px] text-emerald-400">GPS Speed: 32 km/h • ETA: 8 minutes</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Vehicle Reg:</span>
                  <span className="font-mono font-bold text-slate-800">{trackingCrewModal.vehicle}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Crew Lead:</span>
                  <span className="font-bold text-slate-800">Rajesh Kumar</span>
                </div>
              </div>

              <button
                onClick={() => {
                  showInfoToast('Radio Call Dispatched', 'Connected to Van #04 in-cab transceiver.');
                  setTrackingCrewModal(null);
                }}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Establish Voice Comms
              </button>
            </div>
          </div>
        </div>
      )}
    </ConsoleLayout>
  );
};
