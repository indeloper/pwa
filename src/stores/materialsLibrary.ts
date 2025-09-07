import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useMaterialUnits } from '../composables/useMaterialUnits';
import { useMaterialProperties } from '../composables/useMaterialProperties';
import { useMaterialTypes } from '../composables/useMaterialTypes';
import { useMaterialBrands } from '../composables/useMaterialBrands';
import { useMaterialStandards } from '../composables/useMaterialStandards';
import MaterialUnit from '../models/MaterialUnit';
import type MaterialProperty from '../models/MaterialProperty';
import type MaterialType from '../models/MaterialType';
import type MaterialBrand from '../models/MaterialBrand';
import type MaterialStandard from '../models/MaterialStandard';
import MaterialUnitCollection from '../models/collections/MaterialUnitCollection';
import MaterialPropertyCollection from '../models/collections/MaterialPropertyCollection';
import MaterialTypeCollection from '../models/collections/MaterialTypeCollection';
import MaterialBrandCollection from '../models/collections/MaterialBrandCollection';
import MaterialStandardCollection from '../models/collections/MaterialStandardCollection';
import MaterialUnitService from '@/services/MaterialUnitService';

export const useMaterialsLibraryStore = defineStore('materialsLibrary', () => {
    const unitsLoading = ref(false);
    const units = ref<MaterialUnitCollection>(new MaterialUnitCollection());
    const propertiesLoading = ref(false);
    const properties = ref<MaterialPropertyCollection>(new MaterialPropertyCollection());
    const typesLoading = ref(false);
    const types = ref<MaterialTypeCollection>(new MaterialTypeCollection());
    const brandsLoading = ref(false);
    const brands = ref<MaterialBrandCollection>(new MaterialBrandCollection());
    const standardsLoading = ref(false);
    const standards = ref<MaterialStandardCollection>(new MaterialStandardCollection());
    
    const { fetchProperties: fetchPropertiesApi, updateProperty: updatePropertyApi, storeProperty: storePropertyApi, deleteProperty: deletePropertyApi } = useMaterialProperties();
    const { fetchTypes: fetchTypesApi, updateType: updateTypeApi, storeType: storeTypeApi, deleteType: deleteTypeApi } = useMaterialTypes();
    const { fetchBrands: fetchBrandsApi, updateBrand: updateBrandApi, storeBrand: storeBrandApi, deleteBrand: deleteBrandApi } = useMaterialBrands();
    const { fetchStandards: fetchStandardsApi, updateStandard: updateStandardApi, storeStandard: storeStandardApi, deleteStandard: deleteStandardApi } = useMaterialStandards();

    const loadUnits = async (): Promise<void> => {
        try {
            unitsLoading.value = true;
            units.value = await MaterialUnitService.fetchAll();
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
            await MaterialUnitService.update(unit);
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
            await MaterialUnitService.store(unit);
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
            await MaterialUnitService.destroy(unit);
        } catch (error) {
            console.error('Error deleting unit:', error);
            throw error;
        } finally {
            unitsLoading.value = false;
        }
    };

    // Material Properties
    const loadProperties = async (): Promise<void> => {
        try {
            propertiesLoading.value = true;
            const response = await fetchPropertiesApi();
            properties.value = response;
        } catch (error) {
            console.error('Error loading properties:', error);
        } finally {
            propertiesLoading.value = false;
        }
    };

    const updateProperty = async (property: MaterialProperty): Promise<void> => {
        try {
            await updatePropertyApi(property);
        } catch (error) {
            console.error('Error updating property:', error);
        }
    };

    const storeProperty = async (property: MaterialProperty): Promise<void> => {
        try {
            await storePropertyApi(property);
        } catch (error) {
            console.error('Error storing property:', error);
        }
    };

    const deleteProperty = async (property: MaterialProperty): Promise<void> => {
        try {
            await deletePropertyApi(property);
        } catch (error) {
            console.error('Error deleting property:', error);
        }
    };

    // Material Types
    const loadTypes = async (): Promise<void> => {
        try {
            typesLoading.value = true;
            const response = await fetchTypesApi();
            types.value = response;
        } catch (error) {
            console.error('Error loading types:', error);
        } finally {
            typesLoading.value = false;
        }
    };

    const updateType = async (type: MaterialType): Promise<void> => {
        try {
            await updateTypeApi(type);
        } catch (error) {
            console.error('Error updating type:', error);
        }
    };

    const storeType = async (type: MaterialType): Promise<void> => {
        try {
            await storeTypeApi(type);
        } catch (error) {
            console.error('Error storing type:', error);
        }
    };

    const deleteType = async (type: MaterialType): Promise<void> => {
        try {
            await deleteTypeApi(type);
        } catch (error) {
            console.error('Error deleting type:', error);
        }
    };

    // Material Brands
    const loadBrands = async (): Promise<void> => {
        try {
            brandsLoading.value = true;
            const response = await fetchBrandsApi();
            brands.value = response;
        } catch (error) {
            console.error('Error loading brands:', error);
        } finally {
            brandsLoading.value = false;
        }
    };

    const updateBrand = async (brand: MaterialBrand): Promise<void> => {
        try {
            await updateBrandApi(brand);
        } catch (error) {
            console.error('Error updating brand:', error);
        }
    };

    const storeBrand = async (brand: MaterialBrand): Promise<void> => {
        try {
            await storeBrandApi(brand);
        } catch (error) {
            console.error('Error storing brand:', error);
        }
    };

    const deleteBrand = async (brand: MaterialBrand): Promise<void> => {
        try {
            await deleteBrandApi(brand);
        } catch (error) {
            console.error('Error deleting brand:', error);
        }
    };

    // Material Standards
    const loadStandards = async (): Promise<void> => {
        try {
            standardsLoading.value = true;
            const response = await fetchStandardsApi();
            standards.value = response;
        } catch (error) {
            console.error('Error loading standards:', error);
        } finally {
            standardsLoading.value = false;
        }
    };

    const updateStandard = async (standard: MaterialStandard): Promise<void> => {
        try {
            await updateStandardApi(standard);
        } catch (error) {
            console.error('Error updating standard:', error);
        }
    };

    const storeStandard = async (standard: MaterialStandard): Promise<void> => {
        try {
            await storeStandardApi(standard);
        } catch (error) {
            console.error('Error storing standard:', error);
        }
    };

    const deleteStandard = async (standard: MaterialStandard): Promise<void> => {
        try {
            await deleteStandardApi(standard);
        } catch (error) {
            console.error('Error deleting standard:', error);
        }
    };


    const updatePropertyStore = async (property: MaterialProperty): Promise<void> => {
        try {
            await updateProperty(property);
        } catch (error) {
            console.error('Error updating property:', error);
        }
    };

    const storePropertyStore = async (property: MaterialProperty): Promise<void> => {
        try {
            await storeProperty(property);
        } catch (error) {
            console.error('Error storing property:', error);
        }
    };

    const deletePropertyStore = async (property: MaterialProperty): Promise<void> => {
        try {
            await deleteProperty(property);
        } catch (error) {
            console.error('Error deleting property:', error);
        }
    };

    // Material Types CRUD
    const updateTypeStore = async (type: MaterialType): Promise<void> => {
        try {
            await updateType(type);
        } catch (error) {
            console.error('Error updating type:', error);
        }
    };

    const storeTypeStore = async (type: MaterialType): Promise<void> => {
        try {
            await storeType(type);
        } catch (error) {
            console.error('Error storing type:', error);
        }
    };

    const deleteTypeStore = async (type: MaterialType): Promise<void> => {
        try {
            await deleteType(type);
        } catch (error) {
            console.error('Error deleting type:', error);
        }
    };

    // Material Brands CRUD
    const updateBrandStore = async (brand: MaterialBrand): Promise<void> => {
        try {
            await updateBrand(brand);
        } catch (error) {
            console.error('Error updating brand:', error);
        }
    };

    const storeBrandStore = async (brand: MaterialBrand): Promise<void> => {
        try {
            await storeBrand(brand);
        } catch (error) {
            console.error('Error storing brand:', error);
        }
    };

    const deleteBrandStore = async (brand: MaterialBrand): Promise<void> => {
        try {
            await deleteBrand(brand);
        } catch (error) {
            console.error('Error deleting brand:', error);
        }
    };

    // Material Standards CRUD
    const updateStandardStore = async (standard: MaterialStandard): Promise<void> => {
        try {
            await updateStandard(standard);
        } catch (error) {
            console.error('Error updating standard:', error);
        }
    };

    const storeStandardStore = async (standard: MaterialStandard): Promise<void> => {
        try {
            await storeStandard(standard);
        } catch (error) {
            console.error('Error storing standard:', error);
        }
    };

    const deleteStandardStore = async (standard: MaterialStandard): Promise<void> => {
        try {
            await deleteStandard(standard);
        } catch (error) {
            console.error('Error deleting standard:', error);
        }
    };

    return {
        // States
        units,
        unitsLoading,
        properties,
        propertiesLoading,
        types,
        typesLoading,
        brands,
        brandsLoading,
        standards,
        standardsLoading,
        
        // Load methods
        loadUnits,
        loadProperties,
        loadTypes,
        loadBrands,
        loadStandards,
        
        updateUnit,
        storeUnit,
        deleteUnit,
        
        // Material Properties CRUD
        updatePropertyStore,
        storePropertyStore,
        deletePropertyStore,
        
        // Material Types CRUD
        updateTypeStore,
        storeTypeStore,
        deleteTypeStore,
        
        // Material Brands CRUD
        updateBrandStore,
        storeBrandStore,
        deleteBrandStore,
        
        // Material Standards CRUD
        updateStandardStore,
        storeStandardStore,
        deleteStandardStore,
    };
});
