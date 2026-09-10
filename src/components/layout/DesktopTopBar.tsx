import { useAppData } from '@/context/AppDataContext';
import { useModal } from '@/context/ModalContext';
import { formatMonthStr } from '@/utils/date';

interface DesktopTopBarProps {
  title: string;
  showMonthPill?: boolean;
}

export default function DesktopTopBar({ title, showMonthPill = false }: DesktopTopBarProps) {
  const { settings, currentMonthStr, streak, notifications } = useAppData();
  const { openModal } = useModal();
  const unread = notifications.filter((n) => n.unread).length;

  return (
    <div className="desktop-top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: '1.3rem', fontWeight: 700 }}>{title}</span>
        {showMonthPill && (
          <button className="month-selector-pill" onClick={() => openModal('month-picker')}>
            {formatMonthStr(currentMonthStr, settings.payday)}
            <i className="fas fa-chevron-down" style={{ fontSize: '0.6rem' }} />
          </button>
        )}
      </div>
      <div className="header-actions-group">
        <button className="streak-badge" onClick={() => openModal('streak-info')}>
          <i className="fas fa-fire" />
          {streak.count > 0 && <span className="streak-count">{streak.count}</span>}
        </button>
        <button className="header-actions" onClick={() => openModal('notifications')}>
          <i className="fas fa-bell" />
          {unread > 0 && <span className="notification-badge">{unread}</span>}
        </button>
      </div>
    </div>
  );
}
