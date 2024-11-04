import { agendaApi } from '@/api'

export const fetchLabels = async (page = 1) => {
  const response = await agendaApi.get(`/etiqueta?page=${page}`)
  return response.data
}

export const fetchLabelsBySelect = async (nombre = null) => {
  if (nombre == null) {
    const response = await agendaApi.get('/etiqueta/select')
    return response.data
  } else {
    const response = await agendaApi.get(`/etiqueta/select?nombre=${nombre}`)
    return response.data
  }
}

export const fetchLabelsById = async (id) => {
  const response = await agendaApi.get(`/etiqueta/${id}`)
  return response.data
}

export const createLabels = async (label) => {
  const response = await agendaApi.post('/etiqueta', label)
  return response.data
}

export const updateLabels = async (id, label, page) => {
  const response = await agendaApi.put(`/etiqueta/${id}?page=${page}`, label)
  return response.data
}

export const deleteLabels = async (id, label) => {
  const response = await agendaApi.delete(`/etiqueta/${id}`, label)
  return response.data
}
