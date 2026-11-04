import api from './api'

export const getProveedores = async () => (await api.get('/api/proveedores')).data
export const createProveedor = async (data) => (await api.post('/api/proveedores', data)).data
export const updateProveedor = async (id, data) => (await api.put(`/api/proveedores/${id}`, data)).data
export const deleteProveedor = async (id) => (await api.delete(`/api/proveedores/${id}`)).data
