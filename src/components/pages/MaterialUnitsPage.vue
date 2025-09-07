<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Dialog from 'primevue/dialog';
import BaseModelCrudTable from '@/components/tables/BaseModelCrudTable.vue';
import type { BaseModelCrudTableConfig } from '@/types/table';
import { useMaterialsLibraryStore } from '../../stores/materialsLibrary';
import { storeToRefs } from 'pinia';
import MaterialUnit from '../../models/MaterialUnit';
import MaterialUnitForm from '@/components/forms/MaterialUnitForm.vue';
import { cloneDeep } from 'lodash';
import { useToastMessage } from '@/composables/useToastMessage';
import { useConfirmMessage } from '@/composables/useConfirmMessage';
import { useAuthApi } from '@/composables';
import type BaseCollection from '@/models/BaseCollection';

const pageLoading = ref(true);

const { addSuccessMessage, addErrorMessage } = useToastMessage();
const { confirmDeleteMessage } = useConfirmMessage();

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
        { 
            field: 'name', 
            header: 'Наименование', 
            class: 'w-[50%]', 
            filter: true, 
        },
        { 
            field: 'label', 
            header: 'Короткое наименование', 
            class: 'w-[25%]', 
            filter: true, 
        },
        {
            field: 'coefficient',
            header: 'Коэффициент',
            class: 'w-[25%]',
        },
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
            addSuccessMessage('Единица измерения успешно обновлена');
        })
        .catch((error) => {
            addErrorMessage('Не удалось обновить единицу измерения');
            console.error(error);
        });
}

const handleStoreUnit = async (model: MaterialUnit) => {
    await materialsLibraryStore.storeUnit(model)
        .then(() => {
            isAddDialogOpen.value = false;
            addSuccessMessage('Единица измерения успешно добавлена');
        })
        .catch((error) => {
            addErrorMessage('Не удалось добавить единицу измерения');
            console.error(error);
        });
}

const handleDeleteUnit = async (model: MaterialUnit) => {
    confirmDeleteMessage({
        accept: async () => {
            materialsLibraryStore.deleteUnit(model)
                .then(() => {
                    addSuccessMessage('Единица измерения успешно удалена');
                })
                .catch((error) => {
                    addErrorMessage('Не удалось удалить единицу измерения');
                    console.error(error);
                });
        },
    });
}

onMounted(() => {
    materialsLibraryStore.loadUnits()
        .then(() => {
            pageLoading.value = false;
        });
})
</script>

<template>
    <BaseModelCrudTable :models="units.toArray()" :models-loading="pageLoading" :config="config" />

    <Dialog v-model:visible="isEditDialogOpen" header="Редактирование единицы измерения" modal>
        <MaterialUnitForm v-model:model="editableUnit" :loading="unitsLoading" @submit="handleUpdateUnit"
            @cancel="isEditDialogOpen = false" />
    </Dialog>

    <Dialog v-model:visible="isAddDialogOpen" header="Добавление единицы измерения" modal>
        <MaterialUnitForm v-model:model="newUnit" :loading="unitsLoading" @submit="handleStoreUnit"
            @cancel="isAddDialogOpen = false" />
    </Dialog>
</template>