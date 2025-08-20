import { Model, Transformable, From, To, FromRelationship, FromRelationshipCollection, Validatable, Validate, ValidationRules } from "@/decorators";
import { ModelsTransformStrategies as Strategy } from "@/enums";
import { useMaterialStandards } from "@/composables/useMaterialStandards";
import MaterialType from "./MaterialType";
import MaterialBrand from "./MaterialBrand";
import MaterialProperty from "./MaterialProperty";
import MaterialPropertyCollection from "./collections/MaterialPropertyCollection";
import MaterialBrandCollection from "./collections/MaterialBrandCollection";

export interface IMaterialStandard {
    id?: number;
    name: string;
    description: string | null;
    old_standard_id: number | null;
    material_type?: MaterialType;
    material_brand?: MaterialBrand;
    material_brands?: MaterialBrandCollection;
    properties?: MaterialPropertyCollection;
    alternative_standards?: MaterialStandard[];
}

const { updateStandard, storeStandard, deleteStandard, fetchStandards } = useMaterialStandards();

@Model()
@Transformable()
@Validatable()
export default class MaterialStandard implements IMaterialStandard {
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
    
    @From(Strategy.API_RESPONSE, 'attributes.old_standard_id')
    @To(Strategy.API_REQUEST, 'old_standard_id')
    old_standard_id: number | null = null;
    
    @FromRelationship(Strategy.API_RESPONSE, 'relationships.material_type', MaterialType)
    @To(Strategy.API_REQUEST, 'material_type')
    declare material_type?: MaterialType;
    
    @FromRelationship(Strategy.API_RESPONSE, 'relationships.material_brand', MaterialBrand)
    @To(Strategy.API_REQUEST, 'material_brand')
    declare material_brand?: MaterialBrand;
    
    @FromRelationshipCollection(Strategy.API_RESPONSE, 'relationships.material_brands', MaterialBrand)
    @To(Strategy.API_REQUEST, 'material_brands')
    declare material_brands?: MaterialBrandCollection;
    
    @FromRelationshipCollection(Strategy.API_RESPONSE, 'relationships.properties', MaterialProperty)
    @To(Strategy.API_REQUEST, 'properties')
    declare properties?: MaterialPropertyCollection;
    
    @FromRelationshipCollection(Strategy.API_RESPONSE, 'relationships.alternative_standards', MaterialStandard)
    @To(Strategy.API_REQUEST, 'alternative_standards')
    declare alternative_standards?: MaterialStandard[];

    static get collection() {
        return MaterialStandardCollection;
    }

    get displayName(): string {
        return this.name;
    }

    get typeName(): string {
        return this.material_type?.name || '';
    }

    get brandName(): string {
        return this.material_brand?.name || '';
    }

    get hasDescription(): boolean {
        return !!this.description;
    }

    get hasType(): boolean {
        return !!this.material_type;
    }

    get hasBrand(): boolean {
        return !!this.material_brand;
    }

    get hasProperties(): boolean {
        return this.propertiesCount > 0;
    }

    get propertiesCount(): number {
        return this.properties?.count() || 0;
    }

    get brandsCount(): number {
        return this.material_brands?.count() || 0;
    }

    get alternativesCount(): number {
        return this.alternative_standards?.length || 0;
    }

    get isOldStandard(): boolean {
        return !!this.old_standard_id;
    }

    get hasAlternatives(): boolean {
        return this.alternativesCount > 0;
    }

    static async fetch(id?: number): Promise<MaterialStandardCollection> {
        return await fetchStandards();
    }

    async update(): Promise<this> {
        await updateStandard(this);
        return this;
    }

    async store(): Promise<this> {
        await storeStandard(this);
        return this;
    }

    async destroy(): Promise<void> {
        await deleteStandard(this);
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

import MaterialStandardCollection from "./collections/MaterialStandardCollection";