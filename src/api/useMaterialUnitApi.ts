import { useAuthApi } from "@/composables/useAuthApi";

export interface IMaterialUnitRequest {
    id?: number;
    label: string;
    name: string;
    description: string | null;
}

export function useMaterialUnitApi() {
    const authApi = useAuthApi();

    const fetchUnits = async (id?: number): Promise<any[]> => {
        try {
            const response = await authApi.get(import.meta.env.VITE_API_BASE_URL + '/library/materials/units' + (id ? '/' + id : ''));
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const updateUnit = async (unit: IMaterialUnitRequest): Promise<any> => {
        try {
            const response = await authApi.put(import.meta.env.VITE_API_BASE_URL + '/library/materials/units/' + unit.id, unit);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const storeUnit = async (unit: IMaterialUnitRequest): Promise<any> => {
        try {
            const response = await authApi.post(import.meta.env.VITE_API_BASE_URL + '/library/materials/units', unit);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const deleteUnit = async (unit: IMaterialUnitRequest): Promise<void> => {
        try {
            await authApi.delete(import.meta.env.VITE_API_BASE_URL + '/library/materials/units/' + unit.id);
        } catch (error) {
            throw error;
        }
    };

    return { fetchUnits, updateUnit, storeUnit, deleteUnit };
}
