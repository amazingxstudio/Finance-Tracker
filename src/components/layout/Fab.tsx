import { useModal } from '@/context/ModalContext';

export default function Fab() {
  const { openModal } = useModal();
  return (
    <button className="fab" onClick={() => openModal('action')} aria-label="Add transaction">
      <i className="fas fa-plus" />
    </button>
  );
}
