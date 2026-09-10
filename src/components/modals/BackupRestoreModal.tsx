import { useRef } from 'react';
import BottomSheetModal from '@/components/common/BottomSheetModal';
import { useModal } from '@/context/ModalContext';
import { useAppData } from '@/context/AppDataContext';
import { useUi } from '@/context/UiContext';

export default function BackupRestoreModal() {
  const { activeModal, closeModal } = useModal();
  const { exportBackup, importBackup } = useAppData();
  const { showAlert, showConfirm } = useUi();
  const isOpen = activeModal === 'backup-restore';
  const fileInput = useRef<HTMLInputElement>(null);

  function handleExport() {
    const json = exportBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finance-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async function handleFileChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const ok = await showConfirm(
      'Restore Backup?',
      'This will replace all current data on this device with the contents of the backup file.',
      true,
    );
    if (!ok) return;
    const text = await file.text();
    const result = importBackup(text);
    if (result.ok) {
      showAlert('Restored', 'Your data has been restored.', 'success');
      closeModal();
    } else {
      showAlert('Restore Failed', result.reason ?? 'Could not restore this file.', 'error');
    }
  }

  return (
    <BottomSheetModal isOpen={isOpen} title="Backup & Restore" onClose={closeModal}>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 18, lineHeight: 1.6 }}>
        Your data lives only on this device. Export a backup before switching phones, reinstalling, or clearing
        browser data — then restore it on the new device.
      </p>
      <button className="btn btn-primary" onClick={handleExport}>
        <i className="fas fa-download" /> Export Backup
      </button>
      <button className="btn btn-secondary" style={{ marginTop: 10 }} onClick={() => fileInput.current?.click()}>
        <i className="fas fa-upload" /> Restore from File
      </button>
      <input ref={fileInput} type="file" accept="application/json" style={{ display: 'none' }} onChange={handleFileChosen} />
    </BottomSheetModal>
  );
}
