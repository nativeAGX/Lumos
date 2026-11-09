import React, { useState } from 'react';
import { X, Plus, Zap } from 'lucide-react';
import { useLumos } from '../../contexts/LumosContext';
import { WARDS_LIST } from '../../constants';

export const RegisterPoleModal = ({ isOpen, onClose }) => {
  const { registerPole, selectedWard } = useLumos();
  const [formData, setFormData] = useState({
    id: `LUM-W12-${Math.floor(1000 + Math.random() * 9000)}`,
    name: '',
    locationName: '',
    feederPillar: 'FP-12-NORTH-C',
    circuit: 'Branch Circuit 12-N4',
    fixtureType: '90W Smart-Dim LED',
    lat: '19.0728',
    lng: '72.8998',
    status: 'HEALTHY',
    voltage: '230'
  });
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.id.trim()) errs.id = 'Pole Identifier is required';
    if (!formData.locationName.trim()) errs.locationName = 'Location description is required';
    if (!formData.lat || isNaN(formData.lat)) errs.lat = 'Valid latitude is required';
    if (!formData.lng || isNaN(formData.lng)) errs.lng = 'Valid longitude is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    registerPole(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Register Streetlight Asset</h3>
              <p className="text-xs text-slate-400">Geospatial Telemetry Node Commissioning</p>
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
                Pole Identifier Tag *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  placeholder="LUM-W12-1049"
                  className={`w-full px-3 py-2 text-sm border rounded-lg font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-500 ${
                    errors.id ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.id && <p className="text-[11px] text-rose-600 mt-1">{errors.id}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Operational Sector / Ward
              </label>
              <select
                value={selectedWard}
                disabled
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-slate-100 text-slate-700 font-medium"
              >
                {WARDS_LIST.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Geographic Location Description *
            </label>
            <input
              type="text"
              value={formData.locationName}
              onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
              placeholder="e.g., Somaiya Tech Campus Core, Gate 4"
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 ${
                errors.locationName ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
              }`}
            />
            {errors.locationName && <p className="text-[11px] text-rose-600 mt-1">{errors.locationName}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Feeder Pillar Substation
              </label>
              <select
                value={formData.feederPillar}
                onChange={(e) => setFormData({ ...formData, feederPillar: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              >
                <option value="FP-12-NORTH-C">FP-12-NORTH-C (Somaiya Core)</option>
                <option value="FP-12-WEST-A">FP-12-WEST-A (Engineering)</option>
                <option value="FP-12-SOUTH-B">FP-12-SOUTH-B (Sports Arena)</option>
                <option value="FP-12-EAST-D">FP-12-EAST-D (Hostel Quadrant)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Circuit Branch
              </label>
              <input
                type="text"
                value={formData.circuit}
                onChange={(e) => setFormData({ ...formData, circuit: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Fixture Luminaire Type
              </label>
              <select
                value={formData.fixtureType}
                onChange={(e) => setFormData({ ...formData, fixtureType: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              >
                <option value="90W Smart-Dim LED">90W Smart-Dim LED</option>
                <option value="120W High-Mast LED">120W High-Mast LED</option>
                <option value="70W Warm-Pedestrian LED">70W Warm-Pedestrian LED</option>
                <option value="150W Flood Photocell LED">150W Flood Photocell LED</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Initial Operational State
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              >
                <option value="HEALTHY">Healthy (100% On)</option>
                <option value="DIMMED">Dimmed (40% Scheduled)</option>
                <option value="CRITICAL">Critical Fault / Tripped</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                GPS Latitude
              </label>
              <input
                type="text"
                value={formData.lat}
                onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                placeholder="19.0728"
                className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                GPS Longitude
              </label>
              <input
                type="text"
                value={formData.lng}
                onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                placeholder="72.8998"
                className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded bg-white"
              />
            </div>
          </div>

          {/* Footer Controls */}
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
              <Plus className="w-4 h-4" />
              <span>Commission Asset</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
