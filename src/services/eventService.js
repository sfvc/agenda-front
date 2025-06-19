/* eslint-disable camelcase */
import { agendaApi } from '@/api'

export const fetchEvents = async (page = '', circuito = '', state = '', category = '', fecha_inicio = '', fecha_final = '', barrio = '', etiquetas_ids = '', organizadores_ids = '') => {
  const params = new URLSearchParams()

  // Solo agregar parámetros si tienen valor
  if (circuito) params.append('circuito', circuito)
  if (barrio) params.append('barrio', barrio)
  if (etiquetas_ids) params.append('etiquetas_ids', etiquetas_ids)
  if (organizadores_ids) params.append('organizadores_ids', organizadores_ids)
  if (state) params.append('estado', state)
  if (category) params.append('categoria_id', category)
  if (fecha_inicio) params.append('fecha_inicio', fecha_inicio)
  if (fecha_final) params.append('fecha_final', fecha_final)

  // Siempre agregar la paginación
  params.append('page', page)

  // Construir la URL con los parámetros
  const url = `/evento?${params.toString()}`

  // Realizar la petición
  const response = await agendaApi.get(url)

  return response.data
}

export const fetchEventById = async (id, page) => {
  const response = await agendaApi.get(`/evento/${id}?page=${page}`)
  return response.data
}

export const createEvent = async (event) => {
  const response = await agendaApi.post('/evento', event)
  return response.data
}

export const updateEvent = async (id, event) => {
  const response = await agendaApi.put(`/evento/${id}`, event)
  return response.data
}

export const nextStageEvent = async (id, event, page) => {
  const response = await agendaApi.post(`/evento/${id}/nextstage?page=${page}`, event)
  return response
}

export const deleteEvent = async (id, page) => {
  await agendaApi.delete(`/evento/${id}?page=${page}`)
}

export const rejectEvent = async (id, page) => {
  await agendaApi.post(`/evento/${id}/rechazar?page=${page}`)
}

export const documentEvent = async (id, document, page) => {
  const response = await agendaApi.put(`/evento/${id}/documentos?page=${page}`, { documentos: document })
  return response.status
}

export const fetchStats = async () => {
  const response = await agendaApi.get('/evento/estadisticas')
  return response.data
}

// export const fetchGrafics = async () => {
//   const response = await agendaApi.get('/evento/estadisticas')
//   return response.data
// }

export const addContacts = async (id, event) => {
  const response = await agendaApi.put(`/evento/${id}/contactos`, event)
  return response.data
}

export const getEventos = fetchEvents
export const getEventoById = fetchEventById
export const createEvento = createEvent
export const updateEvento = updateEvent
