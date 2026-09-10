import type { Transaction } from '@/types';
import TransactionItem from './TransactionItem';
import EmptyState from '@/components/common/EmptyState';

interface TransactionListProps {
  transactions: Transaction[];
  emptyMessage?: string;
  limit?: number;
}

export default function TransactionList({ transactions, emptyMessage = 'No transactions yet', limit }: TransactionListProps) {
  const list = limit ? transactions.slice(0, limit) : transactions;

  if (list.length === 0) {
    return <EmptyState icon="fa-receipt" message={emptyMessage} />;
  }

  return (
    <div className="tx-list">
      {list.map((t) => (
        <TransactionItem key={t.id} tx={t} />
      ))}
    </div>
  );
}
