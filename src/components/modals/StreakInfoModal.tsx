import { useState } from 'react';
import BottomSheetModal from '@/components/common/BottomSheetModal';
import { useModal } from '@/context/ModalContext';
import { useAppData } from '@/context/AppDataContext';

const MILESTONES = [3, 10, 30, 100, 200];
const FLAME_NAMES: Record<number, string> = {
  0: 'Unlit Spark', 3: 'Spark Beginner', 10: 'Phoenix Rising', 30: 'Blaze Master', 100: 'Inferno Legend', 200: 'Mythic Dragon',
};
function getStreakLevel(count: number) {
  if (count >= 200) return { name: FLAME_NAMES[200], next: null as number | null, tier: 200 };
  if (count >= 100) return { name: FLAME_NAMES[100], next: 200, tier: 100 };
  if (count >= 30) return { name: FLAME_NAMES[30], next: 100, tier: 30 };
  if (count >= 10) return { name: FLAME_NAMES[10], next: 30, tier: 10 };
  if (count >= 3) return { name: FLAME_NAMES[3], next: 10, tier: 3 };
  return { name: FLAME_NAMES[0], next: 3, tier: 0 };
}

/* Exact layered flame silhouette from Couple-Tools-main/assets/scripts/features/streak.js. */
function FlameIcon({ tier, large = false }: { tier: number; large?: boolean }) {
  const classTier = tier >= 200 ? 200 : tier >= 100 ? 100 : tier >= 30 ? 30 : tier >= 10 ? 10 : tier >= 3 ? 3 : 0;
  return <svg className={`streak-flame-svg streak-flame-${classTier}${large ? ' streak-flame-large' : ''}`} viewBox="-3 -5 30 30" aria-hidden="true" focusable="false">
    <path className="flame-crown" d="M12 -4c2.5 5-1.5 7-3.5 11.5-1.6 3.6-1 6.7 1 9a6 6 0 0010-3.5c0-2.2-1-4.3-2.3-5.7 3.6 2 6.3 5.7 6.3 10.2a10.5 10.5 0 01-21 0c0-8.5 5.4-13.6 9.5-21.5z" />
    {classTier >= 3 && <path className="flame-left" d="M10 21c-2.5 0-5-1.6-6.3-4.4-1.6-3.4-.7-7 1.3-9.6-.4 3 .3 5 2 6.8 1.6 1.7 3 2.2 3.6 3.4.6 1.2.2 2.5-.6 3.8z" />}
    {classTier >= 10 && <path className="flame-right" d="M14 21c2.5 0 5-1.6 6.3-4.4 1.6-3.4.7-7-1.3-9.6.4 3-.3 5-2 6.8-1.6 1.7-3 2.2-3.6 3.4-.6 1.2-.2 2.5.6 3.8z" />}
    {classTier >= 3 && <g transform="translate(-3,-5) scale(1.25)"><path className="flame-base" d="M12 2c1 4-3 5-3 9a3 3 0 006 0c0-1-.4-2-1-3 2 1 3 3 3 5a5 5 0 01-10 0c0-4 3-6 5-11z" /><path className="flame-core" d="M12 8.5c1 2.2-1.3 2.8-1.3 4.8a1.8 1.8 0 003.6 0c0-.6-.2-1.1-.5-1.6 1.1.6 1.8 1.7 1.8 2.9a2.8 2.8 0 01-5.6 0c0-2.4 1.5-3.7 2-6.1z" /></g>}
  </svg>;
}

export default function StreakInfoModal() {
  const { activeModal, closeModal } = useModal();
  const { streak } = useAppData();
  const [previewTier, setPreviewTier] = useState<number | null>(null);
  const isOpen = activeModal === 'streak-info';
  const count = Math.max(0, Number(streak.count) || 0);
  const level = getStreakLevel(count);
  const previous = level.tier;
  const progress = level.next ? Math.max(0, Math.min(100, ((count - previous) / (level.next - previous)) * 100)) : 100;
  const close = () => { setPreviewTier(null); closeModal(); };
  const releasePreview = () => setPreviewTier(null);

  return <BottomSheetModal isOpen={isOpen} title="Streak System" onClose={close}>
    <div className={`streak-detail-card streak-tier-${level.tier}`} onPointerUp={releasePreview} onPointerCancel={releasePreview}>
      <div className="streak-detail-eyebrow">DAILY CONSISTENCY</div>
      <div className="streak-detail-days">{count} <span>{count === 1 ? 'day' : 'days'}</span></div>
      <div className="streak-detail-level"><i className="fas fa-award" /> {level.name}</div>
      <div className={`streak-detail-main-flame streak-stage-${level.tier}`}><FlameIcon tier={level.tier} large /></div>
      <div className="streak-progress-heading"><span>Next flame evolution</span><strong>{level.next ? `${count}/${level.next} days` : 'MAX LEVEL'}</strong></div>
      <div className="streak-progress-track" role="progressbar" aria-label="Progress to next flame" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}><div className="streak-progress-fill" style={{ width: `${progress}%` }} /></div>
      <div className="streak-next-hint">{level.next ? `${Math.max(0, level.next - count)} more day${level.next - count === 1 ? '' : 's'} to unlock the next flame` : 'You reached the highest flame level!'}</div>
      <div className="streak-milestones" aria-label="Flame milestones">
        {MILESTONES.map((milestone) => <button type="button" key={milestone} className={`streak-milestone ${count >= milestone ? 'is-reached' : ''} ${level.tier === milestone ? 'is-current' : ''}`} onPointerDown={(event) => { event.preventDefault(); setPreviewTier(milestone); }} onPointerUp={releasePreview} onPointerLeave={releasePreview} onPointerCancel={releasePreview} onContextMenu={(event) => event.preventDefault()} aria-label={`Hold to preview ${milestone} day flame`}><span className={`streak-milestone-icon streak-flame-${milestone}`}><FlameIcon tier={milestone} /></span><span>{milestone}d</span></button>)}
      </div>
      <div className="streak-milestone-caption">Press and hold a milestone flame to preview</div>
      {previewTier !== null && <div className={`streak-flame-preview streak-tier-${previewTier}`} role="status" aria-live="polite"><div className="streak-preview-title">{FLAME_NAMES[previewTier]}<span>{previewTier} days</span></div><div className="streak-preview-stage"><FlameIcon tier={previewTier} large /></div><p>{count >= previewTier ? 'Milestone unlocked!' : `${previewTier - count} more day${previewTier - count === 1 ? '' : 's'} to unlock`}</p></div>}
    </div>
    <div className="streak-restores-card"><div className="streak-restores-icon"><i className="fas fa-heart-pulse" /></div><div className="streak-restores-copy"><strong>Monthly Streak Restores</strong><span>Use a restore if you miss a day</span></div><div className="streak-restores-count"><strong>{streak.restores}</strong><span>/ 3 left</span></div></div>
    <div className="streak-tip-card"><i className="fas fa-lightbulb" /><p>Open Finance Tracker every day to keep your streak alive. Consistent small steps help build a lasting habit.</p></div>
  </BottomSheetModal>;
}
