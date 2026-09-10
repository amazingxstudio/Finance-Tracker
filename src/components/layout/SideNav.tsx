import { NAV_ITEMS, type PageId } from './navConfig';
import { useModal } from '@/context/ModalContext';

interface SideNavProps {
  active: PageId;
  onNavigate: (id: PageId) => void;
}

export default function SideNav({ active, onNavigate }: SideNavProps) {
  const { openModal } = useModal();
  return (
    <aside className="side-nav">
      <div className="side-nav-brand">Finance Tracker</div>
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          className={`side-nav-item ${active === item.id ? 'active' : ''}`}
          onClick={() => onNavigate(item.id)}
        >
          <i className={`fas ${item.icon}`} />
          {item.label}
        </button>
      ))}
      <button className="side-nav-fab" onClick={() => openModal('action')}>
        <i className="fas fa-plus" />
        Add Transaction
      </button>
    </aside>
  );
}
