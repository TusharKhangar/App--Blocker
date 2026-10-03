/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Header } from './components/Header.tsx';
import { BottomNavBar } from './components/BottomNavBar.tsx';
import { BuddyStakesScreen } from './screens/BuddyStakesScreen.tsx';
import { FocusScreen } from './screens/FocusScreen.tsx';
import { DecideScreen } from './screens/DecideScreen.tsx';
import { InsightsScreen } from './screens/InsightsScreen.tsx';
import { ProUpgradeModal } from './components/Modals/ProUpgradeModal.tsx';
import { PaymentMethodModal } from './components/Modals/PaymentMethodModal.tsx';
import { EditBuddyModal } from './components/Modals/EditBuddyModal.tsx';
import { SettingsModal } from './components/Modals/SettingsModal.tsx';
import { SmsBanner } from './components/SmsBanner.tsx';

const AppContent: React.FC = () => {
  const { state, toastMessage } = useApp();

  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isBuddyModalOpen, setIsBuddyModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  return (
    <div
      className={`min-h-screen flex justify-center selection:bg-primary-fixed selection:text-on-primary-fixed transition-colors duration-300 ${
        state.zenMode ? 'bg-[#eaf0ed] dark:bg-[#18212e]' : 'bg-background'
      }`}
    >
      {/* Mobile Container Mockup */}
      <div className="w-full max-w-md bg-background min-h-screen relative flex flex-col pb-24 shadow-2xl">
        {/* TopAppBar Component with Contextual Header */}
        <Header onOpenSettings={() => setIsSettingsModalOpen(true)} />

        {/* Live Dispatched SMS Notification Banner */}
        <SmsBanner />

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed top-16 left-6 right-6 z-50 max-w-xs mx-auto animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="bg-inverse-surface/95 text-inverse-on-surface text-label-sm font-semibold py-2 px-3.5 rounded-full shadow-lg text-center backdrop-blur-sm border border-outline/20">
              {toastMessage}
            </div>
          </div>
        )}

        {/* Main Content Canvas */}
        <main className="flex-1 px-space-md pt-20 pb-space-lg">
          {state.activeTab === 'buddy' && (
            <BuddyStakesScreen
              onOpenProModal={() => setIsProModalOpen(true)}
              onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
              onOpenBuddyModal={() => setIsBuddyModalOpen(true)}
            />
          )}

          {state.activeTab === 'focus' && (
            <FocusScreen onOpenProModal={() => setIsProModalOpen(true)} />
          )}

          {state.activeTab === 'decide' && <DecideScreen />}

          {state.activeTab === 'insights' && <InsightsScreen />}
        </main>

        {/* BottomNavBar Component */}
        <BottomNavBar />

        {/* Interactive Modals */}
        <ProUpgradeModal
          isOpen={isProModalOpen}
          onClose={() => setIsProModalOpen(false)}
        />

        <PaymentMethodModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
        />

        <EditBuddyModal
          isOpen={isBuddyModalOpen}
          onClose={() => setIsBuddyModalOpen(false)}
        />

        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
