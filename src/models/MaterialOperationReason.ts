import BaseResource from "./BaseResource";
import {
    Resource,
    Field,
    MapField,
} from "@/decorators";
import { useMaterialOperationReasonStore } from "@/stores/useMaterialOperationReasonStore";
import MaterialOperationType from "./MaterialOperationType";

export interface IMaterialOperationReason {
    id?: number;
    name: string;
    description: string | null;
    material_operation_type_id: number;
}
@Resource({
    path: 'https://erp.sk-gorod.com/api/v3/accounting/materials/material-operation-reasons',
    key: 'id',
    store: () => useMaterialOperationReasonStore()
})
export default class MaterialOperationReason extends BaseResource implements IMaterialOperationReason {

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
        label: 'Тип операции',
        type: 'select',
        placeholder: 'Укажите тип операции',
        required: true, 
        options: () => MaterialOperationType.resourceStore.operation_types.toArray().map((operation_type: MaterialOperationType) => ({
            label: operation_type.name,
            value: operation_type.id,
        })),
        displayValue: (value: number) => MaterialOperationType.resourceStore.operation_types.findById(value)?.name || '',
    })
    material_operation_type_id: number = 0;    

    @MapField()
    @Field({
        label: 'Описание',
        type: 'longtext',
        placeholder: 'Укажите описание',
    })
    description: string | null = null;

    get material_operation_type(): MaterialOperationType | null {
        return MaterialOperationType.resourceStore.operation_types.findById(this.material_operation_type_id);
    }

    get is_supply(): boolean {
        return this.id === 1;
    }

}