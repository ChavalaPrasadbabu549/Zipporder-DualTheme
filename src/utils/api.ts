import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';


const DEFAULT_URL = 'https://backend-dev.zipporder.com';
let BASE_URL = Config.BASE_API_URL || Config.BASE_URL || DEFAULT_URL;

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
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error(' API ERROR:', {
            status: error.response?.status,
            data: error.response?.data,
            msg: error.message,
        });
        return Promise.reject(error);
    }
);

export default api;
