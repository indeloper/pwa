import type { MaterialStandardResponse } from "../../types/materials";
import MaterialStandard from "../MaterialStandard";
import { MaterialTypeAdapter } from "./MaterialTypeAdapter";
import { MaterialBrandAdapter } from "./MaterialBrandAdapter";
import { MaterialPropertyAdapter } from "./MaterialPropertyAdapter";
import MaterialStandardCollection from "../collections/MaterialStandardCollection";

export class MaterialStandardAdapter {
    static adapt(data: MaterialStandardResponse): MaterialStandard {
        return new MaterialStandard({
            id: data.id,
            name: data.attributes.name,
            description: data.attributes.description,
            old_standard_id: data.attributes.old_standard_id,
            material_type: data.relationships.material_type 
                ? MaterialTypeAdapter.adapt(data.relationships.material_type)
                : undefined,
            material_brand: data.relationships.material_brand 
                ? MaterialBrandAdapter.adapt(data.relationships.material_brand)
                : undefined,
            material_brands: data.relationships.material_brands 
                ? MaterialBrandAdapter.adaptCollection(data.relationships.material_brands)
                : undefined,
            properties: data.relationships.properties 
                ? MaterialPropertyAdapter.adaptCollection(data.relationships.properties)
                : undefined,
            alternative_standards: data.relationships.alternative_standards 
                ? data.relationships.alternative_standards.map(item => this.adapt(item))
                : undefined,
        });
    }

    static adaptCollection(data: MaterialStandardResponse[]): MaterialStandardCollection {
        const materialStandards = data.map(item => this.adapt(item));
        return new MaterialStandardCollection(materialStandards);
    }

    // Метод для создания коллекции из одного элемента (для консистентности)
    static adaptToCollection(data: MaterialStandardResponse): MaterialStandardCollection {
        return new MaterialStandardCollection([this.adapt(data)]);
    }

    // Устаревший метод для обратной совместимости
    static adaptCollectionForRelationships(data: MaterialStandardResponse[]): MaterialStandard[] {
        return data.map(item => this.adapt(item));
    }
}
