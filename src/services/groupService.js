import { agendaApi } from '@/api'

export const fetchGroup = async (page = 1) => {
  const response = await agendaApi.get(`/grupo?page=${page}`)
  return response.data
}

export const fetchGroupById = async (id, page) => {
  const response = await agendaApi.get(`/grupo/${id}`)
  return response.data
}

// export const fetchGroupBySelect = async () => {
//   const response = await agendaApi.get('/grupo/select')
//   return response.data
// }

export const createGroup = async (Group, page) => {
  const response = await agendaApi.post(`/grupo`, Group)
  return response.data
}

export const updateGroup = async (id, Group, page) => {
  const response = await agendaApi.put(`/grupo/${id}`, Group)
  return response.data
}

export const getGroup = fetchGroup
export const getGroupById = fetchGroupById
// export const getCategoryBySelect = fetchCategoryBySelect

