import { useState } from 'react';
import { useModal } from '@/context/ModalContext';
import { useAppData } from '@/context/AppDataContext';

export default function NotificationsModal() {
  const { activeModal, closeModal } = useModal();
  const { notifications, markAllNotificationsRead, deleteNotificationsAt, clearNotifications } = useAppData();
  const isOpen = activeModal === 'notifications';
  const [selected, setSelected] = useState<Set<number>>(new Set());

  if (!isOpen) return null;

  function toggle(i: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  }

  function handleDeleteSelected() {
    deleteNotificationsAt(Array.from(selected));
    setSelected(new Set());
  }

  return (
    <div className="dialog-overlay notif-sheet active" onClick={closeModal}>
      <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Notifications</div>
          <div className="close-modal" onClick={closeModal}><i className="fas fa-times" /></div>
        </div>
        <div className="notif-header-actions">
          <button className="notif-control-btn" onClick={markAllNotificationsRead} disabled={notifications.every((n) => !n.unread)}>
            <i className="fas fa-check-double" /> Mark all read
          </button>
          <button
            className="notif-control-btn"
            onClick={selected.size > 0 ? handleDeleteSelected : clearNotifications}
            disabled={notifications.length === 0}
          >
            <i className="fas fa-trash" /> {selected.size > 0 ? `Delete (${selected.size})` : 'Clear all'}
          </button>
        </div>
        <div className="notif-list-container">
          {notifications.length === 0 ? (
            <div className="empty-state"><i className="fas fa-bell-slash" /><div style={{ marginTop: 10 }}>No notifications</div></div>
          ) : (
            notifications.map((n, i) => (
              <div className="notif-item" key={`${n.time}-${i}`} onClick={() => toggle(i)}>
                <input type="checkbox" className="notif-checkbox" checked={selected.has(i)} onChange={() => toggle(i)} />
                <div className="notif-text-wrapper">
                  <div className="notif-item-msg">{n.unread && <span className="unread-dot" />}{n.message}</div>
                  <div className="notif-item-time">{n.time}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
