import { useMaterialPropertyApi } from "@/api/useMaterialPropertyApi";
import type MaterialPropertyCollection from "@/models/collections/MaterialPropertyCollection";
import MaterialProperty from "@/models/MaterialProperty";
import { ModelsTransformStrategies as Strategy } from "@/enums";

export function useMaterialProperties() {
    const { 
        fetchProperties: fetchPropertiesApi, 
        updateProperty: updatePropertyApi, 
        storeProperty: storePropertyApi, 
        deleteProperty: deletePropertyApi 
    } = useMaterialPropertyApi();

    const fetchProperties = async (): Promise<MaterialPropertyCollection> => {
        const response = await fetchPropertiesApi();
        return MaterialProperty.collect(response, Strategy.API_RESPONSE);
    };

    const updateProperty = async (property: MaterialProperty): Promise<void> => {
        await updatePropertyApi(property);
    };

    const storeProperty = async (property: MaterialProperty): Promise<void> => {
        await storePropertyApi(property);
    };

    const deleteProperty = async (property: MaterialProperty): Promise<void> => {
        await deletePropertyApi(property);
    };

    return { fetchProperties, updateProperty, storeProperty, deleteProperty };
}
