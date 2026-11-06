import { useEffect, useMemo, useState } from 'react'
import DataTable from '../components/DataTable'
import { Alert } from '../components/Feedback'
import FormField from '../components/FormField'
import { existenciasApi } from '../services/inventoryService'

export default function Existencias() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [bodega, setBodega] = useState('')

  useEffect(() => {
    let active = true
    existenciasApi.list().then((records) => active && setItems(records)).catch((requestError) => active && setError(requestError.message)).finally(() => active && setLoading(false))
    return () => { active = false }
  }, [])

  const bodegas = useMemo(() => [...new Map(items.map((item) => [item.ubicacion?.bodega?.id, item.ubicacion?.bodega]).filter(([id]) => id)).values()], [items])
  const rows = useMemo(() => items.filter((item) => {
    const text = `${item.producto?.codigo} ${item.producto?.nombre} ${item.ubicacion?.codigo} ${item.ubicacion?.nombre}`.toLowerCase()
    return text.includes(query.toLowerCase()) && (!bodega || String(item.ubicacion?.bodega?.id) === bodega)
  }), [items, query, bodega])
  const columns = [
    { key: 'producto', label: 'Producto', render: (item) => <><span className="code-badge">{item.producto?.codigo}</span> {item.producto?.nombre}</> },
    { key: 'bodega', label: 'Bodega', render: (item) => item.ubicacion?.bodega?.nombre },
    { key: 'ubicacion', label: 'Ubicación', render: (item) => `${item.ubicacion?.codigo} · ${item.ubicacion?.nombre}` },
    { key: 'cantidad', label: 'Cantidad disponible', render: (item) => <span className={`stock-badge${Number(item.cantidad) === 0 ? ' stock-badge--empty' : ''}`}>{item.cantidad}</span> },
  ]

  return <div className="page-stack"><div className="page-actions"><div><span className="eyebrow">ALMACENES</span><h2>Existencias</h2><p>Consulta de cantidades; la escritura directa está deshabilitada.</p></div></div>{error && <Alert>{error}</Alert>}<section className="panel filter-panel"><div className="filter-panel__heading"><div><strong>Filtrar existencias</strong><span>Busca por producto, código o ubicación.</span></div></div><div className="filter-grid"><FormField label="Buscar producto o ubicación" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ej. monitor, A-01 o bodega central" /><FormField label="Bodega" as="select" value={bodega} onChange={(event) => setBodega(event.target.value)} options={[{ value: '', label: 'Todas las bodegas' }, ...bodegas.map((item) => ({ value: item.id, label: item.nombre }))]} /></div></section><section className="panel table-panel"><DataTable rows={rows} columns={columns} loading={loading} /></section></div>
}
