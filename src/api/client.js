import axios from "axios";
import { toast } from "react-toastify";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
});

// REQUEST INTERCEPTOR
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.token = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// RESPONSE INTERCEPTOR
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        console.log({ status })
        const message =
            error?.response?.data?.message ||
            "Something went wrong. Please try again.";
        if (status === 400) {
            toast.error(message);
        } else if (status === 401) {
            toast.error("Session expired. Please login again.");
            localStorage.clear();
            window.location.href = "/login";
        } else if (status === 403) {
            toast.error("You are not authorized to perform this action.");
        } else if (status >= 500) {
            toast.error("Server error. Please try later.");
        } else {
            toast.error(message);
        }

        return Promise.reject(error);
    }
);
