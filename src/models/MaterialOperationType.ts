import BaseResource from "./BaseResource";
import {
    Resource,
    Field,
    MapField,
} from "@/decorators";
import MaterialOperationReason from "./MaterialOperationReason";
import { useMaterialTypeStore } from "@/stores/useMaterialTypeStore";

export interface IMaterialOperationType {
    id?: number;
    name: string;
    description: string | null;
    material_operation_reasons_ids: number[];
}
@Resource({
    path: 'https://erp.sk-gorod.com/api/v3/accounting/materials/material-operation-types',
    key: 'id',
    store: () => useMaterialTypeStore()
})
export default class MaterialOperationType extends BaseResource implements IMaterialOperationType {

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
        label: 'Причины операции',
        type: 'multiselect',
        placeholder: 'Укажите причины операции',
        options: () => MaterialOperationReason.resourceStore.reasons.toArray().map((reason: MaterialOperationReason) => ({
            label: reason.name,
            value: reason.id,
        })),
        displayValue: (value: number[]) => value ? MaterialOperationReason.resourceStore.reasons.whereIds(value)?.toArray().map((reason: MaterialOperationReason) => reason.name).join(', ') : '',
    })
    material_operation_reasons_ids: number[] = [];


    @MapField()
    @Field({
        label: 'Описание',
        type: 'longtext',
        placeholder: 'Укажите описание',
    })
    description: string | null = null;

    get material_operation_reasons(): MaterialOperationReason[] {
        return MaterialOperationReason.resourceStore.reasons.whereIds(this.material_operation_reasons_ids);
    }
}