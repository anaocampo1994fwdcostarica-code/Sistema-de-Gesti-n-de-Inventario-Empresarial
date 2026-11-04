export default function ConfirmDialog({ open, title, message, loading, onConfirm, onCancel }) {
  if (!open) return null
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onCancel}>
      <section className="dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" onMouseDown={(event) => event.stopPropagation()}>
        <div className="dialog__icon" aria-hidden="true">!</div>
        <h2 id="confirm-title">{title}</h2><p>{message}</p>
        <div className="dialog__actions">
          <button className="button button--secondary" onClick={onCancel} disabled={loading}>Cancelar</button>
          <button className="button button--danger" onClick={onConfirm} disabled={loading}>{loading ? 'Eliminando…' : 'Eliminar'}</button>
        </div>
      </section>
    </div>
  )
}
