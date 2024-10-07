/* eslint-disable camelcase */
import { agendaApi } from '@/api'

export const fetchEvents = async (page = 1, state = '', category = '', fecha_inicio = '', fecha_final = '') => {
  let url = '/evento?'
  if (state) {
    url += `estado=${state}&`
  }
  if (category) {
    url += `categoria_id=${category}&`
  }
  if (fecha_inicio) {
    url += `fecha_inicio=${fecha_inicio}&`
  }
  if (fecha_inicio) {
    url += `fecha_final=${fecha_final}&`
  }
  url += `page=${page}`
  const response = await agendaApi.get(url)
  return response.data
}

export const fetchEventById = async (id) => {
  const response = await agendaApi.get(`/evento/${id}`)
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

export const nextStageEvent = async (id, event) => {
  const response = await agendaApi.post(`/evento/${id}/nextstage`, event)
  return response
}

export const deleteEvent = async (id) => {
  await agendaApi.delete(`/evento/${id}`)
}

export const rejectEvent = async (id) => {
  await agendaApi.post(`/evento/${id}/rechazar`)
}

export const documentEvent = async (id, document) => {
  const response = await agendaApi.put(`/evento/${id}/documentos`, { documentos: document })
  return response.status
}

export const getEventos = fetchEvents
export const getEventoById = fetchEventById
export const createEvento = createEvent
export const updateEvento = updateEvent
