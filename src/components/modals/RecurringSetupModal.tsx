import { useState } from 'react';
import BottomSheetModal from '@/components/common/BottomSheetModal';
import IconPickerGrid from '@/components/common/IconPickerGrid';
import EmptyState from '@/components/common/EmptyState';
import { useModal } from '@/context/ModalContext';
import { useAppData } from '@/context/AppDataContext';
import { useUi } from '@/context/UiContext';
import { formatMoney } from '@/utils/format';
import type { RecurringTemplate, TxType } from '@/types';

export default function RecurringSetupModal() {
  const { activeModal, closeModal } = useModal();
  const { recurringTemplates, settings, saveRecurringTemplate, deleteRecurringTemplate } = useAppData();
  const { showConfirm, showAlert } = useUi();
  const isOpen = activeModal === 'recurring-setup';

  const [editing, setEditing] = useState<RecurringTemplate | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [kind, setKind] = useState<TxType>('exp');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [cat, setCat] = useState('');
  const [icon, setIcon] = useState('fa-wifi');

  function openNew() {
    setEditing(null);
    setKind('exp'); setTitle(''); setAmount(''); setCat(''); setIcon('fa-wifi');
    setFormOpen(true);
  }

  function openEdit(t: RecurringTemplate) {
    setEditing(t);
    setKind(t.kind); setTitle(t.title); setAmount(String(t.amount)); setCat(t.cat); setIcon(t.icon);
    setFormOpen(true);
  }

  function handleSave() {
    const result = saveRecurringTemplate({
      id: editing?.id,
      title: title.trim(),
      amount: Number(amount),
      cat: cat.trim() || 'Other',
      icon,
      kind,
    });
    if (!result.ok) {
      showAlert('Cannot Save', result.reason ?? 'Please check the form.', 'error');
      return;
    }
    setFormOpen(false);
  }

  async function handleDelete(id: string) {
    const ok = await showConfirm('Delete Template?', 'This quick-add template will be removed.', true);
    if (ok) deleteRecurringTemplate(id);
  }

  return (
    <>
      <BottomSheetModal isOpen={isOpen} title="Quick Templates" onClose={closeModal}>
        {recurringTemplates.length === 0 ? (
          <EmptyState icon="fa-repeat" message="No templates yet" />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            {recurringTemplates.map((t) => (
              <div key={t.id} className="settings-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <i className={`fas ${t.icon}`} style={{ width: 20, textAlign: 'center' }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{t.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {t.kind === 'inc' ? 'Income' : t.cat} · {formatMoney(t.amount, settings.currency)}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="close-modal" onClick={() => openEdit(t)}><i className="fas fa-pen" /></button>
                  <button className="close-modal" onClick={() => handleDelete(t.id)}><i className="fas fa-trash" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
        <button className="btn btn-primary" onClick={openNew}>
          <i className="fas fa-plus" /> New Template
        </button>
      </BottomSheetModal>

      <BottomSheetModal isOpen={formOpen} title={editing ? 'Edit Template' : 'New Template'} onClose={() => setFormOpen(false)}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button
            className={`filter-chip ${kind === 'exp' ? 'active' : ''}`}
            style={{ flex: 1, textAlign: 'center' }}
            onClick={() => setKind('exp')}
          >Expense</button>
          <button
            className={`filter-chip ${kind === 'inc' ? 'active' : ''}`}
            style={{ flex: 1, textAlign: 'center' }}
            onClick={() => setKind('inc')}
          >Income</button>
        </div>
        <div className="input-group">
          <label>Label</label>
          <input type="text" placeholder="e.g. Internet Bill" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="input-group">
          <label>Amount</label>
          <input type="number" inputMode="decimal" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        {kind === 'exp' && (
          <div className="input-group">
            <label>Category</label>
            <input type="text" placeholder="e.g. Bills" value={cat} onChange={(e) => setCat(e.target.value)} />
          </div>
        )}
        <div className="input-group">
          <label>Icon</label>
          <IconPickerGrid value={icon} onChange={setIcon} />
        </div>
        <button className="btn btn-primary" onClick={handleSave}>
          <i className="fas fa-check" /> {editing ? 'Save Changes' : 'Create Template'}
        </button>
      </BottomSheetModal>
    </>
  );
}
