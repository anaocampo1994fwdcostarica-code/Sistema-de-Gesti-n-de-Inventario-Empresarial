export default function Loading({ label = 'Cargando información…' }) {
  return <div className="loading" role="status"><span className="spinner" aria-hidden="true" /><span>{label}</span></div>
}
