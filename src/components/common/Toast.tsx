import { useUi } from '@/context/UiContext';

export default function Toast() {
  const { toast, dismissToast } = useUi();
  if (!toast) return null;

  return (
    <div className="toast">
      <span>{toast.message}</span>
      {toast.actionLabel && toast.onAction && (
        <button
          className="toast-action"
          onClick={() => {
            toast.onAction?.();
            dismissToast();
          }}
        >
          {toast.actionLabel}
        </button>
      )}
    </div>
  );
}
