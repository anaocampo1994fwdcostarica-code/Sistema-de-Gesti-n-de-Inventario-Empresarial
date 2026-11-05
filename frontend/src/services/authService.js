import api from './api'

export const loginRequest = async (credentials) => (await api.post('/api/auth/login', credentials)).data
export const registerRequest = async (data) => (await api.post('/api/auth/register', data)).data
export const getCurrentUser = async () => (await api.get('/api/auth/me')).data
