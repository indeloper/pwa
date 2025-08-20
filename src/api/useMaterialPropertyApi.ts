import { useAuthApi } from "@/composables/useAuthApi";
import MaterialProperty from "@/models/MaterialProperty";
import { ModelsTransformStrategies as Strategy } from "@/enums";

export function useMaterialPropertyApi() {
    const authApi = useAuthApi();

    const fetchProperties = async (): Promise<any[]> => {
        try {
            const response = await authApi.get(import.meta.env.VITE_API_BASE_URL + '/library/materials/properties');
            return response.data;
        } catch (error) {
            console.error('Error fetching material properties:', error);
            throw error;
        }
    };

    const updateProperty = async (property: MaterialProperty): Promise<void> => {
        try {
            await authApi.put(import.meta.env.VITE_API_BASE_URL + '/library/materials/properties/' + property.id, property);
        } catch (error) {
            console.error('Error updating material property:', error);
            throw error;
        }
    };

    const storeProperty = async (property: MaterialProperty): Promise<void> => {
        try {
            const propertyRequest = property.to(Strategy.API_REQUEST);
            await authApi.post(import.meta.env.VITE_API_BASE_URL + '/library/materials/properties', propertyRequest);
        } catch (error) {
            console.error('Error storing material property:', error);
            throw error;
        }
    };

    const deleteProperty = async (property: MaterialProperty): Promise<void> => {
        try {
            await authApi.delete(import.meta.env.VITE_API_BASE_URL + '/library/materials/properties/' + property.id);
        } catch (error) {
            console.error('Error deleting material property:', error);
            throw error;
        }
    };

    return { fetchProperties, updateProperty, storeProperty, deleteProperty };
}
