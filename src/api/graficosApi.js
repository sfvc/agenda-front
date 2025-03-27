import axios from 'axios'

const graficosApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL_GRAFICS}`
})

graficosApi.interceptors.request.use(config => {
  config.headers = {
    ...config.headers
  }

  return config
})

export default graficosApi
