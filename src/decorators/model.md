# @Model()

Декоратор `@Model()` заменяет наследование от `BaseModel` и добавляет базовую функциональность модели.

## Описание

Декоратор `@Model()` автоматически добавляет к классу:
- Уникальный идентификатор (UUID)
- Статические методы для работы с коллекциями
- Методы CRUD операций
- Базовую функциональность модели

## Использование

### Базовое использование

```typescript
import { Model } from '@/decorators';

@Model()
export default class User {
  name: string = '';
  email: string = '';
}
```

### С другими декораторами

```typescript
import { Model, Transformable, From, To } from '@/decorators';
import { ModelsTransformStrategies as Strategy } from '@/enums';

@Model()
@Transformable()
export default class User {
  @From(Strategy.API_RESPONSE, 'id')
  @To(Strategy.API_REQUEST, 'id')
  declare id?: number;

  @From(Strategy.API_RESPONSE, 'attributes.name')
  @To(Strategy.API_REQUEST, 'name')
  declare name: string = '';
}
```

## Добавляемые свойства и методы

### Свойства экземпляра

#### `uuid: string`
Уникальный идентификатор модели, генерируемый автоматически.

```typescript
@Model()
class User {
  name: string = '';
}

const user = new User();
console.log(user.uuid); // "550e8400-e29b-41d4-a716-446655440000"
```

### Статические методы

#### `collect<T>(items: T[]): Collection`
Создает коллекцию из массива элементов.

```typescript
@Model()
class User {
  static collection = UserCollection;
  name: string = '';
}

const users = [
  { id: 1, attributes: { name: 'John' } },
  { id: 2, attributes: { name: 'Jane' } }
];

const collection = User.collect(users);
// Возвращает UserCollection с экземплярами User
```

#### `collectOne<T>(item: T, strategy?: Strategy): Collection`
Создает коллекцию из одного элемента.

```typescript
const userData = { id: 1, attributes: { name: 'John' } };
const collection = User.collectOne(userData, Strategy.API_RESPONSE);
```

#### `createEmpty<T>(): T`
Создает пустой экземпляр модели.

```typescript
const user = User.createEmpty();
console.log(user.name); // ""
console.log(user.uuid); // "550e8400-e29b-41d4-a716-446655440000"
```

#### `clone<T>(model: T): T`
Создает копию модели.

```typescript
const original = new User();
original.name = 'John';

const clone = User.clone(original);
console.log(clone.name); // "John"
console.log(clone.uuid); // Новый UUID
```

#### `fetch<T>(id?: number): Promise<Collection>`
Получает модель по ID (требует переопределения).

```typescript
@Model()
class User {
  static async fetch(id?: number): Promise<UserCollection> {
    // Ваша логика получения данных
    const response = await api.get(`/users/${id}`);
    return User.collect(response.data);
  }
}

const users = await User.fetch(1);
```

#### `store<T>(data: Partial<T>): Promise<T>`
Создает новую модель (требует переопределения).

```typescript
@Model()
class User {
  static async store(data: Partial<User>): Promise<User> {
    const response = await api.post('/users', data);
    return new User(response.data);
  }
}

const newUser = await User.store({ name: 'John', email: 'john@example.com' });
```

### Методы экземпляра

#### `store(): Promise<this>`
Сохраняет модель (требует переопределения).

```typescript
@Model()
class User {
  async store(): Promise<this> {
    const response = await api.post('/users', this.to(Strategy.API_REQUEST));
    this.from(Strategy.API_RESPONSE, response.data);
    return this;
  }
}

const user = new User();
user.name = 'John';
await user.store();
```

#### `update(): Promise<this>`
Обновляет модель (требует переопределения).

```typescript
@Model()
class User {
  async update(): Promise<this> {
    const response = await api.put(`/users/${this.id}`, this.to(Strategy.API_REQUEST));
    this.from(Strategy.API_RESPONSE, response.data);
    return this;
  }
}

const user = new User();
user.id = 1;
user.name = 'John Updated';
await user.update();
```

#### `destroy(): Promise<void>`
Удаляет модель (требует переопределения).

```typescript
@Model()
class User {
  async destroy(): Promise<void> {
    await api.delete(`/users/${this.id}`);
  }
}

const user = new User();
user.id = 1;
await user.destroy();
```

## Интерфейс IModel

```typescript
export interface IModel {
  uuid: string;
  store(): Promise<this>;
  update(): Promise<this>;
  destroy(): Promise<void>;
}
```

## Примеры

### Полная модель с CRUD операциями

```typescript
import { Model, Transformable, From, To } from '@/decorators';
import { ModelsTransformStrategies as Strategy } from '@/enums';
import { api } from '@/api';

@Model()
@Transformable()
export default class User {
  @From(Strategy.API_RESPONSE, 'id')
  @To(Strategy.API_REQUEST, 'id')
  declare id?: number;

  @From(Strategy.API_RESPONSE, 'attributes.name')
  @To(Strategy.API_REQUEST, 'name')
  declare name: string = '';

  @From(Strategy.API_RESPONSE, 'attributes.email')
  @To(Strategy.API_REQUEST, 'email')
  declare email: string = '';

  // Переопределяем методы CRUD
  static async fetch(id?: number): Promise<UserCollection> {
    const response = await api.get(id ? `/users/${id}` : '/users');
    return User.collect(response.data);
  }

  static async store(data: Partial<User>): Promise<User> {
    const response = await api.post('/users', data);
    return new User(response.data);
  }

  async store(): Promise<this> {
    const response = await api.post('/users', this.to(Strategy.API_REQUEST));
    this.from(Strategy.API_RESPONSE, response.data);
    return this;
  }

  async update(): Promise<this> {
    const response = await api.put(`/users/${this.id}`, this.to(Strategy.API_REQUEST));
    this.from(Strategy.API_RESPONSE, response.data);
    return this;
  }

  async destroy(): Promise<void> {
    await api.delete(`/users/${this.id}`);
  }
}
```

### Использование в приложении

```typescript
// Создание
const user = new User();
user.name = 'John';
user.email = 'john@example.com';
await user.store();

// Получение
const users = await User.fetch();
const userById = await User.fetch(1);

// Обновление
user.name = 'John Updated';
await user.update();

// Удаление
await user.destroy();

// Работа с коллекциями
const collection = User.collect([
  { id: 1, attributes: { name: 'John' } },
  { id: 2, attributes: { name: 'Jane' } }
]);
```

## Преимущества

1. **Отсутствие наследования** - не нужно наследоваться от BaseModel
2. **Автоматическая генерация UUID** - каждый экземпляр получает уникальный ID
3. **Готовые CRUD методы** - базовые методы для работы с API
4. **Работа с коллекциями** - удобные методы для создания коллекций
5. **Типизация** - полная поддержка TypeScript
6. **Гибкость** - можно переопределить любой метод
