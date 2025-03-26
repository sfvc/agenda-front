import axios from 'axios'

const graficosApi = axios.create({
  // baseURL: `${import.meta.env.VITE_API_URL_GRAFICS}`
  baseURL: 'http://137.184.4.18:7050/api'
})

graficosApi.interceptors.request.use(config => {
  config.headers = {
    ...config.headers
  }

  return config
})

export default graficosApi
