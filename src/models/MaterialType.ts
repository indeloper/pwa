import { Model, Transformable, From, To, FromRelationship, FromRelationshipCollection, Validatable, Validate, ValidationRules } from "@/decorators";
import MaterialTypeCollection from "./collections/MaterialTypeCollection";
import { ModelsTransformStrategies as Strategy } from "@/enums";
import { useMaterialTypes } from "@/composables/useMaterialTypes";
import MaterialUnit from "./MaterialUnit";
import MaterialProperty from "./MaterialProperty";
import type MaterialPropertyCollection from "./collections/MaterialPropertyCollection";

export interface IMaterialType {
    id?: number;
    name: string;
    unit_id: number;
    fixed_quantity: boolean;
    description: string | null;
    instruction: string | null;
    material_unit?: MaterialUnit;
    properties?: MaterialPropertyCollection;
}

const { updateType, storeType, deleteType, fetchTypes } = useMaterialTypes();

@Model()
@Transformable()
@Validatable()
export default class MaterialType implements IMaterialType {
    @From(Strategy.API_RESPONSE, 'id')
    @To(Strategy.API_REQUEST, 'id')
    id?: number;
    
    @From(Strategy.API_RESPONSE, 'attributes.name')
    @To(Strategy.API_REQUEST, 'name')
    @Validate([ValidationRules.required('Наименование обязательно')])
    name: string = '';
    
    @From(Strategy.API_RESPONSE, 'attributes.unit_id')
    @To(Strategy.API_REQUEST, 'unit_id')
    unit_id: number = 0;
    
    @From(Strategy.API_RESPONSE, 'attributes.fixed_quantity')
    @To(Strategy.API_REQUEST, 'fixed_quantity')
    fixed_quantity: boolean = false;
    
    @From(Strategy.API_RESPONSE, 'attributes.description')
    @To(Strategy.API_REQUEST, 'description')
    description: string | null = null;
    
    @From(Strategy.API_RESPONSE, 'attributes.instruction')
    @To(Strategy.API_REQUEST, 'instruction')
    instruction: string | null = null;
    
    @FromRelationship(Strategy.API_RESPONSE, 'relationships.material_unit', MaterialUnit)
    @To(Strategy.API_REQUEST, 'material_unit')
    material_unit?: MaterialUnit;
    
    @FromRelationshipCollection(Strategy.API_RESPONSE, 'relationships.properties', MaterialProperty)
    @To(Strategy.API_REQUEST, 'properties')
    properties?: MaterialPropertyCollection;

    static collection = MaterialTypeCollection;

    get displayName(): string {
        return this.name;
    }

    get unitName(): string {
        return this.material_unit?.label || '';
    }

    get propertiesCount(): number {
        return this.properties?.count() || 0;
    }

    get hasProperties(): boolean {
        return this.propertiesCount > 0;
    }

    get isFixedQuantity(): string {
        return this.fixed_quantity ? 'Да' : 'Нет';
    }

    static async fetch(id?: number): Promise<MaterialTypeCollection> {
        return await fetchTypes();
    }

    async update(): Promise<this> {
        await updateType(this);
        return this;
    }

    async store(): Promise<this> {
        await storeType(this);
        return this;
    }

    async destroy(): Promise<void> {
        await deleteType(this);
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

    // UUID, добавленный декоратором @Model


    // Методы трансформации, добавленные декоратором @Transformable
    from(strategy: any, data: any): this {
        return this;
    }

    to(strategy: any): any {
        return {};
    }
}
