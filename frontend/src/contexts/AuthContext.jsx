import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from './auth-context'
import { clearStoredToken, getStoredToken, storeToken } from '../services/api'
import { getCurrentUser, loginRequest, registerRequest } from '../services/authService'

export default function AuthProvider({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [token, setToken] = useState(() => getStoredToken())
  const [usuario, setUsuario] = useState(null)
  const [loading, setLoading] = useState(true)

  const logout = useCallback(() => {
    clearStoredToken()
    setToken(null)
    setUsuario(null)
  }, [])

  useEffect(() => {
    let active = true
    const verifySession = async () => {
      const storedToken = getStoredToken()
      if (!storedToken) {
        if (active) setLoading(false)
        return
      }
      try {
        const currentUser = await getCurrentUser()
        if (active) {
          setToken(storedToken)
          setUsuario(currentUser)
        }
      } catch {
        if (active) logout()
      } finally {
        if (active) setLoading(false)
      }
    }
    verifySession()
    return () => { active = false }
  }, [logout])

  useEffect(() => {
    const handleUnauthorized = () => {
      logout()
      if (location.pathname !== '/login') {
        navigate('/login', { replace: true, state: { error: 'Tu sesión venció. Inicia sesión nuevamente.' } })
      }
    }
    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized)
  }, [location.pathname, logout, navigate])

  const login = useCallback(async (credentials) => {
    const response = await loginRequest(credentials)
    storeToken(response.token)
    setToken(response.token)
    setUsuario(response.usuario)
    return response.usuario
  }, [])

  const register = useCallback((data) => registerRequest(data), [])
  const refreshUser = useCallback(async () => {
    const currentUser = await getCurrentUser()
    setUsuario(currentUser)
    return currentUser
  }, [])
  const value = useMemo(() => ({ token, usuario, loading, authenticated: Boolean(token && usuario), login, register, logout, refreshUser }), [loading, login, logout, refreshUser, register, token, usuario])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
