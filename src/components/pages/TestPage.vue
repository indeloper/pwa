<script setup lang="ts">
import MaterialOperationApi from '@/api/MaterialOperationApi';
import { onMounted, ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { keyBy } from 'lodash';

const data = ref<any>(null);
const loading = ref(false);

onMounted(async () => {
    loading.value = true;
    // data.value = await MaterialOperationApi.fetchData(); 
    MaterialOperationApi.fetchAllStream();
    loading.value = false;
})
</script>

<template>
    <!-- <pre>
        {{ data?.[0] }}
    </pre>
    <DataTable :value="data" scrollable size="small"
        :virtualScrollerOptions="{ itemSize: 37, numToleratedItems: 10, lazy: true }" scroll-height="flex"
        :loading="loading" :virtual-scroll="true" rowGroupMode="subheader" groupRowsBy="material_operation_id"
        sort-field="material_operation_id">
        <Column field="material_operation_id" header="ID"></Column>
        <Column field="material_operation_date" header="Date"></Column>
        <template #groupheader="slotProps">
            <div class="flex items-center gap-2">
                <span>{{ slotProps.data.material_operation_id }}</span>
            </div>
        </template>
        <template #groupfooter="slotProps">
            <div class="flex justify-end font-bold w-full">{{ slotProps.data.material_operation_id }}</div>
        </template>
    </DataTable> -->
    <div>
        <h1>Test Page</h1>
    </div> 

</template>

<style scoped></style>