import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Alert } from '../components/Feedback'
import Icon from '../components/Icon'
import logo from '../assets/inventario-logo.png'
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
    <main className="login-screen">
      <section className="login-pane">
        <div className="login-brand"><img className="brand__mark brand-logo" src={logo} alt="Logo de Inventario Empresarial" /><div><strong>Inventario Empresarial</strong><small>Acceso seguro</small></div></div>
        <div className="login-form-wrap">
          <div className="auth-card__header"><span className="eyebrow">BIENVENIDO</span><h1>Iniciar sesión</h1><p>Ingresa tus credenciales para administrar el inventario y las bodegas.</p></div>
          {location.state?.message && <Alert type="success">{location.state.message}</Alert>}
          {error && <Alert>{error}</Alert>}
          <form className="form auth-form login-form" onSubmit={submit}>
            <label>Correo electrónico <span>*</span><input type="email" maxLength="150" autoComplete="email" value={form.correo} onChange={(event) => setForm({ ...form, correo: event.target.value })} placeholder="correo@empresa.com" autoFocus /></label>
            <label>Contraseña <span>*</span><input type="password" autoComplete="current-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Tu contraseña" /></label>
            <button className="button button--primary auth-submit" disabled={submitting}>{submitting ? 'Iniciando sesión…' : <>Iniciar sesión <Icon name="arrow" size={16} /></>}</button>
          </form>
          <p className="auth-switch">¿No tienes una cuenta? <Link to="/registro">Regístrate</Link></p>
        </div>
        <footer className="login-footer"><span>Acceso protegido mediante JWT</span><span className="login-footer__secure">Conexión segura</span></footer>
      </section>

      <aside className="login-showcase" aria-label="Presentación del sistema">
        <div className="login-showcase__pattern" />
        <div className="login-showcase__top"><span className="showcase-status"><i /> Sistema empresarial · En línea</span><span>v1.0 · Enterprise</span></div>
        <div className="login-showcase__content">
          <span className="showcase-kicker">CONTROL OPERATIVO</span>
          <h2>Control de inventario e<br />inventarios en tiempo real</h2>
          <p>Gestión inteligente de productos, bodegas y movimientos con trazabilidad completa.</p>
          <div className="showcase-metrics">
            <article><span>Arquitectura empresarial</span><strong>15</strong><small>entidades integradas</small></article>
            <article><span>Calidad verificada</span><strong>30</strong><small>pruebas aprobadas</small></article>
          </div>
          <div className="showcase-feature"><span><Icon name="check" size={17} /></span><div><strong>Transacciones automáticas activas</strong><small>Existencias, compras, ventas y ajustes protegidos</small></div></div>
        </div>
        <div className="login-showcase__footer"><span>Plataforma de alta disponibilidad para gestión empresarial</span><strong>ISO · JWT</strong></div>
      </aside>
    </main>
  )
}
