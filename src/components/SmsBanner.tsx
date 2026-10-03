import React from 'react';
import { useApp } from '../context/AppContext.tsx';

export const SmsBanner: React.FC = () => {
  const { lastSimulatedSms, clearSimulatedSms } = useApp();

  if (!lastSimulatedSms) return null;

  return (
    <div className="fixed top-16 left-4 right-4 z-50 max-w-sm mx-auto animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="bg-inverse-surface text-inverse-on-surface p-3.5 rounded-2xl shadow-xl border border-outline/30 flex items-start space-x-3">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shrink-0 mt-0.5">
          <span className="material-symbols-outlined text-sm">sms</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-label-sm font-semibold tracking-wider uppercase text-inverse-primary">
              Live SMS Alert Dispatched
            </span>
            <button
              onClick={clearSimulatedSms}
              className="text-outline hover:text-inverse-on-surface"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
          <p className="text-body-sm mt-1 leading-snug font-medium italic">
            "{lastSimulatedSms}"
          </p>
        </div>
      </div>
    </div>
  );
};
