import { v4 as uuidv4 } from 'uuid';
import BaseCollection from '../models/BaseCollection';

export interface IModelStatic<T extends IModel<T>> {
    new(...args: any[]): T;
    collection?: typeof BaseCollection;
    collect(items: T[]): BaseCollection<T>;
    createEmpty(): T;
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
        const staticTarget = target as unknown as TConstructor & IModelStatic<T>;

        staticTarget.collect = function(this: any, items: T[]): BaseCollection<T> {
            const collectionClass = this.collection || BaseCollection;
            return new collectionClass(items);
        };

        staticTarget.createEmpty = function(this: any): T {
            return new this();
        };

        staticTarget.clone = function(this: any, model: T): T {
            return new this(model);
        };

        target.prototype.refresh = function(this: T, other: Partial<T>): T {
            const currentUuid = this.uuid;
            Object.assign(this, other);
            if (currentUuid) {
                this.uuid = currentUuid;
            }
            return this;
        };

        return staticTarget as unknown as TConstructor & IModelStatic<T>;
    };
}