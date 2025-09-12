export interface TableColumnOptions {
    header: string;
    type?: 'string' | 'number' | 'integer' | 'date' | 'boolean' | 'longtext' | 'select';
    editable?: boolean;
    sortable?: boolean;
    display?: (value: any, data?: any) => string | null | undefined | number;
    editOptions?: { label: string; value: any }[] | ((context?: any) => { label: string; value: any }[]);
    columnClass?: string;
    class?: string;
}

export function TableColumn(options: TableColumnOptions) {
    return function (target: any, propertyKey: string) {
        if (!target.constructor.tableColumns) {
            target.constructor.tableColumns = new Map();
        }

        const display = options.display ?? ((value: any, data?: any) => value);

        target.constructor.tableColumns.set(propertyKey, { ...options, display });
    }
}