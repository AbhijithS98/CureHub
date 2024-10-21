import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DoctorInfo {
  id: string;
  name: string;
  email: string;
  specialization: string;
  medicalLicenseNumber: string; 
  experience: number;
  phone: string;
  isVerified: boolean;
  isApproved: boolean;
  isBlocked: boolean;
}

interface DoctorAuthState {
  doctorInfo: DoctorInfo | null;
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
    setDoctorCredentials: (state, action: PayloadAction<DoctorInfo>) => {
      state.doctorInfo = action.payload;
      localStorage.setItem("doctorInfo", JSON.stringify(action.payload));
    },
    clearDoctorCredentials: (state) => {
      state.doctorInfo = null;
      localStorage.removeItem("doctorInfo");
    },
  },
});

export const { setDoctorCredentials, clearDoctorCredentials } = doctorAuthSlice.actions;

export default doctorAuthSlice.reducer;
