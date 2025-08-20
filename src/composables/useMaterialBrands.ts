import { useMaterialBrandApi } from "@/api/useMaterialBrandApi";
import type MaterialBrandCollection from "@/models/collections/MaterialBrandCollection";
import MaterialBrand from "@/models/MaterialBrand";
import { ModelsTransformStrategies as Strategy } from "@/enums";

export function useMaterialBrands() {
    const { 
        fetchBrands: fetchBrandsApi, 
        updateBrand: updateBrandApi, 
        storeBrand: storeBrandApi, 
        deleteBrand: deleteBrandApi 
    } = useMaterialBrandApi();

    const fetchBrands = async (): Promise<MaterialBrandCollection> => {
        const response = await fetchBrandsApi();
        return MaterialBrand.collect(response, Strategy.API_RESPONSE);
    };

    const updateBrand = async (brand: MaterialBrand): Promise<void> => {
        await updateBrandApi(brand);
    };

    const storeBrand = async (brand: MaterialBrand): Promise<void> => {
        await storeBrandApi(brand);
    };

    const deleteBrand = async (brand: MaterialBrand): Promise<void> => {
        await deleteBrandApi(brand);
    };

    return { fetchBrands, updateBrand, storeBrand, deleteBrand };
}
