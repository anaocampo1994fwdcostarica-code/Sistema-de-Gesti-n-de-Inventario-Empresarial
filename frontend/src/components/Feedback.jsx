export function Alert({ type = 'error', children, onClose }) {
  if (!children) return null
  return (
    <div className={`alert alert--${type}`} role={type === 'error' ? 'alert' : 'status'}>
      <span>{type === 'error' ? '!' : '✓'}</span><p>{children}</p>
      {onClose && <button onClick={onClose} aria-label="Cerrar mensaje">×</button>}
    </div>
  )
}

export function EmptyState({ icon = '□', title, description, action }) {
  return <div className="empty-state"><span className="empty-state__icon" aria-hidden="true">{icon}</span><h3>{title}</h3><p>{description}</p>{action}</div>
}
