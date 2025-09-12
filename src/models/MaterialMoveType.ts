import BaseResource from "./BaseResource";
import {
    Resource,
    Field,
    MapField,
} from "@/decorators";
import { useMaterialMoveTypeStore } from "@/stores/useMaterialMoveTypeStore";

export interface IMaterialMoveType {
    id?: number;
    name: string;
    description: string | null;
    is_material_creating: boolean;
}
@Resource({
    path: 'https://erp.sk-gorod.com/api/v3/moving/materials/types',
    key: 'id',
    store: () => useMaterialMoveTypeStore()
})
export default class MaterialMoveType extends BaseResource implements IMaterialMoveType {

    @MapField()
    id?: number;

    @MapField()
    @Field({
        label: 'Наименование',
        type: 'text',
        placeholder: 'Укажите полное наименование',
        required: true,
        description: 'Полное наименование',
    })
    name: string = '';

    @MapField()
    @Field({
        label: 'Описание',
        type: 'text',
        placeholder: 'Укажите описание',
        description: 'Описание',
    })
    description: string | null = null;

    @MapField()
    @Field({
        label: 'Создание нового материала',
        type: 'checkbox',
        placeholder: 'Укажите является ли операция созданием нового материала',
    })
    is_material_creating: boolean = false;
}