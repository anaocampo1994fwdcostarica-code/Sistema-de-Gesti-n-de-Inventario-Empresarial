import { useEffect, useMemo, useState } from 'react'
import DataTable from '../components/DataTable'
import { Alert } from '../components/Feedback'
import FormField from '../components/FormField'
import { existenciasApi } from '../services/inventoryService'

export default function Existencias(){
  const [items,setItems]=useState([]);const [loading,setLoading]=useState(true);const [error,setError]=useState('');const [query,setQuery]=useState('');const [bodega,setBodega]=useState('')
  useEffect(()=>{let active=true;existenciasApi.list().then((x)=>active&&setItems(x)).catch((e)=>active&&setError(e.message)).finally(()=>active&&setLoading(false));return()=>{active=false}},[])
  const bodegas=useMemo(()=>[...new Map(items.map((x)=>[x.ubicacion?.bodega?.id,x.ubicacion?.bodega]).filter(([id])=>id)).values()], [items])
  const rows=useMemo(()=>items.filter((x)=>{const text=`${x.producto?.codigo} ${x.producto?.nombre} ${x.ubicacion?.codigo} ${x.ubicacion?.nombre}`.toLowerCase();return text.includes(query.toLowerCase())&&(!bodega||String(x.ubicacion?.bodega?.id)===bodega)}),[items,query,bodega])
  const columns=[{key:'producto',label:'Producto',render:(x)=><><span className="code-badge">{x.producto?.codigo}</span> {x.producto?.nombre}</>},{key:'bodega',label:'Bodega',render:(x)=>x.ubicacion?.bodega?.nombre},{key:'ubicacion',label:'Ubicación',render:(x)=>`${x.ubicacion?.codigo} · ${x.ubicacion?.nombre}`},{key:'cantidad',label:'Cantidad disponible',render:(x)=><span className={`stock-badge${Number(x.cantidad)===0?' stock-badge--empty':''}`}>{x.cantidad}</span>}]
  return <div className="page-stack"><div className="page-actions"><div><span className="eyebrow">ALMACENES</span><h2>Existencias</h2><p>Consulta de cantidades; la escritura directa está deshabilitada.</p></div></div>{error&&<Alert>{error}</Alert>}<section className="panel filter-panel"><div className="form-grid"><FormField label="Buscar" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Producto o ubicación"/><FormField label="Bodega" as="select" value={bodega} onChange={(e)=>setBodega(e.target.value)} options={[{value:'',label:'Todas'},...bodegas.map(x=>({value:x.id,label:x.nombre}))]}/></div></section><section className="panel table-panel"><DataTable rows={rows} columns={columns} loading={loading}/></section></div>
}
