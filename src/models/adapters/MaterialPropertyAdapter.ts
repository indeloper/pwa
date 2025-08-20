import type { MaterialPropertyResponse } from "../../types/materials";
import MaterialProperty from "../MaterialProperty";
import MaterialPropertyCollection from "../collections/MaterialPropertyCollection";

export class MaterialPropertyAdapter {
    static adapt(data: MaterialPropertyResponse): MaterialProperty {
        return new MaterialProperty({
            id: data.id,
            name: data.attributes.name,
            description: data.attributes.description,
            weight_factor: data.attributes.weight_factor,
        });
    }

    static adaptCollection(data: MaterialPropertyResponse[]): MaterialPropertyCollection {
        const materialProperties = data.map(item => this.adapt(item));
        return new MaterialPropertyCollection(materialProperties);
    }

    static adaptCollectionForRelationships(data: MaterialPropertyResponse[]): MaterialProperty[] {
        return data.map(item => this.adapt(item));
    }

    // Метод для создания коллекции из одного элемента (для консистентности)
    static adaptToCollection(data: MaterialPropertyResponse): MaterialPropertyCollection {
        return new MaterialPropertyCollection([this.adapt(data)]);
    }
}
