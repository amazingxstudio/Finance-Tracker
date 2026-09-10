import { useState } from 'react';
import BottomSheetModal from '@/components/common/BottomSheetModal';
import { useModal } from '@/context/ModalContext';
import { useAppData } from '@/context/AppDataContext';
import { useUi } from '@/context/UiContext';
import { formatMoney } from '@/utils/format';

export default function PiggyModal() {
  const { activeModal, closeModal } = useModal();
  const { settings, savePiggy, withdrawPiggy } = useAppData();
  const { showAlert, showConfirm } = useUi();
  const [amount, setAmount] = useState('');

  const isOpen = activeModal === 'piggy';

  function handleAdd() {
    const result = savePiggy(Number(amount));
    if (!result.ok) {
      showAlert('Cannot Save', result.reason ?? 'Enter a valid amount', 'error');
      return;
    }
    setAmount('');
    showAlert('Saved!', 'Added to your piggy bank.', 'success');
  }

  async function handleWithdraw() {
    if (settings.piggyBank <= 0) return;
    const ok = await showConfirm('Withdraw All?', 'This will reset your piggy bank balance to 0.', true);
    if (ok) withdrawPiggy();
  }

  return (
    <BottomSheetModal isOpen={isOpen} title="Piggy Bank" onClose={closeModal}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <i className="fas fa-piggy-bank" style={{ fontSize: '2.5rem', color: 'var(--primary-color)' }} />
        <div style={{ fontSize: '1.8rem', fontWeight: 700, marginTop: 8 }}>
          {formatMoney(settings.piggyBank, settings.currency)}
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Total Saved</div>
      </div>

      <div className="input-group">
        <label>Add to savings</label>
        <input type="number" inputMode="decimal" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>
      <button className="btn btn-savings" onClick={handleAdd}>
        <i className="fas fa-plus" /> Add to Piggy Bank
      </button>
      <button className="btn btn-secondary" style={{ marginTop: 10 }} onClick={handleWithdraw}>
        <i className="fas fa-arrow-right-from-bracket" /> Withdraw All
      </button>
    </BottomSheetModal>
  );
}
