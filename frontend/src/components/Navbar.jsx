import { useCallback, useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { checkApiHealth } from '../services/api'
import logo from '../assets/inventario-logo.png'
import Icon from './Icon'

const groups = [
  { label: 'Catálogos', links: [['/productos', 'Productos'], ['/categorias', 'Categorías'], ['/proveedores', 'Proveedores'], ['/clientes', 'Clientes']] },
  { label: 'Almacenes', links: [['/bodegas', 'Bodegas'], ['/ubicaciones', 'Ubicaciones'], ['/existencias', 'Existencias']] },
  { label: 'Inventario', links: [['/movimientos', 'Movimientos'], ['/tipos-movimiento', 'Tipos de movimiento'], ['/ajustes', 'Ajustes']] },
  { label: 'Operaciones', links: [['/compras', 'Compras'], ['/ventas', 'Ventas']] },
  { label: 'Administración', links: [['/mi-cuenta', 'Mi cuenta']] },
]

function LinkItem({ to, label, onClick }) {
  return <NavLink to={to} end={to === '/'} onClick={onClick} className={({ isActive }) => `topnav__link${isActive ? ' topnav__link--active' : ''}`}>{label}</NavLink>
}

function MenuGroup({ group, open, onToggle, onOpen, onClose, onNavigate }) {
  return <div className={`nav-group${open ? ' nav-group--open' : ''}`} onPointerEnter={(event) => { if (event.pointerType === 'mouse') onOpen() }} onPointerLeave={(event) => { if (event.pointerType === 'mouse') onClose() }} onKeyDown={(event) => { if (event.key === 'Escape') onClose() }}>
    <button type="button" className="nav-group__trigger" aria-haspopup="true" aria-expanded={open} onClick={onToggle} onKeyDown={(event) => { if (event.key === 'Escape') onClose() }}>{group.label}<span aria-hidden="true">⌄</span></button>
    <div className="nav-group__menu" role="menu" aria-label={group.label}>{group.links.map(([to, label]) => <LinkItem key={to} to={to} label={label} onClick={onNavigate} />)}</div>
  </div>
}

export default function Navbar() {
  const navigate = useNavigate()
  const { logout, usuario } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null)
  const [apiStatus, setApiStatus] = useState('checking')
  const checkConnection = useCallback(async () => { setApiStatus('checking'); try { const response = await checkApiHealth(); setApiStatus(response?.status === 'ok' ? 'online' : 'offline') } catch { setApiStatus('offline') } }, [])

  useEffect(() => { const initial = window.setTimeout(checkConnection, 0); const timer = window.setInterval(checkConnection, 30000); return () => { window.clearTimeout(initial); window.clearInterval(timer) } }, [checkConnection])

  const closeNavigation = () => { setMobileOpen(false); setActiveMenu(null) }
  const closeSession = () => { logout(); navigate('/login', { replace: true }) }
  const navigation = <><LinkItem to="/" label="Inicio" onClick={closeNavigation} />{groups.map((group) => <MenuGroup key={group.label} group={group} open={activeMenu === group.label} onToggle={() => setActiveMenu((current) => current === group.label ? null : group.label)} onOpen={() => setActiveMenu(group.label)} onClose={() => setActiveMenu(null)} onNavigate={closeNavigation} />)}</>

  return <header className="site-header"><div className="site-header__inner"><NavLink to="/" className="brand"><img className="brand__mark brand-logo" src={logo} alt="Logo de Inventario Empresarial" /><span><strong>Inventario Empresarial</strong><small>Gestión de inventario</small></span></NavLink><nav className="topnav" aria-label="Navegación principal">{navigation}</nav><button className={`connection-dot connection-dot--${apiStatus}`} onClick={checkConnection} title={`API ${apiStatus}`} aria-label="Comprobar conexión con la API" /><div className="desktop-session"><span className="session-user">{usuario?.nombre}</span><button className="logout-button" onClick={closeSession}>Cerrar sesión</button></div><button className="icon-button menu-button" onClick={() => setMobileOpen((current) => !current)} aria-label="Abrir menú" aria-expanded={mobileOpen}><Icon name={mobileOpen ? 'close' : 'menu'} /></button></div><div className={`mobile-navigation${mobileOpen ? ' mobile-navigation--open' : ''}`}><nav aria-label="Navegación móvil">{navigation}</nav><div className="mobile-session"><span className="session-user">{usuario?.nombre}</span><button className="logout-button" onClick={closeSession}>Cerrar sesión</button></div></div></header>
}
