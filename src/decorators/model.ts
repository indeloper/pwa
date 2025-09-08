import { v4 as uuidv4 } from 'uuid';

export interface IModelStatic<T extends IModel<T>> {
    new(...args: any[]): T;
    clone(model: T): T;
}

export interface IModel<T extends IModel<T>> {
    uuid: string;
    // _uuid?: string; // внутреннее поле для хранения UUID
    // store(): Promise<T>;
    // update(): Promise<T>;
    // destroy(): Promise<string>;
    refresh(other: Partial<T>): T;
}

export function Model<T extends IModel<T>>() {
    return function <TConstructor extends new(...args: any[]) => T>(target: TConstructor): TConstructor & IModelStatic<T> {
        // Оборачиваем конструктор, чтобы гарантированно назначать uuid
        const Extended = class extends (target as any) {
            constructor(...args: any[]) {
                super(...args);
                if (!(this as any).uuid) {
                    (this as any).uuid = uuidv4();
                }
            }
        } as unknown as TConstructor & IModelStatic<T>;

        // clone: создает новый экземпляр с НОВЫМ uuid и копирует поля через refresh
        try {
            (Extended as any).clone = function(this: any, model: T): T {
                const instance = new this();
                instance.refresh(model);
                return instance;
            };
        } catch {}

        // refresh: копирует поля, сохраняя текущий uuid
        (Extended as any).prototype.refresh = function(this: T, other: Partial<T>): T {
            const currentUuid = (this as any).uuid;
            Object.assign(this, other);
            if (currentUuid) {
                (this as any).uuid = currentUuid;
            }
            return this;
        };

        return Extended;
    };
}