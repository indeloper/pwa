import type { IModel } from '@/decorators';
import type BaseCollection from '@/models/BaseCollection';

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
    showOnMobileSummary?: boolean;
    mobileTemplate?: (data: any) => string;
    mainTemplate?: (data: any) => string;
    frozen?: boolean;
}

export interface BaseModelCrudTableConfig<T extends IModel<T>> {
    title: string;
    selectable?: 'multiple' | 'single';
    massDelete?: boolean;
    startAdd?: () => void;
    startEdit?: (model: T) => void;
    startDelete?: (model: T) => void;
    startMassDelete?: (models: T[]) => void;
    selectionActions?: BaseModelCrudTableSelectionAction[];
    columns: BaseModelCrudTableColumn[];
}

export interface BaseModelCrudTableSelectionAction {
    label: string;
    action: (collection: T[]) => void;
    icon?: string;
}
