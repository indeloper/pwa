import { defineStore } from "pinia";
import { ref } from "vue";
import MaterialUnitCollection from "@/models/collections/MaterialUnitCollection";
import MaterialUnit from "@/models/MaterialUnit";
import BaseResourceService from "@/services/BaseResourceService";
import { enqueueRefreshResourceTask } from "@/workers/tasks/refreshResource";

export const useMaterialUnitStore = defineStore('materialUnit', () => {
    const unitsLoading = ref(false);
    const units = ref<MaterialUnitCollection>(new MaterialUnitCollection());

    const loadUnits = async (): Promise<void> => {
        try {
            unitsLoading.value = true;
            units.value = await MaterialUnit.fetchAll();
        } catch (error) {
            console.error('Error loading units:', error);
            throw error;
        } finally {
            unitsLoading.value = false;
        }
    };

    const updateUnit = async (unit: MaterialUnit): Promise<void> => {
        unitsLoading.value = true;
        try {
            await unit.update();

            refreshResource();

        } catch (error) {
            console.error('Error saving unit:', error);
            throw error;
        } finally {
            unitsLoading.value = false;
        }
    };

    const storeUnit = async (unit: MaterialUnit): Promise<void> => {
        unitsLoading.value = true;
        try {
            await MaterialUnit.store(unit);

            refreshResource();

        } catch (error) {
            console.error('Error storing unit:', error);
            throw error;
        } finally {
            unitsLoading.value = false;
        }
    };

    const deleteUnit = async (unit: MaterialUnit): Promise<void> => {
        unitsLoading.value = true;
        try {
            await unit.destroy();

            refreshResource();
        } catch (error) {
            console.error('Error deleting unit:', error);
            throw error;
        } finally {
            unitsLoading.value = false;
        }
    };

    const refreshResource = async (): Promise<void> => {
        enqueueRefreshResourceTask({
            modelCtor: MaterialUnit,
            update: (collection) => { units.value = collection; },
            setLoading: (v) => { unitsLoading.value = v; },
            title: 'Единицы измерения',
            silent: true,
        });
    }

    return {
        unitsLoading,
        units,
        loadUnits,
        updateUnit,
        storeUnit,
        deleteUnit,
    };
});