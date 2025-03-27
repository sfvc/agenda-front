import axios from 'axios'

const graficosApi = axios.create({
  // baseURL: `${import.meta.env.VITE_API_URL_GRAFICS}`
  baseURL: 'https://api.datos-agenda.cc.gob.ar/api'
})

graficosApi.interceptors.request.use(config => {
  config.headers = {
    ...config.headers
  }

  return config
})

export default graficosApi
