import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, TabType, StakeDestination, BuddyInfo } from '../types.ts';

interface AppContextType {
  state: AppState;
  setActiveTab: (tab: TabType) => void;
  setDefaultStake: (amount: number) => void;
  setStakeDestination: (dest: StakeDestination) => void;
  toggleBuddyAlert: () => void;
  updateBuddy: (buddy: Partial<BuddyInfo>) => void;
  updatePaymentMethod: (card: { brand: string; last4: string; expiry: string }) => void;
  toggleProStatus: () => void;
  toggleZenMode: () => void;
  toggleHaptics: () => void;
  toggleAppActive: (appId: string) => void;
  triggerAppOverride: (appId: string) => void;
  resetMonthForfeit: () => void;
  lastSimulatedSms: string | null;
  clearSimulatedSms: () => void;
  showToast: (msg: string) => void;
  toastMessage: string | null;
}

const initialBuddy: BuddyInfo = {
  name: 'Alex Morgan',
  phone: '+1 (555) 382-9011',
  avatarUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCiDaAwsl8ow9R_hw5iUUYdQH6cIq2EykyxTVU3ltmdRaI1kwR1U8zn_xJOQ8Cyt-PKdG8E1VqFaGIPa2n-EXPVSda4mtCNJ4pzvnRYhf6gy_NNh-6av_b7nwYsiRnLXpc3f9OjxMZVZXBRyRM8X7fUWCH_tmqKuFZMgiPzVfXI0Iq3-X9lQsWGuAup9FcPBKYlMqlTL0JSFpaOAjd9yCSEktFH-NmmHmqADB5e9_iBIfL3VlHATLwc',
  smsAlertsEnabled: true,
  alertOnOverride: true,
  relationship: 'Focus Partner',
};

const initialApps = [
  { id: 'instagram', name: 'Instagram', icon: 'camera_alt', category: 'Social Media', isActive: true, isProOnly: false, dailyAttempts: 6 },
  { id: 'tiktok', name: 'TikTok', icon: 'videocam', category: 'Short Video', isActive: false, isProOnly: true, dailyAttempts: 12 },
  { id: 'x', name: 'X / Twitter', icon: 'flutter', category: 'News & Social', isActive: false, isProOnly: true, dailyAttempts: 4 },
  { id: 'youtube', name: 'YouTube', icon: 'smart_display', category: 'Entertainment', isActive: false, isProOnly: true, dailyAttempts: 2 },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    activeTab: 'buddy', // Screen 4 Buddy & Stakes is the default view
    streakDays: 14,
    forfeitedMonth: 0,
    totalEscrowSaved: 185,
    defaultStake: 5,
    stakeDestination: 'charity',
    buddy: initialBuddy,
    paymentMethod: {
      brand: 'VISA',
      last4: '4242',
      expiry: '12/28',
    },
    isPro: false,
    zenMode: false,
    hapticFeedback: true,
    apps: initialApps,
  });

  const [lastSimulatedSms, setLastSimulatedSms] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 4000);
  };

  const clearSimulatedSms = () => setLastSimulatedSms(null);

  const setActiveTab = (tab: TabType) => {
    setState(prev => ({ ...prev, activeTab: tab }));
  };

  const setDefaultStake = (amount: number) => {
    setState(prev => ({ ...prev, defaultStake: amount }));
    showToast(`Default impulse stake set to $${amount}`);
  };

  const setStakeDestination = (dest: StakeDestination) => {
    setState(prev => ({ ...prev, stakeDestination: dest }));
    showToast(
      dest === 'charity'
        ? 'Forfeited funds now route to Habit Charity Fund'
        : `Forfeited funds now route directly to ${state.buddy.name}`
    );
  };

  const toggleBuddyAlert = () => {
    setState(prev => {
      const nextVal = !prev.buddy.alertOnOverride;
      showToast(nextVal ? 'Buddy SMS alerts enabled on unlock override' : 'Buddy alerts paused');
      return {
        ...prev,
        buddy: {
          ...prev.buddy,
          alertOnOverride: nextVal,
        },
      };
    });
  };

  const updateBuddy = (updated: Partial<BuddyInfo>) => {
    setState(prev => ({
      ...prev,
      buddy: { ...prev.buddy, ...updated },
    }));
    showToast('Buddy settings updated');
  };

  const updatePaymentMethod = (card: { brand: string; last4: string; expiry: string }) => {
    setState(prev => ({ ...prev, paymentMethod: card }));
    showToast(`Escrow payment method changed to ${card.brand} •••• ${card.last4}`);
  };

  const toggleProStatus = () => {
    setState(prev => {
      const nextPro = !prev.isPro;
      return {
        ...prev,
        isPro: nextPro,
        apps: prev.apps.map(app => (app.isProOnly && nextPro ? { ...app, isActive: true } : app)),
      };
    });
  };

  const toggleZenMode = () => {
    setState(prev => ({ ...prev, zenMode: !prev.zenMode }));
  };

  const toggleHaptics = () => {
    setState(prev => ({ ...prev, hapticFeedback: !prev.hapticFeedback }));
  };

  const toggleAppActive = (appId: string) => {
    setState(prev => {
      const targetApp = prev.apps.find(a => a.id === appId);
      if (targetApp?.isProOnly && !prev.isPro) {
        showToast('Pro tier required to shield multiple apps.');
        return prev;
      }
      return {
        ...prev,
        apps: prev.apps.map(app => (app.id === appId ? { ...app, isActive: !app.isActive } : app)),
      };
    });
  };

  const triggerAppOverride = (appId: string) => {
    const app = state.apps.find(a => a.id === appId) || state.apps[0];
    const amount = state.defaultStake;

    setState(prev => ({
      ...prev,
      forfeitedMonth: prev.forfeitedMonth + amount,
      streakDays: 0, // Reset streak on forfeit
    }));

    if (state.buddy.alertOnOverride) {
      const destText =
        state.stakeDestination === 'charity'
          ? 'forfeited to Habit Charity Fund'
          : `routed directly to you (${state.buddy.name})`;
      const sms = `Hey ${state.buddy.name}, Jordan just spent $${amount} to override ${app.name} during focus mode (${destText}).`;
      setLastSimulatedSms(sms);
    }

    showToast(`Overrode lock: $${amount} forfeited!`);
  };

  const resetMonthForfeit = () => {
    setState(prev => ({ ...prev, forfeitedMonth: 0, streakDays: 14 }));
    showToast('Focus streak restored to 14 days ($0 forfeited)');
  };

  return (
    <AppContext.Provider
      value={{
        state,
        setActiveTab,
        setDefaultStake,
        setStakeDestination,
        toggleBuddyAlert,
        updateBuddy,
        updatePaymentMethod,
        toggleProStatus,
        toggleZenMode,
        toggleHaptics,
        toggleAppActive,
        triggerAppOverride,
        resetMonthForfeit,
        lastSimulatedSms,
        clearSimulatedSms,
        showToast,
        toastMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
