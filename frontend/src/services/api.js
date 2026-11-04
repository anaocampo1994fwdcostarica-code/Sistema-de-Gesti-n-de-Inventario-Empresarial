import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
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

export default api
