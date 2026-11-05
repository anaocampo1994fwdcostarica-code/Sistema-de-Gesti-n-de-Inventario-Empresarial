import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import Loading from './Loading'

export default function RutaProtegida() {
  const { authenticated, loading } = useAuth()
  const location = useLocation()
  if (loading) return <div className="auth-loading"><Loading label="Verificando sesión…" /></div>
  if (!authenticated) return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}
