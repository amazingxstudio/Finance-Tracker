import { ICON_PICKER_OPTIONS } from '@/utils/icons';

interface IconPickerGridProps {
  value: string;
  onChange: (icon: string) => void;
}

export default function IconPickerGrid({ value, onChange }: IconPickerGridProps) {
  return (
    <div className="icon-selection-grid">
      {ICON_PICKER_OPTIONS.map((ic) => (
        <div
          key={ic}
          className={`icon-select-item ${value === ic ? 'selected' : ''}`}
          onClick={() => onChange(ic)}
        >
          <i className={`fas ${ic}`} />
        </div>
      ))}
    </div>
  );
}
