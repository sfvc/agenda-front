import { agendaApi } from '@/api'

export const fetchOrganizers = async (page = 1) => {
  const response = await agendaApi.get(`/organizador?page=${page}`)
  return response.data
}

export const fetchOrganizersBySelect = async (nombre = null) => {
  if (nombre == null) {
    const response = await agendaApi.get('/organizador/select')
    return response.data
  } else {
    const response = await agendaApi.get(`/organizador/select?nombre=${nombre}`)
    return response.data
  }
}

export const fetchOrganizersById = async (id) => {
  const response = await agendaApi.get(`/organizador/${id}`)
  return response.data
}

export const createOrganizers = async (label) => {
  const response = await agendaApi.post('/organizador', label)
  return response.data
}

export const updateOrganizers = async (id, label, page) => {
  const response = await agendaApi.put(`/organizador/${id}?page=${page}`, label)
  return response.data
}

export const deleteOrganizers = async (id, label) => {
  const response = await agendaApi.delete(`/organizador/${id}`, label)
  return response.data
}
