
import BaseResourceCollection from "@/models/BaseResourceCollection";
import MaterialOperationReason from "@/models/MaterialOperationReason";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMaterialOperationReasonStore = defineStore('materialOperationReason', () => {

    const operationReasonsLoading = ref(false);
    const operationReasons = ref<BaseResourceCollection<any>>(new BaseResourceCollection<any>([]));


    const loadOperationReasons = async (): Promise<void> => {

            operationReasonsLoading.value = true;

        try {
            operationReasons.value = await MaterialOperationReason.fetchAll();
        } catch (error) {
            console.error('Error loading operation reasons:', error);
            throw error;
        } finally {
            operationReasonsLoading.value = false;
        }
    };


    return {
        operationReasons,
        operationReasonsLoading,
        loadOperationReasons,
    };
});