<script setup lang="ts">
import { onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useMaterialsLibraryStore } from '../../stores/materialsLibrary';
import { storeToRefs } from 'pinia';

const materialsLibraryStore = useMaterialsLibraryStore();
const { types, typesLoading } = storeToRefs(materialsLibraryStore);

onMounted(async () => {
    try {
        await materialsLibraryStore.loadTypes();
    } catch (error) {
        console.error('Failed to fetch material types:', error);
    }
});
</script>

<template>
    <div>
        <DataTable 
            :value="types.toArray()" 
            size="small" 
            dataKey="id" 
            :loading="typesLoading" 
            row-hover
            scrollable
            scrollHeight="600px"
            :virtualScrollerOptions="{ itemSize: 46 }"
        >
            <template #header>
                <div class="flex justify-between items-center">
                    <h1 class="text-2xl font-bold">Типы материалов</h1>
                </div>
            </template>
            <Column field="name" header="Наименование" class="w-[30%]">
            </Column>
            <Column field="unitName" header="Единица измерения" class="w-[20%]">
            </Column>
            <Column field="isFixedQuantity" header="Фиксированное количество" class="w-[20%]">
            </Column>
            <Column field="propertiesCount" header="Количество свойств" class="w-[15%]">
            </Column>
            <Column field="description" header="Описание" class="w-[15%]">
            </Column>
        </DataTable>
    </div>
</template>
