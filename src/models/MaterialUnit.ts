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
import MaterialUnitCollection from "./collections/MaterialUnitCollection";
import { ModelsTransformStrategies as Strategy } from "@/enums";
import type { ValidationError } from "@/decorators/validation";
import { useMaterialUnitStore } from "@/stores/useMaterialUnitStore";

export interface IMaterialUnit extends IModel<IMaterialUnit>, ITransformable<IMaterialUnit>, IValidatable {
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
    path: 'https://erp.sk-gorod.com/api/v3/library/materials/units',
    key: 'id',
    store: () => useMaterialUnitStore()
})
@Model<any>()
@Collectable({})
@Transformable()
@Validatable()
class MaterialUnit {

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
        description: 'Полное наименование',
    })
    name: string = '';

    @From(Strategy.API_RESPONSE, 'label')
    @To(Strategy.API_REQUEST, 'label')
    @Field({
        label: 'Короткое наименование',
        type: 'text',
        placeholder: 'Укажите короткое наименование',
        required: true,
        description: 'Короткое наименование',
    })
    label: string = '';

    @From(Strategy.API_RESPONSE, 'description')
    @To(Strategy.API_REQUEST, 'description')
    @Field({
        label: 'Описание',
        type: 'text',
        placeholder: 'Укажите описание',
        description: 'Описание',
    })
    description: string | null = null;

    @From(Strategy.API_RESPONSE, 'coefficient')
    @To(Strategy.API_REQUEST, 'coefficient')
    @Field({
        label: 'Коэффициент',
        type: 'number',
        placeholder: 'Укажите коэффициент',
        required: true,
        description: 'Делитель начального значения. В БД все хранится в "микро" - нужно указать делитель для отображения новой единицы измерения.',
    })
    coefficient: number = 1;

    get display_name(): string {
        return `${this.name} (${this.label})`;
    }
}

declare namespace MaterialUnit {
    function collect(items: IMaterialUnit[]): MaterialUnitCollection;
    function createEmpty(): MaterialUnit;
    function clone(model: MaterialUnit): MaterialUnit;
    function from(strategy: string | symbol, data: any): MaterialUnit;
    function to(strategy: string | symbol): any;
    function fetchAll(): Promise<MaterialUnitCollection>;
    function fetchOne(id: number | string): Promise<MaterialUnit>;
    function store(model: MaterialUnit): Promise<MaterialUnit>;
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

declare interface MaterialUnit {
    to(strategy: string | symbol): any;
    from(strategy: string | symbol, data: any): this;
    refresh(other: Partial<MaterialUnit>): MaterialUnit;
    validationErrors(): ValidationError[];
    isValid(): boolean;
    validate(): boolean;
    isRequired(property: string): boolean;
    isUnsigned(property: string): boolean;
    getMin(property: string): number | undefined;
    getMax(property: string): number | undefined;
    getMinLength(property: string): number | undefined;
    getMaxLength(property: string): number | undefined;
    update(): Promise<MaterialUnit>;
    destroy(): Promise<void>;
    getResourcePath(): string;
    getResourceKey(): string;
    getFieldOption(fieldName: string, optionKey: string): any;
    getFieldDisplayValue(fieldName: string, value: any): string;
}

export default MaterialUnit;
