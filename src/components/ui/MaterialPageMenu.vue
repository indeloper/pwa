<script setup lang="ts">
import MaterialOperationType from '@/models/MaterialOperationType';
import MaterialMoveType from '@/models/MaterialMoveType';
import Menubar from 'primevue/menubar';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import Warehouse from '@/models/Warehouse';

const router = useRouter();

const materialOperationTypeStore = MaterialOperationType.resourceStore;
const materialMoveTypeStore = MaterialMoveType.resourceStore;
const warehouseStore = Warehouse.resourceStore;
/** @ts-ignore */
const { operationTypes } = storeToRefs(materialOperationTypeStore);
/** @ts-ignore */
const { moveTypes } = storeToRefs(materialMoveTypeStore);
/** @ts-ignore */
const { selectedWarehouseAtMaterialsPage } = storeToRefs(warehouseStore);


const items = computed(() => {
    let menu = [
        {
            label: 'Материалы',
            icon: 'pi pi-warehouse',
            command: () => router.push({ name: 'accounting-materials-list' }),
            disabled: !selectedWarehouseAtMaterialsPage.value,
        },
        {
            label: 'Операции',
            icon: 'pi pi-cog',
            disabled: !selectedWarehouseAtMaterialsPage.value,
            items: [
                {
                    label: 'Движения',
                    items: moveTypes.value.toArray().map((move_type: MaterialMoveType) => ({
                        label: move_type.description,
                        icon: 'pi pi-cog',
                        command: () => router.push({ name: 'accounting-materials-moving', params: { type: move_type.id } })
                    }))
                },
                {
                    label: 'Изготовление'
                }
            ]
        }
    ]

    // operationTypes.value.toArray().forEach((operation_type: MaterialOperationType) => {
    //     console.log(operation_type, 'operation_type');

    //     menu.push({
    //         label: operation_type.name,
    //         icon: 'pi pi-cog',
    //         command: () => router.push({ name: 'accounting-materials-operation-type', params: { id: operation_type.id } })
    //     })
    // });

    return menu;
});

</script>

<template>
    <Menubar :model="items" />
</template>