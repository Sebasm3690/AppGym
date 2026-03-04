import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Define la URL base desde una variable de entorno o usa una por defecto para desarrollo local
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.100.11:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inyecta el token de autenticación en cada petición
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error al recuperar el token de SecureStore', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
