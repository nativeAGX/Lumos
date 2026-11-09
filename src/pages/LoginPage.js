import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lightbulb,
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Building,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { showInfoToast } from '../utils/helpers';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [activeTab, setActiveTab] = useState('operations'); // 'operations' or 'citizen'
  const [role, setRole] = useState('ward_officer');
  const [email, setEmail] = useState('officer.deshmukh@somaiya.gov.in');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSigned, setKeepSigned] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (activeTab === 'citizen') {
        await login('citizen', email, password, keepSigned);
        navigate('/citizen');
      } else {
        await login(role, email, password, keepSigned);
        if (role === 'field_tech') {
          navigate('/field-queue');
        } else {
          navigate('/gis-map');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setPassword('password123');
    if (tab === 'citizen') {
      setEmail('rahul.m@somaiya.edu');
      setRole('citizen');
    } else {
      setEmail('officer.deshmukh@somaiya.gov.in');
      setRole('ward_officer');
    }
  };

  const handleForgotPassword = () => {
    showInfoToast(
      'Password Reset Initiated',
      'A secure reset link has been dispatched to your municipal directory email.'
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-100 via-amber-50/20 to-slate-100 flex flex-col justify-between p-4 sm:p-6 text-slate-800">
      {/* Top Header Bar */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between text-xs text-slate-500 py-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-slate-700">CIVIC GRID • REGION 04 EAST</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Gateway 99.98%</span>
          <span>•</span>
          <button
            onClick={() => showInfoToast('Municipal Helpdesk', 'Contact central line: 1800-425-001 or ops@lumos.gov.in')}
            className="hover:text-slate-800 flex items-center gap-1 font-medium"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Helpdesk</span>
          </button>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden my-auto">
        <div className="p-8 sm:p-10">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="inline-flex w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 items-center justify-center text-amber-600 mb-3 shadow-inner">
              <Lightbulb className="w-6 h-6 fill-amber-500 text-amber-600" />
            </div>
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">LUMOS</h1>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                PORTAL
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Smart streetlight monitoring & civic governance infrastructure
            </p>
          </div>

          {/* Role Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6 text-xs font-bold text-slate-600">
            <button
              type="button"
              onClick={() => handleTabSwitch('citizen')}
              className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'citizen'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Citizen Login</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSwitch('operations')}
              className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'operations'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Operations Staff</span>
            </button>
          </div>

          {/* Operational Clearance Banner */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 mb-6 flex items-start gap-2.5 text-xs text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {activeTab === 'operations'
                ? 'Municipal Operations clearance for telemetry controls, fault response, and field work orders.'
                : 'Direct civic reporting access with instantaneous SMS & WhatsApp status telemetry updates.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'operations' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Operational Role
                </label>
                <select
                  value={role}
                  onChange={(e) => {
                    const r = e.target.value;
                    setRole(r);
                    setPassword('password123');
                    if (r === 'field_tech') {
                      setEmail('rajesh.k@field.lumos.gov.in');
                    } else {
                      setEmail('officer.deshmukh@somaiya.gov.in');
                    }
                  }}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
                >
                  <option value="ward_officer">Ward Officer / Municipal In-Charge</option>
                  <option value="field_tech">Field Supervisor / Lineman Lead</option>
                  <option value="scada_inspector">SCADA Electrical Grid Inspector</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {activeTab === 'operations' ? 'Official Email / Municipal ID' : 'Mobile Number / Resident Email'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-amber-700 hover:text-amber-800 font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-slate-600 absolute right-3 top-2.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 font-medium">
                <input
                  type="checkbox"
                  checked={keepSigned}
                  onChange={(e) => setKeepSigned(e.target.checked)}
                  className="rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                />
                <span>Keep me signed in</span>
              </label>
              <span className="text-[11px] text-slate-400">12h session</span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2 group"
            >
              <span>{activeTab === 'operations' ? 'Sign In to Console' : 'Open Citizen Portal'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Switch tab link */}
          <div className="mt-5 text-center">
            <button
              onClick={() => handleTabSwitch(activeTab === 'operations' ? 'citizen' : 'operations')}
              className="text-xs text-slate-600 hover:text-amber-800 font-semibold"
            >
              ⇄ Switch to {activeTab === 'operations' ? 'Citizen Login' : 'Operations Console'}
            </button>
          </div>

          {/* Demo 1-Click Persona Access */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center mb-2">
              Quick Demo 1-Click Access
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  login('ward_officer', 'officer.deshmukh@somaiya.gov.in');
                  navigate('/gis-map');
                }}
                className="p-2 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-lg text-left transition-colors"
              >
                <div className="text-[11px] font-bold text-slate-800 leading-tight">Ward Officer</div>
                <div className="text-[9px] text-slate-500 truncate">Dr. Deshmukh</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  login('field_tech', 'rajesh.k@field.lumos.gov.in');
                  navigate('/field-queue');
                }}
                className="p-2 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-lg text-left transition-colors"
              >
                <div className="text-[11px] font-bold text-slate-800 leading-tight">Field Tech</div>
                <div className="text-[9px] text-slate-500 truncate">Rajesh Kumar</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  login('citizen', 'rahul.m@somaiya.edu');
                  navigate('/citizen');
                }}
                className="p-2 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-lg text-left transition-colors"
              >
                <div className="text-[11px] font-bold text-slate-800 leading-tight">Resident</div>
                <div className="text-[9px] text-slate-500 truncate">Rahul M.</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Compliance Ticker */}
      <div className="max-w-4xl w-full mx-auto flex flex-wrap items-center justify-center gap-3 text-slate-500 text-xs py-2 text-center">
        <span>ISO 37122 Smart City Standard</span>
        <span>•</span>
        <span>AES-256 Civic Encryption</span>
        <span>•</span>
        <span className="font-mono">Server Cluster: MH-MUM-01</span>
      </div>
    </div>
  );
};
