import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({ isOpen, onClose }) => {
  const { state, toggleProStatus, showToast } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  if (!isOpen) return null;

  const handleActivatePro = () => {
    toggleProStatus();
    showToast(
      state.isPro
        ? 'Subscription reverted to Free tier'
        : 'Pro tier successfully activated! Unlimited apps unlocked.'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-md">
      <div className="w-full max-w-sm bg-surface rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-br from-secondary to-secondary-container text-on-secondary p-5 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full text-on-secondary/80 hover:text-on-secondary hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
          <div className="w-12 h-12 rounded-full bg-white/20 mx-auto flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-2xl text-on-secondary">
              workspace_premium
            </span>
          </div>
          <h2 className="text-headline-md font-bold">
            {state.isPro ? 'Mindful Friction Pro' : 'Upgrade to Pro'}
          </h2>
          <p className="text-body-sm text-on-secondary/90 mt-1">
            Reclaim your attention with uninterrupted intentional presence.
          </p>
        </div>

        {/* Pricing selector */}
        <div className="p-5 space-y-4">
          <div className="flex bg-surface-container-low p-1 rounded-xl">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`flex-1 py-1.5 rounded-lg text-body-sm font-semibold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                  : 'text-outline hover:text-on-surface'
              }`}
            >
              Monthly ($4.99)
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`flex-1 py-1.5 rounded-lg text-body-sm font-semibold transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                  : 'text-outline hover:text-on-surface'
              }`}
            >
              Yearly ($3.67/mo)
            </button>
          </div>

          {/* Benefits list */}
          <div className="space-y-2.5 text-body-sm">
            {[
              'Unlimited blocked applications and web domains',
              'Multiple accountability buddies & group pacts',
              'Automated scheduled focus sessions & night locks',
              'Zero-delay Stripe escrow payouts or custom charities',
              'Detailed attention analytics & exportable journals',
            ].map((benefit, i) => (
              <div key={i} className="flex items-start space-x-2 text-on-surface">
                <span
                  className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5"
                  data-icon="check_circle"
                  data-weight="fill"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
                <span className="leading-snug">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Action button */}
          <div className="pt-2">
            <button
              onClick={handleActivatePro}
              className="w-full py-3 bg-secondary hover:bg-secondary-container text-on-secondary rounded-xl font-semibold shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span>
                {state.isPro
                  ? 'Cancel Pro Subscription'
                  : billingCycle === 'yearly'
                  ? 'Start 7-Day Free Trial ($44/yr)'
                  : 'Start 7-Day Free Trial ($4.99/mo)'}
              </span>
            </button>
            <p className="text-center text-label-sm text-outline mt-2">
              Cancel anytime in one click. No hidden lock-in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
