import axios, { AxiosResponse } from "axios";

let APIService = axios.create({
    baseURL: `http://whatsay-backend-loadbalancer-45970015.us-east-2.elb.amazonaws.com:8080/api`,
    timeout: 1000000, // Adjusted for a reasonable timeout in ms
    headers: {
        "Content-Type": "application/json",
    },
});

APIService.interceptors.response.use(
    response => response,
    error => {
        console.error("Detailed Network Error:", error.toJSON ? error.toJSON() : error);
        return Promise.reject(error);
    }
);

export async function APICaller<Type>(apiCall: Promise<AxiosResponse<Type>>): Promise<Type | undefined> {
    try {
        console.log("response",apiCall);
        const response = await apiCall;
        
        if ([200, 201, 204].includes(response.status)) {
            return response.data;
        }
        return undefined;
    } catch (error) {
        console.error("API call error:", error);

        if (axios.isAxiosError(error)) {
            if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
                throw new Error("Connection timeout or network error. Please check your network and try again.");
            }
            throw new Error(`API error: ${error.message}`);
        }
        throw new Error(`Unexpected error: ${error}`);
    }
}

export default APIService;