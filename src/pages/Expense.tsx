import { useMemo, useState } from 'react';
import { useAppData } from '@/context/AppDataContext';
import { useModal } from '@/context/ModalContext';
import TransactionList from '@/components/transactions/TransactionList';
import { formatMoney } from '@/utils/format';

export default function Expense() {
  const { tx, settings, currentMonthStr, recurringTemplates, useRecurringTemplate } = useAppData();
  const { openModal } = useModal();
  const [filter, setFilter] = useState<string>('All');

  const expenseTx = useMemo(
    () => tx.filter((t) => t.type === 'exp' && t.monthStr === currentMonthStr)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [tx, currentMonthStr],
  );
  const filtered = filter === 'All' ? expenseTx : expenseTx.filter((t) => t.category === filter);
  const total = expenseTx.reduce((s, t) => s + t.amount, 0);
  const expenseTemplates = recurringTemplates.filter((t) => t.kind === 'exp');

  const categoriesInUse = Array.from(new Set(expenseTx.map((t) => t.category).filter(Boolean))) as string[];

  return (
    <>
      <div className="balance-card">
        <div className="balance-label">Total Spent This Cycle</div>
        <div className="balance-amount amount-out">{formatMoney(total, settings.currency)}</div>
      </div>

      {expenseTemplates.length > 0 && (
        <div className="premium-card">
          <div className="section-title">
            Quick Add
            <button className="link" onClick={() => openModal('recurring-setup')}>Manage</button>
          </div>
          <div className="recurring-scroll-wrapper">
            {expenseTemplates.map((t) => (
              <div key={t.id} className="recurring-chip" onClick={() => useRecurringTemplate(t)}>
                <i className={`fas ${t.icon}`} style={{ color: 'var(--primary-color)' }} />
                <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{t.title}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{formatMoney(t.amount, settings.currency)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="section-title">
        All Expenses
        <button className="link" onClick={() => openModal('expense-form')}><i className="fas fa-plus" /> Add</button>
      </div>

      {categoriesInUse.length > 0 && (
        <div className="history-filters">
          <div className={`filter-chip ${filter === 'All' ? 'active' : ''}`} onClick={() => setFilter('All')}>All</div>
          {categoriesInUse.map((c) => (
            <div key={c} className={`filter-chip ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>{c}</div>
          ))}
        </div>
      )}

      <TransactionList transactions={filtered} emptyMessage="No expenses logged this cycle" />
    </>
  );
}
