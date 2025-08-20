import { useMaterialTypeApi } from "@/api/useMaterialTypeApi";
import type MaterialTypeCollection from "@/models/collections/MaterialTypeCollection";
import MaterialType from "@/models/MaterialType";
import { ModelsTransformStrategies as Strategy } from "@/enums";

export function useMaterialTypes() {
    const { 
        fetchTypes: fetchTypesApi, 
        updateType: updateTypeApi, 
        storeType: storeTypeApi, 
        deleteType: deleteTypeApi 
    } = useMaterialTypeApi();

    const fetchTypes = async (): Promise<MaterialTypeCollection> => {
        const response = await fetchTypesApi();
        const collection = MaterialType.collect(response, Strategy.API_RESPONSE);
        console.log(collection, 'collection');
        
        return collection;
    };

    const updateType = async (type: MaterialType): Promise<void> => {
        await updateTypeApi(type);
    };

    const storeType = async (type: MaterialType): Promise<void> => {
        await storeTypeApi(type);
    };

    const deleteType = async (type: MaterialType): Promise<void> => {
        await deleteTypeApi(type);
    };

    return { fetchTypes, updateType, storeType, deleteType };
}
