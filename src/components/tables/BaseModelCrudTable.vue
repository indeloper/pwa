<script setup lang="ts" generic="T extends IModel">
import { onBeforeMount, ref } from 'vue';
import type { IModel } from '@/decorators';
import type { FilterSettings, BaseModelCrudTableColumn, BaseModelCrudTableConfig } from '@/types/table';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { FilterMatchMode } from '@primevue/core/api';
import InputNumber from 'primevue/inputnumber';

const props = defineProps<{
    models: T[];
    modelsLoading: boolean;
    config: BaseModelCrudTableConfig<T>;
}>();

const filters = ref<Record<string, FilterSettings>>({});

const handleStartAdd = () => {
    props.config.startAdd?.();
}

const handleStartEdit = (model: T) => {
    props.config.startEdit?.(model);
}

const handleStartDelete = (model: T) => {
    props.config.startDelete?.(model);
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
    <DataTable v-model:filters="filters" filterDisplay="row" :value="models" :loading="modelsLoading" row-hover
        scrollable size="small" dataKey="uuid" scrollHeight="flex" :virtualScrollerOptions="{ itemSize: 46 }"
        removable-sort>
        <template #header>
            <div class="flex justify-between items-center">
                <h1 class="text-2xl font-bold">{{ config.title }}</h1>
                <div class="flex gap-2">
                    <Button v-if="config.startAdd" label="Добавить" @click="handleStartAdd" />
                </div>
            </div>
        </template>
        <Column v-for="column in config.columns" :key="column.field" :field="column.field" :header="column.header"
            :class="column.class" :sortable="column.sortable ?? true">
            <template v-if="column.filter" #filter="{ filterModel, filterCallback }">
                <InputNumber v-if="column.type === 'number'" v-model="filterModel.value" size="small" fluid
                    type="number" @input="filterCallback()" placeholder="Поиск" />
                <InputText v-else v-model="filterModel.value" size="small" fluid type="text" @input="filterCallback()"
                    placeholder="Поиск" />
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
    </DataTable>
</template>