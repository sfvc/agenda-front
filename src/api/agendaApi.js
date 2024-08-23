import axios from 'axios'

const AgendaApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`
})

AgendaApi.interceptors.request.use(config => {
  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }

  return config
})

export default AgendaApi
