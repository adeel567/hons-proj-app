import { applyAuthTokenInterceptor } from 'react-native-axios-jwt';
import axios from 'axios';

/**
 * Initialises the Axios instance which we use to access the backend.
 * Axios will keep the access token refreshed until the refresh token itself expires.
 * Set the base URL of the server here
 */

export const BASE_URL = "http://10.69.69.253:8000";

export const axiosInstance = axios.create({
     baseURL: BASE_URL,
     })

const requestRefresh = async (refresh) => {
    const response = await axios.post(`${BASE_URL}/auth/refresh`, { refresh })
    return response.data.access
};

applyAuthTokenInterceptor(axiosInstance, {
    requestRefresh,
}); 