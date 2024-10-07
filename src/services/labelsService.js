import { agendaApi } from '@/api'

export const fetchLabels = async (page = 1) =>{
    const response = await  agendaApi.get(`/etiqueta?page=${page}`)
    return response.data
}

export const fetchLabelsBySelect = async (nombre) => {
    const response = await agendaApi.get(`/etiqueta/select?nombre=${nombre}`)
   
    return response.data
  }

  export const createLabels = async (label) => {
    const response = await agendaApi.post('/etiqueta', label)
    return response.data
  }