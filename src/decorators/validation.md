# Декораторы валидации

Модуль содержит декораторы для автоматической валидации данных модели.

## @Validatable()

Декоратор класса, который добавляет функциональность валидации.

### Описание

Декоратор `@Validatable()` добавляет к классу:
- Метод `validationErrors()` для получения списка ошибок валидации
- Метод `isValid()` для проверки валидности модели
- Метод `validate()` для принудительной валидации

### Использование

```typescript
import { Validatable, Validate, ValidationRules } from '@/decorators';

@Validatable()
export default class User {
  @Validate([ValidationRules.required('Имя обязательно')])
  declare name: string;

  @Validate([ValidationRules.required('Email обязателен')])
  declare email: string;
}
```

### Добавляемые методы

#### `validationErrors(): ValidationError[]`
Возвращает массив ошибок валидации.

```typescript
const user = new User();
user.name = '';
user.email = '';

const errors = user.validationErrors();
console.log(errors);
// [
//   { property: 'name', rule: 'required', message: 'Имя обязательно' },
//   { property: 'email', rule: 'required', message: 'Email обязателен' }
// ]
```

#### `isValid(): boolean`
Проверяет, валидна ли модель.

```typescript
const user = new User();
user.name = '';
user.email = '';

console.log(user.isValid()); // false

user.name = 'John';
user.email = 'john@example.com';

console.log(user.isValid()); // true
```

#### `validate(): boolean`
Принудительно выполняет валидацию и возвращает результат.

```typescript
const user = new User();
user.name = 'John';
user.email = 'john@example.com';

const isValid = user.validate(); // true
```

## @Validate()

Декоратор свойства для определения правил валидации.

### Синтаксис

```typescript
@Validate(rules: ValidationRule[])
```

### Параметры

- `rules` - Массив правил валидации

### Примеры

#### Одно правило

```typescript
@Validate([ValidationRules.required('Поле обязательно')])
declare name: string;
```

#### Множественные правила

```typescript
@Validate([
  ValidationRules.required('Имя обязательно'),
  ValidationRules.minLength(2, 'Минимум 2 символа'),
  ValidationRules.maxLength(50, 'Максимум 50 символов')
])
declare name: string;
```

#### Разные типы данных

```typescript
@Validate([ValidationRules.required('Email обязателен')])
declare email: string;

@Validate([ValidationRules.min(0, 'Возраст должен быть положительным')])
declare age: number;

@Validate([ValidationRules.required('Дата рождения обязательна')])
declare birthDate: Date;
```

## Правила валидации

### ValidationRules.required()

Проверяет, что поле не пустое.

#### Синтаксис

```typescript
ValidationRules.required(message?: string): ValidationRule
```

#### Параметры

- `message` - Сообщение об ошибке (по умолчанию: "Поле обязательно для заполнения")

#### Примеры

```typescript
@Validate([ValidationRules.required()])
declare name: string;

@Validate([ValidationRules.required('Имя пользователя обязательно')])
declare username: string;
```

#### Поведение

- `null` и `undefined` - невалидны
- Пустая строка `""` - невалидна
- Строка только с пробелами `"   "` - невалидна
- Любое другое значение - валидно

### Другие правила (планируются)

```typescript
// Минимальная длина строки
ValidationRules.minLength(min: number, message?: string)

// Максимальная длина строки
ValidationRules.maxLength(max: number, message?: string)

// Минимальное значение числа
ValidationRules.min(min: number, message?: string)

// Максимальное значение числа
ValidationRules.max(max: number, message?: string)

// Регулярное выражение
ValidationRules.pattern(regex: RegExp, message?: string)

// Email
ValidationRules.email(message?: string)

// Пользовательская валидация
ValidationRules.custom(validate: (value: any) => boolean, message?: string)
```

## Типы

### ValidationRule

```typescript
interface ValidationRule {
  type: ValidationRuleType;
  message?: string;
  validate: (value: any) => boolean;
}
```

### ValidationError

```typescript
interface ValidationError {
  property: string;
  rule: ValidationRuleType;
  message: string;
}
```

### ValidationRuleType

```typescript
enum ValidationRuleType {
  REQUIRED = 'required'
  // Другие типы будут добавлены
}
```

## Полный пример

```typescript
import { Validatable, Validate, ValidationRules } from '@/decorators';

@Validatable()
export default class User {
  @Validate([ValidationRules.required('Имя обязательно')])
  declare name: string = '';

  @Validate([ValidationRules.required('Email обязателен')])
  declare email: string = '';

  @Validate([ValidationRules.required('Возраст обязателен')])
  declare age: number = 0;

  constructor(data?: Partial<User>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
```

### Использование

```typescript
// Создание невалидной модели
const user = new User();
console.log(user.isValid()); // false
console.log(user.validationErrors());
// [
//   { property: 'name', rule: 'required', message: 'Имя обязательно' },
//   { property: 'email', rule: 'required', message: 'Email обязателен' },
//   { property: 'age', rule: 'required', message: 'Возраст обязателен' }
// ]

// Заполнение данных
user.name = 'John';
user.email = 'john@example.com';
user.age = 25;

console.log(user.isValid()); // true
console.log(user.validationErrors()); // []
```

## Интеграция с формами

### Vue 3 Composition API

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <input v-model="user.name" placeholder="Имя" />
      <div v-if="nameError" class="error">{{ nameError }}</div>
    </div>
    
    <div>
      <input v-model="user.email" placeholder="Email" />
      <div v-if="emailError" class="error">{{ emailError }}</div>
    </div>
    
    <button type="submit" :disabled="!user.isValid()">
      Сохранить
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import User from '@/models/User';

const user = ref(new User());

const nameError = computed(() => {
  const error = user.value.validationErrors().find(e => e.property === 'name');
  return error?.message;
});

const emailError = computed(() => {
  const error = user.value.validationErrors().find(e => e.property === 'email');
  return error?.message;
});

const handleSubmit = async () => {
  if (user.value.isValid()) {
    await user.value.store();
  }
};
</script>
```

### React

```tsx
import React, { useState, useEffect } from 'react';
import User from '@/models/User';

const UserForm: React.FC = () => {
  const [user, setUser] = useState(new User());
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const newErrors: Record<string, string> = {};
    user.validationErrors().forEach(error => {
      newErrors[error.property] = error.message;
    });
    setErrors(newErrors);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user.isValid()) {
      await user.store();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          placeholder="Имя"
        />
        {errors.name && <div className="error">{errors.name}</div>}
      </div>
      
      <div>
        <input
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="Email"
        />
        {errors.email && <div className="error">{errors.email}</div>}
      </div>
      
      <button type="submit" disabled={!user.isValid()}>
        Сохранить
      </button>
    </form>
  );
};
```

## Преимущества

1. **Декларативность** - правила валидации видны в определении класса
2. **Переиспользование** - одни и те же правила применяются везде
3. **Типобезопасность** - полная поддержка TypeScript
4. **Реактивность** - валидация происходит автоматически при изменении данных
5. **Гибкость** - легко добавлять новые правила валидации
6. **Производительность** - правила компилируются один раз
7. **Интеграция** - легко интегрируется с любыми UI фреймворками
