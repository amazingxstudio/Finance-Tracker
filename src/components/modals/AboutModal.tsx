import { useModal } from '@/context/ModalContext';

export default function AboutModal() {
  const { activeModal, closeModal } = useModal();
  const isOpen = activeModal === 'about';

  return (
    <div className={`modal-overlay about-modal-overlay ${isOpen ? 'active' : ''}`} onClick={closeModal}>
      {isOpen && (
        <div className="about-modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="app-icon-container"><i className="fas fa-wallet" /></div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Finance Tracker</div>
          <div className="version-badge">Version 2.0.0</div>
          <div className="dev-profile-card">
            <div className="dev-avatar"><i className="fas fa-code" /></div>
            <div>
              <div style={{ fontWeight: 700, color: '#0f172a' }}>Rebuilt in React + TypeScript</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Installable on iOS, Android & Desktop</div>
            </div>
          </div>
          <button className="btn btn-primary" onClick={closeModal}>Close</button>
        </div>
      )}
    </div>
  );
}
