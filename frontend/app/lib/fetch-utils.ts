import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// console.log(`API Base URL: ${BASE_URL}`);

const api = axios.create({
	baseURL: BASE_URL,
	withCredentials: true, // Enable cookies for cross-origin requests
	headers: {
		"Content-Type": "application/json",
	},
});

// api.interceptors.request.use((config) => {});

api.interceptors.response.use(
	(response) => response,
	(error) => {
		const isUnauthorized = error.response?.status === 401;
		const requestUrl = error.config?.url || "";

		// Skip redirect if the error came from a reset-password request
		const isResetPasswordRoute = requestUrl.includes("/reset-password");

		if (isUnauthorized && !isResetPasswordRoute) {
			console.error("Unauthorized access - redirecting to login");
			window.location.href = `${process.env.VITE_API_BASE_URL}/sign-in`;
		} else {
			console.error("API error:", error);
		}

		return Promise.reject(error);
	}
);

const postData = async <T>(url: string, data: unknown): Promise<T> => {
	const response = await api.post(url, data);
	return response.data;
};

const fetchData = async <T>(url: string): Promise<T> => {
	const response = await api.get(url);
	return response.data;
};

const updateData = async <T>(url: string, data: unknown): Promise<T> => {
	const response = await api.put(url, data);
	return response.data;
};

const deleteData = async <T>(url: string): Promise<T> => {
	const response = await api.delete(url);
	return response.data;
};

export { postData, fetchData, updateData, deleteData };
