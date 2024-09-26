import { fetchGoogleAuthUrl } from '@/services/googleAuthService'
import { useQuery } from '@tanstack/react-query'

const GoogleAuth = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['googleAuthUrl'],
    queryFn: () => fetchGoogleAuthUrl()
  })

  const onClick = () => {
    window.location.href = data.url
  }

  return (
    <button
      onClick={onClick}
      className='flex items-center justify-center px-4 py-2 mt-4 text-white bg-red-600 rounded-lg shadow-md hover:bg-red-800 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
    >
      {isLoading ? 'Cargando...' : 'Autenticar'}
    </button>
  )
}

export default GoogleAuth
