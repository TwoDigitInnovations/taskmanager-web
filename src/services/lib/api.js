"use client";

import axios from "axios";
import { deleteAuthToken } from "./storage";
const ConstantsUrl = "https://taskmanagerapi.2digitinnovations.com/v1/api/";

const api = axios.create({
    baseURL: ConstantsUrl,
    headers: {
        "Content-Type": "application/json",
        app_type: 'user',
    },
});

// ✅ Request Interceptor — attach JWT from cookies
// api.interceptors.request.use(
//     (config) => {
//         const token = Cookies.get("token"); // read cookie
//         if (token) {
//             config.headers.Authorization = `jwt ${token}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

api.interceptors.response.use(
    function (response) {
        console.log(response.config.url + ': axios-response', response);
        if (response.data?.status) {
            return response.data;
        } else {
            const message = response.data?.message;
            return Promise.reject(message);
        }
    },
    async function (error) {
        console.log((error.config.url || '') + ': axios-error', error);
        let message = '';
        if (error.response) {
            if (error.response.status === 401) {
                removeApiToken();
                deleteAuthToken()
                router.push("/");
            }
            message = error.response.data?.message || error?.message;
        } else {
            message = error.message;
        }
        return Promise.reject(message);
    },
);

// ✅ Response Interceptor — handle 401 globally
// export const setupAxiosInterceptors = (router) => {
//     api.interceptors.response.use(
//         (response) => response.data,
//         (error) => {
//             if (error.response) {
//                 if (error.response.status === 401) {
//                     // remove token + redirect to login
//                     deleteAuthToken()
//                     router.push("/");
//                 }
//                 return Promise.reject(error.response.data);
//             }
//             return Promise.reject(error);
//         }
//     );
// };

export const setApiToken = (AUTH_TOKEN) => {
    return (api.defaults.headers.common.Authorization = `jwt ${AUTH_TOKEN}`);
};

export const removeApiToken = () => {
    return (api.defaults.headers.common.Authorization = '');
};

export default api;
