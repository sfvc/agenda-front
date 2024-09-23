import { createAsyncThunk } from '@reduxjs/toolkit'
import { agendaApi } from '@/api'

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ username, password, navigate }, { rejectWithValue }) => {
    try {
      const { data } = await agendaApi.post('authentication/login',
        { username, password }
      )
      localStorage.setItem('token', data.access_token)
      navigate('/dashboard')
      return data
    } catch (error) {
    // return custom error message from backend if present
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message)
      } else {
        return rejectWithValue(error.message)
      }
    }
  }
)
