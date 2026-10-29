import BottomSheetModal from '@/components/common/BottomSheetModal';
import { useModal } from '@/context/ModalContext';
import { useAppData } from '@/context/AppDataContext';

const STREAK_MILESTONES = [3, 10, 50, 100, 200];

function getStreakLevel(count: number) {
  if (count >= 200) return { name: 'Mythic Dragon', mastery: 'Dragon Mythic', next: null as number | null, fireClass: 'fire-200' };
  if (count >= 100) return { name: 'Inferno Legend', mastery: 'Inferno Lord', next: 200, fireClass: 'fire-100' };
  if (count >= 50) return { name: 'Blaze Master', mastery: 'Blaze Sovereign', next: 100, fireClass: 'fire-50' };
  if (count >= 10) return { name: 'Phoenix Rising', mastery: 'Phoenix', next: 50, fireClass: 'fire-10' };
  if (count >= 3) return { name: 'Ember Guardian', mastery: 'Guardian', next: 10, fireClass: 'fire-3' };
  return { name: 'Spark Beginner', mastery: 'Spark', next: 3, fireClass: 'fire-0' };
}

function getCurrentMilestone(count: number) {
  if (count >= 200) return 200;
  if (count >= 100) return 100;
  if (count >= 50) return 50;
  if (count >= 10) return 10;
  if (count >= 3) return 3;
  return 0;
}

function FlameSvg() {
  return (
    <svg viewBox="-3 -5 30 30" aria-hidden="true" focusable="false">
      <path className="flame-crown" d="M12 -4c2.5 5-1.5 7-3.5 11.5-1.6 3.6-1 6.7 1 9a6 6 0 0010-3.5c0-2.2-1-4.3-2.3-5.7 3.6 2 6.3 5.7 6.3 10.2a10.5 10.5 0 01-21 0c0-8.5 5.4-13.6 9.5-21.5z" />
      <path className="flame-left" d="M10 21c-2.5 0-5-1.6-6.3-4.4-1.6-3.4-.7-7 1.3-9.6-.4 3 .3 5 2 6.8 1.6 1.7 3 2.2 3.6 3.4.6 1.2.2 2.5-.6 3.8z" />
      <path className="flame-right" d="M14 21c2.5 0 5-1.6 6.3-4.4 1.6-3.4.7-7-1.3-9.6.4 3-.3 5-2 6.8-1.6 1.7-3 2.2-3.6 3.4-.6 1.2-.2 2.5.6 3.8z" />
      <g transform="translate(-3,-5) scale(1.25)">
        <path className="flame-base" d="M12 2c1 4-3 5-3 9a3 3 0 006 0c0-1-.4-2-1-3 2 1 3 3 3 5a5 5 0 01-10 0c0-4 3-6 5-11z" />
        <path className="flame-core" d="M12 8.5c1 2.2-1.3 2.8-1.3 4.8a1.8 1.8 0 003.6 0c0-.6-.2-1.1-.5-1.6 1.1.6 1.8 1.7 1.8 2.9a2.8 2.8 0 01-5.6 0c0-2.4 1.5-3.7 2-6.1z" />
      </g>
    </svg>
  );
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
      <div className={`streak-detail-card ${level.fireClass}`}>
        <div className={`streak-detail-orb streak-flame ${level.fireClass}`}>
          <FlameSvg />
        </div>
        <div className="streak-detail-eyebrow">DAILY CONSISTENCY</div>
        <div className="streak-detail-days">{streak.count} <span>days</span></div>
        <div className="streak-detail-level"><i className="fas fa-award" /> {level.name}</div>

        <div className="streak-progress-heading">
          <span>Next flame evolution</span>
          <strong>{level.next ? `${streak.count}/${level.next} days` : 'Maximum level reached'}</strong>
        </div>
        <div className="streak-progress-track" role="progressbar" aria-label="Progress to next streak flame" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
          <div className="streak-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        {level.next && <div className="streak-next-hint">{Math.max(0, level.next - streak.count)} more day{level.next - streak.count === 1 ? '' : 's'} to unlock the next flame</div>}

        <div className="streak-milestones" aria-label="Streak flame milestones">
          {STREAK_MILESTONES.map((milestone) => {
            const milestoneLevel = getStreakLevel(milestone);
            return (
              <div className={`streak-milestone ${streak.count >= milestone ? 'is-reached' : ''} ${streak.count >= milestone ? milestoneLevel.fireClass : 'fire-0'}`} key={milestone}>
                <div className={`streak-milestone-flame ${milestoneLevel.fireClass}`}><FlameSvg /></div>
                <span>{milestone}d</span>
              </div>
            );
          })}
        </div>
        <div className="streak-milestone-caption">Each milestone evolves your flame</div>
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
