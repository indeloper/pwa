import { Model, Transformable, From, To, Validatable, Validate, ValidationRules } from "@/decorators";
import { ModelsTransformStrategies as Strategy } from "@/enums";
import { useMaterialProperties } from "@/composables/useMaterialProperties";

export interface IMaterialProperty {
    id?: number;
    name: string;
    description: string | null;
    weight_factor: number;
}

const { updateProperty, storeProperty, deleteProperty, fetchProperties } = useMaterialProperties();

@Model()
@Transformable()
@Validatable()
export default class MaterialProperty implements IMaterialProperty {
    @From(Strategy.API_RESPONSE, 'id')
    @To(Strategy.API_REQUEST, 'id')
    id?: number;
    
    @From(Strategy.API_RESPONSE, 'attributes.name')
    @To(Strategy.API_REQUEST, 'name')
    @Validate([ValidationRules.required('Наименование обязательно')])
    name: string = '';
    
    @From(Strategy.API_RESPONSE, 'attributes.description')
    @To(Strategy.API_REQUEST, 'description')
    description: string | null = null;
    
    @From(Strategy.API_RESPONSE, 'attributes.weight_factor')
    @To(Strategy.API_REQUEST, 'weight_factor')
    weight_factor: number = 0;

    static get collection() {
        return MaterialPropertyCollection;
    }

    get displayName(): string {
        return this.name;
    }

    get weightFactorFormatted(): string {
        return this.weight_factor.toFixed(2);
    }

    static async fetch(id?: number): Promise<MaterialPropertyCollection> {
        return await fetchProperties();
    }

    async update(): Promise<this> {
        await updateProperty(this);
        return this;
    }

    async store(): Promise<this> {
        await storeProperty(this);
        return this;
    }

    async destroy(): Promise<void> {
        await deleteProperty(this);
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

    // UUID, добавленный декоратором @Mode

    // Методы трансформации, добавленные декоратором @Transformable
    from(strategy: any, data: any): this {
        return this;
    }

    to(strategy: any): any {
        return {};
    }
}

import MaterialPropertyCollection from "./collections/MaterialPropertyCollection";
