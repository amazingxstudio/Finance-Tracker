export type ThemeName = 'midnight' | 'light' | 'rosegold';
export type Currency = 'MMK' | 'USD' | 'EUR';
export type YearMode = 'calendar' | 'install';
export type ChartType = 'bar' | 'radar' | 'circle';
export type TxType = 'inc' | 'exp';

export interface Transaction {
  id: string;
  type: TxType;
  amount: number;
  title: string;
  date: string; // ISO yyyy-mm-dd
  note?: string;
  monthStr: string; // yyyy-mm accounting cycle
  category?: string; // expense only
  payType?: string; // expense only
}

export interface Settings {
  theme: ThemeName;
  currency: Currency;
  displayName: string;
  joined: string;
  avatar: string;
  payday: number;
  yearMode: YearMode;
  piggyBank: number;
  chartType: ChartType;
}

export interface RecurringTemplate {
  id: string;
  title: string;
  amount: number;
  cat: string;
  icon: string;
  kind: TxType; // NEW: recurring templates now support income too
}

export interface Loan {
  id: string;
  title: string;
  amount: number;
  due: string;
  paid: boolean;
}

export interface AppNotification {
  message: string;
  time: string;
  unread: boolean;
}

export interface Streak {
  count: number;
  date: string;
  restores: number;
  month: number;
}

export type BudgetMap = Record<string, number>;
export type CustomIconsMap = Record<string, string>;

export interface AppData {
  tx: Transaction[];
  settings: Settings;
  budgets: BudgetMap;
  notifications: AppNotification[];
  recurringTemplates: RecurringTemplate[];
  loans: Loan[];
  streak: Streak;
  customIconsMap: CustomIconsMap;
}

export interface BackupPayload {
  version: number;
  exportedAt: string;
  data: AppData;
}
