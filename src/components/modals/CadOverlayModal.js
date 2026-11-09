import { X, Layers, Download, ShieldCheck } from 'lucide-react';
import { showSuccessToast } from '../../utils/helpers';

export const CadOverlayModal = ({ pole, isOpen, onClose }) => {
  if (!isOpen || !pole) return null;

  const handleDownload = () => {
    showSuccessToast("CAD File Downloaded", `DXF schematics for ${pole.tag} exported successfully.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-950 text-slate-100 rounded-2xl shadow-2xl border border-slate-800 w-full max-w-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base font-mono text-white">{pole.tag} CAD Schematic</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40">
                  AutoCAD DXF v2024
                </span>
              </div>
              <p className="text-xs text-slate-400">Sub-meter Structural & Phase Wiring Blueprint</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CAD Canvas Simulation */}
        <div className="p-6 space-y-4">
          <div className="relative h-64 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center map-grid-dark">
            {/* SVG Engineering Schematic */}
            <svg className="w-full h-full p-4" viewBox="0 0 500 240">
              {/* Ground level */}
              <line x1="20" y1="180" x2="480" y2="180" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
              <text x="30" y="195" fill="#64748b" fontSize="10" fontFamily="monospace">GROUND SURFACE LEVEL (RL +12.4m)</text>

              {/* Underground Conduit */}
              <rect x="180" y="190" width="140" height="25" fill="#1e293b" stroke="#0284c7" strokeWidth="1.5" />
              <text x="195" y="207" fill="#38bdf8" fontSize="9" fontFamily="monospace">PVC CONDUIT 75mm Ø</text>

              {/* Pole Base Mast */}
              <rect x="235" y="60" width="30" height="120" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="250" y1="60" x2="250" y2="180" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />

              {/* Luminaire Arm */}
              <path d="M 250 60 Q 250 30, 290 30 L 330 30" fill="none" stroke="#94a3b8" strokeWidth="3" />
              <polygon points="325,25 355,25 345,40 335,40" fill="#f59e0b" stroke="#d97706" />
              <text x="360" y="32" fill="#fbbf24" fontSize="10" fontFamily="monospace">90W LED FIXTURE</text>

              {/* Base Junction Hatch */}
              <rect x="238" y="130" width="24" height="35" fill="#0f172a" stroke="#e11d48" strokeWidth="1.5" />
              <text x="130" y="145" fill="#fb7185" fontSize="9" fontFamily="monospace">INSPECTION HATCH →</text>
              <line x1="200" y1="142" x2="236" y2="142" stroke="#e11d48" strokeWidth="1" />

              {/* Earth Electrode */}
              <line x1="250" y1="180" x2="250" y2="230" stroke="#10b981" strokeWidth="2" />
              <text x="260" y="225" fill="#34d399" fontSize="9" fontFamily="monospace">Cu EARTH ROD (2.1Ω)</text>
            </svg>

            {/* Coordinates Badge */}
            <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-xs px-2.5 py-1 rounded border border-slate-800 text-[11px] font-mono text-slate-300">
              GPS: {pole.coordinates.lat}° N, {pole.coordinates.lng}° E
            </div>
            <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-xs px-2.5 py-1 rounded border border-slate-800 text-[11px] font-mono text-emerald-400">
              FEEDER: {pole.feederPillar}
            </div>
          </div>

          {/* Blueprint Details */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-400 block text-[11px]">Substation Feeder:</span>
              <span className="font-semibold text-white">{pole.feederPillar}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Cable Specification:</span>
              <span className="font-semibold text-white">4-Core 16mm² XLPE Armoured</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Pole Material & Height:</span>
              <span className="font-semibold text-white">Octagonal GI Steel • 9.0 Meters</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Compliance Standard:</span>
              <span className="font-semibold text-white">IS 2713 / IEC 60598-2-3</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              MCGM Municipal Engineering Seal
            </span>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export DXF / DWG</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
