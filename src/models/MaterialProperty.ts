import {
    Model,
    Transformable,
    From,
    To,
    Validatable,
    type IModel,
    type ITransformable,
    type IValidatable,
    Resource,
    Field,
    Collectable,
} from "@/decorators";
import { ModelsTransformStrategies as Strategy } from "@/enums";
import type { ValidationError } from "@/decorators/validation";
import { useMaterialPropertyStore } from "@/stores/useMaterialPropertyStore";
import type MaterialPropertyCollection from "./collections/MaterialPropertyCollection";

export interface IMaterialProperty extends IModel<IMaterialProperty>, ITransformable<IMaterialProperty>, IValidatable {
    id?: number;
    label: string;
    name: string;
    description: string | null;
    weight_factor: number;
    update(): Promise<this>;
    destroy(): Promise<void>;
}
@Resource({
    path: 'https://erp.sk-gorod.com/api/v3/library/materials/material-properties',
    key: 'id',
    store: () => useMaterialPropertyStore()
})
@Model<any>()
@Collectable({})
@Transformable()
@Validatable()
class MaterialProperty {

    @From(Strategy.API_RESPONSE, 'id')
    @To(Strategy.API_REQUEST, 'id')
    id?: number;

    @From(Strategy.API_RESPONSE, 'name')
    @To(Strategy.API_REQUEST, 'name')
    @Field({
        label: 'Наименование',
        type: 'text',
        placeholder: 'Укажите наименование',
        required: true,
    })
    name: string = '';

    @From(Strategy.API_RESPONSE, 'weight_factor')
    @To(Strategy.API_REQUEST, 'weight_factor')
    @Field({
        label: 'Коэффициент веса',
        type: 'number',
        placeholder: 'Укажите коэффициент веса',
    })
    weight_factor: number = 1;

    @From(Strategy.API_RESPONSE, 'description')
    @To(Strategy.API_REQUEST, 'description')
    @Field({
        label: 'Описание',
        type: 'longtext',
        placeholder: 'Укажите описание',
    })
    description: string | null = null;
}

declare namespace MaterialProperty {
    function collect(items: IMaterialProperty[]): MaterialPropertyCollection;
    function createEmpty(): MaterialProperty;
    function clone(model: MaterialProperty): MaterialProperty;
    function from(strategy: string | symbol, data: any): MaterialProperty;
    function to(strategy: string | symbol): any;
    function fetchAll(): Promise<MaterialPropertyCollection>;
    function fetchOne(id: number | string): Promise<MaterialProperty>;
    function store(model: MaterialProperty): Promise<MaterialProperty>;
    function validationErrors(): ValidationError[];
    function isValid(): boolean;
    function validate(): boolean;
    const resourcePath: string;
    const resourceKey: string;
    const resourceStore: any;
    function buildPath(id?: string | number): string;
    function getFieldOption(fieldName: string, optionKey: string): any;
    function getFieldDisplayValue(fieldName: string, value: any): string;
}

declare interface MaterialProperty {
    to(strategy: string | symbol): any;
    from(strategy: string | symbol, data: any): this;
    refresh(other: Partial<MaterialProperty>): MaterialProperty;
    validationErrors(): ValidationError[];
    isValid(): boolean;
    validate(): boolean;
    isRequired(property: string): boolean;
    isUnsigned(property: string): boolean;
    getMin(property: string): number | undefined;
    getMax(property: string): number | undefined;
    getMinLength(property: string): number | undefined;
    getMaxLength(property: string): number | undefined;
    update(): Promise<MaterialProperty>;
    destroy(): Promise<void>;
    getResourcePath(): string;
    getResourceKey(): string;
    getFieldOption(fieldName: string, optionKey: string): any;
    getFieldDisplayValue(fieldName: string, value: any): string;
}

export default MaterialProperty;
