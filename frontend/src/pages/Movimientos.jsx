import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import DataTable from '../components/DataTable'
import EntityFormModal from '../components/EntityFormModal'
import { Alert } from '../components/Feedback'
import FormField from '../components/FormField'
import Icon from '../components/Icon'
import { movimientosApi, tiposMovimientoApi, ubicacionesApi } from '../services/inventoryService'
import { getProductos } from '../services/productoService'

const empty = { productoId: '', tipoMovimientoId: '', ubicacionOrigenId: '', ubicacionDestinoId: '', cantidad: '', motivo: '', referencia: '' }
const reservedTypeCodes = new Set(['COMPRA', 'VENTA', 'AJUSTE_ENTRADA', 'AJUSTE_SALIDA'])

export default function Movimientos() {
  const [items, setItems] = useState([])
  const [productos, setProductos] = useState([])
  const [tipos, setTipos] = useState([])
  const [ubicaciones, setUbicaciones] = useState([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(empty)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [success, setSuccess] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [movements, products, types, locations] = await Promise.all([movimientosApi.list(), getProductos(), tiposMovimientoApi.list(), ubicacionesApi.list()])
      setItems(movements); setProductos(products); setTipos(types); setUbicaciones(locations); setError('')
    } catch (requestError) { setError(requestError.message) } finally { setLoading(false) }
  }, [])
  useEffect(() => { const timer = window.setTimeout(load, 0); return () => window.clearTimeout(timer) }, [load])

  const manualTypes = tipos.filter((type) => !reservedTypeCodes.has(type.codigo))
  const selectedType = manualTypes.find((type) => String(type.id) === form.tipoMovimientoId)
  const effect = selectedType?.efecto
  const options = (list, label) => [{ value: '', label }, ...list.filter((item) => item.activo !== false).map((item) => ({ value: item.id, label: item.codigo ? `${item.codigo} · ${item.nombre}` : item.nombre }))]

  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setFormError('')
    try {
      await movimientosApi.create({ productoId: Number(form.productoId), tipoMovimientoId: Number(form.tipoMovimientoId), ubicacionOrigenId: form.ubicacionOrigenId ? Number(form.ubicacionOrigenId) : null, ubicacionDestinoId: form.ubicacionDestinoId ? Number(form.ubicacionDestinoId) : null, cantidad: Number(form.cantidad), motivo: form.motivo.trim() || null, referencia: form.referencia.trim() || null })
      setOpen(false); setForm(empty); setSuccess('Movimiento aplicado correctamente.'); await load()
    } catch (requestError) { setFormError(requestError.message) } finally { setSaving(false) }
  }
  const columns = useMemo(() => [
    { key: 'id', label: '#' }, { key: 'tipo', label: 'Tipo', render: (item) => item.tipoMovimiento?.nombre },
    { key: 'producto', label: 'Producto', render: (item) => item.producto?.nombre },
    { key: 'origen', label: 'Origen', render: (item) => item.ubicacionOrigen?.nombre || '—' },
    { key: 'destino', label: 'Destino', render: (item) => item.ubicacionDestino?.nombre || '—' },
    { key: 'cantidad', label: 'Cantidad' }, { key: 'fecha', label: 'Fecha', render: (item) => new Date(item.fechaMovimiento).toLocaleString('es-CR') },
  ], [])

  return <div className="page-stack">
    <div className="page-actions"><div><span className="eyebrow">INVENTARIO</span><h2>Movimientos</h2><p>Entradas, salidas y traslados transaccionales.</p></div><button className="button button--primary" onClick={() => { setForm(empty); setOpen(true) }}><Icon name="plus" size={17}/>Registrar movimiento</button></div>
    {error && <Alert>{error}</Alert>}{success && <Alert type="success" onClose={() => setSuccess('')}>{success}</Alert>}
    {!loading && productos.length === 0 && <Alert>No hay productos registrados. <Link to="/productos">Ir a Catálogos → Productos</Link>.</Alert>}
    {!loading && manualTypes.length === 0 && <Alert>No hay tipos manuales activos. Crea tipos de entrada, salida o traslado en el catálogo correspondiente.</Alert>}
    <section className="panel table-panel"><DataTable rows={items} columns={columns} loading={loading}/></section>
    <EntityFormModal open={open} title="Registrar movimiento" error={formError} saving={saving} submitDisabled={productos.length === 0} onClose={() => setOpen(false)} onSubmit={submit} submitLabel="Aplicar">
      {productos.length === 0 && <Alert>No hay productos registrados. <Link to="/productos">Crear producto</Link>.</Alert>}
      <div className="form-grid">
        <FormField label="Producto" required as="select" value={form.productoId} onChange={(event) => setForm({ ...form, productoId: event.target.value })} options={options(productos, 'Seleccione…')}/>
        <FormField label="Tipo manual" required as="select" value={form.tipoMovimientoId} onChange={(event) => setForm({ ...form, tipoMovimientoId: event.target.value, ubicacionOrigenId: '', ubicacionDestinoId: '' })} options={options(manualTypes, 'Seleccione…')}/>
        {(effect === 'SALIDA' || effect === 'TRASLADO') && <FormField label="Ubicación origen" required as="select" value={form.ubicacionOrigenId} onChange={(event) => setForm({ ...form, ubicacionOrigenId: event.target.value })} options={options(ubicaciones, 'Seleccione…')}/>} 
        {(effect === 'ENTRADA' || effect === 'TRASLADO') && <FormField label="Ubicación destino" required as="select" value={form.ubicacionDestinoId} onChange={(event) => setForm({ ...form, ubicacionDestinoId: event.target.value })} options={options(ubicaciones, 'Seleccione…')}/>} 
        <FormField label="Cantidad" required type="number" min="1" step="1" value={form.cantidad} onChange={(event) => setForm({ ...form, cantidad: event.target.value })}/>
        <FormField label="Referencia" maxLength="100" value={form.referencia} onChange={(event) => setForm({ ...form, referencia: event.target.value })}/>
      </div>
      <FormField label="Motivo" as="textarea" rows="3" maxLength="255" value={form.motivo} onChange={(event) => setForm({ ...form, motivo: event.target.value })}/>
    </EntityFormModal>
  </div>
}
