import React, { useState } from 'react';
import { X, Cpu, CheckCircle } from 'lucide-react';
import { useLumos } from '../../contexts/LumosContext';

export const ReclassifyModal = ({ intake, isOpen, onClose }) => {
  const { reclassifyIntake } = useLumos();
  const [defect, setDefect] = useState(intake?.neuralInference?.detectedDefect || 'Live Wiring & Ballast Burnout');
  const [priority, setPriority] = useState(intake?.priority || 'CRITICAL');

  if (!isOpen || !intake) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    reclassifyIntake(intake.id, defect, priority);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Re-classify Neural Triage</h3>
              <p className="text-xs text-slate-400">Manual Engineering Override for {intake.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Select Defect Classification
            </label>
            <select
              value={defect}
              onChange={(e) => setDefect(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            >
              <option value="Live Wiring & Ballast Burnout">Live Wiring & Ballast Burnout (Sparking)</option>
              <option value="Ballast Degradation">Ballast Degradation (Strobe / High Frequency Pulse)</option>
              <option value="Enclosure Tamper & Gasket Compromise">Enclosure Tamper & Gasket Compromise</option>
              <option value="Photocell Optical Degradation">Photocell Optical Degradation</option>
              <option value="Complete Blackout / Cable Sever">Complete Blackout / Cable Sever</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Target SLA Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-semibold"
            >
              <option value="CRITICAL">CRITICAL (4h SLA - Urgent Hazard)</option>
              <option value="HIGH">HIGH (8h SLA - Priority Road)</option>
              <option value="MEDIUM">MEDIUM (16h SLA - Standard)</option>
              <option value="LOW">LOW (24h+ SLA - Non-Hazard)</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Apply Classification</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
