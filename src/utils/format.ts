import type { Currency } from '@/types';

export function currencySymbol(currency: Currency): string {
  if (currency === 'MMK') return 'Ks';
  if (currency === 'EUR') return '€';
  return '$';
}

/** Plain text amount, e.g. "12,000 Ks" or "$12.00" */
export function formatMoney(amount: number, currency: Currency): string {
  const sym = currencySymbol(currency);
  const safe = Number.isFinite(amount) ? amount : 0;
  if (currency === 'MMK') {
    return `${safe.toLocaleString('en-US', { maximumFractionDigits: 0 })} ${sym}`;
  }
  return `${sym}${safe.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Returns { main, unit } so components can style the currency unit smaller. */
export function formatMoneyParts(amount: number, currency: Currency): { main: string; unit: string } {
  const sym = currencySymbol(currency);
  const safe = Number.isFinite(amount) ? amount : 0;
  if (currency === 'MMK') {
    return {
      main: safe.toLocaleString('en-US', { maximumFractionDigits: 0 }),
      unit: sym,
    };
  }
  return {
    main: safe.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    unit: sym,
  };
}
