import axios from "axios";

const api = axios.create({
    baseURL: "", // use relative URLs → Next.js proxy (next.config.ts) forwards to Spring Boot
    withCredentials: true,
});

// Global 401 interceptor — handles token expiry on any API call.
// Redirects to login without needing useRouter in every component.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Cookie expired or invalid — force redirect to login
            if (location.pathname !== "/") {
                location.href = "/";
                console.warn("Unauthenticated");
            }
        }
        return Promise.reject(error);
    }
);

export default api;