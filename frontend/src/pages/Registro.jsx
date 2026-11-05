import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert } from '../components/Feedback'
import useAuth from '../hooks/useAuth'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Registro() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nombre: '', correo: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    const nombre = form.nombre.trim()
    const correo = form.correo.trim().toLowerCase()
    if (!nombre) return setError('El nombre es obligatorio.')
    if (!emailPattern.test(correo)) return setError('Ingresa un correo electrónico válido.')
    if (form.password.length < 8) return setError('La contraseña debe contener al menos 8 caracteres.')
    if (form.password !== form.confirmPassword) return setError('Las contraseñas no coinciden.')
    setSubmitting(true)
    setError('')
    try {
      await register({ nombre, correo, password: form.password })
      navigate('/login', { replace: true, state: { message: 'Cuenta creada correctamente. Ya puedes iniciar sesión.' } })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand"><span className="brand__mark">IE</span><div><strong>Inventario Empresarial</strong><small>Nueva cuenta</small></div></div>
        <div className="auth-card__header"><span className="eyebrow">REGISTRO</span><h1>Crear una cuenta</h1><p>Registra tus datos para acceder al sistema de inventario.</p></div>
        {error && <Alert>{error}</Alert>}
        <form className="form auth-form" onSubmit={submit}>
          <label>Nombre <span>*</span><input maxLength="100" autoComplete="name" value={form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} placeholder="Nombre completo" autoFocus /></label>
          <label>Correo electrónico <span>*</span><input type="email" maxLength="150" autoComplete="email" value={form.correo} onChange={(event) => setForm({ ...form, correo: event.target.value })} placeholder="correo@empresa.com" /></label>
          <div className="form-grid">
            <label>Contraseña <span>*</span><input type="password" minLength="8" autoComplete="new-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Mínimo 8 caracteres" /></label>
            <label>Confirmar contraseña <span>*</span><input type="password" minLength="8" autoComplete="new-password" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} placeholder="Repite la contraseña" /></label>
          </div>
          <button className="button button--primary auth-submit" disabled={submitting}>{submitting ? 'Creando cuenta…' : 'Registrarse'}</button>
        </form>
        <p className="auth-switch">¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link></p>
      </section>
    </main>
  )
}
