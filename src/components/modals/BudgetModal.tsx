import { useMemo, useState } from 'react';
import BottomSheetModal from '@/components/common/BottomSheetModal';
import SelectSheet from '@/components/common/SelectSheet';
import EmptyState from '@/components/common/EmptyState';
import { useModal } from '@/context/ModalContext';
import { useAppData } from '@/context/AppDataContext';
import { useUi } from '@/context/UiContext';
import { formatMoney } from '@/utils/format';
import { EXPENSE_CATEGORIES } from '@/utils/icons';

export default function BudgetModal() {
  const { activeModal, closeModal } = useModal();
  const { budgets, tx, currentMonthStr, settings, saveCategoryBudget } = useAppData();
  const { showPrompt, showAlert } = useUi();
  const isOpen = activeModal === 'budget';
  const [pickerOpen, setPickerOpen] = useState(false);

  const rows = useMemo(() => {
    const monthTx = tx.filter((t) => t.type === 'exp' && t.monthStr === currentMonthStr);
    return Object.entries(budgets).map(([cat, limit]) => {
      const spent = monthTx.filter((t) => t.category === cat).reduce((s, t) => s + t.amount, 0);
      return { cat, limit, spent, pct: Math.min(100, (spent / limit) * 100) };
    });
  }, [budgets, tx, currentMonthStr]);

  async function handlePick(category: string) {
    setPickerOpen(false);
    const value = await showPrompt('Set Budget', `Monthly limit for ${category}`, String(budgets[category] ?? ''));
    if (value === null) return;
    const result = saveCategoryBudget(category, Number(value));
    if (!result.ok) showAlert('Cannot Save', result.reason ?? 'Enter a valid amount', 'error');
  }

  return (
    <>
      <BottomSheetModal isOpen={isOpen} title="Budgets" onClose={closeModal}>
        {rows.length === 0 ? (
          <EmptyState icon="fa-chart-pie" message="No budgets set yet" />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 18 }}>
            {rows.map((r) => (
              <div key={r.cat} onClick={() => handlePick(r.cat)} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 6 }}>
                  <span style={{ fontWeight: 600 }}>{r.cat}</span>
                  <span style={{ color: r.pct >= 100 ? 'var(--danger-color)' : 'var(--text-secondary)' }}>
                    {formatMoney(r.spent, settings.currency)} / {formatMoney(r.limit, settings.currency)}
                  </span>
                </div>
                <div className="html-bar-track">
                  <div
                    className="html-bar-fill"
                    style={{ width: `${r.pct}%`, background: r.pct >= 100 ? 'var(--danger-color)' : 'var(--primary-color)' }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        <button className="btn btn-primary" onClick={() => setPickerOpen(true)}>
          <i className="fas fa-plus" /> Set Category Budget
        </button>
      </BottomSheetModal>

      <SelectSheet
        isOpen={pickerOpen}
        title="Choose a Category"
        options={EXPENSE_CATEGORIES.map((c) => ({ value: c.value, label: c.value, icon: c.icon }))}
        onSelect={handlePick}
        onClose={() => setPickerOpen(false)}
      />
    </>
  );
}
