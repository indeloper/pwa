<script setup lang="ts" generic="T extends Record<string, any>">
import { onBeforeMount, ref, computed, watch } from 'vue';
import type { FilterSettings } from '@/types/table';
import { Plus } from '@vicons/fa'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import MultiSelect from 'primevue/multiselect';
import { FilterMatchMode, FilterService } from '@primevue/core/api';
import InputNumber from 'primevue/inputnumber';
import ProgressSpinner from 'primevue/progressspinner';
import Menu from 'primevue/menu';
import Dialog from 'primevue/dialog';
import { isMobile } from '@/helpers';
import { usePrimeVue } from 'primevue/config';
import { onMounted } from 'vue';
const primeVue = usePrimeVue();

const props = defineProps<{
    models: T[];
    modelsLoading?: boolean;
    loading?: boolean;
    title?: string;
    selectable?: boolean;
    disableFiltering?: boolean;
    disableSorting?: boolean;
    dataKey?: string;
    columns?: Array<{
        field: string;
        header?: string;
        class?: string;
        sortable?: boolean;
        frozen?: boolean;
        filter?: boolean;
        type?: string;
        showOnMobileSummary?: boolean;
    }>;
    showMassDelete?: boolean;
    startMassDelete?: (models: T[]) => void;
    startAdd?: () => void;
    startEdit?: (model: T) => void;
    startDelete?: (model: T) => void;
}>();

const isLoading = computed(() => props.modelsLoading ?? props.loading ?? false);

const firstModel = computed(() => props.models?.[0] as any | undefined);

// Функция для получения options для select фильтров
const getFilterOptions = (fieldName: string) => {
    const model = firstModel.value;
    if (!model) return [];
    return model.getFieldOption(fieldName, 'options') || [];
};

const dataKeyResolved = computed(() => {
    if (props.dataKey) return props.dataKey;
    const model = firstModel.value;
    if (!model) return 'uuid';
    return 'uuid' in model ? 'uuid' : ('id' in model ? 'id' : 'uuid');
});

const resolvedColumns = computed(() => {
    // If columns are provided, use them
    if (props.columns && props.columns.length > 0) {
        // normalize sort/filter defaults with disable props
        return props.columns.map((col) => ({
            sortable: props.disableSorting ? false : (col.sortable ?? true),
            filter: props.disableFiltering ? false : (col.filter ?? true),
            frozen: col.frozen ?? false,
            type: col.type ?? 'text',
            ...col,
        }));
    }
    const model = firstModel.value;
    if (!model) return [] as any[];
    const fields: Record<string, any> | undefined = (model as any).fields;
    const keys = fields ? Object.keys(fields) : Object.keys(model).filter((k) => {
        const v = (model as any)[k];
        return typeof v !== 'function' && k !== 'uuid';
    });
    return keys.map((key) => {
        const meta = fields?.[key];
        const val = (model as any)[key];
        const type = meta?.type ?? (typeof val === 'number' ? 'number' : 'text');
        return {
            field: key,
            header: meta?.label ?? key,
            type,
            filter: !props.disableFiltering && (type === 'text' || type === 'number' || type === 'boolean' || type === 'select' || type === 'multiselect' || type === 'longtext'),
            sortable: !props.disableSorting,
            frozen: false,
            showOnMobileSummary: false,
        };
    });
});

const filters = ref<Record<string, FilterSettings>>({});
const selectedModels = ref<T[]>([]);
const selectedModel = ref<T | null>(null);

const menu = ref<any | null>(null);

// Модальное окно для longtext
const longtextDialogVisible = ref(false);
const longtextDialogContent = ref('');
const longtextDialogTitle = ref('');
const menuItems = ref([
    {
        label: 'Редактировать',
        icon: 'pi pi-pencil',
        command: () => handleStartEdit(selectedModel.value),
    },
    {
        label: 'Удалить',
        icon: 'pi pi-trash',
        command: () => handleStartDelete(selectedModel.value),
    },
]);

const handleStartAdd = () => {
    props.startAdd?.();
}

const handleStartEdit = (model: T | null) => {
    if (!model) return;
    props.startEdit?.(model);
}

const handleStartDelete = (model: T | null) => {
    if (!model) return;
    props.startDelete?.(model);
}

const handleMassDelete = () => {
    props.startMassDelete?.(selectedModels.value as unknown as T[]);
}

const showLongtextDialog = (title: string, content: string) => {
    longtextDialogTitle.value = title;
    longtextDialogContent.value = content;
    longtextDialogVisible.value = true;
}

const hideLongtextDialog = () => {
    longtextDialogVisible.value = false;
}

// Кастомная функция фильтрации для полей
const customFilterFunction = (value: any, filter: any, fieldName: string) => {
    console.log('customFilterFunction', value, filter, fieldName);

    if (!filter || filter === null || filter === undefined || (Array.isArray(filter) && filter.length === 0)) return true;

    // Получаем первое значение из моделей для доступа к методам
    const model = firstModel.value;
    if (!model) return true;

    try {
        // Используем filterValue для получения массива ID
        const filterValue = model.getFieldFilterValue(fieldName, value);

        if (Array.isArray(filterValue) && Array.isArray(filter)) {
            // Проверка пересечения массивов
            return filterValue.some((val: any) => filter.includes(val));
        }

        if (Array.isArray(filterValue)) {
            return filterValue.includes(filter);
        }

        return filterValue === filter;
    } catch (e) {
        return false;
    }
};

const initFilters = () => {
    const cols = resolvedColumns.value;

    filters.value = cols
        .filter((column: any) => column.filter)
        .reduce((acc: Record<string, FilterSettings>, column: any) => {
            let matchMode = FilterMatchMode.STARTS_WITH;

            if (column.type === 'multiselect') {
                // используем кастомный фильтр, который зарегистрировали через FilterService
                matchMode = 'filterByArrayEquals' as any;
            } else if (column.type === 'number' || column.type === 'boolean' || column.type === 'select') {
                matchMode = FilterMatchMode.EQUALS;
            } else if (column.type === 'longtext') {
                matchMode = FilterMatchMode.CONTAINS;
            }

            acc[column.field] = {
                operator: 'and',
                constraints: [
                    {
                        value: null,
                        matchMode,
                    },
                ],
            } as unknown as FilterSettings;

            return acc;
        }, {} as Record<string, FilterSettings>);
};


const customArrayFilter = (value: any, filter: any) => {
    console.log('customArrayFilter', value, filter);
    return true;
}

onBeforeMount(() => {

    initFilters();
})

onMounted(() => {
    FilterService.register('filterByArrayEquals', (arr: any[], value: any) => {
    console.log('filterByArrayEquals', arr, value);

    if (!value || value.length === 0) return true;
    if (!Array.isArray(arr)) return false;

    // проверка пересечения массивов
    return arr.some(item => value.includes(item));
});
})



watch(resolvedColumns, () => {
    initFilters();
}, { immediate: true });

</script>

<template>
    <div v-if="isLoading" class="flex justify-center items-center h-full">
        <div class="flex flex-col items-center gap-2">
            <ProgressSpinner />
            <span>Загрузка...</span>
        </div>
    </div>
    <DataTable v-else v-model:filters="filters" :show-headers="!isMobile()" v-model:selection="selectedModels"
        :selection-mode="(props.selectable ? 'multiple' : undefined)" filterDisplay="row" :value="models" row-hover
        scrollable size="small" :dataKey="dataKeyResolved" scrollHeight="flex"
        :virtualScrollerOptions="{ itemSize: 46 }" removable-sort responsive>
        <template #header>
            <div class="flex justify-between items-center">
                <h1 class="text-2xl font-bold">{{ title ?? 'Список' }}</h1>
                <div class="flex gap-2">
                    <template v-if="showMassDelete && selectedModels.length > 0">
                        <Button icon="pi pi-trash" label="Удалить выбранные" @click="handleMassDelete" />
                    </template>
                    <template v-if="startAdd">
                        <Button @click="handleStartAdd" size="small">
                            <Plus class="w-4 h-4" />
                            <p class="hidden md:block">Добавить</p>
                        </Button>
                    </template>
                </div>
            </div>
        </template>

        <Column v-if="selectable" selectionMode="multiple" class="!w-[3%]"></Column>

        <template v-if="!isMobile()">
            <Column v-for="column in resolvedColumns" :key="column.field" :field="column.field" :header="column.header"
                :class="column.class" :sortable="column.sortable ?? true" :frozen="column.frozen ?? false"
                :filterFunction="(value: any, filter: any) => customFilterFunction(value, filter, column.field)">
                <template #body="{ data }">
                    <template v-if="column.type === 'longtext' && data[column.field]">
                        <Button size="small" text @click="showLongtextDialog(column.header, data[column.field])"
                            icon="pi pi-eye" />
                    </template>
                    <template v-else>
                        {{ data.getFieldDisplayValue(column.field, data[column.field]) }}
                    </template>
                </template>
                <template v-if="column.filter" #filter="slotProps">
                    <InputNumber v-if="column.type === 'number' && slotProps.filterModel"
                        v-model="slotProps.filterModel.value" size="small" fluid type="number"
                        @input="slotProps.filterCallback && slotProps.filterCallback()" placeholder="Поиск" />
                    <InputText
                        v-else-if="(column.type === 'text' || column.type === 'longtext') && slotProps.filterModel"
                        v-model="slotProps.filterModel.value" size="small" fluid type="text"
                        @input="slotProps.filterCallback && slotProps.filterCallback()" placeholder="Поиск" />
                    <Select v-else-if="column.type === 'boolean' && slotProps.filterModel"
                        v-model="slotProps.filterModel.value" size="small" fluid
                        @change="slotProps.filterCallback && slotProps.filterCallback()" placeholder="Все" :options="[
                            { label: 'Все', value: null },
                            { label: 'Да', value: true },
                            { label: 'Нет', value: false }
                        ]" option-label="label" option-value="value" />
                    <Select v-else-if="column.type === 'select' && slotProps.filterModel"
                        v-model="slotProps.filterModel.value" size="small" fluid
                        @change="slotProps.filterCallback && slotProps.filterCallback()" placeholder="Все" :options="[
                            { label: 'Все', value: null },
                            ...getFilterOptions(column.field)
                        ]" option-label="label" option-value="value" />
                    <MultiSelect v-else-if="column.type === 'multiselect' && slotProps.filterModel"
                        v-model="slotProps.filterModel.value" size="small" fluid
                        @change="slotProps.filterCallback && slotProps.filterCallback()" placeholder="Все"
                        :options="getFilterOptions(column.field)" option-label="label" option-value="value" />
                </template>
            </Column>
            <Column class="w-[10%]">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button v-if="startEdit" size="small" text @click="handleStartEdit(data)" icon="pi pi-pencil" />
                        <Button v-if="startDelete" severity="danger" size="small" text @click="handleStartDelete(data)"
                            icon="pi pi-trash" />
                    </div>
                </template>
            </Column>
        </template>
        <template v-else>
            <Column>
                <template #body="{ data }">
                    <div class="flex flex-col gap-2">
                        <div v-for="column in resolvedColumns" :key="column.field">
                            <template v-if="column.showOnMobileSummary">
                                <div class="flex justify-between items-center bg-gray-100 p-2 rounded-md">
                                    <p class="font-bold text-lg">{{ data.getFieldDisplayValue(column.field,
                                        data[column.field]) }}</p>
                                    <div class="flex gap-2">
                                        <Button v-if="startEdit" size="small" text @click="handleStartEdit(data)"
                                            icon="pi pi-pencil" />
                                        <Button v-if="startDelete" severity="danger" size="small" text
                                            @click="handleStartDelete(data)" icon="pi pi-trash" />
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <div class="flex flex-col last:border-b-0 border-b border-gray-200 pb-2 px-2">
                                    <p class="font-medium text-gray-500 text-sm">{{ column.header }}</p>
                                    <template v-if="column.type === 'longtext' && data[column.field]">
                                        <Button size="small" text
                                            @click="showLongtextDialog(column.header, data[column.field])"
                                            icon="pi pi-eye" />
                                    </template>
                                    <template v-else>
                                        <p class="font-bold">{{ data.getFieldDisplayValue(column.field,
                                            data[column.field]) }}</p>
                                    </template>
                                </div>
                            </template>

                        </div>
                    </div>
                </template>
            </Column>
        </template>
    </DataTable>

    <Menu ref="menu" id="overlay_menu" :model="menuItems" :popup="true" />

    <!-- Модальное окно для отображения longtext -->
    <Dialog v-model:visible="longtextDialogVisible" :header="longtextDialogTitle" modal class="w-[90vw] md:w-[50vw]">
        <div class="whitespace-pre-wrap">{{ longtextDialogContent }}</div>
        <template #footer>
            <Button label="Закрыть" @click="hideLongtextDialog" />
        </template>
    </Dialog>
</template>