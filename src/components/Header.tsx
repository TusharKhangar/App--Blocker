import React from 'react';
import { useApp } from '../context/AppContext.tsx';

interface HeaderProps {
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  const { state, toggleZenMode, showToast } = useApp();

  const getTitle = () => {
    switch (state.activeTab) {
      case 'focus':
        return 'Mindful Focus';
      case 'decide':
        return 'Decide & Pause';
      case 'insights':
        return 'Insights & Escrow';
      case 'buddy':
      default:
        return 'Accountability & Stakes';
    }
  };

  const handleZenClick = () => {
    toggleZenMode();
    showToast(state.zenMode ? 'Zen Mode deactivated' : 'Zen Mode active: notifications subdued');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-space-md py-space-sm h-14 max-w-md mx-auto bg-surface/80 dark:bg-inverse-surface/80 backdrop-blur-md shadow-sm transition-colors duration-200">
      <div className="flex items-center space-x-2">
        <button
          onClick={handleZenClick}
          aria-label="Zen mode toggle"
          title={state.zenMode ? 'Zen Mode On (Subdued)' : 'Toggle Zen Mode'}
          className={`flex items-center justify-center p-1.5 rounded-full transition-all duration-200 active:scale-95 ${
            state.zenMode
              ? 'bg-primary-fixed text-primary ring-2 ring-primary/40'
              : 'hover:bg-surface-container-low text-primary dark:text-inverse-primary'
          }`}
        >
          <span className="material-symbols-outlined text-xl" data-icon="spa">
            spa
          </span>
        </button>
        <span className="text-headline-sm font-semibold tracking-tight text-primary dark:text-inverse-primary">
          {getTitle()}
        </span>
      </div>

      <div className="flex items-center space-x-1">
        <button
          onClick={onOpenSettings}
          aria-label="Settings"
          className="flex items-center justify-center p-1.5 rounded-full text-on-surface-variant hover:text-primary dark:hover:text-inverse-primary hover:bg-surface-container-low transition-colors duration-200 active:scale-95"
        >
          <span className="material-symbols-outlined text-xl" data-icon="settings">
            settings
          </span>
        </button>
      </div>
    </header>
  );
};
