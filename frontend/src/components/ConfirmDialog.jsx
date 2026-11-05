import { useCallback } from 'react'
import useDialogFocus from '../hooks/useDialogFocus'
import Icon from './Icon'

export default function ConfirmDialog({ open, title, message, loading, onConfirm, onCancel, confirmLabel = 'Eliminar', loadingLabel = 'Procesando…', danger = true }) {
  const close = useCallback(() => { if (!loading) onCancel() }, [loading, onCancel])
  const dialogRef = useDialogFocus(open, close)
  if (!open) return null
  return <div className="modal-backdrop" role="presentation" onMouseDown={close}><section ref={dialogRef} className="dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-message" onMouseDown={(event) => event.stopPropagation()}><div className="dialog__icon" aria-hidden="true"><Icon name="warning" size={24}/></div><h2 id="confirm-title">{title}</h2><p id="confirm-message">{message}</p><div className="dialog__actions"><button className="button button--secondary" onClick={onCancel} disabled={loading}>Cancelar</button><button className={`button ${danger ? 'button--danger' : 'button--primary'}`} onClick={onConfirm} disabled={loading}>{loading ? loadingLabel : confirmLabel}</button></div></section></div>
}
