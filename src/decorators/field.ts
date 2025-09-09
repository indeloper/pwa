import { ValidationRules, ValidationRuleType, type ValidationRule } from './validation';

// Поля формы: метаданные для автогенерации UI
// Пример использования:
//   @Field({ label: 'Имя', type: 'text', description: 'Подсказка', validationRules: [ValidationRules.required()] })
//   name: string = '';

export type FieldType = 'text' | 'textarea' | 'longtext' | 'number' | 'boolean' | 'select' | 'multiselect' | 'date' | 'datetime' | 'checkbox' | 'radio';

export interface FieldOptions {
    label?: string;
    hidden?: boolean;
    type?: FieldType;
    source?: any;            // источник данных (например, список опций) — задается извне формой/стором
    multiple?: boolean;
    placeholder?: string;
    required?: boolean;      // шорткат для обязательности, без явного импорта ValidationRules
    description?: string;    // текст подсказки
    validationRules?: ValidationRule[]; // правила валидации (интегрируются с Validatable)
    options?: { label: string; value: any }[] | ((context?: any) => { label: string; value: any }[]);
    displayValue?: (value: any) => string; // функция для отображения значения
    filterValue?: (value: any) => any; // функция для получения значения для фильтрации
}

const FIELDS_META = Symbol('fieldsMeta');
const FIELDS_GETTER_INSTALLED = Symbol('fieldsGetterInstalled');
const DESCRIPTIONS_MAP = Symbol('descriptionsMap');
const DESCRIPTIONS_GETTER_INSTALLED = Symbol('descriptionsGetterInstalled');

export function Field(options: FieldOptions) {
    return function (target: any, propertyKey: string) {
        const ctor = target.constructor as any;

        // 1) Храним агрегированные метаданные по полям (статически на классе)
        if (!ctor[FIELDS_META]) {
            ctor[FIELDS_META] = {} as Record<string, FieldOptions>;
        }

        const existing: FieldOptions = (ctor[FIELDS_META] as Record<string, FieldOptions>)[propertyKey] || {};
        (ctor[FIELDS_META] as Record<string, FieldOptions>)[propertyKey] = {
            ...existing,
            ...options,
        };

        // 2) Интеграция с Description: поддерживаем model.descriptions[property]
        if (options.description) {
            if (!ctor[DESCRIPTIONS_MAP]) {
                ctor[DESCRIPTIONS_MAP] = {} as Record<string, string>;
            }
            (ctor[DESCRIPTIONS_MAP] as Record<string, string>)[propertyKey] = options.description;

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
        }

        // 3) Интеграция с Validatable: сохраняем правила на классе, как это делает @Validate
        // Обеспечиваем наличие validationRulesMap
        if (!ctor.validationRulesMap) {
            ctor.validationRulesMap = new Map<string, ValidationRule[]>();
        }
        const prevRules: ValidationRule[] = (ctor.validationRulesMap.get(propertyKey) as ValidationRule[] | undefined) || [];
        const mergedRules: ValidationRule[] = [...prevRules];

        // Добавляем явно переданные правила
        if (Array.isArray(options.validationRules) && options.validationRules.length > 0) {
            mergedRules.push(...options.validationRules);
        }

        // Шорткат: required
        if (options.required === true && !mergedRules.some(r => r.type === ValidationRuleType.REQUIRED)) {
            mergedRules.push(ValidationRules.required());
        }

        if (mergedRules.length > 0) {
            ctor.validationRulesMap.set(propertyKey, mergedRules);
        }

        // 4) Экспонируем поля на инстансе и на классе
        if (!target[FIELDS_GETTER_INSTALLED]) {
            Object.defineProperty(target, 'fields', {
                get: function (): Record<string, FieldOptions> {
                    return (this.constructor as any)[FIELDS_META] || {};
                },
                enumerable: true,
                configurable: true
            });

            // Метод для получения опции поля (автоматически вызывает функции)
            Object.defineProperty(target, 'getFieldOption', {
                value: function (fieldName: string, optionKey: string): any {
                    const fieldMeta = (this.constructor as any)[FIELDS_META]?.[fieldName];
                    const value = fieldMeta?.[optionKey];
                    // Если значение - функция, вызываем её
                    if (typeof value === 'function') {
                        return value(this);
                    }
                    return value;
                },
                enumerable: true,
                configurable: true
            });

            // Метод для получения displayValue функции
            Object.defineProperty(target, 'getFieldDisplayValue', {
                value: function (fieldName: string, value: any): string {
                    const fieldMeta = (this.constructor as any)[FIELDS_META]?.[fieldName];
                    const displayValueFn = fieldMeta?.['displayValue'];
                    if (typeof displayValueFn === 'function') {
                        return displayValueFn(value);
                    }
                    // Fallback: возвращаем строковое представление значения
                    return value?.toString() || '';
                },
                enumerable: true,
                configurable: true
            });

            // Метод для получения filterValue функции
            Object.defineProperty(target, 'getFieldFilterValue', {
                value: function (fieldName: string, value: any): any {
                    const fieldMeta = (this.constructor as any)[FIELDS_META]?.[fieldName];
                    const filterValueFn = fieldMeta?.['filterValue'];
                    if (typeof filterValueFn === 'function') {
                        return filterValueFn(value);
                    }
                    // Fallback: возвращаем значение как есть для фильтрации
                    return value;
                },
                enumerable: true,
                configurable: true
            });

            // Также статический геттер для удобства: Model.fields
            Object.defineProperty(ctor, 'fields', {
                get: function (): Record<string, FieldOptions> {
                    return (this as any)[FIELDS_META] || {};
                },
                enumerable: true,
                configurable: true
            });

            // Статический метод для получения опции поля (автоматически вызывает функции)
            Object.defineProperty(ctor, 'getFieldOption', {
                value: function (fieldName: string, optionKey: string): any {
                    const fieldMeta = (this as any)[FIELDS_META]?.[fieldName];
                    const value = fieldMeta?.[optionKey];
                    // Если значение - функция, вызываем её
                    if (typeof value === 'function') {
                        return value();
                    }
                    return value;
                },
                enumerable: true,
                configurable: true
            });

            // Статический метод для получения displayValue функции
            Object.defineProperty(ctor, 'getFieldDisplayValue', {
                value: function (fieldName: string, value: any): string {
                    const fieldMeta = (this as any)[FIELDS_META]?.[fieldName];
                    const displayValueFn = fieldMeta?.['displayValue'];
                    if (typeof displayValueFn === 'function') {
                        return displayValueFn(value);
                    }
                    // Fallback: возвращаем строковое представление значения
                    return value?.toString() || '';
                },
                enumerable: true,
                configurable: true
            });

            // Статический метод для получения filterValue функции
            Object.defineProperty(ctor, 'getFieldFilterValue', {
                value: function (fieldName: string, value: any): any {
                    const fieldMeta = (this as any)[FIELDS_META]?.[fieldName];
                    const filterValueFn = fieldMeta?.['filterValue'];
                    if (typeof filterValueFn === 'function') {
                        return filterValueFn(value);
                    }
                    // Fallback: возвращаем значение как есть для фильтрации
                    return value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(target, FIELDS_GETTER_INSTALLED, {
                value: true,
                enumerable: false,
                configurable: false,
                writable: false
            });
        }
    };
}

export type { FieldOptions as FieldSchema };


