
import BaseResourceCollection from "@/models/BaseResourceCollection";
import MaterialOperation from "@/models/MaterialOperation";
import { enqueueRefreshResourceTask } from "@/workers/tasks/refreshResource";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMaterialOperationStore = defineStore('materialOperation', () => {

    const operationsLoading = ref(false);
    const operations = ref<BaseResourceCollection<any>>(new BaseResourceCollection<any>([]));


    const loadOperations = async (): Promise<void> => {

        operationsLoading.value = true;

        try {
            operations.value = await MaterialOperation.fetchAll();
        } catch (error) {
            console.error('Error loading operations:', error);
            throw error;
        } finally {
            operationsLoading.value = false;
        }
    };

    const storeOperation = async (operation: MaterialOperation): Promise<void> => {
        operationsLoading.value = true;
        try {
            await MaterialOperation.store(operation);
            refreshResource();
        }
        catch (error) {
            console.error('Error storing operation:', error);
            throw error;
        }
        finally {
            operationsLoading.value = false;
        }
    };

    const refreshResource = async (): Promise<void> => {
        enqueueRefreshResourceTask({
            modelCtor: MaterialOperation,
            update: (collection) => { operations.value = collection; },
            setLoading: (v) => { operationsLoading.value = v; },
            title: 'Операции',
            silent: true,
        });
    }

    return {
        operations,
        operationsLoading,
        loadOperations,
        storeOperation,
    };
});