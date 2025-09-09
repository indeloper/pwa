<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import MaterialType from '../../models/MaterialType';
import { ref } from 'vue';
import { useToastMessage } from '@/composables/useToastMessage';
import MaterialTypeForm from '@/components/forms/MaterialTypeForm.vue';
import Dialog from 'primevue/dialog';
import BaseResourceTable from '@/components/tables/BaseResourceTable.vue';
import { useConfirmMessage } from '@/composables/useConfirmMessage';

const pageLoading = ref(false);
const isAddDialogOpen = ref(false);
const isEditDialogOpen = ref(false);
const editableType = ref<MaterialType>(MaterialType.createEmpty());

const newType = ref<MaterialType>(MaterialType.createEmpty());

const { addErrorMessage, addSuccessMessage } = useToastMessage();
const { confirmDeleteMessage } = useConfirmMessage();

const materialTypeStore = MaterialType.resourceStore;
/** @ts-ignore */
const { types, typesLoading } = storeToRefs(materialTypeStore);

const handleStartAdd = () => {
    isAddDialogOpen.value = true;
}
const handleStartEdit = (model: MaterialType) => {
    console.log(model);

    editableType.value = MaterialType.clone(model);
    isEditDialogOpen.value = true;
}
const handleDeleteType = (model: MaterialType) => {
    confirmDeleteMessage({
        accept: async () => {
            materialTypeStore.deleteType(model)
                .then(() => {
                    addSuccessMessage('Тип материала успешно удален');
                })
                .catch((error: any) => {
                    addErrorMessage('Не удалось удалить тип материала');
                    console.error(error);
                });
        },
    });
}
const handleStoreType = (model: MaterialType) => {
    materialTypeStore.storeType(model)
        .then(() => {
            isAddDialogOpen.value = false;
            newType.value = MaterialType.createEmpty();
            addSuccessMessage('Тип материала успешно добавлен');
        })
        .catch((error: any) => {
            addErrorMessage('Не удалось добавить тип материала');
            console.error(error);
        });
}
const handleUpdateType = (model: MaterialType) => {
    materialTypeStore.updateType(model)
        .then(() => {
            isEditDialogOpen.value = false;
            editableType.value = MaterialType.createEmpty();
            addSuccessMessage('Тип материала успешно обновлен');
        })
        .catch((error: any) => {
            addErrorMessage('Не удалось обновить тип материала');
            console.error(error);
        });
}

onMounted(() => {
    materialTypeStore.loadTypes()
        .then(() => {
            pageLoading.value = false;
        })
        .catch((error: any) => {
            addErrorMessage('Не удалось загрузить типы материалов');
            console.error('Error loading types:', error);
        })
});
</script>

<template>
    <BaseResourceTable :models="types" :models-loading="pageLoading" :startAdd="handleStartAdd"
        :startEdit="handleStartEdit" :startDelete="handleDeleteType" title="Типы материалов" />

    <Dialog v-model:visible="isAddDialogOpen" header="Добавление типа материала" modal>
        <MaterialTypeForm v-model:model="newType" :loading="typesLoading" @submit="handleStoreType"
            @cancel="isAddDialogOpen = false" />
    </Dialog>

    <Dialog v-model:visible="isEditDialogOpen" header="Редактирование типа материала" modal>
        <MaterialTypeForm v-model:model="editableType" :loading="typesLoading" @submit="handleUpdateType"
            @cancel="isEditDialogOpen = false" />
    </Dialog>
</template>
