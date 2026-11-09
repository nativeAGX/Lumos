import { X, Activity, CheckCircle2, AlertTriangle, Radio, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLumos } from '../../contexts/LumosContext';

export const QuickPoleInspectorModal = ({ pole, isOpen, onClose }) => {
  const navigate = useNavigate();
  const { pingPoleTelemetry, setSelectedPoleId } = useLumos();

  if (!isOpen || !pole) return null;

  const isCritical = pole.status === 'CRITICAL';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isCritical ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base font-mono">{pole.tag || `#${pole.id}`}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  isCritical ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
                }`}>
                  {pole.status}
                </span>
              </div>
              <p className="text-xs text-slate-400">{pole.locationName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Status banner */}
          <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
            isCritical ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}>
            {isCritical ? (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            )}
            <div className="text-xs leading-relaxed">
              <span className="font-bold block text-sm">
                {isCritical ? 'Active Hazard / Voltage Anomaly' : 'Telemetry Verified & Operating Normally'}
              </span>
              {pole.failureRiskText}
            </div>
          </div>

          {/* Diagnostics Grid */}
          <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Delivered Voltage</span>
              <span className={`text-lg font-extrabold font-mono ${isCritical ? 'text-rose-600' : 'text-slate-800'}`}>
                {pole.voltage} VAC
              </span>
              <span className="text-[10px] block text-slate-500">Nominal 230V</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Current Draw</span>
              <span className="text-lg font-extrabold font-mono text-slate-800">{pole.currentDraw} A</span>
              <span className="text-[10px] block text-slate-500">Normal 0.72A</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Dimming Lux</span>
              <span className="text-lg font-extrabold font-mono text-amber-600">{pole.dimOutput}%</span>
              <span className="text-[10px] block text-slate-500">{isCritical ? 'Emergency Peak' : 'Photocell Sync'}</span>
            </div>
          </div>

          {/* Specs */}
          <div className="space-y-2 text-xs border border-slate-200 rounded-xl p-3 bg-white">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Fixture Specification:</span>
              <span className="font-semibold text-slate-800">{pole.fixtureType}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Feeder Pillar Substation:</span>
              <span className="font-semibold text-slate-800">{pole.feederPillar}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Circuit Branch:</span>
              <span className="font-semibold text-slate-800">{pole.circuit}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">GPS Coordinates:</span>
              <span className="font-mono text-slate-700">{pole.coordinates.lat}° N, {pole.coordinates.lng}° E</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => pingPoleTelemetry(pole.id)}
              className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <Radio className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
              <span>Ping Telemetry Node</span>
            </button>

            <button
              onClick={() => {
                setSelectedPoleId(pole.id);
                onClose();
                navigate('/gis-map');
              }}
              className="flex-1 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Inspect on GIS Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
