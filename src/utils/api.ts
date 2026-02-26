import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';


let BASE_URL = Config.BASE_API_URL || Config.BASE_URL || '';

if (BASE_URL.endsWith('/')) {
    BASE_URL = BASE_URL.slice(0, -1);
}

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        console.log(`🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('❌ Request Interceptor Error:', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        console.log(`✅ [API Response] ${response.config.method?.toUpperCase()} ${response.config.url}:`, response.data);
        return response;
    },
    (error) => {
        const status = error.response?.status;
        const data = error.response?.data;
        console.error('❌ [API Error]:', {
            status,
            url: error.config?.url,
            method: error.config?.method?.toUpperCase(),
            data: typeof data === 'string' ? data.slice(0, 100) + '...' : data,
            message: error.message
        });
        return Promise.reject(error);
    }
);

export default api;
