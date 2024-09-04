import { agendaApi } from '@/api'

export const createContact = async (contact) => {
    console.log(contact);
    const response = await agendaApi.post('/contacto', contact)
    return response.data
  }

  export const fetchContact = async (page = 1) => {
    const response = await agendaApi.get(`/contacto?page=${page}`)
    console.log(response.data);
    return response.data
  }

  export const fetchContactById = async () => {
    const response = await agendaApi.get('/contacto/select')
    return response.data
  }


  export const updateContact = async (id, contact) => {
    const response = await agendaApi.put(`/contacto/${id}`, contact)
    return response.data
  }

export const getContacts = fetchContact
export const getContactsById = fetchContactById