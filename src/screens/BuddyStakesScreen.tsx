import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';

interface BuddyStakesScreenProps {
  onOpenProModal: () => void;
  onOpenPaymentModal: () => void;
  onOpenBuddyModal: () => void;
}

export const BuddyStakesScreen: React.FC<BuddyStakesScreenProps> = ({
  onOpenProModal,
  onOpenPaymentModal,
  onOpenBuddyModal,
}) => {
  const {
    state,
    setDefaultStake,
    setStakeDestination,
    toggleBuddyAlert,
    resetMonthForfeit,
    setActiveTab,
    showToast,
  } = useApp();

  const [avatarError, setAvatarError] = useState(false);

  const stakes = [2, 5, 10, 25];

  const handleSendTestSms = () => {
    const dest =
      state.stakeDestination === 'charity'
        ? 'to Habit Charity Fund'
        : `directly to ${state.buddy.name}`;
    showToast(
      `Simulated SMS delivered to ${state.buddy.phone}: "Hey, Jordan just spent $${state.defaultStake} to override Instagram during focus mode (${dest})."`
    );
  };

  return (
    <div className="space-y-space-md">
      {/* Active Streak & Escrow Card */}
      <section className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-on-surface/5 relative overflow-hidden transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed shrink-0">
              <span
                className="material-symbols-outlined text-2xl"
                data-icon="local_fire_department"
                data-weight="fill"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                local_fire_department
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="text-headline-sm font-semibold text-on-surface">
                  {state.streakDays}-Day Focus Streak
                </h1>
              </div>
              <p className="text-body-sm text-on-surface-variant">
                Unbroken calm presence
              </p>
            </div>
          </div>

          <div className="text-right">
            <span
              className={`text-headline-sm font-bold ${
                state.forfeitedMonth > 0 ? 'text-error' : 'text-primary'
              }`}
            >
              ${state.forfeitedMonth}
            </span>
            <p className="text-label-sm text-outline">forfeited this month</p>
          </div>
        </div>

        {state.forfeitedMonth > 0 && (
          <div className="mt-3 pt-2.5 border-t border-outline-variant/20 flex items-center justify-between text-label-sm">
            <span className="text-on-surface-variant">
              Penalty recorded from app override
            </span>
            <button
              onClick={resetMonthForfeit}
              className="text-primary font-semibold hover:underline"
            >
              Reset for demo
            </button>
          </div>
        )}
      </section>

      {/* Accountability Buddy Card (Node 5: BUDDY + STREAK) */}
      <section className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-on-surface/5 space-y-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-primary text-xl" data-icon="handshake">
              handshake
            </span>
            <h2 className="text-headline-sm font-semibold text-on-surface">
              Accountability Buddy
            </h2>
          </div>
          <span className="bg-primary-fixed text-on-primary-fixed px-space-sm py-0.5 rounded-full text-label-sm flex items-center gap-1 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> Active
          </span>
        </div>

        {/* Buddy Profile Info */}
        <div
          onClick={onOpenBuddyModal}
          role="button"
          tabIndex={0}
          title="Click to edit buddy details"
          className="flex items-center space-x-3.5 bg-surface-container-low p-space-sm rounded-lg cursor-pointer hover:bg-surface-container transition-colors duration-150 group"
        >
          {avatarError ? (
            <div className="w-11 h-11 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-sm shadow-xs border border-outline-variant/30">
              AM
            </div>
          ) : (
            <img
              onError={() => setAvatarError(true)}
              className="w-11 h-11 rounded-full object-cover shadow-xs border border-outline-variant/30"
              alt="Warm natural portrait photograph of Alex Morgan"
              src={state.buddy.avatarUrl}
            />
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-body-md font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
                {state.buddy.name}
              </h3>
              <span className="text-label-sm text-outline">{state.buddy.phone}</span>
            </div>
            <p className="text-body-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
              <span
                className="material-symbols-outlined text-primary text-sm shrink-0"
                data-icon="check_circle"
                data-weight="fill"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              <span>{state.buddy.smsAlertsEnabled ? 'SMS alerts enabled' : 'SMS alerts paused'}</span>
              <span className="text-[10px] text-outline ml-auto group-hover:text-primary">Edit ✎</span>
            </p>
          </div>
        </div>

        {/* SMS Override Toggle */}
        <div className="flex items-center justify-between pt-1">
          <div className="pr-2">
            <p className="text-body-md text-on-surface font-medium">Alert buddy on override</p>
            <p className="text-body-sm text-on-surface-variant">
              Sends instantaneous nudge when an app lock is broken.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              checked={state.buddy.alertOnOverride}
              onChange={toggleBuddyAlert}
              className="sr-only peer"
              type="checkbox"
            />
            <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface-container-lowest after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {/* SMS Preview Bubble */}
        <div className="rounded-lg bg-surface-container/60 border border-outline-variant/30 p-space-sm space-y-1.5">
          <div className="flex items-center justify-between text-on-surface-variant">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-xs" data-icon="chat_bubble">
                chat_bubble
              </span>
              <span className="text-label-sm uppercase tracking-wider font-semibold text-outline">
                SMS Preview
              </span>
            </div>
            <button
              onClick={handleSendTestSms}
              className="text-label-sm text-primary hover:underline font-semibold flex items-center gap-1"
            >
              <span>Test Ping</span>
              <span className="material-symbols-outlined text-xs">send</span>
            </button>
          </div>
          <p className="text-body-sm text-on-surface italic bg-surface-container-lowest/80 p-space-sm rounded border border-outline-variant/20 leading-relaxed">
            "Hey, Jordan just spent{' '}
            <strong className="text-on-surface font-semibold">${state.defaultStake}</strong> to
            override Instagram during focus mode.{' '}
            {state.stakeDestination === 'charity'
              ? 'Proceeds sent to Habit Charity Fund.'
              : `Proceeds routed directly to ${state.buddy.name}.`}
            "
          </p>
        </div>
      </section>

      {/* Stripe Stakes & Escrow Settings */}
      <section className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-on-surface/5 space-y-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span
              className="material-symbols-outlined text-primary text-xl"
              data-icon="account_balance_wallet"
            >
              account_balance_wallet
            </span>
            <h2 className="text-headline-sm font-semibold text-on-surface">
              Stripe Stake &amp; Forfeit
            </h2>
          </div>
          <div className="flex items-center space-x-1 text-label-sm text-outline">
            <span className="material-symbols-outlined text-xs" data-icon="lock">
              lock
            </span>
            <span>Escrow</span>
          </div>
        </div>

        {/* Stake Amount Selector */}
        <div>
          <label className="block text-body-sm font-medium text-on-surface mb-2">
            Default stake per impulse unlock
          </label>
          <div className="grid grid-cols-4 gap-2">
            {stakes.map(amount => {
              const isSelected = state.defaultStake === amount;
              return (
                <button
                  key={amount}
                  onClick={() => setDefaultStake(amount)}
                  className={`py-2.5 rounded-lg text-body-md font-semibold transition-all duration-150 active:scale-95 ${
                    isSelected
                      ? 'bg-primary text-on-primary shadow-sm ring-1 ring-primary'
                      : 'border border-outline-variant/50 text-on-surface hover:border-primary hover:bg-surface-container-low focus:outline-none'
                  }`}
                >
                  ${amount}
                </button>
              );
            })}
          </div>
        </div>

        {/* Destination Selector */}
        <div>
          <label className="block text-body-sm font-medium text-on-surface mb-2">
            Destination of forfeited stake
          </label>
          <div className="space-y-2">
            {/* Habit Charity Fund */}
            <label
              onClick={() => setStakeDestination('charity')}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors duration-150 ${
                state.stakeDestination === 'charity'
                  ? 'border-2 border-primary bg-primary-fixed/20'
                  : 'border border-outline-variant/60 hover:bg-surface-container-low'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span
                  className="material-symbols-outlined text-primary text-2xl"
                  data-icon="volunteer_activism"
                >
                  volunteer_activism
                </span>
                <div>
                  <span className="block text-body-md font-semibold text-on-surface">
                    Habit Charity Fund
                  </span>
                  <span className="block text-body-sm text-on-surface-variant">
                    Clean Water &amp; Reforestation
                  </span>
                </div>
              </div>
              <input
                checked={state.stakeDestination === 'charity'}
                onChange={() => setStakeDestination('charity')}
                className="text-primary focus:ring-primary h-4 w-4 accent-primary"
                name="stake_dest"
                type="radio"
              />
            </label>

            {/* Direct to Buddy */}
            <label
              onClick={() => setStakeDestination('buddy')}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors duration-150 ${
                state.stakeDestination === 'buddy'
                  ? 'border-2 border-primary bg-primary-fixed/20'
                  : 'border border-outline-variant/60 hover:bg-surface-container-low'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span
                  className="material-symbols-outlined text-on-surface-variant text-2xl"
                  data-icon="person_add"
                >
                  person_add
                </span>
                <div>
                  <span className="block text-body-md font-semibold text-on-surface">
                    Direct to Buddy
                  </span>
                  <span className="block text-body-sm text-on-surface-variant">
                    Sends money straight to {state.buddy.name.split(' ')[0]}
                  </span>
                </div>
              </div>
              <input
                checked={state.stakeDestination === 'buddy'}
                onChange={() => setStakeDestination('buddy')}
                className="text-primary focus:ring-primary h-4 w-4 accent-primary"
                name="stake_dest"
                type="radio"
              />
            </label>
          </div>
        </div>

        {/* Connected Payment Method */}
        <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-5 bg-surface-container-high rounded flex items-center justify-center font-bold text-[10px] text-secondary tracking-tighter">
              {state.paymentMethod.brand}
            </div>
            <span className="text-body-sm text-on-surface font-medium">
              {state.paymentMethod.brand} ending in {state.paymentMethod.last4}
            </span>
          </div>
          <button
            onClick={onOpenPaymentModal}
            className="text-label-md font-semibold text-primary hover:underline active:scale-95"
          >
            Change
          </button>
        </div>
      </section>

      {/* Monetization Node: Plan Tier Status Card */}
      <section className="bg-gradient-to-br from-surface-container-low to-secondary-fixed/30 rounded-xl p-space-md border border-secondary-container/20 shadow-xs space-y-space-sm relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-1.5 mb-1">
              <span
                className={`px-2 py-0.5 rounded text-label-sm font-semibold uppercase tracking-wider ${
                  state.isPro
                    ? 'bg-secondary text-on-secondary'
                    : 'bg-surface-container-highest text-on-surface-variant'
                }`}
              >
                {state.isPro ? 'Pro Tier' : 'Free Tier'}
              </span>
              <span className="text-body-sm text-outline">Active</span>
            </div>
            <p className="text-body-md text-on-surface font-medium">
              {state.isPro
                ? `${state.apps.length} blocked apps (Unlimited shield active)`
                : '1 blocked app (Instagram) active'}
            </p>
          </div>
          <span
            className="material-symbols-outlined text-secondary text-2xl"
            data-icon="workspace_premium"
          >
            workspace_premium
          </span>
        </div>

        <div className="p-3 bg-surface-container-lowest/90 backdrop-blur-sm rounded-lg border border-outline-variant/40 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-body-md font-semibold text-on-surface">
              {state.isPro ? 'Pro Member Benefits' : 'Pro Tier Upgrade'}
            </span>
            <span className="text-headline-sm font-bold text-secondary">
              $4.99<span className="text-label-sm text-outline font-normal">/mo</span>
            </span>
          </div>
          <p className="text-body-sm text-on-surface-variant leading-relaxed">
            {state.isPro
              ? 'Enjoying unlimited app locks, custom stake amounts, and automated schedules.'
              : 'Unlimited blocked apps, automated smart schedules & custom buddy stakes.'}
          </p>
        </div>

        <button
          onClick={onOpenProModal}
          className="w-full py-3 bg-secondary hover:bg-secondary-container text-on-secondary rounded-lg font-semibold shadow-xs active:scale-98 transition-all duration-150 flex items-center justify-center space-x-2"
        >
          <span>{state.isPro ? 'Manage Pro Subscription' : 'Upgrade to Pro'}</span>
          <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">
            arrow_forward
          </span>
        </button>
      </section>

      {/* Mindful Friction Quick Simulator Trigger */}
      <section className="bg-surface-container-lowest rounded-xl p-space-md border border-outline-variant/30 flex items-center justify-between">
        <div>
          <h3 className="text-body-md font-semibold text-on-surface">Experience Friction Flow</h3>
          <p className="text-body-sm text-on-surface-variant">
            Test what happens when opening a blocked app.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('decide')}
          className="px-3.5 py-2 bg-surface-container-high hover:bg-primary-fixed/40 text-primary rounded-lg text-label-md font-semibold flex items-center gap-1.5 transition-colors active:scale-95"
        >
          <span className="material-symbols-outlined text-base">hourglass_empty</span>
          <span>Simulate Urge</span>
        </button>
      </section>
    </div>
  );
};
