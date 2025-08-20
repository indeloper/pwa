# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

## Документация

### Декораторы

Проект использует систему декораторов для создания моделей с автоматической трансформацией данных, валидацией и базовой функциональностью.

📖 **[Подробная документация по декораторам](./src/decorators/README.md)**

#### Доступные декораторы:

- **[@Model()](./src/decorators/model.md)** - Базовые возможности модели (UUID, CRUD методы)
- **[@Transformable()](./src/decorators/transform.md)** - Трансформация данных
- **[@From()](./src/decorators/transform.md#from)** - Извлечение данных из источника
- **[@To()](./src/decorators/transform.md#to)** - Трансформация данных в целевой формат
- **[@FromRelationship()](./src/decorators/transform.md#fromrelationship)** - Работа с связанными сущностями
- **[@FromRelationshipCollection()](./src/decorators/transform.md#fromrelationshipcollection)** - Работа с коллекциями связанных сущностей
- **[@Validatable()](./src/decorators/validation.md)** - Валидация модели
- **[@Validate()](./src/decorators/validation.md#validate)** - Правила валидации для свойств

#### Быстрый старт:

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
