import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog'
import DataTable from '../components/DataTable'
import EntityFormModal from '../components/EntityFormModal'
import { Alert } from '../components/Feedback'
import FormField from '../components/FormField'
import Icon from '../components/Icon'
import { ajustesApi, makeIdempotencyKey, ubicacionesApi } from '../services/inventoryService'
import { getProductos } from '../services/productoService'

const empty = { productoId: '', ubicacionId: '', cantidadNueva: '', motivo: '' }
export default function Ajustes() {
  const [items,setItems]=useState([]); const [productos,setProductos]=useState([]); const [ubicaciones,setUbicaciones]=useState([])
  const [form,setForm]=useState(empty); const [open,setOpen]=useState(false); const [confirm,setConfirm]=useState(false)
  const [loading,setLoading]=useState(true); const [saving,setSaving]=useState(false); const [error,setError]=useState(''); const [formError,setFormError]=useState(''); const [success,setSuccess]=useState('')
  const load=useCallback(async()=>{setLoading(true);try{const[a,p,u]=await Promise.all([ajustesApi.list(),getProductos(),ubicacionesApi.list()]);setItems(a);setProductos(p);setUbicaciones(u)}catch(e){setError(e.message)}finally{setLoading(false)}},[])
  useEffect(()=>{const timer=window.setTimeout(load,0);return()=>window.clearTimeout(timer)},[load])
  const apply=async()=>{setSaving(true);try{await ajustesApi.create({productoId:Number(form.productoId),ubicacionId:Number(form.ubicacionId),cantidadNueva:Number(form.cantidadNueva),motivo:form.motivo.trim(),claveIdempotencia:makeIdempotencyKey('ajuste-ui')});setConfirm(false);setOpen(false);setForm(empty);setSuccess('Ajuste aplicado correctamente.');await load()}catch(e){setConfirm(false);setFormError(e.message)}finally{setSaving(false)}}
  const option=(item)=>({value:item.id,label:item.codigo?`${item.codigo} · ${item.nombre}`:item.nombre})
  const columns=[{key:'id',label:'#'},{key:'producto',label:'Producto',render:item=>item.producto?.nombre},{key:'ubicacion',label:'Ubicación',render:item=>item.ubicacion?.nombre},{key:'anterior',label:'Anterior',render:item=>item.cantidadAnterior},{key:'nueva',label:'Nueva',render:item=>item.cantidadNueva},{key:'diferencia',label:'Diferencia',render:item=>(item.diferencia>0?'+':'')+item.diferencia},{key:'motivo',label:'Motivo'}]
  return <div className="page-stack">
    <div className="page-actions"><div><span className="eyebrow">INVENTARIO</span><h2>Ajustes de inventario</h2><p>Historial inmutable de correcciones aplicadas.</p></div><button className="button button--primary" onClick={()=>setOpen(true)}><Icon name="plus" size={17}/>Nuevo ajuste</button></div>
    {error&&<Alert>{error}</Alert>}{success&&<Alert type="success">{success}</Alert>}
    {!loading&&productos.length===0&&<Alert>No hay productos registrados. <Link to="/productos">Ir a Catálogos → Productos</Link>.</Alert>}
    <section className="panel table-panel"><DataTable rows={items} columns={columns} loading={loading}/></section>
    <EntityFormModal open={open} title="Nuevo ajuste" error={formError} saving={saving} submitDisabled={productos.length===0} onClose={()=>setOpen(false)} onSubmit={(event)=>{event.preventDefault();setConfirm(true)}} submitLabel="Revisar ajuste">
      {productos.length===0&&<Alert>No hay productos registrados. <Link to="/productos">Crear producto</Link>.</Alert>}
      <div className="form-grid"><FormField label="Producto" required as="select" value={form.productoId} onChange={(e)=>setForm({...form,productoId:e.target.value})} options={[{value:'',label:'Seleccione…'},...productos.map(option)]}/><FormField label="Ubicación" required as="select" value={form.ubicacionId} onChange={(e)=>setForm({...form,ubicacionId:e.target.value})} options={[{value:'',label:'Seleccione…'},...ubicaciones.filter(item=>item.activo).map(option)]}/><FormField label="Nueva cantidad" required type="number" min="0" step="1" value={form.cantidadNueva} onChange={(e)=>setForm({...form,cantidadNueva:e.target.value})}/></div>
      <FormField label="Motivo" required as="textarea" rows="3" maxLength="255" value={form.motivo} onChange={(e)=>setForm({...form,motivo:e.target.value})}/>
    </EntityFormModal>
    <ConfirmDialog open={confirm} title="Aplicar ajuste" message={`La existencia quedará en ${form.cantidadNueva||0} unidades. Esta acción no puede editarse ni eliminarse.`} loading={saving} onCancel={()=>setConfirm(false)} onConfirm={apply} confirmLabel="Aplicar ajuste" danger={false}/>
  </div>
}
