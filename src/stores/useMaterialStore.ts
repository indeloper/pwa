import { defineStore } from "pinia";
import { ref } from "vue";
import { enqueueRefreshResourceTask } from "@/workers/tasks/refreshResource";
import BaseResourceCollection from "@/models/BaseResourceCollection";
import Material from "@/models/Material";

export const useMaterialStore = defineStore('material', () => { 
    const materialsLoading = ref(false);
    const materials = ref<BaseResourceCollection<any>>(new BaseResourceCollection<any>([]));

    const loadMaterials = async (): Promise<void> => {
        try {
            materialsLoading.value = true;
            materials.value = await Material.fetchAll();
        } catch (error) {
            console.error('Error loading materials:', error);
            throw error;
        } finally {
            materialsLoading.value = false;
        }
    };

    const updateMaterial = async (material: Material): Promise<void> => {
        materialsLoading.value = true;
        try {
            await material.update();

            refreshResource();

        } catch (error) {
            console.error('Error saving warehouse:', error);
            throw error;
        } finally {
            materialsLoading.value = false;
        }
    };

    const storeMaterial = async (material: Material): Promise<void> => {
        materialsLoading.value = true;
        try {
            await Material.store(material);

            refreshResource();

        } catch (error) {
            console.error('Error storing material:', error);
            throw error;
        } finally {
                materialsLoading.value = false;
        }
    };

    const deleteMaterial = async (material: Material): Promise<void> => {
        materialsLoading.value = true;
        try {
            await material.destroy();

            refreshResource();
        } catch (error) {
            console.error('Error deleting material:', error);
            throw error;
        } finally {
            materialsLoading.value = false;
        }
    };

    const refreshResource = async (): Promise<void> => {
        enqueueRefreshResourceTask({
            modelCtor: Material,
            update: (collection) => { materials.value = collection; },
            setLoading: (v) => { materialsLoading.value = v; },
            title: 'Материалы',
            silent: true,
        });
    }

    return {
        materialsLoading,
        materials,
        loadMaterials,
        updateMaterial,
        storeMaterial,
        deleteMaterial,
    };
});