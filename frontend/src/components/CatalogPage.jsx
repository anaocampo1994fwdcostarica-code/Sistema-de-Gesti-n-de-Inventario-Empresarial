import { useCallback, useEffect, useState } from 'react'
import ConfirmDialog from './ConfirmDialog'
import DataTable from './DataTable'
import EntityFormModal from './EntityFormModal'
import { Alert } from './Feedback'
import FormField from './FormField'
import Icon from './Icon'
import StatusBadge from './StatusBadge'

export default function CatalogPage({ config }) {
  const [items, setItems] = useState([])
  const [lookups, setLookups] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [form, setForm] = useState(config.emptyForm)
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [success, setSuccess] = useState('')
  const load = useCallback(async () => {
    setLoading(true)
    try { const [records, lookupData] = await Promise.all([config.api.list(), config.loadLookups ? config.loadLookups() : {}]); setItems(records); setLookups(lookupData); setError('') }
    catch (requestError) { setError(requestError.message) } finally { setLoading(false) }
  }, [config])
  useEffect(() => { const timer = window.setTimeout(load, 0); return () => window.clearTimeout(timer) }, [load])
  const openForm = (item = null) => { setEditing(item || {}); setForm(item ? config.toForm(item) : { ...config.emptyForm }); setFormError('') }
  const change = ({ target }) => setForm((current) => ({ ...current, [target.name]: target.type === 'checkbox' ? target.checked : target.value }))
  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setFormError('')
    try { if (editing.id) await config.api.update(editing.id, config.toPayload(form)); else await config.api.create(config.toPayload(form)); setEditing(null); setSuccess(`${config.singular} ${editing.id ? 'actualizado' : 'creado'} correctamente.`); await load() }
    catch (requestError) { setFormError(requestError.message) } finally { setSaving(false) }
  }
  const remove = async () => { setSaving(true); try { await config.api.remove(deleting.id); setDeleting(null); setSuccess(`${config.singular} desactivado correctamente.`); await load() } catch (requestError) { setDeleting(null); setError(requestError.message) } finally { setSaving(false) } }
  const columns = [...config.columns, { key: 'activo', label: 'Estado', render: (item) => <StatusBadge active={item.activo} /> }, { key: 'acciones', label: 'Acciones', render: (item) => <div className="cell-actions"><button className="table-action" onClick={() => openForm(item)}>Editar</button>{item.activo && <button className="table-action table-action--danger" onClick={() => setDeleting(item)}>Desactivar</button>}</div> }]
  return <div className="page-stack">
    <div className="page-actions"><div><span className="eyebrow">{config.section}</span><h2>{config.title}</h2><p>{items.length} registros</p></div><button className="button button--primary" onClick={() => openForm()}><Icon name="plus" size={17} />Nuevo</button></div>
    {error && <Alert onClose={() => setError('')}>{error}</Alert>}{success && <Alert type="success" onClose={() => setSuccess('')}>{success}</Alert>}
    <section className="panel table-panel"><DataTable columns={columns} rows={items} loading={loading} emptyTitle={`Sin ${config.title.toLowerCase()}`} /></section>
    <EntityFormModal open={Boolean(editing)} title={`${editing?.id ? 'Editar' : 'Nuevo'} ${config.singular.toLowerCase()}`} error={formError} saving={saving} onClose={() => !saving && setEditing(null)} onSubmit={submit}>
      <div className="form-grid">{config.fields.map((field) => {
        const options = typeof field.options === 'function' ? field.options(lookups) : field.options
        if (field.type === 'checkbox') return <label className="checkbox-field" key={field.name}><input name={field.name} type="checkbox" checked={Boolean(form[field.name])} onChange={change} />{field.label}</label>
        return <FormField key={field.name} {...field} options={options} value={form[field.name] ?? ''} onChange={change} />
      })}</div>
    </EntityFormModal>
    <ConfirmDialog open={Boolean(deleting)} title={`Desactivar ${config.singular.toLowerCase()}`} message="El registro quedará inactivo y conservará su historial." loading={saving} onCancel={() => setDeleting(null)} onConfirm={remove} confirmLabel="Desactivar" />
  </div>
}
