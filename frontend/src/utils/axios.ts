import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import { CookieStorage } from "./storage";
import getBaseUrl from "./getBaseUrl";

const createAxiosInstance = (): AxiosInstance => {
	const baseURL = getBaseUrl();

	const config: AxiosRequestConfig = {
		baseURL,
		timeout: 20000, // Timeout enabled for better reliability
		withCredentials: true, // Allow cross-site Access-Control cookies
	};

	const instance = axios.create(config);

	// Request Interceptor
	instance.interceptors.request.use(
		(config) => {
			// Retrieve token from cookies
			const token = CookieStorage.getItem<string>("token");

			// If token exists, add it to the Authorization header
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}

			// Set default Content-Type if not provided
			if (!config.headers["Content-Type"]) {
				config.headers["Content-Type"] = "application/json";
			}

			// Conditional logging in development
			if (import.meta.env.VITE_PUBLIC_NODE_ENV === "development") {
				console.debug("Request:", config);
			}

			return config;
		},
		(error: AxiosError) => {
			console.error("Request Error:", error);
			return Promise.reject(error);
		}
	);

	// Response Interceptor
	instance.interceptors.response.use(
		(response) => {
			// Conditional logging in development
			if (import.meta.env.VITE_PUBLIC_NODE_ENV === "development") {
				console.debug("Response:", response);
			}
			return response;
		},
		async (error: AxiosError) => {
			if (error.response) {
				// Handle specific HTTP status codes
				if (error.response.status === 401) {
					// Example: Token expired or unauthorized.
					// Here you might want to trigger a refresh token flow.
					console.warn("Unauthorized access - token may be expired.");
					// Optionally, implement refresh token logic here
				}

				console.error(
					`Error ${error.response.status}: ${
						(error.response.data as any)?.message || error.message
					}`
				);
			} else if (error.request) {
				// Request was made but no response was received
				console.error("No response received:", error.message);
			} else {
				// Something happened in setting up the request that triggered an error
				console.error("Axios Error:", error.message);
			}
			return Promise.reject(error);
		}
	);

	return instance;
};

export const AXIOS = createAxiosInstance();
