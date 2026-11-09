import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Lightbulb, Compass, ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 map-grid-dark text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 mb-6 shadow-lg shadow-amber-500/10">
        <Lightbulb className="w-8 h-8 fill-amber-500" />
      </div>

      <span className="text-xs font-mono font-bold tracking-widest text-amber-400 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/40 mb-3">
        ERROR 404 • GRID NODE UNREACHABLE
      </span>

      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
        Circuit Node Not Found
      </h1>

      <p className="text-sm text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
        The requested telemetry corridor or administrative console page does not exist in the active Western District 04 mesh routing table.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 transition-colors border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Back</span>
        </button>

        <NavLink
          to="/"
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors shadow-sm"
        >
          <Home className="w-4 h-4" />
          <span>Municipal Portal</span>
        </NavLink>

        <NavLink
          to="/gis-map"
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-sky-400 font-bold text-xs flex items-center gap-2 transition-colors border border-sky-800/60"
        >
          <Compass className="w-4 h-4" />
          <span>GIS Digital Twin</span>
        </NavLink>
      </div>
    </div>
  );
};
