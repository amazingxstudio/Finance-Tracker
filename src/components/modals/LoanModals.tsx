import { useState } from 'react';
import BottomSheetModal from '@/components/common/BottomSheetModal';
import DatePickerSheet from '@/components/common/DatePickerSheet';
import EmptyState from '@/components/common/EmptyState';
import { useModal } from '@/context/ModalContext';
import { useAppData } from '@/context/AppDataContext';
import { useUi } from '@/context/UiContext';
import { formatMoney } from '@/utils/format';
import { getLocalISODate } from '@/utils/date';

export function LoansModal() {
  const { activeModal, closeModal, openModal } = useModal();
  const { loans, settings, markLoanPaid, deleteLoan } = useAppData();
  const { showConfirm } = useUi();
  const isOpen = activeModal === 'loans';

  async function handleDelete(id: string) {
    const ok = await showConfirm('Remove Loan?', 'This will remove it from your list.', true);
    if (ok) deleteLoan(id);
  }

  const sorted = [...loans].sort((a, b) => Number(a.paid) - Number(b.paid));

  return (
    <BottomSheetModal isOpen={isOpen} title="Loans & Debts" onClose={closeModal}>
      {sorted.length === 0 ? (
        <EmptyState icon="fa-hand-holding-dollar" message="No loans tracked" />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          {sorted.map((l) => (
            <div key={l.id} className="settings-item" style={{ opacity: l.paid ? 0.55 : 1 }}>
              <div>
                <div style={{ fontWeight: 600 }}>{l.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Due {l.due} {l.paid ? '· Paid' : ''}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <strong>{formatMoney(l.amount, settings.currency)}</strong>
                {!l.paid && (
                  <button className="close-modal" onClick={() => markLoanPaid(l.id)} title="Mark paid">
                    <i className="fas fa-check" />
                  </button>
                )}
                <button className="close-modal" onClick={() => handleDelete(l.id)} title="Remove">
                  <i className="fas fa-trash" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <button className="btn btn-primary" onClick={() => openModal('add-loan')}>
        <i className="fas fa-plus" /> Add Loan
      </button>
    </BottomSheetModal>
  );
}

export function AddLoanModal() {
  const { activeModal, closeModal, openModal } = useModal();
  const { addLoan } = useAppData();
  const { showAlert } = useUi();
  const isOpen = activeModal === 'add-loan';

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [due, setDue] = useState(getLocalISODate());
  const [dateOpen, setDateOpen] = useState(false);

  function handleSave() {
    const result = addLoan(title.trim(), Number(amount), due);
    if (!result.ok) {
      showAlert('Cannot Save', result.reason ?? 'Please fill all fields', 'error');
      return;
    }
    setTitle(''); setAmount('');
    closeModal();
    openModal('loans');
  }

  return (
    <>
      <BottomSheetModal isOpen={isOpen} title="Add Loan" onClose={() => openModal('loans')}>
        <div className="input-group">
          <label>Title</label>
          <input type="text" placeholder="e.g. Motorbike loan" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="input-group">
          <label>Amount</label>
          <input type="number" inputMode="decimal" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div className="input-group">
          <label>Due Date</label>
          <input type="text" readOnly value={due} onClick={() => setDateOpen(true)} />
        </div>
        <button className="btn btn-primary" onClick={handleSave}>
          <i className="fas fa-check" /> Save Loan
        </button>
      </BottomSheetModal>
      <DatePickerSheet isOpen={dateOpen} value={due} onSelect={setDue} onClose={() => setDateOpen(false)} />
    </>
  );
}
