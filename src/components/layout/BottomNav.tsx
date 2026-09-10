import { NAV_ITEMS, type PageId } from './navConfig';

interface BottomNavProps {
  active: PageId;
  onNavigate: (id: PageId) => void;
}

export default function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          className={`nav-item ${active === item.id ? 'active' : ''}`}
          onClick={() => onNavigate(item.id)}
        >
          <i className={`fas ${item.icon}`} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
