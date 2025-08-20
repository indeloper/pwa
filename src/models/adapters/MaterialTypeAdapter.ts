import type { MaterialTypeResponse } from "../../types/materials";
import MaterialType from "../MaterialType";
import { MaterialUnitAdapter } from "./MaterialUnitAdapter";
import { MaterialPropertyAdapter } from "./MaterialPropertyAdapter";
import MaterialTypeCollection from "../collections/MaterialTypeCollection";

export class MaterialTypeAdapter {
    static adapt(data: MaterialTypeResponse): MaterialType {
        return new MaterialType({
            id: data.id,
            name: data.attributes.name,
            unit_id: data.attributes.unit_id,
            fixed_quantity: data.attributes.fixed_quantity,
            description: data.attributes.description,
            instruction: data.attributes.instruction,
            material_unit: data.relationships.material_unit 
                ? MaterialUnitAdapter.adapt(data.relationships.material_unit)
                : undefined,
            properties: data.relationships.properties 
                ? MaterialPropertyAdapter.adaptCollection(data.relationships.properties)
                : undefined,
        });
    }

    static adaptCollection(data: MaterialTypeResponse[]): MaterialTypeCollection {
        const materialTypes = data.map(item => this.adapt(item));
        return new MaterialTypeCollection(materialTypes);
    }

    // Метод для создания коллекции из одного элемента (для консистентности)
    static adaptToCollection(data: MaterialTypeResponse): MaterialTypeCollection {
        return new MaterialTypeCollection([this.adapt(data)]);
    }
}
