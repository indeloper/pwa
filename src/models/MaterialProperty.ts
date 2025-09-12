import {
    Resource,
    Field,
    MapField,
} from "@/decorators";
import { useMaterialPropertyStore } from "@/stores/useMaterialPropertyStore";
import BaseResource from "./BaseResource";

export interface IMaterialProperty {
    id?: number;
    name: string;
    description: string | null;
    weight_factor: number;
}
@Resource({
    path: 'https://erp.sk-gorod.com/api/v3/library/materials/material-properties',
    key: 'id',
    store: () => useMaterialPropertyStore()
})
export default class MaterialProperty extends BaseResource implements IMaterialProperty {

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
        label: 'Коэффициент веса',
        type: 'number',
        placeholder: 'Укажите коэффициент веса',
    })
    weight_factor: number = 1;

    @MapField()
    @Field({
        label: 'Описание',
        type: 'longtext',
        placeholder: 'Укажите описание',
    })
    description: string | null = null;
}