import BottomSheetModal from '@/components/common/BottomSheetModal';
import { useModal } from '@/context/ModalContext';
import { useAppData } from '@/context/AppDataContext';
import { useUi } from '@/context/UiContext';
import { formatMoney } from '@/utils/format';
import { getTxIcon } from '@/utils/icons';

export default function TxDetailModal() {
  const { activeModal, params, closeModal, openModal } = useModal();
  const {
    tx, settings, customIconsMap, deleteTransaction, restoreTransaction, duplicateTransaction,
  } = useAppData();
  const { showConfirm, showToast, showAlert } = useUi();

  const isOpen = activeModal === 'tx-detail';
  const txId = params.txId as string | undefined;
  const record = tx.find((t) => t.id === txId);

  if (!record) {
    return <BottomSheetModal isOpen={isOpen} title="Transaction" onClose={closeModal}><div /></BottomSheetModal>;
  }

  async function handleDelete() {
    const ok = await showConfirm('Delete Transaction?', 'This action can be undone for a few seconds.', true);
    if (!ok || !record) return;
    const removed = deleteTransaction(record.id);
    closeModal();
    if (removed) {
      showToast('Transaction deleted', {
        actionLabel: 'Undo',
        onAction: () => restoreTransaction(removed),
      });
    }
  }

  function handleDuplicate() {
    duplicateTransaction(record!.id);
    closeModal();
    showAlert('Duplicated', 'A copy was added to today.', 'success');
  }

  const icon = getTxIcon(record.category, record.type, customIconsMap);

  return (
    <BottomSheetModal isOpen={isOpen} title="Transaction Details" onClose={closeModal}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div className={`tx-icon ${record.type}`} style={{ margin: '0 auto 12px', width: 56, height: 56, fontSize: '1.5rem' }}>
          <i className={`fas ${icon}`} />
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700 }} className={record.type === 'inc' ? 'amount-in' : 'amount-out'}>
          {record.type === 'inc' ? '+' : '-'}{formatMoney(record.amount, settings.currency)}
        </div>
        <div style={{ color: 'var(--text-secondary)', marginTop: 4 }}>{record.title}</div>
      </div>

      <div className="settings-group">
        <div className="settings-item"><span>Date</span><strong>{record.date}</strong></div>
        {record.category && <div className="settings-item"><span>Category</span><strong>{record.category}</strong></div>}
        {record.payType && <div className="settings-item"><span>Payment</span><strong>{record.payType}</strong></div>}
        {record.note && <div className="settings-item"><span>Note</span><strong>{record.note}</strong></div>}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          className="btn btn-secondary"
          onClick={() => openModal(record.type === 'inc' ? 'income-form' : 'expense-form', { editId: record.id })}
        >
          <i className="fas fa-pen" /> Edit
        </button>
        <button className="btn btn-secondary" onClick={handleDuplicate}>
          <i className="fas fa-copy" /> Duplicate
        </button>
      </div>
      <button className="btn btn-danger" style={{ marginTop: 10 }} onClick={handleDelete}>
        <i className="fas fa-trash" /> Delete
      </button>
    </BottomSheetModal>
  );
}
