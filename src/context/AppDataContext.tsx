import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import type {
  AppNotification, BackupPayload, BudgetMap, Loan, RecurringTemplate,
  Settings, Streak, Transaction, TxType,
} from '@/types';
import { STORAGE_KEYS, readJSON, writeJSON } from '@/utils/storage';
import { calculateCycleStr, getLocalISODate, monthLabel } from '@/utils/date';

const DEFAULT_SETTINGS: Settings = {
  theme: 'midnight',
  currency: 'MMK',
  displayName: 'Admin',
  joined: '',
  avatar: '',
  payday: 1,
  yearMode: 'calendar',
  piggyBank: 0,
  chartType: 'bar',
};

const DEFAULT_STREAK: Streak = { count: 0, date: '', restores: 3, month: new Date().getMonth() };

function defaultRecurringTemplates(): RecurringTemplate[] {
  return [
    { id: `${Date.now()}1`, title: 'Internet', amount: 12000, cat: 'Bills', icon: 'fa-wifi', kind: 'exp' },
    { id: `${Date.now()}2`, title: 'Breakfast', amount: 2500, cat: 'Food', icon: 'fa-coffee', kind: 'exp' },
    { id: `${Date.now()}3`, title: 'Snacks', amount: 1500, cat: 'Food', icon: 'fa-cookie', kind: 'exp' },
  ];
}

interface NewTxInput {
  id?: string;
  type: TxType;
  amount: number;
  title: string;
  date: string;
  note?: string;
  category?: string;
  payType?: string;
}

interface AppDataContextValue {
  tx: Transaction[];
  settings: Settings;
  budgets: BudgetMap;
  notifications: AppNotification[];
  recurringTemplates: RecurringTemplate[];
  loans: Loan[];
  streak: Streak;
  setStreak: React.Dispatch<React.SetStateAction<Streak>>;
  customIconsMap: Record<string, string>;

  currentMonthStr: string;
  setCurrentMonthStr: (m: string) => void;
  currentHistMonth: string | null;
  setCurrentHistMonth: (m: string | null) => void;
  availableMonths: string[];

  saveTransaction: (input: NewTxInput) => { ok: boolean; reason?: string };
  deleteTransaction: (id: string) => Transaction | null;
  restoreTransaction: (tx: Transaction) => void;
  duplicateTransaction: (id: string) => void;

  savePiggy: (amount: number) => { ok: boolean; reason?: string };
  withdrawPiggy: () => void;

  addLoan: (title: string, amount: number, due: string) => { ok: boolean; reason?: string };
  markLoanPaid: (id: string) => void;
  deleteLoan: (id: string) => void;

  saveCategoryBudget: (category: string, amount: number) => { ok: boolean; reason?: string };

  addNotification: (message: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotificationsAt: (indices: number[]) => void;
  clearNotifications: () => void;

  saveRecurringTemplate: (t: Omit<RecurringTemplate, 'id'> & { id?: string }) => { ok: boolean; reason?: string };
  deleteRecurringTemplate: (id: string) => void;
  useRecurringTemplate: (t: RecurringTemplate) => void;

  updateSettings: (partial: Partial<Settings>) => void;
  setTheme: (theme: Settings['theme']) => void;
  setDisplayName: (name: string) => void;
  setAvatar: (dataUrl: string) => void;
  setPayday: (day: number) => void;

  clearAllData: () => void;
  exportBackup: () => string;
  importBackup: (json: string) => { ok: boolean; reason?: string };

  registerCustomCategoryIcon: (category: string, icon: string) => void;
  getCustomIcon: (category: string) => string | undefined;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [tx, setTx] = useState<Transaction[]>(() => readJSON(STORAGE_KEYS.tx, []));
  const [settings, setSettings] = useState<Settings>(() => {
    const loaded = readJSON<Partial<Settings>>(STORAGE_KEYS.settings, {});
    const merged = { ...DEFAULT_SETTINGS, ...loaded };
    if (!merged.joined) merged.joined = monthLabel(new Date());
    return merged;
  });
  const [budgets, setBudgets] = useState<BudgetMap>(() => readJSON(STORAGE_KEYS.budgets, {}));
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    readJSON(STORAGE_KEYS.notifications, []));
  const [recurringTemplates, setRecurringTemplates] = useState<RecurringTemplate[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.recurringTemplates);
    if (stored) {
      const parsed = JSON.parse(stored) as RecurringTemplate[];
      // Older saves may not have `kind` — default them to expense.
      return parsed.map((t) => ({ kind: 'exp', ...t }));
    }
    return defaultRecurringTemplates();
  });
  const [loans, setLoans] = useState<Loan[]>(() => readJSON(STORAGE_KEYS.loans, []));
  const [streak, setStreak] = useState<Streak>(() => readJSON(STORAGE_KEYS.streak, DEFAULT_STREAK));
  const [customIconsMap, setCustomIconsMap] = useState<Record<string, string>>(() =>
    readJSON(STORAGE_KEYS.customIcons, {}));

  const [currentMonthStr, setCurrentMonthStr] = useState<string>(() =>
    calculateCycleStr(new Date(), settings.payday));
  const [currentHistMonth, setCurrentHistMonth] = useState<string | null>(null);

  // --- persistence: write-through on every change ---
  useEffect(() => writeJSON(STORAGE_KEYS.tx, tx), [tx]);
  useEffect(() => writeJSON(STORAGE_KEYS.settings, settings), [settings]);
  useEffect(() => writeJSON(STORAGE_KEYS.budgets, budgets), [budgets]);
  useEffect(() => writeJSON(STORAGE_KEYS.notifications, notifications), [notifications]);
  useEffect(() => writeJSON(STORAGE_KEYS.recurringTemplates, recurringTemplates), [recurringTemplates]);
  useEffect(() => writeJSON(STORAGE_KEYS.loans, loans), [loans]);
  useEffect(() => writeJSON(STORAGE_KEYS.streak, streak), [streak]);
  useEffect(() => writeJSON(STORAGE_KEYS.customIcons, customIconsMap), [customIconsMap]);

  const availableMonths = useMemo(() => {
    const set = new Set(tx.map((t) => t.monthStr));
    set.add(currentMonthStr);
    return Array.from(set).sort().reverse();
  }, [tx, currentMonthStr]);

  const addNotification = useCallback((message: string) => {
    setNotifications((prev) => {
      const recent = prev[0];
      if (recent && recent.message === message && recent.unread) return prev;
      const next: AppNotification = { message, time: new Date().toLocaleString(), unread: true };
      const updated = [next, ...prev];
      return updated.length > 30 ? updated.slice(0, 30) : updated;
    });
  }, []);

  const saveTransaction = useCallback((input: NewTxInput) => {
    if (!input.amount || input.amount <= 0) return { ok: false, reason: 'Enter a valid amount' };
    const dateObj = new Date(input.date);
    const monthStr = calculateCycleStr(dateObj, settings.payday);
    const record: Transaction = {
      id: input.id || Date.now().toString(),
      type: input.type,
      amount: input.amount,
      title: input.title,
      date: input.date,
      note: input.note,
      monthStr,
      category: input.category,
      payType: input.payType,
    };

    if (record.type === 'exp' && record.category && budgets[record.category]) {
      const spent = tx
        .filter((t) => t.id !== record.id && t.type === 'exp' && t.category === record.category && t.monthStr === monthStr)
        .reduce((s, t) => s + t.amount, 0);
      if (spent + record.amount > budgets[record.category]) {
        addNotification(
          `Budget Exceeded: [${record.category}] went over the limit of ${budgets[record.category]}!`,
        );
      }
    }

    setTx((prev) => {
      const idx = prev.findIndex((t) => t.id === record.id);
      const next = idx >= 0 ? prev.map((t, i) => (i === idx ? record : t)) : [...prev, record];
      return next.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });

    return { ok: true };
  }, [settings.payday, budgets, tx, addNotification]);

  const deleteTransaction = useCallback((id: string) => {
    let removed: Transaction | null = null;
    setTx((prev) => {
      removed = prev.find((t) => t.id === id) ?? null;
      return prev.filter((t) => t.id !== id);
    });
    return removed;
  }, []);

  const restoreTransaction = useCallback((restored: Transaction) => {
    setTx((prev) => {
      const next = [...prev, restored];
      return next.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  }, []);

  const duplicateTransaction = useCallback((id: string) => {
    setTx((prev) => {
      const found = prev.find((t) => t.id === id);
      if (!found) return prev;
      const d = new Date();
      const copy: Transaction = {
        ...found,
        id: Date.now().toString(),
        date: getLocalISODate(d),
        monthStr: calculateCycleStr(d, settings.payday),
      };
      return [...prev, copy].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  }, [settings.payday]);

  const savePiggy = useCallback((amount: number) => {
    if (!amount || amount <= 0) return { ok: false, reason: 'Enter a valid amount' };
    setSettings((prev) => ({ ...prev, piggyBank: (prev.piggyBank || 0) + amount }));
    return { ok: true };
  }, []);

  const withdrawPiggy = useCallback(() => {
    setSettings((prev) => ({ ...prev, piggyBank: 0 }));
  }, []);

  const addLoan = useCallback((title: string, amount: number, due: string) => {
    if (!title || !amount || !due) return { ok: false, reason: 'Fill all fields' };
    setLoans((prev) => [...prev, { id: Date.now().toString(), title, amount, due, paid: false }]);
    return { ok: true };
  }, []);

  const markLoanPaid = useCallback((id: string) => {
    setLoans((prev) => prev.map((l) => (l.id === id ? { ...l, paid: true } : l)));
  }, []);

  const deleteLoan = useCallback((id: string) => {
    setLoans((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const saveCategoryBudget = useCallback((category: string, amount: number) => {
    if (!amount || amount <= 0) return { ok: false, reason: 'Enter a valid target threshold' };
    setBudgets((prev) => ({ ...prev, [category]: amount }));
    return { ok: true };
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  const deleteNotificationsAt = useCallback((indices: number[]) => {
    setNotifications((prev) => {
      const toRemove = new Set(indices);
      return prev.filter((_, i) => !toRemove.has(i));
    });
  }, []);

  const clearNotifications = useCallback(() => setNotifications([]), []);

  const saveRecurringTemplate = useCallback(
    (t: Omit<RecurringTemplate, 'id'> & { id?: string }) => {
      if (!t.title.trim() || !t.amount || t.amount <= 0) {
        return { ok: false, reason: 'Please provide a valid label name and amount.' };
      }
      setRecurringTemplates((prev) => {
        if (t.id) {
          const idx = prev.findIndex((x) => x.id === t.id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = { ...t, id: t.id } as RecurringTemplate;
            return next;
          }
        }
        return [...prev, { ...t, id: Date.now().toString() } as RecurringTemplate];
      });
      return { ok: true };
    },
    [],
  );

  const deleteRecurringTemplate = useCallback((id: string) => {
    setRecurringTemplates((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const useRecurringTemplate = useCallback((t: RecurringTemplate) => {
    const dateObj = new Date();
    saveTransaction({
      type: t.kind,
      amount: t.amount,
      title: t.title,
      category: t.kind === 'exp' ? t.cat : undefined,
      payType: t.kind === 'exp' ? 'Card' : undefined,
      date: getLocalISODate(dateObj),
      note: 'Auto added from quick template',
    });
  }, [saveTransaction]);

  const updateSettings = useCallback((partial: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const setTheme = useCallback((theme: Settings['theme']) => {
    setSettings((prev) => ({ ...prev, theme }));
  }, []);

  const setDisplayName = useCallback((name: string) => {
    setSettings((prev) => ({ ...prev, displayName: name }));
  }, []);

  const setAvatar = useCallback((dataUrl: string) => {
    setSettings((prev) => ({ ...prev, avatar: dataUrl }));
  }, []);

  const setPayday = useCallback((day: number) => {
    setSettings((prev) => ({ ...prev, payday: day }));
    setCurrentMonthStr(calculateCycleStr(new Date(), day));
  }, []);

  const clearAllData = useCallback(() => {
    setTx([]);
    setNotifications([]);
    setLoans([]);
    setBudgets({});
    setSettings((prev) => ({ ...prev, piggyBank: 0 }));
  }, []);

  const exportBackup = useCallback((): string => {
    const payload: BackupPayload = {
      version: 2,
      exportedAt: new Date().toISOString(),
      data: { tx, settings, budgets, notifications, recurringTemplates, loans, streak, customIconsMap },
    };
    return JSON.stringify(payload, null, 2);
  }, [tx, settings, budgets, notifications, recurringTemplates, loans, streak, customIconsMap]);

  const importBackup = useCallback((json: string) => {
    try {
      const parsed = JSON.parse(json) as BackupPayload;
      if (!parsed || !parsed.data || !Array.isArray(parsed.data.tx)) {
        return { ok: false, reason: 'This file is not a valid Finance Tracker backup.' };
      }
      const d = parsed.data;
      setTx(d.tx ?? []);
      setSettings({ ...DEFAULT_SETTINGS, ...d.settings });
      setBudgets(d.budgets ?? {});
      setNotifications(d.notifications ?? []);
      setRecurringTemplates(d.recurringTemplates?.length ? d.recurringTemplates : defaultRecurringTemplates());
      setLoans(d.loans ?? []);
      setStreak(d.streak ?? DEFAULT_STREAK);
      setCustomIconsMap(d.customIconsMap ?? {});
      return { ok: true };
    } catch {
      return { ok: false, reason: 'Could not read this file. Make sure it is a valid backup.' };
    }
  }, []);

  const registerCustomCategoryIcon = useCallback((category: string, icon: string) => {
    setCustomIconsMap((prev) => ({ ...prev, [category]: icon }));
  }, []);

  const getCustomIcon = useCallback((category: string) => customIconsMap[category], [customIconsMap]);

  const value: AppDataContextValue = {
    tx, settings, budgets, notifications, recurringTemplates, loans, streak, setStreak, customIconsMap,
    currentMonthStr, setCurrentMonthStr, currentHistMonth, setCurrentHistMonth, availableMonths,
    saveTransaction, deleteTransaction, restoreTransaction, duplicateTransaction,
    savePiggy, withdrawPiggy,
    addLoan, markLoanPaid, deleteLoan,
    saveCategoryBudget,
    addNotification, markAllNotificationsRead, deleteNotificationsAt, clearNotifications,
    saveRecurringTemplate, deleteRecurringTemplate, useRecurringTemplate,
    updateSettings, setTheme, setDisplayName, setAvatar, setPayday,
    clearAllData, exportBackup, importBackup,
    registerCustomCategoryIcon, getCustomIcon,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
