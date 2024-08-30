import { agendaApi } from '@/api'

export const fetchCategory = async (page = 1) => {
  const response = await agendaApi.get(`/categoria?page=${page}`)
  return response.data
}

export const fetchCategoryById = async () => {
  const response = await agendaApi.get('/categoria/select')
  return response.data
}

export const createCategory = async (category) => {
  const response = await agendaApi.post('/categoria', category)
  return response.data
}

export const getCategory = fetchCategory
export const getCategoryById = fetchCategoryById
export const createCategoria = createCategory
