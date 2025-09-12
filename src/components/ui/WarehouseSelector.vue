<script setup lang="ts">
import Warehouse from '@/models/Warehouse';
import { storeToRefs } from 'pinia';
import { ExchangeAlt } from '@vicons/fa'
import { ref, computed, onMounted } from 'vue';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import { useStorage } from '@vueuse/core';
import { useWarehouseStore } from '@/stores/useWarehouseStore';

const emit = defineEmits<{
    (e: 'change', warehouse: Warehouse): void
}>()

const warehousesStore = useWarehouseStore();
const { warehouses, selectedWarehouseAtMaterialsPage } = storeToRefs(warehousesStore);

const search = ref('');

const selectorVisible = ref(false);


const filteredWarehouses = computed(() => {
    return warehouses.value.filter((warehouse: Warehouse) => warehouse.name.toLowerCase().includes(search.value.toLowerCase()));
});

const handleChange = (warehouse: Warehouse) => {
    warehousesStore.setSelectedWarehouse(warehouse);
    selectorVisible.value = false;
    emit('change', warehouse);
}

</script>

<template>
    <div class="flex justify-between items-center bg-gray-100 p-4 rounded-md">
        <div class="flex flex-col">
            <p class="text-sm text-gray-500">Склад:</p>
            <p class="font-bold text-2xl text-gray-800" :class="{ 'text-gray-500': !selectedWarehouseAtMaterialsPage }">
                {{ selectedWarehouseAtMaterialsPage?.name ?? 'Склад не выбран' }}
            </p>
        </div>

        <Button @click="selectorVisible = true" size="small">
            <ExchangeAlt class="w-4 h-4" />
            Сменить склад
        </Button>
    </div>

    <Dialog v-model:visible="selectorVisible" pt:root:class="!shadow-none !border-0 !bg-transparent"
        pt:mask:class="backdrop-blur-sm bg-gray-50/50">
        <template #container="{ closeCallback }">
            <div class="flex flex-col gap-4 min-w-[30vw] bg-transparent">
                <div class="flex flex-col gap-4">
                    <p class="text-2xl font-medium">Выберите склад</p>
                    <InputText v-model="search" placeholder="Поиск" />
                    <template v-for="warehouse in filteredWarehouses" :key="warehouse.id">
                        <div class="flex flex-col gap-2 font-bold bg-white rounded-md p-4 shadow cursor-pointer hover:scale-105 hover:bg-gray-50 transition-all duration-300"
                            @click="handleChange(warehouse)">
                            <p>{{ warehouse.name }}</p>
                        </div>
                    </template>
                </div>
            </div>
            <Button class="mt-4" text size="sm" @click="closeCallback">Отмена</Button>
        </template>
    </Dialog>
</template>