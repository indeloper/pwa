<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import BaseModelCrudTable from '@/components/tables/BaseModelCrudTable.vue';
import type { BaseModelCrudTableConfig } from '@/types/table';
import { useMaterialsLibraryStore } from '../../stores/materialsLibrary';
import { storeToRefs } from 'pinia';
import MaterialUnit from '../../models/MaterialUnit';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import MaterialUnitForm from '@/components/forms/MaterialUnitForm.vue';
import { cloneDeep } from 'lodash';

const confirm = useConfirm();
const toast = useToast();
const materialsLibraryStore = useMaterialsLibraryStore();

const { units, unitsLoading } = storeToRefs(materialsLibraryStore);

const editableUnit = ref<MaterialUnit>({} as MaterialUnit);
const newUnit = ref<MaterialUnit>(MaterialUnit.createEmpty());

const isAddDialogOpen = ref(false);
const isEditDialogOpen = ref(false);

const config = ref<BaseModelCrudTableConfig<MaterialUnit>>({
    title: 'Единицы измерения',
    startAdd: () => handleStartAdd(),
    startEdit: (model: MaterialUnit) => handleStartEdit(model),
    startDelete: (model: MaterialUnit) => handleDeleteUnit(model),
    columns: [
        { field: 'name', header: 'Наименование', class: 'w-[50%]', filter: true },
        { field: 'label', header: 'Короткое наименование', class: 'w-[25%]', filter: true },
    ]
});

const handleStartAdd = () => {
    isAddDialogOpen.value = true;
}

const handleStartEdit = (model: MaterialUnit) => {
    editableUnit.value = cloneDeep(model);
    isEditDialogOpen.value = true;
}

const handleUpdateUnit = async (model: MaterialUnit) => {
    materialsLibraryStore.updateUnit(model)
        .then(() => {
            isEditDialogOpen.value = false;
            toast.add({ severity: 'success', summary: 'Успешно', detail: 'Единица измерения успешно обновлена', life: 3000 });
            // materialsLibraryStore.loadUnits();
        })
        .catch((error) => {
            toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось обновить единицу измерения', life: 3000 });
            console.error('Error updating unit:', error);
        });
}

const handleStoreUnit = async (model: MaterialUnit) => {
    materialsLibraryStore.storeUnit(model)
        .then(() => {
            isAddDialogOpen.value = false;
            toast.add({ severity: 'success', summary: 'Успешно', detail: 'Единица измерения успешно добавлена', life: 3000 });
            // materialsLibraryStore.loadUnits();
        })
        .catch((error) => {
            toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось добавить единицу измерения', life: 3000 });
            console.error('Error storing unit:', error);
        });
}

const handleDeleteUnit = async (model: MaterialUnit) => {

    confirm.require({
        message: 'Вы уверены, что хотите удалить эту единицу измерения?',
        header: 'Удаление единицы измерения',
        accept: async () => {
            materialsLibraryStore.deleteUnit(model)
                .then(() => {
                    toast.add({ severity: 'success', summary: 'Успешно', detail: 'Единица измерения успешно удалена', life: 3000 });
                    materialsLibraryStore.loadUnits();
                })
                .catch((error) => {
                    toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось удалить единицу измерения', life: 3000 });
                    console.error('Error deleting unit:', error);
                });
        },
    });
}

onMounted(() => {
    materialsLibraryStore.loadUnits();
})
</script>

<template>
    <BaseModelCrudTable :models="units.toArray()" :models-loading="unitsLoading" :config="config" />

    <Dialog v-model:visible="isEditDialogOpen" header="Редактирование единицы измерения" modal>
        <MaterialUnitForm v-model:model="editableUnit" @submit="handleUpdateUnit" @cancel="isEditDialogOpen = false" />
    </Dialog>

    <Dialog v-model:visible="isAddDialogOpen" header="Добавление единицы измерения" modal>
        <MaterialUnitForm v-model:model="newUnit" @submit="handleStoreUnit" @cancel="isAddDialogOpen = false" />
    </Dialog>
</template>