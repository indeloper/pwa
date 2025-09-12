import BaseResource from "./BaseResource";
import {
    Resource,
    Field,
    MapField,
} from "@/decorators";
import MaterialUnit from "./MaterialUnit";
import { useMaterialTypeStore } from "@/stores/useMaterialTypeStore";
import MaterialProperty from "./MaterialProperty";

export interface IMaterialType {
    id?: number;
    name: string;
    description: string | null;
    unit_id: number;
    accounting_by_main_value: boolean;
    material_property_ids: number[];
}
@Resource({
    path: 'https://erp.sk-gorod.com/api/v3/library/materials/material-types',
    key: 'id',
    store: () => useMaterialTypeStore()
})
export default class MaterialType extends BaseResource implements IMaterialType {

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
        label: 'Единица измерения',
        type: 'select',
        placeholder: 'Укажите единицу измерения',
        required: true, 
        options: () => MaterialUnit.resourceStore.units.toArray().map((unit: MaterialUnit) => ({
            label: `${unit.name} (${unit.label})`,
            value: unit.id,
        })),
        displayValue: (value: number) => MaterialUnit.resourceStore.units.findById(value)?.label || '',
    })
    unit_id: number = 0;

    @MapField()
    @Field({
        label: 'Учет по длине',
        type: 'boolean',
        description: 'Хренение группами по длине или в общей записи',
        displayValue: (value: boolean) => value ? 'Да' : 'Нет',
    })
    accounting_by_main_value: boolean = false;

    @MapField()
    @Field({
        label: 'Свойства материала',
        type: 'multiselect',
        placeholder: 'Укажите свойства материала',
        options: () => MaterialProperty.resourceStore.properties.toArray().map((property: MaterialProperty) => ({
            label: property.name,
            value: property.id,
        })),
        displayValue: (value: number[]) => value ? MaterialProperty.resourceStore.properties.whereIds(value)?.toArray().map((property: MaterialProperty) => property.name).join(', ') : '',
    })
    material_property_ids: number[] = [];


    @MapField()
    @Field({
        label: 'Описание',
        type: 'longtext',
        placeholder: 'Укажите описание',
    })
    description: string | null = null;

    @MapField()
    @Field({
        label: 'Инструкция',
        type: 'longtext',
        placeholder: 'Укажите инструкцию',
    })
    instruction: string | null = null;

    get material_properties(): MaterialProperty[] {
        return MaterialProperty.resourceStore.properties.whereIds(this.material_property_ids);
    }

    get unit(): MaterialUnit | null {
        return MaterialUnit.resourceStore.units.findById(this.unit_id);
    }
}