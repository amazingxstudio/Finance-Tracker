import BottomSheetModal from '@/components/common/BottomSheetModal';
import { useModal } from '@/context/ModalContext';
import { useAppData } from '@/context/AppDataContext';

export default function StreakInfoModal() {
  const { activeModal, closeModal } = useModal();
  const { streak } = useAppData();
  const isOpen = activeModal === 'streak-info';

  return (
    <BottomSheetModal isOpen={isOpen} title="Your Streak" onClose={closeModal}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <i className="fas fa-fire" style={{ fontSize: '2.6rem', color: 'var(--warning-color)' }} />
        <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: 8 }}>{streak.count} days</div>
        <div style={{ color: 'var(--text-secondary)' }}>{streak.restores} streak restore(s) left this month</div>
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        Open the app every day to build your streak. If you miss a day, you can use a monthly restore to keep it alive —
        you get 3 restores per month.
      </p>
    </BottomSheetModal>
  );
}
