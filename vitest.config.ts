import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Загружаем переменные окружения
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [vue()],
    test: {
      environment: 'jsdom',
      globals: true,
    },
    // Загружаем переменные окружения для тестов
    envDir: '.',
    envPrefix: 'VITE_',
    define: {
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL),
      'import.meta.env.VITE_TEST_USER_EMAIL': JSON.stringify(env.VITE_TEST_USER_EMAIL),
      'import.meta.env.VITE_TEST_USER_PASSWORD': JSON.stringify(env.VITE_TEST_USER_PASSWORD),
    },
  };
});
