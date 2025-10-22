import axios from "axios";
import { clearAll, getItem, storeItem } from "../utils/storage";

const BASE_URL = 'http://10.17.108.148:3000/api/v1';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) =>{
    failedQueue.forEach(p =>{
        if (error){
            p.reject(error);
        }
        else{
            p.resolve(token);
        }
    });

    failedQueue = [];
}

api.interceptors.request.use(async (config) =>{
    const token = await getItem("accessToken");
    if(token && config.headers){
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config
}, (err) => Promise.reject(err));

api.interceptors.response.use(
    (res) => res,
    async (error) =>{
        const originalRequest = error?.config;
        const status = error?.response?.status;
        
        if(status === 401 && originalRequest && !originalRequest._retry){
            originalRequest._retry = true;

            if(isRefreshing){
                return new Promise((resolve, reject) =>{
                    failedQueue.push({resolve, reject});
                })
                .then((token) =>{
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                })
                .catch((err) => Promise.reject(err));
            }

            isRefreshing = true;

            try{
                const refreshToken = await getItem("refreshToken");
                if(!refreshToken){
                    throw new Error("No refresh Token");
                }

                const { data } = await axios.post(`${BASE_URL}/user/refreshToken`, { refreshToken });

                const { accessToken, refreshToken: newRefresh} = data;

                await storeItem("accessToken", accessToken);
                await storeItem("refreshToken", newRefresh);

                api.defaults.headers.Authorization = `Bearer ${accessToken}`;
                processQueue(null, accessToken);

                return api(originalRequest);
            } catch (err) {
                processQueue(err, null);
                await clearAll();
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;