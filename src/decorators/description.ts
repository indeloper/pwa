// Декоратор для добавления описания к свойству модели
// Использование:
//   @Description('Подсказка/описание поля')
//   declare name: string;

const DESCRIPTIONS_MAP = Symbol('descriptionsMap');
const DESCRIPTIONS_GETTER_INSTALLED = Symbol('descriptionsGetterInstalled');

export function Description(text: string) {
    return function (target: any, propertyKey: string) {
        const ctor = target.constructor as any;

        if (!ctor[DESCRIPTIONS_MAP]) {
            ctor[DESCRIPTIONS_MAP] = {} as Record<string, string>;
        }

        (ctor[DESCRIPTIONS_MAP] as Record<string, string>)[propertyKey] = text;

        if (!target[DESCRIPTIONS_GETTER_INSTALLED]) {
            Object.defineProperty(target, 'descriptions', {
                get: function () {
                    return (this.constructor as any)[DESCRIPTIONS_MAP] || {};
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(target, DESCRIPTIONS_GETTER_INSTALLED, {
                value: true,
                enumerable: false,
                configurable: false,
                writable: false
            });
        }
    };
}


