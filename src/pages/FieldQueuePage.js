import React, { useState } from 'react';
import {
  Truck,
  ShieldAlert,
  Navigation,
  Phone,
  Camera,
  CheckSquare,
  Square,
  MapPin,
  Radio,
  ShieldCheck,
  Check
} from 'lucide-react';
import { ConsoleLayout } from '../layouts/ConsoleLayout';
import { useLumos } from '../contexts/LumosContext';
import { showSuccessToast, showInfoToast } from '../utils/helpers';

export const FieldQueuePage = () => {
  const {
    technicianQueue,
    toggleTechnicianChecklist,
    setTechnicianProofAfter,
    submitProofAndCloseJob,
    updateInventoryStock
  } = useLumos();

  const { activeJob, routeStops, routeSummary, vanInventory, nextInQueue } = technicianQueue;
  const [gpsActive, setGpsActive] = useState(false);

  const handleAfterPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTechnicianProofAfter(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      // Simulate quick mobile snapshot
      setTechnicianProofAfter(
        'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80'
      );
    }
  };

  const handleStartGps = () => {
    setGpsActive(true);
    showSuccessToast(
      'Turn-by-Turn GPS Active',
      `Routing to ${activeJob.location}. Turn right in 120m onto Somaiya Central Blvd.`
    );
  };

  const handleCallDispatch = () => {
    showInfoToast(
      'Connecting to Dispatch Transceiver',
      'Ward 12 Central Control: Line #04 active. Engineer listening...'
    );
  };

  return (
    <ConsoleLayout>
      {/* Top Header & Field Tech Identity */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                DISPATCH ASSIGNED • SEC: W-12 / ELECTRICAL DIV
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Field Technician Dispatch Queue
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Route prioritized by hazard rating &amp; voltage severity.
            </p>
          </div>

          {/* Technician Profile Card */}
          <div className="flex items-center gap-3 bg-amber-50/70 border border-amber-200/80 px-4 py-2.5 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
              RK
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-sm">Rajesh Kumar</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <div className="text-[11px] font-semibold text-slate-600">
                Somaiya Unit #07 • <span className="font-mono text-slate-500">08:00 - 16:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Warning Banner */}
      <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-rose-900 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-sm block text-rose-800">
              Safety Warning: {activeJob.hazardRating}
            </span>
            <span className="text-xs text-rose-600">
              High voltage line isolation protocol active. Confirm zero potential before touch.
            </span>
          </div>
        </div>
        <span className="font-mono font-bold text-xs bg-rose-200/80 text-rose-900 px-3 py-1 rounded-lg border border-rose-300 self-start sm:self-auto">
          {activeJob.protocol}
        </span>
      </div>

      {/* Main Grid: Active Job HUD (7 cols) & Route/Inventory (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Active Job Card & Work Order Closure */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                    {activeJob.priority}
                  </span>
                  <span className="font-mono font-bold text-slate-600">
                    {activeJob.workOrderTag}
                  </span>
                </div>
                <span className="font-mono font-bold text-slate-800">
                  Pole: {activeJob.poleTag}
                </span>
              </div>

              <h2 className="text-xl font-extrabold text-slate-900">
                {activeJob.title}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{activeJob.location}</span>
              </div>
            </div>

            {/* Quick GPS & Dispatch Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleStartGps}
                className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Navigation className={`w-4 h-4 ${gpsActive ? 'text-emerald-400 animate-spin' : ''}`} />
                <span>{gpsActive ? 'GPS Navigation Active' : 'START GPS NAVIGATION'}</span>
              </button>

              <button
                onClick={handleCallDispatch}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Phone className="w-4 h-4 text-slate-500" />
                <span>Call Dispatch</span>
              </button>
            </div>

            {/* Mini GPS Vector Map HUD */}
            <div className="relative h-48 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden map-grid-dark flex items-center justify-center">
              {/* Route lines */}
              <svg className="w-full h-full p-4" viewBox="0 0 450 180">
                <path
                  d="M 60 140 L 160 110 L 250 120 L 320 60 L 380 50"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <circle cx="60" cy="140" r="6" fill="#38bdf8" />
                <text x="50" y="160" fill="#94a3b8" fontSize="9" fontFamily="monospace">Ghatkopar West</text>

                <circle cx="380" cy="50" r="8" fill="#f43f5e" className="animate-ping" />
                <circle cx="380" cy="50" r="5" fill="#f43f5e" />
                <text x="310" y="38" fill="#f43f5e" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  TARGET: POLE #1049
                </text>
              </svg>

              <div className="absolute top-3 right-3 bg-slate-900/90 text-white font-mono text-[10px] px-2 py-1 rounded border border-slate-700">
                {activeJob.targetPoleCoordinates}
              </div>

              <div className="absolute bottom-3 left-3 bg-slate-900/90 text-amber-400 font-mono text-xs px-2.5 py-1 rounded border border-slate-700 font-bold flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span>TARGET: POLE #1049 • {activeJob.distance}</span>
              </div>
            </div>

            {/* Work Order Closure & Verification (Step 2 of 2) */}
            <div className="pt-3 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Work Order Closure &amp; Verification
                  </h3>
                  <p className="text-xs text-slate-500">
                    Provide photo proof and verify physical checklist completion.
                  </p>
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  STEP 2 OF 2
                </span>
              </div>

              {/* Before & After Photo Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Proof Before */}
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Before-Repair Photographic Proof
                  </span>
                  <div className="h-28 rounded-lg overflow-hidden bg-slate-900 relative">
                    <img
                      src={activeJob.proofBeforeUrl}
                      alt="Before Repair"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 left-1 bg-slate-900/80 text-[8px] font-mono text-slate-300 px-1.5 py-0.5 rounded">
                      {activeJob.proofBeforeExif}
                    </span>
                  </div>
                </div>

                {/* Proof After */}
                <div className="border-2 border-dashed border-amber-300 rounded-xl p-3 bg-amber-50/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                      After-Repair Photographic Proof
                    </span>
                    <Camera className="w-3.5 h-3.5 text-amber-600" />
                  </div>

                  {activeJob.proofAfterUrl ? (
                    <div className="h-28 rounded-lg overflow-hidden bg-slate-900 relative">
                      <img
                        src={activeJob.proofAfterUrl}
                        alt="After Repair"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 left-1 bg-emerald-600 text-[8px] font-mono text-white px-1.5 py-0.5 rounded">
                        ATTESTED
                      </span>
                    </div>
                  ) : (
                    <div className="h-28 rounded-lg border border-slate-200 bg-white flex flex-col items-center justify-center p-2 text-center">
                      <Camera className="w-6 h-6 text-slate-400 mb-1" />
                      <span className="text-[10px] text-slate-500 block">
                        Pending After Snapshot
                      </span>
                      <label className="mt-1 cursor-pointer px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[10px] rounded-md transition-colors shadow-2xs">
                        <span>Capture Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAfterPhotoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}

                  <span className="text-[9px] font-mono text-slate-400 block truncate">
                    {activeJob.proofAfterExif}
                  </span>
                </div>
              </div>

              {/* Mandatory Physical Checklist */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Mandatory Physical Checklist
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700">
                    {activeJob.checklist.filter((c) => c.checked).length} of {activeJob.checklist.length} Verifications
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {activeJob.checklist.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => toggleTechnicianChecklist(item.id)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                        item.checked
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {item.checked ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <span className="text-[11px]">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sign Off & Close Ticket Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs font-mono text-slate-500">
                  Signed with Field ID: <strong className="text-slate-800">{activeJob.fieldSignerId}</strong>
                </span>

                <button
                  onClick={submitProofAndCloseJob}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>SUBMIT PROOF &amp; CLOSE TICKET</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Route Optimization & Van Inventory */}
        <div className="lg:col-span-5 space-y-6">
          {/* Route Optimization */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-sm text-slate-900">ROUTE OPTIMIZATION</h3>
              </div>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                {routeSummary.status}
              </span>
            </div>

            <div className="space-y-3">
              {routeStops.map((stop) => (
                <div
                  key={stop.id}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                    stop.active
                      ? 'border-amber-400 bg-amber-50/30'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-5 h-5 rounded-full font-bold text-[10px] flex items-center justify-center ${
                        stop.active
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {stop.id}
                    </span>
                    <div>
                      <div className="font-bold text-slate-800">{stop.ticket}</div>
                      <div className="text-[11px] text-slate-500">
                        {stop.poleTag} • {stop.location}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${stop.badgeColor}`}
                  >
                    {stop.badge}
                  </span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">DISTANCE</span>
                <span className="font-extrabold font-mono text-base text-slate-900">
                  {routeSummary.totalDistance}
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">EST. TIME</span>
                <span className="font-extrabold font-mono text-base text-slate-900">
                  {routeSummary.estTime}
                </span>
              </div>
            </div>
          </div>

          {/* Van #07 Inventory (RFID Synced) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-slate-700" />
                <h3 className="font-bold text-sm text-slate-900">VAN #07 INVENTORY</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">RFID Synced</span>
            </div>

            <div className="space-y-2.5">
              {vanInventory.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                >
                  <span className="font-semibold text-slate-800">{item.name}</span>

                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono font-bold text-[11px] px-2 py-0.5 rounded ${
                        item.alert
                          ? 'bg-rose-100 text-rose-800 border border-rose-200 animate-pulse'
                          : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      {item.stock} {item.unit}
                    </span>

                    {/* Stock adjustment +/- buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateInventoryStock(item.id, -1)}
                        className="w-5 h-5 rounded bg-white hover:bg-slate-200 text-slate-600 flex items-center justify-center border border-slate-200 font-bold"
                        title="Use 1 unit"
                      >
                        -
                      </button>
                      <button
                        onClick={() => updateInventoryStock(item.id, 1)}
                        className="w-5 h-5 rounded bg-white hover:bg-slate-200 text-slate-600 flex items-center justify-center border border-slate-200 font-bold"
                        title="Restock 1 unit"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Safety Compliance notice */}
            <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Ensure LOTO protocol before touching terminals. Multi-meter isolation confirmation required prior to final cover re-fastening.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Next In Queue */}
      <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
          <div>
            <span className="font-extrabold uppercase text-[10px] tracking-wider text-slate-400">
              NEXT IN QUEUE:
            </span>{' '}
            <strong className="text-slate-800 font-mono">#{nextInQueue.id}</strong>{' '}
            <span className="font-mono text-slate-600">{nextInQueue.poleTag}</span> —{' '}
            <span className="text-slate-700 font-semibold">{nextInQueue.title}</span>{' '}
            <span className="text-slate-400">({nextInQueue.location})</span>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <span className="font-mono text-slate-500">
            TRANSIT: <strong>{nextInQueue.transit}</strong>
          </span>
          <button
            onClick={() =>
              showInfoToast(
                'Next Assignment Queued',
                `Pole ${nextInQueue.poleTag} is queued right after current ticket sign-off.`
              )
            }
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </ConsoleLayout>
  );
};
