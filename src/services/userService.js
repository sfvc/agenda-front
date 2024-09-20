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

export const loginUser = async (data) => {
  try {
    const response = await agendaApi.post('/authentication/login', data)
    localStorage.setItem('token', response.data.access_token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    return response.data
  } catch (error) {
    console.error('Error en loginUser:', error.response ? error.response.data : error.message)
    throw error
  }
}

export const renewToken = async () => {
  const response = await agendaApi.get('/authentication/profile')
  return response.data
}

export const getUser = fetchUser
export const getUserById = fetchUserById
export const createUsuario = createUser
export const updateUsuario = updateUser
export const deleteUsuario = deleteUser
