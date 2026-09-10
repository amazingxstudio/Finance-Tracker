interface EmptyStateProps {
  icon?: string;
  message: string;
}

export default function EmptyState({ icon = 'fa-box-open', message }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <i className={`fas ${icon}`} />
      <div style={{ marginTop: 10 }}>{message}</div>
    </div>
  );
}
