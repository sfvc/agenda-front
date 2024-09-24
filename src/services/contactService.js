import { agendaApi } from '@/api'

export const createContact = async (contact) => {
  const response = await agendaApi.post('/contacto', contact)
  return response.data
}

export const fetchContact = async (page = 1) => {
  const response = await agendaApi.get(`/contacto?page=${page}`)

  return response.data
}

export const fetchContactById = async (id) => {
  const response = await agendaApi.get(`/contacto/${id}`)

  return response.data
}

export const searchContactName = async (name) => {
  const response = await agendaApi.get(`/contacto?nombre=${name}&page=1&size=10`)
  return response.data
}

export const searchContactFunction = async (name) => {
  const response = await agendaApi.get(`/contacto?funcion=${name}&page=1&size=50`)
  return response.data
}

export const updateContact = async (id, contact) => {
  const response = await agendaApi.patch(`/contacto/${id}`, contact)

  return response.data
}

export const getContacts = fetchContact
export const getContactsById = fetchContactById
