import { agendaApi } from '@/api'

export const uploadFile= async (formData)=>{
    const response = await agendaApi.post(`/upload`,formData)

    return response.data
}