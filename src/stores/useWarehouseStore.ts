import { defineStore } from "pinia";
import { ref } from "vue";
import { enqueueRefreshResourceTask } from "@/workers/tasks/refreshResource";
import BaseResourceCollection from "@/models/BaseResourceCollection";
import Warehouse from "@/models/Warehouse";
import { useLocalStorage } from "@vueuse/core";

export const useWarehouseStore = defineStore('warehouse', () => {
    const warehousesLoading = ref(false);
    const warehouses = ref<BaseResourceCollection<any>>(new BaseResourceCollection<any>([]));
    const selectedWarehouseId = useLocalStorage<number | null>('selected-warehouse-id', null);
    const selectedWarehouseAtMaterialsPage = ref<Warehouse | null>(null);

    const loadWarehouses = async (): Promise<void> => {
        try {
            warehousesLoading.value = true;
            warehouses.value = await Warehouse.fetchAll();
            const id = selectedWarehouseId.value;
            if (id !== null && id !== undefined) {
                const found = warehouses.value.findById(Number(id));
                selectedWarehouseAtMaterialsPage.value = found ?? null;
            }
        } catch (error) {
            console.error('Error loading warehouses:', error);
            throw error;
        } finally {
            warehousesLoading.value = false;
        }
    };

    const updateWarehouse = async (warehouse: Warehouse): Promise<void> => {
        warehousesLoading.value = true;
        try {
            await warehouse.update();

            refreshResource();

        } catch (error) {
            console.error('Error saving warehouse:', error);
            throw error;
        } finally {
            warehousesLoading.value = false;
        }
    };

    const storeWarehouse = async (warehouse: Warehouse): Promise<void> => {
        warehousesLoading.value = true;
        try {
            await Warehouse.store(warehouse);

            refreshResource();

        } catch (error) {
            console.error('Error storing warehouse:', error);
            throw error;
        } finally {
            warehousesLoading.value = false;
        }
    };

    const deleteWarehouse = async (warehouse: Warehouse): Promise<void> => {
        warehousesLoading.value = true;
        try {
            await warehouse.destroy();

            refreshResource();
        } catch (error) {
            console.error('Error deleting warehouse:', error);
            throw error;
        } finally {
            warehousesLoading.value = false;
        }
    };

    const setSelectedWarehouse = (warehouse: Warehouse | null): void => {
        selectedWarehouseAtMaterialsPage.value = warehouse;
        selectedWarehouseId.value = warehouse?.id ?? null;
    };

    const refreshResource = async (): Promise<void> => {
        enqueueRefreshResourceTask({
            modelCtor: Warehouse,
            update: (collection) => { warehouses.value = collection; },
            setLoading: (v) => { warehousesLoading.value = v; },
            title: 'Склады',
            silent: true,
        });
    }

    return {
        warehousesLoading,
        warehouses,
        selectedWarehouseAtMaterialsPage,
        setSelectedWarehouse,
        loadWarehouses,
        updateWarehouse,
        storeWarehouse,
        deleteWarehouse,
    };
});