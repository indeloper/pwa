import { ref } from 'vue';
import { http } from '../api/http';

export function useApi() {
  const loading = ref(false);
  const error = ref<string | null>(null);

  // GET запрос
  const get = async <T = any>(url: string, config?: any): Promise<T | null> => {
    loading.value = true;
    error.value = null;
    
    try {
      const data = await http.get<T>(url, config);
      return data;
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Произошла ошибка';
      return null;
    } finally {
      loading.value = false;
    }
  };

  // POST запрос
  const post = async <T = any>(url: string, data?: any, config?: any): Promise<T | null> => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await http.post<T>(url, data, config);
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Произошла ошибка';
      return null;
    } finally {
      loading.value = false;
    }
  };

  // PUT запрос
  const put = async <T = any>(url: string, data?: any, config?: any): Promise<T | null> => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await http.put<T>(url, data, config);
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Произошла ошибка';
      return null;
    } finally {
      loading.value = false;
    }
  };

  // PATCH запрос
  const patch = async <T = any>(url: string, data?: any, config?: any): Promise<T | null> => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await http.patch<T>(url, data, config);
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Произошла ошибка';
      return null;
    } finally {
      loading.value = false;
    }
  };

  // DELETE запрос
  const del = async <T = any>(url: string, config?: any): Promise<T | null> => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await http.delete<T>(url, config);
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.message || err.message || 'Произошла ошибка';
      return null;
    } finally {
      loading.value = false;
    }
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
    clearError
  };
}
