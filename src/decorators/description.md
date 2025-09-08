# Декоратор описаний — @Description()

Декоратор свойства, который добавляет человекочитаемое описание поля в карту `descriptions` экземпляра модели. Это используется, например, в `ValidatableModelField.vue`, где описание отображается под полем формы.

## Использование

```ts
import { Description } from '@/decorators';

class User {
  @Description('Имя пользователя для отображения в интерфейсе')
  declare name: string;
}

const u = new User();
console.log(u.descriptions.name); // 'Имя пользователя для отображения в интерфейсе'
```

## В шаблонах форм

Компонент `ValidatableModelField` ожидает, что у модели будет карта `descriptions`, поэтому описания будут показаны автоматически:

```vue
<ValidatableModelField :model="model" label="Имя" property="name" :touched="touched" />
```

## Поведение

- Описания хранятся на конструкторе класса модели и доступны через `instance.descriptions[property]`.
- Можно использовать вместе с другими декораторами (например, `@Validate`, `@From`, `@To`).
- Никак не влияет на валидацию и трансформации — только метаинформация для UI.
