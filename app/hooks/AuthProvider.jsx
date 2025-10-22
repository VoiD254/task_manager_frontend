import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { refreshToken as refreshTokenApi } from "../services/authApi";

const AuthContext = createContext();    

const AuthProvider = ({ children }) =>{
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFirstLaunch, setIsFirstLaunch] = useState(null);

    const loadUserFromStorage = async () =>{
        try{
            const [accessToken, refreshToken, userId] = await Promise.all([
                AsyncStorage.getItem("accessToken"),
                AsyncStorage.getItem("refreshToken"),
                AsyncStorage.getItem("userId"),
            ]);

            if(accessToken && refreshToken && userId){
                api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
                setUser({ userId });
            }
        } catch (err){
            console.error("Failed to load user: ", err);
        }
    };

    useEffect(() =>{
        (async () => {
            const flag = await AsyncStorage.getItem("isFirstLaunch");
            setIsFirstLaunch(flag === null);
            await loadUserFromStorage();
            setLoading(false);
        })();
    }, []);

    const signup = async (payload) =>{
        const { data } = await api.post("/user/signup", payload);

        await AsyncStorage.multiSet([
            ["isFirstLaunch", "false"],
            ["accessToken", data.accessToken],
            ["refreshToken", data.refreshToken],
            ["userId", data.user_id],
        ]);

        api.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
        setUser({ userId: data.user_id, name: data.name, email: data.email});
    };

    const signin = async (payload) =>{
        const { data } = await api.post("/user/signin", payload);

        await AsyncStorage.multiSet([
            ["accessToken", data.accessToken],
            ["refreshToken", data.refreshToken],
            ["userId", data.user_id],
        ]);

        api.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
        setUser({ userId: data.user_id, name: data.name, email: data.email});
    };

    const refreshSession = async () =>{
        try{
            const refreshToken = await AsyncStorage.getItem("refreshToken");
            if(!refreshToken){
                return false;
            }

            const { data } = await refreshTokenApi({ refreshToken });
            
            await AsyncStorage.multiSet([
                ["accessToken", data.accessToken],
                ["refreshToken", data.refreshToken],
            ]);

            api.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
            return true;
        } catch (err) {
            console.warn("Refresh Token Failed:", err);
            return false;
        }
    };

    const logout = async () =>{
        try{
            await api.post("/user/logout");
        }catch (err) {
            console.warn("Server logout failed, clearing local session.");
        }finally{
            await AsyncStorage.multiRemove([
                "accessToken",
                "refreshToken",
                "userId",
                "isFirstLaunch",
            ]);
            delete api.defaults.headers.common["Authorization"];
            setUser(null);
            router.replace("/(auth)/login");
        }
    }

    useEffect(() =>{
        const interceptor = api.interceptors.response.use(
            (res) => res,
            async (err) =>{
                const originalRequest = err.config;
                if(err.response?.status === 401 && !originalRequest._retry){
                    originalRequest._retry = true;
                    const success = await refreshSession();
                    if(success){
                        return api(originalRequest);
                    } else{
                        await logout();
                    }
                }

                return Promise.reject(err);
            }
        );

        return () => api.interceptors.response.eject(interceptor);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isFirstLaunch,
                signup,
                signin,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => useContext(AuthContext);  

export {
    AuthContext, AuthProvider,
    useAuth
};

