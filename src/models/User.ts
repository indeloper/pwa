import { Model, Transformable, From, To, Validatable, Validate, ValidationRules } from "@/decorators";
import { ModelsTransformStrategies as Strategy } from "@/enums";

export interface IUser {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    patronymic: string;
}

@Model()
@Transformable()
@Validatable()
export default class User implements IUser {
    @From(Strategy.API_RESPONSE, 'id')
    @To(Strategy.API_REQUEST, 'id')
    id: number = 0;
    
    @From(Strategy.API_RESPONSE, 'attributes.email')
    @To(Strategy.API_REQUEST, 'email')
    @Validate([ValidationRules.required('Email обязателен')])
    email: string = '';
    
    @From(Strategy.API_RESPONSE, 'attributes.first_name')
    @To(Strategy.API_REQUEST, 'first_name')
    @Validate([ValidationRules.required('Имя обязательно')])
    first_name: string = '';
    
    @From(Strategy.API_RESPONSE, 'attributes.last_name')
    @To(Strategy.API_REQUEST, 'last_name')
    @Validate([ValidationRules.required('Фамилия обязательна')])
    last_name: string = '';
    
    @From(Strategy.API_RESPONSE, 'attributes.patronymic')
    @To(Strategy.API_REQUEST, 'patronymic')
    patronymic: string = '';

    get full_name(): string {
        const parts = [this.last_name, this.first_name, this.patronymic].filter(Boolean);
        return parts.join(' ');
    }

    get short_name(): string {
        if (!this.first_name) return this.last_name || '';
        const parts = [this.last_name, this.first_name[0] + '.'].filter(Boolean);
        return parts.join(' ');
    }

    get initials(): string {
        const first = this.first_name?.[0] || '';
        const last = this.last_name?.[0] || '';
        return `${last}${first}`.toUpperCase();
    }

    // Методы, добавленные декораторами
    validationErrors(): any[] {
        return [];
    }

    isValid(): boolean {
        return true;
    }

    validate(): boolean {
        return this.isValid();
    }

    // Методы трансформации, добавленные декоратором @Transformable
    from(strategy: any, data: any): this {
        return this;
    }

    to(strategy: any): any {
        return {};
    }

    // CRUD методы, добавленные декоратором @Model
    async store(): Promise<this> {
        return this;
    }

    async update(): Promise<this> {
        return this;
    }

    async destroy(): Promise<void> {
        // Реализация будет добавлена позже
    }
}