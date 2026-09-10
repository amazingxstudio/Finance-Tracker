// Storage keys are kept identical to the original app so anyone who already
// has data saved in their browser at the same origin keeps it after this
// rewrite — nothing is lost when upgrading.
export const STORAGE_KEYS = {
  tx: 'sm_tx',
  settings: 'sm_settings',
  budgets: 'sm_budgets',
  notifications: 'sm_notifications',
  recurringTemplates: 'sm_recurring_templates',
  loans: 'sm_loans',
  streak: 'sm_streak',
  customIcons: 'sm_custom_icons',
} as const;

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can fail (quota, private mode) — fail silently, the in-memory
    // state still works for the rest of the session.
  }
}
