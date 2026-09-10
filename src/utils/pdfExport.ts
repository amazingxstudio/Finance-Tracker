import type { Settings, Transaction } from '@/types';
import { formatMoney } from './format';
import { formatMonthStr } from './date';

export type PdfExportType = 'monthly' | 'yearly';

interface PdfExportParams {
  type: PdfExportType;
  transactions: Transaction[];
  settings: Settings;
  currentHistMonth: string | null;
}

/**
 * Builds and downloads the PDF report. jsPDF + autotable are dynamically
 * imported so the ~350kb library only loads when someone actually exports,
 * instead of bloating the initial app bundle on every page load.
 */
export async function exportPDF({
  type,
  transactions,
  settings,
  currentHistMonth,
}: PdfExportParams): Promise<{ ok: true } | { ok: false; reason: string }> {
  if (transactions.length === 0) {
    return { ok: false, reason: 'No data to export' };
  }

  const [{ default: JsPDF }, autoTableModule] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);
  const autoTable = autoTableModule.default;

  let targetTx: Transaction[] = [];
  let titleStr = '';
  let fName = '';

  if (type === 'monthly') {
    if (!currentHistMonth) return { ok: false, reason: 'No month selected' };
    targetTx = transactions.filter((t) => t.monthStr === currentHistMonth);
    titleStr = `Monthly Report: ${formatMonthStr(currentHistMonth, settings.payday)}`;
    fName = `${currentHistMonth}_Report.pdf`;
  } else {
    const currentYear = new Date().getFullYear();
    if (settings.yearMode === 'calendar') {
      targetTx = transactions.filter((t) => t.monthStr.startsWith(currentYear.toString()));
      titleStr = `Yearly Report: Calendar Year ${currentYear}`;
    } else {
      targetTx = transactions;
      titleStr = `Overall Report (Since ${settings.joined})`;
    }
    fName = 'Yearly_Report.pdf';
  }

  if (targetTx.length === 0) {
    return { ok: false, reason: 'No transactions found for this period' };
  }

  let inc = 0;
  let exp = 0;
  targetTx.forEach((t) => {
    if (t.type === 'inc') inc += t.amount;
    else exp += t.amount;
  });
  const bal = inc - exp;

  const doc = new JsPDF();

  doc.setFillColor(99, 102, 241);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('Finance Tracker', 15, 25);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`${titleStr} - ${settings.displayName}`, 15, 33);

  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Summary', 15, 55);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Income: ${formatMoney(inc, settings.currency)}`, 15, 65);
  doc.text(`Total Expense: ${formatMoney(exp, settings.currency)}`, 15, 72);
  doc.setFont('helvetica', 'bold');
  doc.text(`Net Balance: ${formatMoney(bal, settings.currency)}`, 15, 79);

  if (type === 'yearly') {
    doc.text('Expense Breakdown by Category', 15, 95);
    const cats: Record<string, number> = {};
    targetTx
      .filter((t) => t.type === 'exp')
      .forEach((t) => {
        const key = t.category ?? 'Other';
        cats[key] = (cats[key] || 0) + t.amount;
      });
    const tableData = Object.keys(cats).map((k) => [k, formatMoney(cats[k], settings.currency)]);
    autoTable(doc, {
      startY: 100,
      head: [['Category', 'Total Spent']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [99, 102, 241] },
    });
  } else {
    const tableData = targetTx
      .slice(0, 30)
      .map((t) => [
        t.date,
        t.type === 'inc' ? 'Income' : 'Expense',
        t.title,
        t.category || '-',
        `${t.type === 'inc' ? '+' : '-'}${formatMoney(t.amount, settings.currency)}`,
      ]);
    if (targetTx.length > 30) tableData.push(['...', '...', '...', '...', '...']);
    autoTable(doc, {
      startY: 95,
      head: [['Date', 'Type', 'Description', 'Category', 'Amount']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [99, 102, 241] },
      styles: { fontSize: 9 },
    });
  }

  doc.save(fName);
  return { ok: true };
}
