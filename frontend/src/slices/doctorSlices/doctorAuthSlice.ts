import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface doctorInfo {
  _id: string;
  name: string;
  email: string;
  specialization: string;
  medicalLicenseNumber: string; 
  experience: number;
  phone: string;
  isVerified: boolean;
  isApproved: boolean;
  isBlocked: boolean;
  token: string;
}

interface DoctorAuthState {
  doctorInfo: doctorInfo | null;
}

const initialState: DoctorAuthState = {
  doctorInfo: localStorage.getItem("doctorInfo")
    ? JSON.parse(localStorage.getItem("doctorInfo") as string)
    : null,
};

const doctorAuthSlice = createSlice({
  name: "doctorAuth",
  initialState,
  reducers: {
    setDoctorCredentials: (state, action: PayloadAction<doctorInfo>) => {
      state.doctorInfo = action.payload;
      localStorage.setItem("doctorInfo", JSON.stringify(action.payload));
    },
    clearDoctorCredentials: (state) => {
      state.doctorInfo = null;
      localStorage.removeItem("doctorInfo");
    },
    setDoctorToken: (state, action: PayloadAction<string>) => {
      if (state.doctorInfo) {
        state.doctorInfo.token = action.payload;
        localStorage.setItem("doctorInfo", JSON.stringify({ ...state.doctorInfo, token: action.payload }));
      }
    }
  },
});

export const { setDoctorCredentials, clearDoctorCredentials, setDoctorToken } = doctorAuthSlice.actions;

export default doctorAuthSlice.reducer;
