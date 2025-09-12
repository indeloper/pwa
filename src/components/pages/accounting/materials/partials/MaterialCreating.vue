<script setup lang="ts">
import { useMaterial } from '@/composables/useMaterial';
import { ref, computed } from 'vue';
import MaterialType from '@/models/MaterialType';
import MaterialBrand from '@/models/MaterialBrand';
import { storeToRefs } from 'pinia';
import TreeTable from 'primevue/treetable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputIcon from 'primevue/inputicon';
import IconField from 'primevue/iconfield';


const emit = defineEmits<{
    (e: 'node-select', data: {
        material_brand_id: number;
        material_property_id: number | null;
        material_type_id: number;
    }): void
}>();

const { createMaterialTypesNodes } = useMaterial();

const materialTypeStore = MaterialType.resourceStore;
const materialBrandStore = MaterialBrand.resourceStore;
/** @ts-ignore */
const { types } = storeToRefs(materialTypeStore);
/** @ts-ignore */
const { brands } = storeToRefs(materialBrandStore);

const materialTypesNodes = computed<any[]>(() => {
    return createMaterialTypesNodes(types.value, brands.value);
});

const filters = ref<any>({});

const handleNodeSelect = (data: any) => {
    emit('node-select', {
        material_brand_id: data.material_brand_id,
        material_property_id: data.material_property_id,
        material_type_id: data.material_type_id,
    });
}
</script>

<template>
    <TreeTable :value="materialTypesNodes" scrollable scrollHeight="78vh" :filters="filters" filterMode="lenient">
        <template #header>
            <div class="flex w-full">
                <IconField fluid class="w-full">
                    <InputIcon class="pi pi-search" />
                    <InputText fluid size="small" v-model="filters['global']" placeholder="Поиск" />
                </IconField>
            </div>
        </template>
        <Column field="name" header="Наименование" expander />
        <Column>
            <template #body="slotProps">
                <Button v-if="!slotProps.node.children" size="small" text icon="pi pi-plus"
                    @click="handleNodeSelect(slotProps.node.data)" />
            </template>
        </Column>
    </TreeTable>
</template>