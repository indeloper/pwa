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
import type MaterialTypeCollection from "./collections/MaterialTypeCollection";
import MaterialUnit from "./MaterialUnit";

export interface IMaterialType extends IModel<IMaterialType>, ITransformable<IMaterialType>, IValidatable {
    id?: number;
    label: string;
    name: string;
    description: string | null;
    coefficient: number;
    display_name: string;
    update(): Promise<this>;
    destroy(): Promise<void>;
}
@Resource({
    path: 'https://erp.sk-gorod.com/api/v3/library/materials/material-types',
    key: 'id',
})
@Model<any>()
@Collectable({})
@Transformable()
@Validatable()
class MaterialType {

    @From(Strategy.API_RESPONSE, 'id')
    @To(Strategy.API_REQUEST, 'id')
    id?: number;

    @From(Strategy.API_RESPONSE, 'name')
    @To(Strategy.API_REQUEST, 'name')
    @Field({
        label: 'Наименование',
        type: 'text',
        placeholder: 'Укажите полное наименование',
        required: true,
    })
    name: string = '';

    @From(Strategy.API_RESPONSE, 'unit_id')
    @To(Strategy.API_REQUEST, 'unit_id')
    @Field({
        label: 'Единица измерения',
        type: 'select',
        placeholder: 'Укажите единицу измерения',
        required: true, 
        options: () => MaterialUnit.resourceStore.units.toArray().map((unit: MaterialUnit) => ({
            label: unit.label,
            value: unit.id,
        })),
        displayValue: (value: number) => MaterialUnit.resourceStore.units.findById(value)?.label || '',
    })
    unit_id: number = 0;

    @From(Strategy.API_RESPONSE, 'accounting_by_main_value')
    @To(Strategy.API_REQUEST, 'accounting_by_main_value')
    @Field({
        label: 'Учет по длине',
        type: 'boolean',
        description: 'Хренение группами по длине или в общей записи',
        displayValue: (value: boolean) => value ? 'Да' : 'Нет',
    })
    accounting_by_main_value: boolean = false;


    @From(Strategy.API_RESPONSE, 'description')
    @To(Strategy.API_REQUEST, 'description')
    @Field({
        label: 'Описание',
        type: 'longtext',
        placeholder: 'Укажите описание',
    })
    description: string | null = null;

    @From(Strategy.API_RESPONSE, 'instruction')
    @To(Strategy.API_REQUEST, 'instruction')
    @Field({
        label: 'Инструкция',
        type: 'longtext',
        placeholder: 'Укажите инструкцию',
    })
    instruction: string | null = null;

    get unit(): MaterialUnit | null {
        return MaterialUnit.resourceStore.units.findById(this.unit_id);
    }

    get unitData(): MaterialUnit | null {
        return MaterialUnit.resourceStore.units.toArray().map((unit: MaterialUnit) => ({
            label: unit.label,
            value: unit.id,
        }));
    }
}

declare namespace MaterialType {
    function collect(items: IMaterialType[]): MaterialTypeCollection;
    function createEmpty(): MaterialType;
    function clone(model: MaterialType): MaterialType;
    function from(strategy: string | symbol, data: any): MaterialType;
    function to(strategy: string | symbol): any;
    function fetchAll(): Promise<MaterialTypeCollection>;
    function fetchOne(id: number | string): Promise<MaterialType>;
    function store(model: MaterialType): Promise<MaterialType>;
    function validationErrors(): ValidationError[];
    function isValid(): boolean;
    function validate(): boolean;
    const resourcePath: string;
    const resourceKey: string;
    function buildPath(id?: string | number): string;
    function getFieldOption(fieldName: string, optionKey: string): any;
    function getFieldDisplayValue(fieldName: string, value: any): string;
}

declare interface MaterialType {
    to(strategy: string | symbol): any;
    from(strategy: string | symbol, data: any): this;
    refresh(other: Partial<MaterialType>): MaterialType;
    validationErrors(): ValidationError[];
    isValid(): boolean;
    validate(): boolean;
    isRequired(property: string): boolean;
    isUnsigned(property: string): boolean;
    getMin(property: string): number | undefined;
    getMax(property: string): number | undefined;
    getMinLength(property: string): number | undefined;
    getMaxLength(property: string): number | undefined;
    update(): Promise<MaterialType>;
    destroy(): Promise<void>;
    getResourcePath(): string;
    getResourceKey(): string;
    getFieldOption(fieldName: string, optionKey: string): any;
    getFieldDisplayValue(fieldName: string, value: any): string;
}

export default MaterialType;
