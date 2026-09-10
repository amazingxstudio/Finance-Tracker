import React, {
  createContext, useCallback, useContext, useRef, useState,
} from 'react';

export type AlertKind = 'info' | 'success' | 'error';

interface AlertState {
  title: string;
  message: React.ReactNode;
  kind: AlertKind;
  hideIcon?: boolean;
}

interface ConfirmState {
  title: string;
  message: React.ReactNode;
  danger?: boolean;
}

interface PromptState {
  title: string;
  message: string;
  defaultValue?: string;
}

interface ToastState {
  id: number;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface UiContextValue {
  alertState: AlertState | null;
  showAlert: (title: string, message: React.ReactNode, kind?: AlertKind, hideIcon?: boolean) => void;
  closeAlert: () => void;

  confirmState: ConfirmState | null;
  showConfirm: (title: string, message: React.ReactNode, danger?: boolean) => Promise<boolean>;
  resolveConfirm: (value: boolean) => void;

  promptState: PromptState | null;
  showPrompt: (title: string, message: string, defaultValue?: string) => Promise<string | null>;
  resolvePrompt: (value: string | null) => void;

  toast: ToastState | null;
  showToast: (message: string, opts?: { actionLabel?: string; onAction?: () => void }) => void;
  dismissToast: () => void;
}

const UiContext = createContext<UiContextValue | null>(null);

export function UiProvider({ children }: { children: React.ReactNode }) {
  const [alertState, setAlertState] = useState<AlertState | null>(null);
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);
  const [promptState, setPromptState] = useState<PromptState | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  const confirmResolver = useRef<((v: boolean) => void) | null>(null);
  const promptResolver = useRef<((v: string | null) => void) | null>(null);
  const toastTimer = useRef<number | null>(null);

  const showAlert = useCallback((title: string, message: React.ReactNode, kind: AlertKind = 'info', hideIcon = false) => {
    setAlertState({ title, message, kind, hideIcon });
  }, []);
  const closeAlert = useCallback(() => setAlertState(null), []);

  const showConfirm = useCallback((title: string, message: React.ReactNode, danger = false) => {
    setConfirmState({ title, message, danger });
    return new Promise<boolean>((resolve) => {
      confirmResolver.current = resolve;
    });
  }, []);
  const resolveConfirm = useCallback((value: boolean) => {
    setConfirmState(null);
    confirmResolver.current?.(value);
    confirmResolver.current = null;
  }, []);

  const showPrompt = useCallback((title: string, message: string, defaultValue = '') => {
    setPromptState({ title, message, defaultValue });
    return new Promise<string | null>((resolve) => {
      promptResolver.current = resolve;
    });
  }, []);
  const resolvePrompt = useCallback((value: string | null) => {
    setPromptState(null);
    promptResolver.current?.(value);
    promptResolver.current = null;
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
  }, []);

  const showToast = useCallback((message: string, opts?: { actionLabel?: string; onAction?: () => void }) => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    const id = Date.now();
    setToast({ id, message, actionLabel: opts?.actionLabel, onAction: opts?.onAction });
    toastTimer.current = window.setTimeout(() => {
      setToast((cur) => (cur?.id === id ? null : cur));
    }, 4000);
  }, []);

  const value: UiContextValue = {
    alertState, showAlert, closeAlert,
    confirmState, showConfirm, resolveConfirm,
    promptState, showPrompt, resolvePrompt,
    toast, showToast, dismissToast,
  };

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi(): UiContextValue {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error('useUi must be used within UiProvider');
  return ctx;
}
