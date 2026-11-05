export default function StatusBadge({ active, children }) {
  const enabled = active ?? children === 'CONFIRMADA'
  return <span className={`status-badge status-badge--${enabled ? 'active' : 'inactive'}`}>{children ?? (enabled ? 'Activo' : 'Inactivo')}</span>
}
