<script setup lang="ts">
import type BaseResourceCollection from '@/models/BaseResourceCollection';
import { computed, ref, watch } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import { Pen } from '@vicons/fa';
import _ from 'lodash';
import Button from 'primevue/button';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import Select from 'primevue/select';

const props = defineProps<{
    resources: BaseResourceCollection<any>;
    editable?: boolean;
    startEdit?: (data: any) => void;
    startDelete?: (data: any) => void;
    startAdd?: () => void;
    title?: string;
    removeSort?: boolean;
    removeFilters?: boolean;
}>()

const filters = ref({})

const filteredResources = computed(() => {
    return props.resources.toArray();
})

const columns = computed(() => {
    return props.resources.first()?.constructor.tableColumns ?? new Map();
})

const onCellEditComplete = (event: any) => {
    let { data, newValue, field } = event;
    data[field] = newValue
}

const handleStartEdit = (data: any) => {
    props.startEdit?.(data);
}

const handleStartDelete = (data: any) => {
    props.startDelete?.(data);
}

const handleStartAdd = () => {
    props.startAdd?.();
}

const initFilters = () => {
    const result: Record<string, any> = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
    for (const [key, column] of columns.value) {
        if (column.type === 'number' || column.type === 'integer') {
            result[key] = { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] };
        } else {
            result[key] = { value: null, matchMode: FilterMatchMode.CONTAINS };
        }
    }
    filters.value = result;
}

watch(
    () => columns.value,
    () => initFilters(),
    { deep: true }
)

const getDataType = (column: any) => {
    switch (column.type) {
        case 'number':
        case 'integer':
            return 'numeric';
        case 'decimal':
        case 'float':
            return 'numeric';
        case 'select':
            return 'text';
    }
    return 'text';
}

</script>

<template>
    <template v-if="!resources.isEmpty()">
        <template v-if="columns && columns.size > 0">
            <DataTable v-model:filters="filters" :filterDisplay="removeFilters ? 'none' : 'menu'"
                :value="filteredResources" size="small" :removable-sort="!removeSort" row-hover
                :editMode="editable ? 'cell' : undefined" @cell-edit-complete="onCellEditComplete" :pt="{
                    column: {
                        bodycell: ({ state }: { state: any }) => ({
                            class: [{ '!py-0': state['d_editing'] }]
                        })
                    },
                    table: { style: 'table-layout: fixed;' }
                }" scrollable scrollHeight="flex" :virtualScrollerOptions="{ itemSize: 48 }">
                <template #header>
                    <div class="flex justify-between items-center">
                        <h1 class="text-2xl font-bold">{{ title }}</h1>
                        <Button v-if="startAdd" size="small" @click="handleStartAdd" icon="pi pi-plus" />
                    </div>
                </template>
                <template v-for="[key, column] in columns" :key="key">
                    <Column :field="key" :header="column.header" :sortable="(!removeSort && column.sortable) ?? true"
                        :dataType="getDataType(column)" class="!h-[48px]">
                        <template #body="{ data }">
                            <div class="relative flex items-center group min-h-[24px] w-full">
                                <p v-if="column.type === 'longtext'" :class="column.class" v-tooltip.top="(column.display(_.get(data, key), data) ?? '')"
                                    class="text-nowrap">
                                    {{ column.display(_.truncate(data[key], { length: 20 }), data) ?? '—' }}
                                </p>
                                <p v-else class="text-nowrap" :class="column.class">{{ column.display(_.get(data, key), data) ?? '—' }}</p>
                                <Pen v-if="column.editable" class="w-3 h-3 absolute right-0 top-0 hidden group-hover:block" />
                            </div>

                        </template>
                        <template #editor="{ data }">
                            <template v-if="column.editable">
                                <Select v-if="column.type === 'select'" v-model="data[key]" size="small" fluid
                                    :options="column.editOptions()" option-label="label" option-value="value"
                                    placeholder="Поиск..." filter showClear  />
                                <InputNumber v-else-if="column.type === 'integer'" v-model="data[key]" size="small" fluid
                                    type="number" />
                                <InputNumber v-else-if="column.type === 'number'" v-model="data[key]" size="small" fluid
                                    type="number" :maxFractionDigits="4" />
                                <InputText v-else v-model="data[key]" size="small" fluid type="text" />
                            </template>
                            <template v-else>
                                <p v-if="column.type === 'longtext'" v-tooltip.top="column.display(_.get(data, key), data)"
                                    class="text-nowrap">
                                    {{ column.display(_.truncate(data[key], { length: 20 }), data) }}
                                </p>
                                <p v-else class="text-nowrap">{{ column.display(_.get(data, key), data) }}</p>
                            </template>
                        </template>
                        <template #filter="{ filterModel, filterCallback }">
                            <InputNumber v-if="column.type === 'integer'" v-model="filterModel.value" size="small" fluid
                                type="number" placeholder="Поиск..." @input="filterCallback()" />
                            <InputNumber v-else-if="column.type === 'number'" v-model="filterModel.value" size="small" fluid
                                type="number" :maxFractionDigits="4" placeholder="Поиск..." @input="filterCallback()" />
                            <InputText v-else v-model="filterModel.value" size="small" fluid type="text" placeholder="Поиск..."
                                @input="filterCallback()" />
                        </template>
                    </Column>
                </template>

                <Column class="w-[7%]" v-if="startEdit || startDelete">
                    <template #body="{ data }">
                        <div class="flex gap-2">
                            <Button v-if="startEdit" size="small" text @click="handleStartEdit(data)" icon="pi pi-pencil" />
                            <Button v-if="startDelete" size="small" severity="danger" text @click="handleStartDelete(data)"
                                icon="pi pi-trash" />
                        </div>
                    </template>
                </Column>
            </DataTable>
        </template>
        <div v-else class="p-4">
            <p class="text-center text-gray-500">Ресурс не сконфигурирован для отображения в таблице</p>
        </div>
    </template>
    <div v-else class="p-4">
        <p class="text-center text-gray-500">Нет данных</p>
    </div>

</template>