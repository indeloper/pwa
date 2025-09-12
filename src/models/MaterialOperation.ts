import BaseResource from "./BaseResource";
import {
    Resource,
    Field,
    ValidationRules,
    MapField,
} from "@/decorators";
import { useMaterialOperationStore } from "@/stores/useMaterialOperationStore";
import Contractor from "./Contractor";
import type FileCollection from "./collections/FileCollection";

export interface IMaterialOperation {
    id?: number;
    contractor_id: number | null;
    operation_date: Date | null;
    document_number: string | null;
    comment: string | null;
    files: FileCollection | null;
}
@Resource({
    path: 'https://erp.sk-gorod.com/api/v3/accounting/materials/material-operations',
    key: 'id',
    store: () => useMaterialOperationStore()
})
export default class MaterialOperation extends BaseResource implements IMaterialOperation {

    @MapField()
    id?: number;

    @MapField()
    @Field({
        label: 'Контрагент',
        type: 'select',
        placeholder: 'Укажите контрагента',
        validationRules: [
            ValidationRules.required(),
        ],
        options: () => Contractor.resourceStore.contractors.toArray().map((contractor: Contractor) => ({
            label: contractor.short_name,
            value: contractor.id,
        })),
        displayValue: (value: number) => Contractor.resourceStore.contractors.findById(value)?.short_name || '',
    })
    contractor_id: number | null = null;

    @MapField()
    @Field({
        label: 'Дата операции',
        type: 'date',
        placeholder: 'Укажите дату операции',
        validationRules: [
            ValidationRules.required(),
        ],
    })
    operation_date: Date | null = null;

    @MapField()
    @Field({
        label: 'Номер документа',
        type: 'text',
        placeholder: 'Укажите номер документа',
        validationRules: [
            ValidationRules.required(),
        ],
    })
    document_number: string | null = null;

    @MapField()
    @Field({
        label: 'Комментарий',
        type: 'longtext',
        placeholder: 'Укажите комментарий',
    })
    comment: string | null = null;

    @Field({
        label: 'Файлы',
        type: 'file',
        placeholder: 'Укажите файлы',
        multiple: true,
        accept: 'image/*,.pdf',
        showPreview: true,
    })
    files: FileCollection | null = null;
}
