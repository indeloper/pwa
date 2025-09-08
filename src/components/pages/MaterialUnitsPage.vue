<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Dialog from 'primevue/dialog';
import BaseResourceTable from '@/components/tables/BaseResourceTable.vue';
import { storeToRefs } from 'pinia';
import MaterialUnit from '../../models/MaterialUnit';
import MaterialUnitForm from '@/components/forms/MaterialUnitForm.vue';
import { useToastMessage } from '@/composables/useToastMessage';
import { useConfirmMessage } from '@/composables/useConfirmMessage';

const pageLoading = ref(false);

const { addSuccessMessage, addErrorMessage } = useToastMessage();
const { confirmDeleteMessage } = useConfirmMessage();

const materialUnitStore = MaterialUnit.resourceStore;

/** @ts-ignore допишу интерфейс */
const { units, unitsLoading } = storeToRefs(materialUnitStore);

const editableUnit = ref<MaterialUnit>({} as MaterialUnit);
const newUnit = ref<MaterialUnit>(MaterialUnit.createEmpty());

const isAddDialogOpen = ref(false);
const isEditDialogOpen = ref(false);

const handleStartAdd = () => {
    isAddDialogOpen.value = true;
}

const handleStartEdit = (model: MaterialUnit) => {
    editableUnit.value = MaterialUnit.clone(model);
    isEditDialogOpen.value = true;
}

const handleUpdateUnit = async (model: MaterialUnit) => {
    materialUnitStore.updateUnit(model)
        .then(() => {
            isEditDialogOpen.value = false;
            editableUnit.value = MaterialUnit.createEmpty();
            addSuccessMessage('Единица измерения успешно обновлена');
        })
        .catch((error: any) => {
            addErrorMessage('Не удалось обновить единицу измерения');
            console.error(error);
        });
}

const handleStoreUnit = async (model: MaterialUnit) => {
    await materialUnitStore.storeUnit(model)
        .then(() => {
            isAddDialogOpen.value = false;
            newUnit.value = MaterialUnit.createEmpty();
            addSuccessMessage('Единица измерения успешно добавлена');
        })
        .catch((error: any) => {
            addErrorMessage('Не удалось добавить единицу измерения');
            console.error(error);
        });
}

const handleDeleteUnit = async (model: MaterialUnit) => {
    confirmDeleteMessage({
        accept: async () => {
            materialUnitStore.deleteUnit(model)
                .then(() => {
                    addSuccessMessage('Единица измерения успешно удалена');
                })
                .catch((error: any) => {
                    addErrorMessage('Не удалось удалить единицу измерения');
                    console.error(error);
                });
        },
    });
}

onMounted(() => {
    materialUnitStore.loadUnits()
        .then(() => {
            pageLoading.value = false;
        })
        .catch((error: any) => {
            addErrorMessage('Не удалось загрузить единицы измерения');
            console.error('Error loading units:', error);
        });
})
</script>

<template>
    <BaseResourceTable :models="units.toArray()" :models-loading="pageLoading" :startAdd="handleStartAdd"
        :startEdit="handleStartEdit" :startDelete="handleDeleteUnit" title="Единицы измерения" />

    <Dialog v-model:visible="isEditDialogOpen" header="Редактирование единицы измерения" modal>
        <MaterialUnitForm v-model:model="editableUnit" :loading="unitsLoading" @submit="handleUpdateUnit"
            @cancel="isEditDialogOpen = false" />
    </Dialog>

    <Dialog v-model:visible="isAddDialogOpen" header="Добавление единицы измерения" modal>
        <MaterialUnitForm v-model:model="newUnit" :loading="unitsLoading" @submit="handleStoreUnit"
            @cancel="isAddDialogOpen = false" />
    </Dialog>
</template>