import {  createSlice } from '@reduxjs/toolkit'

interface AdminInfo {
  adminId: string;
}

interface AdminAuthState {
  adminInfo: AdminInfo | null;
}

const initialState: AdminAuthState = {
    adminInfo : localStorage.getItem('adminInfo') ? 
        JSON.parse(localStorage.getItem('adminInfo') as string) : null
}

const adminAuthSlice = createSlice({
    name : 'adminAuth',
    initialState,
    reducers: {
        setAdminCredentials : (state, action) => {
            state.adminInfo = action.payload
            localStorage.setItem('adminInfo', JSON.stringify(action.payload))
        },
        clearAdminCredentials : (state) => {
            state.adminInfo = null
            localStorage.removeItem('adminInfo')
        }
    }
})

export const { setAdminCredentials, clearAdminCredentials } = adminAuthSlice.actions
export default adminAuthSlice.reducer;