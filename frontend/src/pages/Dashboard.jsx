import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Alert } from '../components/Feedback'
import Loading from '../components/Loading'
import { getCategorias } from '../services/categoriaService'
import { getProductos } from '../services/productoService'
import { getProveedores } from '../services/proveedorService'

const cards = [
  { key: 'productos', label: 'Productos registrados', icon: '▣', tone: 'blue' },
  { key: 'categorias', label: 'Categorías activas', icon: '◫', tone: 'violet' },
  { key: 'proveedores', label: 'Proveedores', icon: '♙', tone: 'teal' },
  { key: 'unidades', label: 'Unidades disponibles', icon: '∑', tone: 'amber' },
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
        <div><span className="eyebrow">PANEL DE CONTROL</span><h2>Visión general de tu inventario</h2><p>Consulta los datos operativos registrados actualmente en el sistema.</p></div>
        <Link to="/productos" className="button button--primary">Gestionar productos <span>→</span></Link>
      </section>
      {error && <Alert onClose={() => setError('')}>{error}</Alert>}
      {!data && !error ? <Loading /> : data && (
        <section className="stat-grid" aria-label="Indicadores del inventario">
          {cards.map((card) => <article className="stat-card" key={card.key}><span className={`stat-card__icon stat-card__icon--${card.tone}`}>{card.icon}</span><div><p>{card.label}</p><strong>{data[card.key].toLocaleString('es-CR')}</strong></div></article>)}
        </section>
      )}
      <section className="panel">
        <div className="panel__header"><div><span className="eyebrow">ACCESOS RÁPIDOS</span><h2>Administración</h2></div></div>
        <div className="quick-grid">
          <Link to="/productos" className="quick-card"><span>▣</span><div><h3>Productos</h3><p>Existencias, códigos y precios</p></div><b>→</b></Link>
          <Link to="/categorias" className="quick-card"><span>◫</span><div><h3>Categorías</h3><p>Organiza tu catálogo</p></div><b>→</b></Link>
          <Link to="/proveedores" className="quick-card"><span>♙</span><div><h3>Proveedores</h3><p>Gestiona tus contactos</p></div><b>→</b></Link>
        </div>
      </section>
    </div>
  )
}
