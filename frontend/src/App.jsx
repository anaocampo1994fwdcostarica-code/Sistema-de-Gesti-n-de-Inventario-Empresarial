import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import RutaProtegida from './components/RutaProtegida'
import useAuth from './hooks/useAuth'
import Categorias from './pages/Categorias'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Productos from './pages/Productos'
import Proveedores from './pages/Proveedores'
import Registro from './pages/Registro'

function RutaPublica({ children }) {
  const { authenticated, loading } = useAuth()
  if (loading) return null
  return authenticated ? <Navigate to="/" replace /> : children
}

export default function App() {
  return (
    <Routes>
      <Route path="login" element={<RutaPublica><Login /></RutaPublica>} />
      <Route path="registro" element={<RutaPublica><Registro /></RutaPublica>} />
      <Route element={<RutaProtegida />}>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="productos" element={<Productos />} />
          <Route path="categorias" element={<Categorias />} />
          <Route path="proveedores" element={<Proveedores />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
