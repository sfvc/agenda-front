/* eslint-disable camelcase */
import { agendaApi } from '@/api'

export const fetchUser = async (page = 1) => {
  const response = await agendaApi.get(`/usuario?page=${page}`)
  return response.data
}

export const fetchUserById = async (id) => {
  const response = await agendaApi.get(`/usuario/${id}`)
  return response.data
}

export const createUser = async (event) => {
  const response = await agendaApi.post('/usuario', event)
  return response.data
}

export const updateUser = async (id, event) => {
  const response = await agendaApi.put(`/usuario/${id}`, event)
  return response.data
}

export const deleteUser = async (id) => {
  await agendaApi.delete(`/usuario/${id}`)
}

export const getUser = fetchUser
export const getUserById = fetchUserById
export const createUsuario = createUser
export const updateUsuario = updateUser
export const deleteUsuario = deleteUser
