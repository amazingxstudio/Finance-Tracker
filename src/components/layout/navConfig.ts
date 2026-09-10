export type PageId = 'dashboard' | 'income' | 'expense' | 'history' | 'profile';

export const NAV_ITEMS: { id: PageId; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Home', icon: 'fa-house' },
  { id: 'income', label: 'Income', icon: 'fa-arrow-down' },
  { id: 'expense', label: 'Expense', icon: 'fa-arrow-up' },
  { id: 'history', label: 'History', icon: 'fa-clock-rotate-left' },
  { id: 'profile', label: 'Profile', icon: 'fa-user' },
];
