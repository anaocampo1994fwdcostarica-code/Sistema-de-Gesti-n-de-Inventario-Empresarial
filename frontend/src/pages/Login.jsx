import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Alert } from '../components/Feedback'
import useAuth from '../hooks/useAuth'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ correo: '', password: '' })
  const [error, setError] = useState(location.state?.error || '')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    const correo = form.correo.trim().toLowerCase()
    if (!emailPattern.test(correo)) return setError('Ingresa un correo electrónico válido.')
    if (!form.password) return setError('La contraseña es obligatoria.')
    setSubmitting(true)
    setError('')
    try {
      await login({ correo, password: form.password })
      navigate(location.state?.from?.pathname || '/', { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand"><span className="brand__mark">IE</span><div><strong>Inventario Empresarial</strong><small>Acceso seguro</small></div></div>
        <div className="auth-card__header"><span className="eyebrow">BIENVENIDO</span><h1>Iniciar sesión</h1><p>Ingresa tus credenciales para administrar el inventario.</p></div>
        {location.state?.message && <Alert type="success">{location.state.message}</Alert>}
        {error && <Alert>{error}</Alert>}
        <form className="form auth-form" onSubmit={submit}>
          <label>Correo electrónico <span>*</span><input type="email" maxLength="150" autoComplete="email" value={form.correo} onChange={(event) => setForm({ ...form, correo: event.target.value })} placeholder="correo@empresa.com" autoFocus /></label>
          <label>Contraseña <span>*</span><input type="password" autoComplete="current-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Tu contraseña" /></label>
          <button className="button button--primary auth-submit" disabled={submitting}>{submitting ? 'Iniciando sesión…' : 'Iniciar sesión'}</button>
        </form>
        <p className="auth-switch">¿No tienes una cuenta? <Link to="/registro">Regístrate</Link></p>
      </section>
    </main>
  )
}
