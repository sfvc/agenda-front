import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loading: false,
  userInfo: {}, // for user object
  error: null,
  success: false // for monitoring the registration process.
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: {}
})

export default authSlice.reducer
