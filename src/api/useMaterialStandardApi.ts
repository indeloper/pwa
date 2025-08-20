import { useAuthApi } from "@/composables/useAuthApi";
import MaterialStandard from "@/models/MaterialStandard";
import { ModelsTransformStrategies as Strategy } from "@/enums";

export function useMaterialStandardApi() {
    const authApi = useAuthApi();

    const fetchStandards = async (): Promise<any[]> => {
        try {
            const response = await authApi.get(import.meta.env.VITE_API_BASE_URL + '/library/materials/standards');
            return response.data;
        } catch (error) {
            console.error('Error fetching material standards:', error);
            throw error;
        }
    };

    const updateStandard = async (standard: MaterialStandard): Promise<void> => {
        try {
            await authApi.put(import.meta.env.VITE_API_BASE_URL + '/library/materials/standards/' + standard.id, standard);
        } catch (error) {
            console.error('Error updating material standard:', error);
            throw error;
        }
    };

    const storeStandard = async (standard: MaterialStandard): Promise<void> => {
        try {
            const standardRequest = standard.to(Strategy.API_REQUEST);
            await authApi.post(import.meta.env.VITE_API_BASE_URL + '/library/materials/standards', standardRequest);
        } catch (error) {
            console.error('Error storing material standard:', error);
            throw error;
        }
    };

    const deleteStandard = async (standard: MaterialStandard): Promise<void> => {
        try {
            await authApi.delete(import.meta.env.VITE_API_BASE_URL + '/library/materials/standards/' + standard.id);
        } catch (error) {
            console.error('Error deleting material standard:', error);
            throw error;
        }
    };

    return { fetchStandards, updateStandard, storeStandard, deleteStandard };
}
