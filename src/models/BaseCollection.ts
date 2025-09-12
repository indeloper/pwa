import type { IModel } from "@/decorators";
import { 
    forEach, 
    filter, 
    map, 
    find, 
    findIndex, 
    includes, 
    slice, 
    sortBy, 
    uniqBy,
    size,
    isEmpty as lodashIsEmpty
} from 'lodash';

export interface IBaseCollection<T> {
    items: T[];
    all(): T[];
    findById(id: number): T | undefined;
    whereIds(ids: number[]): BaseCollection<T>;
    findByUuid(uuid: string): T | undefined;
    count(): number;
}

export default class BaseCollection<T> implements IBaseCollection<T> {
    items: T[] = [];

    constructor(items: T[] = []) {
        this.items = items;
    }

    /**
     * Получить все элементы коллекции
     */
    all(): T[] {
        return [...this.items];
    }

    /**
     * Найти элемент по ID
     */
    findById(id: number): T | undefined {
        return this.find(item => (item as any).id === id);
    }

    /**
     * Найти элементы по ID
     */
    whereIds(ids: number[]): BaseCollection<T> {
        return new BaseCollection(this.filter(item => ids.includes((item as any).id)).toArray());
    }

    /**
     * Найти элемент по UUID
     */
    findByUuid(uuid: string): T | undefined {
        return this.find(item => (item as any).uuid === uuid);
    }

    /**
     * Получить количество элементов в коллекции
     */
    count(): number {
        return size(this.items);
    }

    /**
     * Проверить, пуста ли коллекция
     */
    isEmpty(): boolean {
        return lodashIsEmpty(this.items);
    }

    /**
     * Проверить, не пуста ли коллекция
     */
    isNotEmpty(): boolean {
        return !this.isEmpty();
    }

    /**
     * Получить первый элемент коллекции
     */
    first(): T | undefined {
        return this.items[0];
    }

    /**
     * Получить последний элемент коллекции
     */
    last(): T | undefined {
        return this.items[this.items.length - 1];
    }

    /**
     * Получить элемент по индексу
     */
    get(index: number): T | undefined {
        return this.items[index];
    }

    /**
     * Добавить элемент в коллекцию
     */
    push(item: T): this {
        this.items.push(item);
        return this;
    }

    /**
     * Добавить несколько элементов в коллекцию
     */
    pushMany(items: T[]): this {
        this.items.push(...items);
        return this;
    }

    /**
     * Удалить элемент по индексу
     */
    remove(index: number): T | undefined {
        return this.items.splice(index, 1)[0];
    }

    /**
     * Удалить элемент по uuid
     */
    removeByUuid(uuid: string): T | undefined {
        return this.items.splice(this.items.findIndex(item => item.uuid === uuid), 1)[0];
    }

    /**
     * Удалить элемент по id
     */
    removeById(id: number): T | undefined {
        const index = this.items.findIndex(item => (item as any).id === id);
        if (index === -1) return undefined;
        return this.items.splice(index, 1)[0];
    }

    /**
     * Заменить элемент по uuid
     */
    replaceByUuid(uuid: string, next: T): this {
        const index = this.items.findIndex(item => item.uuid === uuid);
        if (index !== -1) {
            this.items.splice(index, 1, next);
        }
        return this;
    }

    /**
     * Заменить элемент по id
     */
    replaceById(id: number, next: T): this {
        const index = this.items.findIndex(item => (item as any).id === id);
        if (index !== -1) {
            this.items.splice(index, 1, next);
        }
        return this;
    }

    /**
     * Удалить элемент по условию
     */
    removeBy(predicate: (item: T, index: number) => boolean): T | undefined {
        return this.items.splice(this.items.findIndex(predicate), 1)[0];
    }

    /**
     * Очистить коллекцию
     */
    clear(): this {
        this.items = [];
        return this;
    }

    /**
     * Получить коллекцию как массив
     */
    toArray(): T[] {
        return this.all();
    }

    /**
     * Применить функцию к каждому элементу
     */
    each(callback: (item: T, index: number) => void): this {
        forEach(this.items, callback);
        return this;
    }

    /**
     * Фильтровать коллекцию
     */
    filter(predicate: (item: T, index: number) => boolean): BaseCollection<T> {
        return new BaseCollection(filter(this.items, predicate));
    }

    /**
     * Преобразовать элементы коллекции
     */
    map<U extends IModel<U>>(callback: (item: T, index: number) => U): BaseCollection<U> {
        return new BaseCollection(map(this.items, callback));
    }

    /**
     * Получить коллекцию с уникальными элементами по ключу
     */
    unique(key: keyof T): BaseCollection<T> {
        return new BaseCollection(uniqBy(this.items, key));
    }

    /**
     * Сортировать коллекцию
     */
    sort(compareFn?: (a: T, b: T) => number): BaseCollection<T> {
        if (compareFn) {
            return new BaseCollection([...this.items].sort(compareFn));
        }
        return new BaseCollection(sortBy(this.items));
    }

    /**
     * Получить подмножество элементов
     */
    slice(start?: number, end?: number): BaseCollection<T> {
        return new BaseCollection(slice(this.items, start, end));
    }

    /**
     * Проверить, содержит ли коллекция элемент
     */
    contains(item: T): boolean {
        return includes(this.items, item);
    }

    /**
     * Найти элемент по условию
     */
    find(predicate: (item: T, index: number) => boolean): T | undefined {
        return find(this.items, predicate);
    }

    /**
     * Найти индекс элемента по условию
     */
    findIndex(predicate: (item: T, index: number) => boolean): number {
        return findIndex(this.items, predicate);
    }

    toOptions({ labelKey = 'name', valueKey = 'id' }: { labelKey?: string, valueKey?: string } = {}): { label: string, value: string }[] {
        return this.items.map(item => ({ label: item[labelKey], value: item[valueKey] }));
    }

    /**
     * Получить итератор для коллекции
     */
    [Symbol.iterator](): Iterator<T> {
        return this.items[Symbol.iterator]();
    }
}
