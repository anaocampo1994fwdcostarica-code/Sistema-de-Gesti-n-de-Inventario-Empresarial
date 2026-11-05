import Modal from './Modal'
import { Alert } from './Feedback'

export default function EntityFormModal({ open, title, subtitle, error, saving, submitDisabled = false, dirty = false, onClose, onSubmit, children, submitLabel = 'Guardar' }) {
  return <Modal open={open} title={title} subtitle={subtitle} onClose={onClose} dirty={dirty}>
    <form className="form" onSubmit={onSubmit}>{error && <Alert>{error}</Alert>}{children}<div className="form__actions"><button type="button" className="button button--secondary" onClick={onClose} disabled={saving}>Cancelar</button><button className="button button--primary" disabled={saving || submitDisabled}>{saving ? 'Guardando…' : submitLabel}</button></div></form>
  </Modal>
}
