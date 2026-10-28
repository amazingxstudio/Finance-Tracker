import BottomSheetModal from '@/components/common/BottomSheetModal';
import { useModal } from '@/context/ModalContext';
import { useAppData } from '@/context/AppDataContext';

function getStreakLevel(count: number) {
  if (count >= 200) return { name: 'Legendary', next: null as number | null };
  if (count >= 100) return { name: 'Master', next: 200 };
  if (count >= 30) return { name: 'Expert', next: 100 };
  if (count >= 10) return { name: 'Pro', next: 30 };
  if (count >= 3) return { name: 'Active', next: 10 };
  return { name: 'Beginner', next: 3 };
}

function getCurrentMilestone(count: number) {
  if (count >= 200) return 200;
  if (count >= 100) return 100;
  if (count >= 30) return 30;
  if (count >= 10) return 10;
  if (count >= 3) return 3;
  return 0;
}

export default function StreakInfoModal() {
  const { activeModal, closeModal } = useModal();
  const { streak } = useAppData();
  const isOpen = activeModal === 'streak-info';
  const level = getStreakLevel(streak.count);
  const currentMilestone = getCurrentMilestone(streak.count);
  const progress = level.next
    ? Math.max(0, Math.min(100, ((streak.count - currentMilestone) / (level.next - currentMilestone)) * 100))
    : 100;

  return (
    <BottomSheetModal isOpen={isOpen} title="Streak System" onClose={closeModal}>
      <div className={`streak-detail-card ${streak.count >= 200 ? 'streak-detail-legendary' : streak.count >= 100 ? 'streak-detail-master' : streak.count >= 30 ? 'streak-detail-expert' : ''}`}>
        <div className="streak-detail-orb"><i className="fas fa-fire" /></div>
        <div className="streak-detail-eyebrow">DAILY CONSISTENCY</div>
        <div className="streak-detail-days">{streak.count} <span>days</span></div>
        <div className="streak-detail-level"><i className="fas fa-award" /> {level.name} Level</div>
        <div className="streak-progress-heading">
          <span>Next milestone</span>
          <strong>{level.next ? `${streak.count}/${level.next} days` : 'Maximum level reached'}</strong>
        </div>
        <div className="streak-progress-track"><div className="streak-progress-fill" style={{ width: `${progress}%` }} /></div>
        {level.next && <div className="streak-next-hint">{Math.max(0, level.next - streak.count)} more day{level.next - streak.count === 1 ? '' : 's'} to reach {level.next} days</div>}
      </div>

      <div className="streak-restores-card">
        <div className="streak-restores-icon"><i className="fas fa-heart-pulse" /></div>
        <div className="streak-restores-copy">
          <strong>Monthly Streak Restores</strong>
          <span>Use a restore if you miss a day</span>
        </div>
        <div className="streak-restores-count"><strong>{streak.restores}</strong><span>/ 3 left</span></div>
      </div>

      <div className="streak-tip-card">
        <i className="fas fa-lightbulb" />
        <p>Open Finance Tracker every day to keep your streak alive. Consistent small steps help build a lasting habit.</p>
      </div>
    </BottomSheetModal>
  );
}
