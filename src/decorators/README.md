# Декораторы

Этот модуль содержит набор декораторов для создания моделей с автоматической трансформацией данных, валидацией и базовой функциональностью.

## Содержание

- [@Model()](./model.md) - Базовые возможности модели (UUID, CRUD методы)
- [@Transformable()](./transform.md) - Трансформация данных
- [@From()](./transform.md#from) - Извлечение данных из источника
- [@To()](./transform.md#to) - Трансформация данных в целевой формат
- [@FromRelationship()](./transform.md#fromrelationship) - Работа с связанными сущностями
- [@FromRelationshipCollection()](./transform.md#fromrelationshipcollection) - Работа с коллекциями связанных сущностей
- [@Validatable()](./validation.md) - Валидация модели
- [@Validate()](./validation.md#validate) - Правила валидации для свойств

## Быстрый старт

```typescript
import { Model, Transformable, From, To, Validatable, Validate, ValidationRules } from '@/decorators';
import { ModelsTransformStrategies as Strategy } from '@/enums';

@Model()
@Transformable()
@Validatable()
export default class User {
  @From(Strategy.API_RESPONSE, 'id')
  @To(Strategy.API_REQUEST, 'id')
  @Validate([ValidationRules.required()])
  declare id?: number;

  @From(Strategy.API_RESPONSE, 'attributes.name')
  @To(Strategy.API_REQUEST, 'name')
  @Validate([ValidationRules.required('Имя обязательно')])
  declare name: string = '';

  // Автоматически получаем:
  // - UUID
  // - Методы CRUD (store, update, destroy)
  // - Трансформацию данных
  // - Валидацию
}
```

## Принципы работы

1. **@Model()** - добавляет базовую функциональность модели
2. **@Transformable()** - добавляет методы трансформации данных
3. **@Validatable()** - добавляет методы валидации
4. **Декораторы свойств** - определяют правила трансформации и валидации

## Стратегии трансформации

```typescript
enum ModelsTransformStrategies {
  API_RESPONSE = 'api_response',  // Данные от API
  API_REQUEST = 'api_request',    // Данные для API
  UI = 'ui',                      // Данные для интерфейса
  EXPORT = 'export'               // Данные для экспорта
}
```
