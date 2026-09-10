import { useRef, useState } from 'react';
import { useAppData } from '@/context/AppDataContext';
import { useModal } from '@/context/ModalContext';
import { useUi } from '@/context/UiContext';
import { ordinal } from '@/utils/date';
import type { ChartType, ThemeName } from '@/types';

const THEMES: { value: ThemeName; label: string; swatch: string }[] = [
  { value: 'midnight', label: 'Midnight', swatch: '#0b0f19' },
  { value: 'light', label: 'Light', swatch: '#f1f5f9' },
  { value: 'rosegold', label: 'Rose Gold', swatch: '#fff1f2' },
];

const CHART_TYPES: { value: ChartType; label: string; icon: string }[] = [
  { value: 'bar', label: 'Bar', icon: 'fa-chart-simple' },
  { value: 'circle', label: 'Donut', icon: 'fa-chart-pie' },
  { value: 'radar', label: 'Radar', icon: 'fa-chart-area' },
];

export default function Profile() {
  const {
    settings, updateSettings, setDisplayName, setAvatar, clearAllData,
  } = useAppData();
  const { openModal } = useModal();
  const { showPrompt, showConfirm } = useUi();
  const [themeOpen, setThemeOpen] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  async function handleEditName() {
    const name = await showPrompt('Your Name', 'How should we address you?', settings.displayName);
    if (name && name.trim()) setDisplayName(name.trim());
  }

  function handleAvatarClick() {
    fileInput.current?.click();
  }

  function handleAvatarFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleClearData() {
    const ok = await showConfirm(
      'Clear All Data?',
      'This permanently deletes every transaction, loan, budget and notification on this device. This cannot be undone unless you have a backup.',
      true,
    );
    if (ok) clearAllData();
  }

  return (
    <>
      <div className="profile-header">
        <div className="avatar-container">
          <div className="avatar">
            {settings.avatar ? <img src={settings.avatar} alt="Avatar" /> : <i className="fas fa-user" />}
          </div>
          <div className="avatar-edit-btn" onClick={handleAvatarClick}><i className="fas fa-camera" /></div>
          <input ref={fileInput} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarFile} />
        </div>
        <div className="profile-name-container">
          <div className="profile-name">{settings.displayName}</div>
          <i className="fas fa-pen" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', cursor: 'pointer' }} onClick={handleEditName} />
        </div>
        <div className="profile-joined">Member since {settings.joined}</div>
      </div>

      <div className="settings-group">
        <div className="section-title">Preferences</div>
        <div className="settings-item" onClick={() => openModal('select-currency')} style={{ cursor: 'pointer' }}>
          <span>Currency</span><strong>{settings.currency}</strong>
        </div>
        <div className="settings-item" onClick={() => openModal('select-payday')} style={{ cursor: 'pointer' }}>
          <span>Payday</span><strong>{ordinal(settings.payday)} of month</strong>
        </div>
        <div className="settings-item" onClick={() => openModal('select-year-mode')} style={{ cursor: 'pointer' }}>
          <span>Yearly Report Range</span><strong>{settings.yearMode === 'calendar' ? 'Calendar Year' : 'Since Joined'}</strong>
        </div>
      </div>

      <div className="settings-group">
        <div className="section-title">Appearance</div>
        <div className="settings-item" onClick={() => setThemeOpen((v) => !v)} style={{ cursor: 'pointer' }}>
          <span>Theme</span>
          <strong>{THEMES.find((t) => t.value === settings.theme)?.label} <i className="fas fa-chevron-down" /></strong>
        </div>
        <div className={`theme-accordion-wrapper ${themeOpen ? 'open' : ''}`}>
          <div className="theme-accordion-content">
            {THEMES.map((t) => (
              <button
                key={t.value}
                className={`theme-option ${settings.theme === t.value ? 'active' : ''}`}
                onClick={() => updateSettings({ theme: t.value })}
              >
                <span className="theme-swatch" style={{ background: t.swatch }} />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="settings-item"><span>Dashboard Chart</span></div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          {CHART_TYPES.map((c) => (
            <button
              key={c.value}
              className={`filter-chip ${settings.chartType === c.value ? 'active' : ''}`}
              style={{ flex: 1, textAlign: 'center' }}
              onClick={() => updateSettings({ chartType: c.value })}
            >
              <i className={`fas ${c.icon}`} /> {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="settings-group">
        <div className="section-title">Data</div>
        <div className="settings-item" onClick={() => openModal('backup-restore')} style={{ cursor: 'pointer' }}>
          <span><i className="fas fa-cloud-arrow-up" style={{ marginRight: 10 }} />Backup &amp; Restore</span>
          <i className="fas fa-chevron-right" style={{ color: 'var(--text-secondary)' }} />
        </div>
        <div className="settings-item" onClick={() => openModal('loans')} style={{ cursor: 'pointer' }}>
          <span><i className="fas fa-hand-holding-dollar" style={{ marginRight: 10 }} />Loans &amp; Debts</span>
          <i className="fas fa-chevron-right" style={{ color: 'var(--text-secondary)' }} />
        </div>
        <div className="settings-item" onClick={() => openModal('about')} style={{ cursor: 'pointer' }}>
          <span><i className="fas fa-circle-info" style={{ marginRight: 10 }} />About</span>
          <i className="fas fa-chevron-right" style={{ color: 'var(--text-secondary)' }} />
        </div>
      </div>

      <button className="btn btn-danger" onClick={handleClearData}>
        <i className="fas fa-triangle-exclamation" /> Clear All Data
      </button>
    </>
  );
}
