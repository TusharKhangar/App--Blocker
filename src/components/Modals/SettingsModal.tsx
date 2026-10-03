import React from 'react';
import { useApp } from '../../context/AppContext.tsx';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { state, toggleZenMode, toggleHaptics, resetMonthForfeit, showToast } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-md">
      <div className="w-full max-w-sm bg-surface rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-outline-variant/20 sticky top-0 bg-surface z-10">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-primary text-xl">settings</span>
            <h2 className="text-headline-sm font-semibold text-on-surface">Preferences</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Zen Mode */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-outline-variant/30">
            <div>
              <p className="text-body-md font-medium text-on-surface">Zen Presence Mode</p>
              <p className="text-body-sm text-on-surface-variant">
                Subdues device notifications during active focus
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={state.zenMode}
                onChange={toggleZenMode}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:border-outline-variant after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {/* Haptics */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-outline-variant/30">
            <div>
              <p className="text-body-md font-medium text-on-surface">Haptic Friction Stepping</p>
              <p className="text-body-sm text-on-surface-variant">
                Tactile pulse during Hold-to-Unlock countdown
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={state.hapticFeedback}
                onChange={toggleHaptics}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:border-outline-variant after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {/* Friction timer length */}
          <div>
            <label className="block text-body-sm font-medium text-on-surface mb-1">
              Minimum Hold-to-Unlock Friction Delay
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['3.5s', '5.0s', '7.0s'].map((time, idx) => (
                <button
                  key={time}
                  onClick={() => showToast(`Friction delay set to ${time}`)}
                  className={`py-2 rounded-lg text-body-sm font-semibold border ${
                    idx === 0
                      ? 'border-primary bg-primary-fixed/20 text-primary'
                      : 'border-outline-variant/40 hover:bg-surface-container text-on-surface'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Demo Data */}
          <div className="pt-2 border-t border-outline-variant/20">
            <button
              onClick={() => {
                resetMonthForfeit();
                onClose();
              }}
              className="w-full py-2.5 rounded-lg border border-outline-variant/60 hover:border-primary text-body-sm font-semibold text-primary transition-colors"
            >
              Reset Streak &amp; Forfeit Counter
            </button>
            <p className="text-center text-label-sm text-outline mt-1.5">
              Restores 14-day calm streak and $0 forfeited
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
