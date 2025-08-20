import { useMaterialStandardApi } from "@/api/useMaterialStandardApi";
import type MaterialStandardCollection from "@/models/collections/MaterialStandardCollection";
import MaterialStandard from "@/models/MaterialStandard";
import { ModelsTransformStrategies as Strategy } from "@/enums";

export function useMaterialStandards() {
    const { 
        fetchStandards: fetchStandardsApi, 
        updateStandard: updateStandardApi, 
        storeStandard: storeStandardApi, 
        deleteStandard: deleteStandardApi 
    } = useMaterialStandardApi();

    const fetchStandards = async (): Promise<MaterialStandardCollection> => {
        const response = await fetchStandardsApi();
        return MaterialStandard.collect(response, Strategy.API_RESPONSE);
    };

    const updateStandard = async (standard: MaterialStandard): Promise<void> => {
        await updateStandardApi(standard);
    };

    const storeStandard = async (standard: MaterialStandard): Promise<void> => {
        await storeStandardApi(standard);
    };

    const deleteStandard = async (standard: MaterialStandard): Promise<void> => {
        await deleteStandardApi(standard);
    };

    return { fetchStandards, updateStandard, storeStandard, deleteStandard };
}
