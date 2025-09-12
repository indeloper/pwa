<script setup lang="ts">
import MaterialCreating from '../../../partials/MaterialCreating.vue';
import BaseResourceTableTest from '@/components/tables/BaseResourceTableTest.vue';
import { ref, computed as vueComputed } from 'vue';
import MaterialCollection from '@/models/collections/MaterialCollection';
import MaterialMoveType from '@/models/MaterialMoveType';
import Material from '@/models/Material';
import type { IBaseCollection } from '@/models/BaseCollection';

const props = defineProps<{
    moveType: MaterialMoveType;
}>();

const materialsCollection = defineModel<MaterialCollection>('materialsCollection', { required: true });
const materialsCollectionForTable = vueComputed(() => materialsCollection.value as unknown as IBaseCollection<Material>);

const handleNodeSelect = (data: {
    material_brand_id: number;
    material_property_id: number | null;
    material_type_id: number;
}) => {
    const material = Material.resourceService().createMaterialByParams(data);
    materialsCollection.value.push(material);
}

const handleStartDelete = (data: Material) => {
    materialsCollection.value.removeBy((item: Material) => item === data);
}

</script>

<template>
    <div class="grid grid-cols-4 gap-6 h-full min-h-[75vh] pt-4">
        <div class="col-span-1 border-r border-gray-200 px-4">
            <p class="text-lg font-bold">Выбор материала</p>
            <template v-if="moveType?.is_material_creating">
                <MaterialCreating @node-select="handleNodeSelect" />
            </template>
        </div>
        <div class="col-span-3">
            <p class="text-lg font-bold">Список материалов</p>
            <BaseResourceTableTest :resources="materialsCollectionForTable" remove-sort remove-filters editable
                :start-delete="handleStartDelete" />
        </div>
    </div>
</template>