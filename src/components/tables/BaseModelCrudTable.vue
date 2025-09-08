<script setup lang="ts" generic="T extends IModel<T>">
import { onBeforeMount, reactive, ref } from 'vue';
import type { IModel } from '@/decorators';
import type { FilterSettings, BaseModelCrudTableConfig } from '@/types/table';
import { Plus } from '@vicons/fa'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { FilterMatchMode } from '@primevue/core/api';
import InputNumber from 'primevue/inputnumber';
import ProgressSpinner from 'primevue/progressspinner';
import Menu from 'primevue/menu';
import { isMobile } from '@/helpers';


const props = defineProps<{
    models: T[];
    modelsLoading: boolean;
    config: BaseModelCrudTableConfig<T>;
}>();

const filters = ref<Record<string, FilterSettings>>({});
const selectedModels = ref<T[]>([]);
const selectedModel = ref<T | null>(null);

const menu = ref(null);
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
    props.config.startAdd?.();
}

const handleStartEdit = (model: T) => {
    props.config.startEdit?.(model);
}

const handleStartDelete = (model: T) => {
    props.config.startDelete?.(model);
}

const handleRowClick = (event: any, data: T) => {
    selectedModel.value = data;
    if (!props.config.selectable && isMobile()) {
        menu.value?.toggle(event);
    }
}

const handleMassDelete = () => {
    props.config.startMassDelete?.(selectedModels.value);
}

const initFilters = () => {
    filters.value = props.config.columns.filter(column => column.filter).reduce((acc, column) => {
        acc[column.field] = { value: null, matchMode: FilterMatchMode.STARTS_WITH };
        return acc;
    }, {} as Record<string, FilterSettings>);
}



onBeforeMount(() => {
    initFilters();
})

</script>

<template>
    <div v-if="modelsLoading" class="flex justify-center items-center h-full">
        <div class="flex flex-col items-center gap-2">
            <ProgressSpinner />
            <span>Загрузка...</span>
        </div>
    </div>
    <DataTable v-else v-model:filters="filters" :show-headers="!isMobile()" v-model:selection="selectedModels" :selection-mode="config.selectable"
        filterDisplay="row" :value="models" row-hover scrollable size="small" dataKey="uuid" scrollHeight="flex"
        :virtualScrollerOptions="{ itemSize: 46 }" removable-sort responsive>
        <template #header>
            <div class="flex justify-between items-center">
                <h1 class="text-2xl font-bold">{{ config.title }}</h1>
                <div class="flex gap-2">
                    <template v-if="config.massDelete && selectedModels.length > 0">
                        <Button icon="pi pi-trash" label="Удалить выбранные" @click="handleMassDelete" />
                    </template>
                    <template v-if="config.startAdd">
                        <Button @click="handleStartAdd" size="small">
                            <Plus class="w-4 h-4" />
                            <p class="hidden md:block">Добавить</p>
                        </Button>
                    </template>
                </div>
            </div>
        </template>

        <Column v-if="config.selectable" selectionMode="multiple" class="!w-[3%]"></Column>

        <template v-if="!isMobile()">
            <Column v-for="column in config.columns" :key="column.field" :field="column.field" :header="column.header"
                :class="column.class" :sortable="column.sortable ?? true" :frozen="column.frozen ?? false">
                <template v-if="column.filter" #filter="{ filterModel, filterCallback }">
                    <InputNumber v-if="column.type === 'number'" v-model="filterModel.value" size="small" fluid
                        type="number" @input="filterCallback()" placeholder="Поиск" />
                    <InputText v-else v-model="filterModel.value" size="small" fluid type="text"
                        @input="filterCallback()" placeholder="Поиск" />
                </template>
            </Column>
            <Column class="w-[10%]">
                <template #body="{ data }">
                    <div class="flex gap-2">
                        <Button v-if="config.startEdit" size="small" text @click="handleStartEdit(data)"
                            icon="pi pi-pencil" />
                        <Button v-if="config.startDelete" severity="danger" size="small" text
                            @click="handleStartDelete(data)" icon="pi pi-trash" />
                    </div>
                </template>
            </Column>
        </template>
        <template v-else>
            <Column>
                <template #body="{ data }">
                    <div class="flex flex-col gap-2">
                        <div v-for="column in config.columns" :key="column.field">
                            <template v-if="column.showOnMobileSummary">
                                <div class="flex justify-between items-center bg-gray-100 p-2 rounded-md">
                                    <p class="font-bold text-lg">{{ data[column.field] }}</p>
                                    <div class="flex gap-2">
                                        <Button v-if="config.startEdit" size="small" text @click="handleStartEdit(data)"
                                            icon="pi pi-pencil" />
                                        <Button v-if="config.startDelete" severity="danger" size="small" text
                                            @click="handleStartDelete(data)" icon="pi pi-trash" />
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <div
                                    class="flex flex-col last:border-b-0 border-b border-gray-200 pb-2 px-2">
                                    <p class="font-medium text-gray-500 text-sm">{{ column.header }}</p>
                                    <p class="font-bold">{{ data[column.field] }}</p>
                                </div>
                            </template>

                        </div>
                    </div>
                </template>
            </Column>
        </template>
    </DataTable>

    <Menu ref="menu" id="overlay_menu" :model="menuItems" :popup="true" />
</template>