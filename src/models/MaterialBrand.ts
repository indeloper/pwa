import { Model, Transformable, From, To, FromRelationship, Validatable, Validate, ValidationRules } from "@/decorators";
import { ModelsTransformStrategies as Strategy } from "@/enums";
import { useMaterialBrands } from "@/composables/useMaterialBrands";
import MaterialType from "./MaterialType";

export interface IMaterialBrand {
    id?: number;
    name: string;
    description: string | null;
    weight: string;
    material_type: MaterialType;
}

const { updateBrand, storeBrand, deleteBrand, fetchBrands } = useMaterialBrands();

@Model()
@Transformable()
@Validatable()
export default class MaterialBrand implements IMaterialBrand {
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
    
    @From(Strategy.API_RESPONSE, 'attributes.weight')
    @To(Strategy.API_REQUEST, 'weight')
    weight: string = '';
    
    @FromRelationship(Strategy.API_RESPONSE, 'relationships.material_type', MaterialType)
    @To(Strategy.API_REQUEST, 'material_type')
    material_type?: MaterialType;

    static get collection() {
        return MaterialBrandCollection;
    }

    get displayName(): string {
        return this.name;
    }

    get weightFormatted(): string {
        return this.weight ? `${this.weight} кг/м²` : '';
    }

    get typeName(): string {
        return this.material_type?.name || '';
    }

    get hasDescription(): boolean {
        return !!this.description;
    }

    get hasType(): boolean {
        return !!this.material_type;
    }

    static async fetch(id?: number): Promise<MaterialBrandCollection> {
        return await fetchBrands();
    }

    async update(): Promise<this> {
        await updateBrand(this);
        return this;
    }

    async store(): Promise<this> {
        await storeBrand(this);
        return this;
    }

    async destroy(): Promise<void> {
        await deleteBrand(this);
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
}

import MaterialBrandCollection from "./collections/MaterialBrandCollection";
