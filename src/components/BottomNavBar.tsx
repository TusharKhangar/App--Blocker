import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { TabType } from '../types.ts';

export const BottomNavBar: React.FC = () => {
  const { state, setActiveTab } = useApp();

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'focus', label: 'Focus', icon: 'self_improvement' },
    { id: 'decide', label: 'Decide', icon: 'hourglass_empty' },
    { id: 'insights', label: 'Insights', icon: 'insights' },
    { id: 'buddy', label: 'Buddy & Stakes', icon: 'group' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-space-sm py-space-xs max-w-md mx-auto bg-surface/90 dark:bg-inverse-surface/90 backdrop-blur-md shadow-md border-t border-on-surface/5">
      {tabs.map(tab => {
        const isActive = state.activeTab === tab.id;

        if (isActive) {
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              aria-current="page"
              aria-label={tab.label}
              className="flex flex-col items-center justify-center bg-primary-fixed dark:bg-primary-container text-on-primary-fixed dark:text-on-primary-container rounded-full px-space-md py-space-xs transition-all duration-300 active:scale-95 shadow-xs"
            >
              <span
                className="material-symbols-outlined text-[22px] leading-tight"
                data-icon={tab.icon}
                data-weight="fill"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {tab.icon}
              </span>
              <span className="text-label-sm font-semibold mt-0.5 tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            aria-label={tab.label}
            className="flex flex-col items-center justify-center text-on-surface-variant dark:text-outline px-space-xs py-space-xs transition-colors duration-200 hover:text-primary dark:hover:text-inverse-primary active:scale-95"
          >
            <span className="material-symbols-outlined text-[22px] leading-tight" data-icon={tab.icon}>
              {tab.icon}
            </span>
            <span className="text-label-sm mt-0.5 font-medium tracking-tight">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
