import type { IModel } from "@/decorators";

export default class BaseCollection<T extends IModel> {
    protected items: T[] = [];

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
     * Получить количество элементов в коллекции
     */
    count(): number {
        return this.items.length;
    }

    /**
     * Проверить, пуста ли коллекция
     */
    isEmpty(): boolean {
        return this.count() === 0;
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
        this.items.forEach(callback);
        return this;
    }

    /**
     * Фильтровать коллекцию
     */
    filter(predicate: (item: T, index: number) => boolean): BaseCollection<T> {
        return new BaseCollection(this.items.filter(predicate));
    }

    /**
     * Преобразовать элементы коллекции
     */
    map<U>(callback: (item: T, index: number) => U): BaseCollection<U> {
        return new BaseCollection(this.items.map(callback));
    }

    /**
     * Получить коллекцию с уникальными элементами по ключу
     */
    unique(key: keyof T): BaseCollection<T> {
        const seen = new Set();
        const filtered = this.items.filter(item => {
            const value = item[key];
            if (seen.has(value)) {
                return false;
            }
            seen.add(value);
            return true;
        });
        return new BaseCollection(filtered);
    }

    /**
     * Сортировать коллекцию
     */
    sort(compareFn?: (a: T, b: T) => number): BaseCollection<T> {
        return new BaseCollection([...this.items].sort(compareFn));
    }

    /**
     * Получить подмножество элементов
     */
    slice(start?: number, end?: number): BaseCollection<T> {
        return new BaseCollection(this.items.slice(start, end));
    }

    /**
     * Проверить, содержит ли коллекция элемент
     */
    contains(item: T): boolean {
        return this.items.includes(item);
    }

    /**
     * Найти элемент по условию
     */
    find(predicate: (item: T, index: number) => boolean): T | undefined {
        return this.items.find(predicate);
    }

    /**
     * Найти индекс элемента по условию
     */
    findIndex(predicate: (item: T, index: number) => boolean): number {
        return this.items.findIndex(predicate);
    }

    /**
     * Получить итератор для коллекции
     */
    [Symbol.iterator](): Iterator<T> {
        return this.items[Symbol.iterator]();
    }
}
