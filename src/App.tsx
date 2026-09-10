import { useEffect, useState } from 'react';
import { AppDataProvider, useAppData } from '@/context/AppDataContext';
import { UiProvider } from '@/context/UiContext';
import { ModalProvider } from '@/context/ModalContext';
import AppShell from '@/components/layout/AppShell';
import Dashboard from '@/pages/Dashboard';
import Income from '@/pages/Income';
import Expense from '@/pages/Expense';
import History from '@/pages/History';
import Profile from '@/pages/Profile';
import { useStreakCheck } from '@/hooks/useStreakCheck';
import { useSmartAlerts } from '@/hooks/useSmartAlerts';
import type { PageId } from '@/components/layout/navConfig';

function PageOutlet({ page }: { page: PageId }) {
  switch (page) {
    case 'dashboard': return <Dashboard />;
    case 'income': return <Income />;
    case 'expense': return <Expense />;
    case 'history': return <History />;
    case 'profile': return <Profile />;
    default: return null;
  }
}

function ThemeSync() {
  const { settings } = useAppData();
  useEffect(() => {
    document.body.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);
  return null;
}

function AppContent() {
  const [page, setPage] = useState<PageId>('dashboard');
  useStreakCheck();
  useSmartAlerts();

  return (
    <div className="app-root">
      <ThemeSync />
      <AppShell activePage={page} onNavigate={setPage}>
        <PageOutlet page={page} />
      </AppShell>
    </div>
  );
}

export default function App() {
  return (
    <AppDataProvider>
      <UiProvider>
        <ModalProvider>
          <AppContent />
        </ModalProvider>
      </UiProvider>
    </AppDataProvider>
  );
}
