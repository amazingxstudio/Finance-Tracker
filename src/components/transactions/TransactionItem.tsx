import type { Transaction } from '@/types';
import { useAppData } from '@/context/AppDataContext';
import { useModal } from '@/context/ModalContext';
import { formatMoney } from '@/utils/format';
import { getTxIcon } from '@/utils/icons';

function formatDisplayDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function TransactionItem({ tx }: { tx: Transaction }) {
  const { settings, customIconsMap } = useAppData();
  const { openModal } = useModal();
  const icon = getTxIcon(tx.category, tx.type, customIconsMap);

  return (
    <button className="tx-item" onClick={() => openModal('tx-detail', { txId: tx.id })}>
      <div className={`tx-icon ${tx.type}`}>
        <i className={`fas ${icon}`} />
      </div>
      <div className="tx-details">
        <div className="tx-title">{tx.title}</div>
        <div className="tx-date">
          {formatDisplayDate(tx.date)}
          {tx.category ? ` \u00b7 ${tx.category}` : ''}
        </div>
      </div>
      <div className={`tx-amount ${tx.type === 'inc' ? 'amount-in' : 'amount-out'}`}>
        {tx.type === 'inc' ? '+' : '-'}
        {formatMoney(tx.amount, settings.currency)}
      </div>
    </button>
  );
}
