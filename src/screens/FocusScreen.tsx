import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';

interface FocusScreenProps {
  onOpenProModal: () => void;
}

export const FocusScreen: React.FC<FocusScreenProps> = ({ onOpenProModal }) => {
  const { state, toggleAppActive, setActiveTab, showToast } = useApp();

  const [sessionSeconds, setSessionSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(true);
  const [activePreset, setActivePreset] = useState<'Deep Work' | 'Mindful Reset' | 'Digital Sunset'>('Deep Work');

  useEffect(() => {
    let interval: number | null = null;
    if (isRunning && sessionSeconds > 0) {
      interval = window.setInterval(() => {
        setSessionSeconds(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, sessionSeconds]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const handlePresetSelect = (preset: 'Deep Work' | 'Mindful Reset' | 'Digital Sunset', durationMins: number) => {
    setActivePreset(preset);
    setSessionSeconds(durationMins * 60);
    setIsRunning(true);
    showToast(`Started ${durationMins}-min ${preset}`);
  };

  return (
    <div className="space-y-space-md">
      {/* Active Focus Session Canvas */}
      <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs border border-on-surface/5 text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed text-label-sm font-semibold mb-3">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          Active Shielding
        </div>

        <h1 className="text-display-lg text-primary font-bold tracking-tight">
          {formatTime(sessionSeconds)}
        </h1>

        <p className="text-body-md text-on-surface-variant font-medium mt-1">
          {activePreset} in progress
        </p>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-semibold text-body-md flex items-center gap-2 active:scale-95 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-lg">
              {isRunning ? 'pause' : 'play_arrow'}
            </span>
            <span>{isRunning ? 'Pause' : 'Resume'}</span>
          </button>

          <button
            onClick={() => setSessionSeconds(25 * 60)}
            className="p-2.5 rounded-lg border border-outline-variant/60 hover:bg-surface-container text-on-surface-variant active:scale-95 transition-all"
            title="Reset timer"
          >
            <span className="material-symbols-outlined text-lg">restart_alt</span>
          </button>
        </div>
      </section>

      {/* Preset Modes */}
      <section className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-on-surface/5 space-y-2.5">
        <h2 className="text-body-sm font-semibold text-on-surface">Focus Protocols</h2>
        <div className="grid grid-cols-3 gap-2">
          {[
            { name: 'Deep Work' as const, time: 25, icon: 'psychology' },
            { name: 'Mindful Reset' as const, time: 10, icon: 'self_improvement' },
            { name: 'Digital Sunset' as const, time: 60, icon: 'bedtime' },
          ].map(p => (
            <button
              key={p.name}
              onClick={() => handlePresetSelect(p.name, p.time)}
              className={`p-2.5 rounded-lg border text-left transition-all active:scale-95 ${
                activePreset === p.name
                  ? 'border-primary bg-primary-fixed/20 text-on-surface font-semibold'
                  : 'border-outline-variant/40 hover:bg-surface-container-low text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-primary text-xl mb-1">{p.icon}</span>
              <p className="text-label-md font-semibold text-on-surface leading-tight">{p.name}</p>
              <p className="text-label-sm text-outline">{p.time} mins</p>
            </button>
          ))}
        </div>
      </section>

      {/* Shielded Apps */}
      <section className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-on-surface/5 space-y-space-md">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-headline-sm font-semibold text-on-surface">Protected Applications</h2>
            <p className="text-body-sm text-on-surface-variant">
              Apps triggering mindful friction &amp; stakes on launch
            </p>
          </div>
          <span className="text-label-sm font-semibold text-primary">
            {state.apps.filter(a => a.isActive).length} Active
          </span>
        </div>

        <div className="space-y-2">
          {state.apps.map(app => (
            <div
              key={app.id}
              className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low border border-outline-variant/30"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-lg">{app.icon}</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-body-md font-semibold text-on-surface">{app.name}</span>
                    {app.isProOnly && !state.isPro && (
                      <span className="bg-secondary-fixed text-on-secondary-fixed-variant px-1.5 py-0.2 rounded text-[10px] font-bold">
                        PRO
                      </span>
                    )}
                  </div>
                  <span className="text-label-sm text-outline">{app.category}</span>
                </div>
              </div>

              {app.isProOnly && !state.isPro ? (
                <button
                  onClick={onOpenProModal}
                  className="px-2.5 py-1 rounded bg-secondary-fixed/50 hover:bg-secondary-fixed text-on-secondary-fixed text-label-sm font-semibold flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-xs">lock</span>
                  <span>Unlock</span>
                </button>
              ) : (
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={app.isActive}
                    onChange={() => toggleAppActive(app.id)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:border-outline-variant after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Impulse Simulator Trigger */}
      <section className="bg-surface-container-low rounded-xl p-space-md border border-outline-variant/30 flex items-center justify-between">
        <div>
          <h3 className="text-body-md font-semibold text-on-surface">Urge Trigger Simulation</h3>
          <p className="text-body-sm text-on-surface-variant">
            Simulate opening Instagram right now.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('decide')}
          className="px-3.5 py-2 bg-primary text-on-primary rounded-lg text-label-md font-semibold flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-base">warning</span>
          <span>Open App</span>
        </button>
      </section>
    </div>
  );
};
