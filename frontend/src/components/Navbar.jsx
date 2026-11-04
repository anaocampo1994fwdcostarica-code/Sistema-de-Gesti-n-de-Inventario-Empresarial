import { useLocation } from 'react-router-dom'

const titles = {
  '/': ['Dashboard', 'Resumen general del inventario'],
  '/productos': ['Productos', 'Control de existencias y precios'],
  '/categorias': ['Categorías', 'Organización del catálogo'],
  '/proveedores': ['Proveedores', 'Directorio de abastecimiento'],
}

export default function Navbar({ onOpenMenu }) {
  const [title, subtitle] = titles[useLocation().pathname] || ['Inventario', 'Sistema empresarial']
  return (
    <header className="topbar">
      <button className="icon-button menu-button" onClick={onOpenMenu} aria-label="Abrir menú">☰</button>
      <div><h1>{title}</h1><p>{subtitle}</p></div>
      <div className="topbar__badge"><span className="status-dot" /> Sistema activo</div>
    </header>
  )
}
