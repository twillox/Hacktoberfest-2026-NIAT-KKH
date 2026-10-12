import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { WhatsAppSimulatorModal } from '../components/feedback/WhatsAppSimulatorModal';
import { TopBar } from '../components/navigation/TopBar';
import { BottomNav } from '../components/navigation/BottomNav';
import { FloatingDemoTools } from '../components/ui/FloatingDemoTools';

export const Layout: React.FC = () => {
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-[#FAF7F5] flex flex-col font-sans antialiased text-stone-900 select-none">
      {/* Mobile-First Web Application Container */}
      <div className="w-full max-w-[430px] mx-auto min-h-screen flex flex-col bg-[#FAF7F5] relative">
        {/* Top Header shown on Home */}
        {isHome && <TopBar onOpenNotifications={() => setIsSimulatorOpen(true)} />}

        {/* Main Application Page Content */}
        <main className="flex-1 flex flex-col">
          <Outlet />
        </main>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>

      {/* Discreet floating demo hub (role switcher & WhatsApp simulator) */}
      <FloatingDemoTools onOpenWhatsAppSimulator={() => setIsSimulatorOpen(true)} />

      {/* WhatsApp Interactive Simulator Modal */}
      <WhatsAppSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
      />
    </div>
  );
};
