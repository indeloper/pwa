
import BaseResourceCollection from "@/models/BaseResourceCollection";
import MaterialOperationType from "@/models/MaterialOperationType";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMaterialOperationTypeStore = defineStore('materialOperationType', () => {

    const operationTypesLoading = ref(false);
    const operationTypes = ref<BaseResourceCollection<any>>(new BaseResourceCollection<any>([]));


    const loadOperationTypes = async (): Promise<void> => {

            operationTypesLoading.value = true;

        try {
            operationTypes.value = await MaterialOperationType.fetchAll();
        } catch (error) {
            console.error('Error loading operation types:', error);
            throw error;
        } finally {
            operationTypesLoading.value = false;
        }
    };


    return {
        operationTypes,
        operationTypesLoading,
        loadOperationTypes,
    };
});