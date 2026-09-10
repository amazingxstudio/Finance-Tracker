import { useEffect, useState } from 'react';
import BottomSheetModal from '@/components/common/BottomSheetModal';
import SelectSheet from '@/components/common/SelectSheet';
import DatePickerSheet from '@/components/common/DatePickerSheet';
import IconPickerGrid from '@/components/common/IconPickerGrid';
import { useModal } from '@/context/ModalContext';
import { useAppData } from '@/context/AppDataContext';
import { useUi } from '@/context/UiContext';
import { EXPENSE_CATEGORIES, INCOME_TYPES, PAYMENT_TYPES } from '@/utils/icons';
import { getLocalISODate } from '@/utils/date';
import type { TxType } from '@/types';

export default function TransactionFormModal() {
  const { activeModal, params, closeModal } = useModal();
  const { tx, saveTransaction, registerCustomCategoryIcon, getCustomIcon } = useAppData();
  const { showAlert, showPrompt } = useUi();

  const kind: TxType = activeModal === 'income-form' ? 'inc' : 'exp';
  const isOpen = activeModal === 'income-form' || activeModal === 'expense-form';
  const editId = params.editId as string | undefined;

  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(getLocalISODate());
  const [note, setNote] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0].value);
  const [payType, setPayType] = useState(PAYMENT_TYPES[0]);

  const [dateOpen, setDateOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [payTypeOpen, setPayTypeOpen] = useState(false);
  const [sourceOpen, setSourceOpen] = useState(false);
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [pendingCategoryName, setPendingCategoryName] = useState('');
  const [pendingIcon, setPendingIcon] = useState('fa-tag');

  useEffect(() => {
    if (!isOpen) return;
    if (editId) {
      const found = tx.find((t) => t.id === editId);
      if (found) {
        setAmount(String(found.amount));
        setTitle(found.title);
        setDate(found.date);
        setNote(found.note ?? '');
        if (found.category) setCategory(found.category);
        if (found.payType) setPayType(found.payType);
        return;
      }
    }
    setAmount('');
    setTitle('');
    setDate(getLocalISODate());
    setNote('');
    setCategory(EXPENSE_CATEGORIES[0].value);
    setPayType(PAYMENT_TYPES[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editId, kind]);

  function handleSubmit() {
    const result = saveTransaction({
      id: editId,
      type: kind,
      amount: Number(amount),
      title: title.trim() || (kind === 'inc' ? 'Income' : 'Expense'),
      date,
      note: note.trim() || undefined,
      category: kind === 'exp' ? category : undefined,
      payType: kind === 'exp' ? payType : undefined,
    });
    if (!result.ok) {
      showAlert('Cannot Save', result.reason ?? 'Please check the form.', 'error');
      return;
    }
    closeModal();
  }

  async function handleCreateCustomCategory() {
    const name = await showPrompt('New Category', 'Enter a name for the custom category');
    if (!name || !name.trim()) return;
    setPendingCategoryName(name.trim());
    setPendingIcon('fa-tag');
    setCategoryOpen(false);
    setIconPickerOpen(true);
  }

  function confirmCustomCategoryIcon() {
    registerCustomCategoryIcon(pendingCategoryName, pendingIcon);
    setCategory(pendingCategoryName);
    setIconPickerOpen(false);
  }

  const categoryOptions = [
    ...EXPENSE_CATEGORIES.map((c) => ({ value: c.value, label: c.value, icon: getCustomIcon(c.value) ?? c.icon })),
    { value: '__custom__', label: '+ Create Custom Category', accent: true },
  ];

  return (
    <>
      <BottomSheetModal
        isOpen={isOpen}
        title={`${editId ? 'Edit' : 'Add'} ${kind === 'inc' ? 'Income' : 'Expense'}`}
        onClose={closeModal}
      >
        <div className="input-group">
          <label>Amount</label>
          <input
            type="number"
            inputMode="decimal"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            autoFocus
          />
        </div>

        <div className="input-group">
          <label>{kind === 'inc' ? 'Source' : 'Title'}</label>
          {kind === 'inc' ? (
            <button className="custom-select-box" onClick={() => setSourceOpen(true)}>
              <span>{title || 'Select or type a source'}</span>
              <i className="fas fa-chevron-down" />
            </button>
          ) : null}
          <input
            type="text"
            placeholder={kind === 'inc' ? 'e.g. Salary' : 'e.g. Lunch with friends'}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {kind === 'exp' && (
          <>
            <div className="input-group">
              <label>Category</label>
              <button className="custom-select-box" onClick={() => setCategoryOpen(true)}>
                <span><i className={`fas ${getCustomIcon(category) ?? 'fa-tag'}`} style={{ marginRight: 8 }} />{category}</span>
                <i className="fas fa-chevron-down" />
              </button>
            </div>
            <div className="input-group">
              <label>Payment Type</label>
              <button className="custom-select-box" onClick={() => setPayTypeOpen(true)}>
                <span>{payType}</span>
                <i className="fas fa-chevron-down" />
              </button>
            </div>
          </>
        )}

        <div className="input-group">
          <label>Date</label>
          <input type="text" readOnly value={date} onClick={() => setDateOpen(true)} />
        </div>

        <div className="input-group">
          <label>Note (optional)</label>
          <input type="text" placeholder="Add a note" value={note} onChange={(e) => setNote(e.target.value)} />
        </div>

        <button className="btn btn-primary" onClick={handleSubmit}>
          <i className="fas fa-check" /> {editId ? 'Save Changes' : 'Add Transaction'}
        </button>
      </BottomSheetModal>

      <DatePickerSheet isOpen={dateOpen} value={date} onSelect={setDate} onClose={() => setDateOpen(false)} />

      <SelectSheet
        isOpen={categoryOpen}
        title="Select Category"
        options={categoryOptions}
        onSelect={(val) => {
          if (val === '__custom__') {
            handleCreateCustomCategory();
            return;
          }
          setCategory(val);
          setCategoryOpen(false);
        }}
        onClose={() => setCategoryOpen(false)}
      />

      <SelectSheet
        isOpen={payTypeOpen}
        title="Payment Type"
        options={PAYMENT_TYPES.map((p) => ({ value: p, label: p }))}
        onSelect={(val) => { setPayType(val); setPayTypeOpen(false); }}
        onClose={() => setPayTypeOpen(false)}
      />

      <SelectSheet
        isOpen={sourceOpen}
        title="Income Source"
        options={INCOME_TYPES.map((s) => ({ value: s, label: s }))}
        onSelect={(val) => { setTitle(val); setSourceOpen(false); }}
        onClose={() => setSourceOpen(false)}
      />

      <BottomSheetModal isOpen={iconPickerOpen} title={`Icon for "${pendingCategoryName}"`} onClose={() => setIconPickerOpen(false)}>
        <IconPickerGrid value={pendingIcon} onChange={setPendingIcon} />
        <button className="btn btn-primary" style={{ marginTop: 18 }} onClick={confirmCustomCategoryIcon}>
          <i className="fas fa-check" /> Use This Icon
        </button>
      </BottomSheetModal>
    </>
  );
}
