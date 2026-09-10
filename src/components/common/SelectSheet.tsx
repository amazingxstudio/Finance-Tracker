import BottomSheetModal from './BottomSheetModal';

export interface SelectSheetOption {
  value: string;
  label: string;
  icon?: string;
  accent?: boolean; // renders like the "Create Custom..." primary-colored option
}

interface SelectSheetProps {
  isOpen: boolean;
  title: string;
  options: SelectSheetOption[];
  onSelect: (value: string) => void;
  onClose: () => void;
}

export default function SelectSheet({ isOpen, title, options, onSelect, onClose }: SelectSheetProps) {
  return (
    <BottomSheetModal isOpen={isOpen} title={title} onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 400, overflowY: 'auto' }}>
        {options.map((opt) => (
          <button
            key={opt.value}
            className="theme-option"
            style={opt.accent ? { color: 'var(--primary-color)', borderColor: 'var(--primary-color)' } : undefined}
            onClick={() => onSelect(opt.value)}
          >
            {opt.icon && <i className={`fas ${opt.icon}`} style={{ width: 20, textAlign: 'center' }} />}
            {opt.label}
          </button>
        ))}
      </div>
    </BottomSheetModal>
  );
}
