import React from 'react';

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-3 px-4 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-slate-700">MUNICIPAL CORPORATION OF GREATER MUMBAI</span>
          <span className="text-slate-300">|</span>
          <span>Grid Ops Core v3.8.4</span>
          <span className="hidden md:inline text-slate-300">|</span>
          <span className="hidden md:inline">ISO 37120 / C136.41 Compliant</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Gateway Online
          </span>
          <span>© 2025 LUMOS INFRASTRUCTURE</span>
        </div>
      </div>
    </footer>
  );
};
