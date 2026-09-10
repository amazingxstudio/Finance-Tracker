import React, { createContext, useCallback, useContext, useState } from 'react';

export type ModalId =
  | 'action' | 'income-form' | 'expense-form' | 'tx-detail'
  | 'piggy' | 'loans' | 'add-loan'
  | 'budget'
  | 'recurring-setup'
  | 'month-picker'
  | 'notifications' | 'about' | 'streak-info'
  | 'backup-restore'
  | 'select-currency' | 'select-payday' | 'select-year-mode';

interface ModalContextValue {
  activeModal: ModalId | null;
  params: Record<string, unknown>;
  openModal: (id: ModalId, params?: Record<string, unknown>) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [activeModal, setActiveModal] = useState<ModalId | null>(null);
  const [params, setParams] = useState<Record<string, unknown>>({});

  const openModal = useCallback((id: ModalId, p: Record<string, unknown> = {}) => {
    setParams(p);
    setActiveModal(id);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  return (
    <ModalContext.Provider value={{ activeModal, params, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal(): ModalContextValue {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used within ModalProvider');
  return ctx;
}
