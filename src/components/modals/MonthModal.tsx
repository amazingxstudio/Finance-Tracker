import BottomSheetModal from '@/components/common/BottomSheetModal';
import { useModal } from '@/context/ModalContext';
import { useAppData } from '@/context/AppDataContext';
import { formatMonthStr } from '@/utils/date';

export default function MonthModal() {
  const { activeModal, params, closeModal } = useModal();
  const {
    availableMonths, currentMonthStr, setCurrentMonthStr, currentHistMonth, setCurrentHistMonth, settings,
  } = useAppData();
  const isOpen = activeModal === 'month-picker';
  const target = (params.target as string) === 'history' ? 'history' : 'dashboard';
  const selected = target === 'history' ? currentHistMonth : currentMonthStr;

  function pick(m: string) {
    if (target === 'history') setCurrentHistMonth(m);
    else setCurrentMonthStr(m);
    closeModal();
  }

  return (
    <BottomSheetModal isOpen={isOpen} title="Select Cycle" onClose={closeModal}>
      <div className="month-grid">
        {availableMonths.map((m) => (
          <div
            key={m}
            className={`month-chip ${m === selected ? 'active' : ''}`}
            onClick={() => pick(m)}
          >
            {formatMonthStr(m, settings.payday)}
          </div>
        ))}
      </div>
    </BottomSheetModal>
  );
}
