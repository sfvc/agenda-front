import { fetchGoogleAuthUrl } from '../../../services/googleAuthService'
import { useQuery } from '@tanstack/react-query'

const GoogleAuth = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['googleAuthUrl'],
    queryFn: () => fetchGoogleAuthUrl()

  })
  const onClick = () => {
    window.location.href = data.url
  }
  return (
    <button onClick={onClick}>Google authentication</button>
  )
}
