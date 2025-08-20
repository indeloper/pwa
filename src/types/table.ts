import type { IModel } from '@/decorators';

export interface FilterSettings {
    value: any;
    matchMode: any;
}

export interface BaseModelCrudTableColumn {
    field: string;
    header: string;
    class: string;
    sortable?: boolean;
    type?: 'string' | 'number' | 'date' | 'boolean';
    filter?: boolean;
}

export interface BaseModelCrudTableConfig<T extends IModel> {
    title: string;
    startAdd?: () => void;
    startEdit?: (model: T) => void;
    startDelete?: (model: T) => void;
    columns: BaseModelCrudTableColumn[];
}
