
import BaseResourceCollection from "@/models/BaseResourceCollection";
import MaterialMoveType from "@/models/MaterialMoveType";
import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

export interface IMaterialMoveTypeStore {
    moveTypes: BaseResourceCollection<any>;
    moveTypesLoading: Ref<boolean>;
    loadMoveTypes: () => Promise<void>;
}

export const useMaterialMoveTypeStore = defineStore('materialMoveType', () => {

    const moveTypesLoading = ref(false);
    const moveTypes = ref<BaseResourceCollection<any>>(new BaseResourceCollection<any>([]));


    const loadMoveTypes = async (): Promise<void> => {

            moveTypesLoading.value = true;

        try {
            moveTypes.value = await MaterialMoveType.fetchAll();
        } catch (error) {
            console.error('Error loading move types:', error);
            throw error;
        } finally {
            moveTypesLoading.value = false;
        }
    };


    return {
        moveTypes,
        moveTypesLoading,
        loadMoveTypes,
    };
});