import type { IModel, ITransformable } from "@/decorators";
import type { IValidatable } from "@/decorators/validation";
import type BaseCollection from "./BaseCollection";
import { v4 as uuidv4 } from 'uuid';

/**
 * @deprecated Используется исключительно для добавления загрушек декораторов
 */
export default abstract class BaseModel<T extends IModel<T>> implements IModel<T>, ITransformable<T>, IValidatable {
    // Эти поля добавляются декораторами, не делаем их абстрактными
    uuid!: string; // декоратор @Model добавит геттер
    // _uuid?: string; // внутреннее поле для декоратора
    // static collection убираем - каждая модель определит своё

    constructor() {
        this.uuid = uuidv4();
    }

    abstract store(): Promise<T>;
    abstract update(): Promise<T>;
    abstract destroy(): Promise<string>;

    /** @ts-ignore */
    refresh(other: Partial<T>): T {
        return this as any; // декоратор перезапишет
    }
    
    /** @ts-ignore */
    from(strategy: any, data: any): this {
        return this; // декоратор перезапишет
    }
    
    /** @ts-ignore */
    to(strategy: any): any {
        return {}; // декоратор перезапишет
    }
    
    /** @ts-ignore */
    validationErrors(): any[] {
        return []; // декоратор перезапишет
    }
    
    /** @ts-ignore */
    isValid(): boolean {
        return true; // декоратор перезапишет
    }
    
    /** @ts-ignore */
    validate(): boolean {
        return true; // декоратор перезапишет
    }
}