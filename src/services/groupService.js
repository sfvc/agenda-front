import { agendaApi } from '@/api'

export const fetchGroup = async (page = 1) => {
  const response = await agendaApi.get(`/grupo?page=${page}`)
  return response.data
}

export const fetchGroupById = async (id) => {
  const response = await agendaApi.get(`/grupo/${id}`)
  return response.data
}

export const createGroup = async (Group) => {
  const response = await agendaApi.post('/grupo', Group)
  return response.data
}

export const updateGroup = async (id, Group) => {
  const response = await agendaApi.put(`/grupo/${id}`, Group)
  return response.data
}

export const deleteGroup = async (id, Group) => {
  const response = await agendaApi.delete(`/grupo/${id}`, Group)
  return response.data
}

export const getGroup = fetchGroup
export const getGroupById = fetchGroupById
