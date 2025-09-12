import BaseResource from "./BaseResource";
import {
    Resource,
    Field,
    MapField,
} from "@/decorators";
import { useWarehouseStorageStore } from "@/stores/useWarehouseStorageStore";
import Warehouse from "./Warehouse";

export interface IWarehouseStorage {
    id?: number;
    name: string;
    description: string | null;
    warehouse_id: number;
}

@Resource({
    path: 'https://erp.sk-gorod.com/api/v3/accounting/materials/warehouse-storages',
    key: 'id',
    store: () => useWarehouseStorageStore()
})
export default class WarehouseStorage extends BaseResource implements IWarehouseStorage {

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
        label: 'Склад',
        type: 'select',
        placeholder: 'Укажите склад',
        required: true,
        options: () => Warehouse.resourceStore.warehouses.toArray().map((warehouse: Warehouse) => ({
            label: warehouse.name,
            value: warehouse.id,
        })),
        displayValue: (value: number) => Warehouse.resourceStore.warehouses.findById(value)?.name || '',
    })
    warehouse_id: number = 0;

    @MapField()
    @Field({
        label: 'Описание',
        type: 'longtext',
        placeholder: 'Укажите описание',
    })
    description: string | null = null;

    get warehouse(): Warehouse | null {
        return Warehouse.resourceStore.warehouses.findById(this.warehouse_id);
    }
}