import React, { useState } from 'react';
import { X, Wrench } from 'lucide-react';
import { useLumos } from '../../contexts/LumosContext';

export const CreateWorkOrderModal = ({ isOpen, onClose, initialPoleId }) => {
  const { createWorkOrder, poles } = useLumos();
  const [formData, setFormData] = useState({
    poleId: initialPoleId || (poles[0]?.id ? `LUM-${poles[0].id.replace('#', '')}` : 'LUM-W12-1049'),
    title: '',
    description: '',
    priorityLevel: 'CRITICAL',
    circuitZone: 'Feeder C4 • Somaiya',
    crewId: '07',
    crewName: 'Rajesh K.'
  });
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Work order title is required';
    if (!formData.description.trim()) errs.description = 'Fault description is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    createWorkOrder({
      ...formData,
      priority: `${formData.priorityLevel} HAZARD`
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Create Maintenance Work Order</h3>
              <p className="text-xs text-slate-400">Dispatch Telemetry & Field Crew Assignment</p>
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Target Pole Asset *
              </label>
              <select
                value={formData.poleId}
                onChange={(e) => setFormData({ ...formData, poleId: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              >
                {poles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.tag} ({p.name || p.locationName.slice(0, 20)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Priority Severity *
              </label>
              <select
                value={formData.priorityLevel}
                onChange={(e) => setFormData({ ...formData, priorityLevel: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-semibold"
              >
                <option value="CRITICAL" className="text-rose-600">CRITICAL HAZARD (4h SLA)</option>
                <option value="HIGH" className="text-amber-600">HIGH PRIORITY (8h SLA)</option>
                <option value="MEDIUM" className="text-sky-600">MEDIUM (16h SLA)</option>
                <option value="LOW" className="text-slate-600">LOW (24h+ SLA)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Issue Headline *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Exposed Low-Voltage Junction or Ballast Failure"
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 ${
                errors.title ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
              }`}
            />
            {errors.title && <p className="text-[11px] text-rose-600 mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Field Intervention Description *
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detail required repairs, cable inspections, or component replacements..."
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 ${
                errors.description ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
              }`}
            />
            {errors.description && <p className="text-[11px] text-rose-600 mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Circuit Zone
              </label>
              <input
                type="text"
                value={formData.circuitZone}
                onChange={(e) => setFormData({ ...formData, circuitZone: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Assign Field Crew
              </label>
              <select
                value={formData.crewId}
                onChange={(e) => {
                  const id = e.target.value;
                  const name = id === '07' ? 'Rajesh K.' : id === '04' ? 'Vikram S.' : id === '02' ? 'Anita V.' : 'S. Kulkarni';
                  setFormData({ ...formData, crewId: id, crewName: name });
                }}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
              >
                <option value="07">Crew #07 • Rajesh K. (Available)</option>
                <option value="04">Crew #04 • Vikram S. (On Site)</option>
                <option value="02">Crew #02 • Anita V. (Cable Seal Rig)</option>
                <option value="11">Crew #11 • S. Kulkarni (Photocell Spec)</option>
              </select>
            </div>
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
              <Wrench className="w-4 h-4" />
              <span>Schedule Order</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
