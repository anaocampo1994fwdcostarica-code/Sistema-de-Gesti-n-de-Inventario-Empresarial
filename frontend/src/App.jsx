import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Categorias from './pages/Categorias'
import Dashboard from './pages/Dashboard'
import Productos from './pages/Productos'
import Proveedores from './pages/Proveedores'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="productos" element={<Productos />} />
        <Route path="categorias" element={<Categorias />} />
        <Route path="proveedores" element={<Proveedores />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
