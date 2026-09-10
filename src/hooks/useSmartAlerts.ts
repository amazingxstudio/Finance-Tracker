import { useEffect } from 'react';
import { useAppData } from '@/context/AppDataContext';
import { formatMoney } from '@/utils/format';

export function useSmartAlerts(): void {
  const { loans, tx, currentMonthStr, settings, addNotification } = useAppData();

  // Loan due-date alerts — re-checked whenever the loan list changes.
  useEffect(() => {
    const active = loans.filter((l) => !l.paid);
    let urgent = 0;
    let msg = '';
    const now = new Date();
    active.forEach((l) => {
      const due = new Date(l.due);
      const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays <= 3) {
        urgent += 1;
        msg += `\u2022 ${l.title} (${formatMoney(l.amount, settings.currency)}) - ${diffDays < 0 ? 'OVERDUE!' : 'Due soon!'}\n`;
      }
    });
    if (urgent > 0) {
      addNotification(`Loan Alert: You have ${urgent} urgent loan(s) to settle!\n${msg}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loans]);

  // Low remaining-balance alert — re-checked whenever this month's data changes.
  useEffect(() => {
    const mTx = tx.filter((t) => t.monthStr === currentMonthStr);
    let inc = 0;
    let exp = 0;
    mTx.forEach((t) => {
      if (t.type === 'inc') inc += t.amount;
      else exp += t.amount;
    });
    if (inc > 0) {
      const pct = ((inc - exp) / inc) * 100;
      if (pct < 30) {
        addNotification(`Low Balance Alert: Remaining balance is below 30% of income! (${pct.toFixed(1)}%)`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tx, currentMonthStr]);
}
