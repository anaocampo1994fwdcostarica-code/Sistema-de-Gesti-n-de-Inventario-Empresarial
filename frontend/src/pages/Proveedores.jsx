import { useCallback, useEffect, useState } from 'react'
import ConfirmDialog from '../components/ConfirmDialog'
import { Alert, EmptyState } from '../components/Feedback'
import Loading from '../components/Loading'
import Modal from '../components/Modal'
import { createProveedor, deleteProveedor, getProveedores, updateProveedor } from '../services/proveedorService'

const emptyForm = { nombre: '', telefono: '', correo: '' }
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Proveedores() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try { setItems(await getProveedores()) } catch (requestError) { setError(requestError.message) } finally { setLoading(false) }
  }, [])
  useEffect(() => {
    let active = true
    getProveedores().then((data) => { if (active) { setItems(data); setLoading(false) } }).catch((requestError) => { if (active) { setError(requestError.message); setLoading(false) } })
    return () => { active = false }
  }, [])

  const openForm = (item = null) => {
    setEditing(item || {}); setForm(item ? { nombre: item.nombre, telefono: item.telefono || '', correo: item.correo || '' } : emptyForm); setFormError('')
  }

  const submit = async (event) => {
    event.preventDefault()
    if (!form.nombre.trim()) return setFormError('El nombre es obligatorio.')
    if (form.correo.trim() && !emailPattern.test(form.correo.trim())) return setFormError('Ingresa un correo electrónico válido.')
    setSaving(true); setFormError('')
    const payload = { nombre: form.nombre.trim(), telefono: form.telefono.trim() || null, correo: form.correo.trim() || null }
    try {
      if (editing.id) await updateProveedor(editing.id, payload); else await createProveedor(payload)
      setEditing(null); setSuccess(editing.id ? 'Proveedor actualizado correctamente.' : 'Proveedor creado correctamente.'); await load()
    } catch (requestError) { setFormError(requestError.message) } finally { setSaving(false) }
  }

  const remove = async () => {
    setSaving(true)
    try { await deleteProveedor(deleting.id); setDeleting(null); setSuccess('Proveedor eliminado correctamente.'); await load() }
    catch (requestError) { setDeleting(null); setError(requestError.message) } finally { setSaving(false) }
  }

  return (
    <div className="page-stack">
      <div className="page-actions"><div><span className="eyebrow">ABASTECIMIENTO</span><h2>Directorio de proveedores</h2><p>{items.length} {items.length === 1 ? 'proveedor registrado' : 'proveedores registrados'}</p></div><button className="button button--primary" onClick={() => openForm()}>+ Nuevo proveedor</button></div>
      {error && <Alert onClose={() => setError('')}>{error}</Alert>}{success && <Alert type="success" onClose={() => setSuccess('')}>{success}</Alert>}
      <section className="panel table-panel">
        {loading ? <Loading /> : items.length === 0 ? <EmptyState icon="♙" title="No hay proveedores" description="Registra un proveedor para asociarlo con tus productos." action={<button className="button button--primary" onClick={() => openForm()}>Crear proveedor</button>} /> : (
          <div className="table-wrap"><table><thead><tr><th>Proveedor</th><th>Teléfono</th><th>Correo electrónico</th><th className="cell-actions">Acciones</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td><strong>{item.nombre}</strong></td><td>{item.telefono || <span className="muted">No indicado</span>}</td><td>{item.correo ? <a href={`mailto:${item.correo}`}>{item.correo}</a> : <span className="muted">No indicado</span>}</td><td className="cell-actions"><button className="table-action" onClick={() => openForm(item)}>Editar</button><button className="table-action table-action--danger" onClick={() => setDeleting(item)}>Eliminar</button></td></tr>)}</tbody></table></div>
        )}
      </section>
      <Modal open={Boolean(editing)} title={editing?.id ? 'Editar proveedor' : 'Nuevo proveedor'} subtitle="Datos de contacto y abastecimiento." onClose={() => !saving && setEditing(null)}>
        <form className="form" onSubmit={submit}>{formError && <Alert>{formError}</Alert>}<label>Nombre <span>*</span><input maxLength="100" value={form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} placeholder="Nombre del proveedor" autoFocus /></label><div className="form-grid"><label>Teléfono<input maxLength="20" value={form.telefono} onChange={(event) => setForm({ ...form, telefono: event.target.value })} placeholder="8888-8888" /></label><label>Correo electrónico<input type="email" maxLength="150" value={form.correo} onChange={(event) => setForm({ ...form, correo: event.target.value })} placeholder="contacto@empresa.com" /></label></div><div className="form__actions"><button type="button" className="button button--secondary" onClick={() => setEditing(null)} disabled={saving}>Cancelar</button><button className="button button--primary" disabled={saving}>{saving ? 'Guardando…' : 'Guardar proveedor'}</button></div></form>
      </Modal>
      <ConfirmDialog open={Boolean(deleting)} title="Eliminar proveedor" message={`¿Deseas eliminar “${deleting?.nombre}”? No será posible si tiene productos asociados.`} loading={saving} onCancel={() => setDeleting(null)} onConfirm={remove} />
    </div>
  )
}
