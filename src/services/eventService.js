import { agendaApi } from '../api'

export const fetchEvents = async () => {
  const response = await agendaApi.get('/evento')
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

export const deleteEvent = async (id) => {
  await agendaApi.delete(`/evento/${id}`)
}

export const getEventos = fetchEvents
export const getEventoById = fetchEventById
export const createEvento = createEvent
export const updateEvento = updateEvent
