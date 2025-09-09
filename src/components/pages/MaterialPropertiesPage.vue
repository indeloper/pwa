<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useToastMessage } from '@/composables/useToastMessage';
import Dialog from 'primevue/dialog';
import BaseResourceTable from '@/components/tables/BaseResourceTable.vue';
import { useConfirmMessage } from '@/composables/useConfirmMessage';
import MaterialProperty from '@/models/MaterialProperty';
import MaterialPropertyForm from '@/components/forms/MaterialPropertyForm.vue';

const pageLoading = ref(false);
const isAddDialogOpen = ref(false);
const isEditDialogOpen = ref(false);
const editableProperty = ref<MaterialProperty>(MaterialProperty.createEmpty());

const newProperty = ref<MaterialProperty>(MaterialProperty.createEmpty());

const { addErrorMessage, addSuccessMessage } = useToastMessage();
const { confirmDeleteMessage } = useConfirmMessage();

const materialPropertyStore = MaterialProperty.resourceStore;
/** @ts-ignore */
const { properties, propertiesLoading } = storeToRefs(materialPropertyStore);

const handleStartAdd = () => {
    isAddDialogOpen.value = true;
}
const handleStartEdit = (model: MaterialProperty) => {
    console.log(model);

    editableProperty.value = MaterialProperty.clone(model);
    isEditDialogOpen.value = true;
}
const handleDeleteType = (model: MaterialProperty) => {
    confirmDeleteMessage({
        accept: async () => {
            materialPropertyStore.deleteProperty(model)
                .then(() => {
                    addSuccessMessage('Свойство материала успешно удален');
                })
                .catch((error: any) => {
                    addErrorMessage('Не удалось удалить свойство материала');
                    console.error(error);
                });
        },
    });
}
const handleStoreProperty = (model: MaterialProperty) => {
    materialPropertyStore.storeProperty(model)
        .then(() => {
            isAddDialogOpen.value = false;
            newProperty.value = MaterialProperty.createEmpty();
            addSuccessMessage('Свойство материала успешно добавлен');
        })
        .catch((error: any) => {
                addErrorMessage('Не удалось добавить свойство материала');
            console.error(error);
        });
}
const handleUpdateProperty = (model: MaterialProperty) => {
    materialPropertyStore.updateProperty(model)
        .then(() => {
            isEditDialogOpen.value = false;
            editableProperty.value = MaterialProperty.createEmpty();
            addSuccessMessage('Марка материала успешно обновлен');
        })
        .catch((error: any) => {
            addErrorMessage('Не удалось обновить свойство материала');
            console.error(error);
        });
}

onMounted(() => {
    materialPropertyStore.loadProperties()
        .then(() => {
            pageLoading.value = false;
        })
        .catch((error: any) => {
            addErrorMessage('Не удалось загрузить свойства материалов');
            console.error('Error loading brands:', error);
        })
});
</script>

<template>
    <BaseResourceTable :models="properties" :models-loading="pageLoading" :startAdd="handleStartAdd"
        :startEdit="handleStartEdit" :startDelete="handleDeleteType" title="Свойства материалов" />

    <Dialog v-model:visible="isAddDialogOpen" header="Добавление свойства материала" modal>
        <MaterialPropertyForm v-model:model="newProperty" :loading="propertiesLoading" @submit="handleStoreProperty"
            @cancel="isAddDialogOpen = false" />
    </Dialog>

    <Dialog v-model:visible="isEditDialogOpen" header="Редактирование свойства материала" modal>
        <MaterialPropertyForm v-model:model="editableProperty" :loading="propertiesLoading" @submit="handleUpdateProperty"
            @cancel="isEditDialogOpen = false" />
    </Dialog>
</template>
