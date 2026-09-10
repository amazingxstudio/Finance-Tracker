import { useMemo } from 'react';
import { useAppData } from '@/context/AppDataContext';
import { useModal } from '@/context/ModalContext';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import TransactionList from '@/components/transactions/TransactionList';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import { formatMoney } from '@/utils/format';

export default function Dashboard() {
  const { tx, settings, currentMonthStr, recurringTemplates, useRecurringTemplate } = useAppData();
  const { openModal } = useModal();
  const isDesktop = useIsDesktop();

  const monthTx = useMemo(
    () => tx.filter((t) => t.monthStr === currentMonthStr).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [tx, currentMonthStr],
  );

  const { inc, exp } = useMemo(() => {
    let i = 0; let e = 0;
    monthTx.forEach((t) => { if (t.type === 'inc') i += t.amount; else e += t.amount; });
    return { inc: i, exp: e };
  }, [monthTx]);

  const balance = inc - exp;

  const body = (
    <>
      <div className="balance-card">
        {settings.piggyBank > 0 && (
          <div className="savings-badge">
            <i className="fas fa-piggy-bank" /> {formatMoney(settings.piggyBank, settings.currency)}
          </div>
        )}
        <div className="balance-label">Remaining Balance</div>
        <div className="balance-amount">{formatMoney(balance, settings.currency)}</div>
        <div className="balance-stats">
          <div className="stat-col">
            <span className="stat-label">Income</span>
            <span className="stat-val amount-in">{formatMoney(inc, settings.currency)}</span>
          </div>
          <div className="stat-col">
            <span className="stat-label">Expense</span>
            <span className="stat-val amount-out">{formatMoney(exp, settings.currency)}</span>
          </div>
        </div>
      </div>

      <div className={isDesktop ? 'action-grid desktop-wide' : 'action-grid'} style={{ marginBottom: 20 }}>
        <div className="action-card" onClick={() => openModal('income-form')}>
          <i className="fas fa-arrow-down" style={{ color: 'var(--success-color)' }} />
          <div>Add Income</div>
        </div>
        <div className="action-card" onClick={() => openModal('expense-form')}>
          <i className="fas fa-arrow-up" style={{ color: 'var(--danger-color)' }} />
          <div>Add Expense</div>
        </div>
        <div className="action-card" onClick={() => openModal('piggy')}>
          <i className="fas fa-piggy-bank" style={{ color: 'var(--primary-color)' }} />
          <div>Piggy Bank</div>
        </div>
        <div className="action-card" onClick={() => openModal('budget')}>
          <i className="fas fa-chart-pie" style={{ color: 'var(--warning-color)' }} />
          <div>Budgets</div>
        </div>
      </div>

      {recurringTemplates.length > 0 && (
        <div className="premium-card">
          <div className="section-title">
            Quick Templates
            <button className="link" onClick={() => openModal('recurring-setup')}>Manage</button>
          </div>
          <div className="recurring-scroll-wrapper">
            {recurringTemplates.map((t) => (
              <div key={t.id} className="recurring-chip" onClick={() => useRecurringTemplate(t)}>
                <i className={`fas ${t.icon}`} style={{ color: t.kind === 'inc' ? 'var(--success-color)' : 'var(--primary-color)' }} />
                <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{t.title}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{formatMoney(t.amount, settings.currency)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="premium-card">
        <div className="section-title">Spending Breakdown</div>
        <AnalyticsChart transactions={monthTx} type={settings.chartType} />
      </div>

      <div className="section-title">Recent Activity</div>
      <TransactionList transactions={monthTx} limit={6} emptyMessage="No activity this cycle yet" />
    </>
  );

  return body;
}
