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

function FlameIcon({ tier, large = false, animated = false }: { tier: number; large?: boolean; animated?: boolean }) {
  const isGrown = tier >= 10;
  const isElite = tier >= 30;
  const isLegend = tier >= 100;
  const isMythic = tier >= 200;
  return <svg className={`streak-flame-svg streak-flame-${tier}${large ? ' streak-flame-large' : ''}${animated && isGrown ? ' is-burning' : ''}`} viewBox="0 0 100 120" role="img" aria-label={`${FLAME_NAMES[tier] || 'Flame'} preview`} focusable="false">
    {tier === 0 ? <g className="flame-spark"><path className="flame-crown" d="M50 18 C55 34 41 38 45 52 C48 63 62 59 61 48 C72 61 69 78 56 84 C41 91 27 79 31 63 C34 48 46 39 50 18Z"/><path className="flame-core" d="M51 57 C56 67 48 70 50 76 C55 76 59 71 56 65Z"/></g> : <g className="flame-body">
      <path className="flame-crown" d={isMythic ? 'M50 5 C59 23 43 31 52 43 C58 32 66 28 67 18 C84 39 91 55 84 76 C78 99 60 111 43 108 C19 105 7 85 13 63 C17 47 28 38 30 23 C38 34 36 44 39 50 C47 38 44 23 50 5Z' : isLegend ? 'M50 8 C59 25 43 34 51 45 C59 33 65 28 66 20 C82 39 89 56 82 76 C76 98 60 108 43 105 C21 102 10 84 15 63 C19 47 28 39 31 25 C39 38 37 47 40 53 C48 39 44 24 50 8Z' : isElite ? 'M50 12 C58 27 44 35 51 48 C59 38 65 31 65 24 C78 43 86 57 80 77 C74 96 60 105 44 102 C24 100 13 83 17 65 C20 51 29 42 32 31 C38 43 38 50 41 56 C48 43 45 28 50 12Z' : 'M50 18 C57 32 45 39 51 52 C57 44 62 39 62 32 C73 48 80 62 75 79 C70 94 59 101 46 98 C29 96 20 82 23 67 C26 54 34 47 36 39 C42 49 41 56 44 61 C49 50 46 34 50 18Z'} />
      {isGrown && <path className="flame-left" d={isLegend ? 'M35 76 C22 65 31 50 39 41 C35 56 47 60 45 73 C44 82 39 87 35 76Z' : 'M35 79 C25 66 33 54 40 46 C37 59 47 63 44 74 C42 82 38 85 35 79Z'} />}
      {isElite && <path className="flame-right" d="M65 79 C77 66 68 52 61 44 C64 58 54 63 57 74 C59 82 62 85 65 79Z" />}
      <path className="flame-base" d={isGrown ? 'M50 42 C53 54 42 61 43 72 C44 83 57 84 61 73 C64 65 59 58 57 54 C69 63 72 77 65 87 C57 99 39 97 33 85 C25 69 40 56 50 42Z' : 'M50 46 C53 56 44 63 45 72 C46 82 57 82 60 73 C62 66 58 61 56 57 C66 65 68 77 62 85 C55 94 41 91 37 82 C31 69 43 57 50 46Z'} />
      <path className="flame-core" d={isMythic ? 'M51 64 C58 72 53 78 50 81 C45 79 44 73 51 64Z' : 'M50 64 C56 72 53 78 49 80 C44 77 45 71 50 64Z'} />
      {isMythic && <g className="mythic-sparks"><path d="M20 48 l3 -7 l3 7 l-3 5Z"/><path d="M76 49 l3 -7 l3 7 l-3 5Z"/><circle cx="26" cy="28" r="2"/><circle cx="73" cy="25" r="2"/></g>}
    </g>}
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
  return <BottomSheetModal isOpen={isOpen} title="Streak System" onClose={() => { setPreviewTier(null); closeModal(); }}>
    <div className={`streak-detail-card streak-tier-${level.tier}`}>
      <div className="streak-detail-eyebrow">DAILY CONSISTENCY</div>
      <div className="streak-detail-days">{count} <span>{count === 1 ? 'day' : 'days'}</span></div>
      <div className="streak-detail-level"><i className="fas fa-award" /> {level.name}</div>
      <div className={`streak-detail-main-flame streak-stage-${level.tier}`}><FlameIcon tier={level.tier} large /></div>
      <div className="streak-progress-heading"><span>Next flame evolution</span><strong>{level.next ? `${count}/${level.next} days` : 'MAX LEVEL'}</strong></div>
      <div className="streak-progress-track" role="progressbar" aria-label="Progress to next flame" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}><div className="streak-progress-fill" style={{ width: `${progress}%` }} /></div>
      <div className="streak-next-hint">{level.next ? `${Math.max(0, level.next - count)} more day${level.next - count === 1 ? '' : 's'} to unlock the next flame` : 'You reached the highest flame level!'}</div>
      <div className="streak-milestones" aria-label="Flame milestones">{MILESTONES.map((milestone) => <button type="button" className={`streak-milestone ${count >= milestone ? 'is-reached' : ''} ${level.tier === milestone ? 'is-current' : ''}`} key={milestone} onClick={() => setPreviewTier(milestone)} aria-label={`Preview ${milestone} day flame`}><div className={`streak-milestone-icon streak-flame-${milestone}`}><FlameIcon tier={milestone} /></div><span>{milestone}d</span></button>)}</div>
      <div className="streak-milestone-caption">Tap a milestone flame to preview its evolution</div>
      {previewTier !== null && <div className={`streak-flame-preview streak-tier-${previewTier}`} role="dialog" aria-label={`${previewTier} day flame preview`}><button type="button" className="streak-preview-close" onClick={() => setPreviewTier(null)} aria-label="Close flame preview"><i className="fas fa-times" /></button><div className="streak-preview-title">{FLAME_NAMES[previewTier]} <span>{previewTier} days</span></div><div className="streak-preview-stage"><FlameIcon tier={previewTier} large /></div><p>{count >= previewTier ? 'Milestone unlocked!' : `${previewTier - count} more day${previewTier - count === 1 ? '' : 's'} to unlock this flame`}</p></div>}
    </div>
    <div className="streak-restores-card"><div className="streak-restores-icon"><i className="fas fa-heart-pulse" /></div><div className="streak-restores-copy"><strong>Monthly Streak Restores</strong><span>Use a restore if you miss a day</span></div><div className="streak-restores-count"><strong>{streak.restores}</strong><span>/ 3 left</span></div></div>
    <div className="streak-tip-card"><i className="fas fa-lightbulb" /><p>Open Finance Tracker every day to keep your streak alive. Consistent small steps help build a lasting habit.</p></div>
  </BottomSheetModal>;
}
