import { useAppData } from '@/context/AppDataContext';
import { useModal } from '@/context/ModalContext';
import { formatMonthStr } from '@/utils/date';

function streakIconClass(count: number): string {
  if (count >= 200) return 'streak-fire-200';
  if (count >= 100) return 'streak-fire-100';
  if (count >= 30) return 'streak-fire-30';
  if (count >= 10) return 'streak-fire-10';
  if (count >= 3) return 'streak-fire-3';
  return 'streak-fire-default';
}

interface TopHeaderProps {
  title: string;
  showMonthPill?: boolean;
}

export default function TopHeader({ title, showMonthPill = false }: TopHeaderProps) {
  const { settings, currentMonthStr, streak, notifications } = useAppData();
  const { openModal } = useModal();
  const unread = notifications.filter((n) => n.unread).length;

  return (
    <header className="top-header">
      <div className="header-title-container">
        <div className="header-title">{title}</div>
        {showMonthPill && (
          <button className="month-selector-pill" onClick={() => openModal('month-picker')}>
            {formatMonthStr(currentMonthStr, settings.payday)}
            <i className="fas fa-chevron-down" style={{ fontSize: '0.6rem' }} />
          </button>
        )}
      </div>
      <div className="header-actions-group">
        <button
          className={`streak-badge ${streakIconClass(streak.count)}`}
          onClick={() => openModal('streak-info')}
        >
          <i className="fas fa-fire" />
          {streak.count > 0 && <span className="streak-count">{streak.count}</span>}
        </button>
        <button className="header-actions" onClick={() => openModal('notifications')}>
          <i className="fas fa-bell" />
          {unread > 0 && <span className="notification-badge">{unread}</span>}
        </button>
      </div>
    </header>
  );
}
