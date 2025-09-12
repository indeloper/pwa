import BaseResource from "./BaseResource";
import {
    Resource,
    Field,
    MapField,
} from "@/decorators";
import type { ValidationError } from "@/decorators/validation";
import { useWarehouseStore } from "@/stores/useWarehouseStore";

export interface IWarehouse {
    id?: number;
    name: string;
    description: string | null;
    has_storage_system: boolean;
}
@Resource({
    path: 'https://erp.sk-gorod.com/api/v3/accounting/materials/warehouses',
    key: 'id',
    store: () => useWarehouseStore()
})
export default class Warehouse extends BaseResource implements IWarehouse {

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
        label: 'Адрес',
        type: 'text',
        placeholder: 'Укажите адрес',
    })
    address: string | null = null;

    @MapField()
    @Field({
        label: 'Ячеечная система хранения',
        type: 'boolean',
        displayValue: (value: boolean) => value ? 'Да' : 'Нет',
    })
    has_storage_system: boolean = false;


    @MapField()
    @Field({
        label: 'Описание',
        type: 'longtext',
        placeholder: 'Укажите описание',
    })
    description: string | null = null;  
}