import api from './api'

export const getCategorias = async () => (await api.get('/api/categorias')).data
export const createCategoria = async (data) => (await api.post('/api/categorias', data)).data
export const updateCategoria = async (id, data) => (await api.put(`/api/categorias/${id}`, data)).data
export const deleteCategoria = async (id) => (await api.delete(`/api/categorias/${id}`)).data
