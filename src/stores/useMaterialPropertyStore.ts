
import BaseResourceCollection from "@/models/BaseResourceCollection";
import MaterialProperty from "@/models/MaterialProperty";
import { enqueueRefreshResourceTask } from "@/workers/tasks/refreshResource";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMaterialPropertyStore = defineStore('materialProperty', () => {

    const propertiesLoading = ref(false);
    const properties = ref<BaseResourceCollection<any>>(new BaseResourceCollection<any>([]));


    const loadProperties = async (): Promise<void> => {

        propertiesLoading.value = true;

        try {
            properties.value = await MaterialProperty.fetchAll();
        } catch (error) {
            console.error('Error loading properties:', error);
            throw error;
        } finally {
            propertiesLoading.value = false;
        }
    };

    const updateProperty = async (property: MaterialProperty): Promise<void> => {
        propertiesLoading.value = true;

        try {
            await property.update();
            refreshResource();
        } catch (error) {
            console.error('Error updating type:', error);
            throw error;
        } finally {
            propertiesLoading.value = false;
        }
    };

    const storeProperty = async (property: MaterialProperty): Promise<void> => {
        propertiesLoading.value = true;

        try {
            await MaterialProperty.store(property);
            refreshResource();
        } catch (error) {
            console.error('Error storing type:', error);
            throw error;
        } finally {
            propertiesLoading.value = false;
        }
    };

    const deleteProperty = async (property: MaterialProperty): Promise<void> => {
        propertiesLoading.value = true;

        try {
            await property.destroy();
            refreshResource();
        } catch (error) {
            console.error('Error deleting type:', error);
            throw error;
        } finally {
            propertiesLoading.value = false;
        }
    };

    const refreshResource = async (): Promise<void> => {
        enqueueRefreshResourceTask({
            modelCtor: MaterialProperty,
            update: (collection) => { properties.value = collection; },
            setLoading: (v) => { propertiesLoading.value = v; },
            title: 'Свойства материалов',
            silent: true,
        });
    }


    return {
        properties,
        propertiesLoading,
        loadProperties,
        updateProperty,
        storeProperty,
        deleteProperty,
    };
});