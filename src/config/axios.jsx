import axios from "axios";

import { toast } from "react-toastify"

const instance = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true, // Cho phép gửi cookie
})

instance.defaults.withCredentials = true;

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response?.data;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const status = error?.response?.status || 500;

    switch (status) {
        // authentication (token related issues)
        case 401: {
            window.location.href = "/login";
            toast.error("Bạn chưa đăng nhập. Hãy đăng nhập...");
            return Promise.reject(error);
        }

        // forbidden (permission related issues)
        case 403: {
            window.location.href = "/";
            toast.error("Bạn không có quyền thực hiện hành động này!");
            return Promise.reject(error);
        }

        // bad request
        case 400: {
            return Promise.reject(error);
        }

        // not found
        case 404: {
            return Promise.reject(error);
        }

        // conflict
        case 409: {
            return Promise.reject(error);
        }

        // unprocessable
        case 422: {
            return Promise.reject(error);
        }

        // generic api error (server related) unexpected
        default: {
            return Promise.reject(error);
        }
    }
});

export default instance