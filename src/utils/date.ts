const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export function getLocalISODate(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`;
}

/** Computes the yyyy-mm "accounting cycle" a date belongs to, given a salary payday. */
export function calculateCycleStr(dateObj: Date, payday: number): string {
  const pd = payday || 1;
  let y = dateObj.getFullYear();
  let m = dateObj.getMonth();
  const d = dateObj.getDate();

  if (pd > 1 && d < pd) {
    m -= 1;
    if (m < 0) {
      m = 11;
      y -= 1;
    }
  }
  return `${y}-${String(m + 1).padStart(2, '0')}`;
}

export function formatMonthStr(str: string, payday: number): string {
  if (!str) return '';
  const [y, m] = str.split('-');
  const pd = payday || 1;
  if (pd === 1) return `${MONTHS[parseInt(m, 10) - 1]} ${y}`;
  return `${MONTHS[parseInt(m, 10) - 1]} Cycle`;
}

export function ordinal(n: number): string {
  if (n === 1 || n === 21 || n === 31) return `${n}st`;
  if (n === 2 || n === 22) return `${n}nd`;
  if (n === 3 || n === 23) return `${n}rd`;
  return `${n}th`;
}

export function monthLabel(date: Date): string {
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export { MONTHS };
