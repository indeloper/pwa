<script setup lang="ts">
import { onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useMaterialsLibraryStore } from '../../stores/materialsLibrary';
import { storeToRefs } from 'pinia';

const materialsLibraryStore = useMaterialsLibraryStore();
const { properties, propertiesLoading } = storeToRefs(materialsLibraryStore);

onMounted(async () => {
    try {
        await materialsLibraryStore.loadProperties();
    } catch (error) {
        console.error('Failed to fetch material properties:', error);
    }
});
</script>

<template>
    <div>
        <DataTable 
            :value="properties.toArray()" 
            size="small" 
            dataKey="id" 
            :loading="propertiesLoading" 
            row-hover
            scrollable
            scrollHeight="600px"
            :virtualScrollerOptions="{ itemSize: 46 }"
        >
            <template #header>
                <div class="flex justify-between items-center">
                    <h1 class="text-2xl font-bold">Свойства материалов</h1>
                </div>
            </template>
            <Column field="name" header="Наименование" class="w-[40%]">
            </Column>
            <Column field="weightFactorFormatted" header="Весовой коэффициент" class="w-[30%]">
            </Column>
            <Column field="description" header="Описание" class="w-[30%]">
            </Column>
        </DataTable>
    </div>
</template>
