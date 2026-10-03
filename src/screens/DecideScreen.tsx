import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext.tsx';

export const DecideScreen: React.FC = () => {
  const { state, triggerAppOverride, setActiveTab, showToast } = useApp();

  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [selectedUrgeReason, setSelectedUrgeReason] = useState<string>('Boredom');
  const [overrideComplete, setOverrideComplete] = useState(false);

  const holdIntervalRef = useRef<number | null>(null);

  // 4-7-8 Breathing Cadence visualizer
  useEffect(() => {
    const cycle = () => {
      setBreathPhase('Inhale');
      const t1 = setTimeout(() => {
        setBreathPhase('Hold');
        const t2 = setTimeout(() => {
          setBreathPhase('Exhale');
        }, 4000);
        return () => clearTimeout(t2);
      }, 3000);
      return () => clearTimeout(t1);
    };

    cycle();
    const interval = setInterval(cycle, 11000);
    return () => clearInterval(interval);
  }, []);

  // Handle Hold-to-Unlock friction mechanic (minimum 3.5 seconds)
  const startHold = () => {
    setIsHolding(true);
    const stepTime = 40;
    const totalDuration = 3500; // 3.5 seconds intentional friction
    const stepIncrement = (stepTime / totalDuration) * 100;

    holdIntervalRef.current = window.setInterval(() => {
      setHoldProgress(prev => {
        if (prev >= 100) {
          if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
          handleOverrideSuccess();
          return 100;
        }
        return prev + stepIncrement;
      });
    }, stepTime);
  };

  const endHold = () => {
    setIsHolding(false);
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    if (holdProgress < 100) {
      setHoldProgress(0);
    }
  };

  const handleOverrideSuccess = () => {
    setOverrideComplete(true);
    triggerAppOverride('instagram');
  };

  const handleMindfulReturn = () => {
    showToast('Urge passed! +$5 saved to Escrow & streak preserved.');
    setActiveTab('buddy');
  };

  return (
    <div className="space-y-space-md">
      {/* Top Banner Notice */}
      <section className="bg-surface-container-low rounded-xl p-space-md border border-outline-variant/30 text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest text-outline text-label-sm font-semibold mb-2">
          <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
          Mindful Friction Intervention
        </div>
        <h1 className="text-headline-md font-bold text-on-surface">
          Instagram is paused
        </h1>
        <p className="text-body-sm text-on-surface-variant max-w-xs mx-auto mt-1">
          Take a slow breath before deciding whether to break your focus session.
        </p>
      </section>

      {/* Breathing Guide Ring */}
      <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs border border-on-surface/5 flex flex-col items-center justify-center text-center">
        <div className="relative w-36 h-36 flex items-center justify-center my-2">
          {/* Outer gentle ambient pulse */}
          <div
            className={`absolute inset-0 rounded-full transition-all duration-1000 ${
              breathPhase === 'Inhale'
                ? 'scale-110 bg-primary-fixed/40'
                : breathPhase === 'Hold'
                ? 'scale-105 bg-secondary-fixed/50'
                : 'scale-90 bg-surface-container'
            }`}
          />
          {/* Inner breathing circle */}
          <div
            className={`relative w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all duration-1000 shadow-md ${
              breathPhase === 'Inhale'
                ? 'bg-primary text-on-primary scale-105'
                : breathPhase === 'Hold'
                ? 'bg-secondary text-on-secondary scale-100'
                : 'bg-primary-container text-on-primary scale-95'
            }`}
          >
            <span className="text-label-sm uppercase tracking-wider font-semibold opacity-90">
              {breathPhase}
            </span>
            <span className="material-symbols-outlined text-2xl mt-0.5">
              {breathPhase === 'Inhale'
                ? 'air'
                : breathPhase === 'Hold'
                ? 'spa'
                : 'expand_circle_down'}
            </span>
          </div>
        </div>
        <p className="text-label-md text-outline mt-2 font-medium">
          4-7-8 grounding breathing cycle
        </p>
      </section>

      {/* Urge Reflection Selector */}
      <section className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-on-surface/5 space-y-2.5">
        <label className="block text-body-sm font-semibold text-on-surface">
          What is the sensation behind this urge?
        </label>
        <div className="grid grid-cols-2 gap-2">
          {['Boredom', 'Work Stress', 'Fear of Missing Out', 'Pure Habit'].map(reason => (
            <button
              key={reason}
              onClick={() => setSelectedUrgeReason(reason)}
              className={`py-2 px-3 text-left rounded-lg text-body-sm transition-all duration-150 flex items-center justify-between ${
                selectedUrgeReason === reason
                  ? 'bg-primary-fixed/30 border border-primary text-primary font-semibold'
                  : 'bg-surface-container-low border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              <span>{reason}</span>
              {selectedUrgeReason === reason && (
                <span className="material-symbols-outlined text-sm font-bold">check</span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Consequences & Stake Breakdown */}
      <section className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-on-surface/5 space-y-3">
        <div className="flex items-center justify-between text-body-sm">
          <span className="text-on-surface-variant">Stake at risk:</span>
          <span className="font-bold text-error">${state.defaultStake}.00 USD</span>
        </div>

        <div className="flex items-center justify-between text-body-sm">
          <span className="text-on-surface-variant">Recipient on override:</span>
          <span className="font-semibold text-on-surface">
            {state.stakeDestination === 'charity'
              ? 'Habit Charity Fund'
              : `Alex Morgan (${state.buddy.name})`}
          </span>
        </div>

        <div className="flex items-center justify-between text-body-sm">
          <span className="text-on-surface-variant">Social accountability:</span>
          <span className="text-primary font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">sms</span>
            SMS ping sent to Alex
          </span>
        </div>
      </section>

      {/* Action Zone: Walk Away (Recommended) vs Hold-to-Unlock */}
      <section className="space-y-3 pt-1">
        <button
          onClick={handleMindfulReturn}
          className="w-full py-3.5 bg-primary hover:bg-primary-container text-on-primary rounded-xl font-semibold shadow-sm active:scale-98 transition-all duration-150 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">spa</span>
          <span>Walk Away &amp; Protect Streak</span>
        </button>

        {overrideComplete ? (
          <div className="p-4 rounded-xl bg-error-container text-on-error-container text-center space-y-2">
            <p className="font-bold text-headline-sm">Override Approved</p>
            <p className="text-body-sm">
              ${state.defaultStake} forfeited and notification dispatched to Alex.
            </p>
            <button
              onClick={() => {
                setOverrideComplete(false);
                setHoldProgress(0);
                setActiveTab('buddy');
              }}
              className="mt-2 px-4 py-2 bg-error text-on-error rounded-lg text-body-sm font-semibold"
            >
              Return to Buddy &amp; Stakes
            </button>
          </div>
        ) : (
          <div className="relative">
            <button
              onMouseDown={startHold}
              onMouseUp={endHold}
              onTouchStart={startHold}
              onTouchEnd={endHold}
              className="w-full py-3.5 bg-surface-container-low border border-outline-variant/60 hover:border-error/50 text-on-surface rounded-xl font-medium text-body-md relative overflow-hidden select-none active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {/* Fill gauge */}
              <div
                className="absolute inset-y-0 left-0 bg-error/20 transition-all duration-75 pointer-events-none"
                style={{ width: `${holdProgress}%` }}
              />

              <span className="material-symbols-outlined text-error text-lg">
                {isHolding ? 'lock_open' : 'lock_clock'}
              </span>
              <span className="relative z-10 text-on-surface-variant font-semibold">
                {isHolding
                  ? `Hold to Override (${Math.round(holdProgress)}%)`
                  : `Hold 3.5s to Forfeit $${state.defaultStake}`}
              </span>
            </button>
            <p className="text-center text-label-sm text-outline mt-1.5">
              Intentional friction: Release at any moment to cancel.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
