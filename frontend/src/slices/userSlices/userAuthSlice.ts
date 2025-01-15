import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  phone: string;
  isVerified: boolean;
  isBlocked: boolean;
  token: string;
}

interface AuthState {
  userInfo: UserInfo | null;
}

const initialState: AuthState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo") as string)
    : null,
};
 
const authSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    clearCredentials: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
    },
    setToken: (state, action: PayloadAction<string>) => {
      if (state.userInfo) {
        state.userInfo.token = action.payload;
        localStorage.setItem("userInfo", JSON.stringify({ ...state.userInfo, token: action.payload }));
      }
    }
  },
});

export const { setCredentials, clearCredentials, setToken } = authSlice.actions;

export default authSlice.reducer;
