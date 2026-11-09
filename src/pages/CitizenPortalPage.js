import React, { useState } from 'react';
import {
  MapPin,
  AlertTriangle,
  ZapOff,
  Moon,
  ShieldAlert,
  Camera,
  CheckCircle2,
  Clock,
  ArrowRight,
  Phone,
  Radio
} from 'lucide-react';
import { CitizenLayout } from '../layouts/CitizenLayout';
import { useLumos } from '../contexts/LumosContext';
import { useAuth } from '../contexts/AuthContext';
import { FAULT_TYPES, EMERGENCY_HELPLINE } from '../constants';
import { showInfoToast, showSuccessToast, showWarningToast } from '../utils/helpers';
import { QuickPoleInspectorModal } from '../components/modals/QuickPoleInspectorModal';

export const CitizenPortalPage = () => {
  const { grievances, fileGrievance, poles, grievanceTab, setGrievanceTab } = useLumos();
  const { currentUser } = useAuth();

  // Form State
  const [poleId, setPoleId] = useState('#LUM-W12-1049');
  const [locationName, setLocationName] = useState('Somaiya Vidyavihar North Gate, Road 4');
  const [feederPillar, setFeederPillar] = useState('FP-12-04 (Ward 12)');
  const [selectedFault, setSelectedFault] = useState('sparking');
  const [incidentObservation, setIncidentObservation] = useState(
    'Streetlight pole outside Vidyavihar North Gate is blacked out since rain. Base junction hatch slightly opened. Pedestrians facing difficulty.'
  );
  const [photoPreview, setPhotoPreview] = useState(
    'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=600&q=80'
  );
  const citizenPhone = '+91 98201 44820 (OTP Verified)';
  const [receiveUpdates, setReceiveUpdates] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTelemetryPole, setSelectedTelemetryPole] = useState(null);

  // Auto-detect GPS Location handler
  const handleDetectLocation = () => {
    setPoleId('#LUM-W12-1049');
    setLocationName('Somaiya Vidyavihar North Gate, Road 4');
    setFeederPillar('FP-12-04 (Ward 12)');
    showSuccessToast(
      'GPS Geofence Synced',
      'Nearest pole locked: #LUM-W12-1049 (Offset: 3.2m • Somaiya Quad Road 4)'
    );
  };

  // Simulated photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        showSuccessToast('Photo Telemetry Captured', 'EXIF Geotag validated: 19.0728° N, 72.8998° E');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearPhoto = () => {
    setPhotoPreview(null);
    showInfoToast('Photo Cleared', 'You may re-upload a snapshot or continue without it.');
  };

  // Submit Grievance
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!poleId.trim()) {
      showWarningToast('Pole ID Required', 'Please enter a pole identifier tag or detect location.');
      return;
    }
    if (!incidentObservation.trim()) {
      showWarningToast('Observation Required', 'Please describe the observed defect.');
      return;
    }

    setIsSubmitting(true);

    const faultObj = FAULT_TYPES.find((f) => f.id === selectedFault) || FAULT_TYPES[0];

    setTimeout(() => {
      fileGrievance({
        poleId,
        locationName,
        natureOfFault: faultObj.title,
        faultCategory: faultObj.id,
        incidentObservation,
        photoUrl: photoPreview,
        citizenName: currentUser?.name || 'Rahul M.',
        citizenPhone: currentUser?.phone || '+91 98201 44820'
      });

      setIsSubmitting(false);
      // Reset observation for another report
      setIncidentObservation('');
    }, 450);
  };

  // Filter complaints
  const filteredGrievances = grievances.filter((g) => {
    if (grievanceTab === 'ACTIVE') return g.status === 'IN_PROGRESS';
    if (grievanceTab === 'CLOSED') return g.status === 'RESOLVED';
    return true;
  });

  const activeCount = grievances.filter((g) => g.status === 'IN_PROGRESS').length;
  const closedCount = grievances.filter((g) => g.status === 'RESOLVED').length;

  return (
    <CitizenLayout>
      {/* Top Banner & KPI Stat Badges */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-extrabold tracking-wider uppercase text-slate-500">
                WARD 12 ELECTRICAL CELL • TELEMETRY ACTIVE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Citizen Streetlight Grievance Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Report non-functional, flickering, or hazardous streetlights directly to Ward 12 Municipal Electrical Engineers with real-time field progress tracking.
            </p>
          </div>

          {/* KPI Counters */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-center min-w-[100px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                COMPLAINTS
              </span>
              <span className="text-2xl font-extrabold text-slate-900 font-mono">
                {String(grievances.length).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-slate-500 block">Filed</span>
            </div>

            <div className="px-4 py-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200 text-center min-w-[100px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                RESOLVED
              </span>
              <span className="text-2xl font-extrabold text-emerald-800 font-mono">
                {String(closedCount).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-emerald-600 font-medium block">Avg 4.2h SLA</span>
            </div>

            <div className="px-4 py-2.5 bg-amber-50/70 rounded-xl border border-amber-200 text-center min-w-[100px]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                ACTIVE SLA
              </span>
              <span className="text-2xl font-extrabold text-amber-900 font-mono">
                {String(activeCount).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-amber-700 font-semibold block">ETA ~15 Mins</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Form (Left) & My Filed Complaints (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: File Grievance Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">File Streetlight Grievance</h2>
              <p className="text-xs text-slate-500">
                Submit pole defects directly for prioritized municipal crew dispatch
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
              REF: CIV-2026-F
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Streetlight Pole ID / Location */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                1. Streetlight Pole ID / Location
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={poleId}
                  onChange={(e) => setPoleId(e.target.value)}
                  placeholder="#LUM-W12-1049"
                  className="w-full px-3.5 py-2.5 text-sm font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 transition-colors self-start"
                  >
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>Detect Location (Somaiya Quad Road 4)</span>
                  </button>

                  <span className="text-[11px] font-mono text-slate-500">
                    Feeder: {feederPillar}
                  </span>
                </div>
              </div>
            </div>

            {/* Step 2: Nature of Fault */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  2. Nature of Fault
                </label>
                <span className="text-[11px] text-slate-400">Select one</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FAULT_TYPES.map((fault) => {
                  const isSelected = selectedFault === fault.id;
                  return (
                    <button
                      type="button"
                      key={fault.id}
                      onClick={() => setSelectedFault(fault.id)}
                      className={`text-left p-3.5 rounded-xl border-2 transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs ${
                            isSelected ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {fault.id === 'blackout' && <Moon className="w-3.5 h-3.5" />}
                            {fault.id === 'flickering' && <ZapOff className="w-3.5 h-3.5" />}
                            {fault.id === 'sparking' && <AlertTriangle className="w-3.5 h-3.5" />}
                            {fault.id === 'collision' && <ShieldAlert className="w-3.5 h-3.5" />}
                          </div>
                          <span className="font-bold text-xs text-slate-900 leading-tight">
                            {fault.title.split('/')[0]}
                          </span>
                        </div>

                        {fault.urgentBadge && (
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-rose-500 text-white animate-pulse">
                            URGENT
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">{fault.subtitle}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Incident Observation */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                3. Incident Observation
              </label>
              <textarea
                rows={3}
                value={incidentObservation}
                onChange={(e) => setIncidentObservation(e.target.value)}
                placeholder="Describe details, safety hazards, nearby landmarks, or visual symptoms..."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Step 4: Photo Telemetry Verification */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  4. Photo Telemetry Verification
                </label>
                <span className="text-[11px] text-slate-400">Optional</span>
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
                {photoPreview ? (
                  <div className="space-y-3">
                    <div className="relative inline-block max-w-sm rounded-xl overflow-hidden border border-slate-300 shadow-xs">
                      <img
                        src={photoPreview}
                        alt="Captured Fault Evidence"
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-white text-[10px] font-mono px-2 py-1 text-left flex justify-between">
                        <span>EXIF: 19.0728° N, 72.8998° E</span>
                        <span className="text-emerald-400 font-semibold">Tamper Verified</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                      <label className="cursor-pointer text-xs font-semibold text-amber-700 hover:text-amber-800">
                        <span>Change Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                      <span className="text-slate-300">•</span>
                      <button
                        type="button"
                        onClick={handleClearPhoto}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-2">
                      <Camera className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-700">
                      Upload pole stencil, fixture, or base snapshot
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      JPG, PNG under 10MB • Auto-extracts EXIF GPS coordinates
                    </p>

                    <div className="mt-3 flex items-center justify-center gap-2">
                      <label className="cursor-pointer px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 shadow-xs transition-colors">
                        <span>Choose File / Camera</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step 5: Citizen Contact Updates */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                5. Citizen Contact Updates
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  disabled
                  value={citizenPhone}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-100 text-slate-700 font-mono font-medium border border-slate-300 rounded-xl"
                />

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={receiveUpdates}
                    onChange={(e) => setReceiveUpdates(e.target.checked)}
                    className="rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                  />
                  <span className="text-xs text-slate-600 font-medium">
                    Receive WhatsApp &amp; SMS live repair notifications
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
              >
                <span>{isSubmitting ? 'Registering Grievance...' : 'Submit Grievance to Municipal Grid'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-[11px] text-slate-400 text-center mt-2">
                Tickets are triaged by AI within 15 minutes and assigned to Ward 12 field engineers.
              </p>
            </div>
          </form>
        </div>

        {/* Right Column: My Filed Complaints & Emergency Banner (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Complaints Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">My Filed Complaints</h3>

              {/* Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setGrievanceTab('ALL')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    grievanceTab === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  All ({grievances.length})
                </button>
                <button
                  onClick={() => setGrievanceTab('ACTIVE')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    grievanceTab === 'ACTIVE' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Active ({activeCount})
                </button>
                <button
                  onClick={() => setGrievanceTab('CLOSED')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    grievanceTab === 'CLOSED' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  Closed ({closedCount})
                </button>
              </div>
            </div>

            {/* List of complaints */}
            <div className="space-y-4">
              {filteredGrievances.map((complaint) => {
                const isActive = complaint.status === 'IN_PROGRESS';

                if (isActive) {
                  return (
                    <div
                      key={complaint.id}
                      className="border-2 border-amber-300 bg-amber-50/20 rounded-2xl p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 font-bold text-amber-900">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                          <span>IN PROGRESS • CREW EN ROUTE</span>
                        </span>
                        <span className="font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                          ETA: 15 MINS
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono text-sm font-bold text-slate-900">
                            #{complaint.id}
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            Filed {complaint.timestamp}
                          </span>
                        </div>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                          HIGH PRIORITY
                        </span>
                      </div>

                      <div className="text-xs">
                        <div className="font-semibold text-slate-800">
                          Pole {complaint.poleTag}
                        </div>
                        <div className="text-slate-500">{complaint.locationName}</div>
                        <div className="text-slate-600 font-medium mt-1">
                          {complaint.natureOfFault}
                        </div>
                      </div>

                      {/* Live Field Pipeline Steps */}
                      <div className="bg-white rounded-xl p-3 border border-slate-200 space-y-2 text-xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          LIVE FIELD PIPELINE
                        </span>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-emerald-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>1. Reported &amp; Triaged (18:47)</span>
                          </div>
                          <div className="flex items-center gap-2 text-emerald-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>2. Dispatched (#WO-881)</span>
                          </div>
                          <div className="flex items-center gap-2 text-amber-700 font-bold bg-amber-50 p-1 rounded">
                            <Radio className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                            <span>3. In Progress (Van 07 en route)</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span>4. Resolved &amp; Verified</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            const foundPole = poles.find(
                              (p) => p.id === complaint.poleId || p.tag === complaint.poleTag
                            ) || poles[0];
                            setSelectedTelemetryPole(foundPole);
                          }}
                          className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Radio className="w-3 h-3 text-amber-400" />
                          <span>Live Telemetry Status</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            showInfoToast(
                              'Ward Desk Connected',
                              'Ward 12 Municipal Cell: +91 22 2507 2200 (Desk In-Charge: Somaiya Sector)'
                            )
                          }
                          className="py-2 px-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold rounded-lg text-xs transition-colors"
                        >
                          WARD DESK
                        </button>
                      </div>
                    </div>
                  );
                }

                // Resolved Cards
                return (
                  <div
                    key={complaint.id}
                    className="border border-slate-200 bg-slate-50/50 rounded-2xl p-4 space-y-2 hover:bg-white transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 font-bold text-emerald-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>RESOLVED</span>
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {complaint.timestamp}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-800">
                        #{complaint.id}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {complaint.slaDuration || '4.2h SLA'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">
                      Pole {complaint.poleTag} ({complaint.locationName}) —{' '}
                      <span className="text-slate-800 font-medium">{complaint.resolutionNotes}</span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Immediate Electrical Danger Warning */}
          <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 text-rose-900 space-y-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm leading-tight text-rose-800 uppercase tracking-wide">
                  IMMEDIATE ELECTRICAL DANGER?
                </h4>
                <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                  If you observe live fallen cables or active sparking, do not approach within 10 meters. Call the 24/7 municipal emergency cutoff line immediately.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-rose-200">
              <span className="text-xs font-semibold text-rose-700">Toll-Free Emergency</span>
              <a
                href={`tel:${EMERGENCY_HELPLINE}`}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call {EMERGENCY_HELPLINE}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedTelemetryPole && (
        <QuickPoleInspectorModal
          pole={selectedTelemetryPole}
          isOpen={!!selectedTelemetryPole}
          onClose={() => setSelectedTelemetryPole(null)}
        />
      )}
    </CitizenLayout>
  );
};
