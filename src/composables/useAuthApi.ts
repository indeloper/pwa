import { ref } from 'vue';
import { http } from '../api/http';

// Создаем синглтон для состояния загрузки
const loading = ref(false);
const error = ref<string | null>(null);

export function useAuthApi() {

  // GET запрос с авторизацией
  const get = async <T = any>(url: string, config?: any): Promise<T> => {
    loading.value = true;
    error.value = null;
    
    try {
      const data = await http.getAuth<T>(url, { withCredentials: true, ...config });
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Произошла ошибка';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  // POST запрос с авторизацией
  const post = async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await http.postAuth<T>(url, data, { withCredentials: true, ...config });
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Произошла ошибка';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  // PUT запрос с авторизацией
  const put = async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await http.putAuth<T>(url, data, { withCredentials: true, ...config });
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Произошла ошибка';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  // PATCH запрос с авторизацией
  const patch = async <T = any>(url: string, data?: any, config?: any): Promise<T> => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await http.patchAuth<T>(url, data, { withCredentials: true, ...config });
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Произошла ошибка';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  // DELETE запрос с авторизацией
  const del = async <T = any>(url: string, config?: any): Promise<T> => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await http.deleteAuth<T>(url, { withCredentials: true, ...config });
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Произошла ошибка';
      error.value = errorMessage;
      throw new Error(errorMessage);
    } finally {
      loading.value = false;
    }
  };

  const getStream = <T = any>(
    url: string,
    handlers?: {
      onMessage?: (data: T, ev: MessageEvent) => void;
      onError?: (ev: Event) => void;
      onOpen?: (ev: Event) => void;
      withCredentials?: boolean;
    }
  ) => {
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
    let fullUrl = url.startsWith('http') ? url : `${base}${url}`;
    
    const es = new EventSource(fullUrl, { withCredentials: handlers?.withCredentials ?? true });
  
    if (handlers?.onOpen) es.onopen = handlers.onOpen;
  
    es.onmessage = (ev) => {
      try {
        handlers?.onMessage?.(JSON.parse(ev.data) as T, ev);
      } catch {
        handlers?.onMessage?.((ev.data as unknown) as T, ev);
      }
    };
  
    if (handlers?.onError) es.onerror = handlers.onError;
  
    return {
      eventSource: es,
      close: () => es.close(),
    };
  };

  // Очистка ошибки
  const clearError = () => {
    error.value = null;
  };

  return {
    loading,
    error,
    get,
    post,
    put,
    patch,
    delete: del,
    clearError,
    getStream
  };
}
