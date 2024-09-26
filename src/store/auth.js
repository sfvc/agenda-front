/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
/* eslint-disable no-return-assign */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  status: 'checking', // authenticated, not-authenticated
  googleAuth: false,
  user: {},
  errorMessage: ''
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    onChecking: (state) => {
      state.status = 'checking'
      state.user = {}
      state.googleAuth = false
    },
    handleLogin: (state, { payload }) => {
      state.user = payload.user
      state.googleAuth = payload.googleAuth
      state.status = 'authenticated'
    },
    handleLogout: (state) => {
      state.status = 'not-authenticated'
      state.user = {}
      state.googleAuth = false
    },
    setErrorMessage: (state, { payload }) => {
      state.errorMessage = payload
    }
  }
})

export const {
  onChecking,
  handleLogin,
  handleLogout,
  setErrorMessage
} = authSlice.actions

export default authSlice.reducer
