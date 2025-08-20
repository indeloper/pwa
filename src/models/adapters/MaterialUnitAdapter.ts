import type { MaterialUnitResponse } from "../../types/materials";
import MaterialUnit, { type IMaterialUnit } from "../MaterialUnit";
import MaterialUnitCollection from "../collections/MaterialUnitCollection";

export class MaterialUnitAdapter {
    static adapt(data: MaterialUnitResponse): MaterialUnit {
        return new MaterialUnit({
            id: data.id,
            label: data.attributes.label,
            name: data.attributes.name,
            description: data.attributes.description,
        });
    }

    static adaptCollection(data: MaterialUnitResponse[]): MaterialUnitCollection {
        const materialUnits = data.map(item => this.adapt(item));
        return new MaterialUnitCollection(materialUnits);
    }

    static adaptCollectionForRelationships(data: MaterialUnitResponse[]): MaterialUnit[] {
        return data.map(item => this.adapt(item));
    }

    // Метод для создания коллекции из одного элемента (для консистентности)
    static adaptToCollection(data: MaterialUnitResponse): MaterialUnitCollection {
        return new MaterialUnitCollection([this.adapt(data)]);
    }
}
