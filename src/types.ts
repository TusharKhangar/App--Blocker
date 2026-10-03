export type TabType = 'focus' | 'decide' | 'insights' | 'buddy';

export type StakeDestination = 'charity' | 'buddy';

export interface BuddyInfo {
  name: string;
  phone: string;
  avatarUrl: string;
  smsAlertsEnabled: boolean;
  alertOnOverride: boolean;
  relationship: string;
}

export interface BlockedApp {
  id: string;
  name: string;
  icon: string;
  category: string;
  isActive: boolean;
  isProOnly: boolean;
  dailyAttempts: number;
}

export interface AppState {
  activeTab: TabType;
  streakDays: number;
  forfeitedMonth: number;
  totalEscrowSaved: number;
  defaultStake: number;
  stakeDestination: StakeDestination;
  buddy: BuddyInfo;
  paymentMethod: {
    brand: string;
    last4: string;
    expiry: string;
  };
  isPro: boolean;
  zenMode: boolean;
  hapticFeedback: boolean;
  apps: BlockedApp[];
}
