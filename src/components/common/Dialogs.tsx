import { useState } from 'react';
import { useUi } from '@/context/UiContext';

function iconFor(kind: 'info' | 'success' | 'error') {
  if (kind === 'error') return { cls: 'fa-exclamation-circle', color: 'var(--danger-color)' };
  if (kind === 'success') return { cls: 'fa-check-circle', color: 'var(--success-color)' };
  return { cls: 'fa-info-circle', color: 'var(--primary-color)' };
}

export default function Dialogs() {
  const {
    alertState, closeAlert,
    confirmState, resolveConfirm,
    promptState, resolvePrompt,
  } = useUi();


  return (
    <>
      <div className={`dialog-overlay ${alertState ? 'active' : ''}`}>
        {alertState && (
          <div className="dialog-box">
            {!alertState.hideIcon && (
              <div className="dialog-icon">
                <i className={`fas ${iconFor(alertState.kind).cls}`} style={{ color: iconFor(alertState.kind).color }} />
              </div>
            )}
            <div className="dialog-title">{alertState.title}</div>
            <div className="dialog-msg">{alertState.message}</div>
            <div className="dialog-btn-row">
              <button className="dialog-btn" onClick={closeAlert}>OK</button>
            </div>
          </div>
        )}
      </div>

      <div className={`dialog-overlay ${confirmState ? 'active' : ''}`}>
        {confirmState && (
          <div className="dialog-box">
            <div className="dialog-icon">
              <i className="fas fa-question-circle" style={{ color: 'var(--warning-color)' }} />
            </div>
            <div className="dialog-title">{confirmState.title}</div>
            <div className="dialog-msg" style={{ textAlign: 'center' }}>{confirmState.message}</div>
            <div className="dialog-btn-row">
              <button className="dialog-btn secondary" onClick={() => resolveConfirm(false)}>Cancel</button>
              <button
                className={`dialog-btn ${confirmState.danger ? 'danger' : ''}`}
                onClick={() => resolveConfirm(true)}
              >
                Yes
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={`dialog-overlay ${promptState ? 'active' : ''}`}>
        {promptState && (
          // Keying on the title+message forces a fresh mount (and therefore a
          // fresh local `value` state seeded from defaultValue) each time a
          // new prompt is opened, without any render-phase side effects.
          <PromptBody
            key={`${promptState.title}:${promptState.message}`}
            title={promptState.title}
            message={promptState.message}
            defaultValue={promptState.defaultValue ?? ''}
            onResolve={resolvePrompt}
          />
        )}
      </div>
    </>
  );
}

function PromptBody({
  title, message, defaultValue, onResolve,
}: {
  title: string;
  message: string;
  defaultValue: string;
  onResolve: (v: string | null) => void;
}) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className="dialog-box">
      <div className="dialog-title">{title}</div>
      {message && <div className="dialog-msg" style={{ textAlign: 'center' }}>{message}</div>}
      <input
        className="dialog-input"
        type="text"
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') onResolve(value); }}
      />
      <div className="dialog-btn-row">
        <button className="dialog-btn secondary" onClick={() => onResolve(null)}>Cancel</button>
        <button className="dialog-btn" onClick={() => onResolve(value)}>OK</button>
      </div>
    </div>
  );
}
