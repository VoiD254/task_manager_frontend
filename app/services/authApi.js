import api from "./api";

const signup = (payload) => api.post("/user/signup", payload);
const signin = (payload) => api.post("/user/signin", payload);
const logout = () => api.post("/user/logout");
const getProfile = () => api.get("/user/getProfile");
const updateProfile = (payload) => api.patch("/user/updateProfile", payload);
const refreshToken = (payload) => api.post("/user/refreshToken", payload);
const forgotPassword = (payload) => api.post("/user/forgotPassword", payload);
const resendOtp = (payload) => api.post("/user/resendOtp", payload);
const verifyOtp = (payload) => api.post("/user/verifyOtp", payload);
const resetPassword = (payload) => api.patch("/user/resetPassword", payload);

export {
    forgotPassword, getProfile, logout, refreshToken, resendOtp, resetPassword, signin, signup, updateProfile, verifyOtp
};
