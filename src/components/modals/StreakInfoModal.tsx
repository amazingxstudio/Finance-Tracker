import BottomSheetModal from '@/components/common/BottomSheetModal';
import { useModal } from '@/context/ModalContext';
import { useAppData } from '@/context/AppDataContext';

const MILESTONES = [
  { days: 3, label: 'Ember Guardian', className: 'fire-3' },
  { days: 10, label: 'Phoenix Rising', className: 'fire-10' },
  { days: 50, label: 'Blaze Master', className: 'fire-50' },
  { days: 100, label: 'Inferno Legend', className: 'fire-100' },
  { days: 200, label: 'Mythic Dragon', className: 'fire-200' },
];

function getStreakLevel(count: number) {
  if (count >= 200) return { name: 'Mythic Dragon', next: null as number | null, className: 'fire-200' };
  if (count >= 100) return { name: 'Inferno Legend', next: 200, className: 'fire-100' };
  if (count >= 50) return { name: 'Blaze Master', next: 100, className: 'fire-50' };
  if (count >= 10) return { name: 'Phoenix Rising', next: 50, className: 'fire-10' };
  if (count >= 3) return { name: 'Ember Guardian', next: 10, className: 'fire-3' };
  return { name: 'Spark Beginner', next: 3, className: 'fire-0' };
}

function FlameSvg() {
  return (
    <svg viewBox="-3 -5 30 30" aria-hidden="true">
      <path className="reference-flame-crown" d="M12 -4c2.5 5-1.5 7-3.5 11.5-1.6 3.6-1 6.7 1 9a6 6 0 0010-3.5c0-2.2-1-4.3-2.3-5.7 3.6 2 6.3 5.7 6.3 10.2a10.5 10.5 0 01-21 0c0-8.5 5.4-13.6 9.5-21.5z" />
      <path className="reference-flame-left" d="M10 21c-2.5 0-5-1.6-6.3-4.4-1.6-3.4-.7-7 1.3-9.6-.4 3 .3 5 2 6.8 1.6 1.7 3 2.2 3.6 3.4.6 1.2.2 2.5-.6 3.8z" />
      <path className="reference-flame-right" d="M14 21c2.5 0 5-1.6 6.3-4.4 1.6-3.4.7-7-1.3-9.6.4 3-.3 5-2 6.8-1.6 1.7-3 2.2-3.6 3.4-.6 1.2-.2 2.5.6 3.8z" />
      <g transform="translate(-3,-5) scale(1.25)">
        <path className="reference-flame-base" d="M12 2c1 4-3 5-3 9a3 3 0 006 0c0-1-.4-2-1-3 2 1 3 3 3 5a5 5 0 01-10 0c0-4 3-6 5-11z" />
        <path className="reference-flame-core" d="M12 8.5c1 2.2-1.3 2.8-1.3 4.8a1.8 1.8 0 003.6 0c0-.6-.2-1.1-.5-1.6 1.1.6 1.8 1.7 1.8 2.9a2.8 2.8 0 01-5.6 0c0-2.4 1.5-3.7 2-6.1z" />
      </g>
    </svg>
  );
}

export default function StreakInfoModal() {
  const { activeModal, closeModal } = useModal();
  const { streak } = useAppData();
  const isOpen = activeModal === 'streak-info';
  const count = Math.max(0, Number(streak.count) || 0);
  const level = getStreakLevel(count);
  const next = level.next;
  const previous = next === null ? 200 : (MILESTONES.filter((m) => m.days < next).slice(-1)[0]?.days ?? 0);
  const progress = next ? Math.max(0, Math.min(100, ((count - previous) / (next - previous)) * 100)) : 100;

  return (
    <BottomSheetModal isOpen={isOpen} title="Streak System" onClose={closeModal}>
      <div className={`reference-streak-modal ${level.className}`}>
        <div className={`reference-streak-flame ${level.className}`}><FlameSvg /></div>
        <div className="reference-streak-count"><span>{count}</span><span className="reference-streak-days">days</span></div>
        <div className="reference-streak-level">{level.name}</div>
        <p className="reference-streak-hint">
          {next ? `${next - count} more day${next - count === 1 ? '' : 's'} to the next milestone` : "You've reached the top tier — legendary."}
        </p>
        <div className="reference-milestone-row" aria-label="Streak milestones">
          {MILESTONES.map((milestone) => (
            <div className={`reference-milestone-item ${count >= milestone.days ? 'is-reached' : ''}`} key={milestone.days}>
              <div className={`reference-milestone-flame ${milestone.className}`} title={milestone.label} aria-label={`${milestone.days} day milestone: ${milestone.label}`}>
                <FlameSvg />
              </div>
              <span>{milestone.days}d</span>
            </div>
          ))}
        </div>
        <div className="reference-streak-progress-label">
          <span>Next milestone</span><strong>{next ? `${count}/${next} days` : 'Maximum level reached'}</strong>
        </div>
        <div className="reference-streak-progress"><span style={{ width: `${progress}%` }} /></div>
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
