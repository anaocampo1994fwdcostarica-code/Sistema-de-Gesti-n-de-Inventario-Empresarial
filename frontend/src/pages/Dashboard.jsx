import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Alert } from '../components/Feedback'
import Loading from '../components/Loading'
import Icon from '../components/Icon'
import { getCategorias } from '../services/categoriaService'
import { getProductos } from '../services/productoService'
import { getProveedores } from '../services/proveedorService'

const cards = [
  { key: 'productos', label: 'Productos registrados', icon: 'product', accent: 'petroleum' },
  { key: 'categorias', label: 'Categorías activas', icon: 'category', accent: 'orange' },
  { key: 'proveedores', label: 'Proveedores', icon: 'supplier', accent: 'gold' },
  { key: 'unidades', label: 'Unidades disponibles', icon: 'units', accent: 'petroleum' },
]

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    Promise.all([getProductos(), getCategorias(), getProveedores()])
      .then(([productos, categorias, proveedores]) => {
        if (!active) return
        setData({ productos: productos.length, categorias: categorias.length, proveedores: proveedores.length, unidades: productos.reduce((total, producto) => total + Number(producto.cantidad || 0), 0) })
      })
      .catch((requestError) => { if (active) setError(requestError.message) })
    return () => { active = false }
  }, [])

  return (
    <div className="page-stack">
      <section className="welcome-panel">
        <div><span className="eyebrow">PANEL DE CONTROL</span><h2>Control preciso. Decisiones claras.</h2><p>Una vista consolidada de los datos operativos registrados en tu inventario.</p></div>
        <Link to="/productos" className="button button--primary">Gestionar productos <Icon name="arrow" size={17} /></Link>
      </section>
      {error && <Alert onClose={() => setError('')}>{error}</Alert>}
      {!data && !error ? <Loading /> : data && (
        <section className="stat-grid" aria-label="Indicadores del inventario">
          {cards.map((card) => <article className={`stat-card stat-card--${card.accent}`} key={card.key}><span className="stat-card__icon"><Icon name={card.icon} size={21} /></span><div><p>{card.label}</p><strong>{data[card.key].toLocaleString('es-CR')}</strong></div></article>)}
        </section>
      )}
      <section className="panel">
        <div className="panel__header"><div><span className="eyebrow">ACCESOS RÁPIDOS</span><h2>Administración</h2></div></div>
        <div className="quick-grid">
          <Link to="/productos" className="quick-card"><span><Icon name="product" /></span><div><h3>Productos</h3><p>Existencias, códigos y precios</p></div><Icon name="arrow" size={18} /></Link>
          <Link to="/categorias" className="quick-card"><span><Icon name="category" /></span><div><h3>Categorías</h3><p>Organiza tu catálogo</p></div><Icon name="arrow" size={18} /></Link>
          <Link to="/proveedores" className="quick-card"><span><Icon name="supplier" /></span><div><h3>Proveedores</h3><p>Gestiona tus contactos</p></div><Icon name="arrow" size={18} /></Link>
        </div>
      </section>
    </div>
  )
}
