import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Lightbulb, Phone, ShieldCheck, LogOut, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { EMERGENCY_HELPLINE } from '../constants';

export const CitizenLayout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Citizen Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <NavLink to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 group-hover:scale-105 transition-transform shadow-xs">
                <Lightbulb className="w-5 h-5 fill-amber-500 text-amber-600" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-extrabold tracking-tight text-slate-900 text-lg">LUMOS</span>
                <span className="text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                  MUNICIPAL
                </span>
              </div>
            </NavLink>

            <span className="hidden sm:inline text-xs text-slate-400 font-medium ml-2">
              Citizen Grievance Cell
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Toll-Free Help Desk */}
            <a
              href={`tel:${EMERGENCY_HELPLINE}`}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold hover:bg-amber-100 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden md:inline text-[11px] font-medium text-amber-700">CIVIC HELPLINE</span>
              <span className="font-mono text-xs">{EMERGENCY_HELPLINE}</span>
            </a>

            {/* Verified Citizen Badge */}
            <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">
                {currentUser?.avatar || 'RM'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="font-bold text-slate-800 leading-none">{currentUser?.name || 'Rahul M.'}</div>
                <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                  <span>{currentUser?.phone || '+91 98201 ••••'}</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1 py-0.2 rounded font-bold uppercase">
                    VERIFIED
                  </span>
                </div>
              </div>
            </div>

            {/* Back to Console (if Ward Officer or Tech) */}
            <button
              onClick={() => navigate('/gis-map')}
              className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 px-2 py-1 rounded hover:bg-slate-100"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Ward Console</span>
            </button>

            {/* Log Out */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 rounded hover:bg-slate-100"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">LOG OUT</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Citizen Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Municipal Corporation of Greater Mumbai • Citizen Civic Infrastructure Helpdesk (Ward 12)</span>
          <span className="flex items-center gap-1 text-slate-600 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            AES-256 Encrypted Telemetry
          </span>
        </div>
      </footer>
    </div>
  );
};
