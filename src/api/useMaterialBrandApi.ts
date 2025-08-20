import { useAuthApi } from "@/composables/useAuthApi";
import MaterialBrand from "@/models/MaterialBrand";
import { ModelsTransformStrategies as Strategy } from "@/enums";

export interface IMaterialBrandRequest {}

export function useMaterialBrandApi() {

    const authApi = useAuthApi();

    const fetchBrands = async (): Promise<any[]> => {
        try {
            const response = await authApi.get(import.meta.env.VITE_API_BASE_URL + '/library/materials/brands');
            console.log('Material brands response:', response);
            return response.data;
        } catch (error) {
            console.error('Error fetching material brands:', error);
            throw error;
        }
    };

    const updateBrand = async (brand: MaterialBrand): Promise<void> => {
        try {
            await authApi.put(import.meta.env.VITE_API_BASE_URL + '/library/materials/brands/' + brand.id, brand);
        } catch (error) {
            console.error('Error updating material brand:', error);
            throw error;
        }
    };

    const storeBrand = async (brand: MaterialBrand): Promise<void> => {
        try {
            const brandRequest = brand.to(Strategy.API_REQUEST);
            await authApi.post(import.meta.env.VITE_API_BASE_URL + '/library/materials/brands', brandRequest);
        } catch (error) {
            console.error('Error storing material brand:', error);
            throw error;
        }
    };

    const deleteBrand = async (brand: MaterialBrand): Promise<void> => {
        try {
            await authApi.delete(import.meta.env.VITE_API_BASE_URL + '/library/materials/brands/' + brand.id);
        } catch (error) {
            console.error('Error deleting material brand:', error);
            throw error;
        }
    };

    return { fetchBrands, updateBrand, storeBrand, deleteBrand };
}