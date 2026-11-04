import { NavLink } from 'react-router-dom'

const navigation = [
  { to: '/', label: 'Dashboard', icon: '▦', end: true },
  { to: '/productos', label: 'Productos', icon: '▣' },
  { to: '/categorias', label: 'Categorías', icon: '◫' },
  { to: '/proveedores', label: 'Proveedores', icon: '♙' },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      <aside className={`sidebar ${open ? 'sidebar--open' : ''}`} aria-label="Navegación principal">
        <div className="brand">
          <span className="brand__mark" aria-hidden="true">IE</span>
          <span><strong>Inventario</strong><small>Gestión empresarial</small></span>
        </div>
        <nav className="sidebar__nav">
          <p className="sidebar__label">MENÚ PRINCIPAL</p>
          {navigation.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} onClick={onClose} className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}>
              <span className="nav-link__icon" aria-hidden="true">{item.icon}</span>{item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar__footer"><span className="status-dot" /> API local</div>
      </aside>
      {open && <button className="sidebar-backdrop" onClick={onClose} aria-label="Cerrar menú" />}
    </>
  )
}
