<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Dialog from 'primevue/dialog';
import BaseResourceTable from '@/components/tables/BaseResourceTable.vue';
import { storeToRefs } from 'pinia';
import Warehouse from '../../models/Warehouse';
import WarehouseForm from '@/components/forms/WarehouseForm.vue';
import { useToastMessage } from '@/composables/useToastMessage';
import { useConfirmMessage } from '@/composables/useConfirmMessage';

const pageLoading = ref(false);

const { addSuccessMessage, addErrorMessage } = useToastMessage();
const { confirmDeleteMessage } = useConfirmMessage();

const warehouseStore = Warehouse.resourceStore;

/** @ts-ignore допишу интерфейс */
const { warehouses, warehousesLoading } = storeToRefs(warehouseStore);

const editableWarehouse = ref<Warehouse>({} as Warehouse);
const newWarehouse = ref<Warehouse>(Warehouse.createEmpty());

const isAddDialogOpen = ref(false);
const isEditDialogOpen = ref(false);

const handleStartAdd = () => {
    isAddDialogOpen.value = true;
}

const handleStartEdit = (model: Warehouse) => {
    editableWarehouse.value = Warehouse.clone(model);
    isEditDialogOpen.value = true;
}

const handleUpdateWarehouse = async (model: Warehouse) => {
    warehouseStore.updateWarehouse(model)
        .then(() => {
            isEditDialogOpen.value = false;
            editableWarehouse.value = Warehouse.createEmpty();
            addSuccessMessage('Склад успешно обновлен');
        })
        .catch((error: any) => {
            addErrorMessage('Не удалось обновить склад');
            console.error(error);
        });
}

const handleStoreWarehouse = async (model: Warehouse) => {
    await warehouseStore.storeWarehouse(model)
        .then(() => {
            isAddDialogOpen.value = false;
            newWarehouse.value = Warehouse.createEmpty();
            addSuccessMessage('Склад успешно добавлен');
        })
        .catch((error: any) => {
            addErrorMessage('Не удалось добавить склад');
            console.error(error);
        });
}

const handleDeleteWarehouse = async (model: Warehouse) => {
    confirmDeleteMessage({
        accept: async () => {
            warehouseStore.deleteWarehouse(model)
                .then(() => {
                    addSuccessMessage('Склад успешно удален');
                })
                .catch((error: any) => {
                    addErrorMessage('Не удалось удалить склад');
                    console.error(error);
                });
        },
    });
}

onMounted(() => {
    warehouseStore.loadWarehouses()
        .then(() => {
            pageLoading.value = false;
        })
        .catch((error: any) => {
            addErrorMessage('Не удалось загрузить склады');
            console.error('Error loading warehouses:', error);
        });
})
</script>

<template>
    <BaseResourceTable :resources="warehouses" :startEdit="handleStartEdit" :startDelete="handleDeleteWarehouse"
        title="Склады" :startAdd="handleStartAdd" />

    <Dialog v-model:visible="isEditDialogOpen" header="Редактирование склада" modal>
        <WarehouseForm v-model:model="editableWarehouse" :loading="warehousesLoading" @submit="handleUpdateWarehouse"
            @cancel="isEditDialogOpen = false" />
    </Dialog>

    <Dialog v-model:visible="isAddDialogOpen" header="Добавление склада" modal>
        <WarehouseForm v-model:model="newWarehouse" :loading="warehousesLoading" @submit="handleStoreWarehouse"
            @cancel="isAddDialogOpen = false" />
    </Dialog>
</template>