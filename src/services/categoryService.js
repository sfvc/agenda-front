import { agendaApi } from '@/api'

export const fetchCategory = async (page = 1) => {
  const response = await agendaApi.get(`/categoria?page=${page}`)
  return response.data
}

export const fetchCategoryById = async (id, page) => {
  const response = await agendaApi.get(`/categoria/${id}?page=${page}`)
  return response.data
}

export const fetchCategoryBySelect = async () => {
  const response = await agendaApi.get('/categoria/select')
  return response.data
}

export const createCategory = async (category, page) => {
  const response = await agendaApi.post(`/categoria?page=${page}`, category)
  return response.data
}

export const updateCategory = async (id, category, page) => {
  const response = await agendaApi.put(`/categoria/${id}?page=${page}`, category)
  return response.data
}

export const deleteCategory = async (id, category) => {
  const response = await agendaApi.delete(`/categoria/${id}`, category)
  return response.data
}

export const getCategory = fetchCategory
export const getCategoryById = fetchCategoryById
export const getCategoryBySelect = fetchCategoryBySelect
export const createCategoria = createCategory
export const updateCategoria = updateCategory
