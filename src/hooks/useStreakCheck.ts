import { useEffect, useRef } from 'react';
import { useAppData } from '@/context/AppDataContext';
import { useUi } from '@/context/UiContext';
import { getLocalISODate } from '@/utils/date';

export function useStreakCheck(): void {
  const { streak, setStreak } = useAppData();
  const { showConfirm, showAlert } = useUi();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const today = getLocalISODate();
    const curMonth = new Date().getMonth();

    setStreak((prev) => {
      // Month rolled over -> refill monthly restores.
      if (prev.month !== curMonth) return { ...prev, restores: 3, month: curMonth };
      return prev;
    });

    if (streak.date === today) return; // already checked in today

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yestStr = getLocalISODate(yesterday);

    if (streak.date === yestStr) {
      setStreak((prev) => ({ ...prev, count: prev.count + 1, date: today }));
      return;
    }

    if (streak.date === '') {
      setStreak((prev) => ({ ...prev, count: 1, date: today }));
      return;
    }

    // Streak was broken.
    if (streak.restores > 0) {
      (async () => {
        const ok = await showConfirm(
          'Streak Broken!',
          `You missed a day! You have ${streak.restores} restores left this month.\nUse 1 restore to keep your ${streak.count}\u{1F525} streak?`,
        );
        if (ok) {
          setStreak((prev) => ({ ...prev, restores: prev.restores - 1, count: prev.count + 1, date: today }));
          showAlert('Restored!', 'Your streak is safe.', 'success');
        } else {
          setStreak((prev) => ({ ...prev, count: 1, date: today }));
        }
      })();
    } else {
      setStreak((prev) => ({ ...prev, count: 1, date: today }));
    }
    // Deliberately only runs once on mount — this mirrors the original
    // app's once-per-load streak check.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
