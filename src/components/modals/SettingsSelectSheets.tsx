import SelectSheet from '@/components/common/SelectSheet';
import { useModal } from '@/context/ModalContext';
import { useAppData } from '@/context/AppDataContext';
import { ordinal } from '@/utils/date';
import type { Currency, YearMode } from '@/types';

const CURRENCIES: { value: Currency; label: string }[] = [
  { value: 'MMK', label: 'Myanmar Kyat (Ks)' },
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'EUR', label: 'Euro (\u20ac)' },
];

const PAYDAY_OPTIONS = [1, 5, 10, 15, 20, 25].map((d) => ({ value: String(d), label: `${ordinal(d)} of the month` }));

const YEAR_MODES: { value: YearMode; label: string }[] = [
  { value: 'calendar', label: 'Calendar Year (Jan - Dec)' },
  { value: 'install', label: 'Since I started using the app' },
];

export default function SettingsSelectSheets() {
  const { activeModal, closeModal } = useModal();
  const { updateSettings, setPayday } = useAppData();

  return (
    <>
      <SelectSheet
        isOpen={activeModal === 'select-currency'}
        title="Select Currency"
        options={CURRENCIES}
        onSelect={(val) => { updateSettings({ currency: val as Currency }); closeModal(); }}
        onClose={closeModal}
      />
      <SelectSheet
        isOpen={activeModal === 'select-payday'}
        title="Select Payday"
        options={PAYDAY_OPTIONS}
        onSelect={(val) => { setPayday(Number(val)); closeModal(); }}
        onClose={closeModal}
      />
      <SelectSheet
        isOpen={activeModal === 'select-year-mode'}
        title="Yearly Report Range"
        options={YEAR_MODES}
        onSelect={(val) => { updateSettings({ yearMode: val as YearMode }); closeModal(); }}
        onClose={closeModal}
      />
    </>
  );
}
