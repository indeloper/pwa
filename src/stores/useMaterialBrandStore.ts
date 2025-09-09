import MaterialBrandCollection from "@/models/collections/MaterialBrandCollection";
import MaterialBrand from "@/models/MaterialBrand";
import { enqueueRefreshResourceTask } from "@/workers/tasks/refreshResource";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMaterialBrandStore = defineStore('materialBrand', () => {

    const brandsLoading = ref(false);
    const brands = ref<MaterialBrandCollection>(new MaterialBrandCollection());


    const loadBrands = async (): Promise<void> => {

        brandsLoading.value = true;

        try {
            brands.value = await MaterialBrand.fetchAll();
        } catch (error) {
            console.error('Error loading brands:', error);
            throw error;
        } finally {
            brandsLoading.value = false;
        }
    };

    const updateBrand = async (brand: MaterialBrand): Promise<void> => {
        brandsLoading.value = true;

        try {
            await brand.update();
            refreshResource();
        } catch (error) {
            console.error('Error updating type:', error);
            throw error;
        } finally {
            brandsLoading.value = false;
        }
    };

    const storeBrand = async (brand: MaterialBrand): Promise<void> => {
        brandsLoading.value = true;

        try {
            await MaterialBrand.store(brand);
            refreshResource();
        } catch (error) {
            console.error('Error storing type:', error);
            throw error;
        } finally {
            brandsLoading.value = false;
        }
    };

    const deleteBrand = async (brand: MaterialBrand): Promise<void> => {
        brandsLoading.value = true;

        try {
            await brand.destroy();
            refreshResource();
        } catch (error) {
            console.error('Error deleting type:', error);
            throw error;
        } finally {
            brandsLoading.value = false;
        }
    };

    const refreshResource = async (): Promise<void> => {
        enqueueRefreshResourceTask({
            modelCtor: MaterialBrand,
            update: (collection) => { brands.value = collection; },
            setLoading: (v) => { brandsLoading.value = v; },
            title: 'Бренды материалов',
            silent: true,
        });
    }


    return {
        brands,
        brandsLoading,
        loadBrands,
        updateBrand,
        storeBrand,
        deleteBrand,
    };
});