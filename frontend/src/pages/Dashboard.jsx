import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Alert } from '../components/Feedback'
import Icon from '../components/Icon'
import Loading from '../components/Loading'
import { getCategorias } from '../services/categoriaService'
import { getProductos } from '../services/productoService'
import { getProveedores } from '../services/proveedorService'
import { bodegasApi, clientesApi, comprasApi, existenciasApi, ventasApi } from '../services/inventoryService'

const money = new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 })

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    Promise.all([getProductos(), getCategorias(), getProveedores(), clientesApi.list(), bodegasApi.list(), existenciasApi.list(), comprasApi.list(), ventasApi.list()])
      .then(([productos, categorias, proveedores, clientes, bodegas, existencias, compras, ventas]) => active && setData({
        productos: productos.length, categorias: categorias.length, proveedores: proveedores.length, clientes: clientes.length, bodegas: bodegas.length,
        unidades: existencias.reduce((total, item) => total + Number(item.cantidad || 0), 0),
        valor: productos.reduce((total, item) => total + Number(item.precio || 0) * Number(item.cantidad || 0), 0),
        compras: compras.length, ventas: ventas.length,
        totalCompras: compras.reduce((total, item) => total + Number(item.total || 0), 0),
        totalVentas: ventas.reduce((total, item) => total + Number(item.total || 0), 0),
      })).catch((requestError) => active && setError(requestError.message))
    return () => { active = false }
  }, [])

  return <div className="page-stack dashboard-page">
    <section className="dashboard-heading"><div><span className="eyebrow">CENTRO DE CONTROL</span><h1>Panorama de inventario</h1><p>Indicadores operativos calculados con información real del sistema.</p></div><div className="dashboard-heading__actions"><Link to="/productos" className="button button--secondary"><Icon name="plus" size={17} />Nuevo producto</Link><Link to="/movimientos" className="button button--primary"><Icon name="arrow" size={17} />Registrar movimiento</Link></div></section>
    {error && <Alert>{error}</Alert>}
    {!data && !error ? <Loading /> : data && <>
      <section className="bento-grid">
        <article className="bento-card bento-card--featured"><span className="bento-card__icon"><Icon name="product" size={22} /></span><div className="bento-card__label">Valor del inventario</div><strong>{money.format(data.valor)}</strong><p>{data.productos} productos registrados en el catálogo.</p><div className="bento-progress"><span style={{ width: data.productos ? '72%' : '0%' }} /></div></article>
        <article className="bento-card"><span className="bento-card__icon bento-card__icon--green"><Icon name="units" size={22} /></span><div className="bento-card__label">Unidades disponibles</div><strong>{data.unidades.toLocaleString('es-CR')} <small>uds</small></strong><span className="health-badge">Inventario sincronizado</span></article>
        <article className="bento-card bento-card--wide"><span className="bento-card__icon"><Icon name="arrow" size={22} /></span><div className="bento-card__label">Flujo comercial</div><div className="flow-grid"><div><span>Compras</span><strong>{data.compras}</strong><small>{money.format(data.totalCompras)}</small></div><div><span>Ventas</span><strong>{data.ventas}</strong><small>{money.format(data.totalVentas)}</small></div></div></article>
        <article className="bento-card bento-card--wide"><span className="bento-card__icon"><Icon name="supplier" size={22} /></span><div className="bento-card__label">Red y directorio</div><div className="network-grid"><span><strong>{data.categorias}</strong>Categorías</span><span><strong>{data.proveedores}</strong>Proveedores</span><span><strong>{data.clientes}</strong>Clientes</span><span><strong>{data.bodegas}</strong>Bodegas</span></div></article>
      </section>
      <section className="panel operations-panel"><div className="panel__header"><div><span className="eyebrow">OPERACIÓN DIARIA</span><h2>Accesos rápidos</h2></div><span className="panel__meta">Información actualizada</span></div><div className="quick-grid">
        <Link to="/existencias" className="quick-card"><span><Icon name="units" /></span><div><h3>Consultar existencias</h3><p>Disponibilidad por producto y ubicación</p></div><Icon name="arrow" size={17} /></Link>
        <Link to="/compras" className="quick-card"><span><Icon name="supplier" /></span><div><h3>Gestionar compras</h3><p>Recepciones y documentos de entrada</p></div><Icon name="arrow" size={17} /></Link>
        <Link to="/ventas" className="quick-card"><span><Icon name="product" /></span><div><h3>Gestionar ventas</h3><p>Despachos y documentos de salida</p></div><Icon name="arrow" size={17} /></Link>
      </div></section>
    </>}
  </div>
}
