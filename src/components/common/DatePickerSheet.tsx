import { useState } from 'react';
import BottomSheetModal from './BottomSheetModal';
import { getLocalISODate, MONTHS } from '@/utils/date';

interface DatePickerSheetProps {
  isOpen: boolean;
  value: string; // yyyy-mm-dd
  onSelect: (iso: string) => void;
  onClose: () => void;
}

export default function DatePickerSheet({ isOpen, value, onSelect, onClose }: DatePickerSheetProps) {
  const initial = value ? new Date(value) : new Date();
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

  const today = getLocalISODate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  function shiftMonth(delta: number) {
    let m = viewMonth + delta;
    let y = viewYear;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setViewMonth(m);
    setViewYear(y);
  }

  function pick(day: number) {
    const iso = getLocalISODate(new Date(viewYear, viewMonth, day));
    onSelect(iso);
    onClose();
  }

  return (
    <BottomSheetModal isOpen={isOpen} title="Select Date" onClose={onClose}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <button className="close-modal" onClick={() => shiftMonth(-1)}><i className="fas fa-chevron-left" /></button>
        <strong>{MONTHS[viewMonth]} {viewYear}</strong>
        <button className="close-modal" onClick={() => shiftMonth(1)}><i className="fas fa-chevron-right" /></button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={`${d}${i}`} style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{d}</div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty${i}`} />;
          const iso = getLocalISODate(new Date(viewYear, viewMonth, day));
          const cls = ['dp-day', iso === today ? 'today' : '', iso === value ? 'selected' : ''].filter(Boolean).join(' ');
          return <div key={day} className={cls} onClick={() => pick(day)}>{day}</div>;
        })}
      </div>
    </BottomSheetModal>
  );
}
