import React from 'react';
import { useApp } from '../context/AppContext.tsx';

export const InsightsScreen: React.FC = () => {
  const { state, setActiveTab } = useApp();

  const days = [
    { day: 'M', active: true, date: '19' },
    { day: 'T', active: true, date: '20' },
    { day: 'W', active: true, date: '21' },
    { day: 'T', active: true, date: '22' },
    { day: 'F', active: true, date: '23' },
    { day: 'S', active: true, date: '24' },
    { day: 'S', active: true, date: '25' },
    { day: 'M', active: true, date: '26' },
    { day: 'T', active: true, date: '27' },
    { day: 'W', active: true, date: '28' },
    { day: 'T', active: true, date: '29' },
    { day: 'F', active: true, date: '30' },
    { day: 'S', active: true, date: '1' },
    { day: 'S', active: true, date: '2', isToday: true },
  ];

  return (
    <div className="space-y-space-md">
      {/* Top Escrow & Mindful Capital */}
      <section className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-on-surface/5 space-y-space-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-headline-sm font-semibold text-on-surface">Escrow Capital</h2>
          <span className="text-label-sm font-semibold text-primary bg-primary-fixed/50 px-2 py-0.5 rounded-full">
            Protected
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/30">
            <span className="text-label-sm text-outline uppercase font-semibold">Saved in Escrow</span>
            <p className="text-headline-md font-bold text-primary mt-0.5">
              ${state.totalEscrowSaved}
            </p>
            <span className="text-body-sm text-on-surface-variant">from 37 resisted impulses</span>
          </div>

          <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/30">
            <span className="text-label-sm text-outline uppercase font-semibold">Forfeited</span>
            <p
              className={`text-headline-md font-bold mt-0.5 ${
                state.forfeitedMonth > 0 ? 'text-error' : 'text-on-surface'
              }`}
            >
              ${state.forfeitedMonth}
            </p>
            <span className="text-body-sm text-on-surface-variant">
              {state.forfeitedMonth > 0 ? 'Sent to recipient' : 'Zero penalties'}
            </span>
          </div>
        </div>
      </section>

      {/* 14-Day Streak Visualization */}
      <section className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-on-surface/5 space-y-space-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span
              className="material-symbols-outlined text-primary text-xl"
              data-icon="local_fire_department"
              data-weight="fill"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_fire_department
            </span>
            <h2 className="text-headline-sm font-semibold text-on-surface">
              {state.streakDays}-Day Calm Streak
            </h2>
          </div>
          <span className="text-label-sm text-outline">Past 2 Weeks</span>
        </div>

        <p className="text-body-sm text-on-surface-variant">
          14 consecutive days without unmindful impulse unlocks during active focus windows.
        </p>

        {/* Calendar dots */}
        <div className="grid grid-cols-7 gap-2 pt-2">
          {days.map((d, index) => (
            <div
              key={index}
              className={`flex flex-col items-center p-2 rounded-lg text-center transition-all ${
                d.isToday
                  ? 'bg-primary-fixed text-on-primary-fixed ring-2 ring-primary font-bold'
                  : 'bg-surface-container-low text-on-surface'
              }`}
            >
              <span className="text-[11px] text-outline font-medium">{d.day}</span>
              <span className="text-body-md font-semibold mt-0.5">{d.date}</span>
              <span
                className="material-symbols-outlined text-sm text-primary mt-1"
                data-icon="check_circle"
                data-weight="fill"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Reclaimed Focus Time */}
      <section className="bg-surface-container-lowest rounded-xl p-space-md shadow-xs border border-on-surface/5 space-y-2">
        <h2 className="text-headline-sm font-semibold text-on-surface">Screen Presence Shift</h2>
        <div className="space-y-2.5 pt-1">
          <div>
            <div className="flex justify-between text-body-sm mb-1">
              <span className="text-on-surface font-medium">Reclaimed Deep Work</span>
              <span className="text-primary font-bold">6h 45m this week</span>
            </div>
            <div className="h-2.5 w-full bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '78%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-body-sm mb-1">
              <span className="text-on-surface font-medium">Impulses Intercepted by Pause</span>
              <span className="text-secondary font-bold">92% success rate</span>
            </div>
            <div className="h-2.5 w-full bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-secondary rounded-full" style={{ width: '92%' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Habit Charity Impact */}
      <section className="bg-surface-container-low rounded-xl p-space-md border border-outline-variant/30 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-xl">forest</span>
          </div>
          <div>
            <h3 className="text-body-md font-semibold text-on-surface">Habit Charity Partner</h3>
            <p className="text-body-sm text-on-surface-variant">
              $0 forfeited • $50 pledged from completed monthly challenges
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('buddy')}
          className="text-label-md font-semibold text-primary hover:underline"
        >
          View Stakes →
        </button>
      </section>
    </div>
  );
};
