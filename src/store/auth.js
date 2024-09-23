import { createSlice } from '@reduxjs/toolkit'
import { loginUser } from '../thunks/auth'

const initialState = {
  loading: false,
  userInfo: {}, // for user object
  error: null,
  success: false // for monitoring the registration process.
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetState: () => initialState
  },
  extraReducers: {
    [loginUser.pending]: (state) => {
      state.loading = true
      state.error = null
    },
    [loginUser.fulfilled]: (state, { payload }) => {
      state.loading = false
      state.userInfo = payload.user
    },
    [loginUser.rejected]: (state, { payload }) => {
      state.loading = false
      state.error = payload
    }
  }
})

export const { resetState } = authSlice.actions
export default authSlice.reducer
