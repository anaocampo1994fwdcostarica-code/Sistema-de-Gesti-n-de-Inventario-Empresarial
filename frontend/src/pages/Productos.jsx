import { useCallback, useEffect, useState } from 'react'
import ConfirmDialog from '../components/ConfirmDialog'
import { Alert, EmptyState } from '../components/Feedback'
import Loading from '../components/Loading'
import Modal from '../components/Modal'
import Icon from '../components/Icon'
import { getCategorias } from '../services/categoriaService'
import { createProducto, deleteProducto, getProductos, updateProducto } from '../services/productoService'
import { getProveedores } from '../services/proveedorService'

const emptyForm = { nombre: '', codigo: '', precio: '', cantidad: '', categoriaId: '', proveedorId: '' }
const currency = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', minimumFractionDigits: 2 })

export default function Productos() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [providers, setProviders] = useState([])
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
    try { const [products, categoryList, providerList] = await Promise.all([getProductos(), getCategorias(), getProveedores()]); setItems(products); setCategories(categoryList); setProviders(providerList) }
    catch (requestError) { setError(requestError.message) } finally { setLoading(false) }
  }, [])
  useEffect(() => {
    let active = true
    Promise.all([getProductos(), getCategorias(), getProveedores()])
      .then(([products, categoryList, providerList]) => { if (active) { setItems(products); setCategories(categoryList); setProviders(providerList); setLoading(false) } })
      .catch((requestError) => { if (active) { setError(requestError.message); setLoading(false) } })
    return () => { active = false }
  }, [])

  const openForm = (item = null) => {
    setEditing(item || {})
    setForm(item ? { nombre: item.nombre, codigo: item.codigo, precio: String(item.precio), cantidad: String(item.cantidad), categoriaId: String(item.categoriaId), proveedorId: String(item.proveedorId) } : emptyForm)
    setFormError('')
  }

  const submit = async (event) => {
    event.preventDefault()
    const required = ['nombre', 'codigo', 'precio', 'cantidad', 'categoriaId', 'proveedorId']
    if (required.some((field) => String(form[field]).trim() === '')) return setFormError('Completa todos los campos obligatorios.')
    const price = Number(form.precio); const quantity = Number(form.cantidad)
    if (!Number.isFinite(price) || price < 0) return setFormError('El precio debe ser un número no negativo.')
    if (!Number.isInteger(quantity) || quantity < 0) return setFormError('La cantidad debe ser un entero no negativo.')
    setSaving(true); setFormError('')
    const payload = { nombre: form.nombre.trim(), codigo: form.codigo.trim(), precio: price, cantidad: quantity, categoriaId: Number(form.categoriaId), proveedorId: Number(form.proveedorId) }
    try {
      if (editing.id) await updateProducto(editing.id, payload); else await createProducto(payload)
      setEditing(null); setSuccess(editing.id ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.'); await load()
    } catch (requestError) { setFormError(requestError.message) } finally { setSaving(false) }
  }

  const remove = async () => {
    setSaving(true)
    try { await deleteProducto(deleting.id); setDeleting(null); setSuccess('Producto eliminado correctamente.'); await load() }
    catch (requestError) { setDeleting(null); setError(requestError.message) } finally { setSaving(false) }
  }

  const missingRelations = categories.length === 0 || providers.length === 0

  return (
    <div className="page-stack">
      <div className="page-actions"><div><span className="eyebrow">INVENTARIO</span><h2>Catálogo de productos</h2><p>{items.length} {items.length === 1 ? 'producto registrado' : 'productos registrados'}</p></div><button className="button button--primary" onClick={() => openForm()} disabled={missingRelations}><Icon name="plus" size={17} />Nuevo producto</button></div>
      {missingRelations && !loading && <Alert>Debes registrar al menos una categoría y un proveedor antes de crear productos.</Alert>}
      {error && <Alert onClose={() => setError('')}>{error}</Alert>}{success && <Alert type="success" onClose={() => setSuccess('')}>{success}</Alert>}
      <section className="panel table-panel">
        {loading ? <Loading /> : items.length === 0 ? <EmptyState icon="product" title="No hay productos" description="Los productos registrados aparecerán aquí con su categoría y proveedor." action={!missingRelations ? <button className="button button--primary" onClick={() => openForm()}><Icon name="plus" size={17} />Crear producto</button> : null} /> : (
          <div className="table-wrap"><table><thead><tr><th scope="col">Producto</th><th scope="col">Código</th><th scope="col">Precio</th><th scope="col">Cantidad</th><th scope="col">Categoría</th><th scope="col">Proveedor</th><th scope="col" className="cell-actions">Acciones</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td data-label="Producto"><strong>{item.nombre}</strong></td><td data-label="Código"><span className="code-badge">{item.codigo}</span></td><td data-label="Precio" className="mono-value">{currency.format(Number(item.precio))}</td><td data-label="Cantidad"><span className={`stock-badge ${Number(item.cantidad) === 0 ? 'stock-badge--empty' : ''}`}>{item.cantidad}</span></td><td data-label="Categoría">{item.categoria?.nombre || '—'}</td><td data-label="Proveedor">{item.proveedor?.nombre || '—'}</td><td data-label="Acciones" className="cell-actions"><button className="table-action" onClick={() => openForm(item)} aria-label={`Editar ${item.nombre}`}><Icon name="edit" size={15} />Editar</button><button className="table-action table-action--danger" onClick={() => setDeleting(item)} aria-label={`Eliminar ${item.nombre}`}><Icon name="trash" size={15} />Eliminar</button></td></tr>)}</tbody></table></div>
        )}
      </section>
      <Modal open={Boolean(editing)} title={editing?.id ? 'Editar producto' : 'Nuevo producto'} subtitle="Información comercial y existencias." onClose={() => !saving && setEditing(null)}>
        <form className="form" onSubmit={submit}>{formError && <Alert>{formError}</Alert>}<div className="form-grid"><label>Nombre <span>*</span><input maxLength="100" value={form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} placeholder="Nombre del producto" autoFocus /></label><label>Código <span>*</span><input maxLength="30" value={form.codigo} onChange={(event) => setForm({ ...form, codigo: event.target.value })} placeholder="SKU-001" /></label><label>Precio (₡) <span>*</span><input type="number" min="0" step="0.01" value={form.precio} onChange={(event) => setForm({ ...form, precio: event.target.value })} placeholder="0.00" /></label><label>Cantidad <span>*</span><input type="number" min="0" step="1" value={form.cantidad} onChange={(event) => setForm({ ...form, cantidad: event.target.value })} placeholder="0" /></label><label>Categoría <span>*</span><select value={form.categoriaId} onChange={(event) => setForm({ ...form, categoriaId: event.target.value })}><option value="">Selecciona una categoría</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}</select></label><label>Proveedor <span>*</span><select value={form.proveedorId} onChange={(event) => setForm({ ...form, proveedorId: event.target.value })}><option value="">Selecciona un proveedor</option>{providers.map((item) => <option key={item.id} value={item.id}>{item.nombre}</option>)}</select></label></div><div className="form__actions"><button type="button" className="button button--secondary" onClick={() => setEditing(null)} disabled={saving}>Cancelar</button><button className="button button--primary" disabled={saving}>{saving ? 'Guardando…' : 'Guardar producto'}</button></div></form>
      </Modal>
      <ConfirmDialog open={Boolean(deleting)} title="Eliminar producto" message={`¿Deseas eliminar “${deleting?.nombre}”? Esta acción no se puede deshacer.`} loading={saving} onCancel={() => setDeleting(null)} onConfirm={remove} />
    </div>
  )
}
