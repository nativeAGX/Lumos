import React, { useState } from 'react';
import {
  Plus,
  Radio,
  AlertTriangle,
  Copy,
  ZoomIn,
  ZoomOut,
  Table,
  Compass,
  Search,
  Trash2
} from 'lucide-react';
import { ConsoleLayout } from '../layouts/ConsoleLayout';
import { useLumos } from '../contexts/LumosContext';
import { WARDS_LIST } from '../constants';
import { showSuccessToast } from '../utils/helpers';

export const GisMapPage = () => {
  const {
    poles,
    selectedPole,
    setSelectedPoleId,
    activeGisFilter,
    setActiveGisFilter,
    pingPoleTelemetry,
    setIsRegisterPoleOpen,
    setIsCreateWorkOrderOpen,
    setCadOverlayPole,
    deletePole,
    selectedWard,
    setSelectedWard
  } = useLumos();

  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewMode, setViewMode] = useState('MAP'); // 'MAP' or 'TABLE'
  const [tableSearch, setTableSearch] = useState('');

  const criticalCount = poles.filter((p) => p.status === 'CRITICAL').length;

  const handleCopyPoleId = (id) => {
    navigator.clipboard?.writeText(id);
    showSuccessToast('Copied to Clipboard', `Pole Identifier ${id} copied.`);
  };

  // Filtered poles based on GIS pills
  const displayedPoles = poles.filter((p) => {
    if (activeGisFilter === 'ACTIVE') return p.status === 'HEALTHY';
    if (activeGisFilter === 'DIMMED') return p.status === 'DIMMED';
    if (activeGisFilter === 'FAULTS') return p.status === 'CRITICAL';
    return true;
  });

  // Table search
  const tablePoles = displayedPoles.filter(
    (p) =>
      p.id.toLowerCase().includes(tableSearch.toLowerCase()) ||
      p.locationName.toLowerCase().includes(tableSearch.toLowerCase()) ||
      p.circuit.toLowerCase().includes(tableSearch.toLowerCase())
  );

  return (
    <ConsoleLayout>
      {/* Top Header & Metrics Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                STREETLIGHT GIS MAP &amp; ASSETS • GIS V4.2
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Geospatial Asset Registry &amp; Circuit Telemetry
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Live geospatial inventory and circuit telemetry for {selectedWard}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Sector Dropdown */}
            <div className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs font-semibold text-slate-700">
              <span className="text-[10px] text-slate-400 uppercase font-bold">OPERATIONAL SECTOR</span>
              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="bg-transparent font-bold text-slate-900 focus:outline-hidden cursor-pointer"
              >
                {WARDS_LIST.map((ward) => (
                  <option key={ward} value={ward}>
                    {ward}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Metrics */}
            <div className="hidden xl:flex items-center gap-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
              <span className="text-slate-800">14,820 Total Poles</span>
              <span className="text-slate-300">|</span>
              <span className="text-emerald-700">14,350 Healthy</span>
              <span className="text-slate-300">|</span>
              <span className="text-rose-600">{criticalCount || 82} Faults</span>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setViewMode('MAP')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === 'MAP' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>GIS Map</span>
              </button>
              <button
                onClick={() => setViewMode('TABLE')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  viewMode === 'TABLE' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Asset Table</span>
              </button>
            </div>

            {/* Register Pole Button */}
            <button
              onClick={() => setIsRegisterPoleOpen(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Register Pole</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Map / Table (Left 8 cols) & Asset Node Inspector (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Map / Table View */}
        <div className="lg:col-span-8 space-y-4">
          {/* Filter Pills Bar */}
          <div className="flex flex-wrap items-center gap-2 bg-white p-2.5 rounded-2xl border border-slate-200 text-xs font-semibold">
            <span className="text-[11px] font-mono text-slate-500 px-2 py-1 bg-slate-100 rounded-lg flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-700"></span>
              Feeder Trunk 12-N
            </span>

            <button
              onClick={() => setActiveGisFilter('ALL')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeGisFilter === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Nodes ({poles.length})
            </button>

            <button
              onClick={() => setActiveGisFilter('ACTIVE')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                activeGisFilter === 'ACTIVE'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Active Circuits
            </button>

            <button
              onClick={() => setActiveGisFilter('DIMMED')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                activeGisFilter === 'DIMMED'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Dimmed (40%)
            </button>

            <button
              onClick={() => setActiveGisFilter('FAULTS')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                activeGisFilter === 'FAULTS'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-50 text-rose-700 hover:bg-rose-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              Faults ({criticalCount || 82})
            </button>
          </div>

          {/* Interactive GIS Map View */}
          {viewMode === 'MAP' ? (
            <div className="relative bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-md">
              {/* GIS Vector Map Canvas */}
              <div className="relative h-[540px] w-full map-grid-dark flex items-center justify-center overflow-hidden">
                <svg
                  className="w-full h-full transition-transform duration-300"
                  style={{ transform: `scale(${zoomLevel})` }}
                  viewBox="0 0 700 480"
                >
                  {/* Municipal Road Grid Outlines */}
                  <g opacity="0.35" stroke="#334155" strokeWidth="18" fill="none">
                    {/* Campus Central Blvd */}
                    <path d="M 60 260 L 640 260" />
                    {/* Vidyavihar Radial Ave */}
                    <path d="M 380 60 L 380 440" />
                    {/* Diagonal connector */}
                    <path d="M 180 100 L 540 380" />
                  </g>

                  {/* Road Centerlines */}
                  <g stroke="#64748b" strokeWidth="1.5" strokeDasharray="6 6" fill="none" opacity="0.6">
                    <line x1="60" y1="260" x2="640" y2="260" />
                    <line x1="380" y1="60" x2="380" y2="440" />
                  </g>

                  {/* Sector Zone Labels */}
                  <text x="90" y="120" fill="#475569" fontSize="11" fontWeight="bold" fontFamily="monospace">
                    SOMAIYA TECH CAMPUS CORE
                  </text>
                  <text x="310" y="90" fill="#475569" fontSize="11" fontWeight="bold" fontFamily="monospace">
                    ENGINEERING COMPLEX WEST
                  </text>
                  <text x="80" y="380" fill="#475569" fontSize="11" fontWeight="bold" fontFamily="monospace">
                    ATHLETICS ARENA SECTOR B
                  </text>
                  <text x="440" y="380" fill="#475569" fontSize="11" fontWeight="bold" fontFamily="monospace">
                    HOSTEL QUADRANT
                  </text>
                  <text x="140" y="250" fill="#64748b" fontSize="10" fontFamily="sans-serif">
                    CAMPUS CENTRAL BLVD
                  </text>
                  <text x="390" y="160" fill="#64748b" fontSize="10" fontFamily="sans-serif" transform="rotate(90 390 160)">
                    VIDYAVIHAR RADIAL AVE
                  </text>

                  {/* Feeder Pillar Substation Marker */}
                  <g transform="translate(365, 245)">
                    <rect x="0" y="0" width="30" height="30" fill="#0284c7" rx="6" />
                    <text x="15" y="18" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">
                      FP
                    </text>
                    <text x="15" y="42" fill="#38bdf8" fontSize="9" fontFamily="monospace" textAnchor="middle">
                      FP-12-NORTH-C
                    </text>
                  </g>

                  {/* Circuit Telemetry Trunk Line Connections */}
                  <g stroke="#0284c7" strokeWidth="2" strokeDasharray="3 3" opacity="0.7" fill="none">
                    <path d="M 380 260 L 480 260" />
                    <path d="M 380 260 L 380 190" />
                    <path d="M 380 260 L 330 195" />
                    <path d="M 380 260 L 520 340" />
                    <path d="M 380 260 L 230 260" />
                    <path d="M 230 260 L 180 330" />
                    <path d="M 480 260 L 520 280" />
                  </g>

                  {/* Interactive Pole Markers */}
                  {displayedPoles.map((pole) => {
                    const isSelected = pole.id === selectedPole?.id;
                    const isCritical = pole.status === 'CRITICAL';
                    const isDimmed = pole.status === 'DIMMED';

                    let markerColor = '#10b981'; // Green (100% on)
                    if (isCritical) markerColor = '#ef4444'; // Red
                    if (isDimmed) markerColor = '#f59e0b'; // Amber

                    return (
                      <g
                        key={pole.id}
                        transform={`translate(${pole.mapX || 300}, ${pole.mapY || 200})`}
                        onClick={() => setSelectedPoleId(pole.id)}
                        className="cursor-pointer group"
                      >
                        {/* Glow halo when selected or critical */}
                        {(isSelected || isCritical) && (
                          <circle
                            r={isSelected ? 18 : 14}
                            fill={markerColor}
                            opacity={isCritical ? '0.4' : '0.2'}
                            className={isCritical ? 'animate-ping' : ''}
                          />
                        )}

                        {/* Outer Ring */}
                        <circle
                          r={isSelected ? 9 : 7}
                          fill="#0f172a"
                          stroke={markerColor}
                          strokeWidth={isSelected ? 3 : 2}
                        />

                        {/* Inner Core */}
                        <circle r={isSelected ? 4 : 3} fill={markerColor} />

                        {/* Stamped Tag on Map */}
                        {isSelected && (
                          <g transform="translate(14, -18)">
                            <rect
                              x="0"
                              y="0"
                              width="125"
                              height="34"
                              rx="6"
                              fill="#090d16"
                              stroke={isCritical ? '#f43f5e' : '#38bdf8'}
                              strokeWidth="1.5"
                            />
                            <text x="8" y="14" fill="white" fontSize="10" fontWeight="bold" fontFamily="monospace">
                              {pole.tag}
                            </text>
                            <text
                              x="8"
                              y="26"
                              fill={isCritical ? '#fb7185' : '#34d399'}
                              fontSize="9"
                              fontWeight="600"
                              fontFamily="monospace"
                            >
                              {pole.voltage} VAC • {isCritical ? 'VOLTAGE CRIT' : '100% ON'}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </svg>

                {/* Map Floating Controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-10">
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
                    className="w-8 h-8 rounded-lg bg-slate-900/90 text-white border border-slate-700 flex items-center justify-center hover:bg-slate-800 transition-colors shadow-sm"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
                    className="w-8 h-8 rounded-lg bg-slate-900/90 text-white border border-slate-700 flex items-center justify-center hover:bg-slate-800 transition-colors shadow-sm"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setZoomLevel(1)}
                    className="w-8 h-8 rounded-lg bg-slate-900/90 text-white border border-slate-700 flex items-center justify-center hover:bg-slate-800 transition-colors shadow-sm text-xs font-mono"
                    title="Reset Zoom"
                  >
                    1x
                  </button>
                </div>

                {/* Map Legend */}
                <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-xs border border-slate-800 rounded-xl px-3 py-2 flex items-center gap-4 text-xs font-semibold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span>100% On</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    <span>Dimmed (Scheduled)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                    <span>Tripped / Drop</span>
                  </span>
                </div>
              </div>

              {/* Bottom Telemetry Sync Bar */}
              <div className="px-4 py-2.5 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Radio className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  <span>
                    Mesh Gateway Node:{' '}
                    <strong className="text-white font-mono">{selectedPole?.meshNode || 'GW-SOMAIYA-EAST-04'}</strong>{' '}
                    (Ping: 24ms, 99.8% mesh uptime)
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span>LAST SYNC: 18S AGO</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
              </div>
            </div>
          ) : (
            /* Table View with Full CRUD (Search, Filter, Edit, Delete) */
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    placeholder="Search pole ID, location, or circuit..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <span className="text-xs text-slate-500">
                  Showing {tablePoles.length} of {poles.length} assets
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Pole ID</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Fixture Type</th>
                      <th className="py-3 px-4">Feeder Pillar</th>
                      <th className="py-3 px-4">Delivered VAC</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tablePoles.map((p) => {
                      const isCrit = p.status === 'CRITICAL';
                      return (
                        <tr
                          key={p.id}
                          className={`hover:bg-slate-50 cursor-pointer ${
                            p.id === selectedPole?.id ? 'bg-amber-50/50' : ''
                          }`}
                          onClick={() => setSelectedPoleId(p.id)}
                        >
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">
                            {p.tag}
                          </td>
                          <td className="py-3 px-4 text-slate-700 max-w-[200px] truncate">
                            {p.locationName}
                          </td>
                          <td className="py-3 px-4 text-slate-600">{p.fixtureType}</td>
                          <td className="py-3 px-4 font-mono text-slate-600">{p.feederPillar}</td>
                          <td className="py-3 px-4 font-mono">
                            <span
                              className={`font-bold ${
                                isCrit ? 'text-rose-600' : 'text-slate-800'
                              }`}
                            >
                              {p.voltage} VAC
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                isCrit
                                  ? 'bg-rose-100 text-rose-800'
                                  : p.status === 'DIMMED'
                                  ? 'bg-amber-100 text-amber-900'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => {
                                setSelectedPoleId(p.id);
                                pingPoleTelemetry(p.id);
                              }}
                              title="Ping Telemetry"
                              className="p-1 hover:bg-slate-200 rounded text-slate-600"
                            >
                              <Radio className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deletePole(p.id)}
                              title="Decommission Pole"
                              className="p-1 hover:bg-rose-100 rounded text-rose-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Detailed Pole Inspector Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                ASSET NODE ID
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xl font-extrabold font-mono text-slate-900">
                  {selectedPole?.tag}
                </span>
                <button
                  onClick={() => handleCopyPoleId(selectedPole?.tag)}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                  title="Copy ID"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <span
              className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                selectedPole?.status === 'CRITICAL'
                  ? 'bg-rose-100 text-rose-700 border border-rose-200'
                  : selectedPole?.status === 'DIMMED'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              • {selectedPole?.status === 'CRITICAL' ? 'CRITICAL FAULT' : selectedPole?.status}
            </span>
          </div>

          {/* Quick Specifications */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">FIXTURE TYPE</span>
              <span className="font-bold text-slate-800">{selectedPole?.fixtureType}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">FEEDER PILLAR</span>
              <span className="font-bold text-slate-800 font-mono">{selectedPole?.feederPillar}</span>
            </div>
          </div>

          {/* Coordinates & CAD Overlay */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">GEOSPATIAL COORDINATES</span>
              <span className="font-mono text-slate-700">
                {selectedPole?.coordinates?.lat}° N, {selectedPole?.coordinates?.lng}° E
              </span>
            </div>
            <button
              onClick={() => setCadOverlayPole(selectedPole)}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 underline decoration-amber-400 flex items-center gap-1"
            >
              <span>Open CAD Overlay</span>
            </button>
          </div>

          {/* Live Telemetry Diagnostics */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">Live Telemetry Diagnostics</span>
              <span className="text-[10px] text-slate-400 font-mono">
                Sampled @ {selectedPole?.lastSampled || '21:04:12'}
              </span>
            </div>

            {/* Delivered Voltage Gauge Card */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase text-slate-500">DELIVERED VOLTAGE</span>
                {selectedPole?.status === 'CRITICAL' && (
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                    ↓ -38% drop (Nominal 230V)
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-1">
                <span
                  className={`text-3xl font-extrabold font-mono ${
                    selectedPole?.status === 'CRITICAL' ? 'text-rose-600' : 'text-slate-900'
                  }`}
                >
                  {selectedPole?.voltage}
                </span>
                <span className="text-xs text-slate-500 font-bold">VAC</span>
              </div>

              {/* Voltage Range Bar */}
              <div className="space-y-1">
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full transition-all duration-500 ${
                      selectedPole?.status === 'CRITICAL' ? 'bg-rose-500 w-[61%]' : 'bg-emerald-500 w-[95%]'
                    }`}
                  ></div>
                </div>
                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                  <span>0 VAC</span>
                  <span className="text-rose-600 font-semibold">Crit: &lt;185 VAC</span>
                  <span>230 VAC</span>
                </div>
              </div>
            </div>

            {/* Current Draw & Dim Output */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">CURRENT DRAW</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-extrabold font-mono text-slate-900">
                    {selectedPole?.currentDraw}
                  </span>
                  <span className="text-xs text-slate-500 font-bold">A</span>
                </div>
                <span className="text-[10px] text-slate-400 block">Normal: 0.72A</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">DIM OUTPUT</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-extrabold font-mono text-amber-600">
                    {selectedPole?.dimOutput}
                  </span>
                  <span className="text-xs text-slate-500 font-bold">%</span>
                </div>
                <span className="text-[10px] text-amber-700 font-medium block">
                  {selectedPole?.status === 'CRITICAL' ? 'Emergency Peak' : 'Adaptive Lux'}
                </span>
              </div>
            </div>
          </div>

          {/* High Failure Risk Alert */}
          {selectedPole?.status === 'CRITICAL' && (
            <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl space-y-1 text-rose-900">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>88% High Failure Risk</span>
              </div>
              <p className="text-xs text-rose-700 leading-relaxed">
                {selectedPole?.failureRiskText}
              </p>
            </div>
          )}

          {/* Action CTAs */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => setIsCreateWorkOrderOpen(true)}
              className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Create Work Order</span>
            </button>

            <button
              onClick={() => pingPoleTelemetry(selectedPole?.id)}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Radio className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
              <span>Ping Node Telemetry</span>
            </button>
          </div>

          {/* MAC & Hardware Specs */}
          <div className="pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-400 text-center">
            Pole MAC: {selectedPole?.macAddress} • Firmware {selectedPole?.firmware}
          </div>

          {/* Connected Circuit Branch */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-slate-900">{selectedPole?.circuit}</div>
              <div className="text-[11px] text-slate-500">
                {selectedPole?.connectedPolesCount || 31} Poles Connected •{' '}
                <span className="text-rose-600 font-semibold">1 Critical</span>
              </div>
            </div>
            <span className="text-slate-400 text-sm">›</span>
          </div>
        </div>
      </div>
    </ConsoleLayout>
  );
};
