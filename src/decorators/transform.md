# Декораторы трансформации

Модуль содержит декораторы для автоматической трансформации данных между различными форматами.

## @Transformable()

Декоратор класса, который добавляет методы трансформации данных.

### Описание

Декоратор `@Transformable()` добавляет к классу:
- Статический метод `from()` для создания экземпляра с трансформацией
- Метод экземпляра `from()` для трансформации данных в экземпляр
- Метод экземпляра `to()` для трансформации экземпляра в целевой формат

### Использование

```typescript
import { Transformable, From, To } from '@/decorators';
import { ModelsTransformStrategies as Strategy } from '@/enums';

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

### Добавляемые методы

#### Статический `from(strategy: string | symbol, data: any): User`
Создает новый экземпляр и применяет трансформацию.

```typescript
const user = User.from(Strategy.API_RESPONSE, {
  id: 1,
  attributes: { name: 'John' }
});
console.log(user.name); // "John"
```

#### Экземпляр `from(strategy: string | symbol, data: any): this`
Применяет трансформацию к существующему экземпляру.

```typescript
const user = new User();
user.from(Strategy.API_RESPONSE, {
  id: 1,
  attributes: { name: 'John' }
});
console.log(user.name); // "John"
```

#### `to(strategy: string | symbol): any`
Трансформирует экземпляр в целевой формат.

```typescript
const user = new User();
user.id = 1;
user.name = 'John';

const apiData = user.to(Strategy.API_REQUEST);
console.log(apiData); // { id: 1, name: 'John' }
```

## @From()

Декоратор свойства для указания пути к данным из определенного источника.

### Синтаксис

```typescript
@From(strategy: string | symbol, path: string | ((data: any) => any))
```

### Параметры

- `strategy` - Стратегия трансформации (например: `Strategy.API_RESPONSE`)
- `path` - Путь к данным или функция-извлечения данных

### Примеры

#### Строковый путь

```typescript
@From(Strategy.API_RESPONSE, 'attributes.name')
declare name: string;

@From(Strategy.API_RESPONSE, 'id')
declare id?: number;

@From(Strategy.API_RESPONSE, 'meta.created_at')
declare createdAt: string;
```

#### Функция-извлечения

```typescript
@From(Strategy.API_RESPONSE, (data) => data.attributes.first_name + ' ' + data.attributes.last_name)
declare fullName: string;

@From(Strategy.API_RESPONSE, (data) => data.attributes.age > 18 ? 'adult' : 'minor')
declare status: string;

@From(Strategy.API_RESPONSE, (data) => new Date(data.attributes.created_at))
declare createdAt: Date;
```

#### Множественные стратегии

```typescript
@From(Strategy.API_RESPONSE, 'attributes.name')
@From(Strategy.UI, 'displayName')
declare name: string;
```

## @To()

Декоратор свойства для указания пути при трансформации в определенный формат.

### Синтаксис

```typescript
@To(strategy: string | symbol, path: string | ((value: any) => any))
```

### Параметры

- `strategy` - Стратегия трансформации (например: `Strategy.API_REQUEST`)
- `path` - Путь для отправки или функция-трансформации значения

### Примеры

#### Строковый путь

```typescript
@To(Strategy.API_REQUEST, 'name')
declare name: string;

@To(Strategy.API_REQUEST, 'id')
declare id?: number;

@To(Strategy.API_REQUEST, 'meta.created_at')
declare createdAt: string;
```

#### Функция-трансформации

```typescript
@To(Strategy.UI, (value) => value?.toUpperCase())
declare name: string;

@To(Strategy.API_REQUEST, (value) => value ? 'active' : 'inactive')
declare isActive: boolean;

@To(Strategy.EXPORT, (value) => value.toISOString())
declare createdAt: Date;
```

#### Множественные стратегии

```typescript
@To(Strategy.API_REQUEST, 'name')
@To(Strategy.UI, 'displayName')
declare name: string;
```

## @FromRelationship()

Декоратор для работы с одиночными связанными сущностями.

### Синтаксис

```typescript
@FromRelationship(strategy: string | symbol, relationshipPath: string, modelClass: any)
```

### Параметры

- `strategy` - Стратегия трансформации
- `relationshipPath` - Путь к связанным данным
- `modelClass` - Класс модели для создания экземпляра

### Примеры

```typescript
import MaterialUnit from '@/models/MaterialUnit';

@FromRelationship(Strategy.API_RESPONSE, 'relationships.material_unit', MaterialUnit)
declare materialUnit?: MaterialUnit;

@FromRelationship(Strategy.API_RESPONSE, 'relationships.owner', User)
declare owner?: User;
```

### Данные API

```json
{
  "id": 1,
  "attributes": {
    "name": "Material Type 1"
  },
  "relationships": {
    "material_unit": {
      "id": 5,
      "attributes": {
        "name": "кг"
      }
    }
  }
}
```

### Результат

```typescript
const materialType = MaterialType.from(Strategy.API_RESPONSE, apiData);
console.log(materialType.materialUnit); // Экземпляр MaterialUnit
console.log(materialType.materialUnit.name); // "кг"
```

## @FromRelationshipCollection()

Декоратор для работы с коллекциями связанных сущностей.

### Синтаксис

```typescript
@FromRelationshipCollection(strategy: string | symbol, relationshipPath: string, modelClass: any)
```

### Параметры

- `strategy` - Стратегия трансформации
- `relationshipPath` - Путь к связанным данным
- `modelClass` - Класс модели для создания экземпляров

### Примеры

```typescript
import MaterialProperty from '@/models/MaterialProperty';

@FromRelationshipCollection(Strategy.API_RESPONSE, 'relationships.properties', MaterialProperty)
declare properties?: MaterialPropertyCollection;

@FromRelationshipCollection(Strategy.API_RESPONSE, 'relationships.tags', Tag)
declare tags?: TagCollection;
```

### Данные API

```json
{
  "id": 1,
  "attributes": {
    "name": "Material Type 1"
  },
  "relationships": {
    "properties": [
      {
        "id": 1,
        "attributes": {
          "name": "Плотность"
        }
      },
      {
        "id": 2,
        "attributes": {
          "name": "Прочность"
        }
      }
    ]
  }
}
```

### Результат

```typescript
const materialType = MaterialType.from(Strategy.API_RESPONSE, apiData);
console.log(materialType.properties); // MaterialPropertyCollection
console.log(materialType.properties.length); // 2
console.log(materialType.properties[0].name); // "Плотность"
```

## Стратегии трансформации

```typescript
enum ModelsTransformStrategies {
  API_RESPONSE = 'api_response',  // Данные от API
  API_REQUEST = 'api_request',    // Данные для API
  UI = 'ui',                      // Данные для интерфейса
  EXPORT = 'export'               // Данные для экспорта
}
```

## Полный пример

```typescript
import { Transformable, From, To, FromRelationship, FromRelationshipCollection } from '@/decorators';
import { ModelsTransformStrategies as Strategy } from '@/enums';
import MaterialUnit from '@/models/MaterialUnit';
import MaterialProperty from '@/models/MaterialProperty';

@Transformable()
export default class MaterialType {
  @From(Strategy.API_RESPONSE, 'id')
  @To(Strategy.API_REQUEST, 'id')
  declare id?: number;

  @From(Strategy.API_RESPONSE, 'attributes.name')
  @To(Strategy.API_REQUEST, 'name')
  @To(Strategy.UI, (value) => value?.toUpperCase())
  declare name: string = '';

  @From(Strategy.API_RESPONSE, 'attributes.description')
  @To(Strategy.API_REQUEST, 'description')
  declare description: string | null = null;

  @FromRelationship(Strategy.API_RESPONSE, 'relationships.material_unit', MaterialUnit)
  @To(Strategy.API_REQUEST, 'material_unit_id')
  declare materialUnit?: MaterialUnit;

  @FromRelationshipCollection(Strategy.API_RESPONSE, 'relationships.properties', MaterialProperty)
  @To(Strategy.API_REQUEST, 'property_ids')
  declare properties?: MaterialPropertyCollection;
}
```

### Использование

```typescript
// Создание из API данных
const apiData = {
  id: 1,
  attributes: {
    name: 'steel',
    description: 'High strength steel'
  },
  relationships: {
    material_unit: {
      id: 5,
      attributes: { name: 'кг' }
    },
    properties: [
      { id: 1, attributes: { name: 'Плотность' } },
      { id: 2, attributes: { name: 'Прочность' } }
    ]
  }
};

const materialType = MaterialType.from(Strategy.API_RESPONSE, apiData);

// Трансформация в API запрос
const requestData = materialType.to(Strategy.API_REQUEST);
console.log(requestData);
// {
//   id: 1,
//   name: 'steel',
//   description: 'High strength steel',
//   material_unit_id: 5,
//   property_ids: [1, 2]
// }

// Трансформация для UI
const uiData = materialType.to(Strategy.UI);
console.log(uiData);
// {
//   id: 1,
//   name: 'STEEL',
//   description: 'High strength steel'
// }
```

## Преимущества

1. **Декларативность** - правила трансформации видны в определении класса
2. **Переиспользование** - одни и те же правила применяются везде
3. **Типобезопасность** - полная поддержка TypeScript
4. **Гибкость** - поддержка функций для сложной логики
5. **Производительность** - правила компилируются один раз
6. **Читаемость** - код становится более понятным
