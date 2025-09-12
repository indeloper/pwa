import 'reflect-metadata';
import { get, set } from 'lodash';
import { ModelsTransformStrategies as Strategy } from '@/enums';

export interface ITransformable<T> {
    from(strategy: string | symbol, data: any): T;
    to(strategy: string | symbol): any;
}

// Ключи для метаданных
const FROM_KEY = Symbol('from');
const TO_KEY = Symbol('to');
const FROM_RELATIONSHIP_COLLECTION_KEY = Symbol('fromRelationshipCollection');
const FROM_RELATIONSHIP_KEY = Symbol('fromRelationship');

/**
 * Декоратор для указания пути к данным из определенного источника
 * @param strategy Стратегия трансформации (например: 'api_response', 'form', 'standard')
 * @param path Путь к данным (например: 'attributes.name', 'name') или функция-извлечения данных
 * 
 * Примечание: функции в @From получают весь объект данных и должны возвращать значение для свойства
 * Пример: @From(Strategy.API_RESPONSE, (data) => data.attributes.first_name + ' ' + data.attributes.last_name)
 */
export function From(strategy: string | symbol, path: string | ((data: any) => any)) {
    return function (target: any, propertyKey: string) {
        // Сохраняем метаданные для трансформации из источника
        if (!target.constructor.fromMap) {
            target.constructor.fromMap = new Map();
        }

        if (!target.constructor.fromMap.has(propertyKey)) {
            target.constructor.fromMap.set(propertyKey, new Map());
        }

        const propertyFromMap = target.constructor.fromMap.get(propertyKey);
        propertyFromMap.set(strategy, path);
    };
}

/**
 * Декоратор для работы с коллекциями связанных сущностей
 * @param strategy Стратегия трансформации (например: 'api_response')
 * @param relationshipPath Путь к связанным данным (например: 'relationships.properties')
 * @param modelClass Класс модели для создания экземпляров
 * 
 * Пример: @FromRelationshipCollection(Strategy.API_RESPONSE, 'relationships.properties', MaterialProperty)
 */
export function FromRelationshipCollection(strategy: string | symbol, relationshipPath: string, modelClass: any) {
    return function (target: any, propertyKey: string) {
        // Сохраняем метаданные для трансформации коллекции связанных сущностей
        if (!target.constructor.fromRelationshipCollectionMap) {
            target.constructor.fromRelationshipCollectionMap = new Map();
        }

        if (!target.constructor.fromRelationshipCollectionMap.has(propertyKey)) {
            target.constructor.fromRelationshipCollectionMap.set(propertyKey, new Map());
        }

        const propertyFromMap = target.constructor.fromRelationshipCollectionMap.get(propertyKey);
        propertyFromMap.set(strategy, { relationshipPath, modelClass });
    };
}

/**
 * Декоратор для работы с одиночными связанными сущностями
 * @param strategy Стратегия трансформации (например: 'api_response')
 * @param relationshipPath Путь к связанным данным (например: 'relationships.material_unit')
 * @param modelClass Класс модели для создания экземпляра
 * 
 * Пример: @FromRelationship(Strategy.API_RESPONSE, 'relationships.material_unit', MaterialUnit)
 */
export function FromRelationship(strategy: string | symbol, relationshipPath: string, modelClass: any) {
    return function (target: any, propertyKey: string) {
        // Сохраняем метаданные для трансформации одиночной связанной сущности
        if (!target.constructor.fromRelationshipMap) {
            target.constructor.fromRelationshipMap = new Map();
        }

        if (!target.constructor.fromRelationshipMap.has(propertyKey)) {
            target.constructor.fromRelationshipMap.set(propertyKey, new Map());
        }

        const propertyFromMap = target.constructor.fromRelationshipMap.get(propertyKey);
        propertyFromMap.set(strategy, { relationshipPath, modelClass });
    };
}

/**
 * Декоратор для указания пути при трансформации в определенный формат
 * @param strategy Стратегия трансформации (например: 'api_request', 'ui', 'export')
 * @param path Путь для отправки (например: 'name', 'displayName') или функция-трансформации значения
 * 
 * Примечание: функции в @To получают значение свойства и должны возвращать трансформированное значение
 * Пример: @To(Strategy.UI, (value) => value?.toUpperCase())
 */
export function To(strategy: string | symbol, path: string | ((value: any) => any)) {
    return function (target: any, propertyKey: string) {
        // Сохраняем метаданные для трансформации в формат
        if (!target.constructor.toMap) {
            target.constructor.toMap = new Map();
        }

        if (!target.constructor.toMap.has(propertyKey)) {
            target.constructor.toMap.set(propertyKey, new Map());
        }

        const propertyToMap = target.constructor.toMap.get(propertyKey);
        propertyToMap.set(strategy, path);
    };
}

export function Transformable() {
    return function (target: any) {
        
        // Статический метод - создает и возвращает экземпляр
        // Важно: используем текущий конструктор (this), а не замыкание на target,
        // чтобы корректно работать с классами, у которых конструктор подменён другим декоратором
        target.from = function(strategy: string | symbol, data: any) {
            const Ctor = this as any;
            const instance = new Ctor();
            instance.from(strategy, data);
            return instance;
        };
        
        // Обычный метод - применяет трансформацию к существующему экземпляру
        target.prototype.from = function(strategy: string | symbol, data: any) {
            const fromMap = (this.constructor as any).fromMap;
            const fromRelationshipCollectionMap = (this.constructor as any).fromRelationshipCollectionMap;
            const fromRelationshipMap = (this.constructor as any).fromRelationshipMap;
    
            if (!fromMap && !fromRelationshipCollectionMap && !fromRelationshipMap) return this;
    
            // Проверяем, что данные не пустые
            if (!data || Object.keys(data).length === 0) {
                return this;
            }
    
            // Применяем трансформации для указанной стратегии
            if (fromMap) {
                for (const [property, strategyMap] of fromMap) {
                    if (strategyMap.has(strategy)) {
                        const pathOrFunction = strategyMap.get(strategy);
                        let value: any;
    
                        if (typeof pathOrFunction === 'function') {
                            // Если это функция, применяем её к данным и получаем значение для свойства
                            value = pathOrFunction(data);
                        } else {
                            // Если это строка, получаем значение по пути
                            value = get(data, pathOrFunction);
                        }
    
                        (this as any)[property] = value;
                    }
                }
            }
    
            // Применяем трансформации для коллекций связанных сущностей
            if (fromRelationshipCollectionMap) {
                for (const [property, strategyMap] of fromRelationshipCollectionMap) {
                    if (strategyMap.has(strategy)) {
                        const { relationshipPath, modelClass } = strategyMap.get(strategy);
                        const relationshipData = get(data, relationshipPath);
    
                        if (relationshipData && Array.isArray(relationshipData)) {
                            // Создаем коллекцию из связанных данных с автоматической трансформацией
                            const collection = modelClass.collect(relationshipData, strategy);
                            (this as any)[property] = collection;
                        }
                    }
                }
            }
    
            // Применяем трансформации для одиночных связанных сущностей
            if (fromRelationshipMap) {
                for (const [property, strategyMap] of fromRelationshipMap) {
                    if (strategyMap.has(strategy)) {
                        const { relationshipPath, modelClass } = strategyMap.get(strategy);
                        const relationshipData = get(data, relationshipPath);
    
                        if (relationshipData && typeof relationshipData === 'object' && !Array.isArray(relationshipData)) {
                            // Создаем экземпляр модели из связанных данных
                            const modelInstance = new modelClass(relationshipData);
                            (this as any)[property] = modelInstance;
                        }
                    }
                }
            }
    
            return this;
        };
        
        target.prototype.to = function(strategy: string | symbol): any {
            const toMap = (this.constructor as any).toMap;
            if (!toMap) return {};
    
            const result: any = {};
    
            // Применяем трансформации для указанной стратегии
            for (const [property, strategyMap] of toMap) {
                if (strategyMap.has(strategy)) {
                    const pathOrFunction = strategyMap.get(strategy);
                    const value = (this as any)[property];
    
                    if (value !== undefined) {
                        if (typeof pathOrFunction === 'function') {
                            // Если это функция, применяем её к значению
                            const transformedValue = pathOrFunction(value);
                            // Для функций используем имя свойства как ключ
                            result[property] = transformedValue;
                        } else {
                            // Если это строка, устанавливаем значение по пути
                            set(result, pathOrFunction, value);
                        }
                    }
                }
            }
    
            return result;
        };
    };
};

// -----------------------------
// Unified decorator for From/To
// -----------------------------

export type StrategyKey = string | symbol;

export type FromPath = string | ((data: any) => any);
export type ToPath = string | ((value: any) => any);

export interface MapFieldConfig {
    from?: Record<StrategyKey, FromPath> | Array<[StrategyKey, FromPath]>;
    to?: Record<StrategyKey, ToPath> | Array<[StrategyKey, ToPath]>;
}

function ensureMap(container: any, key: string): Map<string | symbol, any> {
    if (!container[key]) {
        container[key] = new Map();
    }
    return container[key];
}

function applyRecordOrArray<T extends string | symbol, V>(
    targetMap: Map<T, V>,
    input: Record<T, V> | Array<[T, V]>
) {
    if (Array.isArray(input)) {
        for (const [strategy, path] of input) {
            targetMap.set(strategy, path);
        }
    } else if (input && typeof input === 'object') {
        for (const strategy of Object.keys(input) as T[]) {
            targetMap.set(strategy, (input as Record<T, V>)[strategy]);
        }
    }
}

export function MapField(config?: MapFieldConfig | true) {
    return function (target: any, propertyKey: string) {
        const hasConfigObject = !!config && config !== true && typeof config === 'object';
        const hasFrom = hasConfigObject && !!(config as MapFieldConfig).from;
        const hasTo = hasConfigObject && !!(config as MapFieldConfig).to;

        // Default mapping if decorator is empty or a side is not provided
        if (!hasFrom) {
            const fromContainer = ensureMap(target.constructor, 'fromMap');
            if (!fromContainer.has(propertyKey)) {
                fromContainer.set(propertyKey, new Map());
            }
            const propertyFromMap: Map<StrategyKey, FromPath> = fromContainer.get(propertyKey);
            // Default to API_RESPONSE -> same property name
            if (!propertyFromMap.has(Strategy.API_RESPONSE)) {
                propertyFromMap.set(Strategy.API_RESPONSE, propertyKey);
            }
            if (hasFrom) {
                applyRecordOrArray(propertyFromMap as any, (config as MapFieldConfig).from as any);
            }
        }

        if (!hasTo) {
            const toContainer = ensureMap(target.constructor, 'toMap');
            if (!toContainer.has(propertyKey)) {
                toContainer.set(propertyKey, new Map());
            }
            const propertyToMap: Map<StrategyKey, ToPath> = toContainer.get(propertyKey);
            // Default to API_REQUEST -> same property name
            if (!propertyToMap.has(Strategy.API_REQUEST)) {
                propertyToMap.set(Strategy.API_REQUEST, propertyKey);
            }
            if (hasTo) {
                applyRecordOrArray(propertyToMap as any, (config as MapFieldConfig).to as any);
            }
        }
    };
}
