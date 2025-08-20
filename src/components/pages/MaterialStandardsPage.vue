<script setup lang="ts">
import { onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useMaterialsLibraryStore } from '../../stores/materialsLibrary';
import { storeToRefs } from 'pinia';

const materialsLibraryStore = useMaterialsLibraryStore();
const { standards, standardsLoading } = storeToRefs(materialsLibraryStore);

onMounted(async () => {
    try {
        await materialsLibraryStore.loadStandards();
        console.log('Material Standards (models):', standards.value);
        
        if (standards.value.count() > 0) {
            const firstStandard = standards.value.first();
            if (firstStandard) {
                console.log('First standard display name:', firstStandard.displayName);
                console.log('First standard type:', firstStandard.typeName);
                console.log('First standard brand:', firstStandard.brandName);
                console.log('First standard has description:', firstStandard.hasDescription);
                console.log('First standard has type:', firstStandard.hasType);
                console.log('First standard has brand:', firstStandard.hasBrand);
                console.log('First standard properties count:', firstStandard.propertiesCount);
                console.log('First standard brands count:', firstStandard.brandsCount);
                console.log('First standard alternatives count:', firstStandard.alternativesCount);
                console.log('First standard is old standard:', firstStandard.isOldStandard);
                console.log('First standard has alternatives:', firstStandard.hasAlternatives);
                
                if (firstStandard.material_type) {
                    console.log('First standard type details:', firstStandard.material_type);
                }
                
                if (firstStandard.material_brand) {
                    console.log('First standard brand details:', firstStandard.material_brand);
                }
                
                if (firstStandard.properties && firstStandard.properties.count() > 0) {
                    console.log('First standard properties:', firstStandard.properties.toArray());
                }
                
                if (firstStandard.material_brands && firstStandard.material_brands.count() > 0) {
                    console.log('First standard material brands:', firstStandard.material_brands.toArray());
                }
            }
        }
    } catch (error) {
        console.error('Failed to fetch material standards:', error);
    }
});
</script>

<template>
    <div>
        <DataTable 
            :value="standards.toArray()" 
            size="small" 
            dataKey="id" 
            :loading="standardsLoading" 
            row-hover
            scrollable
            scrollHeight="600px"
            :virtualScrollerOptions="{ itemSize: 46 }"
        >
            <template #header>
                <div class="flex justify-between items-center">
                    <h1 class="text-2xl font-bold">Стандарты материалов</h1>
                </div>
            </template>
            <Column field="name" header="Наименование" class="w-[25%]">
            </Column>
            <Column field="typeName" header="Тип материала" class="w-[20%]">
            </Column>
            <Column field="brandName" header="Бренд" class="w-[20%]">
            </Column>
            <Column field="propertiesCount" header="Свойства" class="w-[15%]">
            </Column>
            <Column field="description" header="Описание" class="w-[20%]">
            </Column>
        </DataTable>
    </div>
</template>
