import Icon from './Icon'

export function Alert({ type = 'error', children, onClose }) {
  if (!children) return null
  return (
    <div className={`alert alert--${type}`} role={type === 'error' ? 'alert' : 'status'}>
      <span className="alert__icon"><Icon name={type === 'error' ? 'warning' : 'check'} size={16} /></span><p>{children}</p>
      {onClose && <button onClick={onClose} aria-label="Cerrar mensaje"><Icon name="close" size={16} /></button>}
    </div>
  )
}

export function EmptyState({ icon = 'product', title, description, action }) {
  return <div className="empty-state"><span className="empty-state__icon"><Icon name={icon} size={25} /></span><h3>{title}</h3><p>{description}</p>{action}</div>
}
