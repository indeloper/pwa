import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import router from '../router';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 100000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    
    // Автоматически добавляем CSRF токен из cookie в заголовок
    if (config.method !== 'get') {
      const csrfToken = getCsrfTokenFromCookie();
      if (csrfToken) {
        config.headers['X-XSRF-TOKEN'] = csrfToken;
        console.log('🔐 Added CSRF token to request:', csrfToken.substring(0, 10) + '...');
      } else {
        console.warn('⚠️ No CSRF token found in cookies');
      }
    }
    
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Функция для получения CSRF токена из cookie
function getCsrfTokenFromCookie(): string | null {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'XSRF-TOKEN') {
      return decodeURIComponent(value);
    }
  }
  return null;
}

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    console.error('❌ Response Error:', error.response?.status, error.config?.url, error.response?.data);
    
    if (error.response?.status === 401) {
      console.log('🔒 Unauthorized - redirecting to login');
      router.push('/login');
    }
    
    // Обработка CSRF Token Mismatch - получаем новый токен и повторяем запрос
    if (error.response?.status === 419 && !error.config._retry) {
      console.log('🔄 CSRF Token Mismatch - attempting to refresh token');
      error.config._retry = true; // Помечаем запрос как повторный для предотвращения зацикливания
      
      try {
        // Создаем отдельный экземпляр для получения CSRF cookie без interceptor'ов
        const csrfApi = axios.create({
          baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        
        console.log('🍪 Getting new CSRF cookie...');
        // Получаем новый CSRF cookie
        const csrfResponse = await csrfApi.get('/sanctum/csrf-cookie');
        console.log('✅ CSRF cookie response:', csrfResponse.status);
        
        console.log('🔄 Retrying original request...');
        // Повторяем оригинальный запрос
        return api.request(error.config);
      } catch (csrfError) {
        console.error('💥 Failed to refresh CSRF token:', csrfError);
        // Если не удалось обновить CSRF токен, редиректим на логин
        router.push('/login');
        return Promise.reject(error);
      }
    } else if (error.response?.status === 419 && error.config._retry) {
      console.log('🔄 CSRF retry already attempted - giving up');
    }
    
    return Promise.reject(error);
  }
);

export default api;
