import ActionModal from './ActionModal';
import TransactionFormModal from './TransactionFormModal';
import TxDetailModal from './TxDetailModal';
import PiggyModal from './PiggyModal';
import { LoansModal, AddLoanModal } from './LoanModals';
import BudgetModal from './BudgetModal';
import RecurringSetupModal from './RecurringSetupModal';
import MonthModal from './MonthModal';
import NotificationsModal from './NotificationsModal';
import AboutModal from './AboutModal';
import StreakInfoModal from './StreakInfoModal';
import BackupRestoreModal from './BackupRestoreModal';
import SettingsSelectSheets from './SettingsSelectSheets';

export default function ModalManager() {
  return (
    <>
      <ActionModal />
      <TransactionFormModal />
      <TxDetailModal />
      <PiggyModal />
      <LoansModal />
      <AddLoanModal />
      <BudgetModal />
      <RecurringSetupModal />
      <MonthModal />
      <NotificationsModal />
      <AboutModal />
      <StreakInfoModal />
      <BackupRestoreModal />
      <SettingsSelectSheets />
    </>
  );
}
