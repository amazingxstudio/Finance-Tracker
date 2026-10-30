import { useEffect, useRef, useState } from 'react';
import BottomSheetModal from '@/components/common/BottomSheetModal';
import { useModal } from '@/context/ModalContext';
import { useAppData } from '@/context/AppDataContext';

const MILESTONES = [3, 10, 50, 100, 200] as const;
type Milestone = (typeof MILESTONES)[number];

// This is the exact layered SVG markup used by Couple-Tools-main/assets/scripts/features/streak.js.
// Keep the paths and viewBox unchanged; tiers only reveal/color its existing layers via CSS.
const FLAME_SVG = (
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

function tierFor(days: number): Milestone | 0 {
  if (days >= 200) return 200;
  if (days >= 100) return 100;
  if (days >= 50) return 50;
  if (days >= 10) return 10;
  if (days >= 3) return 3;
  return 0;
}

function levelName(days: number) {
  if (days >= 200) return 'Mythic Dragon';
  if (days >= 100) return 'Inferno Legend';
  if (days >= 50) return 'Blaze Master';
  if (days >= 10) return 'Phoenix Rising';
  if (days >= 3) return 'Ember Guardian';
  return 'Spark Beginner';
}

export default function StreakInfoModal() {
  const { activeModal, closeModal } = useModal();
  const { streak } = useAppData();
  const isOpen = activeModal === 'streak-info';
  const [previewMilestone, setPreviewMilestone] = useState<Milestone | null>(null);
  const previewTimer = useRef<number | null>(null);
  const currentTier = tierFor(streak.count);
  const nextMilestone = MILESTONES.find((milestone) => milestone > streak.count);
  const previousThreshold = currentTier === 0 ? 0 : currentTier;
  const progress = nextMilestone
    ? Math.max(0, Math.min(100, ((streak.count - previousThreshold) / (nextMilestone - previousThreshold)) * 100))
    : 100;

  useEffect(() => {
    if (!isOpen) setPreviewMilestone(null);
    return () => {
      if (previewTimer.current !== null) window.clearTimeout(previewTimer.current);
    };
  }, [isOpen]);

  const startPreview = (milestone: Milestone) => {
    if (previewTimer.current !== null) window.clearTimeout(previewTimer.current);
    // Avoid treating a quick tap as a hold; preview appears after a short press.
    previewTimer.current = window.setTimeout(() => setPreviewMilestone(milestone), 220);
  };
  const endPreview = () => {
    if (previewTimer.current !== null) window.clearTimeout(previewTimer.current);
    previewTimer.current = null;
    setPreviewMilestone(null);
  };

  return (
    <BottomSheetModal isOpen={isOpen} title="Streak System" onClose={closeModal}>
      <section className="streak-reference-modal" aria-label="Streak progress">
        <div className={`streak-reference-card fire-${currentTier}`}>
          <div className="streak-eyebrow">DAILY CONSISTENCY</div>
          <div className="streak-count-row"><strong>{streak.count}</strong><span>days</span></div>
          <div className="streak-level-pill">{levelName(streak.count)}</div>

          <div className={`streak-giant-flame fire-${currentTier}`} aria-label={`${levelName(streak.count)} flame`}>
            {FLAME_SVG}
          </div>

          <div className="streak-progress-heading">
            <span>Next flame evolution</span>
            <strong>{nextMilestone ? `${streak.count}/${nextMilestone} days` : 'MAX LEVEL'}</strong>
          </div>
          <div className="streak-progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
            <span style={{ width: `${progress}%` }} />
          </div>
          <p className="streak-next-hint">
            {nextMilestone ? `${nextMilestone - streak.count} more day${nextMilestone - streak.count === 1 ? '' : 's'} to unlock the next flame` : "You've reached the top tier."}
          </p>

          <div className="streak-milestone-row">
            {MILESTONES.map((milestone) => (
              <button
                key={milestone}
                type="button"
                className={`streak-milestone ${streak.count >= milestone ? 'is-reached' : ''}`}
                aria-label={`Hold to preview ${milestone}-day flame`}
                onPointerDown={() => startPreview(milestone)}
                onPointerUp={endPreview}
                onPointerLeave={endPreview}
                onPointerCancel={endPreview}
                onContextMenu={(event) => event.preventDefault()}
              >
                <span className={`streak-milestone-icon fire-${milestone}`}>{FLAME_SVG}</span>
                <span>{milestone}d</span>
              </button>
            ))}
          </div>
          <p className="streak-preview-help">Press and hold a milestone flame to preview</p>

          {previewMilestone !== null && (
            <div className="streak-press-preview" role="status" aria-live="polite">
              <div className={`streak-preview-flame fire-${previewMilestone}`}>{FLAME_SVG}</div>
              <strong>{previewMilestone}-day flame</strong>
              <span>{levelName(previewMilestone)}</span>
            </div>
          )}
        </div>

        <div className="streak-restore-card">
          <div className="streak-restore-icon"><i className="fas fa-heartbeat" /></div>
          <div className="streak-restore-copy"><strong>Monthly Streak Restores</strong><span>Use a restore if you miss a day</span></div>
          <div className="streak-restore-count"><strong>{streak.restores}</strong><span>/ 3 left</span></div>
        </div>
        <div className="streak-tip-card"><i className="fas fa-lightbulb" /><span>Open Finance Tracker every day to keep your streak alive. Consistent small steps help build a lasting habit.</span></div>
      </section>
    </BottomSheetModal>
  );
}
