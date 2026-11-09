import React from 'react';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { RegisterPoleModal } from '../components/modals/RegisterPoleModal';
import { CreateWorkOrderModal } from '../components/modals/CreateWorkOrderModal';
import { CadOverlayModal } from '../components/modals/CadOverlayModal';
import { QuickPoleInspectorModal } from '../components/modals/QuickPoleInspectorModal';
import { useLumos } from '../contexts/LumosContext';

export const ConsoleLayout = ({ children }) => {
  const {
    isRegisterPoleOpen,
    setIsRegisterPoleOpen,
    isCreateWorkOrderOpen,
    setIsCreateWorkOrderOpen,
    cadOverlayPole,
    setCadOverlayPole,
    inspectModalPole,
    setInspectModalPole
  } = useLumos();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      <Footer />

      {/* Global Modals */}
      <RegisterPoleModal
        isOpen={isRegisterPoleOpen}
        onClose={() => setIsRegisterPoleOpen(false)}
      />

      <CreateWorkOrderModal
        isOpen={isCreateWorkOrderOpen}
        onClose={() => setIsCreateWorkOrderOpen(false)}
      />

      <CadOverlayModal
        pole={cadOverlayPole}
        isOpen={!!cadOverlayPole}
        onClose={() => setCadOverlayPole(null)}
      />

      <QuickPoleInspectorModal
        pole={inspectModalPole}
        isOpen={!!inspectModalPole}
        onClose={() => setInspectModalPole(null)}
      />
    </div>
  );
};
