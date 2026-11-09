import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Lightbulb,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLumos } from '../../contexts/LumosContext';

export const Header = () => {
  const { currentUser, logout, switchUser, role } = useAuth();
  const { poles, isBackendConnected } = useLumos();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const criticalPolesCount = poles.filter(p => p.status === 'CRITICAL').length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/gis-map', label: 'GIS Map', roles: ['ward_officer', 'field_tech'] },
    { to: '/fault-intakes', label: 'Fault Intakes', roles: ['ward_officer', 'field_tech'] },
    { to: '/work-orders', label: 'Work Orders', roles: ['ward_officer', 'field_tech'] },
    { to: '/field-queue', label: 'Field Queue', roles: ['ward_officer', 'field_tech'] },
    { to: '/sla-analytics', label: 'SLA Analytics', roles: ['ward_officer'] },
  ].filter(link => !link.roles || link.roles.includes(role || 'ward_officer'));

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
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

            {/* Live Gateway / MongoDB Pill */}
            <div
              className="hidden xl:flex items-center gap-1.5 ml-4 px-2.5 py-1 rounded-full bg-slate-100 text-[11px] font-medium text-slate-600 border border-slate-200"
              title={isBackendConnected ? "Connected to Express & MongoDB backend (Port 5001)" : "Operating with SCADA Local Cache"}
            >
              <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-500' : 'bg-emerald-400'} animate-pulse`}></span>
              <span>{isBackendConnected ? 'MongoDB Live' : 'Gateway 99.98%'}</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-xs lg:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-100 text-amber-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            {/* Citizen Link */}
            <NavLink
              to="/citizen"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md text-xs lg:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-amber-100 text-amber-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <span>Citizen Portal</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </NavLink>
          </nav>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Critical Alert Badge */}
            <button
              onClick={() => navigate('/gis-map')}
              title="View Critical Faults on Map"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span>{criticalPolesCount || 2} CRITICAL</span>
            </button>

            {/* Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
                title="Switch active municipal persona"
              >
                <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold">
                  {currentUser?.avatar || 'SD'}
                </div>
                <span className="hidden sm:inline max-w-[100px] truncate">{currentUser?.name?.split(' ')[0]}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setRoleDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Current Role</p>
                    <p className="text-xs font-bold text-slate-800">{currentUser?.title}</p>
                    <p className="text-[11px] text-slate-500">{currentUser?.ward}</p>
                  </div>

                  <p className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400">Switch Persona (Demo)</p>
                  <button
                    onClick={() => {
                      switchUser('ward_officer');
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-900 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold">Dr. S. Deshmukh</div>
                      <div className="text-[10px] text-slate-500">Ward Officer (Tier-3 Auth)</div>
                    </div>
                    {currentUser?.id === 'ward_officer' && <span className="text-amber-600 text-xs font-bold">✓</span>}
                  </button>

                  <button
                    onClick={() => {
                      switchUser('field_tech');
                      setRoleDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-900 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold">Rajesh Kumar</div>
                      <div className="text-[10px] text-slate-500">Field Lead Tech (Unit #07)</div>
                    </div>
                    {currentUser?.id === 'field_tech' && <span className="text-amber-600 text-xs font-bold">✓</span>}
                  </button>

                  <button
                    onClick={() => {
                      switchUser('citizen');
                      setRoleDropdownOpen(false);
                      navigate('/citizen');
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-900 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold">Rahul M.</div>
                      <div className="text-[10px] text-slate-500">Campus Resident (+91 98201)</div>
                    </div>
                    {currentUser?.id === 'citizen' && <span className="text-amber-600 text-xs font-bold">✓</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Log Out */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
              title="Disconnect from Console"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log Out</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm font-semibold ${
                  isActive ? 'bg-amber-100 text-amber-900' : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to="/citizen"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-semibold text-amber-700 bg-amber-50"
          >
            Citizen Grievance Portal →
          </NavLink>
        </div>
      )}
    </header>
  );
};
