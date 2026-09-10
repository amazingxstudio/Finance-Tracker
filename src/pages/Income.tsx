import { useMemo } from 'react';
import { useAppData } from '@/context/AppDataContext';
import { useModal } from '@/context/ModalContext';
import TransactionList from '@/components/transactions/TransactionList';
import { formatMoney } from '@/utils/format';

export default function Income() {
  const { tx, settings, currentMonthStr, recurringTemplates, useRecurringTemplate } = useAppData();
  const { openModal } = useModal();

  const incomeTx = useMemo(
    () => tx.filter((t) => t.type === 'inc' && t.monthStr === currentMonthStr)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [tx, currentMonthStr],
  );
  const total = incomeTx.reduce((s, t) => s + t.amount, 0);
  const incomeTemplates = recurringTemplates.filter((t) => t.kind === 'inc');

  return (
    <>
      <div className="balance-card">
        <div className="balance-label">Total Income This Cycle</div>
        <div className="balance-amount amount-in">{formatMoney(total, settings.currency)}</div>
      </div>

      {incomeTemplates.length > 0 && (
        <div className="premium-card">
          <div className="section-title">
            Quick Add
            <button className="link" onClick={() => openModal('recurring-setup')}>Manage</button>
          </div>
          <div className="recurring-scroll-wrapper">
            {incomeTemplates.map((t) => (
              <div key={t.id} className="recurring-chip" onClick={() => useRecurringTemplate(t)}>
                <i className={`fas ${t.icon}`} style={{ color: 'var(--success-color)' }} />
                <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{t.title}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{formatMoney(t.amount, settings.currency)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="section-title">
        All Income
        <button className="link" onClick={() => openModal('income-form')}><i className="fas fa-plus" /> Add</button>
      </div>
      <TransactionList transactions={incomeTx} emptyMessage="No income logged this cycle" />
    </>
  );
}
