<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import { useMaterialsLibraryStore } from '../../stores/materialsLibrary';
import { storeToRefs } from 'pinia';
import MaterialBrand from '../../models/MaterialBrand';
import type MaterialType from '../../models/MaterialType';
import { useToast } from 'primevue/usetoast';
import Select from 'primevue/select';
import { useDialog } from 'primevue/usedialog';
import MaterialBrandForm from '@/components/forms/MaterialBrandForm.vue';


const toast = useToast();
const dialog = useDialog();
const materialsLibraryStore = useMaterialsLibraryStore();
const { brands, brandsLoading, types, typesLoading } = storeToRefs(materialsLibraryStore);

const selectedType = ref<MaterialType | null>(null);
const isNewDialogOpen = ref(false);
const isEditDialogOpen = ref(false);

const newBrand = ref<MaterialBrand>({} as MaterialBrand);
const editableBrand = ref<MaterialBrand>({} as MaterialBrand);

const showNewDialog = async () => {
    // if (types.value.count() === 0) {
    //     await materialsLibraryStore.loadTypes();
    // }

    // selectedType.value = null;
    isNewDialogOpen.value = true;
}

const showEditDialog = async (brand: MaterialBrand) => {
    // Загружаем типы если их нет
    if (types.value.count() === 0) {
        await materialsLibraryStore.loadTypes();
    }

    if (brand.material_type) {
        brand.material_type = types.value.findById(brand.material_type.id!) as MaterialType;
    }

    editableBrand.value = brand;

    isEditDialogOpen.value = true;
}

const handleSaveBrand = async () => {
    if (!newBrand.value || !selectedType.value) return;

    try {
        await materialsLibraryStore.storeBrand(newBrand.value);
        isNewDialogOpen.value = false;
        toast.add({ severity: 'info', summary: 'Успешно', detail: 'Бренд добавлен', life: 3000 });
        materialsLibraryStore.loadBrands();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось добавить бренд', life: 3000 });
    }
}

const handleUpdateBrand = async () => {
    if (!editableBrand.value || !selectedType.value) return;

    try {
        // Обновляем модель с выбранным типом
        editableBrand.value.material_type = selectedType.value;

        await materialsLibraryStore.updateBrand(editableBrand.value);
        isEditDialogOpen.value = false;
        toast.add({ severity: 'info', summary: 'Успешно', detail: 'Бренд обновлен', life: 3000 });
        materialsLibraryStore.loadBrands();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось обновить бренд', life: 3000 });
    }
}

onMounted(async () => {
    await materialsLibraryStore.loadBrands();
    await materialsLibraryStore.loadTypes();
});
</script>

<template>

    <!-- <MaterialBrandsTable :material-brands="brands.toArray()" :brands-loading="brandsLoading"
        @show-add-dialog="showNewDialog" @show-edit-dialog="showEditDialog" />


    <MaterialBrandForm :brand="newBrand" as-dialog v-model:visible="isNewDialogOpen" /> -->

    <!-- <Dialog v-model:visible="isNewDialogOpen" header="Добавление бренда" modal>
        <div v-if="newBrand" class="flex flex-col gap-4">
            <InputText v-model="newBrand.name" placeholder="Наименование бренда" />
            <Select v-model="newBrand.material_type" :options="types.toArray()" optionLabel="name"
                placeholder="Выберите тип материала" :loading="typesLoading" />
            <InputText v-model="newBrand.weight" placeholder="Вес (например: 0.0790)" />
            <Textarea v-model="newBrand.description" placeholder="Описание бренда" />
        </div>
        <template #footer>
            <Button severity="secondary" label="Отмена" @click="isNewDialogOpen = false" />
            <Button label="Сохранить" @click="handleSaveBrand" />
        </template>
    </Dialog>

    <Dialog v-model:visible="isEditDialogOpen" header="Редактирование бренда" modal>
        <div v-if="editableBrand" class="flex flex-col gap-4">
            <InputText v-model="editableBrand.name" placeholder="Наименование бренда" />
            <Select v-model="editableBrand.material_type" :options="types.toArray()" optionLabel="name"
                placeholder="Выберите тип материала" :loading="typesLoading" />
            <InputText v-model="editableBrand.weight" placeholder="Вес (например: 0.0790)" />
            <Textarea v-model="editableBrand.description" placeholder="Описание бренда" />
        </div>
        <template #footer>
            <Button severity="secondary" label="Отмена" @click="isEditDialogOpen = false" />
            <Button label="Сохранить" @click="handleUpdateBrand" />
        </template>
    </Dialog> -->
</template>
