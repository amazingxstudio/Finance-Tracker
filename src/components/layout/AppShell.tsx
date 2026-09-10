import type { ReactNode } from 'react';
import type { PageId } from './navConfig';
import TopHeader from './TopHeader';
import BottomNav from './BottomNav';
import Fab from './Fab';
import SideNav from './SideNav';
import DesktopTopBar from './DesktopTopBar';
import PageTransition from '@/components/common/PageTransition';
import ModalManager from '@/components/modals/ModalManager';
import Dialogs from '@/components/common/Dialogs';
import Toast from '@/components/common/Toast';
import { useIsDesktop } from '@/hooks/useMediaQuery';
import { useAppData } from '@/context/AppDataContext';

const PAGE_TITLES: Record<PageId, string> = {
  dashboard: 'Dashboard',
  income: 'Income',
  expense: 'Expense',
  history: 'History',
  profile: 'Profile',
};

interface AppShellProps {
  activePage: PageId;
  onNavigate: (id: PageId) => void;
  children: ReactNode;
}

export default function AppShell({ activePage, onNavigate, children }: AppShellProps) {
  const isDesktop = useIsDesktop();
  const { settings } = useAppData();

  const title = activePage === 'dashboard' ? `Hi, ${settings.displayName.split(' ')[0]}` : PAGE_TITLES[activePage];

  if (isDesktop) {
    return (
      <div className="app-shell is-desktop">
        <SideNav active={activePage} onNavigate={onNavigate} />
        <div className="desktop-main-col">
          <DesktopTopBar title={title} showMonthPill={activePage === 'dashboard'} />
          <div className="desktop-content">
            <PageTransition transitionKey={activePage}>{children}</PageTransition>
          </div>
        </div>
        <ModalManager />
        <Dialogs />
        <Toast />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <TopHeader title={title} showMonthPill={activePage === 'dashboard'} />
      <main className="main-content">
        <PageTransition transitionKey={activePage}>{children}</PageTransition>
      </main>
      <Fab />
      <BottomNav active={activePage} onNavigate={onNavigate} />
      <ModalManager />
      <Dialogs />
      <Toast />
    </div>
  );
}
