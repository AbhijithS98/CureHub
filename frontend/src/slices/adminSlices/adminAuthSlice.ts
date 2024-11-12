import {  createSlice, PayloadAction  } from '@reduxjs/toolkit'

interface AdminInfo {
  adminId: string;
  token: string;
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
        },
        setAdminToken: (state, action: PayloadAction<string>) => {
            if (state.adminInfo) {
              state.adminInfo.token = action.payload;
              localStorage.setItem("adminInfo", JSON.stringify({ ...state.adminInfo, token: action.payload }));
            }
        }
    }
})

export const { setAdminCredentials, clearAdminCredentials, setAdminToken } = adminAuthSlice.actions
export default adminAuthSlice.reducer;