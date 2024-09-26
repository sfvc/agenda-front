import { agendaApi } from '@/api'

export const fetchGoogleAuthUrl = async () => {
  const response = await agendaApi.get('/auth/auth')
  return response.data
}
