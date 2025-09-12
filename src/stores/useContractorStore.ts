
import BaseResourceCollection from "@/models/BaseResourceCollection";
import Contractor from "@/models/Contractor";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useContractorStore = defineStore('contractor', () => {

    const contractorsLoading = ref(false);
    const contractors = ref<BaseResourceCollection<any>>(new BaseResourceCollection<any>([]));


    const loadContractors = async (): Promise<void> => {

        contractorsLoading.value = true;

        try {
            contractors.value = await Contractor.fetchAll();
        } catch (error) {
            console.error('Error loading contractors:', error);
            throw error;
        } finally {
            contractorsLoading.value = false;
        }
    };


    return {
        contractors,
        contractorsLoading,
        loadContractors,
    };
});