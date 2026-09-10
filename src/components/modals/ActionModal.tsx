import BottomSheetModal from '@/components/common/BottomSheetModal';
import { useModal } from '@/context/ModalContext';

const ACTIONS: { id: string; label: string; icon: string; modal: import('@/context/ModalContext').ModalId }[] = [
  { id: 'inc', label: 'Add Income', icon: 'fa-arrow-down', modal: 'income-form' },
  { id: 'exp', label: 'Add Expense', icon: 'fa-arrow-up', modal: 'expense-form' },
  { id: 'piggy', label: 'Piggy Bank', icon: 'fa-piggy-bank', modal: 'piggy' },
  { id: 'loan', label: 'Loans', icon: 'fa-hand-holding-dollar', modal: 'loans' },
  { id: 'budget', label: 'Budgets', icon: 'fa-chart-pie', modal: 'budget' },
  { id: 'recurring', label: 'Templates', icon: 'fa-repeat', modal: 'recurring-setup' },
];

export default function ActionModal() {
  const { activeModal, openModal, closeModal } = useModal();

  return (
    <BottomSheetModal isOpen={activeModal === 'action'} title="Quick Actions" onClose={closeModal}>
      <div className="action-grid">
        {ACTIONS.map((a) => (
          <div key={a.id} className="action-card" onClick={() => openModal(a.modal)}>
            <i className={`fas ${a.icon}`} style={{ color: 'var(--primary-color)' }} />
            <div>{a.label}</div>
          </div>
        ))}
      </div>
    </BottomSheetModal>
  );
}
