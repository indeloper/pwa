# Тесты для useApi композабла

## Описание

Тесты для композабла `useApi` проверяют функциональность HTTP запросов с использованием моков axios.

## Структура тестов

### Unit тесты (`useApi.test.ts`)

Тестируют все методы композабла с использованием моков:

- **GET запросы** - получение данных
- **POST запросы** - создание данных
- **PUT запросы** - полное обновление данных
- **PATCH запросы** - частичное обновление данных
- **DELETE запросы** - удаление данных
- **Состояние загрузки** - управление loading состоянием
- **Обработка ошибок** - обработка различных типов ошибок
- **Конфигурация запросов** - передача дополнительных параметров

## Запуск тестов

```bash
# Запуск всех тестов
npm run test

# Запуск тестов один раз
npm run test:run

# Запуск конкретного файла тестов
npm run test:run src/composables/__tests__/useApi.test.ts
```

## Покрытие тестов

Тесты покрывают:

- ✅ Все HTTP методы (GET, POST, PUT, PATCH, DELETE)
- ✅ Успешные запросы
- ✅ Обработка ошибок
- ✅ Состояние загрузки
- ✅ Очистка ошибок
- ✅ Передача конфигурации

## Используемые технологии

- **Vitest** - тестовый фреймворк
- **@vue/test-utils** - утилиты для тестирования Vue компонентов
- **jsdom** - среда выполнения для тестов
- **Моки** - для изоляции тестов от реальных HTTP запросов

## Примеры тестов

```typescript
// Тест успешного GET запроса
it('должен успешно выполнить GET запрос', async () => {
  const mockData = { id: 1, title: 'Test Post' };
  (http.get as any).mockResolvedValue(mockData);

  const { get } = wrapper.vm;
  const result = await get('/posts/1');

  expect(result).toEqual(mockData);
  expect(wrapper.vm.loading).toBe(false);
  expect(wrapper.vm.error).toBe(null);
});

// Тест обработки ошибки
it('должен обработать ошибку GET запроса', async () => {
  const mockError = { response: { data: { message: 'Not found' } } };
  (http.get as any).mockRejectedValue(mockError);

  const { get } = wrapper.vm;
  const result = await get('/posts/999');

  expect(result).toBe(null);
  expect(wrapper.vm.error).toBe('Not found');
});
```
