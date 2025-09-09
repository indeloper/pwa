<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useToastMessage } from '@/composables/useToastMessage';
import Dialog from 'primevue/dialog';
import BaseResourceTable from '@/components/tables/BaseResourceTable.vue';
import { useConfirmMessage } from '@/composables/useConfirmMessage';
import MaterialBrand from '@/models/MaterialBrand';
import MaterialBrandForm from '@/components/forms/MaterialBrandForm.vue';

const pageLoading = ref(false);
const isAddDialogOpen = ref(false);
const isEditDialogOpen = ref(false);
const editableBrand = ref<MaterialBrand>(MaterialBrand.createEmpty());

const newBrand = ref<MaterialBrand>(MaterialBrand.createEmpty());

const { addErrorMessage, addSuccessMessage } = useToastMessage();
const { confirmDeleteMessage } = useConfirmMessage();

const materialBrandStore = MaterialBrand.resourceStore;
/** @ts-ignore */
const { brands, brandsLoading } = storeToRefs(materialBrandStore);

const handleStartAdd = () => {
    isAddDialogOpen.value = true;
}
const handleStartEdit = (model: MaterialBrand) => {
    console.log(model);

    editableBrand.value = MaterialBrand.clone(model);
    isEditDialogOpen.value = true;
}
const handleDeleteType = (model: MaterialBrand) => {
    confirmDeleteMessage({
        accept: async () => {
            materialBrandStore.deleteBrand(model)
                .then(() => {
                    addSuccessMessage('Марка материала успешно удален');
                })
                .catch((error: any) => {
                    addErrorMessage('Не удалось удалить марку материала');
                    console.error(error);
                });
        },
    });
}
const handleStoreBrand = (model: MaterialBrand) => {
    materialBrandStore.storeBrand(model)
        .then(() => {
            isAddDialogOpen.value = false;
            newBrand.value = MaterialBrand.createEmpty();
            addSuccessMessage('Марка материала успешно добавлен');
        })
        .catch((error: any) => {
            addErrorMessage('Не удалось добавить марку материала');
            console.error(error);
        });
}
const handleUpdateBrand = (model: MaterialBrand) => {
    materialBrandStore.updateBrand(model)
        .then(() => {
            isEditDialogOpen.value = false;
            editableBrand.value = MaterialBrand.createEmpty();
            addSuccessMessage('Марка материала успешно обновлен');
        })
        .catch((error: any) => {
            addErrorMessage('Не удалось обновить марку материала');
            console.error(error);
        });
}

onMounted(() => {
    materialBrandStore.loadBrands()
        .then(() => {
            pageLoading.value = false;
        })
        .catch((error: any) => {
            addErrorMessage('Не удалось загрузить марки материалов');
            console.error('Error loading brands:', error);
        })
});
</script>

<template>
    <BaseResourceTable :models="brands.toArray()" :models-loading="pageLoading" :startAdd="handleStartAdd"
        :startEdit="handleStartEdit" :startDelete="handleDeleteType" title="Марки материалов" />

    <Dialog v-model:visible="isAddDialogOpen" header="Добавление типа материала" modal>
        <MaterialBrandForm v-model:model="newBrand" :loading="brandsLoading" @submit="handleStoreBrand"
            @cancel="isAddDialogOpen = false" />
    </Dialog>

    <Dialog v-model:visible="isEditDialogOpen" header="Редактирование типа материала" modal>
        <MaterialBrandForm v-model:model="editableBrand" :loading="brandsLoading" @submit="handleUpdateBrand"
            @cancel="isEditDialogOpen = false" />
    </Dialog>
</template>
