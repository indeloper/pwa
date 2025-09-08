import MaterialTypeCollection from "@/models/collections/MaterialTypeCollection";
import MaterialType from "@/models/MaterialType";
import { enqueueRefreshResourceTask } from "@/workers/tasks/refreshResource";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMaterialTypeStore = defineStore('materialType', () => {

    const typesLoading = ref(false);
    const types = ref<MaterialTypeCollection>(new MaterialTypeCollection());


    const loadTypes = async (): Promise<void> => {

        typesLoading.value = true;

        try {
            types.value = await MaterialType.fetchAll();
        } catch (error) {
            console.error('Error loading types:', error);
            throw error;
        } finally {
            typesLoading.value = false;
        }
    };

    const updateType = async (type: MaterialType): Promise<void> => {
        typesLoading.value = true;

        try {
            await type.update();
            refreshResource();
        } catch (error) {
            console.error('Error updating type:', error);
            throw error;
        } finally {
            typesLoading.value = false;
        }
    };

    const storeType = async (type: MaterialType): Promise<void> => {
        typesLoading.value = true;

        try {
            await MaterialType.store(type);
            refreshResource();
        } catch (error) {
            console.error('Error storing type:', error);
            throw error;
        } finally {
            typesLoading.value = false;
        }
    };

    const deleteType = async (type: MaterialType): Promise<void> => {
        typesLoading.value = true;

        try {
            await type.destroy();
            refreshResource();
        } catch (error) {
            console.error('Error deleting type:', error);
            throw error;
        } finally {
            typesLoading.value = false;
        }
    };

    const refreshResource = async (): Promise<void> => {
        enqueueRefreshResourceTask({
            modelCtor: MaterialType,
            update: (collection) => { types.value = collection; },
            setLoading: (v) => { typesLoading.value = v; },
            title: 'Типы материалов',
            silent: true,
        });
    }


    return {
        types,
        typesLoading,
        loadTypes,
        updateType,
        storeType,
        deleteType,
    };
});