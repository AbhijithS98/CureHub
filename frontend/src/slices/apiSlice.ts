import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store.js";
import { Mutex } from "async-mutex";
import { setToken, clearCredentials } from "./userSlices/userAuthSlice.js";
import { setDoctorToken, clearDoctorCredentials } from "./doctorSlices/doctorAuthSlice.js";
import { setAdminToken, clearAdminCredentials } from "./adminSlices/adminAuthSlice.js";
import { toast } from "react-toastify";
const mutex = new Mutex();

let baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api",
  credentials: "include",
  prepareHeaders: (headers, { getState, endpoint }) => {
    let token;
    const state = getState() as RootState;

    console.log("User token:", state.userAuth?.userInfo?.token);
    console.log("Doctor token:", state.doctorAuth?.doctorInfo?.token);
    console.log("Admin token:", state.adminAuth?.adminInfo?.token);
    console.log("Endpoint:", endpoint);

    if (endpoint.startsWith("user")) {
      token = state.userAuth?.userInfo?.token;
    } else if (endpoint.startsWith("doctor")) {
      token = state.doctorAuth?.doctorInfo?.token;
    } else if (endpoint.startsWith("admin")) {
      token = state.adminAuth?.adminInfo?.token;
    }
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

interface CustomError {
  status: number;
  data?: {
    message?: string;
    error?: string;
  };
}
interface RefreshTokenResponse {
  token: string;
}

//Handles refresh token logic
const baseQueryWithReauth: typeof baseQuery = async (
  args,
  api,
  extraOptions
) => {
  let url = "";
  if (typeof args === "string") {
    url = args;
  } else if (args.url) {
    url = args.url;
  } 
  const state = api.getState() as RootState;

  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);
  const error = result.error as CustomError;

  if (error && error.status === 401) {
    const errorMessage = error.data?.message || error.data?.error;

    if (errorMessage === "Token expired") {
      if (!mutex.isLocked()) {
        const release = await mutex.acquire();
        try {
         
          let refreshUrl = "";
          let setTokenAction;
          let clearCredentialsAction;

          if (url.startsWith("/users")) {
            refreshUrl = "/users/refresh-token";
            setTokenAction = setToken;
            clearCredentialsAction = clearCredentials; 

          } else if (url.startsWith("/doctors")) {
            refreshUrl = "/doctors/refresh-token";
            setTokenAction = setDoctorToken; 
            clearCredentialsAction = clearDoctorCredentials; 

          } else if (url.startsWith("/admin")) {
            refreshUrl = "/admin/refresh-token";
            setTokenAction = setAdminToken; 
            clearCredentialsAction = clearAdminCredentials; 
          }

          const refreshResult = await baseQuery(
            { url: refreshUrl, method: "POST" },
            api,
            extraOptions
          );

          if (refreshResult.data) {
            const { token } = refreshResult.data as RefreshTokenResponse;

            api.dispatch({ type: setTokenAction, payload: token });

            result = await baseQuery(args, api, extraOptions);
          } else {
            api.dispatch({ type: clearCredentialsAction });
            toast.error("Session expired. Please log in again.");
          }
        } finally {
          release();
        }
      } else {
        await mutex.waitForUnlock();
        result = await baseQuery(args, api, extraOptions);
      }
    } else {
      // api.dispatch(clearCredentials());
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Doctor", "Admin"],
  endpoints: (builder) => ({}),
});
