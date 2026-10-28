import { useModal } from '@/context/ModalContext';

export default function AboutModal() {
  const { activeModal, closeModal } = useModal();
  const isOpen = activeModal === 'about';

  return (
    <div className={`modal-overlay about-modal-overlay ${isOpen ? 'active' : ''}`} onClick={closeModal}>
      {isOpen && (
        <div className="about-modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="about-modal-heading">
            <div className="about-modal-title">About App</div>
            <button className="about-close-btn" onClick={closeModal} aria-label="Close About dialog">
              <i className="fas fa-times" aria-hidden="true" />
            </button>
          </div>
          <div className="app-icon-container"><i className="fas fa-wallet" aria-hidden="true" /></div>
          <div className="about-app-name">Finance Tracker</div>
          <div className="version-badge">Version 2.0</div>
          <div className="dev-profile-card">
            <div className="dev-avatar"><i className="fas fa-user-tie" aria-hidden="true" /></div>
            <div>
              <div className="about-dev-label">Developed By</div>
              <div className="about-dev-name">AUNG MYAT MINN</div>
            </div>
          </div>
          <div className="about-social-links">
            <a href="https://t.me/aung_myat_minn" target="_blank" rel="noreferrer" className="social-btn about-telegram">
              <i className="fa-brands fa-telegram" aria-hidden="true" /> Telegram
            </a>
            <a href="mailto:aungmyatminnx@gmail.com" className="social-btn about-email">
              <i className="fas fa-envelope" aria-hidden="true" /> Email
            </a>
          </div>
          <div className="about-copyright">© 2026 Finance Tracker. All rights reserved.</div>
        </div>
      )}
    </div>
  );
}
