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
import MaterialUnit from "./MaterialUnit";
import MaterialProperty from "./MaterialProperty";
import type BaseResourceCollection from "./BaseResourceCollection";
import { useWarehouseStore } from "@/stores/useWarehouseStore";

export interface IWarehouse extends IModel<IWarehouse>, ITransformable<IWarehouse>, IValidatable {
    id?: number;
    label: string;
    name: string;
    description: string | null;
    coefficient: number;
    display_name: string;
    material_property_ids: number[];
    update(): Promise<this>;
    destroy(): Promise<void>;
}
@Resource({
    path: 'https://erp.sk-gorod.com/api/v3/accounting/materials/warehouses',
    key: 'id',
    store: () => useWarehouseStore()
})
@Model<any>()
@Collectable({})
@Transformable()
@Validatable()
class Warehouse {

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

    @From(Strategy.API_RESPONSE, 'address')
    @To(Strategy.API_REQUEST, 'address')
    @Field({
        label: 'Адрес',
        type: 'text',
        placeholder: 'Укажите адрес',
    })
    address: string | null = null;

    @From(Strategy.API_RESPONSE, 'has_storage_system')
    @To(Strategy.API_REQUEST, 'has_storage_system')
    @Field({
        label: 'Ячеечная система хранения',
        type: 'boolean',
        displayValue: (value: boolean) => value ? 'Да' : 'Нет',
    })
    has_storage_system: boolean = false;


    @From(Strategy.API_RESPONSE, 'description')
    @To(Strategy.API_REQUEST, 'description')
    @Field({
        label: 'Описание',
        type: 'longtext',
        placeholder: 'Укажите описание',
    })
    description: string | null = null;  
}

declare namespace Warehouse {
    function collect(items: IWarehouse[]): BaseResourceCollection<Warehouse>;
    function createEmpty(): Warehouse;
    function clone(model: Warehouse): Warehouse;
    function from(strategy: string | symbol, data: any): Warehouse;
    function to(strategy: string | symbol): any;
    function fetchAll(): Promise<BaseResourceCollection<Warehouse>>;
    function fetchOne(id: number | string): Promise<Warehouse>;
    function store(model: Warehouse): Promise<Warehouse>;
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

declare interface Warehouse {
    to(strategy: string | symbol): any;
    from(strategy: string | symbol, data: any): this;
    refresh(other: Partial<Warehouse>): Warehouse;
    validationErrors(): ValidationError[];
    isValid(): boolean;
    validate(): boolean;
    isRequired(property: string): boolean;
    isUnsigned(property: string): boolean;
    getMin(property: string): number | undefined;
    getMax(property: string): number | undefined;
    getMinLength(property: string): number | undefined;
    getMaxLength(property: string): number | undefined;
    update(): Promise<Warehouse>;
    destroy(): Promise<void>;
    getResourcePath(): string;
    getResourceKey(): string;
    getFieldOption(fieldName: string, optionKey: string): any;
    getFieldDisplayValue(fieldName: string, value: any): string;
}

export default Warehouse;
