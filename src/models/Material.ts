import BaseResource from "./BaseResource";
import {
    Resource,
    Field,
    TableColumn,
    MapField,
} from "@/decorators";
import MaterialType from "./MaterialType";
import MaterialBrand from "./MaterialBrand";
import MaterialProperty from "./MaterialProperty";
import Warehouse from "./Warehouse";
import WarehouseStorage from "./WarehouseStorage";
import { useMaterialStore } from "@/stores/useMaterialStore";
import MaterialService from "@/services/MaterialService";
import MaterialUnit from "./MaterialUnit";

export interface IMaterial {
    id?: number;
    material_type_id: number;
    material_brand_id: number;
    material_property_id: number | null;
    value: number;
    amount: number;
    comment: string;
    locked: boolean;
    lock_reason: string;
    warehouse_id: number;
    warehouse_storage_id: number;
}
@Resource({
    path: 'https://erp.sk-gorod.com/api/v3/accounting/materials/materials',
    key: 'id',
    store: () => useMaterialStore(),
    serviceClass: () => MaterialService,
})
export default class Material extends BaseResource implements IMaterial {

    @MapField()
    id?: number;

    @MapField()
    @Field({
        label: 'Тип',
        type: 'multiselect',
        placeholder: 'Укажите тип материала',
        options: () => MaterialType.resourceStore.types.toArray().map((type: MaterialType) => ({
            label: type.name,
            value: type.id,
        })),
        displayValue: (value: number[]) => value ? MaterialType.resourceStore.types.findById(value)?.name : '',
    })
    @TableColumn({
        header: 'Тип',
        display: (value: number) => MaterialType.resourceStore.types.findById(value)?.name || '',
    })
    material_type_id: number = 0;

    @MapField()
    @Field({
        label: 'Марка материала',
        type: 'select',
        placeholder: 'Укажите марку материала',
        options: () => MaterialBrand.resourceStore.brands.toArray().map((brand: MaterialBrand) => ({
            label: brand.name,
            value: brand.id,
        })),
        displayValue: (value: number[]) => value ? MaterialBrand.resourceStore.brands.findById(value)?.name : '',
    })
    @TableColumn({
        header: 'Марка',
        display: (value: number) => MaterialBrand.resourceStore.brands.findById(value)?.name || '',
    })
    material_brand_id: number = 0;

    @MapField()
    @Field({
        label: 'Свойство материала',
        type: 'select',
        placeholder: 'Укажите свойство материала',
        options: () => MaterialProperty.resourceStore.properties.toArray().map((property: MaterialProperty) => ({
            label: property.name,
            value: property.id,
        })),
        displayValue: (value: number[]) => value ? MaterialProperty.resourceStore.properties.findById(value)?.name : '',
    })
    @TableColumn({
        header: 'Свойство',
        display: (value: number) => MaterialProperty.resourceStore.properties.findById(value)?.name || '',
        editable: true,
        type: 'select',
        editOptions: () => MaterialProperty.resourceStore.properties.toArray().map((property: MaterialProperty) => ({
            label: property.name,
            value: property.id,
        })),
    })
    material_property_id: number | null = null;

    @MapField()
    @Field({
        label: 'Значение',
        type: 'number',
        placeholder: 'Укажите значение',
        editable: true,
        displayValue: (value: any, data: any) => `${value} ${data.unit?.label}`,
    })
    @TableColumn({
        header: 'Значение',
        editable: true,
        type: 'number',
        display: (value: number, data: Material) => `${value} ${data.unit?.label}`,
    })
    value: number = 0;

    @MapField()
    @Field({
        label: 'Количество',
        type: 'number',
        placeholder: 'Укажите количество',
        editable: true,
        displayValue: (value: any, data: any) => `${value} шт.`,
    })
    @TableColumn({
        header: 'Количество',
        editable: true,
        type: 'number',
        display: (value: number) => `${value} шт.`,
    })
    amount: number = 0;

    @MapField()
    @Field({
        label: 'Комментарий',
        type: 'text',
        placeholder: 'Укажите комментарий',
        editable: true,
    })
    @TableColumn({
        header: 'Комментарий',
        editable: true,
        type: 'longtext',
        class: 'italic text-gray-500'
    })
    comment: string = '';

    @MapField()
    @Field({
        label: 'Заблокирован',
        type: 'boolean',
    })
    locked: boolean = false;

    @MapField()
    @Field({
        label: 'Причина блокировки',
        type: 'text',
        placeholder: 'Укажите причину блокировки',
    })
    lock_reason: string = '';

    @MapField()
    @Field({
        label: 'Склад',
        type: 'select',
        placeholder: 'Укажите склад',
        options: () => Warehouse.resourceStore.warehouses.toArray().map((warehouse: Warehouse) => ({
            label: warehouse.name,
            value: warehouse.id,
        })),
        displayValue: (value: number[]) => value ? Warehouse.resourceStore.warehouses.findById(value)?.name : '',
    })
    warehouse_id: number = 0;

    @MapField()
    @Field({
        label: 'Ячейка',
        type: 'select',
        placeholder: 'Укажите ячейку',
        options: () => WarehouseStorage.resourceStore.warehouseStorages.toArray().map((warehouseStorage: WarehouseStorage) => ({
            label: warehouseStorage.name,
            value: warehouseStorage.id,
        })),
        displayValue: (value: number[]) => value ? WarehouseStorage.resourceStore.warehouseStorages.findById(value)?.name : '',
    })
    warehouse_storage_id: number = 0;

    get material_type(): MaterialType {
        return MaterialType.resourceStore.types.findById(this.material_type_id);
    }

    get unit(): MaterialUnit {
        return MaterialUnit.resourceStore.units.findById(this.material_type.unit_id);
    }

    get isEmptyValues(): boolean {
        return !this.value || !this.amount;
    }
}