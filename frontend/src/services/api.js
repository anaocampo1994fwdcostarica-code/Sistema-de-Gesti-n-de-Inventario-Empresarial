import axios from 'axios'

export const AUTH_TOKEN_KEY = 'inventario_auth_token'
export const getStoredToken = () => sessionStorage.getItem(AUTH_TOKEN_KEY)
export const storeToken = (token) => sessionStorage.setItem(AUTH_TOKEN_KEY, token)
export const clearStoredToken = () => sessionStorage.removeItem(AUTH_TOKEN_KEY)

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3004',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

const publicAuthPaths = ['/api/auth/login', '/api/auth/register']

api.interceptors.request.use((config) => {
  const path = String(config.url || '').split('?')[0]
  const isPublicAuthRequest = publicAuthPaths.some((publicPath) => path.endsWith(publicPath))
  const token = getStoredToken()
  if (token && !isPublicAuthRequest) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const path = String(error.config?.url || '').split('?')[0]
    const isPublicAuthRequest = publicAuthPaths.some((publicPath) => path.endsWith(publicPath))
    if (error.response?.status === 401 && !isPublicAuthRequest) {
      clearStoredToken()
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    }

    const apiError = new Error(
      error.response?.data?.error ||
        (error.code === 'ECONNABORTED'
          ? 'La solicitud tardó demasiado tiempo.'
          : 'No fue posible conectar con el servidor.'),
    )
    apiError.status = error.response?.status
    apiError.details = error.response?.data?.details
    return Promise.reject(apiError)
  },
)

export const checkApiHealth = async () => (await api.get('/api/health')).data

export default api
