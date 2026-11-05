import { useCallback } from 'react'
import useDialogFocus from '../hooks/useDialogFocus'
import Icon from './Icon'

export default function Modal({ open, title, subtitle, children, onClose, dirty = false }) {
  const close = useCallback(() => {
    if (dirty && !window.confirm('Hay cambios sin guardar. ¿Deseas cerrar la ventana?')) return
    onClose()
  }, [dirty, onClose])
  const dialogRef = useDialogFocus(open, close)
  if (!open) return null
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={close}>
      <section ref={dialogRef} className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby={subtitle ? 'modal-subtitle' : undefined} onMouseDown={(event) => event.stopPropagation()}>
        <header className="modal__header">
          <div><span className="modal__eyebrow">INVENTARIO EMPRESARIAL</span><h2 id="modal-title">{title}</h2>{subtitle && <p id="modal-subtitle">{subtitle}</p>}</div>
          <button type="button" className="icon-button modal__close" onClick={close} aria-label="Cerrar ventana"><Icon name="close" size={18} /></button>
        </header>
        {children}
      </section>
    </div>
  )
}
