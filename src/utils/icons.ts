import type { CustomIconsMap, TxType } from '@/types';

const DEFAULT_CATEGORY_ICONS: Record<string, string> = {
  Food: 'fa-hamburger',
  Transport: 'fa-car',
  Shopping: 'fa-bag-shopping',
  Bills: 'fa-file-invoice-dollar',
  Education: 'fa-book-open',
  Health: 'fa-heart-pulse',
  Entertainment: 'fa-film',
  Family: 'fa-house',
};

export function getTxIcon(
  category: string | undefined,
  type: TxType,
  customIconsMap: CustomIconsMap,
): string {
  if (type === 'inc') return 'fa-arrow-down';
  if (category && customIconsMap[category]) return customIconsMap[category];
  if (category && DEFAULT_CATEGORY_ICONS[category]) return DEFAULT_CATEGORY_ICONS[category];
  return 'fa-tag';
}

export const ICON_PICKER_OPTIONS = [
  'fa-wifi', 'fa-coffee', 'fa-cookie', 'fa-burger', 'fa-bolt',
  'fa-mobile-screen', 'fa-gamepad', 'fa-dumbbell', 'fa-house', 'fa-bag-shopping',
  'fa-car', 'fa-file-invoice-dollar', 'fa-gift', 'fa-heart', 'fa-plane',
  'fa-arrow-down', 'fa-briefcase', 'fa-graduation-cap',
];

export const EXPENSE_CATEGORIES = [
  { value: 'Food', icon: 'fa-hamburger' },
  { value: 'Transport', icon: 'fa-car' },
  { value: 'Shopping', icon: 'fa-bag-shopping' },
  { value: 'Bills', icon: 'fa-file-invoice-dollar' },
  { value: 'Education', icon: 'fa-book-open' },
  { value: 'Health', icon: 'fa-heart-pulse' },
  { value: 'Entertainment', icon: 'fa-film' },
  { value: 'Family', icon: 'fa-house' },
  { value: 'Other', icon: 'fa-tag' },
];

export const PAYMENT_TYPES = ['Cash', 'KBZPay', 'Wave', 'Card', 'Other'];
export const INCOME_TYPES = ['Base Salary', 'Bonus', 'Extra Income', 'Other Earnings'];

export const CHART_COLORS = [
  '#6366f1', '#f87171', '#4ade80', '#fbbf24', '#c084fc', '#f472b6', '#2dd4bf',
];
