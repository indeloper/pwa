import { describe, it, expect } from 'vitest';

describe('Переменные окружения', () => {
  it('должен загрузить VITE_API_BASE_URL из .env.development', () => {
    console.log('🔍 Проверка переменных окружения:');
    console.log('📦 Все переменные:', import.meta.env);
    console.log('🌐 VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
    console.log('📧 VITE_TEST_USER_EMAIL:', import.meta.env.VITE_TEST_USER_EMAIL);
    console.log('🔑 VITE_TEST_USER_PASSWORD:', import.meta.env.VITE_TEST_USER_PASSWORD);
    console.log('---');

    expect(import.meta.env.VITE_API_BASE_URL).toBeDefined();
    expect(import.meta.env.VITE_API_BASE_URL).toBe('https://erp.sk-gorod.com/api/v2/');
    expect(import.meta.env.VITE_TEST_USER_EMAIL).toBeDefined();
    expect(import.meta.env.VITE_TEST_USER_PASSWORD).toBeDefined();
  });

  it('должен иметь правильный формат URL для API', () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    expect(apiUrl).toMatch(/^https?:\/\/.+\/api\/v\d+\/?$/);
  });
});
