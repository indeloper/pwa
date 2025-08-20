import type { MaterialBrandRequest, MaterialBrandResponse } from "../../types/materials";
import MaterialBrand from "../MaterialBrand";
import { MaterialTypeAdapter } from "./MaterialTypeAdapter";
import MaterialBrandCollection from "../collections/MaterialBrandCollection";

export class MaterialBrandAdapter {
    static adapt(data: MaterialBrandResponse): MaterialBrand {
        return new MaterialBrand({
            id: data.id,
            name: data.attributes.name,
            description: data.attributes.description,
            weight: data.attributes.weight,
            material_type: MaterialTypeAdapter.adapt(data.relationships.material_type)
        });
    }

    static adaptToRequest(data: MaterialBrand): MaterialBrandRequest {
        return {
            id: data.id || 0,
            name: data.name,
            description: data.description,
            weight: data.weight,
            material_type_id: data.material_type.id
        };
    }

    static adaptCollection(data: MaterialBrandResponse[]): MaterialBrandCollection {
        const materialBrands = data.map(item => this.adapt(item));
        return new MaterialBrandCollection(materialBrands);
    }

    // Метод для создания коллекции из одного элемента (для консистентности)
    static adaptToCollection(data: MaterialBrandResponse): MaterialBrandCollection {
        return new MaterialBrandCollection([this.adapt(data)]);
    }

    // Устаревший метод для обратной совместимости
    static adaptCollectionForRelationships(data: MaterialBrandResponse[]): MaterialBrand[] {
        return data.map(item => this.adapt(item));
    }
}
