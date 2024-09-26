import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../thunks/useAuthStore'

const ProtectedRoute = ({ children }) => {
  const { status } = useAuthStore()

  if (status === 'checking') {
    return <div>Loading...</div>
  }

  if (status === 'not-authenticated') {
    return <Navigate to='/login' />
  }

  return children
}

export default ProtectedRoute
