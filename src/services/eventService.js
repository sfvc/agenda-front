import { agendaApi } from '@/api'

export const fetchEvents = async (page = 1) => {
  const response = await agendaApi.get(`/evento?page=${page}`)
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

export const nextStageEvent = async (id,event)=>{
  console.log(id,event);
  const response = await agendaApi.post(`/evento/${id}/nextstage`,event)
  return response
}
export const deleteEvent = async (id) => {
  await agendaApi.delete(`/evento/${id}`)
}


export const getEventos = fetchEvents
export const getEventoById = fetchEventById
export const createEvento = createEvent
export const updateEvento = updateEvent
