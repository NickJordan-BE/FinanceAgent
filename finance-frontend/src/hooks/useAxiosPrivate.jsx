import { axiosPrivate } from "../apis/AxiosPrivate";
import { useEffect } from "react";
import useAuth from "./useAuth";
import { getIdToken } from "firebase/auth";



const useAxiosPrivate = () => {
    const { curUser } = useAuth();
    
    useEffect(() => {

        const requestIntercept = axiosPrivate.interceptors.request.use(
            async config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${await curUser.getIdToken(true)}`;
                }
                return config;
            }, (err) => Promise.reject(err)
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept)
        }
    }, [curUser])

    return axiosPrivate;
}

export default useAxiosPrivate;