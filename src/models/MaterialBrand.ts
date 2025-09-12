import BaseResource from "./BaseResource";
import {
    Resource,
    Field,
    MapField,
} from "@/decorators";
import MaterialType from "./MaterialType";
import { useMaterialBrandStore } from "@/stores/useMaterialBrandStore";
import MaterialUnit from "./MaterialUnit";
import { toString } from "lodash";

export interface IMaterialBrand {
    id?: number;
    name: string;
    description: string | null;
    material_type_id: number;
    weight: number;
    price: number;
    nomenclature_number: string;
    alternate_brands: number[];
}
@Resource({
    path: 'https://erp.sk-gorod.com/api/v3/library/materials/material-brands',
    key: 'id',
    store: () => useMaterialBrandStore()
})
export default class MaterialBrand extends BaseResource implements IMaterialBrand {

    @MapField()
    id?: number;

    @MapField()
    @Field({
        label: 'Наименование',
        type: 'text',
        placeholder: 'Укажите наименование',
        required: true,
    })
    name: string = '';

    @MapField()
    @Field({
        label: 'Тип материала',
        type: 'select',
        placeholder: 'Укажите тип материала',
        required: true,
        options: function() {
            return MaterialType.resourceStore.types.toArray().map((materialType: MaterialType) => ({
                label: materialType.name,
                value: materialType.id,
            }));
        },
        displayValue: (value: number) => MaterialType.resourceStore.types.findById(value)?.name || '',
    })
    material_type_id: number = 0;

    @MapField()
    @Field({
        label: 'Вес',
        type: 'number',
        placeholder: 'Укажите вес',
        displayValue: (value: number, data: MaterialBrand) => toString(value ? value / (data.unit?.divider || 1) : null),
    })
    weight: number = 0;

    @MapField()
    @Field({
        label: 'Цена',
        type: 'number',
        placeholder: 'Укажите цену',
    })
    price: number = 0;

    @MapField()
    @Field({
        label: 'Номенклатура',
        type: 'text',
        placeholder: 'Укажите номенклатурный номер',
    })
    nomenclature_number: string = '';

    // Метод для получения опций альтернативных брендов с фильтрацией
    getAlternateBrandsOptions(): Array<{label: string, value: number}> {
        return MaterialBrand.resourceStore.brands
            .filter((brand: MaterialBrand) => brand.material_type_id === this.material_type_id)
            .filter((brand: MaterialBrand) => brand.id !== this.id)
            .toArray()
            .map((brand: MaterialBrand) => ({
                label: brand.name,
                value: brand.id!,
            }));
    }

    @MapField()
    @Field({
        label: 'Комбинация / Замена',
        type: 'multiselect',
        placeholder: 'Укажите альтернативные марки',
        description: 'Фильтрация по типу материала в работе',
        options: () => {return MaterialBrand.resourceStore.brands.toArray().map((brand: MaterialBrand) => ({
            label: brand.name,
            value: brand.id!,
        }))} ,
        displayValue: (value: number[]) => value && value.length > 0 ? MaterialBrand.resourceStore.brands.whereIds(value)?.toArray().map((brand: MaterialBrand) => brand.name).join(', ') : '',
        filterValue: (value: number[]) => value || [], // Для правильной фильтрации массивов
    })
    alternate_brands: number[] = [];


    @MapField()
    @Field({
        label: 'Описание',
        type: 'longtext',
        placeholder: 'Укажите описание',
    })
    description: string | null = null;


    get material_type(): MaterialType | null {
        return MaterialType.resourceStore.types.findById(this.material_type_id);
    }

    get unit(): MaterialUnit | null {
        return this.material_type?.unit || null;
    }


}