import BaseResourceCollection from "@/models/BaseResourceCollection";
import WarehouseStorage from "@/models/WarehouseStorage";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useWarehouseStorageStore = defineStore('warehouseStorage', () => {

    const warehouseStoragesLoading = ref(false);
    const warehouseStorages = ref<BaseResourceCollection<any>>(new BaseResourceCollection<any>([]));


    const loadWarehouseStorages = async (): Promise<void> => {

            warehouseStoragesLoading.value = true;

        try {
            warehouseStorages.value = await WarehouseStorage.fetchAll();
        } catch (error) {
            console.error('Error loading warehouse storages:', error);
            throw error;
        } finally {
            warehouseStoragesLoading.value = false;
        }
    };


    return {
        warehouseStorages,
        warehouseStoragesLoading,
        loadWarehouseStorages,
    };
});