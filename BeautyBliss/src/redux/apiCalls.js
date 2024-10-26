import { loginStart, loginSuccess, loginFailure, logoutSuccess } from "./userRedux"; // Import logoutSuccess
import { userRequest } from "../requestMethods";

// Login function
export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await userRequest.post("/auth/login/", user);
    dispatch(loginSuccess(res.data));
    return res.data; // Return the response data for successful login
  } catch (error) {
    dispatch(loginFailure());
    // Return the error response if available, otherwise return a default message
    if (error.response && error.response.data) {
      return Promise.reject(error.response.data); // Reject with the error data
    } else {
      return Promise.reject(new Error("An unknown error occurred.")); // Reject with a generic error
    }
  }
};

// Logout function
export const logout = (dispatch) => {
  dispatch(logoutSuccess()); // Dispatch logoutSuccess to clear user state
};
