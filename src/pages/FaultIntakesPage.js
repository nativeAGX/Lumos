import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  Search,
  Filter,
  RefreshCw,
  Camera,
  CheckCircle2,
  XCircle,
  Flag,
  Wrench,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ConsoleLayout } from '../layouts/ConsoleLayout';
import { useLumos } from '../contexts/LumosContext';
import { ReclassifyModal } from '../components/modals/ReclassifyModal';
import { showInfoToast } from '../utils/helpers';

export const FaultIntakesPage = () => {
  const {
    aiIntakes,
    selectedIntake,
    setSelectedIntakeId,
    flagDuplicate,
    markFalseAlarm,
    approveWorkOrderFromTriage
  } = useLumos();

  const [searchQuery, setSearchQuery] = useState('');
  const [isReclassifyOpen, setIsReclassifyOpen] = useState(false);
  const [selectedWard, setSelectedWard] = useState('Ward 12 • Somaiya Campus Core');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncFeed = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showInfoToast('Neural Ingest Feed Synced', 'All edge gateway cameras and citizen reports synchronized.');
    }, 500);
  };

  const filteredIntakes = aiIntakes.filter(
    (item) =>
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.poleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tagType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ConsoleLayout>
      {/* Top Banner & AI Engine Metadata */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                INTAKE CORE V2.4 • AUTOMATED PIPELINE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Citizen Fault Intakes &amp; AI Triage
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Automated neural clustering and fault classification from civic reports.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span>{aiIntakes.length} Pending Triage</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
              <Cpu className="w-3.5 h-3.5 text-emerald-600" />
              <span>180ms Edge Inference Latency</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-xs font-bold text-sky-800">
              <Layers className="w-3.5 h-3.5 text-sky-600" />
              <span>Spatial Dedup Active</span>
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by Pole ID, Grievance ID, or defect keyword..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-xl text-slate-700 focus:outline-hidden"
            >
              <option value="Ward 12 • Somaiya Campus Core">Ward 12 • Somaiya Campus Core</option>
              <option value="Ward 04 • Industrial Harbor">Ward 04 • Industrial Harbor</option>
              <option value="Ward 08 • Coastal Promenade">Ward 08 • Coastal Promenade</option>
            </select>

            <button
              onClick={() => showInfoToast('Advanced Filter Applied', 'Spatial clustering threshold set to 15m radius.')}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Incoming Feed (Left 5 cols) & Triage Review Card (Right 7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Incoming Feed */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Incoming Feed</h3>
              <p className="text-[11px] text-slate-400">{filteredIntakes.length} Queue items</p>
            </div>

            <button
              onClick={handleSyncFeed}
              disabled={isSyncing}
              className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sync Feed</span>
            </button>
          </div>

          {/* Feed Items List */}
          <div className="space-y-3">
            {filteredIntakes.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No reports currently pending triage in this sector.
              </div>
            ) : (
              filteredIntakes.map((intake) => {
                const isSelected = intake.id === selectedIntake?.id;
                const isCritical = intake.priority === 'CRITICAL';

                return (
                  <div key={intake.id} className="space-y-2">
                    <div
                      onClick={() => setSelectedIntakeId(intake.id)}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-400 bg-amber-50/20 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900">
                            {intake.poleTag}
                          </span>
                          <span
                            className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                              isCritical
                                ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}
                          >
                            • {intake.tagType}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {intake.timeAgo}
                        </span>
                      </div>

                      <h4 className="font-bold text-xs text-slate-800 leading-tight">
                        {intake.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 italic line-clamp-2">
                        "{intake.snippet}"
                      </p>

                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <span className="font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[10px]">
                          {intake.defectBadge}
                        </span>
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1 group">
                          <span>Review</span>
                          <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>

                    {/* Spatial Dedup Cluster Pill if active for this item */}
                    {intake.dedup?.active && (
                      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[10px] uppercase tracking-wider text-amber-800 flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5 text-amber-600" />
                            SPATIAL DEDUP ACTIVE
                          </span>
                          <span className="bg-amber-200 text-amber-900 text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase">
                            CLUSTER
                          </span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-amber-800">
                          {intake.dedup.text}
                        </p>
                        <div className="text-[10px] text-amber-700 font-semibold pt-0.5">
                          View merged reports ({intake.dedup.count}) • Delta geofence verified
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Detailed Triage Review Card */}
        {selectedIntake && (
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-lg text-slate-900">
                    Triage Review: #{selectedIntake.id}
                  </h3>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                      selectedIntake.priority === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-700 border border-rose-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {selectedIntake.priority}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-x-4">
                  <span>Source: {selectedIntake.sourceApp}</span>
                  <span>•</span>
                  <span>Telemetry Ingest: {selectedIntake.ingestGateway}</span>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold self-start">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>AI ANALYSIS COMPLETE</span>
              </span>
            </div>

            {/* Citizen Photo Evidence & Telemetry */}
            <div className="bg-slate-950 text-white rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                <span className="font-bold uppercase tracking-wider text-[10px] text-slate-300 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  CITIZEN PHOTO EVIDENCE &amp; TELEMETRY
                </span>
                <span>{selectedIntake.attachmentCount}</span>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                <img
                  src={selectedIntake.photoEvidenceUrl}
                  alt="Citizen defect capture"
                  className="w-full h-52 object-cover"
                />

                {/* Overlaid Telemetry HUD */}
                <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-xs text-[10px] font-mono px-2 py-1 rounded border border-slate-700 text-slate-300">
                  GPS: {selectedIntake.gps} | SHA-256 Verified
                </div>

                <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-xs text-[10px] p-2 rounded border border-slate-700 space-y-1">
                  <div className="flex justify-between font-mono text-slate-300">
                    <span>{selectedIntake.exifData}</span>
                    <span className="text-amber-400">{selectedIntake.photoAttachmentId}</span>
                  </div>
                  <p className="text-slate-400 text-[10px] leading-tight">
                    {selectedIntake.opticalCaptureNote}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
                <span>Sensor: {selectedIntake.sensorSpec}</span>
                <span className="text-emerald-400">{selectedIntake.gpsOffset}</span>
              </div>
            </div>

            {/* Citizen Grievance Description */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                CITIZEN GRIEVANCE DESCRIPTION
              </span>
              <p className="text-xs text-slate-800 leading-relaxed italic">
                "{selectedIntake.fullDescription}"
              </p>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold pt-1">
                <span>Resident ID: {selectedIntake.residentId}</span>
                <span className="text-slate-300">•</span>
                <span className="text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Campus Resident
                </span>
              </div>
            </div>

            {/* Neural Inference Vector */}
            <div className="bg-amber-50/40 rounded-2xl border border-amber-200 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold uppercase tracking-wider text-[11px] text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  NEURAL INFERENCE VECTOR
                </span>
                <span className="font-mono text-[10px] text-slate-500">
                  Model: {selectedIntake.neuralInference?.model}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Confidence Score
                  </span>
                  <span className="text-lg font-extrabold text-slate-900 font-mono">
                    {selectedIntake.neuralInference?.confidenceScore}
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Detected Defect
                  </span>
                  <span className="font-bold text-slate-800 leading-tight block mt-0.5">
                    {selectedIntake.neuralInference?.detectedDefect}
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Suggested Priority
                  </span>
                  <span className="font-bold text-rose-600 block mt-0.5">
                    {selectedIntake.neuralInference?.suggestedPriority}
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">
                    Target Asset
                  </span>
                  <span className="font-bold font-mono text-slate-900 block mt-0.5">
                    {selectedIntake.neuralInference?.targetAsset}
                  </span>
                </div>
              </div>

              {/* Real-time telemetry correlation */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-amber-200/60 text-xs font-mono">
                <span className="text-slate-700">
                  {selectedIntake.neuralInference?.circuitDrop}
                </span>
                <span className="text-emerald-700 font-bold bg-emerald-100/70 px-2 py-0.5 rounded">
                  Auto-Isolation Relay: {selectedIntake.neuralInference?.autoIsolationRelay}
                </span>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsReclassifyOpen(true)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
                >
                  Re-classify
                </button>

                <button
                  type="button"
                  onClick={() => flagDuplicate(selectedIntake.id)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Flag className="w-3.5 h-3.5 text-amber-600" />
                  <span>Flag Duplicate</span>
                </button>

                <button
                  type="button"
                  onClick={() => markFalseAlarm(selectedIntake.id)}
                  className="px-3 py-2 bg-slate-100 hover:bg-rose-50 text-rose-600 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5 text-rose-500" />
                  <span>Mark False Alarm</span>
                </button>
              </div>

              {/* Primary CTA */}
              <button
                type="button"
                onClick={() => approveWorkOrderFromTriage(selectedIntake.id)}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-colors flex items-center gap-2"
              >
                <Wrench className="w-4 h-4" />
                <span>Approve Work Order</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reclassify Modal */}
      {isReclassifyOpen && selectedIntake && (
        <ReclassifyModal
          intake={selectedIntake}
          isOpen={isReclassifyOpen}
          onClose={() => setIsReclassifyOpen(false)}
        />
      )}
    </ConsoleLayout>
  );
};
