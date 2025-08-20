import { useAuthApi } from "@/composables/useAuthApi";
import MaterialType from "@/models/MaterialType";
import { ModelsTransformStrategies as Strategy } from "@/enums";

export function useMaterialTypeApi() {
    const authApi = useAuthApi();

    const fetchTypes = async (): Promise<any[]> => {
        try {
            const response = await authApi.get(import.meta.env.VITE_API_BASE_URL + '/library/materials/types');
            return response.data;
        } catch (error) {
            console.error('Error fetching material types:', error);
            throw error;
        }
    };

    const updateType = async (type: MaterialType): Promise<void> => {
        try {
            await authApi.put(import.meta.env.VITE_API_BASE_URL + '/library/materials/types/' + type.id, type);
        } catch (error) {
            console.error('Error updating material type:', error);
            throw error;
        }
    };

    const storeType = async (type: MaterialType): Promise<void> => {
        try {
            const typeRequest = type.to(Strategy.API_REQUEST);
            await authApi.post(import.meta.env.VITE_API_BASE_URL + '/library/materials/types', typeRequest);
        } catch (error) {
            console.error('Error storing material type:', error);
            throw error;
        }
    };

    const deleteType = async (type: MaterialType): Promise<void> => {
        try {
            await authApi.delete(import.meta.env.VITE_API_BASE_URL + '/library/materials/types/' + type.id);
        } catch (error) {
            console.error('Error deleting material type:', error);
            throw error;
        }
    };

    return { fetchTypes, updateType, storeType, deleteType };
}
