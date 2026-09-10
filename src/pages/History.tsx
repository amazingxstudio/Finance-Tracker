import { useMemo, useState } from 'react';
import { useAppData } from '@/context/AppDataContext';
import { useModal } from '@/context/ModalContext';
import { useUi } from '@/context/UiContext';
import TransactionList from '@/components/transactions/TransactionList';
import { exportPDF } from '@/utils/pdfExport';
import { exportTransactionsCSV } from '@/utils/csvExport';
import { formatMonthStr } from '@/utils/date';

export default function History() {
  const {
    tx, settings, currentHistMonth, setCurrentHistMonth,
  } = useAppData();
  const { openModal } = useModal();
  const { showAlert } = useUi();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'inc' | 'exp'>('all');

  const scoped = useMemo(() => {
    let list = currentHistMonth ? tx.filter((t) => t.monthStr === currentHistMonth) : tx;
    if (typeFilter !== 'all') list = list.filter((t) => t.type === typeFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((t) =>
        t.title.toLowerCase().includes(q)
        || (t.category ?? '').toLowerCase().includes(q)
        || (t.note ?? '').toLowerCase().includes(q));
    }
    return list.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [tx, currentHistMonth, typeFilter, search]);

  async function handleExportPDF() {
    const result = await exportPDF({
      type: currentHistMonth ? 'monthly' : 'yearly',
      transactions: tx,
      settings,
      currentHistMonth,
    });
    if (!result.ok) showAlert('Export Failed', result.reason, 'error');
  }

  function handleExportCSV() {
    if (scoped.length === 0) {
      showAlert('Nothing to Export', 'No transactions match the current filters.', 'error');
      return;
    }
    exportTransactionsCSV(scoped, `finance-history-${currentHistMonth ?? 'all'}.csv`);
  }

  return (
    <>
      <div className="input-group">
        <input
          type="text"
          placeholder="Search title, category or note..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="history-filters">
        <div
          className={`filter-chip ${currentHistMonth === null ? 'active' : ''}`}
          onClick={() => setCurrentHistMonth(null)}
        >
          All Time
        </div>
        <div className="filter-chip" onClick={() => openModal('month-picker', { target: 'history' })}>
          {currentHistMonth ? formatMonthStr(currentHistMonth, settings.payday) : 'Pick Cycle'}
          <i className="fas fa-chevron-down" style={{ marginLeft: 6, fontSize: '0.6rem' }} />
        </div>
        <div className={`filter-chip ${typeFilter === 'inc' ? 'active' : ''}`} onClick={() => setTypeFilter(typeFilter === 'inc' ? 'all' : 'inc')}>Income</div>
        <div className={`filter-chip ${typeFilter === 'exp' ? 'active' : ''}`} onClick={() => setTypeFilter(typeFilter === 'exp' ? 'all' : 'exp')}>Expense</div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
        <button className="btn btn-secondary" onClick={handleExportPDF}><i className="fas fa-file-pdf" /> PDF</button>
        <button className="btn btn-secondary" onClick={handleExportCSV}><i className="fas fa-file-csv" /> CSV</button>
      </div>

      <TransactionList transactions={scoped} emptyMessage="No transactions match your filters" />
    </>
  );
}
