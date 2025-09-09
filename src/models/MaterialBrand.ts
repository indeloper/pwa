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
import type MaterialBrandCollection from "./collections/MaterialBrandCollection";
import MaterialType from "./MaterialType";
import { useMaterialBrandStore } from "@/stores/useMaterialBrandStore";

export interface IMaterialBrand extends IModel<IMaterialBrand>, ITransformable<IMaterialBrand>, IValidatable {
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
    path: 'https://erp.sk-gorod.com/api/v3/library/materials/material-brands',
    key: 'id',
    store: () => useMaterialBrandStore()
})
@Model<any>()
@Collectable({})
@Transformable()
@Validatable()
class MaterialBrand {

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

    @From(Strategy.API_RESPONSE, 'material_type_id')
    @To(Strategy.API_REQUEST, 'material_type_id')
    @Field({
        label: 'Тип материала',
        type: 'select',
        placeholder: 'Укажите тип материала',
        required: true,
        options: () => MaterialType.resourceStore.types.toArray().map((materialType: MaterialType) => ({
            label: materialType.name,
            value: materialType.id,
        })),
        displayValue: (value: number) => MaterialType.resourceStore.types.findById(value)?.name || '',
    })
    material_type_id: number = 0;

    @From(Strategy.API_RESPONSE, 'weight')
    @To(Strategy.API_REQUEST, 'weight')
    @Field({
        label: 'Вес',
        type: 'number',
        placeholder: 'Укажите вес',
    })
    weight: number = 0;

    @From(Strategy.API_RESPONSE, 'price')
    @To(Strategy.API_REQUEST, 'price')
    @Field({
        label: 'Цена',
        type: 'number',
        placeholder: 'Укажите цену',
    })
    price: number = 0;

    @From(Strategy.API_RESPONSE, 'nomenclature_number')
    @To(Strategy.API_REQUEST, 'nomenclature_number')
    @Field({
        label: 'Номенклатурный номер',
        type: 'text',
        placeholder: 'Укажите номенклатурный номер',
    })
    nomenclature_number: string = '';

    //TODO добавить фильтрацию по типу материала и исключение текущего материала

    alternate_brands_options = (model: MaterialBrand) => {

    }

    @From(Strategy.API_RESPONSE, 'alternate_brands')
    @To(Strategy.API_REQUEST, 'alternate_brands')
    @Field({
        label: 'Альтернативные марки',
        type: 'multiselect',
        placeholder: 'Укажите альтернативные марки',
        description: 'Фильтрация по типу материала в работе',
        options: (model: MaterialBrand) => {
            return MaterialBrand.resourceStore.brands
                .filter((brand: MaterialBrand) => brand.material_type_id === model.material_type_id)
                .filter((brand: MaterialBrand) => brand.id !== model.id)
                .toArray().map((brand: MaterialBrand) => ({
                    label: brand.name,
                    value: brand.id,
                }))
        },
        displayValue: (value: number) => value ? MaterialBrand.resourceStore.brands.whereIds(value)?.toArray().map((brand: MaterialBrand) => brand.name).join(', ') : '',
    })
    alternate_brands: number[] = [];


    @From(Strategy.API_RESPONSE, 'description')
    @To(Strategy.API_REQUEST, 'description')
    @Field({
        label: 'Описание',
        type: 'longtext',
        placeholder: 'Укажите описание',
    })
    description: string | null = null;


    get material_type(): MaterialType | null {
        return MaterialType.resourceStore.types.findById(this.material_type_id);
    }


}

declare namespace MaterialBrand {
    function collect(items: IMaterialBrand[]): MaterialBrandCollection;
    function createEmpty(): MaterialBrand;
    function clone(model: MaterialBrand): MaterialBrand;
    function from(strategy: string | symbol, data: any): MaterialBrand;
    function to(strategy: string | symbol): any;
    function fetchAll(): Promise<MaterialBrandCollection>;
    function fetchOne(id: number | string): Promise<MaterialBrand>;
    function store(model: MaterialBrand): Promise<MaterialBrand>;
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

declare interface MaterialBrand {
    to(strategy: string | symbol): any;
    from(strategy: string | symbol, data: any): this;
    refresh(other: Partial<MaterialBrand>): MaterialBrand;
    validationErrors(): ValidationError[];
    isValid(): boolean;
    validate(): boolean;
    isRequired(property: string): boolean;
    isUnsigned(property: string): boolean;
    getMin(property: string): number | undefined;
    getMax(property: string): number | undefined;
    getMinLength(property: string): number | undefined;
    getMaxLength(property: string): number | undefined;
    update(): Promise<MaterialBrand>;
    destroy(): Promise<void>;
    getResourcePath(): string;
    getResourceKey(): string;
    getFieldOption(fieldName: string, optionKey: string): any;
    getFieldDisplayValue(fieldName: string, value: any): string;
}

export default MaterialBrand;
