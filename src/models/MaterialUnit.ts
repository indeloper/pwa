import BaseResource from "./BaseResource";
import {
    Resource,
    Field,
    TableColumn,
    MapField,
} from "@/decorators";
import { useMaterialUnitStore } from "@/stores/useMaterialUnitStore";

export interface IMaterialUnit {
    id?: number;
    label: string;
    name: string;
    description: string | null;
    divider: number;
    display_name: string;
}

@Resource({
    path: 'https://erp.sk-gorod.com/api/v3/library/materials/units',
    key: 'id',
    store: () => useMaterialUnitStore()
})
export default class MaterialUnit extends BaseResource implements IMaterialUnit {

    @MapField()
    id?: number;

    @MapField()
    @Field({
        label: 'Наименование',
        type: 'text',
        placeholder: 'Укажите полное наименование',
        required: true,
    })
    @TableColumn({
        header: 'Наименование',
    })
    name: string = '';

    @MapField()
    @Field({
        label: 'Короткое наименование',
        type: 'text',
        placeholder: 'Укажите короткое наименование',
        required: true,
    })
    @TableColumn({
        header: 'Короткое наименование',
    })
    label: string = '';

    @MapField()
    @Field({
        label: 'Описание',
        type: 'text',
        placeholder: 'Укажите описание',
    })
    @TableColumn({
        header: 'Описание',
        type: 'longtext',
    })
    description: string | null = null;

    @MapField()
    @Field({
        label: 'Делитель начального значения',
        type: 'number',
        placeholder: 'Укажите делитель начального значения',
        required: true,
        description: 'Делитель начального значения. В БД все хранится в "микро" - нужно указать делитель для отображения новой единицы измерения.',
    })
    @TableColumn({
        header: 'Делитель начального значения',
        type: 'number',
        display: (value: number) => parseFloat(Number(value).toFixed(4)),
    })
    divider: number = 1;

    get display_name(): string {
        return `${this.name} (${this.label})`;
    }
}
