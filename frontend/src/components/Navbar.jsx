import { useCallback, useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { checkApiHealth } from '../services/api'
import Icon from './Icon'

const links = [
  { to: '/', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/productos', label: 'Productos', icon: 'product' },
  { to: '/categorias', label: 'Categorías', icon: 'category' },
  { to: '/proveedores', label: 'Proveedores', icon: 'supplier' },
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, usuario } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [apiStatus, setApiStatus] = useState('checking')

  const checkConnection = useCallback(async () => {
    setApiStatus('checking')
    try {
      const response = await checkApiHealth()
      setApiStatus(response?.status === 'ok' ? 'online' : 'offline')
    } catch {
      setApiStatus('offline')
    }
  }, [])

  useEffect(() => {
    const initialCheck = window.setTimeout(checkConnection, 0)
    const timer = window.setInterval(checkConnection, 30000)
    return () => {
      window.clearTimeout(initialCheck)
      window.clearInterval(timer)
    }
  }, [checkConnection])

  useEffect(() => {
    const closeMenu = () => setMenuOpen(false)
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeMenu()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const closeAfterNavigation = window.setTimeout(() => setMenuOpen(false), 0)
    return () => window.clearTimeout(closeAfterNavigation)
  }, [location.pathname])

  const statusText = apiStatus === 'online' ? 'API conectada' : apiStatus === 'offline' ? 'API sin conexión' : 'Verificando API'

  const navLinks = links.map((link) => (
    <NavLink key={link.to} to={link.to} end={link.end} className={({ isActive }) => `topnav__link${isActive ? ' topnav__link--active' : ''}`}>
      <Icon name={link.icon} size={16} />
      {link.label}
    </NavLink>
  ))

  const connectionButton = (
    <button className={`connection-badge connection-badge--${apiStatus}`} onClick={checkConnection} title="Volver a comprobar la conexión">
      <span className="connection-badge__signal"><Icon name={apiStatus === 'checking' ? 'refresh' : 'wifi'} size={15} /></span>
      <span><strong>{statusText}</strong><small>localhost:3004</small></span>
    </button>
  )

  const closeSession = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const sessionControls = (
    <div className="session-controls">
      <span className="session-user" title={usuario?.correo}>{usuario?.nombre}</span>
      <button className="logout-button" onClick={closeSession}>Cerrar sesión</button>
    </div>
  )

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <NavLink to="/" className="brand" aria-label="Ir al Dashboard de Inventario Empresarial">
          <span className="brand__mark">IE</span>
          <span><strong>Inventario Empresarial</strong><small>Gestión de inventario</small></span>
        </NavLink>
        <nav className="topnav" aria-label="Navegación principal">{navLinks}</nav>
        <div className="desktop-connection">{connectionButton}</div>
        <div className="desktop-session">{sessionControls}</div>
        <button className="icon-button menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen} aria-controls="mobile-navigation">
          <Icon name={menuOpen ? 'close' : 'menu'} />
        </button>
      </div>
      <div id="mobile-navigation" className={`mobile-navigation${menuOpen ? ' mobile-navigation--open' : ''}`} aria-hidden={!menuOpen}>
        <nav aria-label="Navegación móvil">{navLinks}</nav>
        <div className="mobile-connection">{connectionButton}</div>
        <div className="mobile-session">{sessionControls}</div>
      </div>
    </header>
  )
}
