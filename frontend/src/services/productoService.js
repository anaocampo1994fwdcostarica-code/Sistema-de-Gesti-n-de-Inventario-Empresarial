import api from './api'

export const getProductos = async () => (await api.get('/api/productos')).data
export const createProducto = async (data) => (await api.post('/api/productos', data)).data
export const updateProducto = async (id, data) => (await api.put(`/api/productos/${id}`, data)).data
export const deleteProducto = async (id) => (await api.delete(`/api/productos/${id}`)).data
