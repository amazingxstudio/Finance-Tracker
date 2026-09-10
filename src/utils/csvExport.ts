import type { Transaction } from '@/types';

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportTransactionsCSV(transactions: Transaction[], filename: string): void {
  const header = ['Date', 'Type', 'Title', 'Category', 'Payment Type', 'Amount', 'Note'];
  const rows = transactions.map((t) => [
    t.date,
    t.type === 'inc' ? 'Income' : 'Expense',
    t.title,
    t.category ?? '',
    t.payType ?? '',
    String(t.amount),
    t.note ?? '',
  ]);

  const csv = [header, ...rows].map((row) => row.map(csvEscape).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
