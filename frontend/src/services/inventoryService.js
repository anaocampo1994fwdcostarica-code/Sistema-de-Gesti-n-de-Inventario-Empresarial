import api from './api'

const data = (request) => request.then((response) => response.data)
const resource = (path) => ({
  list: () => data(api.get(path)),
  get: (id) => data(api.get(`${path}/${id}`)),
  create: (payload) => data(api.post(path, payload)),
  update: (id, payload) => data(api.put(`${path}/${id}`, payload)),
  remove: (id) => data(api.delete(`${path}/${id}`)),
})

export const clientesApi = resource('/api/clientes')
export const bodegasApi = resource('/api/bodegas')
export const tiposMovimientoApi = resource('/api/tipos-movimiento')
export const ubicacionesApi = resource('/api/ubicaciones')
export const existenciasApi = resource('/api/existencias')
export const movimientosApi = resource('/api/movimientos-inventario')
export const comprasApi = resource('/api/compras')
export const detallesComprasApi = resource('/api/detalles-compras')
export const ventasApi = resource('/api/ventas')
export const detallesVentasApi = resource('/api/detalles-ventas')
export const ajustesApi = resource('/api/ajustes-inventario')
export const usuariosApi = resource('/api/usuarios')

export const confirmCompra = (id, claveIdempotencia) => data(api.post(`/api/compras/${id}/confirmar`, { claveIdempotencia }))
export const confirmVenta = (id, claveIdempotencia) => data(api.post(`/api/ventas/${id}/confirmar`, { claveIdempotencia }))

export const makeIdempotencyKey = (prefix) => {
  const random = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`
  return `${prefix}-${random}`
}
