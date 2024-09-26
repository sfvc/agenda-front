/* eslint-disable camelcase */
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { handleLogin, handleLogout, onChecking, setErrorMessage } from '../store/auth'
import { agendaApi } from '@/api'

export const useAuthStore = () => {
  const { status, user } = useSelector(state => state.auth)
  const dispatch = useDispatch()

  const startLogin = async ({ username, password }) => {
    dispatch(onChecking())

    try {
      const { data: { access_token, user, googleAuth } } = await agendaApi.post('/authentication/login', { username, password })

      if (user) {
        localStorage.setItem('token', access_token)
        dispatch(handleLogin({ user, googleAuth }))
      } else {
        startLogout()
      }
    } catch (error) {
      let errorMessage = 'Error desconocido'
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = error.response.data.errors
        const firstErrorKey = Object.keys(errors)[0]
        errorMessage = errors[firstErrorKey][0]
      } else {
        errorMessage = error.message
      }

      console.error('Error en el inicio de sesión:', errorMessage)
      dispatch(setErrorMessage(errorMessage))
      toast.error(`No se pudo iniciar sesión: ${errorMessage}`)
      startLogout()
    }
  }

  const checkAuthToken = async () => {
    const access_token = localStorage.getItem('token')
    if (!access_token) return dispatch(handleLogout())

    try {
      const { data: { access_token, user, googleAuth } } = await agendaApi.get('/authentication/profile')
      localStorage.setItem('token', access_token)
      dispatch(handleLogin({ user, googleAuth }))
    } catch (error) {
      localStorage.clear()
      dispatch(handleLogout())
    }
  }

  const startLogout = () => {
    localStorage.clear()
    dispatch(handleLogout())
  }

  return {
    //* Propiedades
    status,
    user,

    //* Metodos
    startLogin,
    checkAuthToken,
    startLogout
  }
}
