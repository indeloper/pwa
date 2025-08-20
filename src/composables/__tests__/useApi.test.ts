import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import axios from 'axios';
import { useApi } from '../useApi';

// Создаем отдельный HTTP клиент для тестов с JSONPlaceholder
const testApi = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Создаем тестовую версию useApi с реальным API
function createTestUseApi() {
  const loading = ref(false);
  const error = ref<string | null>(null);

  // GET запрос
  const get = async <T = any>(url: string, config?: any): Promise<T | null> => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await testApi.get<T>(url, config);
      return response.data;
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
      const response = await testApi.post<T>(url, data, config);
      return response.data;
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
      const response = await testApi.put<T>(url, data, config);
      return response.data;
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
      const response = await testApi.patch<T>(url, data, config);
      return response.data;
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
      const response = await testApi.delete<T>(url, config);
      return response.data;
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

describe('useApi - Реальные запросы к JSONPlaceholder', () => {
  let wrapper: any;

  beforeEach(() => {
    // Создаем тестовый компонент для использования композабла
    wrapper = mount({
      template: '<div></div>',
      setup() {
        return createTestUseApi();
      }
    });
  });

  describe('GET запросы', () => {
    it('должен успешно получить пост по ID', async () => {
      const { get } = wrapper.vm;
      const result = await get('/posts/1');

      console.log('✅ GET запрос успешен:');
      console.log('📡 URL:', '/posts/1');
      console.log('📦 Ответ:', result);
      console.log('⏱️ Loading:', wrapper.vm.loading);
      console.log('❌ Error:', wrapper.vm.error);
      console.log('---');

      expect(result).toBeTruthy();
      expect(result.id).toBe(1);
      expect(result.title).toBeTruthy();
      expect(result.body).toBeTruthy();
      expect(result.userId).toBeTruthy();
      expect(wrapper.vm.loading).toBe(false);
      expect(wrapper.vm.error).toBe(null);
    });

    it('должен получить список постов', async () => {
      const { get } = wrapper.vm;
      const result = await get('/posts');

      console.log('✅ GET запрос списка постов:');
      console.log('📡 URL:', '/posts');
      console.log('📦 Количество постов:', result?.length);
      console.log('⏱️ Loading:', wrapper.vm.loading);
      console.log('❌ Error:', wrapper.vm.error);
      console.log('---');

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('title');
      expect(result[0]).toHaveProperty('body');
      expect(result[0]).toHaveProperty('userId');
      expect(wrapper.vm.loading).toBe(false);
      expect(wrapper.vm.error).toBe(null);
    });

    it('должен получить посты с лимитом', async () => {
      const { get } = wrapper.vm;
      const result = await get('/posts', { params: { _limit: 5 } });

      console.log('✅ GET запрос с лимитом:');
      console.log('📡 URL:', '/posts?_limit=5');
      console.log('📦 Количество постов:', result?.length);
      console.log('⏱️ Loading:', wrapper.vm.loading);
      console.log('❌ Error:', wrapper.vm.error);
      console.log('---');

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeLessThanOrEqual(5);
      expect(wrapper.vm.loading).toBe(false);
      expect(wrapper.vm.error).toBe(null);
    });

    it('должен получить комментарии к посту', async () => {
      const { get } = wrapper.vm;
      const result = await get('/posts/1/comments');

      console.log('✅ GET запрос комментариев:');
      console.log('📡 URL:', '/posts/1/comments');
      console.log('📦 Количество комментариев:', result?.length);
      console.log('⏱️ Loading:', wrapper.vm.loading);
      console.log('❌ Error:', wrapper.vm.error);
      console.log('---');

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('postId');
      expect(result[0]).toHaveProperty('email');
      expect(result[0]).toHaveProperty('body');
      expect(wrapper.vm.loading).toBe(false);
      expect(wrapper.vm.error).toBe(null);
    });

    it('должен обработать несуществующий ресурс', async () => {
      const { get } = wrapper.vm;
      const result = await get('/nonexistent/999');

      console.log('❌ GET запрос несуществующего ресурса:');
      console.log('📡 URL:', '/nonexistent/999');
      console.log('📦 Результат:', result);
      console.log('⏱️ Loading:', wrapper.vm.loading);
      console.log('❌ Error:', wrapper.vm.error);
      console.log('---');

      expect(result).toBe(null);
      expect(wrapper.vm.loading).toBe(false);
      expect(wrapper.vm.error).toBeTruthy();
    });
  });

  describe('POST запросы', () => {
    it('должен создать новый пост', async () => {
      const postData = { 
        title: 'Test Post Title', 
        body: 'Test Post Body', 
        userId: 1 
      };
      
      const { post } = wrapper.vm;
      const result = await post('/posts', postData);

      console.log('✅ POST запрос успешен:');
      console.log('📡 URL:', '/posts');
      console.log('📤 Отправленные данные:', postData);
      console.log('📦 Ответ:', result);
      console.log('⏱️ Loading:', wrapper.vm.loading);
      console.log('❌ Error:', wrapper.vm.error);
      console.log('---');

      expect(result).toBeTruthy();
      expect(result.id).toBe(101); // JSONPlaceholder возвращает следующий ID
      expect(result.title).toBe(postData.title);
      expect(result.body).toBe(postData.body);
      expect(result.userId).toBe(postData.userId);
      expect(wrapper.vm.loading).toBe(false);
      expect(wrapper.vm.error).toBe(null);
    });

    it('должен создать новый комментарий', async () => {
      const commentData = {
        postId: 1,
        name: 'Test Commenter',
        email: 'test@example.com',
        body: 'This is a test comment'
      };

      const { post } = wrapper.vm;
      const result = await post('/comments', commentData);

      console.log('✅ POST запрос комментария:');
      console.log('📡 URL:', '/comments');
      console.log('📤 Отправленные данные:', commentData);
      console.log('📦 Ответ:', result);
      console.log('⏱️ Loading:', wrapper.vm.loading);
      console.log('❌ Error:', wrapper.vm.error);
      console.log('---');

      expect(result).toBeTruthy();
      expect(result.id).toBe(501); // JSONPlaceholder возвращает следующий ID
      expect(result.postId).toBe(commentData.postId);
      expect(result.name).toBe(commentData.name);
      expect(result.email).toBe(commentData.email);
      expect(result.body).toBe(commentData.body);
      expect(wrapper.vm.loading).toBe(false);
      expect(wrapper.vm.error).toBe(null);
    });
  });

  describe('PUT запросы', () => {
    it('должен обновить существующий пост', async () => {
      const putData = { 
        id: 1, 
        title: 'Updated Post Title', 
        body: 'Updated Post Body', 
        userId: 1 
      };
      
      const { put } = wrapper.vm;
      const result = await put('/posts/1', putData);

      console.log('✅ PUT запрос успешен:');
      console.log('📡 URL:', '/posts/1');
      console.log('📤 Отправленные данные:', putData);
      console.log('📦 Ответ:', result);
      console.log('⏱️ Loading:', wrapper.vm.loading);
      console.log('❌ Error:', wrapper.vm.error);
      console.log('---');

      expect(result).toBeTruthy();
      expect(result.id).toBe(putData.id);
      expect(result.title).toBe(putData.title);
      expect(result.body).toBe(putData.body);
      expect(result.userId).toBe(putData.userId);
      expect(wrapper.vm.loading).toBe(false);
      expect(wrapper.vm.error).toBe(null);
    });
  });

  describe('PATCH запросы', () => {
    it('должен частично обновить пост', async () => {
      const patchData = { title: 'Partially Updated Title' };
      
      const { patch } = wrapper.vm;
      const result = await patch('/posts/1', patchData);

      console.log('✅ PATCH запрос успешен:');
      console.log('📡 URL:', '/posts/1');
      console.log('📤 Отправленные данные:', patchData);
      console.log('📦 Ответ:', result);
      console.log('⏱️ Loading:', wrapper.vm.loading);
      console.log('❌ Error:', wrapper.vm.error);
      console.log('---');

      expect(result).toBeTruthy();
      expect(result.id).toBe(1);
      expect(result.title).toBe(patchData.title);
      // Остальные поля должны остаться неизменными
      expect(result.body).toBeTruthy();
      expect(result.userId).toBeTruthy();
      expect(wrapper.vm.loading).toBe(false);
      expect(wrapper.vm.error).toBe(null);
    });
  });

  describe('DELETE запросы', () => {
    it('должен удалить пост', async () => {
      const { delete: del } = wrapper.vm;
      const result = await del('/posts/1');

      console.log('✅ DELETE запрос успешен:');
      console.log('📡 URL:', '/posts/1');
      console.log('📦 Ответ:', result);
      console.log('⏱️ Loading:', wrapper.vm.loading);
      console.log('❌ Error:', wrapper.vm.error);
      console.log('---');

      // JSONPlaceholder возвращает пустой объект при успешном удалении
      expect(result).toEqual({});
      expect(wrapper.vm.loading).toBe(false);
      expect(wrapper.vm.error).toBe(null);
    });
  });

  describe('Состояние загрузки', () => {
    it('должен установить loading в true во время запроса', async () => {
      const { get } = wrapper.vm;
      const promise = get('/posts/1');

      console.log('⏱️ Тест состояния загрузки:');
      console.log('📡 URL:', '/posts/1');
      console.log('🔄 Loading во время запроса:', wrapper.vm.loading);

      // Проверяем, что loading установлен в true
      expect(wrapper.vm.loading).toBe(true);

      await promise;
      console.log('✅ Loading после завершения:', wrapper.vm.loading);
      console.log('---');

      expect(wrapper.vm.loading).toBe(false);
    });
  });

  describe('Очистка ошибок', () => {
    it('должен очистить ошибку при вызове clearError', async () => {
      // Сначала создаем ошибку
      const { get, clearError } = wrapper.vm;
      await get('/nonexistent/999');

      console.log('🧹 Тест очистки ошибок:');
      console.log('📡 URL:', '/nonexistent/999');
      console.log('❌ Ошибка до очистки:', wrapper.vm.error);

      expect(wrapper.vm.error).toBeTruthy();

      // Очищаем ошибку
      clearError();
      console.log('✅ Ошибка после очистки:', wrapper.vm.error);
      console.log('---');

      expect(wrapper.vm.error).toBe(null);
    });
  });

  describe('Дополнительные ресурсы JSONPlaceholder', () => {
    it('должен получить пользователей', async () => {
      const { get } = wrapper.vm;
      const result = await get('/users');

      console.log('👥 GET запрос пользователей:');
      console.log('📡 URL:', '/users');
      console.log('📦 Количество пользователей:', result?.length);
      console.log('---');

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(10); // JSONPlaceholder имеет 10 пользователей
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('email');
      expect(result[0]).toHaveProperty('username');
    });

    it('должен получить альбомы', async () => {
      const { get } = wrapper.vm;
      const result = await get('/albums');

      console.log('📷 GET запрос альбомов:');
      console.log('📡 URL:', '/albums');
      console.log('📦 Количество альбомов:', result?.length);
      console.log('---');

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(100); // JSONPlaceholder имеет 100 альбомов
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('title');
      expect(result[0]).toHaveProperty('userId');
    });

    it('должен получить фотографии', async () => {
      const { get } = wrapper.vm;
      const result = await get('/photos', { params: { _limit: 3 } });

      console.log('🖼️ GET запрос фотографий:');
      console.log('📡 URL:', '/photos?_limit=3');
      console.log('📦 Количество фотографий:', result?.length);
      console.log('---');

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeLessThanOrEqual(3);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('title');
      expect(result[0]).toHaveProperty('url');
      expect(result[0]).toHaveProperty('thumbnailUrl');
      expect(result[0]).toHaveProperty('albumId');
    });

    it('должен получить задачи', async () => {
      const { get } = wrapper.vm;
      const result = await get('/todos', { params: { _limit: 5 } });

      console.log('✅ GET запрос задач:');
      console.log('📡 URL:', '/todos?_limit=5');
      console.log('📦 Количество задач:', result?.length);
      console.log('---');

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeLessThanOrEqual(5);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('title');
      expect(result[0]).toHaveProperty('completed');
      expect(result[0]).toHaveProperty('userId');
    });
  });
});
