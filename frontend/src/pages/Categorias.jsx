import { useCallback, useEffect, useState } from 'react'
import ConfirmDialog from '../components/ConfirmDialog'
import { Alert, EmptyState } from '../components/Feedback'
import Loading from '../components/Loading'
import Modal from '../components/Modal'
import { createCategoria, deleteCategoria, getCategorias, updateCategoria } from '../services/categoriaService'

const emptyForm = { nombre: '', descripcion: '' }

export default function Categorias() {
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
    try { setItems(await getCategorias()) } catch (requestError) { setError(requestError.message) } finally { setLoading(false) }
  }, [])
  useEffect(() => {
    let active = true
    getCategorias().then((data) => { if (active) { setItems(data); setLoading(false) } }).catch((requestError) => { if (active) { setError(requestError.message); setLoading(false) } })
    return () => { active = false }
  }, [])

  const openForm = (item = null) => {
    setEditing(item || {})
    setForm(item ? { nombre: item.nombre, descripcion: item.descripcion || '' } : emptyForm)
    setFormError('')
  }

  const submit = async (event) => {
    event.preventDefault()
    if (!form.nombre.trim()) return setFormError('El nombre es obligatorio.')
    setSaving(true); setFormError('')
    try {
      if (editing.id) { await updateCategoria(editing.id, { nombre: form.nombre.trim(), descripcion: form.descripcion.trim() || null }) }
      else { await createCategoria({ nombre: form.nombre.trim(), descripcion: form.descripcion.trim() || null }) }
      setEditing(null); setSuccess(editing.id ? 'Categoría actualizada correctamente.' : 'Categoría creada correctamente.'); await load()
    } catch (requestError) { setFormError(requestError.message) } finally { setSaving(false) }
  }

  const remove = async () => {
    setSaving(true)
    try { await deleteCategoria(deleting.id); setDeleting(null); setSuccess('Categoría eliminada correctamente.'); await load() }
    catch (requestError) { setDeleting(null); setError(requestError.message) } finally { setSaving(false) }
  }

  return (
    <div className="page-stack">
      <div className="page-actions"><div><span className="eyebrow">CATÁLOGO</span><h2>Listado de categorías</h2><p>{items.length} {items.length === 1 ? 'categoría registrada' : 'categorías registradas'}</p></div><button className="button button--primary" onClick={() => openForm()}>+ Nueva categoría</button></div>
      {error && <Alert onClose={() => setError('')}>{error}</Alert>}{success && <Alert type="success" onClose={() => setSuccess('')}>{success}</Alert>}
      <section className="panel table-panel">
        {loading ? <Loading /> : items.length === 0 ? <EmptyState icon="◫" title="No hay categorías" description="Crea la primera categoría para organizar tus productos." action={<button className="button button--primary" onClick={() => openForm()}>Crear categoría</button>} /> : (
          <div className="table-wrap"><table><thead><tr><th>Nombre</th><th>Descripción</th><th>Fecha de creación</th><th className="cell-actions">Acciones</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td><strong>{item.nombre}</strong></td><td className="muted">{item.descripcion || 'Sin descripción'}</td><td className="muted">{new Date(item.createdAt).toLocaleDateString('es-CR')}</td><td className="cell-actions"><button className="table-action" onClick={() => openForm(item)}>Editar</button><button className="table-action table-action--danger" onClick={() => setDeleting(item)}>Eliminar</button></td></tr>)}</tbody></table></div>
        )}
      </section>
      <Modal open={Boolean(editing)} title={editing?.id ? 'Editar categoría' : 'Nueva categoría'} subtitle="Completa la información de la categoría." onClose={() => !saving && setEditing(null)}>
        <form className="form" onSubmit={submit}>{formError && <Alert>{formError}</Alert>}<label>Nombre <span>*</span><input maxLength="100" value={form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} placeholder="Ej. Tecnología" autoFocus /></label><label>Descripción<textarea maxLength="255" rows="4" value={form.descripcion} onChange={(event) => setForm({ ...form, descripcion: event.target.value })} placeholder="Descripción opcional" /></label><div className="form__actions"><button type="button" className="button button--secondary" onClick={() => setEditing(null)} disabled={saving}>Cancelar</button><button className="button button--primary" disabled={saving}>{saving ? 'Guardando…' : 'Guardar categoría'}</button></div></form>
      </Modal>
      <ConfirmDialog open={Boolean(deleting)} title="Eliminar categoría" message={`¿Deseas eliminar “${deleting?.nombre}”? Esta acción no se puede deshacer.`} loading={saving} onCancel={() => setDeleting(null)} onConfirm={remove} />
    </div>
  )
}
